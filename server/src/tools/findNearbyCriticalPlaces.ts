import { CriticalFacility } from '../../../shared/types';
import { searchNearbyCriticalPlaces } from '../maps/places';

export interface FindNearbyCriticalPlacesInput {
  latitude: number;
  longitude: number;
  radiusMeters?: number;
}

export interface FindNearbyCriticalPlacesOutput {
  facilitiesFound: number;
  closestFacility: CriticalFacility | null;
  facilities: CriticalFacility[];
  highRiskFacilitiesPresent: boolean;
}

export async function executeFindNearbyCriticalPlaces(
  input: FindNearbyCriticalPlacesInput
): Promise<FindNearbyCriticalPlacesOutput> {
  const radius = input.radiusMeters || 2000;
  const facilities = await searchNearbyCriticalPlaces(input.latitude, input.longitude, radius);

  const closestFacility = facilities.length > 0 ? facilities[0] : null;
  const highRiskFacilitiesPresent = facilities.some(
    (f) => (f.distanceMeters || 0) < 500 && (f.type === 'school' || f.type === 'hospital')
  );

  return {
    facilitiesFound: facilities.length,
    closestFacility,
    facilities,
    highRiskFacilitiesPresent,
  };
}
