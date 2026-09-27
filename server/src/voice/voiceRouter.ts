import { Router, Request, Response } from 'express';
import { incidentsDb } from '../firebase/incidents';
import { teamsDb } from '../firebase/teams';
import { runAgentOrchestration } from '../agent/orchestrator';
import { executeTool } from '../agent/orchestrator';
import { generateVoiceReply } from './voiceReplies';
import { transcribeAudio } from './transcribe';

export const voiceRouter = Router();

// POST /api/voice/transcribe - Multimodal audio transcription via Gemini
voiceRouter.post('/transcribe', async (req: Request, res: Response) => {
  try {
    const { audio, mimeType, language } = req.body;
    if (!audio) {
      return res.status(400).json({ error: 'Audio base64 data is required' });
    }

    const transcribedText = await transcribeAudio(audio, mimeType || 'audio/webm', language || 'en');
    res.json({
      success: true,
      text: transcribedText,
    });
  } catch (error: any) {
    console.error('Error in /api/voice/transcribe:', error);
    res.status(500).json({ error: error.message || 'Failed to transcribe audio' });
  }
});

// POST /api/voice/create-incident - Voice-initiated incident report
voiceRouter.post('/create-incident', async (req: Request, res: Response) => {
  try {
    const { description, latitude, longitude, language, imageUrl, address } = req.body;

    if (!description) {
      return res.status(400).json({ error: 'Description is required' });
    }

    const lat = typeof latitude === 'number' ? latitude : 12.9782;
    const lng = typeof longitude === 'number' ? longitude : 77.6415;
    const incId = `BP-${Math.floor(2000 + Math.random() * 900)}`;

    // Quick match for initial dispatch team
    const teams = teamsDb.getAll();
    let bestTeam = teams[0];
    const descLower = description.toLowerCase();
    if (
      descLower.includes('water') ||
      descLower.includes('leak') ||
      descLower.includes('pipe') ||
      descLower.includes('flood') ||
      descLower.includes('पानी') ||
      descLower.includes('ನೀರು')
    ) {
      bestTeam = teams.find((t) => t.id.includes('BWSSB')) || teams[0];
    } else if (
      descLower.includes('electric') ||
      descLower.includes('transformer') ||
      descLower.includes('wire') ||
      descLower.includes('power') ||
      descLower.includes('spark') ||
      descLower.includes('बिजली')
    ) {
      bestTeam = teams.find((t) => t.id.includes('BESCOM')) || teams[1] || teams[0];
    } else if (
      descLower.includes('road') ||
      descLower.includes('pothole') ||
      descLower.includes('traffic') ||
      descLower.includes('सड़क') ||
      descLower.includes('ರಸ್ತೆ')
    ) {
      bestTeam = teams.find((t) => t.id.includes('BBMP-RD')) || teams[2] || teams[0];
    }

    const teamName = bestTeam?.name || 'BWSSB Rapid Water Unit 01';
    const etaMin = 8;

    const incident = incidentsDb.create({
      id: incId,
      description,
      language: language || 'en',
      latitude: lat,
      longitude: lng,
      address: address || 'Near Indiranagar Government School, 100ft Rd, Bengaluru',
      imageUrl,
      status: 'DISPATCHED',
      assignedTeamId: bestTeam?.id || 'TEAM-BWSSB-01',
      assignedTeamName: teamName,
      etaMinutes: etaMin,
    });

    // Run agent coordination pipeline asynchronously in the background
    runAgentOrchestration(incId).catch((err) => {
      console.warn('Background agent orchestration error:', err);
    });

    const spokenMessage = generateVoiceReply(language || 'en', incident.id, teamName, etaMin);

    res.json({
      success: true,
      incidentId: incident.id,
      status: incident.status,
      confirmedEtaMinutes: etaMin,
      assignedTeam: teamName,
      message: spokenMessage,
    });
  } catch (error: any) {
    console.error('Error in /api/voice/create-incident:', error);
    res.status(500).json({ error: error.message || 'Internal error creating incident' });
  }
});

// POST /api/voice/get-incident-status
voiceRouter.post('/get-incident-status', async (req: Request, res: Response) => {
  try {
    const { incidentId } = req.body;
    if (!incidentId) {
      return res.status(400).json({ error: 'Incident ID is required' });
    }

    const incident = incidentsDb.getById(incidentId);
    if (!incident) {
      return res.status(404).json({ error: `Incident ${incidentId} not found` });
    }

    res.json({
      incidentId: incident.id,
      status: incident.status,
      type: incident.type,
      severity: incident.severity,
      assignedTeam: incident.assignedTeamName || 'Pending assignment',
      etaMinutes: incident.etaMinutes || null,
      aiSummary: incident.aiSummary || 'Under active coordination',
      clusterHypothesis: incident.clusterHypothesis || null,
      criticalFacilities: incident.criticalFacilities,
      resolvedAt: incident.resolvedAt,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/voice/find-response-team
voiceRouter.post('/find-response-team', async (req: Request, res: Response) => {
  try {
    const { incidentType, latitude, longitude, severity } = req.body;
    const result = await executeTool('findAvailableResponseTeams', {
      incidentType: incidentType || 'WATER_LEAK',
      latitude: latitude || 12.9782,
      longitude: longitude || 77.6415,
      severity: severity || 'HIGH',
    });

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/voice/get-response-eta
voiceRouter.post('/get-response-eta', async (req: Request, res: Response) => {
  try {
    const { incidentId } = req.body;
    const incident = incidentsDb.getById(incidentId);
    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    res.json({
      incidentId: incident.id,
      assignedTeam: incident.assignedTeamName,
      etaMinutes: incident.etaMinutes || 8,
      status: incident.status,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/voice/escalate-incident
voiceRouter.post('/escalate-incident', async (req: Request, res: Response) => {
  try {
    const { incidentId, reason, targetTier } = req.body;
    const result = await executeTool('escalateIncident', {
      incidentId,
      reason: reason || 'Citizen requested immediate emergency escalation.',
      targetTier: targetTier || 'DISASTER_MANAGEMENT_AUTHORITY',
      immediateActionsRequired: ['Emergency alert', 'Sector evacuation warning'],
    });

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
