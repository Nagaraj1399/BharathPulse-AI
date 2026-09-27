import { CriticalFacility } from '../../../shared/types';
import { civicStore } from '../firebase/admin';

// Haversine distance in meters
export function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export async function searchNearbyCriticalPlaces(
  lat: number,
  lng: number,
  radiusMeters = 2500
): Promise<CriticalFacility[]> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY;

  if (apiKey) {
    try {
      // Modern Places API (New) endpoint conforming to GMP guidelines
      const res = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.primaryType,places.location,places.formattedAddress',
        },
        body: JSON.stringify({
          includedTypes: ['school', 'hospital', 'transit_station'],
          maxResultCount: 5,
          locationRestriction: {
            circle: {
              center: { latitude: lat, longitude: lng },
              radius: radiusMeters,
            },
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.places && data.places.length > 0) {
          return data.places.map((place: any, index: number) => {
            const pLat = place.location?.latitude || lat;
            const pLng = place.location?.longitude || lng;
            const dist = getDistanceMeters(lat, lng, pLat, pLng);
            const pType = place.primaryType || '';
            return {
              id: place.id || `PLACE-${index}`,
              name: place.displayName?.text || 'Civic Infrastructure Facility',
              type: pType.includes('school')
                ? 'school'
                : pType.includes('hospital')
                ? 'hospital'
                : pType.includes('transit') || pType.includes('metro')
                ? 'metro_station'
                : 'public_facility',
              latitude: pLat,
              longitude: pLng,
              vicinity: place.formattedAddress || 'Bengaluru Urban Sector',
              distanceMeters: dist,
              riskRelevance: `Located ${dist}m from incident site. Vulnerable to disruptions.`,
            };
          });
        }
      }
    } catch (e) {
      console.warn('Google Places API call failed, falling back to local critical facilities index:', e);
    }
  }

  // Fallback to seeded critical facilities in Bengaluru
  const allFacilities = civicStore.getFacilities();
  return allFacilities
    .map((fac) => {
      const dist = getDistanceMeters(lat, lng, fac.latitude, fac.longitude);
      let riskRelevance = '';
      if (fac.type === 'school') {
        riskRelevance = `Immediate child safety concern: pedestrian hazard and student commute disruption within ${dist}m.`;
      } else if (fac.type === 'hospital') {
        riskRelevance = `Emergency care risk: potential delay to ambulance transit corridor within ${dist}m.`;
      } else if (fac.type === 'metro_station') {
        riskRelevance = `Mass transit risk: commuter pedestrian choke point within ${dist}m.`;
      } else {
        riskRelevance = `Public facility situated within ${dist}m of active hazard perimeter.`;
      }

      return {
        ...fac,
        distanceMeters: dist,
        riskRelevance,
      };
    })
    .filter((fac) => fac.distanceMeters! <= radiusMeters)
    .sort((a, b) => (a.distanceMeters || 0) - (b.distanceMeters || 0));
}
