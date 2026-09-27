import { calculateResponseRoute } from '../maps/routes';
import { RouteResult } from '../../../shared/types';

export interface CalculateResponseRouteInput {
  originLat: number;
  originLng: number;
  destLat: number;
  destLng: number;
  teamId?: string;
  incidentId?: string;
}

export async function executeCalculateResponseRoute(
  input: CalculateResponseRouteInput
): Promise<RouteResult> {
  return await calculateResponseRoute(
    input.originLat,
    input.originLng,
    input.destLat,
    input.destLng
  );
}
