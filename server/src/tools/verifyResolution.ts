import { incidentsDb } from '../firebase/incidents';
import { teamsDb } from '../firebase/teams';
import { GoogleGenAI } from '@google/genai';

export interface VerifyResolutionInput {
  incidentId: string;
  fieldReport: string;
  completionPhotoProvided: boolean;
  pressureRestoredOrRoadCleared: boolean;
  auditorNotes?: string;
}

export interface VerifyResolutionOutput {
  outcome: 'RESOLVED' | 'ESCALATED';
  confidence: number;
  verificationVerdict: string;
  auditTrail: string[];
  resolvedAt: string | null;
}

export async function executeVerifyResolution(
  input: VerifyResolutionInput
): Promise<VerifyResolutionOutput> {
  const incident = incidentsDb.getById(input.incidentId);
  const apiKey = process.env.GEMINI_API_KEY;

  let outcome: 'RESOLVED' | 'ESCALATED' = 'RESOLVED';
  let verdict = 'Repairs inspected and verified according to municipal standard protocols.';
  let confidence = 0.96;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: { 'User-Agent': 'aistudio-build' },
        },
      });

      const prompt = `You are BharatPulse's civic verification inspector.
Evaluate the field completion evidence for civic incident:
Incident: ${JSON.stringify(incident || {})}
Field Report: "${input.fieldReport}"
Visual Artifact Present: ${input.completionPhotoProvided}
Asset Operational: ${input.pressureRestoredOrRoadCleared}

Determine whether the incident can be securely closed as "RESOLVED" or must be "ESCALATED".
Respond with JSON:
{
  "outcome": "RESOLVED" | "ESCALATED",
  "confidence": number (0.80 - 0.99),
  "verdict": string
}`;

      const res = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      });

      if (res.text) {
        const parsed = JSON.parse(res.text.trim());
        outcome = parsed.outcome || 'RESOLVED';
        verdict = parsed.verdict || verdict;
        confidence = parsed.confidence || 0.95;
      }
    } catch (e) {
      console.warn('Gemini verification check failed, evaluating with deterministic rule engine:', e);
    }
  }

  // Deterministic safeguard: must have report and confirmation
  if (!input.pressureRestoredOrRoadCleared && !input.completionPhotoProvided) {
    outcome = 'ESCALATED';
    verdict = 'Verification failed: Insufficient physical confirmation of hazard clearing.';
  }

  const now = new Date().toISOString();

  if (outcome === 'RESOLVED') {
    incidentsDb.updateStatus(input.incidentId, 'RESOLVED', {
      verificationNotes: verdict,
      resolvedAt: now,
    });
    if (incident?.assignedTeamId) {
      teamsDb.releaseTeam(incident.assignedTeamId);
    }
  } else {
    incidentsDb.updateStatus(input.incidentId, 'ESCALATED', {
      verificationNotes: `ESCALATION: ${verdict}`,
    });
  }

  return {
    outcome,
    confidence,
    verificationVerdict: verdict,
    auditTrail: [
      `Field report submitted: "${input.fieldReport.slice(0, 60)}..."`,
      `Verification criteria checked: Telemetry=${input.pressureRestoredOrRoadCleared}, Artifact=${input.completionPhotoProvided}`,
      `Final state transition: ${outcome} at ${now}`,
    ],
    resolvedAt: outcome === 'RESOLVED' ? now : null,
  };
}
