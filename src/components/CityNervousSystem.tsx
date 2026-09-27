import React, { useState, useEffect } from 'react';
import { Radio, Mic, Cpu, Shield, Users, Building, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AIAvatar } from './AIAvatar';
import { Incident, ResponseTeam, CriticalFacility } from '../../shared/types';

interface CityNervousSystemProps {
  incidents: Incident[];
  teams: ResponseTeam[];
  facilities: CriticalFacility[];
  onSelectIncident?: (id: string) => void;
}

export const CityNervousSystem: React.FC<CityNervousSystemProps> = ({
  incidents,
  teams,
  facilities,
  onSelectIncident,
}) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  // Auto-cycle through the 5 connected layers of the city nervous system
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 5);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const layers = [
    {
      step: 0,
      id: 'citizens',
      label: '1. SENSORY CITIZEN LAYER',
      subtitle: 'Voice & Multimodal Intake',
      icon: Mic,
      color: '#10B981',
      metric: '42 Reports/hr',
      detail: 'Citizen speaks in Kannada / Hindi / English via SETU voice or sends geotagged camera evidence.',
    },
    {
      step: 1,
      id: 'ai-core',
      label: '2. REASONING & RISK LAYER',
      subtitle: 'Pulse Core & Gemini Live',
      icon: Cpu,
      color: '#6366F1',
      metric: '320ms Latency',
      detail: 'Gemini multimodal classification, risk assessment, and cluster hypothesis checking via DRISHTI.',
    },
    {
      step: 2,
      id: 'facilities',
      label: '3. CRITICAL INFRASTRUCTURE',
      subtitle: 'Geospatial Vulnerability Buffer',
      icon: Building,
      color: '#F59E0B',
      metric: '180m Proximity',
      detail: 'Scans schools, hospitals, transit arteries, and high-voltage substations to prioritize human safety.',
    },
    {
      step: 3,
      id: 'teams',
      label: '4. AUTONOMOUS FIELD DISPATCH',
      subtitle: 'Response Squads & Routing',
      icon: Users,
      color: '#06B6D4',
      metric: '8m Avg ETA',
      detail: 'Matches nearest qualified municipal unit (BWSSB, BESCOM, BBMP) and generates dynamic work order.',
    },
    {
      step: 4,
      id: 'verification',
      label: '5. ON-SITE VERIFICATION',
      subtitle: 'Closure & Ground Truth',
      icon: CheckCircle2,
      color: '#10B981',
      metric: '94% Verified',
      detail: 'Reasoning check on field telemetry & completion photographs before official incident closure.',
    },
  ];

  return (
    <div className="bg-[#090D16] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-indigo-400 animate-pulse" />
            <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
              CITY DIGITAL NERVOUS SYSTEM
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
              5 INTERCONNECTED LAYERS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time closed-loop perception and actuation uniting citizens, predictive AI, and physical municipal squads.
          </p>
        </div>

        <div className="text-[11px] font-mono text-indigo-300 bg-indigo-950/40 border border-indigo-500/40 px-3 py-1 rounded-xl">
          REAL-TIME TELEMETRY STREAM
        </div>
      </div>

      {/* Connected 5-Step Pipeline Flow */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-5 gap-2 relative">
        {layers.map((l, index) => {
          const Icon = l.icon;
          const isActive = activeStep === index;
          return (
            <div
              key={l.id}
              onClick={() => setActiveStep(index)}
              className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-300 relative ${
                isActive
                  ? 'bg-slate-900 border-indigo-500/80 shadow-lg shadow-indigo-500/10 scale-[1.02]'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className="p-1.5 rounded-lg border"
                  style={{
                    backgroundColor: `${l.color}15`,
                    borderColor: `${l.color}35`,
                    color: l.color,
                  }}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-slate-400">{l.metric}</span>
              </div>

              <span className="text-[11px] font-bold text-slate-200 block truncate">
                {l.label}
              </span>
              <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                {l.subtitle}
              </span>

              {/* Step indicator bar */}
              <div className="mt-3 w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: isActive ? '100%' : '20%',
                    backgroundColor: isActive ? l.color : '#334155',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Layer Deep Dive Box */}
      <div className="mt-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping mt-1 sm:mt-0 shrink-0" />
          <div>
            <span className="font-bold text-slate-200 uppercase font-mono mr-2">
              {layers[activeStep].label} Active:
            </span>
            <span className="text-slate-400">{layers[activeStep].detail}</span>
          </div>
        </div>

        {incidents.length > 0 && onSelectIncident && (
          <button
            type="button"
            onClick={() => onSelectIncident(incidents[0].id)}
            className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
          >
            <span>Inspect Active Flow (BP-2048)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
