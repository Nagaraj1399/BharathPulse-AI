import { Router, Request, Response } from 'express';
import { civicStore } from '../firebase/admin';
import { incidentsDb } from '../firebase/incidents';
import { executeTool } from '../agent/orchestrator';
import { generateVoiceReply } from '../voice/voiceReplies';

export const demoRouter = Router();

// POST /api/demo/start
demoRouter.post('/start', async (req: Request, res: Response) => {
  try {
    const demoIncidentId = 'BP-2048';
    const language = (req.body.language || 'en') as string;

    // Reset demo incident if already exists
    const existing = incidentsDb.getById(demoIncidentId);
    if (existing) {
      civicStore.incidents.delete(demoIncidentId);
    }

    // Step 0: Citizen Voice Report
    const incident = incidentsDb.create({
      id: demoIncidentId,
      description: 'There is a major water leak outside a school and the road is flooding.',
      language,
      latitude: 12.9782,
      longitude: 77.6415,
      address: 'Near Indiranagar Government High School, 100 Feet Rd, Bengaluru',
      status: 'RECEIVED',
    });

    // Step 1: Classify with Gemini
    const classification = await executeTool(
      'classifyIncident',
      {
        description: incident.description,
        latitude: incident.latitude,
        longitude: incident.longitude,
        language: incident.language,
      },
      demoIncidentId
    );

    incidentsDb.updateStatus(demoIncidentId, 'ANALYZING', {
      type: classification.incidentType,
      severity: classification.severity,
      confidence: classification.confidence,
      aiSummary: classification.summary,
      risks: classification.risks,
      requiredDepartments: classification.requiredDepartments,
    });

    // Step 2: Search Nearby Critical Facilities
    const places = await executeTool(
      'findNearbyCriticalPlaces',
      {
        latitude: incident.latitude,
        longitude: incident.longitude,
        radiusMeters: 2500,
      },
      demoIncidentId
    );

    incidentsDb.updateStatus(demoIncidentId, 'INVESTIGATING', {
      criticalFacilities: places.facilities,
    });

    // Step 3: Find Available Response Teams
    const teams = await executeTool(
      'findAvailableResponseTeams',
      {
        incidentType: classification.incidentType,
        latitude: incident.latitude,
        longitude: incident.longitude,
        severity: classification.severity,
      },
      demoIncidentId
    );

    const selectedTeam = teams.recommendedTeam;
    const teamId = selectedTeam ? selectedTeam.team.id : 'TEAM-BWSSB-01';
    const teamName = selectedTeam ? selectedTeam.team.name : 'BWSSB Rapid Water Unit 01';
    const etaMinutes = selectedTeam ? selectedTeam.estimatedArrivalMinutes : 8;

    // Step 4: Calculate Route
    const route = await executeTool(
      'calculateResponseRoute',
      {
        originLat: selectedTeam?.team?.latitude || 12.9754,
        originLng: selectedTeam?.team?.longitude || 77.6052,
        destLat: incident.latitude,
        destLng: incident.longitude,
        teamId,
        incidentId: demoIncidentId,
      },
      demoIncidentId
    );

    // Step 5: Create Work Order
    const workOrder = await executeTool(
      'createWorkOrder',
      {
        incidentId: demoIncidentId,
        teamId,
        priority: classification.severity,
        etaMinutes: route.durationMinutes || etaMinutes,
        instructions: 'Urgent water shutoff and flood diversion outside Indiranagar Government High School.',
      },
      demoIncidentId
    );

    // Step 6: Notify Response Team
    await executeTool(
      'notifyResponseTeam',
      {
        incidentId: demoIncidentId,
        teamId,
        message: `EMERGENCY DISPATCH ${workOrder.workOrderId}: Active water leak & road inundation outside Indiranagar Govt High School. ETA ${route.durationMinutes}m.`,
        channel: 'RADIO_DISPATCH',
      },
      demoIncidentId
    );

    // Step 7: Detect Spatial Incident Clusters
    const cluster = await executeTool(
      'detectIncidentClusters',
      {
        incidentId: demoIncidentId,
        incidentType: classification.incidentType,
        latitude: incident.latitude,
        longitude: incident.longitude,
        radiusKm: 2.5,
      },
      demoIncidentId
    );

    // Update incident with dispatch parameters
    incidentsDb.updateStatus(demoIncidentId, 'DISPATCHED', {
      assignedTeamId: teamId,
      assignedTeamName: teamName,
      workOrderId: workOrder.workOrderId,
      etaMinutes: route.durationMinutes,
      routeCoordinates: route.coordinates,
    });

    const confirmedVoiceNarration = generateVoiceReply(
      language,
      demoIncidentId,
      teamName,
      route.durationMinutes
    );

    const finalInc = incidentsDb.getById(demoIncidentId);

    res.json({
      success: true,
      incident: finalInc,
      classification,
      closestFacility: places.closestFacility,
      selectedTeam,
      route,
      workOrder,
      cluster,
      confirmedVoiceNarration,
    });
  } catch (error: any) {
    console.error('Error starting demo:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/demo/step-verify
demoRouter.post('/step-verify', async (req: Request, res: Response) => {
  try {
    const { incidentId } = req.body;
    const id = incidentId || 'BP-2048';

    // Request verification
    await executeTool(
      'requestVerification',
      {
        incidentId: id,
        teamId: 'TEAM-BWSSB-01',
        verificationType: 'ON_SITE_COMPLETION',
      },
      id
    );

    // Verify resolution with evidence
    const verifyResult = await executeTool(
      'verifyResolution',
      {
        incidentId: id,
        fieldReport: 'BWSSB Rapid Water Unit 01 completed sleeve welding on 450mm feeder main. Valve sealed and road drainage cleared.',
        completionPhotoProvided: true,
        pressureRestoredOrRoadCleared: true,
      },
      id
    );

    // Generate municipal incident report
    const report = await executeTool(
      'generateIncidentReport',
      { incidentId: id },
      id
    );

    const updated = incidentsDb.getById(id);

    res.json({
      success: true,
      incident: updated,
      verifyResult,
      report,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/demo/reset
demoRouter.post('/reset', (_req: Request, res: Response) => {
  civicStore.resetDemo();
  res.json({ success: true, message: 'Civic store reset to default seed state' });
});
