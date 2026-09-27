import { civicStore } from './admin';
import { Incident } from '../../../shared/types';

export const incidentsDb = {
  getAll: () => civicStore.getIncidents(),
  getById: (id: string) => civicStore.getIncidentById(id),
  save: (incident: Incident) => civicStore.saveIncident(incident),
  create: (data: Partial<Incident> & { id: string; description: string; latitude: number; longitude: number }): Incident => {
    const now = new Date().toISOString();
    const newIncident: Incident = {
      id: data.id,
      type: data.type || 'OTHER',
      description: data.description,
      language: data.language || 'en',
      latitude: data.latitude,
      longitude: data.longitude,
      address: data.address || `${data.latitude.toFixed(4)}° N, ${data.longitude.toFixed(4)}° E, Bengaluru`,
      severity: data.severity || 'MEDIUM',
      confidence: data.confidence || 0.85,
      status: data.status || 'RECEIVED',
      assignedTeamId: data.assignedTeamId || null,
      assignedTeamName: data.assignedTeamName,
      criticalFacilities: data.criticalFacilities || [],
      imageUrl:
        data.imageUrl ||
        (data.type === 'ROAD_DAMAGE'
          ? 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'
          : data.type === 'ELECTRICAL_HAZARD'
          ? 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80'
          : data.type === 'GARBAGE_OVERFLOW'
          ? 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=800&q=80'
          : data.type === 'TRAFFIC_OBSTRUCTION' || data.type === 'FALLEN_TREE'
          ? 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'
          : 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80'),
      verificationPhotoUrl:
        data.verificationPhotoUrl ||
        'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
      aiSummary: data.aiSummary,
      risks: data.risks || [],
      requiredDepartments: data.requiredDepartments || [],
      clusterHypothesis: data.clusterHypothesis || null,
      workOrderId: data.workOrderId,
      etaMinutes: data.etaMinutes,
      createdAt: now,
      updatedAt: now,
      resolvedAt: null,
    };
    return civicStore.saveIncident(newIncident);
  },
  updateStatus: (id: string, status: Incident['status'], extra?: Partial<Incident>): Incident | null => {
    const inc = civicStore.getIncidentById(id);
    if (!inc) return null;
    inc.status = status;
    if (status === 'RESOLVED') {
      inc.resolvedAt = new Date().toISOString();
    }
    if (extra) {
      Object.assign(inc, extra);
    }
    return civicStore.saveIncident(inc);
  },
};
