import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  Clock,
  AlertTriangle,
  Droplets,
  Activity,
  History,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Cpu,
} from 'lucide-react';
import { AIAvatar } from '../components/AIAvatar';
import { CityTwin } from '../components/CityTwin';
import { Incident } from '../../shared/types';
import { soundFx } from '../lib/soundFx';

interface CityIntelligencePageProps {
  incidents: Incident[];
  onSelectIncident: (id: string) => void;
  onNavigateTab: (tab: 'pulse' | 'map' | 'incidents' | 'intelligence' | 'citizen' | 'system') => void;
}

export const CityIntelligencePage: React.FC<CityIntelligencePageProps> = ({
  incidents,
  onSelectIncident,
  onNavigateTab,
}) => {
  const [activeTab, setActiveTab] = useState<'forecast' | 'twin' | 'memory'>('forecast');
  const [prepositionApproved, setPrepositionApproved] = useState<boolean>(false);

  const handleApprovePreposition = () => {
    setPrepositionApproved(true);
    soundFx.playVerificationSuccess();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fade-in text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs font-mono text-purple-400 uppercase tracking-wider">
              DRISHTI · PREDICTIVE SENTINEL
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-xs text-slate-400 font-mono">BENGALURU 2030</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
            CITY INTELLIGENCE
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real-time hazard perception, probabilistic forecasting, and historical infrastructure learning.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('forecast')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors ${
              activeTab === 'forecast'
                ? 'bg-purple-600 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            NOW / NEXT / EMERGING
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('twin')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors ${
              activeTab === 'twin'
                ? 'bg-purple-600 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            PREDICTIVE CITY TWIN
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('memory')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors ${
              activeTab === 'memory'
                ? 'bg-purple-600 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            CITY MEMORY & PRE-EMPTION
          </button>
        </div>
      </div>

      {activeTab === 'forecast' && (
        <div className="space-y-6">
          {/* NOW, NEXT, EMERGING 3-Column Horizon */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. NOW */}
            <div className="bg-[#090D16] border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                    <h3 className="font-extrabold text-sm text-white tracking-wider font-mono uppercase">
                      NOW · ACTIVE REALITY
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">Live Grid</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">What requires immediate operational attention right now?</p>

                <div className="mt-4 space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-rose-500/40">
                    <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                      <span className="font-bold text-rose-400">WATER MAIN ANOMALY</span>
                      <span className="text-slate-400">Indiranagar</span>
                    </div>
                    <p className="text-xs text-slate-200 font-medium">
                      Major rupture on 450mm feeder line outside Indiranagar Government High School.
                    </p>
                    <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>CONFIDENCE: <strong className="text-white">94%</strong></span>
                      <span className="text-emerald-400 font-bold">DISPATCH EN-ROUTE (8m)</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-amber-500/30">
                    <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                      <span className="font-bold text-amber-400">TRANSFORMER THERMAL OVERLOAD</span>
                      <span className="text-slate-400">East Substation</span>
                    </div>
                    <p className="text-xs text-slate-200 font-medium">
                      Step-down coil temperature reached 91°C; hazard containment issued to BESCOM.
                    </p>
                    <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>CONFIDENCE: <strong className="text-white">91%</strong></span>
                      <span className="text-amber-400">MONITORING</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => onSelectIncident('BP-2048')}
                  className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Track Live Incident BP-2048</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 2. NEXT */}
            <div className="bg-[#090D16] border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                    <h3 className="font-extrabold text-sm text-white tracking-wider font-mono uppercase">
                      NEXT · 45 MIN HORIZON
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">Short-Term Forecast</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">What is probabilistically likely to occur in the coming hours?</p>

                <div className="mt-4 space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/40">
                    <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                      <span className="font-bold text-cyan-300">ELEVATED INUNDATION PROBABILITY</span>
                      <span className="text-slate-400">HAL 2nd Stage</span>
                    </div>
                    <p className="text-xs text-slate-200 font-medium">
                      Back-flow risk in subterranean stormwater drain if feeder leak is uncontained.
                    </p>
                    <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>PROBABILITY: <strong className="text-cyan-300">76% SIGNAL</strong></span>
                      <span className="text-slate-400">WINDOW: 45 MIN</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                      <span className="font-bold text-purple-300">ARTERIAL TRANSIT CONGESTION</span>
                      <span className="text-slate-400">100ft Road</span>
                    </div>
                    <p className="text-xs text-slate-200 font-medium">
                      Traffic slowdown of +18 minutes anticipated as road repair barricading initiates.
                    </p>
                    <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>PROBABILITY: <strong className="text-purple-300">82% SIGNAL</strong></span>
                      <span className="text-slate-400">WINDOW: 30 MIN</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => onNavigateTab('map')}
                  className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>View Geospatial Inundation Map</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 3. EMERGING */}
            <div className="bg-[#090D16] border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
                    <h3 className="font-extrabold text-sm text-white tracking-wider font-mono uppercase">
                      EMERGING · PATTERN SENTINEL
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">Cluster Intelligence</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">What latent structural or network patterns are developing?</p>

                <div className="mt-4 space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-purple-500/40">
                    <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                      <span className="font-bold text-purple-300">SUBTERRANEAN CORRELATION</span>
                      <span className="text-slate-400">1.8 km Radius</span>
                    </div>
                    <p className="text-xs text-slate-200 font-medium">
                      4 discrete water complaints logged within 40 minutes indicate a single shared distribution pipe failure.
                    </p>
                    <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>HYPOTHESIS: <strong className="text-purple-300">PIPE MAIN FRACTURE</strong></span>
                      <span className="text-emerald-400 font-bold">BWSSB ALERTED</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                      <span className="font-bold text-slate-300">CUMULATIVE RAINFALL RUNOFF</span>
                      <span className="text-slate-400">East Basin</span>
                    </div>
                    <p className="text-xs text-slate-200 font-medium">
                      Antecedent soil moisture reaching saturation across low-lying green belts.
                    </p>
                    <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>TELEMETRY: <strong className="text-white">SATURATION 88%</strong></span>
                      <span className="text-slate-400">RISK: MEDIUM</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setActiveTab('memory')}
                  className="w-full py-2 px-3 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Inspect Historical City Memory</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'twin' && <CityTwin />}

      {activeTab === 'memory' && (
        <div className="space-y-6">
          {/* Section 21 & 22: City Memory & Pre-Emptive Action */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* City Memory Card */}
            <div className="bg-[#090D16] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl text-left">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-bold text-base text-white">CITY MEMORY · HISTORICAL PATTERNS</h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                  DEMO HISTORICAL DATA
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                BharatPulse continuously correlates current incidents with past municipal repair histories to identify aging infrastructure.
              </p>

              <div className="mt-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase font-mono">
                    Sector: Indiranagar Ward 74
                  </span>
                  <span className="text-[11px] font-mono text-amber-400 font-bold">14 Reports / 30 Days</span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Avg Resolution</span>
                    <span className="font-bold text-white font-mono">41 min</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Repeat Joint</span>
                    <span className="font-bold text-amber-400 font-mono">3 Times</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Root Vulnerability</span>
                    <span className="font-bold text-indigo-300 font-mono">Cast Iron 1988</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  "City Memory flags that Indiranagar 100ft road water mains have experienced 3 joint sleeve failures over 90 days. Recommends permanent poly-sleeve replacement during next Q3 municipal maintenance cycle."
                </p>
              </div>
            </div>

            {/* Proactive Response Recommendation Card */}
            <div className="bg-[#090D16] border border-indigo-500/40 rounded-2xl p-5 sm:p-6 shadow-xl text-left flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
                    <h3 className="font-bold text-base text-white">PROACTIVE PRE-EMPTIVE RESPONSE</h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold">
                    PREDICTIVE DISPATCH
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Moving from reactive reporting to predictive pre-positioning before failure escalates.
                </p>

                <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-indigo-500/30">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase font-mono">
                    <span>Recommendation:</span>
                    <span className="text-white">Pre-position BWSSB Dewatering Unit 02</span>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-300">
                    <span className="text-[11px] font-mono text-slate-400 uppercase font-bold block">
                      Why does the AI recommend this?
                    </span>
                    <div className="flex items-start gap-2">
                      <span className="text-indigo-400 font-bold">1.</span>
                      <span>Rain intensity rising +30% in eastern catchment.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-indigo-400 font-bold">2.</span>
                      <span>3 open drainage complaints pending within 1.2km radius.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-indigo-400 font-bold">3.</span>
                      <span>Koramangala 80ft underpass historically floods within 25 minutes of continuous rainfall.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800">
                {prepositionApproved ? (
                  <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Pre-positioning Order Dispatched (WO-PRE-891)</span>
                    </div>
                    <span className="font-mono text-[10px]">AUTHORIZED</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleApprovePreposition}
                    className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/25"
                  >
                    <span>Authorize Pre-Emptive Unit Pre-Positioning</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
