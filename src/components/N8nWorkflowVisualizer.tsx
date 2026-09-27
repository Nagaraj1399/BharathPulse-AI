import React from 'react';
import { Network, Server, ArrowRight, ShieldCheck, CheckCircle2, Cpu, Bell, Database, Ticket } from 'lucide-react';

interface N8nWorkflowVisualizerProps {
  isDarkMode?: boolean;
}

export const N8nWorkflowVisualizer: React.FC<N8nWorkflowVisualizerProps> = ({
  isDarkMode = false,
}) => {
  const workflowNodes = [
    {
      id: 'step-1',
      title: 'Citizen Input',
      sub: 'URL Submitted',
      icon: Network,
      color: 'text-indigo-600 dark:text-indigo-400',
      border: 'border-indigo-300 dark:border-indigo-700',
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    },
    {
      id: 'step-2',
      title: 'n8n Webhook',
      sub: 'Sanitize & Ingest',
      icon: Server,
      color: 'text-cyan-600 dark:text-cyan-400',
      border: 'border-cyan-300 dark:border-cyan-700',
      bg: 'bg-cyan-50 dark:bg-cyan-950/40',
    },
    {
      id: 'step-3',
      title: 'Threat Intel Node',
      sub: 'Heuristics + Gemini',
      icon: Cpu,
      color: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-300 dark:border-purple-700',
      bg: 'bg-purple-50 dark:bg-purple-950/40',
    },
    {
      id: 'step-4',
      title: 'Ticket Generation',
      sub: 'CYBER-N8N Token',
      icon: Ticket,
      color: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-300 dark:border-amber-700',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
    },
    {
      id: 'step-5',
      title: 'Queue Synced',
      sub: 'Privacy Redacted',
      icon: Database,
      color: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-300 dark:border-emerald-700',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    },
    {
      id: 'step-6',
      title: 'CERT-In Dispatch',
      sub: 'Radio / SMS Alert',
      icon: Bell,
      color: 'text-rose-600 dark:text-rose-400',
      border: 'border-rose-300 dark:border-rose-700',
      bg: 'bg-rose-50 dark:bg-rose-950/40',
    },
  ];

  return (
    <div
      className={`p-5 rounded-2xl border transition-colors ${
        isDarkMode
          ? 'bg-slate-900/80 border-slate-800 text-slate-100 shadow-md'
          : 'bg-white border-slate-200 text-slate-900 shadow-xs'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center font-black text-xs font-mono">
            n8n
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black tracking-tight flex items-center gap-1.5">
              <span>n8n Orchestration Architecture</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold dark:bg-emerald-950/50 dark:text-emerald-400">
                ACTIVE
              </span>
            </h4>
            <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              End-to-end autonomous pipeline from link submission to municipal rapid response
            </p>
          </div>
        </div>

        <span className="font-mono text-[10px] text-slate-400 self-start sm:self-auto">
          Webhook Pipeline: /api/cyber/report
        </span>
      </div>

      {/* Workflow Step Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-4">
        {workflowNodes.map((node, idx) => {
          const Icon = node.icon;
          return (
            <div
              key={node.id}
              className={`p-3 rounded-xl border flex flex-col justify-between transition-all hover:scale-102 ${node.border} ${node.bg}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold opacity-60">0{idx + 1}</span>
                <Icon className={`w-4 h-4 ${node.color}`} />
              </div>
              <div className="mt-2">
                <p className="font-extrabold text-xs tracking-tight truncate">{node.title}</p>
                <p className={`text-[10px] font-mono mt-0.5 truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {node.sub}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
