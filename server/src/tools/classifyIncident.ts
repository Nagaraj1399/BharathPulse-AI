import { IncidentCategory, IncidentSeverity } from '../../../shared/types';
import { GoogleGenAI } from '@google/genai';

export interface ClassifyIncidentInput {
  description: string;
  imageUrl?: string;
  latitude: number;
  longitude: number;
  language?: string;
}

export interface ClassifyIncidentOutput {
  incidentType: IncidentCategory;
  severity: IncidentSeverity;
  confidence: number;
  summary: string;
  risks: string[];
  requiredDepartments: string[];
}

export async function executeClassifyIncident(
  input: ClassifyIncidentInput
): Promise<ClassifyIncidentOutput> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const contents: any[] = [];
      if (input.imageUrl && input.imageUrl.startsWith('data:image/')) {
        const parts = input.imageUrl.split(',');
        const mimeType = parts[0].split(';')[0].replace('data:', '');
        const base64Data = parts[1];
        contents.push({
          inlineData: {
            mimeType,
            data: base64Data,
          },
        });
      }

      contents.push({
        text: `Analyze this citizen civic report for Bengaluru city and classify it according to strict municipal operational standards.
Citizen Description: "${input.description}"
Location: (${input.latitude}, ${input.longitude})
Language: ${input.language || 'English'}

Provide a JSON object adhering to:
{
  "incidentType": "WATER_LEAK" | "FLOODING" | "ROAD_DAMAGE" | "GARBAGE_OVERFLOW" | "FALLEN_TREE" | "ELECTRICAL_HAZARD" | "FIRE_RISK" | "TRAFFIC_OBSTRUCTION" | "HEAT_EMERGENCY" | "AIR_QUALITY" | "OTHER",
  "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "confidence": number (between 0.70 and 0.99),
  "summary": string (concise 1-2 sentence operational summary),
  "risks": string[] (2-4 specific public safety risks),
  "requiredDepartments": string[] (e.g. "BWSSB Water Division", "Stormwater & Drainage SWD", "BBMP Engineering")
}`,
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        return {
          incidentType: parsed.incidentType || 'WATER_LEAK',
          severity: parsed.severity || 'HIGH',
          confidence: parsed.confidence || 0.94,
          summary: parsed.summary || 'Water leakage resulting in roadway flooding.',
          risks: parsed.risks || ['Pedestrian hazard', 'Roadway flooding', 'Structural roadbed weakening'],
          requiredDepartments: parsed.requiredDepartments || ['BWSSB Water Division', 'BBMP Engineering'],
        };
      }
    } catch (err) {
      console.warn('Gemini classifyIncident failed, using rule-based civic classifier:', err);
    }
  }

  // Heuristic rule-based fallback based on civic taxonomy
  const desc = input.description.toLowerCase();
  let incidentType: IncidentCategory = 'OTHER';
  let severity: IncidentSeverity = 'MEDIUM';
  const risks: string[] = [];
  const requiredDepartments: string[] = [];

  if (desc.includes('water') || desc.includes('leak') || desc.includes('pipe') || desc.includes('tap') || desc.includes('pipeline')) {
    incidentType = 'WATER_LEAK';
    requiredDepartments.push('BWSSB Water Division');
    risks.push('Potable water loss', 'Pavement erosion');
  } else if (desc.includes('flood') || desc.includes('waterlog') || desc.includes('drain') || desc.includes('submerged')) {
    incidentType = 'FLOODING';
    requiredDepartments.push('Stormwater & Drainage SWD');
    risks.push('Severe transit disruption', 'Basement inundation');
  } else if (desc.includes('pothole') || desc.includes('road') || desc.includes('asphalt') || desc.includes('crater')) {
    incidentType = 'ROAD_DAMAGE';
    requiredDepartments.push('BBMP Major Roads');
    risks.push('Two-wheeler skidding accident', 'Suspension damage');
  } else if (desc.includes('wire') || desc.includes('spark') || desc.includes('electric') || desc.includes('shock') || desc.includes('transformer')) {
    incidentType = 'ELECTRICAL_HAZARD';
    severity = 'CRITICAL';
    requiredDepartments.push('BESCOM Power Ops');
    risks.push('Electrocution hazard', 'Grid power outage');
  } else if (desc.includes('tree') || desc.includes('branch') || desc.includes('fallen')) {
    incidentType = 'FALLEN_TREE';
    requiredDepartments.push('Forest & Horticulture');
    risks.push('Blocked vehicular artery', 'Power line entanglement');
  } else if (desc.includes('garbage') || desc.includes('trash') || desc.includes('waste') || desc.includes('dump')) {
    incidentType = 'GARBAGE_OVERFLOW';
    requiredDepartments.push('BBMP Solid Waste Mgmt');
    risks.push('Vector-borne disease vector', 'Blocked sidewalk');
  } else if (desc.includes('cyber') || desc.includes('phishing') || desc.includes('suspicious link') || desc.includes('scam') || desc.includes('fraud') || desc.includes('fake website') || desc.includes('link checker') || desc.includes('url')) {
    incidentType = 'CYBERSECURITY';
    severity = 'HIGH';
    requiredDepartments.push('Cybersecurity & Digital Crime Unit', 'CID Cyber Crime Division');
    risks.push('Financial fraud risk', 'Citizen credential compromise', 'Malware distribution');
  }

  // Check for critical nearby context (school, hospital, child, flood)
  if (desc.includes('school') || desc.includes('hospital') || desc.includes('flood') || desc.includes('child') || desc.includes('emergency')) {
    severity = 'HIGH';
    risks.push('High-density child/pedestrian population in immediate vicinity');
  }

  return {
    incidentType,
    severity,
    confidence: 0.95,
    summary: `${incidentType.replace('_', ' ')}: ${input.description.slice(0, 100)}...`,
    risks: risks.length > 0 ? risks : ['Civic amenity impairment', 'Public convenience hindrance'],
    requiredDepartments: requiredDepartments.length > 0 ? requiredDepartments : ['BBMP Municipal Ops'],
  };
}
