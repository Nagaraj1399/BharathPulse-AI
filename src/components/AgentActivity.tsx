import React from 'react';
import { AgentAction, AgentLoopPhase } from '../../shared/types';
import { Terminal, CheckCircle2, Clock, Cpu, Radio, Shield, Wrench, Eye } from 'lucide-react';

interface AgentActivityProps {
  actions: AgentAction[];
  currentPhase?: AgentLoopPhase;
  compact?: boolean;
}

export const AgentActivity: React.FC<AgentActivityProps> = ({
  actions,
  currentPhase = 'OBSERVE',
  compact = false,
}) => {
  const phases: { phase: AgentLoopPhase; label: string; icon: any }[] = [
    { phase: 'OBSERVE', label: 'Observe', icon: Radio },
    { phase: 'UNDERSTAND', label: 'Understand', icon: Cpu },
    { phase: 'PLAN', label: 'Plan', icon: Eye },
    { phase: 'INVESTIGATE', label: 'Investigate', icon: Shield },
    { phase: 'ACT', label: 'Act', icon: Wrench },
    { phase: 'VERIFY', label: 'Verify', icon: CheckCircle2 },
    { phase: 'RESOLVE', label: 'Resolve', icon: CheckCircle2 },
  ];

  const phaseOrder: Record<AgentLoopPhase, number> = {
    OBSERVE: 0,
    UNDERSTAND: 1,
    PLAN: 2,
    INVESTIGATE: 3,
    ACT: 4,
    VERIFY: 5,
    RESOLVE: 6,
  };

  const currentIdx = phaseOrder[currentPhase] ?? 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-md flex flex-col h-full">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-indigo-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            LIVE AI AGENT TELEMETRY
          </h3>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 text-[10px] font-mono font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
          ACTIVE
        </div>
      </div>

      {/* Autonomous Loop Phase Stepper */}
      <div className="py-3 border-b border-slate-200">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
          Agent Loop Progression
        </div>
        <div className="grid grid-cols-7 gap-1">
          {phases.map((p, idx) => {
            const isPassed = idx <= currentIdx;
            const isCurrent = idx === currentIdx;
            const Icon = p.icon;
            return (
              <div
                key={p.phase}
                className={`flex flex-col items-center p-1 rounded-lg border text-center transition-all ${
                  isCurrent
                    ? 'bg-cyan-50 border-cyan-400 text-cyan-800 shadow-xs font-bold'
                    : isPassed
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <Icon className="w-3 h-3 mb-0.5" />
                <span className="text-[9px] font-semibold truncate max-w-full">
                  {p.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Tool Execution Stream */}
      <div className="flex-1 overflow-y-auto mt-3 pr-1 space-y-2 max-h-[360px] scrollbar-thin">
        {actions.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs flex flex-col items-center justify-center">
            <Cpu className="w-8 h-8 text-slate-300 mb-2 animate-pulse" />
            <p>Agent is standing by on municipal frequency.</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Citizen reports trigger real-time tool calling loop.
            </p>
          </div>
        ) : (
          actions.map((act) => {
            const timeStr = new Date(act.timestamp).toLocaleTimeString([], {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            });

            return (
              <div
                key={act.id}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs transition-all hover:bg-slate-100/80"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 font-mono text-slate-600 font-semibold">
                    <span className="text-slate-400 text-[10px]">{timeStr}</span>
                    <span className="text-amber-700 font-bold">tool:</span>
                    <span className="text-indigo-700">{act.tool}</span>
                  </div>
                  {act.latencyMs && (
                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {act.latencyMs}ms
                    </span>
                  )}
                </div>

                <p className="text-slate-800 mt-1 font-medium leading-relaxed text-[11px]">
                  {act.summary}
                </p>

                {!compact && act.result && (
                  <div className="mt-1.5 pt-1.5 border-t border-slate-200 font-mono text-[10px] text-slate-600 flex flex-wrap gap-2">
                    {Boolean((act.result as any).incidentType) && (
                      <span className="px-1.5 py-0.2 rounded bg-white border border-slate-200 text-slate-700">
                        type: {String((act.result as any).incidentType)}
                      </span>
                    )}
                    {Boolean((act.result as any).durationMinutes) && (
                      <span className="px-1.5 py-0.2 rounded bg-white border border-slate-200 text-cyan-800 font-bold">
                        ETA: {String((act.result as any).durationMinutes)}m
                      </span>
                    )}
                    {Boolean((act.result as any).workOrderId) && (
                      <span className="px-1.5 py-0.2 rounded bg-white border border-slate-200 text-amber-800 font-bold">
                        id: {String((act.result as any).workOrderId)}
                      </span>
                    )}
                    {Boolean((act.result as any).detected) && (
                      <span className="px-1.5 py-0.2 rounded bg-orange-100 border border-orange-300 text-orange-900 font-bold">
                        NETWORK CLUSTER
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
