import { Router, Request, Response } from 'express';
import { incidentsDb } from '../firebase/incidents';
import { civicStore } from '../firebase/admin';
import { runAgentOrchestration } from '../agent/orchestrator';

export const incidentsRouter = Router();

// GET /api/incidents
incidentsRouter.get('/', (_req: Request, res: Response) => {
  const incidents = incidentsDb.getAll();
  res.json(incidents);
});

// GET /api/incidents/:id
incidentsRouter.get('/:id', (req: Request, res: Response) => {
  const incident = incidentsDb.getById(req.params.id);
  if (!incident) {
    return res.status(404).json({ error: 'Incident not found' });
  }

  const actions = civicStore.getActions(incident.id);
  const notifications = civicStore.getNotifications(incident.id);

  res.json({
    ...incident,
    actions,
    notifications,
  });
});

// POST /api/incidents
incidentsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { description, latitude, longitude, language, imageUrl, address } = req.body;
    if (!description || typeof description !== 'string' || !description.trim()) {
      return res.status(400).json({ error: 'Description is required' });
    }

    const hasLat = typeof latitude === 'number' && !isNaN(latitude);
    const hasLng = typeof longitude === 'number' && !isNaN(longitude);

    if (!hasLat && !hasLng && !address) {
      return res.status(400).json({
        error: 'Incident location (coordinates or street/landmark address) is required to dispatch municipal response teams.',
      });
    }

    const id = `BP-${Math.floor(2000 + Math.random() * 900)}`;
    const lat = hasLat ? latitude : 12.9716;
    const lng = hasLng ? longitude : 77.5946;

    const incident = incidentsDb.create({
      id,
      description,
      language: language || 'en',
      latitude: lat,
      longitude: lng,
      address: address || 'Bengaluru Urban District',
      imageUrl,
      status: 'RECEIVED',
    });

    // Auto-trigger autonomous coordination
    runAgentOrchestration(incident.id).catch((err) =>
      console.error('Agent orchestration background error:', err)
    );

    res.status(201).json(incident);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/incidents/:id/verify
incidentsRouter.post('/:id/verify', (req: Request, res: Response) => {
  const { notes, photoUrl } = req.body;
  const incident = incidentsDb.getById(req.params.id);
  if (!incident) {
    return res.status(404).json({ error: 'Incident not found' });
  }

  const updated = incidentsDb.updateStatus(incident.id, 'RESOLVED', {
    verificationNotes: notes || 'Work verified and completed by Field Resolution Agent.',
    verificationPhotoUrl: photoUrl || incident.verificationPhotoUrl,
  });

  civicStore.logAction({
    id: `act_verif_${Date.now()}`,
    incidentId: incident.id,
    tool: 'field_resolution_verification_agent',
    status: 'COMPLETED',
    summary: `Autonomous Field Agent inspected and marked work completed for ${incident.id}.`,
    input: { incidentId: incident.id, notes },
    result: { status: 'RESOLVED', verified: true },
    latencyMs: 120,
    timestamp: new Date().toISOString(),
  });

  res.json(updated);
});
