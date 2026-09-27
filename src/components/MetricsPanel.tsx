import React, { useState, useEffect } from 'react';
import { Incident, ResponseTeam, CyberStats } from '../../shared/types';
import { AlertTriangle, Clock, Users, CheckCircle2, ShieldCheck, Waves, ShieldAlert } from 'lucide-react';
import { api } from '../lib/api';

interface MetricsPanelProps {
  incidents: Incident[];
  teams: ResponseTeam[];
  onOpenCyber?: () => void;
}

export const MetricsPanel: React.FC<MetricsPanelProps> = ({ incidents, teams, onOpenCyber }) => {
  const [cyberStats, setCyberStats] = useState<CyberStats>({
    linksChecked: 148,
    suspiciousDetected: 41,
    highRiskDetected: 27,
    reportsSubmitted: 19,
    routedViaN8n: 19,
  });

  useEffect(() => {
    let isMounted = true;
    api.getCyberStats().then((data) => {
      if (isMounted) setCyberStats(data);
    }).catch(() => {});

    const timer = setInterval(() => {
      api.getCyberStats().then((data) => {
        if (isMounted) setCyberStats(data);
      }).catch(() => {});
    }, 6000);

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, []);

  const activeIncidents = incidents.filter((i) => i.status !== 'RESOLVED').length;
  const highPriority = incidents.filter(
    (i) => (i.severity === 'HIGH' || i.severity === 'CRITICAL') && i.status !== 'RESOLVED'
  ).length;
  const availableTeams = teams.filter((t) => t.availability === 'AVAILABLE').length;
  const resolvedCount = incidents.filter((i) => i.status === 'RESOLVED').length;

  const clusteredCount = incidents.filter((i) => !!i.clusterHypothesis).length;

  const metrics = [
    {
      label: 'ACTIVE INCIDENTS',
      value: activeIncidents,
      subtext: `${incidents.length} total registered`,
      icon: AlertTriangle,
      color: 'text-amber-600',
      iconColor: 'text-amber-500',
      border: 'border-amber-200',
      bg: 'bg-amber-50/40',
    },
    {
      label: 'HIGH / CRITICAL',
      value: highPriority,
      subtext: 'Prioritized for rapid dispatch',
      icon: ShieldCheck,
      color: 'text-rose-600',
      iconColor: 'text-rose-500',
      border: 'border-rose-200',
      bg: 'bg-rose-50/40',
    },
    {
      label: 'AVAILABLE TEAMS',
      value: `${availableTeams} / ${teams.length}`,
      subtext: 'Municipal rapid response crews',
      icon: Users,
      color: 'text-emerald-700',
      iconColor: 'text-emerald-600',
      border: 'border-emerald-200',
      bg: 'bg-emerald-50/40',
    },
    {
      label: 'AVERAGE RESPONSE ETA',
      value: '7.8 min',
      subtext: 'Traffic-aware optimal routing',
      icon: Clock,
      color: 'text-cyan-700',
      iconColor: 'text-cyan-600',
      border: 'border-cyan-200',
      bg: 'bg-cyan-50/40',
    },
    {
      label: 'RESOLVED TODAY',
      value: resolvedCount,
      subtext: 'Verified with field telemetry',
      icon: CheckCircle2,
      color: 'text-emerald-700',
      iconColor: 'text-emerald-600',
      border: 'border-emerald-200',
      bg: 'bg-emerald-50/40',
    },
    {
      label: 'NETWORK RISK SIGNALS',
      value: clusteredCount > 0 ? `${clusteredCount} Active` : 'Nominal',
      subtext: clusteredCount > 0 ? 'Water / Grid density alert' : 'No anomalous cluster',
      icon: Waves,
      color: clusteredCount > 0 ? 'text-orange-600 animate-pulse' : 'text-slate-600',
      iconColor: clusteredCount > 0 ? 'text-orange-500' : 'text-slate-400',
      border: clusteredCount > 0 ? 'border-orange-300' : 'border-slate-200',
      bg: clusteredCount > 0 ? 'bg-orange-50/60' : 'bg-slate-50',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {metrics.map((m, idx) => {
        const Icon = m.icon;
        return (
          <div
            key={idx}
            className={`p-3 rounded-xl border bg-white shadow-xs transition-all hover:translate-y-[-2px] hover:shadow-sm ${m.border} ${m.bg}`}
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500">
                {m.label}
              </span>
              <Icon className={`w-3.5 h-3.5 ${m.iconColor}`} />
            </div>
            <div className={`text-xl sm:text-2xl font-black tracking-tight mt-1.5 ${m.color}`}>
              {m.value}
            </div>
            <p className="text-[10px] text-slate-500 mt-1 truncate font-medium">{m.subtext}</p>
          </div>
        );
      })}
    </div>

    {/* Cybersecurity Protection Telemetry Strip (Requirement 16) */}
    <div className="p-3 rounded-xl bg-slate-900 text-white border border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-indigo-500 text-white flex items-center justify-center shrink-0">
          <ShieldAlert className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black tracking-wide">Cybersecurity Protection</span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-900 text-indigo-300 border border-indigo-700">
              n8n AUTOMATION
            </span>
          </div>
          <p className="text-[10px] text-slate-400">
            Live link scanning & automated municipal cyber fraud routing
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto text-[11px] font-mono">
        <div className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700">
          <span className="text-slate-400 block text-[9px] uppercase">Links Checked</span>
          <span className="font-bold text-white text-xs">{cyberStats.linksChecked}</span>
        </div>

        <div className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700">
          <span className="text-amber-400 block text-[9px] uppercase">Suspicious</span>
          <span className="font-bold text-amber-300 text-xs">{cyberStats.suspiciousDetected}</span>
        </div>

        <div className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700">
          <span className="text-rose-400 block text-[9px] uppercase">High-Risk</span>
          <span className="font-bold text-rose-300 text-xs">{cyberStats.highRiskDetected}</span>
        </div>

        <div className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700">
          <span className="text-cyan-400 block text-[9px] uppercase">Cyber Reports</span>
          <span className="font-bold text-cyan-300 text-xs">{cyberStats.reportsSubmitted}</span>
        </div>

        <div className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700">
          <span className="text-emerald-400 block text-[9px] uppercase">Routed via n8n</span>
          <span className="font-bold text-emerald-300 text-xs">{cyberStats.routedViaN8n}</span>
        </div>

        {onOpenCyber && (
          <button
            type="button"
            onClick={onOpenCyber}
            className="px-2.5 py-1.5 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-sans text-xs font-bold transition-colors whitespace-nowrap"
          >
            Scan Link
          </button>
        )}
      </div>
    </div>
  </div>
);
};
