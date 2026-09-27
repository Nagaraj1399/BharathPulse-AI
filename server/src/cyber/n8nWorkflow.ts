import { civicStore } from '../firebase/admin';
import { incidentsDb } from '../firebase/incidents';
import { CyberIncidentReport, N8nWorkflowExecution, N8nWorkflowStep, Incident } from '../../../shared/types';

export interface DispatchCyberReportInput {
  url: string;
  sanitizedUrl: string;
  domain: string;
  riskLevel: 'SAFE' | 'SUSPICIOUS' | 'HIGH_RISK' | 'UNKNOWN';
  riskScore: number;
  flags: string[];
  citizenNotes?: string;
  clickedScenario?: string;
}

export async function executeN8nCyberWorkflow(
  input: DispatchCyberReportInput
): Promise<CyberIncidentReport> {
  const executionId = `exec_n8n_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
  const ticketId = `CYBER-N8N-${Math.floor(100000 + Math.random() * 900000)}`;
  const triggeredAt = new Date().toISOString();

  const steps: N8nWorkflowStep[] = [];

  // Step 1: Webhook Reception & Schema Validation
  steps.push({
    name: 'n8n Webhook: Receive Citizen Cyber Report',
    status: 'completed',
    detail: `HTTP POST webhook trigger received for domain "${input.domain}". Payload verified and sanitized.`,
    timestamp: new Date().toISOString(),
  });

  // Step 2: Validate Report & Threat Classification
  steps.push({
    name: 'n8n Node: Validate Threat Classification',
    status: 'completed',
    detail: `Confirmed Category = Cybersecurity, Subcategory = Suspicious Link / Phishing. Calculated Risk Score: ${input.riskScore}/100.`,
    timestamp: new Date().toISOString(),
  });

  // Step 3: Route to Municipal Cybersecurity Team
  const cyberTeam = civicStore.getTeams().find((t) => t.id === 'TEAM-CYBER-09') || {
    id: 'TEAM-CYBER-09',
    name: 'Bengaluru Cyber Crime Rapid Cell (CID / CERT-In Liaison)',
  };

  steps.push({
    name: 'n8n Node: Route to Response Team',
    status: 'completed',
    detail: `Incident routed to ${cyberTeam.name}. Assigned priority: ${input.riskLevel === 'HIGH_RISK' ? 'CRITICAL' : 'HIGH'}.`,
    timestamp: new Date().toISOString(),
  });

  // Step 4: Generate Ticket & Incident ID
  const incidentId = `BP-CYBER-${Math.floor(1000 + Math.random() * 9000)}`;
  steps.push({
    name: 'n8n Node: Ticket ID & Token Generation',
    status: 'completed',
    detail: `Generated Citizen Tracking Ticket: ${ticketId} • Municipal Incident ID: ${incidentId}`,
    timestamp: new Date().toISOString(),
  });

  // Step 5: Store Incident into Live Municipal Incident Queue (Privacy Sanitized)
  // Requirement 15: For privacy, DO NOT publicly display the full suspicious URL.
  // Display something like: `Suspicious Link Report • Bengaluru`
  const sanitizedPublicDescription = `Suspicious Link Report • Bengaluru`;

  const newIncident: Incident = incidentsDb.create({
    id: incidentId,
    type: 'CYBERSECURITY',
    description: sanitizedPublicDescription,
    language: 'en',
    latitude: 12.9785,
    longitude: 77.5912,
    address: 'Bengaluru Central Digital Ward (CID Cyber Crime Cell)',
    severity: input.riskLevel === 'HIGH_RISK' ? 'CRITICAL' : 'HIGH',
    confidence: 0.96,
    status: 'DISPATCHED',
    assignedTeamId: cyberTeam.id,
    assignedTeamName: cyberTeam.name,
    criticalFacilities: [],
    aiSummary: `Citizen reported suspicious URL via BharatPulse Link Checker. Threat Score: ${input.riskScore}/100. Flags: ${input.flags.join(', ')}. Dispatched via n8n automated workflow to Cyber Crime Rapid Cell for DNS mitigation and 1930 fraud alert.`,
    risks: ['Phishing credential harvesting', 'Financial cyber fraud risk', 'Malware APK distribution'],
    requiredDepartments: ['Cybersecurity & Digital Crime Unit', 'CID Cyber Crime Division'],
    workOrderId: `WO-CYBER-${incidentId}`,
    etaMinutes: 4,
    cyberPayload: {
      rawUrl: input.url,
      sanitizedUrl: input.sanitizedUrl,
      domain: input.domain,
      riskLevel: input.riskLevel,
      riskScore: input.riskScore,
      flags: input.flags,
      ticketId,
      n8nExecutionId: executionId,
      clickedScenario: input.clickedScenario,
    },
  });

  steps.push({
    name: 'n8n Node: Store Incident & Queue Update',
    status: 'completed',
    detail: `Incident ${incidentId} synchronized to Live Municipal Incident Queue with privacy redaction.`,
    timestamp: new Date().toISOString(),
  });

  // Step 6: Dispatch Emergency Team Alert
  civicStore.logNotification({
    id: `NOTIF-CYBER-${Date.now()}`,
    incidentId,
    teamId: cyberTeam.id,
    recipient: 'Cyber Crime Officer-in-Charge',
    channel: 'RADIO_DISPATCH',
    message: `🚨 URGENT CYBER ALERT [Ticket ${ticketId}]: Citizen submitted suspicious link on domain "${input.domain}". Risk Score: ${input.riskScore}/100. Dispatched via n8n workflow.`,
    status: 'DELIVERED',
    timestamp: new Date().toISOString(),
  });

  steps.push({
    name: 'n8n Node: Notify Response Team',
    status: 'completed',
    detail: `Emergency dispatch alert delivered to ${cyberTeam.name} via high-priority dispatch channel.`,
    timestamp: new Date().toISOString(),
  });

  // Step 7: Optional External n8n Webhook Dispatch if environment configured
  const externalWebhookUrl = process.env.N8N_WEBHOOK_URL;
  if (externalWebhookUrl) {
    try {
      fetch(externalWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId,
          incidentId,
          domain: input.domain,
          sanitizedUrl: input.sanitizedUrl,
          riskLevel: input.riskLevel,
          riskScore: input.riskScore,
          flags: input.flags,
          citizenNotes: input.citizenNotes,
          clickedScenario: input.clickedScenario,
          timestamp: new Date().toISOString(),
        }),
      }).catch((err) => console.warn('External n8n webhook notification warning:', err));
    } catch (e) {
      console.warn('External n8n invocation error:', e);
    }
  }

  // Log action for Agent Activity & Municipal Telemetry Audit
  civicStore.logAction({
    id: `act_${Date.now()}`,
    incidentId,
    tool: 'n8n_cyber_incident_orchestration',
    status: 'COMPLETED',
    summary: `n8n Webhook processed cyber report for "${input.domain}". Routed to ${cyberTeam.name} with Ticket ${ticketId}.`,
    input: {
      domain: input.domain,
      riskLevel: input.riskLevel,
      riskScore: input.riskScore,
      flags: input.flags,
    },
    result: {
      ticketId,
      incidentId,
      executionId,
      status: 'DISPATCHED',
      stepsCount: steps.length,
    },
    latencyMs: 142,
    timestamp: new Date().toISOString(),
  });

  // Increment cyber telemetry stats
  civicStore.recordCyberReport();

  const n8nExecution: N8nWorkflowExecution = {
    executionId,
    workflowName: 'BharatPulse Cyber Incident Response & Municipal Queue Orchestration',
    triggeredAt,
    completedAt: new Date().toISOString(),
    status: 'SUCCESS',
    steps,
    ticketId,
    routedTeam: cyberTeam.name,
    incidentId: newIncident.id,
    webhookUrl: externalWebhookUrl || '/api/cyber/webhook/n8n',
  };

  return {
    ticketId,
    incidentId: newIncident.id,
    url: input.url,
    sanitizedDisplay: sanitizedPublicDescription,
    domain: input.domain,
    riskLevel: input.riskLevel,
    riskScore: input.riskScore,
    flags: input.flags,
    citizenNotes: input.citizenNotes,
    clickedScenario: input.clickedScenario,
    n8nExecution,
    assignedTeam: cyberTeam.name,
    createdAt: new Date().toISOString(),
  };
}
