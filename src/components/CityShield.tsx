import React from 'react';
import { ShieldCheck, Lock, Activity, CheckCircle, Server, RefreshCw } from 'lucide-react';

export const CityShield: React.FC = () => {
  return (
    <div className="bg-[#090D16] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
              CITY SHIELD · CYBER RESILIENCE LAYER
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              OPERATIONAL TRUST
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographic verification, tool authorization policies, and continuous API integrity monitoring.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/30 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>AUTONOMY GATEWAY: NOMINAL</span>
        </div>
      </div>

      {/* 4 Pillars of Cyber Resilience */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-slate-400 mb-1">
            <Lock className="w-3 h-3 text-indigo-400" />
            <span>AI Tool Security</span>
          </div>
          <span className="text-sm font-bold text-emerald-400 font-mono flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> SECURE
          </span>
          <span className="text-[10px] text-slate-500 block mt-1">Whitelist enforced</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-slate-400 mb-1">
            <Server className="w-3 h-3 text-cyan-400" />
            <span>API Gateway</span>
          </div>
          <span className="text-sm font-bold text-emerald-400 font-mono flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> SECURE
          </span>
          <span className="text-[10px] text-slate-500 block mt-1">Ephemeral tokens</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-slate-400 mb-1">
            <RefreshCw className="w-3 h-3 text-amber-400" />
            <span>Data Integrity</span>
          </div>
          <span className="text-sm font-bold text-emerald-400 font-mono flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> NORMAL
          </span>
          <span className="text-[10px] text-slate-500 block mt-1">Firestore verified</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-slate-400 mb-1">
            <Activity className="w-3 h-3 text-purple-400" />
            <span>Unusual Requests</span>
          </div>
          <span className="text-sm font-bold text-white font-mono">0</span>
          <span className="text-[10px] text-slate-500 block mt-1">0 blocked attacks</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-slate-400 mb-1">
            <Activity className="w-3 h-3 text-emerald-400" />
            <span>System Health</span>
          </div>
          <span className="text-sm font-bold text-white font-mono">99.98%</span>
          <span className="text-[10px] text-slate-500 block mt-1">Uptime 2030</span>
        </div>
      </div>

      {/* Autonomy Level Policy Banner */}
      <div className="mt-5 p-4 rounded-xl bg-slate-900 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-300 font-mono uppercase tracking-wider">
              Autonomy Level 4 Policy
            </span>
            <span className="text-[10px] text-slate-400">·</span>
            <span className="text-xs text-slate-300">Autonomous Coordination + Verified Closure</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            "AI may execute predefined civic-response tools. High-risk actions remain policy controlled, signed, and auditable."
          </p>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-mono">
          <span className="px-2 py-1 rounded bg-slate-800 text-slate-500">L1 Observe</span>
          <span className="px-2 py-1 rounded bg-slate-800 text-slate-500">L2 Recommend</span>
          <span className="px-2 py-1 rounded bg-slate-800 text-slate-500">L3 Coordinate</span>
          <span className="px-2.5 py-1 rounded bg-indigo-600 text-white font-bold shadow-sm">
            L4 Act + Verify
          </span>
        </div>
      </div>
    </div>
  );
};
