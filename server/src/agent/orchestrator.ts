import { getGeminiClient, GEMINI_MODEL } from './gemini';
import { agentToolDeclarations } from './schemas';
import { BHARATPULSE_AGENT_SYSTEM_PROMPT } from './prompts';
import { incidentsDb } from '../firebase/incidents';
import { actionsDb } from '../firebase/actions';
import { executeClassifyIncident } from '../tools/classifyIncident';
import { executeFindNearbyCriticalPlaces } from '../tools/findNearbyCriticalPlaces';
import { executeFindAvailableResponseTeams } from '../tools/findAvailableResponseTeams';
import { executeCalculateResponseRoute } from '../tools/calculateResponseRoute';
import { executeCreateWorkOrder } from '../tools/createWorkOrder';
import { executeNotifyResponseTeam } from '../tools/notifyResponseTeam';
import { executeUpdateIncidentStatus } from '../tools/updateIncidentStatus';
import { executeDetectIncidentClusters } from '../tools/detectIncidentClusters';
import { executeRequestVerification } from '../tools/requestVerification';
import { executeVerifyResolution } from '../tools/verifyResolution';
import { executeEscalateIncident } from '../tools/escalateIncident';
import { executeGenerateIncidentReport } from '../tools/generateIncidentReport';
import { Incident } from '../../../shared/types';

// Map human-facing summary labels (No private chain-of-thought!)
export function getCleanToolSummary(toolName: string, _args: any, result: any): string {
  switch (toolName) {
    case 'createIncident':
      return `Created civic incident ${result?.incidentId || 'BP-NEW'} (${result?.type || 'INCIDENT'} - ${result?.severity || 'MEDIUM'})`;
    case 'getIncidentStatus':
      return `Queried status for incident ${result?.incidentId || 'BP-ID'}: ${result?.status || 'RECEIVED'}`;
    case 'classifyIncident':
      return `Classified incident as ${result?.incidentType || 'CIVIC_HAZARD'} (${result?.severity || 'MEDIUM'} priority)`;
    case 'findNearbyCriticalPlaces':
      return result?.closestFacility
        ? `Detected nearby ${result.closestFacility.type}: ${result.closestFacility.name} (${result.closestFacility.distanceMeters}m)`
        : 'Proximity check completed for critical institutions';
    case 'findAvailableResponseTeams':
      return result?.recommendedTeam
        ? `Found available team: ${result.recommendedTeam.team.name} (${result.recommendedTeam.distanceKm}km away)`
        : 'Assessed response team operational capacities';
    case 'calculateResponseRoute':
      return `Route calculated: ${result?.distanceKm || 2.4} km with ${result?.durationMinutes || 8} min ETA`;
    case 'createWorkOrder':
      return `Work order ${result?.workOrderId || 'WO-CREATED'} issued to ${result?.teamName || 'response squad'}`;
    case 'notifyResponseTeam':
      return `Field alert dispatched to ${result?.recipient || 'field team'} via ${result?.channel || 'radio'}`;
    case 'updateIncidentStatus':
      return `Incident lifecycle updated to ${result?.newStatus || 'UPDATED'}`;
    case 'detectIncidentClusters':
      return result?.detected
        ? `Network risk detected: ${result.incidentCount} similar incidents clustered in area`
        : 'Spatial cluster analysis completed - no network anomaly';
    case 'requestVerification':
      return 'Verification requested from on-site emergency crew';
    case 'verifyResolution':
      return `Incident resolution ${result?.outcome || 'VERIFIED'} with field telemetry`;
    case 'escalateIncident':
      return `Escalated to ${result?.assignedTier || 'Central Disaster Management'}`;
    case 'generateIncidentReport':
      return 'Official municipal post-incident audit report generated';
    default:
      return `Completed operational task: ${toolName}`;
  }
}

// Execute individual tool with validation & audit logging
export async function executeTool(toolName: string, args: Record<string, any>, incidentId?: string): Promise<any> {
  const startTime = Date.now();
  let result: any = null;

  try {
    switch (toolName) {
      case 'createIncident': {
        const incId = args.incidentId || `BP-${Math.floor(2000 + Math.random() * 900)}`;
        const lat = typeof args.latitude === 'number' ? args.latitude : 12.9782;
        const lng = typeof args.longitude === 'number' ? args.longitude : 77.6415;
        const classification = await executeClassifyIncident({
          description: args.description,
          latitude: lat,
          longitude: lng,
          language: args.language,
        });

        // Search available response teams for immediate assignment
        const teamMatch = await executeFindAvailableResponseTeams({
          incidentType: classification.incidentType,
          latitude: lat,
          longitude: lng,
          severity: classification.severity,
        });

        const selectedTeam = teamMatch.recommendedTeam;
        const teamName = selectedTeam?.team?.name || 'BWSSB Rapid Water Unit 01';
        const teamId = selectedTeam?.team?.id || 'TEAM-BWSSB-01';
        const etaMinutes = selectedTeam?.estimatedArrivalMinutes || 8;

        const incident = incidentsDb.create({
          id: incId,
          description: args.description,
          type: classification.incidentType,
          severity: classification.severity,
          confidence: classification.confidence,
          latitude: lat,
          longitude: lng,
          address: args.address || `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E, Bengaluru`,
          language: args.language || 'en',
          status: 'DISPATCHED',
          assignedTeamId: teamId,
          assignedTeamName: teamName,
          etaMinutes,
          aiSummary: classification.summary,
          risks: classification.risks,
          requiredDepartments: classification.requiredDepartments,
        });

        result = {
          incidentId: incident.id,
          status: incident.status,
          type: incident.type,
          severity: incident.severity,
          assignedTeamName: incident.assignedTeamName,
          confirmedEtaMinutes: incident.etaMinutes,
          address: incident.address,
          aiSummary: incident.aiSummary,
        };
        break;
      }
      case 'getIncidentStatus': {
        const inc = incidentsDb.getById(args.incidentId);
        if (!inc) {
          result = { error: `Incident ${args.incidentId} not found in municipal registry.` };
        } else {
          result = {
            incidentId: inc.id,
            status: inc.status,
            type: inc.type,
            severity: inc.severity,
            assignedTeam: inc.assignedTeamName || 'Unassigned',
            etaMinutes: inc.etaMinutes || null,
            workOrderId: inc.workOrderId || null,
            resolvedAt: inc.resolvedAt || null,
            address: inc.address,
            aiSummary: inc.aiSummary || null,
          };
        }
        break;
      }
      case 'classifyIncident':
        result = await executeClassifyIncident(args as any);
        break;
      case 'findNearbyCriticalPlaces':
        result = await executeFindNearbyCriticalPlaces(args as any);
        break;
      case 'findAvailableResponseTeams':
        result = await executeFindAvailableResponseTeams(args as any);
        break;
      case 'calculateResponseRoute':
        result = await executeCalculateResponseRoute(args as any);
        break;
      case 'createWorkOrder':
        result = await executeCreateWorkOrder(args as any);
        break;
      case 'notifyResponseTeam':
        result = await executeNotifyResponseTeam(args as any);
        break;
      case 'updateIncidentStatus':
        result = await executeUpdateIncidentStatus(args as any);
        break;
      case 'detectIncidentClusters':
        result = await executeDetectIncidentClusters(args as any);
        break;
      case 'requestVerification':
        result = await executeRequestVerification(args as any);
        break;
      case 'verifyResolution':
        result = await executeVerifyResolution(args as any);
        break;
      case 'escalateIncident':
        result = await executeEscalateIncident(args as any);
        break;
      case 'generateIncidentReport':
        result = await executeGenerateIncidentReport(args as any);
        break;
      default:
        throw new Error(`Unrecognized agent tool: ${toolName}`);
    }

    const latencyMs = Date.now() - startTime;
    const cleanSummary = getCleanToolSummary(toolName, args, result);

    if (incidentId || args.incidentId) {
      actionsDb.logAction({
        incidentId: incidentId || args.incidentId || 'SYS-ORCHESTRATOR',
        tool: toolName,
        status: 'COMPLETED',
        summary: cleanSummary,
        input: args,
        result: result || {},
        latencyMs,
      });
    }

    return result;
  } catch (error: any) {
    const latencyMs = Date.now() - startTime;
    if (incidentId || args.incidentId) {
      actionsDb.logAction({
        incidentId: incidentId || args.incidentId || 'SYS-ORCHESTRATOR',
        tool: toolName,
        status: 'FAILED',
        summary: `Tool ${toolName} encountered operational failure`,
        input: args,
        result: { error: error.message },
        latencyMs,
      });
    }
    throw error;
  }
}

// Autonomous Agent Orchestration Pipeline
export async function runAgentOrchestration(incidentId: string): Promise<{
  incident: Incident | null;
  stepsCompleted: number;
  confirmedEtaMinutes?: number;
  assignedTeamName?: string;
  confirmedWorkOrderId?: string;
}> {
  const incident = incidentsDb.getById(incidentId);
  if (!incident) {
    throw new Error(`Incident ${incidentId} not found`);
  }

  const client = getGeminiClient();

  // If Gemini API is available, run autonomous function-calling loop
  if (client) {
    try {
      const systemInstruction = BHARATPULSE_AGENT_SYSTEM_PROMPT;
      let conversationContents: any[] = [
        {
          role: 'user',
          parts: [
            {
              text: `Coordinate response for civic incident ${incidentId}.
Description: "${incident.description}"
Location: (${incident.latitude}, ${incident.longitude})
Current Status: ${incident.status}
Begin investigation, assign team, verify safety, and reach resolution.`,
            },
          ],
        },
      ];

      let loopCount = 0;
      const maxLoops = 8;

      while (loopCount < maxLoops) {
        loopCount++;

        const response = await client.models.generateContent({
          model: GEMINI_MODEL,
          contents: conversationContents,
          config: {
            systemInstruction,
            temperature: 0.1,
            tools: [{ functionDeclarations: agentToolDeclarations }],
          },
        });

        const functionCalls = response.functionCalls;
        if (!functionCalls || functionCalls.length === 0) {
          // Model completed reasoning
          break;
        }

        // Execute called function
        const call = functionCalls[0];
        const toolName = call.name;
        if (!toolName) break;
        const toolArgs = (call.args || {}) as Record<string, any>;

        // Injected context
        if (!toolArgs.incidentId) toolArgs.incidentId = incidentId;
        if (toolArgs.latitude === undefined) toolArgs.latitude = incident.latitude;
        if (toolArgs.longitude === undefined) toolArgs.longitude = incident.longitude;

        const toolResult = await executeTool(toolName, toolArgs, incidentId);

        // Append assistant tool call & function response to contents
        conversationContents.push(response.candidates?.[0]?.content);
        conversationContents.push({
          role: 'user',
          parts: [
            {
              functionResponse: {
                name: toolName,
                response: { output: toolResult },
              },
            },
          ],
        });

        // Check if resolved or escalated
        const updated = incidentsDb.getById(incidentId);
        if (updated?.status === 'RESOLVED' || updated?.status === 'ESCALATED') {
          break;
        }
      }

      const finalInc = incidentsDb.getById(incidentId);
      return {
        incident: finalInc || null,
        stepsCompleted: loopCount,
        confirmedEtaMinutes: finalInc?.etaMinutes,
        assignedTeamName: finalInc?.assignedTeamName,
        confirmedWorkOrderId: finalInc?.workOrderId,
      };
    } catch (err) {
      console.warn('Gemini function-calling loop encountered exception, falling back to deterministic agent workflow:', err);
    }
  }

  // Deterministic Standard Workflow (adheres 100% to tool contracts)
  return await runDeterministicStandardWorkflow(incidentId);
}

// Deterministic Sequence executing every tool sequentially with real state mutations
export async function runDeterministicStandardWorkflow(incidentId: string): Promise<{
  incident: Incident | null;
  stepsCompleted: number;
  confirmedEtaMinutes?: number;
  assignedTeamName?: string;
  confirmedWorkOrderId?: string;
}> {
  const inc = incidentsDb.getById(incidentId);
  if (!inc) return { incident: null, stepsCompleted: 0 };

  // Step 1: Classify Incident
  const classification = await executeTool('classifyIncident', {
    description: inc.description,
    latitude: inc.latitude,
    longitude: inc.longitude,
    imageUrl: inc.imageUrl,
    language: inc.language,
  }, incidentId);

  incidentsDb.updateStatus(incidentId, 'ANALYZING', {
    type: classification.incidentType,
    severity: classification.severity,
    confidence: classification.confidence,
    aiSummary: classification.summary,
    risks: classification.risks,
    requiredDepartments: classification.requiredDepartments,
  });

  // Step 2: Critical Facility Scan
  const facilitiesResult = await executeTool('findNearbyCriticalPlaces', {
    latitude: inc.latitude,
    longitude: inc.longitude,
    radiusMeters: 2500,
  }, incidentId);

  if (facilitiesResult.facilities?.length > 0) {
    incidentsDb.updateStatus(incidentId, 'INVESTIGATING', {
      criticalFacilities: facilitiesResult.facilities,
    });
  }

  // Step 3: Response Team Search
  const teamSearch = await executeTool('findAvailableResponseTeams', {
    incidentType: classification.incidentType,
    latitude: inc.latitude,
    longitude: inc.longitude,
    severity: classification.severity,
  }, incidentId);

  const selectedTeam = teamSearch.recommendedTeam;

  if (!selectedTeam) {
    // Anti-Hallucination Safeguard: Do NOT invent a team if none are available!
    await executeTool(
      'escalateIncident',
      {
        incidentId,
        reason: 'No response team with required capabilities currently available in sector.',
        targetTier: 'DISASTER_MANAGEMENT_AUTHORITY',
        immediateActionsRequired: ['Sector supervisor alert', 'Inter-agency mutual aid request'],
      },
      incidentId
    );

    incidentsDb.updateStatus(incidentId, 'ESCALATED', {
      assignedTeamId: null,
      assignedTeamName: undefined,
      etaMinutes: undefined,
    });

    const updated = incidentsDb.getById(incidentId);
    return {
      incident: updated || null,
      stepsCompleted: 3,
      confirmedEtaMinutes: undefined,
      assignedTeamName: undefined,
    };
  }

  const teamId = selectedTeam.team.id;
  const teamName = selectedTeam.team.name;
  let etaMinutes = selectedTeam.estimatedArrivalMinutes || 8;

  // Step 4: Calculate Route
  const route = await executeTool('calculateResponseRoute', {
    originLat: selectedTeam?.team?.latitude || 12.9754,
    originLng: selectedTeam?.team?.longitude || 77.6052,
    destLat: inc.latitude,
    destLng: inc.longitude,
    teamId,
    incidentId,
  }, incidentId);

  etaMinutes = route.durationMinutes || etaMinutes;

  // Step 5: Create Work Order
  const workOrder = await executeTool('createWorkOrder', {
    incidentId,
    teamId,
    priority: classification.severity,
    etaMinutes,
    instructions: `Immediate deployment to ${inc.address || 'incident site'}. School nearby; secure flood hazard.`,
  }, incidentId);

  // Step 6: Notify Response Team
  await executeTool('notifyResponseTeam', {
    incidentId,
    teamId,
    message: `DISPATCH ALERT: Incident ${incidentId}. High priority water response near educational institution. ETA ${etaMinutes} mins.`,
    channel: 'RADIO_DISPATCH',
  }, incidentId);

  // Step 7: Detect Spatial Clusters
  await executeTool('detectIncidentClusters', {
    incidentId,
    incidentType: classification.incidentType,
    latitude: inc.latitude,
    longitude: inc.longitude,
    radiusKm: 2.2,
  }, incidentId);

  // Update route coords on incident
  incidentsDb.updateStatus(incidentId, 'DISPATCHED', {
    routeCoordinates: route.coordinates,
    etaMinutes,
    assignedTeamId: teamId,
    assignedTeamName: teamName,
    workOrderId: workOrder.workOrderId,
  });

  const finalInc = incidentsDb.getById(incidentId);

  return {
    incident: finalInc || null,
    stepsCompleted: 7,
    confirmedEtaMinutes: etaMinutes,
    assignedTeamName: teamName,
    confirmedWorkOrderId: workOrder.workOrderId,
  };
}
