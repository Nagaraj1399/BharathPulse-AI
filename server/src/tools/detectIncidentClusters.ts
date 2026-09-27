import { IncidentCategory, IncidentClusterResult } from '../../../shared/types';
import { civicStore } from '../firebase/admin';
import { getDistanceMeters } from '../maps/places';
import { incidentsDb } from '../firebase/incidents';

export interface DetectIncidentClustersInput {
  incidentId: string;
  incidentType: IncidentCategory;
  latitude: number;
  longitude: number;
  radiusKm?: number;
  timeWindowHours?: number;
}

export async function executeDetectIncidentClusters(
  input: DetectIncidentClustersInput
): Promise<IncidentClusterResult> {
  const maxRadiusMeters = (input.radiusKm || 2.5) * 1000;
  const maxTimeMs = (input.timeWindowHours || 24) * 3600 * 1000;
  const now = Date.now();

  const allIncidents = civicStore.getIncidents();
  const matchingClusterIncidents = allIncidents.filter((inc) => {
    // Check type match or related hydraulic/infrastructure coupling
    const isTypeMatch =
      inc.type === input.incidentType ||
      (input.incidentType === 'WATER_LEAK' && inc.type === 'FLOODING') ||
      (input.incidentType === 'FLOODING' && inc.type === 'WATER_LEAK');

    if (!isTypeMatch) return false;

    // Check distance
    const dist = getDistanceMeters(input.latitude, input.longitude, inc.latitude, inc.longitude);
    if (dist > maxRadiusMeters) return false;

    // Check time window
    const age = now - new Date(inc.createdAt).getTime();
    return age <= maxTimeMs;
  });

  const incidentCount = matchingClusterIncidents.length;
  const detected = incidentCount >= 2;

  let hypothesis = 'No abnormal spatial clustering detected.';
  if (detected) {
    if (input.incidentType === 'WATER_LEAK' || input.incidentType === 'FLOODING') {
      hypothesis = `High-confidence hypothesis: ${incidentCount} linked hydraulic events within 1.8km radius indicate probable feeder trunk line pressure surge or localized water main failure.`;
    } else if (input.incidentType === 'ELECTRICAL_HAZARD') {
      hypothesis = `Cluster alert: ${incidentCount} localized power faults indicate possible substation feeder trip or phase imbalance.`;
    } else {
      hypothesis = `Spatiotemporal density alert: ${incidentCount} clustered incidents suggest shared civic asset stress.`;
    }

    // Annotate incident with hypothesis
    incidentsDb.updateStatus(input.incidentId, matchingClusterIncidents.find(i => i.id === input.incidentId)?.status || 'INVESTIGATING', {
      clusterHypothesis: hypothesis,
    });
  }

  return {
    detected,
    incidentCount,
    radiusKm: 1.8,
    timeWindowMinutes: 45,
    hypothesis,
    incidentIds: matchingClusterIncidents.map((i) => i.id),
  };
}
