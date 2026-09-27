import {
  Incident,
  ResponseTeam,
  CriticalFacility,
  RiskZone,
  AgentAction,
  NotificationItem,
  CyberScanResult,
  CyberIncidentReport,
  CyberStats,
} from '../../shared/types';

const API_BASE = '/api';

export const api = {
  // Incidents
  async getIncidents(): Promise<Incident[]> {
    const res = await fetch(`${API_BASE}/incidents`);
    if (!res.ok) throw new Error('Failed to fetch incidents');
    return res.json();
  },

  async getIncident(id: string): Promise<Incident & { actions?: AgentAction[]; notifications?: NotificationItem[] }> {
    const res = await fetch(`${API_BASE}/incidents/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch incident ${id}`);
    return res.json();
  },

  async createIncident(data: {
    description: string;
    latitude?: number;
    longitude?: number;
    language?: string;
    imageUrl?: string;
    address?: string;
  }): Promise<Incident> {
    const res = await fetch(`${API_BASE}/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create incident');
    return res.json();
  },

  async verifyIncident(id: string, notes?: string, photoUrl?: string): Promise<Incident> {
    const res = await fetch(`${API_BASE}/incidents/${id}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes, photoUrl }),
    });
    if (!res.ok) throw new Error('Failed to verify incident');
    return res.json();
  },

  // Teams & Facilities & Risk
  async getTeams(): Promise<ResponseTeam[]> {
    const res = await fetch(`${API_BASE}/teams`);
    if (!res.ok) throw new Error('Failed to fetch teams');
    return res.json();
  },

  async getCriticalFacilities(): Promise<CriticalFacility[]> {
    const res = await fetch(`${API_BASE}/critical-facilities`);
    if (!res.ok) throw new Error('Failed to fetch critical facilities');
    return res.json();
  },

  async getRiskZones(): Promise<RiskZone[]> {
    const res = await fetch(`${API_BASE}/risk-zones`);
    if (!res.ok) throw new Error('Failed to fetch risk zones');
    return res.json();
  },

  // Agent Actions
  async getAgentActions(incidentId?: string): Promise<AgentAction[]> {
    const url = incidentId ? `${API_BASE}/agent/actions?incidentId=${incidentId}` : `${API_BASE}/agent/actions`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch agent actions');
    return res.json();
  },

  async runAgent(incidentId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/agent/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ incidentId }),
    });
    if (!res.ok) throw new Error('Failed to trigger agent orchestration');
    return res.json();
  },

  async executeTool(tool: string, args: Record<string, any>, incidentId?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/agent/tool`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tool, args, incidentId }),
    });
    if (!res.ok) throw new Error(`Failed to execute tool ${tool}`);
    return res.json();
  },

  // Gemini Live API Endpoints
  async getLiveToken(): Promise<{
    success: boolean;
    token: string;
    model: string;
    systemInstruction: string;
    tools: any[];
  }> {
    const res = await fetch(`${API_BASE}/live/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to acquire Gemini Live ephemeral token');
    }
    return res.json();
  },

  async liveExecuteTool(
    toolName: string,
    args: Record<string, any>,
    incidentId?: string
  ): Promise<{ success: boolean; result: any }> {
    const res = await fetch(`${API_BASE}/live/execute-tool`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toolName, args, incidentId }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Live tool execution failed for ${toolName}`);
    }
    return res.json();
  },

  async getLiveTools(): Promise<{ tools: any[] }> {
    const res = await fetch(`${API_BASE}/live/tools`);
    if (!res.ok) throw new Error('Failed to fetch Live tool declarations');
    return res.json();
  },

  // Voice Webhook Calls
  async voiceTranscribe(data: {
    audio: string;
    mimeType?: string;
    language?: string;
  }): Promise<{ success: boolean; text: string }> {
    const res = await fetch(`${API_BASE}/voice/transcribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Voice transcribe failed');
    return res.json();
  },

  async voiceCreateIncident(data: {
    description: string;
    latitude?: number;
    longitude?: number;
    language?: string;
    imageUrl?: string;
    address?: string;
  }): Promise<{
    success: boolean;
    incidentId: string;
    confirmedEtaMinutes?: number;
    assignedTeam?: string;
    message: string;
  }> {
    const res = await fetch(`${API_BASE}/voice/create-incident`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Voice create incident failed');
    return res.json();
  },

  // Demo Control
  async startDemo(language = 'en'): Promise<any> {
    const res = await fetch(`${API_BASE}/demo/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language }),
    });
    if (!res.ok) throw new Error('Failed to start demo');
    return res.json();
  },

  async stepVerifyDemo(incidentId = 'BP-2048'): Promise<any> {
    const res = await fetch(`${API_BASE}/demo/step-verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ incidentId }),
    });
    if (!res.ok) throw new Error('Failed to verify demo incident');
    return res.json();
  },

  async resetDemo(): Promise<any> {
    const res = await fetch(`${API_BASE}/demo/reset`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to reset demo');
    return res.json();
  },

  // Cybersecurity & Suspicious Link Checker API
  async scanCyberLink(url: string): Promise<CyberScanResult> {
    const res = await fetch(`${API_BASE}/cyber/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Link verification is temporarily unavailable.');
    }
    return data;
  },

  async reportCyberIncident(data: {
    url: string;
    sanitizedUrl?: string;
    domain: string;
    riskLevel: string;
    riskScore: number;
    flags: string[];
    citizenNotes?: string;
    clickedScenario?: string;
  }): Promise<CyberIncidentReport> {
    const res = await fetch(`${API_BASE}/cyber/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Failed to submit cyber incident report');
    }
    return result;
  },

  async getCyberStats(): Promise<CyberStats> {
    const res = await fetch(`${API_BASE}/cyber/stats`);
    if (!res.ok) throw new Error('Failed to fetch cyber stats');
    return res.json();
  },

  async chatCyberAgent(
    message: string,
    currentScan?: CyberScanResult | null,
    language = 'en'
  ): Promise<{ reply: string }> {
    const res = await fetch(`${API_BASE}/cyber/agent/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, currentScan, language }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Cyber Suraksha Agent unavailable');
    }
    return data;
  },
};
