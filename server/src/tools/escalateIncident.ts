import { IncidentSeverity } from '../../../shared/types';
import { incidentsDb } from '../firebase/incidents';
import { actionsDb } from '../firebase/actions';

export interface EscalateIncidentInput {
  incidentId: string;
  reason: string;
  targetTier: 'DISASTER_MANAGEMENT_AUTHORITY' | 'CHIEF_COMMISSIONER_BBMP' | 'STATE_FIRE_FORCE';
  immediateActionsRequired: string[];
}

export interface EscalateIncidentOutput {
  escalationId: string;
  incidentId: string;
  newSeverity: IncidentSeverity;
  assignedTier: string;
  alertDispatched: boolean;
  timestamp: string;
}

export async function executeEscalateIncident(
  input: EscalateIncidentInput
): Promise<EscalateIncidentOutput> {
  const escId = `ESC-${Date.now().toString().slice(-4)}`;

  incidentsDb.updateStatus(input.incidentId, 'ESCALATED', {
    severity: 'CRITICAL',
    aiSummary: `ESCALATED to ${input.targetTier}: ${input.reason}`,
  });

  actionsDb.logNotification({
    incidentId: input.incidentId,
    recipient: input.targetTier,
    channel: 'RADIO_DISPATCH',
    message: `CRITICAL ESCALATION ${escId}: ${input.reason}. Direct operational control assumed.`,
    status: 'DELIVERED',
  });

  return {
    escalationId: escId,
    incidentId: input.incidentId,
    newSeverity: 'CRITICAL',
    assignedTier: input.targetTier,
    alertDispatched: true,
    timestamp: new Date().toISOString(),
  };
}
