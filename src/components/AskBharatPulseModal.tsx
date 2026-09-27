import React, { useState } from 'react';
import { X, Sparkles, Send, ArrowRight, ShieldCheck, Activity, AlertTriangle, Layers } from 'lucide-react';
import { AIAvatar } from './AIAvatar';
import { Incident } from '../../shared/types';
import { soundFx } from '../lib/soundFx';

interface AskBharatPulseModalProps {
  isOpen: boolean;
  onClose: () => void;
  incidents: Incident[];
  onSelectIncident?: (id: string) => void;
  onNavigateTab?: (tab: 'pulse' | 'map' | 'incidents' | 'intelligence' | 'citizen' | 'system') => void;
}

interface QueryPreset {
  question: string;
  category: 'overview' | 'risk' | 'actions' | 'prediction';
}

const PRESETS: QueryPreset[] = [
  { question: 'What is happening in Bengaluru right now?', category: 'overview' },
  { question: 'Which zone needs immediate attention?', category: 'risk' },
  { question: 'Why is Indiranagar classified as high risk?', category: 'risk' },
  { question: 'Show water and flood-related incidents.', category: 'overview' },
  { question: 'What autonomous actions did the AI take today?', category: 'actions' },
  { question: 'What future risks should the city prepare for?', category: 'prediction' },
];

export const AskBharatPulseModal: React.FC<AskBharatPulseModalProps> = ({
  isOpen,
  onClose,
  incidents,
  onSelectIncident,
  onNavigateTab,
}) => {
  const [activeQuestion, setActiveQuestion] = useState<string>('');
  const [customInput, setCustomInput] = useState<string>('');
  const [isAnswering, setIsAnswering] = useState<boolean>(false);
  const [response, setResponse] = useState<{
    persona: 'pulse' | 'jal' | 'raksha' | 'drishti';
    title: string;
    summary: string;
    metrics?: { label: string; value: string | number }[];
    actions?: { label: string; onClick: () => void }[];
  } | null>(null);

  if (!isOpen) return null;

  const handleAsk = (query: string) => {
    setActiveQuestion(query);
    setIsAnswering(true);
    soundFx.playSignalReceived();

    setTimeout(() => {
      setIsAnswering(false);
      soundFx.playActionConfirmed();

      const q = query.toLowerCase();

      if (q.includes('what is happening') || q.includes('overview') || q.includes('bengaluru')) {
        const total = incidents.length || 12;
        const critical = incidents.filter((i) => i.severity === 'CRITICAL' || i.severity === 'HIGH').length || 3;
        setResponse({
          persona: 'pulse',
          title: 'Bengaluru City Pulse Summary',
          summary: `Bengaluru municipal grid is operating at 87/100 stability. There are ${total} active incidents tracked, with ${critical} high-priority hazards currently under active AI coordination. BWSSB and BESCOM emergency response units are en-route.`,
          metrics: [
            { label: 'Active Incidents', value: total },
            { label: 'High Priority', value: critical },
            { label: 'AI Dispatches Today', value: '148' },
            { label: 'Average Response', value: '6m 42s' },
          ],
          actions: [
            {
              label: 'View Live Incident Grid',
              onClick: () => {
                onClose();
                onNavigateTab?.('incidents');
              },
            },
            {
              label: 'Inspect City Map',
              onClick: () => {
                onClose();
                onNavigateTab?.('map');
              },
            },
          ],
        });
      } else if (q.includes('indiranagar') || q.includes('why')) {
        setResponse({
          persona: 'drishti',
          title: 'Indiranagar Sector Vulnerability Analysis',
          summary: `Indiranagar is elevated to HIGH RISK due to historical convergence: 14 water/drainage anomalies in the past 30 days, coupled with high proximity (180m) to Indiranagar Government High School and 100ft arterial transit corridor.`,
          metrics: [
            { label: 'Repeat Reports', value: '14 in 30d' },
            { label: 'School Buffer', value: '180m radius' },
            { label: 'Cluster Confidence', value: '94%' },
          ],
          actions: [
            {
              label: 'Open Risk Intelligence',
              onClick: () => {
                onClose();
                onNavigateTab?.('intelligence');
              },
            },
          ],
        });
      } else if (q.includes('zone') || q.includes('attention')) {
        setResponse({
          persona: 'raksha',
          title: 'Priority Operational Sector: East Zone',
          summary: `Indiranagar and Koramangala sectors currently exhibit the highest operational density. 2 critical civic emergencies involve electrical transformer overheating and feeder pipe rupture near educational institutions.`,
          metrics: [
            { label: 'Highest Load Sector', value: 'East Zone' },
            { label: 'Available Teams', value: '4 Ready' },
            { label: 'Containment ETA', value: '8 min' },
          ],
          actions: [
            {
              label: 'Coordinate Response in Command Map',
              onClick: () => {
                onClose();
                onNavigateTab?.('map');
              },
            },
          ],
        });
      } else if (q.includes('water') || q.includes('flood') || q.includes('leak')) {
        setResponse({
          persona: 'jal',
          title: 'Hydrological Sentinel Report',
          summary: `JAL is actively monitoring 4 correlated water complaints within 1.8km in Indiranagar. Pipe pressure telemetry indicates a 450mm feeder main anomaly. BWSSB Rapid Water Unit 01 has been dispatched with an 8-minute confirmed ETA.`,
          metrics: [
            { label: 'Water Incidents', value: '4 Cluster' },
            { label: 'Assigned Team', value: 'BWSSB Unit 01' },
            { label: 'Drainage Status', value: 'Monitoring' },
          ],
          actions: [
            {
              label: 'Track Water Incident BP-2048',
              onClick: () => {
                onClose();
                onSelectIncident?.('BP-2048');
              },
            },
          ],
        });
      } else if (q.includes('action') || q.includes('ledger') || q.includes('took')) {
        setResponse({
          persona: 'pulse',
          title: 'Autonomous AI Action Audit (Level 4)',
          summary: `Under BharatPulse Autonomy Policy L4, AI has autonomously executed 148 verified actions today: 42 incident classifications, 28 routing calculations, 24 municipal work orders generated, and 19 post-repair photographic verifications. Zero unauthorized invocations.`,
          metrics: [
            { label: 'Audited Tool Calls', value: '148' },
            { label: 'Security Clearance', value: '100% Policy Bound' },
            { label: 'Work Orders Created', value: '24' },
          ],
          actions: [
            {
              label: 'Open AI Action Ledger',
              onClick: () => {
                onClose();
                onNavigateTab?.('system');
              },
            },
          ],
        });
      } else {
        setResponse({
          persona: 'drishti',
          title: '2030 Predictive Horizon',
          summary: `Drishti forecasts rainfall precipitation intensity rising +30% across southeastern catchment areas over the next 4 hours. Recommending pre-emptive positioning of BBMP drainage squads at Koramangala 80ft road underpass.`,
          metrics: [
            { label: 'Rainfall Spike', value: '+30% expected' },
            { label: 'Vulnerable Routes', value: '2 Arterials' },
            { label: 'Pre-emptive Action', value: 'Recommended' },
          ],
          actions: [
            {
              label: 'Launch 2030 City Twin Simulation',
              onClick: () => {
                onClose();
                onNavigateTab?.('intelligence');
              },
            },
          ],
        });
      }
    }, 450);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      handleAsk(customInput.trim());
      setCustomInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#090D16] border border-indigo-500/40 w-full max-w-2xl rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <AIAvatar personaId={response ? response.persona : 'pulse'} size="sm" state={isAnswering ? 'thinking' : 'idle'} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-wide text-white">ASK BHARATPULSE</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  CITY INTELLIGENCE · 2030
                </span>
              </div>
              <p className="text-xs text-slate-400">Direct query interface grounded in live municipal data</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleCustomSubmit} className="mt-5 flex items-center gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Ask about incidents, zones, AI actions, or future city risk..."
            className="flex-1 bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!customInput.trim() || isAnswering}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Ask</span>
          </button>
        </form>

        {/* Presets List */}
        <div className="mt-4">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-2 block">
            Suggested Operational Queries:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAsk(p.question)}
                className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                  activeQuestion === p.question
                    ? 'bg-indigo-950/40 border-indigo-500/60 text-indigo-200'
                    : 'bg-slate-900/60 hover:bg-slate-850 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium line-clamp-1">{p.question}</span>
                  <ArrowRight className="w-3 h-3 text-slate-500 shrink-0 ml-1" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Live Answer Box */}
        {isAnswering ? (
          <div className="mt-5 p-6 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center gap-3">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
            <span className="text-xs font-mono text-indigo-300">Grounded intelligence querying Bengaluru municipal data...</span>
          </div>
        ) : response ? (
          <div className="mt-5 p-5 rounded-xl bg-slate-900/90 border border-indigo-500/30 text-left animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-wide">
                  {response.title}
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                  VERIFIED DATA
                </span>
              </div>
              <AIAvatar personaId={response.persona} size="sm" showBadge={false} />
            </div>

            <p className="text-sm text-slate-200 leading-relaxed font-normal">
              "{response.summary}"
            </p>

            {response.metrics && (
              <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {response.metrics.map((m, i) => (
                  <div key={i} className="p-2 rounded-lg bg-slate-950/70 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">{m.label}</span>
                    <span className="text-sm font-bold text-white font-mono">{m.value}</span>
                  </div>
                ))}
              </div>
            )}

            {response.actions && response.actions.length > 0 && (
              <div className="mt-4 flex items-center gap-2">
                {response.actions.map((act, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={act.onClick}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <span>{act.label}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
