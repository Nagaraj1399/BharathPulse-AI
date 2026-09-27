import { IncidentCategory, IncidentSeverity, SupportedLanguage } from './types';

export const SUPPORTED_LANGUAGES: { code: SupportedLanguage; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
];

export const INCIDENT_CATEGORIES: { type: IncidentCategory; label: string; icon: string; defaultDept: string }[] = [
  { type: 'WATER_LEAK', label: 'Water Pipeline Leak', icon: 'droplet', defaultDept: 'BWSSB Water Division' },
  { type: 'FLOODING', label: 'Urban Flooding / Inundation', icon: 'waves', defaultDept: 'Stormwater & Drainage SWD' },
  { type: 'ROAD_DAMAGE', label: 'Pothole / Road Cave-in', icon: 'alert-triangle', defaultDept: 'BBMP Major Roads' },
  { type: 'GARBAGE_OVERFLOW', label: 'Garbage & Solid Waste Dump', icon: 'trash-2', defaultDept: 'BBMP Solid Waste Mgmt' },
  { type: 'FALLEN_TREE', label: 'Fallen Tree / Blocked Road', icon: 'tree-pine', defaultDept: 'Forest & Horticulture' },
  { type: 'ELECTRICAL_HAZARD', label: 'Downed Wire / Transformer Spark', icon: 'zap', defaultDept: 'BESCOM Power Ops' },
  { type: 'FIRE_RISK', label: 'Fire Hazard / Open Burning', icon: 'flame', defaultDept: 'Fire & Emergency Services' },
  { type: 'TRAFFIC_OBSTRUCTION', label: 'Severe Traffic Choke / Breakdown', icon: 'car', defaultDept: 'Bengaluru Traffic Police' },
  { type: 'HEAT_EMERGENCY', label: 'Urban Heat Island Distress', icon: 'sun', defaultDept: 'Health & Family Welfare' },
  { type: 'AIR_QUALITY', label: 'Air Quality / Toxic Emissions', icon: 'wind', defaultDept: 'Pollution Control Board' },
  { type: 'CYBERSECURITY', label: 'Cybersecurity / Suspicious Link', icon: 'shield-alert', defaultDept: 'Cybersecurity & Digital Crime Unit' },
  { type: 'OTHER', label: 'General Civic Hazard', icon: 'help-circle', defaultDept: 'BBMP Control Room' },
];

export const SEVERITY_CONFIG: Record<IncidentSeverity, { label: string; color: string; badgeClass: string; pingClass: string }> = {
  LOW: {
    label: 'Low Priority',
    color: '#10B981',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    pingClass: 'bg-emerald-500',
  },
  MEDIUM: {
    label: 'Medium Priority',
    color: '#F59E0B',
    badgeClass: 'bg-amber-50 text-amber-900 border-amber-200',
    pingClass: 'bg-amber-500',
  },
  HIGH: {
    label: 'High Priority',
    color: '#F97316',
    badgeClass: 'bg-orange-50 text-orange-900 border-orange-200',
    pingClass: 'bg-orange-500',
  },
  CRITICAL: {
    label: 'Critical Emergency',
    color: '#EF4444',
    badgeClass: 'bg-rose-50 text-rose-900 border-rose-300 animate-pulse font-bold',
    pingClass: 'bg-rose-500',
  },
};

// Bengaluru Center Coordinates
export const BENGALURU_CENTER = {
  lat: 12.9716,
  lng: 77.5946,
};
