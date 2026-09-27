import React, { useState } from 'react';
import { ShieldCheck, Lock, Activity, RefreshCw, Server, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { CityShield } from '../components/CityShield';
import { ActionLedger } from '../components/ActionLedger';

interface CitySystemPageProps {
  onSelectIncident?: (id: string) => void;
}

export const CitySystemPage: React.FC<CitySystemPageProps> = ({ onSelectIncident }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fade-in text-left">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs font-mono text-emerald-400 uppercase tracking-wider">
              TRUST, GOVERNANCE & CYBER RESILIENCE
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-xs text-slate-400 font-mono">BENGALURU 2030</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
            CITY SYSTEM & AUDIT LEDGER
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Cryptographic audit trails, policy-controlled autonomy, and tamper-resistant municipal action records.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>AUTONOMY L4 ACTIVE (POLICY BOUND)</span>
        </div>
      </div>

      {/* City Shield Component */}
      <CityShield />

      {/* Action Ledger Component */}
      <ActionLedger onSelectIncident={onSelectIncident} />
    </div>
  );
};
