import { IncidentCategory, IncidentSeverity, ResponseTeam } from '../../../shared/types';
import { civicStore } from '../firebase/admin';
import { getDistanceMeters } from '../maps/places';

export interface FindAvailableResponseTeamsInput {
  incidentType: IncidentCategory;
  latitude: number;
  longitude: number;
  severity: IncidentSeverity;
}

export interface RankedTeam {
  team: ResponseTeam;
  department: string;
  distanceKm: number;
  availability: string;
  capabilities: string[];
  currentLoad: number;
  objectiveScore: number;
  estimatedArrivalMinutes: number;
}

export interface FindAvailableResponseTeamsOutput {
  availableCount: number;
  recommendedTeam: RankedTeam | null;
  candidateTeams: RankedTeam[];
}

export async function executeFindAvailableResponseTeams(
  input: FindAvailableResponseTeamsInput
): Promise<FindAvailableResponseTeamsOutput> {
  const allTeams = civicStore.getTeams();

  // Objective capability keyword mapping
  const typeCapabilities: Record<IncidentCategory, string[]> = {
    WATER_LEAK: ['Water', 'Pipeline', 'Pumping', 'Valve'],
    FLOODING: ['Drainage', 'Flood', 'Dewatering', 'Culvert'],
    ROAD_DAMAGE: ['Pothole', 'Asphalt', 'Roads', 'Barricading'],
    GARBAGE_OVERFLOW: ['Solid Waste', 'Sweepers', 'Debris', 'Compactor'],
    FALLEN_TREE: ['Tree', 'Crane', 'Forest', 'Rescue'],
    ELECTRICAL_HAZARD: ['Voltage', 'Transformer', 'Power', 'Wire'],
    FIRE_RISK: ['Fire', 'Rescue', 'Extinguisher'],
    TRAFFIC_OBSTRUCTION: ['Traffic', 'Towing', 'Diversion'],
    HEAT_EMERGENCY: ['Medical', 'Rescue', 'Health'],
    AIR_QUALITY: ['Fire', 'Pollution', 'Marshal'],
    CYBERSECURITY: ['Cyber', 'Digital', 'Fraud', 'Phishing', 'Emergency'],
    OTHER: ['Emergency', 'Operations', 'Unit'],
  };

  const requiredTerms = typeCapabilities[input.incidentType] || ['Emergency'];

  const ranked: RankedTeam[] = allTeams
    .map((team) => {
      const distMeters = getDistanceMeters(team.latitude, team.longitude, input.latitude, input.longitude);
      const distanceKm = parseFloat((distMeters / 1000).toFixed(1));

      // Capability Match Score (0 - 40 points)
      const matches = team.capabilities.filter((cap: string) =>
        requiredTerms.some((term) => cap.toLowerCase().includes(term.toLowerCase()))
      ).length;
      const capabilityScore = Math.min(40, matches * 20);

      // Availability Score (0 - 30 points)
      const availabilityScore = team.availability === 'AVAILABLE' ? 30 : 5;

      // Distance Proximity Score (0 - 20 points, decay by km)
      const distanceScore = Math.max(0, 20 - distanceKm * 2);

      // Load Penalization Score (0 - 10 points)
      const loadScore = Math.max(0, 10 - team.currentLoad * 5);

      const objectiveScore = Math.round(capabilityScore + availabilityScore + distanceScore + loadScore);

      // Realistic travel time in city traffic (speed ~ 20km/h)
      const estimatedArrivalMinutes = Math.max(4, Math.round((distanceKm / 20) * 60) + 2);

      return {
        team: {
          ...team,
          distanceKm,
          etaMinutes: estimatedArrivalMinutes,
        },
        department: team.department,
        distanceKm,
        availability: team.availability,
        capabilities: team.capabilities,
        currentLoad: team.currentLoad,
        objectiveScore,
        estimatedArrivalMinutes,
      };
    })
    .sort((a, b) => b.objectiveScore - a.objectiveScore);

  return {
    availableCount: ranked.filter((t) => t.availability === 'AVAILABLE').length,
    recommendedTeam: ranked.length > 0 ? ranked[0] : null,
    candidateTeams: ranked.slice(0, 4),
  };
}
