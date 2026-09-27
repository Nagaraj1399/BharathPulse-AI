import React, { useState } from 'react';
import { Layers, CloudRain, Car, Droplets, Zap, ShieldAlert, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { soundFx } from '../lib/soundFx';

type ScenarioId = 'rain' | 'traffic' | 'water' | 'power' | 'cyber';

interface ScenarioConfig {
  id: ScenarioId;
  name: string;
  changeBadge: string;
  icon: any;
  color: string;
  consequences: string[];
  affectedZones: string[];
  facilitiesAtRisk: string[];
  recommendedPreparation: string[];
  aiActionSuggestion: string;
}

const SCENARIOS: Record<ScenarioId, ScenarioConfig> = {
  rain: {
    id: 'rain',
    name: 'Monsoon Cloudburst Spike',
    changeBadge: 'HEAVY RAIN +30%',
    icon: CloudRain,
    color: '#06B6D4',
    consequences: [
      '3 flood-sensitive low-lying catchment zones at risk',
      '2 primary school transit routes face standing water > 20cm',
      '1 major hospital access corridor (Manipal Hospital, Old Airport Rd) at risk of bottleneck',
    ],
    affectedZones: ['Indiranagar 100ft Rd', 'Koramangala 80ft Underpass', 'Bellandur Eco-Corridor'],
    facilitiesAtRisk: ['Indiranagar Govt High School', 'Manipal Emergency Center'],
    recommendedPreparation: [
      'Pre-position BBMP mobile dewatering pump at Koramangala underpass',
      'Increase Bellandur runoff telemetry polling interval to 30 seconds',
      'Alert Traffic Police for dynamic arterial diversion routing',
    ],
    aiActionSuggestion: 'Pre-position BWSSB Rapid Dewatering Unit 02 to Koramangala Ward.',
  },
  traffic: {
    id: 'traffic',
    name: 'Peak Gridlock & Emergency Corridor',
    changeBadge: 'TRAFFIC +20%',
    icon: Car,
    color: '#F59E0B',
    consequences: [
      'Average emergency vehicle response time increases from 6m 42s to 12m 10s',
      'Arterial congestion spillover into residential school buffers',
      'Fuel emissions spike across Old Madras Road corridor',
    ],
    affectedZones: ['Silk Board Junction', 'Indiranagar 100ft Rd', 'Marathahalli Bridge'],
    facilitiesAtRisk: ['CMH General Hospital', 'National Public School'],
    recommendedPreparation: [
      'Activate smart signal green-corridor priority for emergency units',
      'Reroute non-critical municipal transit to secondary ring roads',
    ],
    aiActionSuggestion: 'Pre-calculate green corridor route for ambulance and fire tenders.',
  },
  water: {
    id: 'water',
    name: 'Feeder Main Depressurization',
    changeBadge: 'WATER PRESSURE -15%',
    icon: Droplets,
    color: '#3B82F6',
    consequences: [
      'Cavitation risk in 450mm distribution trunk lines',
      'Ground saturation indicating subterranean joint rupture',
      'Secondary contamination risk in sub-surface domestic lines',
    ],
    affectedZones: ['Indiranagar Ward 74', 'Domlur Layout', 'HAL 2nd Stage'],
    facilitiesAtRisk: ['Indiranagar Govt High School', 'ESIS Hospital'],
    recommendedPreparation: [
      'Isolate sectional sluice valve SV-44 to protect main reservoir pressure',
      'Dispatch BWSSB acoustic pipe leak localization team',
    ],
    aiActionSuggestion: 'Issue automated work order for acoustic correlation inspection.',
  },
  power: {
    id: 'power',
    name: 'Summer Heatwave Load Spike',
    changeBadge: 'POWER DEMAND +25%',
    icon: Zap,
    color: '#EC4899',
    consequences: [
      'Step-down distribution transformers operating near 92°C thermal limit',
      'Critical cooling demand surges across IT corridors and hospitals',
      'Risk of localized feeder trips in dense residential wards',
    ],
    affectedZones: ['Whitefield Tech Corridor', 'Electronic City Phase 1'],
    facilitiesAtRisk: ['St. John’s Medical Research Wing', 'HAL Medical Center'],
    recommendedPreparation: [
      'Dynamic phase-load balancing via BESCOM autonomous switchgear',
      'Pre-stage diesel generator backups for healthcare institutions',
    ],
    aiActionSuggestion: 'Trigger proactive load shedding for non-critical industrial circuits.',
  },
  cyber: {
    id: 'cyber',
    name: 'SCADA Telemetry Anomaly',
    changeBadge: 'CYBER RESILIENCE ALERT',
    icon: ShieldAlert,
    color: '#A855F7',
    consequences: [
      'Unusual packet latency detected in East Zone telemetry relays',
      'Sensor calibration divergence flagged on 2 water level nodes',
      'Fallback to local edge decision-making enabled',
    ],
    affectedZones: ['City Central SCADA Node', 'Koramangala Relay'],
    facilitiesAtRisk: ['Municipal Command Core'],
    recommendedPreparation: [
      'Enforce zero-trust cryptographic signature check on all telemetry',
      'Rotate Gemini Live session ephemeral keys across client terminals',
    ],
    aiActionSuggestion: 'Lockdown edge relays to signed whitelist payload mode only.',
  },
};

export const CityTwin: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioId>('rain');
  const [isPrePositioning, setIsPrePositioning] = useState<boolean>(false);
  const [prePositionConfirmed, setPrePositionConfirmed] = useState<boolean>(false);

  const scenario = SCENARIOS[selectedScenario];

  const handlePrePosition = () => {
    setIsPrePositioning(true);
    soundFx.playActionConfirmed();
    setTimeout(() => {
      setIsPrePositioning(false);
      setPrePositionConfirmed(true);
      soundFx.playVerificationSuccess();
    }, 800);
  };

  return (
    <div className="bg-[#090D16] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl text-left">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" />
            <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
              PREDICTIVE CITY TWIN · 2030
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30">
              PROTOTYPE SIMULATION
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Forward-looking stress testing simulating climate, hydrological, and urbanization shocks on Bengaluru's grid.
          </p>
        </div>

        <div className="text-[11px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
          MODEL: BENGALURU-2030-S1
        </div>
      </div>

      {/* Scenario Selector Tabs */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2">
        {Object.values(SCENARIOS).map((sc) => {
          const Icon = sc.icon;
          const isSelected = selectedScenario === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => {
                setSelectedScenario(sc.id);
                setPrePositionConfirmed(false);
                soundFx.playSignalReceived();
              }}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-slate-900 border-purple-500/60 shadow-lg shadow-purple-500/10'
                  : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/60 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <Icon className="w-4 h-4" style={{ color: sc.color }} />
                <span
                  className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded"
                  style={{
                    color: sc.color,
                    backgroundColor: `${sc.color}15`,
                    border: `1px solid ${sc.color}35`,
                  }}
                >
                  {sc.changeBadge.split(' ')[1] || 'SHOCK'}
                </span>
              </div>
              <span className={`text-xs font-semibold block truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                {sc.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Simulation Breakdown Grid */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Column 1: Potential Consequences */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
          <span className="text-[11px] font-mono uppercase tracking-wider text-rose-400 flex items-center gap-1.5 mb-2">
            <AlertTriangle className="w-3.5 h-3.5" />
            Projected Grid Impact
          </span>
          <ul className="space-y-2 text-xs text-slate-300">
            {scenario.consequences.map((c, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-rose-400 text-base leading-none">•</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: Affected Zones & Facilities */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
          <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            Vulnerable Corridors
          </span>
          <div className="space-y-3">
            <div>
              <span className="text-[10px] text-slate-500 font-mono block">Sensitive Wards:</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {scenario.affectedZones.map((z, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300"
                  >
                    {z}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-mono block">Critical Facilities at Risk:</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {scenario.facilitiesAtRisk.map((f, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/30 border border-amber-500/30 text-amber-300"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Proactive AI Recommendations */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-indigo-500/30 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-300 flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Pre-Emptive Response
            </span>
            <ul className="space-y-2 text-xs text-slate-300">
              {scenario.recommendedPreparation.map((p, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-indigo-400 text-base leading-none">›</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800">
            {prePositionConfirmed ? (
              <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Pre-position Order Dispatched & Confirmed on City Shield</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handlePrePosition}
                disabled={isPrePositioning}
                className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50"
              >
                <span>{isPrePositioning ? 'Simulating Deployment...' : 'Approve Pre-Emptive Dispatch'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
