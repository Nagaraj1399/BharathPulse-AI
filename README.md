# BHARATPULSE AI 🇮🇳
**"India's AI Operating System for Future Cities"**
*Listen. Understand. Act. Verify.*

---

## 1. Product Vision
BharatPulse AI is an autonomous civic-response platform engineered for the complex infrastructure and urbanization challenges Indian cities will face toward 2030.

Rather than presenting civic authorities with yet another passive dashboard, BharatPulse acts as an **autonomous operating agent**:
- **A citizen reports a real-world problem** using voice, text, photo, and geolocation in their native Indian language.
- **BharatPulse understands the problem**, identifies risks, checks adjacent schools and hospitals, selects optimal municipal response units, computes traffic-aware routing, generates binding work orders, and verifies physical resolution with on-site telemetry before closing the incident.
- **The Core Agent Loop**:
  $$\text{OBSERVE} \longrightarrow \text{UNDERSTAND} \longrightarrow \text{PLAN} \longrightarrow \text{INVESTIGATE} \longrightarrow \text{ACT} \longrightarrow \text{VERIFY} \longrightarrow \text{RESOLVE / ESCALATE}$$

Primary demonstration city: **Bengaluru, Karnataka, India**.

---

## 2. 3-Layer AI Architecture

```
                    ┌───────────────────────────────────────────────┐
                    │            CITIZEN / MUNICIPAL FIELD          │
                    │   Voice, Native Languages, Photos, Location   │
                    └───────────────────────┬───────────────────────┘
                                            │
                                            ▼
                    ┌───────────────────────────────────────────────┐
                    │               1. VOICE LAYER                  │
                    │       ElevenLabs Conversational Agent         │
                    │  - Natural Indian English & Regional Voices   │
                    │  - Real-time Speech-to-Text & Audio Playback  │
                    │  - Strict Confirmation (Zero Hallucination)   │
                    └───────────────────────┬───────────────────────┘
                                            │
                                            ▼
                    ┌───────────────────────────────────────────────┐
                    │               2. BRAIN LAYER                  │
                    │        Gemini Multimodal Reasoning            │
                    │             (gemini-3.8-flash)                │
                    │  - Multimodal Visual Evidence Analysis        │
                    │  - Incident Severity & Department Mapping     │
                    │  - Multi-Turn Function Calling Loop           │
                    │  - Spatial Cluster & Network Risk Detection   │
                    │  - Verification Reasoning & Audit Generation  │
                    └───────────────────────┬───────────────────────┘
                                            │
                                            ▼
                    ┌───────────────────────────────────────────────┐
                    │              3. ACTION LAYER                  │
                    │          Node.js Express Backend              │
                    │  - 12 Approved Municipal Backend Tools        │
                    │  - Google Maps Platform (Places & Routes)     │
                    │  - Firebase Firestore Data & Rule Enforcement │
                    │  - Real Work Order Dispatch & Radio Alerts    │
                    │  - Strict Parameter Validation & Audit Trail  │
                    └───────────────────────────────────────────────┘
```

> **Security Mandate**: Neither ElevenLabs nor Gemini is ever allowed direct, arbitrary database access or arbitrary code execution. Every real-world action must pass through predefined, strongly-typed backend tools.

---

## 3. The 12 Approved Agent Tools

| Tool Name | Description | Output |
| :--- | :--- | :--- |
| `classifyIncident` | Multimodal classification of incident category, severity, risks, and required departments | IncidentType, Severity, Confidence, Risks |
| `findNearbyCriticalPlaces` | Geospatial proximity search for schools, hospitals, metro stations, and police stations | Facilities within radius, closest node |
| `findAvailableResponseTeams` | Objective operational ranking based on capability match, availability, distance, and current load | Recommended squad, candidate squads |
| `calculateResponseRoute` | Computes road distance, polyline coordinates, and traffic-aware travel duration (ETA) | Route distance km, duration minutes, traffic status |
| `createWorkOrder` | Generates official municipal work order linked to incident and response unit | WorkOrderId, TeamId, Priority, Status, ETA |
| `notifyResponseTeam` | Dispatches radio alert / mobile notification to field crew terminal | Delivery confirmation, channel, timestamp |
| `updateIncidentStatus` | Updates incident lifecycle states (`RECEIVED` $\rightarrow$ `DISPATCHED` $\rightarrow$ `RESOLVED`) | Success state, timestamp |
| `detectIncidentClusters` | Spatiotemporal density analysis detecting network-level infrastructure stress | Cluster detected boolean, radius km, hypothesis |
| `requestVerification` | Dispatches post-remediation evidence checklist to on-site crew | Verification request ID, required artifacts |
| `verifyResolution` | Evaluates field evidence, photographic proof, and pressure telemetry to confirm closure | `RESOLVED` vs `ESCALATED` verdict, confidence |
| `escalateIncident` | Escalates uncontained hazards directly to Disaster Management / Chief Commissioner | Escalation ID, assigned command authority |
| `generateIncidentReport` | Produces comprehensive post-incident executive briefing with full audit trail | Report ID, executive summary, timeline metrics |

---

## 4. Primary 90-Second Demo

Click **RUN 90-SECOND DEMO** on the header or landing page to trigger the complete live demonstration:

1. **Citizen Voice Intake**:
   Citizen speaks: *"There is a major water leak outside a school and the road is flooding."*
2. **Gemini Multimodal Analysis**:
   Classifies: `WATER_LEAK` / `HIGH` severity. Identifies public safety and pedestrian risks.
3. **Critical Facility Scan**:
   Detects **Indiranagar Government High School & Pre-University College** at 180 meters.
4. **Response Team Selection**:
   Objective operational ranking selects **BWSSB Rapid Water Unit 01** based on valve isolation and pipeline capabilities.
5. **Route & ETA Calculation**:
   Route calculated across Bengaluru grid: **2.4 km**, confirmed arrival time **8 minutes**.
6. **Work Order & Dispatch**:
   Work order `WO-BWSSB-2048` created. Emergency radio dispatch alert transmitted.
7. **Network Cluster Risk Detection**:
   Evaluates 3 nearby water pipeline stresses within 1.8km radius $\rightarrow$ displays **NETWORK-LEVEL RISK DETECTED**.
8. **Confirmed Voice Readback**:
   The voice agent states *only confirmed facts*:
   *"I've created incident BP-2048. A nearby water-response team has been assigned. Their estimated arrival time is eight minutes."*
9. **Field Verification & Resolution**:
   On-site crew uploads sleeve welding confirmation and pressure normalization $\rightarrow$ incident transitions to **RESOLVED**.

---

## 5. Multilingual Citizen Support
Supported languages with native script rendering:
- **English** (`en`)
- **Hindi** (`hi`) - हिन्दी
- **Kannada** (`kn`) - ಕನ್ನಡ
- **Tamil** (`ta`) - தமிழ்
- **Telugu** (`te`) - తెలుగు
- **Bengali** (`bn`) - বাংলা

Citizen voice reports are transcribed in their native language and normalized into structured municipal JSON for the English-based Command Center.

---

## 6. Tech Stack
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Web Speech API.
- **Backend**: Node.js, Express, TypeScript, `tsx`.
- **AI Brain**: `@google/genai` TypeScript SDK (`gemini-3.8-flash`), function calling, multimodal vision.
- **Voice Agent**: ElevenLabs React SDK / Conversational Voice Layer (`@elevenlabs/react`).
- **Geospatial & Mapping**: Google Maps Platform, Places API, Routes API, Custom Bengaluru Vector Tactical Canvas.
- **Database & Security**: Firebase Firestore, Firebase Authentication, Zero-Trust `firestore.rules`.

---

## 7. Environment Setup

Create `.env` based on `.env.example`:

```bash
# Gemini API Key (Server-Side - powers Gemini reasoning & Gemini Live native voice)
GEMINI_API_KEY=your_gemini_api_key

# Google Maps Platform (Places, Routes, Maps)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Firebase Firestore Configuration
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY=your_firebase_private_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
```

### Running Locally
```bash
# Install dependencies
npm install

# Start development full-stack server (runs on port 3000)
npm run dev

# Build for production
npm run build
```

---

## 8. Graceful Fallback & Resilience
BharatPulse AI is architected never to crash:
- **If Gemini API Key is omitted**: The agent uses an algorithmic rule-based classification and reasoning pipeline that follows 100% of the tool calling contracts.
- **If Google Maps Key is omitted**: The system activates tactical simulated routing across Bengaluru city streets with realistic speeds (18–22 km/h) and real Haversine distance calculations.
- **If ElevenLabs Key is omitted**: The client activates browser Web Speech API voice synthesis with natural Indian English accents.
- **If Firebase credentials are omitted**: The backend automatically uses the in-memory Civic Store pre-seeded with 12 Bengaluru incidents, 8 response teams, 6 critical facilities, and 5 risk zones.

---

## 9. 2030 Future Cities Roadmap
1. **IoT Sensor Ingestion**: Real-time integration with smart water meters, stormwater level ultrasonic sensors, and transformer thermal probes.
2. **Citizen WhatsApp & IVR Gateway**: Voice incident reporting via low-bandwidth telephony channels.
3. **Automated Drone Verification**: Autonomous drone dispatch to capture aerial orthomosaic confirmation of cleared roadways and flood basins.
