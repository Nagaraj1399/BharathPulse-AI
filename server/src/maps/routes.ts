import { RouteResult } from '../../../shared/types';
import { getDistanceMeters } from './places';

export async function calculateResponseRoute(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number
): Promise<RouteResult> {
  if (
    typeof originLat !== 'number' ||
    typeof originLng !== 'number' ||
    typeof destLat !== 'number' ||
    typeof destLng !== 'number' ||
    isNaN(originLat) ||
    isNaN(originLng) ||
    isNaN(destLat) ||
    isNaN(destLng)
  ) {
    throw new Error('Invalid geographic coordinates provided for route calculation');
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY;

  if (apiKey) {
    try {
      const response = await fetch(
        'https://routes.googleapis.com/directions/v2:computeRoutes',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline',
          },
          body: JSON.stringify({
            origin: { location: { latLng: { latitude: originLat, longitude: originLng } } },
            destination: { location: { latLng: { latitude: destLat, longitude: destLng } } },
            travelMode: 'DRIVE',
            routingPreference: 'TRAFFIC_AWARE_OPTIMAL',
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const distKm = parseFloat(((route.distanceMeters || 2000) / 1000).toFixed(1));
          const durationSec = parseInt(route.duration?.replace('s', '') || '480', 10);
          const durationMinutes = Math.max(1, Math.round(durationSec / 60));

          return {
            distanceKm: distKm,
            durationMinutes,
            trafficStatus: durationMinutes > 15 ? 'HEAVY' : durationMinutes > 8 ? 'MODERATE' : 'NORMAL',
            polyline: route.polyline?.encodedPolyline,
            coordinates: [
              [originLat, originLng],
              [(originLat + destLat) / 2 + 0.001, (originLng + destLng) / 2 - 0.001],
              [destLat, destLng],
            ],
            isSimulated: false,
          };
        }
      }
    } catch (err) {
      console.warn('Google Routes API request failed, falling back to realistic simulated routing:', err);
    }
  }

  // Realistic Urban Route Simulation (Bengaluru City Speed 18-24 km/h with traffic)
  const distMeters = getDistanceMeters(originLat, originLng, destLat, destLng);
  // Add 25% urban road winding factor
  const roadDistanceKm = parseFloat(((distMeters * 1.25) / 1000).toFixed(1));
  const avgCitySpeedKmh = 19; // Typical Bengaluru peak traffic speed
  const calculatedMinutes = Math.max(3, Math.round((roadDistanceKm / avgCitySpeedKmh) * 60));

  // Synthesize realistic intermediate waypoints along road grid
  const steps = 6;
  const coordinates: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const fraction = i / steps;
    // Add realistic road curve perturbation
    const curve = Math.sin(fraction * Math.PI) * 0.0018;
    const lat = originLat + (destLat - originLat) * fraction + curve;
    const lng = originLng + (destLng - originLng) * fraction - curve * 0.5;
    coordinates.push([parseFloat(lat.toFixed(6)), parseFloat(lng.toFixed(6))]);
  }

  return {
    distanceKm: roadDistanceKm,
    durationMinutes: calculatedMinutes,
    trafficStatus: calculatedMinutes > 12 ? 'HEAVY' : calculatedMinutes > 6 ? 'MODERATE' : 'NORMAL',
    coordinates,
    isSimulated: true,
  };
}
