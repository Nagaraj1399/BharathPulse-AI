import { incidentsDb } from '../firebase/incidents';
import { actionsDb } from '../firebase/actions';
import { teamsDb } from '../firebase/teams';

export interface GenerateIncidentReportInput {
  incidentId: string;
}

export interface GenerateIncidentReportOutput {
  reportId: string;
  incidentId: string;
  generatedAt: string;
  executiveSummary: string;
  timeline: { time: string; event: string }[];
  metrics: {
    totalDurationMinutes: number;
    teamDispatched: string;
    criticalFacilitiesProtected: number;
    clusterRiskIdentified: boolean;
  };
}

export async function executeGenerateIncidentReport(
  input: GenerateIncidentReportInput
): Promise<GenerateIncidentReportOutput> {
  const incident = incidentsDb.getById(input.incidentId);
  const actions = actionsDb.getActions(input.incidentId);
  const team = incident?.assignedTeamId ? teamsDb.getById(incident.assignedTeamId) : null;

  const reportId = `REP-${input.incidentId}-${Date.now().toString().slice(-4)}`;
  const now = new Date().toISOString();

  const timeline = actions.map((a) => ({
    time: a.timestamp,
    event: `${a.tool}: ${a.summary}`,
  }));

  const createdTime = incident ? new Date(incident.createdAt).getTime() : Date.now();
  const resolvedTime = incident?.resolvedAt ? new Date(incident.resolvedAt).getTime() : Date.now();
  const totalDurationMinutes = Math.max(1, Math.round((resolvedTime - createdTime) / 60000));

  return {
    reportId,
    incidentId: input.incidentId,
    generatedAt: now,
    executiveSummary: `Incident ${input.incidentId} (${incident?.type || 'CIVIC_HAZARD'}) was registered and coordinated through BharatPulse AI autonomous response system. ${incident?.status === 'RESOLVED' ? 'Successfully resolved with verified field evidence.' : 'Currently active under municipal monitoring.'}`,
    timeline,
    metrics: {
      totalDurationMinutes,
      teamDispatched: team ? team.name : incident?.assignedTeamName || 'Unassigned',
      criticalFacilitiesProtected: incident?.criticalFacilities?.length || 0,
      clusterRiskIdentified: !!incident?.clusterHypothesis,
    },
  };
}
