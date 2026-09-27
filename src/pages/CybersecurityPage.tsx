import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Radio,
  Network,
  RotateCcw,
  CheckCircle2,
  Lock,
  PhoneCall,
  Activity,
  ArrowRight,
  ExternalLink,
  Moon,
  Sun,
} from 'lucide-react';
import { CyberSecurityChecker } from '../components/CyberSecurityChecker';
import { CyberSurakshaAgent } from '../components/CyberSurakshaAgent';
import { N8nWorkflowVisualizer } from '../components/N8nWorkflowVisualizer';
import { api } from '../lib/api';
import { CyberScanResult, CyberIncidentReport, CyberStats } from '../../shared/types';
import { soundFx } from '../lib/soundFx';

interface CybersecurityPageProps {
  onIncidentCreated?: (incidentId: string) => void;
  onOpenDashboard?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const CybersecurityPage: React.FC<CybersecurityPageProps> = ({
  onIncidentCreated,
  onOpenDashboard,
  isDarkMode = false,
  onToggleDarkMode,
}) => {
  const [currentScan, setCurrentScan] = useState<CyberScanResult | null>(null);
  const [stats, setStats] = useState<CyberStats>({
    linksChecked: 148,
    suspiciousDetected: 41,
    highRiskDetected: 27,
    reportsSubmitted: 19,
    routedViaN8n: 19,
  });

  const loadStats = useCallback(async () => {
    try {
      const data = await api.getCyberStats();
      setStats(data);
    } catch (e) {
      console.warn('Could not refresh cyber stats:', e);
    }
  }, []);

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 5000);
    return () => clearInterval(interval);
  }, [loadStats]);

  const handleScanComplete = (result: CyberScanResult) => {
    setCurrentScan(result);
    loadStats();
  };

  const handleReportCreated = (report: CyberIncidentReport) => {
    loadStats();
    if (onIncidentCreated) {
      onIncidentCreated(report.incidentId);
    }
  };

  const statCards = [
    {
      label: 'LINKS CHECKED',
      value: stats.linksChecked,
      sub: 'Threat Intelligence Scans',
      color: 'text-indigo-600 dark:text-indigo-400',
      border: 'border-indigo-200 dark:border-indigo-800',
      bg: 'bg-indigo-50/50 dark:bg-indigo-950/20',
      icon: Activity,
    },
    {
      label: 'SUSPICIOUS DETECTED',
      value: stats.suspiciousDetected,
      sub: 'Low-reputation / Shorteners',
      color: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-800',
      bg: 'bg-amber-50/50 dark:bg-amber-950/20',
      icon: AlertTriangle,
    },
    {
      label: 'HIGH-RISK DETECTED',
      value: stats.highRiskDetected,
      sub: 'Phishing / Malware APKs',
      color: 'text-rose-600 dark:text-rose-400',
      border: 'border-rose-200 dark:border-rose-800',
      bg: 'bg-rose-50/50 dark:bg-rose-950/20',
      icon: ShieldAlert,
    },
    {
      label: 'CYBER REPORTS SUBMITTED',
      value: stats.reportsSubmitted,
      sub: 'Citizen Civic Escalations',
      color: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-200 dark:border-purple-800',
      bg: 'bg-purple-50/50 dark:bg-purple-950/20',
      icon: CheckCircle2,
    },
    {
      label: 'ROUTED VIA n8n',
      value: stats.routedViaN8n,
      sub: 'Automated Response Tickets',
      color: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-800',
      bg: 'bg-emerald-50/50 dark:bg-emerald-950/20',
      icon: Network,
    },
  ];

  return (
    <div className={`space-y-6 ${isDarkMode ? 'dark' : ''}`}>
      {/* Top Banner & Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              CYBERSECURITY — SUSPICIOUS LINK CHECKER
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-400 border border-cyan-300 dark:border-cyan-800 text-[10px] font-bold">
              CITIZEN PROTECTION
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time phishing detection, brand impersonation analysis & n8n municipal crime reporting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onToggleDarkMode && (
            <button
              type="button"
              onClick={onToggleDarkMode}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span className="text-[11px] font-mono">{isDarkMode ? 'LIGHT' : 'DARK'}</span>
            </button>
          )}

          {onOpenDashboard && (
            <button
              type="button"
              onClick={onOpenDashboard}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Incident Queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Cybersecurity Protection Telemetry Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-[11px]">
            Cybersecurity Protection Telemetry
          </span>
          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            LIVE SHIELD ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {statCards.map((st, i) => {
            const Icon = st.icon;
            return (
              <div
                key={i}
                className={`p-3.5 rounded-xl border transition-all hover:translate-y-[-2px] hover:shadow-xs ${st.border} ${st.bg} ${
                  isDarkMode ? 'bg-slate-900/60' : 'bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
                    {st.label}
                  </span>
                  <Icon className={`w-3.5 h-3.5 ${st.color}`} />
                </div>
                <div className={`text-xl sm:text-2xl font-black font-mono tracking-tight mt-1 ${st.color}`}>
                  {st.value}
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate font-medium">
                  {st.sub}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Layout: Checker (2 cols) + Cyber Suraksha Voice Agent (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left & Center: Suspicious Link Checker (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <CyberSecurityChecker
            onScanComplete={handleScanComplete}
            onReportCreated={handleReportCreated}
            isDarkMode={isDarkMode}
          />

          {/* n8n Orchestration Architecture Visualizer */}
          <N8nWorkflowVisualizer isDarkMode={isDarkMode} />
        </div>

        {/* Right: Cyber Suraksha Voice & AI Agent */}
        <div className="lg:col-span-1 h-[680px]">
          <CyberSurakshaAgent currentScan={currentScan} isDarkMode={isDarkMode} />
        </div>
      </div>
    </div>
  );
};
