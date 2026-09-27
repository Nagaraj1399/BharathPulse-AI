import { incidentsDb } from '../firebase/incidents';
import { actionsDb } from '../firebase/actions';

export interface RequestVerificationInput {
  incidentId: string;
  teamId: string;
  verificationType: 'ON_SITE_COMPLETION' | 'CITIZEN_CALLBACK' | 'SENSOR_TELEMETRY';
  requiredChecklist?: string[];
}

export interface RequestVerificationOutput {
  verificationRequestId: string;
  incidentId: string;
  teamId: string;
  status: 'PENDING_FIELD_REPORT';
  requiredArtifacts: string[];
  message: string;
  timestamp: string;
}

export async function executeRequestVerification(
  input: RequestVerificationInput
): Promise<RequestVerificationOutput> {
  const reqId = `VERIF-REQ-${Date.now().toString().slice(-4)}`;

  incidentsDb.updateStatus(input.incidentId, 'VERIFYING');

  actionsDb.logNotification({
    incidentId: input.incidentId,
    teamId: input.teamId,
    recipient: `Response Team ${input.teamId}`,
    channel: 'IN_APP',
    message: `ACTION REQUIRED: Submit post-repair telemetry, photographic verification, and flow pressure confirmation for ${input.incidentId}.`,
    status: 'DELIVERED',
  });

  return {
    verificationRequestId: reqId,
    incidentId: input.incidentId,
    teamId: input.teamId,
    status: 'PENDING_FIELD_REPORT',
    requiredArtifacts: [
      'Remediation completion timestamp',
      'Field engineer digital signature',
      'Post-repair visual verification',
      'Water pressure normalization confirmation',
    ],
    message: 'Field verification request dispatched to on-site crew.',
    timestamp: new Date().toISOString(),
  };
}
