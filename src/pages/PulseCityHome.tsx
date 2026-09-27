import React, { useState, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  Radio,
  HelpCircle,
  Play,
  Volume2,
  ChevronRight,
  Droplets,
  Flame,
} from 'lucide-react';
import { PulseCore } from '../components/PulseCore';
import { CityNervousSystem } from '../components/CityNervousSystem';
import { AIAvatar } from '../components/AIAvatar';
import { Incident, ResponseTeam, CriticalFacility } from '../../shared/types';
import { soundFx } from '../lib/soundFx';

interface PulseCityHomeProps {
  incidents: Incident[];
  teams: ResponseTeam[];
  facilities: CriticalFacility[];
  onOpenAskAI: () => void;
  onNavigateTab: (tab: 'pulse' | 'map' | 'incidents' | 'intelligence' | 'citizen' | 'system' | 'cyber') => void;
  onSelectIncident: (id: string) => void;
}

export const PulseCityHome: React.FC<PulseCityHomeProps> = ({
  incidents,
  teams,
  facilities,
  onOpenAskAI,
  onNavigateTab,
  onSelectIncident,
}) => {
  // Rotating Zero-Click Insights (Section 20)
  const [insightIndex, setInsightIndex] = useState(0);

  const zeroClickInsights = [
    {
      title: 'Water Feeder Pressure Anomaly Detected',
      desc: '4 correlated water complaints detected within 1.8 km during the last 40 minutes in Indiranagar Ward 74.',
      tag: 'POSSIBLE NETWORK EVENT',
      persona: 'jal' as const,
      actionText: 'Investigate Cluster',
      action: () => onNavigateTab('intelligence'),
    },
    {
      title: 'High-Temperature Transformer Alert',
      desc: 'BESCOM Substation Node 42 operating at 91°C near Indiranagar CMH transit interchange.',
      tag: 'PUBLIC SAFETY PRIORITY',
      persona: 'raksha' as const,
      actionText: 'Inspect Sector',
      action: () => onNavigateTab('map'),
    },
    {
      title: 'Monsoon Precipitation Inundation Risk',
      desc: 'Catchment runoff modeling indicates rising flood probability across Koramangala 80ft underpass.',
      tag: 'PROBABILITY SIGNAL · 78%',
      persona: 'drishti' as const,
      actionText: 'View City Twin',
      action: () => onNavigateTab('intelligence'),
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setInsightIndex((prev) => (prev + 1) % zeroClickInsights.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [zeroClickInsights.length]);

  const currentInsight = zeroClickInsights[insightIndex];

  // Derived counts
  const totalIncidents = incidents.length || 12;
  const criticalCount = incidents.filter((i) => i.severity === 'CRITICAL' || i.severity === 'HIGH').length || 2;

  // Live incoming signal items
  const incomingSignals = [
    { title: 'Water Pressure Drop (-15%)', location: 'Indiranagar 100ft', time: '1m ago', icon: Droplets, color: '#06B6D4' },
    { title: 'Citizen Voice Intake (Kannada)', location: 'Indiranagar Ward', time: '2m ago', icon: Radio, color: '#10B981' },
    { title: 'Step-down Transformer Spike', location: 'East Substation', time: '4m ago', icon: Flame, color: '#F59E0B' },
    { title: 'Heavy Rainfall Telemetry (+30%)', location: 'Bellandur Basin', time: '6m ago', icon: Activity, color: '#A855F7' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fade-in text-left">
      {/* 01. City Pulse Top Hero Strip */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5 text-xs font-mono text-slate-400">
            <span className="text-white font-bold tracking-wider">BENGALURU</span>
            <span>·</span>
            <span>27 SEP 2030</span>
            <span>·</span>
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE OS ACTIVE
            </span>
          </div>

          <div className="mt-2 flex items-baseline gap-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-sans">
              CITY PULSE
            </h1>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-mono font-bold text-indigo-400 tabular-nums">
                87
              </span>
              <span className="text-sm font-mono text-slate-500">/ 100</span>
            </div>
            <span className="hidden sm:inline-block text-xs font-mono px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-emerald-400 font-bold uppercase">
              STABILITY: NORMAL
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Autonomous perception, risk forecasting, and closed-loop municipal dispatch coordination.
          </p>
        </div>

        {/* Quick Launch Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigateTab('citizen')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Citizen Voice (குடிமக்கள் குரல்)</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('cyber')}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            <span>Cyber Link Checker</span>
          </button>
        </div>
      </div>

      {/* 02. Critical City Telemetry Scoreboard */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div
          onClick={() => onNavigateTab('incidents')}
          className="p-4 rounded-xl bg-[#090D16] border border-slate-800 hover:border-slate-700 cursor-pointer transition-all group"
        >
          <span className="text-[11px] font-mono uppercase text-slate-500 block">Active Incidents</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              {totalIncidents}
            </span>
            <span className="text-[10px] text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
              View Grid ›
            </span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">Monitored live</span>
        </div>

        <div
          onClick={() => onNavigateTab('incidents')}
          className="p-4 rounded-xl bg-[#090D16] border border-rose-950/60 hover:border-rose-500/40 cursor-pointer transition-all group"
        >
          <span className="text-[11px] font-mono uppercase text-rose-400 block">Critical Priority</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-300 font-mono tabular-nums">
              {criticalCount}
            </span>
            <span className="text-[10px] text-rose-400 font-mono">Urgent</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">Active containment</span>
        </div>

        <div
          onClick={() => onNavigateTab('system')}
          className="p-4 rounded-xl bg-[#090D16] border border-slate-800 hover:border-slate-700 cursor-pointer transition-all group"
        >
          <span className="text-[11px] font-mono uppercase text-slate-500 block">AI Actions Today</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-indigo-400 font-mono tabular-nums">
              148
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">100% Policy</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">Audited in ledger</span>
        </div>

        <div className="p-4 rounded-xl bg-[#090D16] border border-slate-800">
          <span className="text-[11px] font-mono uppercase text-slate-500 block">Avg Response</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              6m 42s
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Traffic-aware</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">-34% vs 2024</span>
        </div>

        <div
          onClick={() => onNavigateTab('system')}
          className="p-4 rounded-xl bg-[#090D16] border border-slate-800 hover:border-slate-700 cursor-pointer col-span-2 sm:col-span-1"
        >
          <span className="text-[11px] font-mono uppercase text-slate-500 block">Verified Closure</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tabular-nums">
              94%
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">Visual ground truth</span>
        </div>
      </div>

      {/* 03. Live City Signal: horizontal animated pulse of incoming city events */}
      <div className="bg-[#090D16] border border-slate-800 rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
              Live City Signal Stream
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">Autonomous Sensor & Citizen Ingest</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {incomingSignals.map((sig, idx) => {
            const Icon = sig.icon;
            return (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="p-2 rounded-lg shrink-0 border"
                    style={{
                      backgroundColor: `${sig.color}15`,
                      borderColor: `${sig.color}35`,
                      color: sig.color,
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-slate-200 block truncate">
                      {sig.title}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate">{sig.location}</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-500 shrink-0 ml-2">{sig.time}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 04. Rotating Zero-Click Insight (Section 20) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 border border-indigo-500/40 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <AIAvatar personaId={currentInsight.persona} size="md" state="thinking" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold">
                  {currentInsight.tag}
                </span>
                <span className="text-xs text-slate-400 font-mono">Zero-Click AI Insight</span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-white mt-1">
                {currentInsight.title}
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">{currentInsight.desc}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={currentInsight.action}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shrink-0 transition-colors shadow-md shadow-indigo-600/25"
          >
            <span>{currentInsight.actionText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 05. Signature Central Pulse Core */}
      <div className="py-6 sm:py-10 flex flex-col items-center justify-center relative">
        <PulseCore
          size="hero"
          state="idle"
          label="PULSE CORE · CITY AUTONOMY L4"
          onClick={onOpenAskAI}
        />
      </div>

      {/* 06. City Digital Nervous System Flow */}
      <CityNervousSystem
        incidents={incidents}
        teams={teams}
        facilities={facilities}
        onSelectIncident={onSelectIncident}
      />
    </div>
  );
};
