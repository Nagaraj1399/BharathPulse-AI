import React, { useState } from 'react';
import { ShieldCheck, Filter, Clock, CheckCircle2, AlertCircle, FileText, ChevronRight } from 'lucide-react';
import { AIAvatar } from './AIAvatar';
import { PersonaId } from '../lib/aiPersonas';

export interface LedgerEntry {
  id: string;
  time: string;
  personaId: PersonaId;
  decision: string;
  toolName: string;
  parametersSummary: string;
  resultSummary: string;
  status: 'CONFIRMED' | 'HYPOTHESIS' | 'POLICY_ENFORCED' | 'AUTHORIZED';
  incidentId?: string;
  latencyMs?: number;
}

const DEFAULT_LEDGER_ENTRIES: LedgerEntry[] = [
  {
    id: 'act-09',
    time: '13:46:22',
    personaId: 'pulse',
    decision: 'Post-repair photographic evidence validated; incident resolution confirmed',
    toolName: 'verifyResolution',
    parametersSummary: 'pressureRestored=true, completionPhoto=true',
    resultSummary: 'BP-2048 Status updated to RESOLVED in municipal registry',
    status: 'CONFIRMED',
    incidentId: 'BP-2048',
    latencyMs: 380,
  },
  {
    id: 'act-08',
    time: '13:45:10',
    personaId: 'raksha',
    decision: 'On-site verification requested from field technician',
    toolName: 'requestVerification',
    parametersSummary: 'teamId=TEAM-BWSSB-01, type=ON_SITE_COMPLETION',
    resultSummary: 'Digital checklist issued to mobile field terminal',
    status: 'AUTHORIZED',
    incidentId: 'BP-2048',
    latencyMs: 140,
  },
  {
    id: 'act-07',
    time: '13:44:05',
    personaId: 'pulse',
    decision: 'Binding municipal work order generated and alert broadcast',
    toolName: 'createWorkOrder',
    parametersSummary: 'priority=HIGH, etaMinutes=8, teamId=TEAM-BWSSB-01',
    resultSummary: 'WO-BWSSB-2048 logged and dispatched via secure gateway',
    status: 'CONFIRMED',
    incidentId: 'BP-2048',
    latencyMs: 220,
  },
  {
    id: 'act-06',
    time: '13:43:51',
    personaId: 'pulse',
    decision: 'Route & traffic-aware arrival ETA calculated via road network',
    toolName: 'calculateResponseRoute',
    parametersSummary: 'origin=Ulsoor Depot, dest=Indiranagar 100ft Rd',
    resultSummary: 'Calculated 2.4 km road route; Confirmed ETA: 8 minutes',
    status: 'CONFIRMED',
    incidentId: 'BP-2048',
    latencyMs: 310,
  },
  {
    id: 'act-05',
    time: '13:43:12',
    personaId: 'raksha',
    decision: 'Response team matched by capability, active workload & distance',
    toolName: 'findAvailableResponseTeams',
    parametersSummary: 'type=WATER_LEAK, severity=HIGH, radius=3km',
    resultSummary: 'BWSSB Rapid Water Unit 01 selected (load: 1/4, 2.1km)',
    status: 'CONFIRMED',
    incidentId: 'BP-2048',
    latencyMs: 195,
  },
  {
    id: 'act-04',
    time: '13:42:30',
    personaId: 'raksha',
    decision: 'Critical infrastructure scanned; school proximity detected at 180m',
    toolName: 'findNearbyCriticalPlaces',
    parametersSummary: 'radius=2500m, lat=12.9782, lng=77.6415',
    resultSummary: 'Indiranagar Govt High School at 180m; priority escalated to HIGH',
    status: 'CONFIRMED',
    incidentId: 'BP-2048',
    latencyMs: 280,
  },
  {
    id: 'act-03',
    time: '13:42:04',
    personaId: 'drishti',
    decision: 'Spatiotemporal cluster analysis detected 4 correlated drainage reports',
    toolName: 'detectIncidentClusters',
    parametersSummary: 'radiusKm=2.5, category=WATER_LEAK',
    resultSummary: 'Cluster identified: probable 450mm distribution feeder rupture',
    status: 'HYPOTHESIS',
    incidentId: 'BP-2048',
    latencyMs: 410,
  },
  {
    id: 'act-02',
    time: '13:41:40',
    personaId: 'jal',
    decision: 'Citizen audio input categorized as physical infrastructure emergency',
    toolName: 'classifyIncident',
    parametersSummary: 'description="major water leak outside school road flooding"',
    resultSummary: 'Category: WATER_LEAK, Severity: HIGH, Confidence: 94%',
    status: 'CONFIRMED',
    incidentId: 'BP-2048',
    latencyMs: 340,
  },
  {
    id: 'act-01',
    time: '13:41:15',
    personaId: 'setu',
    decision: 'Citizen voice report registered on municipal grid via Gemini Live',
    toolName: 'createIncident',
    parametersSummary: 'lang=en, lat=12.9782, lng=77.6415',
    resultSummary: 'Official Incident ID BP-2048 minted in Firestore DB',
    status: 'CONFIRMED',
    incidentId: 'BP-2048',
    latencyMs: 160,
  },
];

interface ActionLedgerProps {
  entries?: LedgerEntry[];
  onSelectIncident?: (incidentId: string) => void;
}

export const ActionLedger: React.FC<ActionLedgerProps> = ({
  entries = DEFAULT_LEDGER_ENTRIES,
  onSelectIncident,
}) => {
  const [filterPersona, setFilterPersona] = useState<string>('all');
  const [selectedEntry, setSelectedEntry] = useState<LedgerEntry | null>(null);

  const filtered = entries.filter((e) =>
    filterPersona === 'all' ? true : e.personaId === filterPersona
  );

  return (
    <div className="bg-[#090D16] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
              AI ACTION LEDGER
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              AUDITABLE · ZERO CHAIN-OF-THOUGHT
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Every autonomous AI tool invocation is signed, logged, and policy-checked before execution.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs">
          {['all', 'pulse', 'jal', 'raksha', 'drishti', 'setu'].map((id) => (
            <button
              key={id}
              onClick={() => setFilterPersona(id)}
              className={`px-2.5 py-1 rounded-lg font-mono uppercase text-[11px] transition-colors ${
                filterPersona === id
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      {/* Ledger Table */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] font-mono uppercase text-slate-500 tracking-wider">
              <th className="py-2.5 px-3">Time</th>
              <th className="py-2.5 px-3">Agent</th>
              <th className="py-2.5 px-3">Decision Summary</th>
              <th className="py-2.5 px-3">Tool Invocated</th>
              <th className="py-2.5 px-3">Audit State</th>
              <th className="py-2.5 px-3 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850">
            {filtered.map((item) => (
              <tr
                key={item.id}
                onClick={() => setSelectedEntry(item)}
                className="hover:bg-slate-900/60 cursor-pointer transition-colors group"
              >
                <td className="py-3 px-3 font-mono text-slate-400 tabular-nums whitespace-nowrap">
                  {item.time}
                </td>
                <td className="py-3 px-3 whitespace-nowrap">
                  <AIAvatar personaId={item.personaId} size="sm" showBadge={true} />
                </td>
                <td className="py-3 px-3 text-slate-200 font-medium max-w-xs truncate">
                  {item.decision}
                </td>
                <td className="py-3 px-3 font-mono text-indigo-300 whitespace-nowrap">
                  <code>{item.toolName}</code>
                </td>
                <td className="py-3 px-3 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                      item.status === 'CONFIRMED'
                        ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                        : item.status === 'HYPOTHESIS'
                        ? 'bg-purple-950/40 text-purple-300 border-purple-500/30'
                        : 'bg-indigo-950/40 text-indigo-300 border-indigo-500/30'
                    }`}
                  >
                    {item.status === 'CONFIRMED' && <CheckCircle2 className="w-2.5 h-2.5" />}
                    {item.status}
                  </span>
                </td>
                <td className="py-3 px-3 text-right whitespace-nowrap text-slate-500 group-hover:text-slate-300">
                  <ChevronRight className="w-4 h-4 inline-block" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Drawer Modal */}
      {selectedEntry && (
        <div className="mt-4 p-4 rounded-xl bg-slate-900/90 border border-indigo-500/30 text-xs animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-mono text-slate-400">{selectedEntry.time}</span>
              <span className="font-bold text-white uppercase">{selectedEntry.toolName}</span>
              {selectedEntry.incidentId && (
                <button
                  onClick={() => onSelectIncident?.(selectedEntry.incidentId!)}
                  className="font-mono text-indigo-400 hover:underline px-1.5 py-0.5 rounded bg-slate-800"
                >
                  {selectedEntry.incidentId}
                </button>
              )}
            </div>
            <button
              onClick={() => setSelectedEntry(null)}
              className="text-slate-400 hover:text-white"
            >
              Close
            </button>
          </div>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">
                Arguments Provided:
              </span>
              <pre className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto">
                {selectedEntry.parametersSummary}
              </pre>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">
                Confirmed Tool Output:
              </span>
              <pre className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto">
                {selectedEntry.resultSummary}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
