import { FunctionDeclaration, Type } from '@google/genai';

export const agentToolDeclarations: FunctionDeclaration[] = [
  {
    name: 'createIncident',
    description: 'Creates a confirmed civic incident report in the BharatPulse municipal registry. Returns official incidentId.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        description: { type: Type.STRING, description: 'Description of the civic incident reported by the citizen' },
        latitude: { type: Type.NUMBER, description: 'Citizen latitude coordinate (e.g. 12.9782 for Bengaluru)' },
        longitude: { type: Type.NUMBER, description: 'Citizen longitude coordinate (e.g. 77.6415 for Bengaluru)' },
        language: { type: Type.STRING, description: 'Citizen language code (e.g. en, hi, kn, ta, te, bn)' },
        address: { type: Type.STRING, description: 'Street address or landmark' },
      },
      required: ['description'],
    },
  },
  {
    name: 'getIncidentStatus',
    description: 'Retrieves the official real-time status, assigned response team, work order, and confirmed ETA for an incident.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        incidentId: { type: Type.STRING, description: 'The official incident ID (e.g. BP-2048)' },
      },
      required: ['incidentId'],
    },
  },
  {
    name: 'classifyIncident',
    description: 'Classifies the civic problem type, severity level, risks, and required municipal departments.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        description: { type: Type.STRING, description: 'The citizen voice or text report' },
        latitude: { type: Type.NUMBER, description: 'Incident latitude coordinate' },
        longitude: { type: Type.NUMBER, description: 'Incident longitude coordinate' },
        language: { type: Type.STRING, description: 'Language of report' },
      },
      required: ['description', 'latitude', 'longitude'],
    },
  },
  {
    name: 'findNearbyCriticalPlaces',
    description: 'Scans geospatial radius for critical public facilities like schools, hospitals, metro stations, and police posts.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        latitude: { type: Type.NUMBER, description: 'Search latitude' },
        longitude: { type: Type.NUMBER, description: 'Search longitude' },
        radiusMeters: { type: Type.NUMBER, description: 'Search radius in meters' },
      },
      required: ['latitude', 'longitude'],
    },
  },
  {
    name: 'findAvailableResponseTeams',
    description: 'Searches and objectively ranks available municipal emergency response teams based on capabilities, current load, and proximity.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        incidentType: { type: Type.STRING, description: 'Classified incident category' },
        latitude: { type: Type.NUMBER, description: 'Incident latitude' },
        longitude: { type: Type.NUMBER, description: 'Incident longitude' },
        severity: { type: Type.STRING, description: 'Severity level' },
      },
      required: ['incidentType', 'latitude', 'longitude', 'severity'],
    },
  },
  {
    name: 'calculateResponseRoute',
    description: 'Calculates the real road network route, distance, and traffic-aware travel duration (ETA) from team location to incident.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        originLat: { type: Type.NUMBER, description: 'Team latitude' },
        originLng: { type: Type.NUMBER, description: 'Team longitude' },
        destLat: { type: Type.NUMBER, description: 'Incident latitude' },
        destLng: { type: Type.NUMBER, description: 'Incident longitude' },
        teamId: { type: Type.STRING, description: 'ID of dispatched response team' },
        incidentId: { type: Type.STRING, description: 'ID of target incident' },
      },
      required: ['originLat', 'originLng', 'destLat', 'destLng'],
    },
  },
  {
    name: 'createWorkOrder',
    description: 'Creates a binding municipal dispatch work order linking the incident to the assigned field team with priority and confirmed ETA.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        incidentId: { type: Type.STRING, description: 'Incident ID' },
        teamId: { type: Type.STRING, description: 'Team ID' },
        priority: { type: Type.STRING, description: 'Incident severity' },
        etaMinutes: { type: Type.NUMBER, description: 'Calculated arrival minutes' },
        instructions: { type: Type.STRING, description: 'Operational instructions for field crew' },
      },
      required: ['incidentId', 'teamId', 'priority', 'etaMinutes'],
    },
  },
  {
    name: 'notifyResponseTeam',
    description: 'Dispatches emergency alert and electronic work order to the field crew mobile terminal and radio channel.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        incidentId: { type: Type.STRING, description: 'Incident ID' },
        teamId: { type: Type.STRING, description: 'Response team ID' },
        message: { type: Type.STRING, description: 'Dispatch message' },
        channel: { type: Type.STRING, description: 'Communication channel' },
      },
      required: ['incidentId', 'teamId', 'message'],
    },
  },
  {
    name: 'updateIncidentStatus',
    description: 'Updates the lifecycle status and operational metadata of an incident.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        incidentId: { type: Type.STRING, description: 'Incident ID' },
        status: { type: Type.STRING, description: 'New status' },
        notes: { type: Type.STRING, description: 'Operational notes' },
        etaMinutes: { type: Type.NUMBER, description: 'Updated ETA' },
      },
      required: ['incidentId', 'status'],
    },
  },
  {
    name: 'detectIncidentClusters',
    description: 'Analyzes spatiotemporal density of recent similar reports to detect network-level infrastructure failures or cascading failures.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        incidentId: { type: Type.STRING, description: 'Incident ID' },
        incidentType: { type: Type.STRING, description: 'Incident category' },
        latitude: { type: Type.NUMBER, description: 'Incident latitude' },
        longitude: { type: Type.NUMBER, description: 'Incident longitude' },
        radiusKm: { type: Type.NUMBER, description: 'Cluster analysis radius in km' },
      },
      required: ['incidentId', 'incidentType', 'latitude', 'longitude'],
    },
  },
  {
    name: 'requestVerification',
    description: 'Requests on-site verification evidence, digital checklist, and telemetry confirmation from field personnel once repairs are conducted.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        incidentId: { type: Type.STRING, description: 'Incident ID' },
        teamId: { type: Type.STRING, description: 'Team ID' },
        verificationType: { type: Type.STRING, description: 'Type of verification' },
      },
      required: ['incidentId', 'teamId', 'verificationType'],
    },
  },
  {
    name: 'verifyResolution',
    description: 'Reasoning check on field telemetry, photographic evidence, and repair logs to confirm resolution or escalate if hazard persists.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        incidentId: { type: Type.STRING, description: 'Incident ID' },
        fieldReport: { type: Type.STRING, description: 'Field technician report' },
        completionPhotoProvided: { type: Type.BOOLEAN, description: 'Whether repair photo is attached' },
        pressureRestoredOrRoadCleared: { type: Type.BOOLEAN, description: 'Whether physical hazard is eliminated' },
      },
      required: ['incidentId', 'fieldReport', 'completionPhotoProvided', 'pressureRestoredOrRoadCleared'],
    },
  },
  {
    name: 'escalateIncident',
    description: 'Escalates uncontained or catastrophic incidents directly to Tier-1 Disaster Management and Central Command.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        incidentId: { type: Type.STRING, description: 'Incident ID' },
        reason: { type: Type.STRING, description: 'Escalation rationale' },
        targetTier: { type: Type.STRING, description: 'Target emergency command authority' },
        immediateActionsRequired: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Actions' },
      },
      required: ['incidentId', 'reason', 'targetTier'],
    },
  },
  {
    name: 'generateIncidentReport',
    description: 'Generates comprehensive post-incident executive briefing with full audit trail and response metrics.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        incidentId: { type: Type.STRING, description: 'Incident ID' },
      },
      required: ['incidentId'],
    },
  },
];
