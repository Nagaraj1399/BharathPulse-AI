import React from 'react';
import { IncidentSeverity, IncidentStatus, TeamAvailability } from '../../shared/types';
import { SEVERITY_CONFIG } from '../../shared/schemas';

interface StatusBadgeProps {
  status?: IncidentStatus;
  severity?: IncidentSeverity;
  availability?: TeamAvailability;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  severity,
  availability,
  className = '',
}) => {
  if (severity) {
    const config = SEVERITY_CONFIG[severity];
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.badgeClass} ${className}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.pingClass}`} />
        {config.label}
      </span>
    );
  }

  if (availability) {
    const isAvail = availability === 'AVAILABLE';
    const isDisp = availability === 'DISPATCHED' || availability === 'ON_SCENE';
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
          isAvail
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : isDisp
            ? 'bg-cyan-50 text-cyan-800 border-cyan-200'
            : 'bg-slate-100 text-slate-700 border-slate-200'
        } ${className}`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isAvail ? 'bg-emerald-500 animate-pulse' : isDisp ? 'bg-cyan-500' : 'bg-slate-400'
          }`}
        />
        {availability.replace('_', ' ')}
      </span>
    );
  }

  if (status) {
    const isResolved = status === 'RESOLVED';
    const isEscalated = status === 'ESCALATED';
    const isVerifying = status === 'VERIFYING';
    const isDispatched = status === 'DISPATCHED' || status === 'ON_SITE';
    const isAnalyzing = status === 'ANALYZING' || status === 'INVESTIGATING';

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border ${
          isResolved
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : isEscalated
            ? 'bg-rose-50 text-rose-800 border-rose-300 animate-pulse font-bold'
            : isVerifying
            ? 'bg-purple-50 text-purple-800 border-purple-200'
            : isDispatched
            ? 'bg-cyan-50 text-cyan-800 border-cyan-200'
            : isAnalyzing
            ? 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse'
            : 'bg-slate-100 text-slate-700 border-slate-200'
        } ${className}`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isResolved
              ? 'bg-emerald-500'
              : isEscalated
              ? 'bg-rose-500'
              : isVerifying
              ? 'bg-purple-500'
              : isDispatched
              ? 'bg-cyan-500'
              : isAnalyzing
              ? 'bg-amber-500'
              : 'bg-slate-400'
          }`}
        />
        {status.replace('_', ' ')}
      </span>
    );
  }

  return null;
};
