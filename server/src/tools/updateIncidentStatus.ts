import { Incident, IncidentStatus } from '../../../shared/types';
import { incidentsDb } from '../firebase/incidents';

export interface UpdateIncidentStatusInput {
  incidentId: string;
  status: IncidentStatus;
  notes?: string;
  assignedTeamId?: string;
  etaMinutes?: number;
}

export interface UpdateIncidentStatusOutput {
  success: boolean;
  incidentId: string;
  previousStatus?: string;
  newStatus: IncidentStatus;
  updatedAt: string;
}

export async function executeUpdateIncidentStatus(
  input: UpdateIncidentStatusInput
): Promise<UpdateIncidentStatusOutput> {
  const current = incidentsDb.getById(input.incidentId);
  const prev = current?.status;

  const extra: Partial<Incident> = {};
  if (input.notes) extra.aiSummary = input.notes;
  if (input.assignedTeamId) extra.assignedTeamId = input.assignedTeamId;
  if (input.etaMinutes !== undefined) extra.etaMinutes = input.etaMinutes;

  const updated = incidentsDb.updateStatus(input.incidentId, input.status, extra);

  return {
    success: !!updated,
    incidentId: input.incidentId,
    previousStatus: prev,
    newStatus: input.status,
    updatedAt: updated?.updatedAt || new Date().toISOString(),
  };
}
