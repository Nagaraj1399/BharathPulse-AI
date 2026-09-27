import React from 'react';
import { AgentAction, Incident } from '../../shared/types';
import { CheckCircle2, Clock, Cpu, Radio, Shield, Wrench, AlertTriangle, Layers } from 'lucide-react';

interface IncidentTimelineProps {
  incident: Incident;
  actions?: AgentAction[];
}

export const IncidentTimeline: React.FC<IncidentTimelineProps> = ({ incident, actions = [] }) => {
  const getToolIcon = (tool: string) => {
    switch (tool) {
      case 'classifyIncident':
        return Cpu;
      case 'findNearbyCriticalPlaces':
        return Shield;
      case 'findAvailableResponseTeams':
        return Wrench;
      case 'calculateResponseRoute':
        return Clock;
      case 'createWorkOrder':
        return Layers;
      case 'notifyResponseTeam':
        return Radio;
      case 'detectIncidentClusters':
        return AlertTriangle;
      case 'verifyResolution':
      case 'requestVerification':
        return CheckCircle2;
      default:
        return Cpu;
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          Autonomous Response Timeline
        </h3>
        <span className="text-[10px] text-slate-500 font-mono">
          Ref: {incident.id}
        </span>
      </div>

      <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {/* Step 0: Citizen Intake */}
        <div className="relative">
          <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center text-amber-400">
            <Radio className="w-2.5 h-2.5" />
          </div>
          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-400">Citizen Voice Intake</span>
              <span className="text-[10px] text-slate-500 font-mono">
                {new Date(incident.createdAt).toLocaleTimeString([], { hour12: false })}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
              "{incident.description}"
            </p>
          </div>
        </div>

        {/* Dynamic Tool Executions */}
        {actions.map((act) => {
          const Icon = getToolIcon(act.tool);
          const isResolved = act.tool === 'verifyResolution';
          const time = new Date(act.timestamp).toLocaleTimeString([], {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });

          return (
            <div key={act.id} className="relative">
              <div
                className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  isResolved
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    : 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                }`}
              >
                <Icon className="w-2.5 h-2.5" />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-cyan-300">{act.tool}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{time}</span>
                </div>
                <p className="text-xs text-slate-200 mt-0.5 font-medium leading-relaxed">
                  {act.summary}
                </p>
              </div>
            </div>
          );
        })}

        {/* Current State Indicator */}
        <div className="relative">
          <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-2.5 h-2.5" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-emerald-400">Current Status: {incident.status}</span>
            {incident.resolvedAt && (
              <p className="text-[11px] text-slate-400 mt-0.5">
                Resolution confirmed at{' '}
                {new Date(incident.resolvedAt).toLocaleTimeString([], { hour12: false })}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
