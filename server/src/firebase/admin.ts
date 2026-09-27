import {
  Incident,
  ResponseTeam,
  CriticalFacility,
  WorkOrder,
  AgentAction,
  NotificationItem,
  RiskZone,
} from '../../../shared/types';

// In-memory persistent state (synced with Firebase if credentials configured)
class CivicStore {
  incidents: Map<string, Incident> = new Map();
  teams: Map<string, ResponseTeam> = new Map();
  facilities: Map<string, CriticalFacility> = new Map();
  workOrders: Map<string, WorkOrder> = new Map();
  agentActions: AgentAction[] = [];
  notifications: NotificationItem[] = [];
  riskZones: Map<string, RiskZone> = new Map();
  cyberStats = {
    linksChecked: 148,
    suspiciousDetected: 41,
    highRiskDetected: 27,
    reportsSubmitted: 19,
    routedViaN8n: 19,
  };

  constructor() {
    this.seedInitialData();
  }

  seedInitialData() {
    // 8 Seeded Municipal Response Teams in Bengaluru
    const initialTeams: ResponseTeam[] = [
      {
        id: 'TEAM-BWSSB-01',
        name: 'BWSSB Rapid Water Unit 01',
        department: 'BWSSB Water Division',
        capabilities: ['Water Pipeline Repair', 'High Pressure Pumping', 'Valve Isolation'],
        latitude: 12.9754,
        longitude: 77.6052,
        availability: 'AVAILABLE',
        currentLoad: 0,
        contactPhone: '+91 80 2294 5101',
        vehicleId: 'KA-01-GA-3490',
      },
      {
        id: 'TEAM-SWD-02',
        name: 'BBMP Stormwater Drainage Crew 02',
        department: 'Stormwater & Drainage SWD',
        capabilities: ['Flood Dewatering', 'Drain Desilting', 'Culvert Clearing'],
        latitude: 12.9698,
        longitude: 77.6354,
        availability: 'AVAILABLE',
        currentLoad: 1,
        contactPhone: '+91 80 2297 5520',
        vehicleId: 'KA-03-MG-7821',
      },
      {
        id: 'TEAM-BBMP-RD-03',
        name: 'BBMP Major Roads Emergency Unit',
        department: 'BBMP Engineering',
        capabilities: ['Pothole Jetpatcher', 'Asphalt Laying', 'Barricading'],
        latitude: 12.9352,
        longitude: 77.6245,
        availability: 'AVAILABLE',
        currentLoad: 0,
        contactPhone: '+91 80 2222 1188',
        vehicleId: 'KA-05-AB-1200',
      },
      {
        id: 'TEAM-BESCOM-04',
        name: 'BESCOM Quick Restoration Squad 04',
        department: 'BESCOM Power Ops',
        capabilities: ['High Voltage Safety', 'Transformer Repair', 'Live Wire Grounding'],
        latitude: 12.9812,
        longitude: 77.6401,
        availability: 'AVAILABLE',
        currentLoad: 0,
        contactPhone: '+91 80 2287 3344',
        vehicleId: 'KA-04-EV-9901',
      },
      {
        id: 'TEAM-FIRE-05',
        name: 'Bengaluru Fire & Rescue Taskforce',
        department: 'Fire & Emergency Services',
        capabilities: ['Tree Cutting Crane', 'Water Extraction', 'Hazardous Rescue'],
        latitude: 12.9556,
        longitude: 77.5852,
        availability: 'AVAILABLE',
        currentLoad: 0,
        contactPhone: '+91 80 2297 1500',
        vehicleId: 'KA-01-F-1011',
      },
      {
        id: 'TEAM-BTP-06',
        name: 'BTP Traffic Corridor Flying Squad',
        department: 'Bengaluru Traffic Police',
        capabilities: ['Traffic Diversion', 'Heavy Towing', 'Obstruction Removal'],
        latitude: 12.9288,
        longitude: 77.5834,
        availability: 'AVAILABLE',
        currentLoad: 1,
        contactPhone: '+91 80 2294 3030',
        vehicleId: 'KA-02-G-4455',
      },
      {
        id: 'TEAM-SWM-07',
        name: 'BBMP CleanCity Mechanized Sweepers',
        department: 'BBMP Solid Waste Mgmt',
        capabilities: ['Debris Removal', 'Compactor Ops', 'Biowaste Neutralization'],
        latitude: 12.9912,
        longitude: 77.6872,
        availability: 'AVAILABLE',
        currentLoad: 0,
        contactPhone: '+91 80 2266 0000',
        vehicleId: 'KA-53-Z-8899',
      },
      {
        id: 'TEAM-BWSSB-08',
        name: 'BWSSB South Sub-Division Crew 03',
        department: 'BWSSB Water Division',
        capabilities: ['Main Line Welding', 'Emergency Valve Control', 'Water Tanker Deployment'],
        latitude: 12.9189,
        longitude: 77.6012,
        availability: 'AVAILABLE',
        currentLoad: 0,
        contactPhone: '+91 80 2294 5108',
        vehicleId: 'KA-05-H-4411',
      },
      {
        id: 'TEAM-CYBER-09',
        name: 'Bengaluru Cyber Crime Rapid Cell (CID / CERT-In Liaison)',
        department: 'Cybersecurity & Digital Crime Unit',
        capabilities: ['Phishing Domain Takedown', 'SMS/WhatsApp Scam Neutralization', 'Financial Fraud Freeze 1930', 'Cyber'],
        latitude: 12.9785,
        longitude: 77.5912,
        availability: 'AVAILABLE',
        currentLoad: 1,
        contactPhone: '1930 / +91 80 2209 4444',
        vehicleId: 'KA-01-CYBER-01',
      },
    ];

    initialTeams.forEach((t) => this.teams.set(t.id, t));

    // 6 Seeded Critical Facilities in Bengaluru
    const initialFacilities: CriticalFacility[] = [
      {
        id: 'FAC-SCH-01',
        name: 'Indiranagar Government High School & Pre-University College',
        type: 'school',
        latitude: 12.9782,
        longitude: 77.6415,
        vicinity: '100ft Road, Indiranagar, Bengaluru',
        vulnerabilityNotes: 'High footfall of 1,200 students during morning (08:00) and afternoon (15:30) hours.',
      },
      {
        id: 'FAC-SCH-02',
        name: 'National Public School Koramangala',
        type: 'school',
        latitude: 12.9348,
        longitude: 77.6256,
        vicinity: 'National Games Village, Koramangala, Bengaluru',
        vulnerabilityNotes: 'Narrow access lane; flooding causes severe traffic gridlock and child endangerment.',
      },
      {
        id: 'FAC-HOS-03',
        name: 'Manipal Hospital Hal Old Airport Road',
        type: 'hospital',
        latitude: 12.9592,
        longitude: 77.6534,
        vicinity: 'Old Airport Road, Kodihalli, Bengaluru',
        vulnerabilityNotes: 'Critical emergency ambulance corridor; waterlogging blocks trauma admissions.',
      },
      {
        id: 'FAC-MET-04',
        name: 'MG Road Metro Interchange Station',
        type: 'metro_station',
        latitude: 12.9756,
        longitude: 77.6067,
        vicinity: 'MG Road / Brigade Road Junction, Bengaluru',
        vulnerabilityNotes: 'Mass rapid transit hub with 85,000 daily commuters.',
      },
      {
        id: 'FAC-HOS-05',
        name: 'Apollo Hospital Bannerghatta Road',
        type: 'hospital',
        latitude: 12.8932,
        longitude: 77.5978,
        vicinity: 'Bannerghatta Main Road, Bengaluru',
        vulnerabilityNotes: 'Super-specialty facility requiring uninterrupted utility supply.',
      },
      {
        id: 'FAC-POL-06',
        name: 'Cubbon Park Traffic & Law Enforcement Hub',
        type: 'police_station',
        latitude: 12.9734,
        longitude: 77.5921,
        vicinity: 'Kasturba Road, Bengaluru Central',
        vulnerabilityNotes: 'Central coordination node for emergency response routing.',
      },
    ];

    initialFacilities.forEach((f) => this.facilities.set(f.id, f));

    // 5 Seeded Risk Zones in Bengaluru
    const initialRiskZones: RiskZone[] = [
      {
        id: 'ZONE-KORM-01',
        name: 'Koramangala 4th Block - Ejipura Stormwater Basin',
        category: 'FLOODING',
        riskLevel: 'HIGH',
        latitude: 12.9345,
        longitude: 77.6278,
        radiusMeters: 1400,
        contributingSignals: [
          'Secondary SWD bottleneck during pre-monsoon showers',
          'Silt buildup at Bellandur lake feeder drain',
          'High density of basements and commercial complexes',
        ],
        recommendedActions: [
          'Pre-position high-capacity dewatering pumps',
          'Activate automated water level radar alert at 85% capacity',
        ],
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'ZONE-INDIRA-02',
        name: 'Indiranagar 12th Main Pipeline & Drainage Sector',
        category: 'WATER_INFRASTRUCTURE',
        riskLevel: 'ELEVATED',
        latitude: 12.9778,
        longitude: 77.6402,
        radiusMeters: 1100,
        contributingSignals: [
          'Aging ductile iron water mains under variable pressure cycles',
          'Cluster of 3 reported pipeline joint stresses in past 48 hours',
          'Dense commercial F&B water withdrawal spikes',
        ],
        recommendedActions: [
          'Deploy BWSSB acoustic leak detection vehicle',
          'Throttle sector valve 4B to relieve nocturnal pressure spike',
        ],
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'ZONE-WHITE-03',
        name: 'Whitefield ITPL Corridor Pavement Vulnerability',
        category: 'ROAD_HAZARDS',
        riskLevel: 'MODERATE',
        latitude: 12.9856,
        longitude: 77.7289,
        radiusMeters: 2200,
        contributingSignals: [
          'Heavy axle construction vehicle load during metro expansion',
          'Water seepage causing asphalt sub-base deterioration',
        ],
        recommendedActions: [
          'Jet-patching schedule prioritized for outer ring road access',
          'BTP heavy vehicle diversion during peak hours',
        ],
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'ZONE-ECITY-04',
        name: 'Electronic City Phase 1 Thermal & Power Substation',
        category: 'ELECTRICAL_GRID',
        riskLevel: 'MODERATE',
        latitude: 12.8452,
        longitude: 77.6601,
        radiusMeters: 1500,
        contributingSignals: [
          'Transformer heat signature elevated by 14°C above baseline',
          'Peak industrial air-conditioning load',
        ],
        recommendedActions: [
          'Infrared thermography scan by BESCOM Flying Squad',
          'Load balancing to Phase 2 secondary feeder',
        ],
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'ZONE-ORR-05',
        name: 'Bellandur-Marathahalli Outer Ring Road Urban Heat Zone',
        category: 'HEAT_ISLAND',
        riskLevel: 'HIGH',
        latitude: 12.9367,
        longitude: 77.6892,
        radiusMeters: 1800,
        contributingSignals: [
          'Dense concrete cover exceeding 88% surface area',
          'Lack of mature canopy along central transit median',
        ],
        recommendedActions: [
          'Activate misting stations at public bus stops',
          'Issue hydration advisories for outdoor delivery workers',
        ],
        lastUpdated: new Date().toISOString(),
      },
    ];

    initialRiskZones.forEach((z) => this.riskZones.set(z.id, z));

    // 12 Initial Incidents (representing active & historical civic life)
    const initialIncidents: Incident[] = [
      {
        id: 'BP-1021',
        type: 'WATER_LEAK',
        description: 'Persistent low pressure burst near Indiranagar 100ft road commercial plaza with clean potable water overflowing into sidewalk gutter.',
        language: 'en',
        latitude: 12.9765,
        longitude: 77.6391,
        address: '100 Feet Rd, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038',
        severity: 'MEDIUM',
        confidence: 0.94,
        status: 'RESOLVED',
        assignedTeamId: 'TEAM-BWSSB-01',
        assignedTeamName: 'BWSSB Rapid Water Unit 01',
        criticalFacilities: [],
        imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
        verificationPhotoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        aiSummary: 'Main feeder valve seal cracked. BWSSB dispatched, pressure relieved, flange replaced.',
        workOrderId: 'WO-BWSSB-1021',
        etaMinutes: 12,
        resolvedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
      {
        id: 'BP-1022',
        type: 'WATER_LEAK',
        description: 'Underground pipe leak forming a bubbling sinkhole near 12th Main junction.',
        language: 'en',
        latitude: 12.9789,
        longitude: 77.6418,
        address: '12th Main Rd, Indiranagar, Bengaluru, Karnataka 560008',
        severity: 'HIGH',
        confidence: 0.92,
        status: 'RESOLVED',
        assignedTeamId: 'TEAM-BWSSB-01',
        assignedTeamName: 'BWSSB Rapid Water Unit 01',
        criticalFacilities: [initialFacilities[0]],
        imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
        verificationPhotoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        aiSummary: 'Pipeline burst 180m from Indiranagar Govt High School. Repaired successfully.',
        clusterHypothesis: 'Part of Indiranagar 12th Main pipeline pressure anomaly cluster.',
        workOrderId: 'WO-BWSSB-1022',
        etaMinutes: 9,
        resolvedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        createdAt: new Date(Date.now() - 3600000 * 3.5).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 'BP-1023',
        type: 'ROAD_DAMAGE',
        description: 'Large asphalt crater after heavy rain causing motorcyclists to swerve into oncoming traffic.',
        language: 'kn',
        latitude: 12.9341,
        longitude: 77.6189,
        address: 'Koramangala 80 Feet Rd, 4th Block, Bengaluru',
        severity: 'HIGH',
        confidence: 0.91,
        status: 'ON_SITE',
        assignedTeamId: 'TEAM-BBMP-RD-03',
        assignedTeamName: 'BBMP Major Roads Emergency Unit',
        criticalFacilities: [initialFacilities[1]],
        imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
        verificationPhotoUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
        aiSummary: '3.2m pothole posing severe vehicular risk near school zone. Jetpatcher unit deploying mastic asphalt.',
        workOrderId: 'WO-BBMP-1023',
        etaMinutes: 4,
        resolvedAt: null,
        createdAt: new Date(Date.now() - 3600000 * 1.5).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 0.4).toISOString(),
      },
      {
        id: 'BP-1024',
        type: 'ELECTRICAL_HAZARD',
        description: 'Sparking transformer with oil dripping on pavement near busy bus shelter.',
        language: 'hi',
        latitude: 12.9815,
        longitude: 77.6409,
        address: 'HAL 3rd Stage, Indiranagar, Bengaluru',
        severity: 'CRITICAL',
        confidence: 0.97,
        status: 'DISPATCHED',
        assignedTeamId: 'TEAM-BESCOM-04',
        assignedTeamName: 'BESCOM Quick Restoration Squad 04',
        criticalFacilities: [initialFacilities[0]],
        imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
        verificationPhotoUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
        aiSummary: 'Transformer arc flash hazard within 250m of school. Power isolated remotely; field squad en route.',
        workOrderId: 'WO-BESCOM-1024',
        etaMinutes: 6,
        resolvedAt: null,
        createdAt: new Date(Date.now() - 3600000 * 0.8).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 0.2).toISOString(),
      },
      {
        id: 'BP-1025',
        type: 'GARBAGE_OVERFLOW',
        description: 'Commercial vegetable market dump blocking pedestrian walkway and attracting stray animals.',
        language: 'ta',
        latitude: 12.9271,
        longitude: 77.5852,
        address: 'Jayanagar 4th Block Market, Bengaluru',
        severity: 'MEDIUM',
        confidence: 0.89,
        status: 'DISPATCHING',
        assignedTeamId: 'TEAM-SWM-07',
        assignedTeamName: 'BBMP CleanCity Mechanized Sweepers',
        criticalFacilities: [],
        imageUrl: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=800&q=80',
        verificationPhotoUrl: 'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?auto=format&fit=crop&w=800&q=80',
        aiSummary: 'Solid waste accumulation exceeding 2 metric tons. Compactor unit assigned.',
        workOrderId: 'WO-SWM-1025',
        etaMinutes: 18,
        resolvedAt: null,
        createdAt: new Date(Date.now() - 3600000 * 0.5).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'BP-1026',
        type: 'FALLEN_TREE',
        description: 'Gulmohar tree limb severed in gusty wind blocking one lane of MG Road.',
        language: 'en',
        latitude: 12.9748,
        longitude: 77.6082,
        address: 'Mahatma Gandhi Rd, Bengaluru',
        severity: 'HIGH',
        confidence: 0.95,
        status: 'RESOLVED',
        assignedTeamId: 'TEAM-FIRE-05',
        assignedTeamName: 'Bengaluru Fire & Rescue Taskforce',
        criticalFacilities: [initialFacilities[3]],
        imageUrl: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
        verificationPhotoUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
        aiSummary: 'Heavy limb cleared using power saws. Traffic flow restored within 24 minutes.',
        workOrderId: 'WO-FIRE-1026',
        etaMinutes: 8,
        resolvedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        createdAt: new Date(Date.now() - 3600000 * 4.8).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
      {
        id: 'BP-1027',
        type: 'TRAFFIC_OBSTRUCTION',
        description: 'Multi-axle container breakdown right at the entrance of Old Airport Road flyover.',
        language: 'te',
        latitude: 12.9587,
        longitude: 77.6512,
        address: 'Old Airport Rd near Domlur Flyover, Bengaluru',
        severity: 'HIGH',
        confidence: 0.93,
        status: 'ON_SITE',
        assignedTeamId: 'TEAM-BTP-06',
        assignedTeamName: 'BTP Traffic Corridor Flying Squad',
        criticalFacilities: [initialFacilities[2]],
        imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
        verificationPhotoUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
        aiSummary: 'Critical hospital corridor bottleneck. Heavy recovery crane hooked up for towing.',
        workOrderId: 'WO-BTP-1027',
        etaMinutes: 3,
        resolvedAt: null,
        createdAt: new Date(Date.now() - 3600000 * 1.1).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 0.1).toISOString(),
      },
      {
        id: 'BP-1028',
        type: 'FLOODING',
        description: 'Stormwater overflow entering residential basements in HSR Sector 6.',
        language: 'en',
        latitude: 12.9156,
        longitude: 77.6389,
        address: '14th Main Rd, HSR Layout Sector 6, Bengaluru',
        severity: 'CRITICAL',
        confidence: 0.96,
        status: 'VERIFYING',
        assignedTeamId: 'TEAM-SWD-02',
        assignedTeamName: 'BBMP Stormwater Drainage Crew 02',
        criticalFacilities: [],
        imageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80',
        verificationPhotoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        aiSummary: 'Dewatering pumps cleared 85,000 liters. Awaiting field sensor verification and resident confirmation.',
        workOrderId: 'WO-SWD-1028',
        etaMinutes: 11,
        resolvedAt: null,
        createdAt: new Date(Date.now() - 3600000 * 2.5).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 0.3).toISOString(),
      },
      {
        id: 'BP-1029',
        type: 'AIR_QUALITY',
        description: 'Open burning of dry leaves and plastic packaging behind commercial tech park.',
        language: 'en',
        latitude: 12.9899,
        longitude: 77.7123,
        address: 'Kundalahalli Gate, Whitefield, Bengaluru',
        severity: 'LOW',
        confidence: 0.88,
        status: 'RESOLVED',
        assignedTeamId: 'TEAM-FIRE-05',
        assignedTeamName: 'Bengaluru Fire & Rescue Taskforce',
        criticalFacilities: [],
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
        verificationPhotoUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80',
        aiSummary: 'Localized fire extinguished; BBMP health marshal issued violation penalty.',
        resolvedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
        createdAt: new Date(Date.now() - 3600000 * 7).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
      },
      {
        id: 'BP-1030',
        type: 'HEAT_EMERGENCY',
        description: 'Transit passenger collapsed from suspected heat stroke at bus terminus.',
        language: 'kn',
        latitude: 12.9761,
        longitude: 77.5721,
        address: 'Kempegowda Bus Station Majestic, Bengaluru',
        severity: 'HIGH',
        confidence: 0.94,
        status: 'RESOLVED',
        assignedTeamId: null,
        criticalFacilities: [initialFacilities[5]],
        imageUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80',
        verificationPhotoUrl: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
        aiSummary: 'First responder ORS administered; 108 ambulance shifted patient to Victoria Hospital emergency ward.',
        resolvedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
        createdAt: new Date(Date.now() - 3600000 * 3.7).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      },
      {
        id: 'BP-1031',
        type: 'ROAD_DAMAGE',
        description: 'Uncovered manhole after heavy storm at corner of 5th cross.',
        language: 'en',
        latitude: 12.9298,
        longitude: 77.5891,
        address: '5th Cross, Jayanagar 3rd Block, Bengaluru',
        severity: 'CRITICAL',
        confidence: 0.98,
        status: 'RESOLVED',
        assignedTeamId: 'TEAM-BBMP-RD-03',
        assignedTeamName: 'BBMP Major Roads Emergency Unit',
        criticalFacilities: [],
        imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
        verificationPhotoUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
        aiSummary: 'Precast reinforced concrete cover replaced within 35 minutes of alert.',
        workOrderId: 'WO-BBMP-1031',
        resolvedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        createdAt: new Date(Date.now() - 3600000 * 13).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      },
      {
        id: 'BP-1032',
        type: 'WATER_LEAK',
        description: 'Major junction pipe leak spraying 4 meters high near Domlur ring road junction.',
        language: 'en',
        latitude: 12.9612,
        longitude: 77.6388,
        address: 'Domlur Inner Ring Road, Bengaluru',
        severity: 'HIGH',
        confidence: 0.95,
        status: 'RESOLVED',
        assignedTeamId: 'TEAM-BWSSB-08',
        assignedTeamName: 'BWSSB South Sub-Division Crew 03',
        criticalFacilities: [initialFacilities[2]],
        imageUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
        verificationPhotoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        aiSummary: 'Pressure valve replaced and roadway cleared.',
        workOrderId: 'WO-BWSSB-1032',
        resolvedAt: new Date(Date.now() - 3600000 * 9).toISOString(),
        createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 9).toISOString(),
      },
      {
        id: 'BP-1033',
        type: 'CYBERSECURITY',
        description: 'Suspicious Link Report • Bengaluru',
        language: 'en',
        latitude: 12.9785,
        longitude: 77.5912,
        address: 'Bengaluru Central Digital Ward (Cyber Crime Jurisdiction)',
        severity: 'HIGH',
        confidence: 0.98,
        status: 'DISPATCHED',
        assignedTeamId: 'TEAM-CYBER-09',
        assignedTeamName: 'Bengaluru Cyber Crime Rapid Cell (CID / CERT-In Liaison)',
        criticalFacilities: [],
        imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
        verificationPhotoUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
        aiSummary: 'Citizen reported fraudulent bank KYC link received via SMS. Lookalike domain detected by Cyber Suraksha Agent. Ticket CYBER-N8N-48201 routed via n8n orchestration. Domain flagged to domain registrar for urgent takedown.',
        risks: ['Credential harvesting', 'Banking OTP theft', 'SMS smishing campaign'],
        requiredDepartments: ['Cybersecurity & Digital Crime Unit', 'CID Cyber Crime Division'],
        workOrderId: 'WO-CYBER-1033',
        etaMinutes: 5,
        cyberPayload: {
          rawUrl: 'http://sbi-kyc-update-login.top/verify',
          sanitizedUrl: 'hxxp://sbi-kyc-update-login[.]top/verify',
          domain: 'sbi-kyc-update-login.top',
          riskLevel: 'HIGH_RISK',
          riskScore: 92,
          flags: ['Known phishing pattern', 'Lookalike bank domain', 'Suspicious TLD (.top)', 'Non-HTTPS protocol'],
          ticketId: 'CYBER-N8N-48201',
          n8nExecutionId: 'exec_n8n_829410',
          clickedScenario: 'Only opened the page',
        },
        resolvedAt: null,
        createdAt: new Date(Date.now() - 3600000 * 1.2).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 0.3).toISOString(),
      },
    ];

    initialIncidents.forEach((inc) => this.incidents.set(inc.id, inc));

    // Initial notifications
    this.notifications = [
      {
        id: 'NOTIF-01',
        incidentId: 'BP-1024',
        teamId: 'TEAM-BESCOM-04',
        recipient: 'Squad Commander Rajesh Kumar',
        channel: 'RADIO_DISPATCH',
        message: 'DISPATCH ALERT: Sparking Transformer BP-1024 near Indiranagar Govt High School. Grid unit isolated.',
        status: 'DELIVERED',
        timestamp: new Date(Date.now() - 3600000 * 0.7).toISOString(),
      },
      {
        id: 'NOTIF-02',
        incidentId: 'BP-1023',
        teamId: 'TEAM-BBMP-RD-03',
        recipient: 'BBMP Field Foreman Murthy',
        channel: 'SMS_SIMULATED',
        message: 'WORK ORDER WO-BBMP-1023: Deploy Jetpatcher to Koramangala 80ft Rd. High priority school zone.',
        status: 'DELIVERED',
        timestamp: new Date(Date.now() - 3600000 * 1.4).toISOString(),
      },
      {
        id: 'NOTIF-03',
        incidentId: 'BP-1028',
        teamId: 'TEAM-SWD-02',
        recipient: 'SWD Engineer Anand Babu',
        channel: 'WHATSAPP_SIMULATED',
        message: 'CIVIC ALERT: Basement flooding HSR Sector 6. 2x 15HP Submersible pumps required on scene.',
        status: 'DELIVERED',
        timestamp: new Date(Date.now() - 3600000 * 2.4).toISOString(),
      },
      {
        id: 'NOTIF-04',
        incidentId: 'BP-1027',
        teamId: 'TEAM-BTP-06',
        recipient: 'Traffic Sub-Inspector Praveen',
        channel: 'IN_APP',
        message: 'TRAFFIC CHOKE: Heavy vehicle breakdown on Old Airport Rd. Ambulance route impeded.',
        status: 'DELIVERED',
        timestamp: new Date(Date.now() - 3600000 * 1.0).toISOString(),
      },
      {
        id: 'NOTIF-05',
        incidentId: 'BP-1022',
        teamId: 'TEAM-BWSSB-01',
        recipient: 'BWSSB AE Nagaraj',
        channel: 'RADIO_DISPATCH',
        message: 'RESOLVED CONFIRMATION: Pipeline sleeve installed. Pressure normalized at 3.2 bar.',
        status: 'DELIVERED',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
    ];
  }

  // Incident Operations
  getIncidents(): Incident[] {
    return Array.from(this.incidents.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getIncidentById(id: string): Incident | undefined {
    return this.incidents.get(id);
  }

  saveIncident(incident: Incident): Incident {
    incident.updatedAt = new Date().toISOString();
    this.incidents.set(incident.id, incident);
    return incident;
  }

  // Response Teams
  getTeams(): ResponseTeam[] {
    return Array.from(this.teams.values());
  }

  getTeamById(id: string): ResponseTeam | undefined {
    return this.teams.get(id);
  }

  updateTeam(team: ResponseTeam): ResponseTeam {
    this.teams.set(team.id, team);
    return team;
  }

  // Critical Facilities
  getFacilities(): CriticalFacility[] {
    return Array.from(this.facilities.values());
  }

  // Work Orders
  getWorkOrders(): WorkOrder[] {
    return Array.from(this.workOrders.values());
  }

  saveWorkOrder(order: WorkOrder): WorkOrder {
    this.workOrders.set(order.id, order);
    return order;
  }

  // Risk Zones
  getRiskZones(): RiskZone[] {
    return Array.from(this.riskZones.values());
  }

  // Agent Actions & Notifications
  logAction(action: AgentAction): AgentAction {
    this.agentActions.unshift(action);
    if (this.agentActions.length > 200) {
      this.agentActions.pop();
    }
    return action;
  }

  getActions(incidentId?: string): AgentAction[] {
    if (!incidentId) return this.agentActions;
    return this.agentActions.filter((a) => a.incidentId === incidentId);
  }

  logNotification(notif: NotificationItem): NotificationItem {
    this.notifications.unshift(notif);
    return notif;
  }

  getNotifications(incidentId?: string): NotificationItem[] {
    if (!incidentId) return this.notifications;
    return this.notifications.filter((n) => n.incidentId === incidentId);
  }

  // Cyber Telemetry Stats
  getCyberStats() {
    return { ...this.cyberStats };
  }

  recordCyberScan(riskLevel: 'SAFE' | 'SUSPICIOUS' | 'HIGH_RISK' | 'UNKNOWN') {
    this.cyberStats.linksChecked += 1;
    if (riskLevel === 'SUSPICIOUS') {
      this.cyberStats.suspiciousDetected += 1;
    } else if (riskLevel === 'HIGH_RISK') {
      this.cyberStats.highRiskDetected += 1;
    }
    return { ...this.cyberStats };
  }

  recordCyberReport() {
    this.cyberStats.reportsSubmitted += 1;
    this.cyberStats.routedViaN8n += 1;
    return { ...this.cyberStats };
  }

  resetDemo() {
    this.incidents.clear();
    this.teams.clear();
    this.facilities.clear();
    this.workOrders.clear();
    this.agentActions = [];
    this.notifications = [];
    this.riskZones.clear();
    this.seedInitialData();
  }
}

export const civicStore = new CivicStore();
