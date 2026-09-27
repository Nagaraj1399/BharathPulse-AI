import { WorkOrder, IncidentSeverity } from '../../../shared/types';
import { teamsDb } from '../firebase/teams';
import { incidentsDb } from '../firebase/incidents';

export interface CreateWorkOrderInput {
  incidentId: string;
  teamId: string;
  priority: IncidentSeverity;
  etaMinutes: number;
  instructions?: string;
}

export interface CreateWorkOrderOutput {
  workOrderId: string;
  incidentId: string;
  teamId: string;
  teamName: string;
  priority: string;
  etaMinutes: number;
  status: string;
  createdAt: string;
}

export async function executeCreateWorkOrder(
  input: CreateWorkOrderInput
): Promise<CreateWorkOrderOutput> {
  if (!input.incidentId || !input.teamId) {
    throw new Error('incidentId and teamId are required to issue an official municipal work order');
  }

  const team = teamsDb.getById(input.teamId);
  if (!team) {
    throw new Error(`Target response team "${input.teamId}" does not exist in civic registry`);
  }

  const incident = incidentsDb.getById(input.incidentId);
  if (!incident) {
    throw new Error(`Target incident "${input.incidentId}" does not exist`);
  }

  const teamName = team.name;
  const workOrderId = `WO-${input.teamId.replace('TEAM-', '')}-${Date.now().toString().slice(-4)}`;

  const order: WorkOrder = {
    id: workOrderId,
    incidentId: input.incidentId,
    teamId: input.teamId,
    teamName,
    priority: input.priority,
    status: 'ACCEPTED',
    etaMinutes: input.etaMinutes,
    instructions: input.instructions || `Emergency dispatch to ${input.incidentId}. Secure hazard perimeter and commence remediation.`,
    createdAt: new Date().toISOString(),
    completedAt: null,
  };

  teamsDb.createWorkOrder(order);
  teamsDb.assignToIncident(input.teamId, input.incidentId);

  // Update incident with assigned team and work order
  incidentsDb.updateStatus(input.incidentId, 'DISPATCHED', {
    assignedTeamId: input.teamId,
    assignedTeamName: teamName,
    workOrderId,
    etaMinutes: input.etaMinutes,
  });

  return {
    workOrderId,
    incidentId: input.incidentId,
    teamId: input.teamId,
    teamName,
    priority: input.priority,
    etaMinutes: input.etaMinutes,
    status: 'ACCEPTED',
    createdAt: order.createdAt,
  };
}
