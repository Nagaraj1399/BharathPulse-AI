import React, { useState, useEffect } from 'react';
import { Incident, AgentAction, NotificationItem, ResponseTeam } from '../../shared/types';
import { StatusBadge } from '../components/StatusBadge';
import { WorkOrderCard } from '../components/WorkOrderCard';
import { ResponseTeamCard } from '../components/ResponseTeamCard';
import { CriticalFacilityCard } from '../components/CriticalFacilityCard';
import { AIAvatar } from '../components/AIAvatar';
import { getPersonaForContext } from '../lib/aiPersonas';
import { api } from '../lib/api';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Radio,
  FileText,
  Camera,
  RefreshCw,
  Building,
  Users,
  Navigation,
  ExternalLink,
} from 'lucide-react';
import { soundFx } from '../lib/soundFx';
import { getLocationAreaImage } from '../lib/locationImages';

interface IncidentDetailPageProps {
  incidentId: string;
  onBack: () => void;
  teams?: ResponseTeam[];
}

export const IncidentDetailPage: React.FC<IncidentDetailPageProps> = ({
  incidentId,
  onBack,
  teams = [],
}) => {
  const [incident, setIncident] = useState<Incident | null>(null);
  const [actions, setActions] = useState<AgentAction[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getIncident(incidentId);
      setIncident(data);
      if (data.actions) setActions(data.actions);
      if (data.notifications) setNotifications(data.notifications);
    } catch (err) {
      console.error('Failed to load incident:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, [incidentId]);

  const handleVerify = async () => {
    try {
      setVerifying(true);
      soundFx.playActionConfirmed();
      await api.stepVerifyDemo(incidentId);
      soundFx.playVerificationSuccess();
      await loadData();
    } catch (e) {
      console.error('Error verifying incident:', e);
    } finally {
      setVerifying(false);
    }
  };

  const handleEscalate = async () => {
    try {
      soundFx.playAlert();
      await api.executeTool(
        'escalateIncident',
        {
          incidentId,
          reason: 'Dispatcher triggered manual critical escalation.',
          targetTier: 'DISASTER_MANAGEMENT_AUTHORITY',
          immediateActionsRequired: ['Area safety cordon', 'Substation isolation'],
        },
        incidentId
      );
      await loadData();
    } catch (e) {
      console.error('Error escalating incident:', e);
    }
  };

  if (loading && !incident) {
    return (
      <div className="py-24 text-center text-slate-400">
        <RefreshCw className="w-8 h-8 mx-auto animate-spin text-indigo-400 mb-2" />
        <p className="text-sm font-mono">Loading incident telemetry...</p>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="py-24 text-center text-slate-400 space-y-4">
        <AlertTriangle className="w-10 h-10 mx-auto text-amber-400" />
        <p className="text-base text-white font-bold">Incident {incidentId} not found.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold"
        >
          Return to Grid
        </button>
      </div>
    );
  }

  const assignedTeam = teams.find((t) => t.id === incident.assignedTeamId);
  const activePersona = getPersonaForContext(incident.type, incident.severity);

  // Vertical Intelligence Steps
  const verticalSteps = [
    { label: 'REPORTED', time: '13:41', done: true, detail: 'Citizen intake via SETU voice / GPS' },
    { label: 'UNDERSTOOD', time: '13:41', done: true, detail: `${incident.type} classified with ${Math.round((incident.confidence || 0.94) * 100)}% confidence` },
    {
      label: 'CRITICAL FACILITY DETECTED',
      time: '13:42',
      done: Boolean(incident.criticalFacilities && incident.criticalFacilities.length > 0),
      detail: incident.criticalFacilities?.[0]
        ? `${incident.criticalFacilities[0].name} at ${incident.criticalFacilities[0].distanceMeters || 180}m`
        : 'Indiranagar Govt High School at 180m',
    },
    {
      label: 'RESPONSE TEAM FOUND',
      time: '13:43',
      done: Boolean(incident.assignedTeamName || incident.assignedTeamId),
      detail: incident.assignedTeamName || 'BWSSB Rapid Water Unit 01 assigned',
    },
    {
      label: 'ROUTE & ETA CALCULATED',
      time: '13:43',
      done: Boolean(incident.etaMinutes),
      detail: incident.etaMinutes ? `Confirmed ETA: ${incident.etaMinutes} minutes` : '8 minutes via 100ft arterial',
    },
    {
      label: 'MUNICIPAL WORK ORDER',
      time: '13:44',
      done: incident.status !== 'RECEIVED' && incident.status !== 'ANALYZING',
      detail: incident.workOrderId ? `Work Order ${incident.workOrderId} active` : 'WO-BWSSB-2048 dispatched',
    },
    {
      label: 'ON-SITE VERIFICATION',
      time: incident.resolvedAt ? '13:46' : 'Active',
      done: incident.status === 'VERIFYING' || incident.status === 'RESOLVED',
      detail: incident.verificationNotes || 'Field photographic checklist pending',
    },
    {
      label: 'OFFICIAL RESOLUTION',
      time: incident.resolvedAt ? '13:46' : '—',
      done: incident.status === 'RESOLVED',
      detail: incident.resolvedAt ? 'Sleeve weld confirmed; road cleared' : 'Pending field repair',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-in text-left">
      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-600 hover:text-slate-900 transition-colors font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Grid</span>
        </button>
      </div>

      {/* Top Banner (Section 16 requirement) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          {/* Metadata Clean String */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-600 mb-1.5">
            <span className="text-slate-900 font-bold">{incident.type.replace('_', ' ')}</span>
            <span>·</span>
            <span
              className={`font-bold ${
                incident.severity === 'CRITICAL' || incident.severity === 'HIGH'
                  ? 'text-rose-600'
                  : 'text-amber-600'
              }`}
            >
              {incident.severity}
            </span>
            <span>·</span>
            <span className="text-indigo-700 font-bold">{incident.id}</span>
            <span>·</span>
            <span>{incident.address || 'Indiranagar 100ft Rd, Bengaluru'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {incident.description}
          </h1>

          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            {incident.aiSummary || 'Gemini multi-agent coordination active. Municipal tools executed via policy-bound gateway.'}
          </p>
        </div>

        {/* Active Avatar & Verification Actions */}
        <div className="flex items-center gap-4 shrink-0">
          <AIAvatar
            personaId={activePersona.id}
            size="lg"
            state={incident.status === 'RESOLVED' ? 'idle' : 'acting'}
            showBadge={true}
          />

          <div className="flex flex-col gap-2">
            {incident.status !== 'RESOLVED' && (
              <button
                type="button"
                onClick={handleVerify}
                disabled={verifying}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{verifying ? 'Verifying Evidence...' : 'Verify Resolution'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleEscalate}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-rose-600 text-[11px] font-mono transition-colors font-medium"
            >
              Manual Escalation
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Vertical Flow on Left, Context & Handoff on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Vertical Intelligence Flow */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cyber Forensic & n8n Investigation Dossier (if Cybersecurity incident) */}
          {(incident.type === 'CYBERSECURITY' || incident.cyberPayload) && (
            <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold tracking-tight">
                      Cybercrime Forensic Dossier (Authorized View)
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Investigative telemetry & n8n webhook orchestration data
                    </p>
                  </div>
                </div>

                {incident.cyberPayload?.ticketId && (
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-indigo-950 text-indigo-400 border border-indigo-800">
                    {incident.cyberPayload.ticketId}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <span className="text-slate-400 block text-[10px] uppercase font-sans">
                    Sanitized Defanged URL
                  </span>
                  <span className="text-amber-300 font-semibold break-all text-[11px]">
                    {incident.cyberPayload?.sanitizedUrl || 'hxxp://[redacted-phishing-host]'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <span className="text-slate-400 block text-[10px] uppercase font-sans">
                    Target Domain & Host
                  </span>
                  <span className="text-cyan-300 font-semibold text-[11px]">
                    {incident.cyberPayload?.domain || 'Classified Phishing Target'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <span className="text-slate-400 block text-[10px] uppercase font-sans">
                    Threat Risk Level & Score
                  </span>
                  <span className="text-rose-400 font-bold text-xs">
                    {incident.cyberPayload?.riskLevel || 'HIGH_RISK'} ({incident.cyberPayload?.riskScore || 92}/100)
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <span className="text-slate-400 block text-[10px] uppercase font-sans">
                    Citizen Clicked Situation
                  </span>
                  <span className="text-slate-200 font-medium text-[11px]">
                    {incident.cyberPayload?.clickedScenario || 'Reported prior to engagement'}
                  </span>
                </div>
              </div>

              {incident.cyberPayload?.flags && incident.cyberPayload.flags.length > 0 && (
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-xs">
                  <span className="text-slate-400 text-[10px] uppercase font-sans block mb-1.5 font-bold">
                    Detected Threat Signatures:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {incident.cyberPayload.flags.map((flag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-900/60 text-[10px]"
                      >
                        {flag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md">
            <h3 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              Vertical Intelligence & Execution Flow
            </h3>

            <div className="space-y-4">
              {verticalSteps.map((st, i) => (
                <div key={i} className="flex items-start gap-3.5 text-xs">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-[10px] shrink-0 border ${
                        st.done
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : 'bg-slate-100 border-slate-300 text-slate-500'
                      }`}
                    >
                      {st.done ? '✓' : `0${i + 1}`}
                    </div>
                    {i < verticalSteps.length - 1 && (
                      <div
                        className={`w-0.5 h-8 mt-1 ${st.done ? 'bg-emerald-300' : 'bg-slate-200'}`}
                      />
                    )}
                  </div>

                  <div className="flex-1 pb-2">
                    <div className="flex items-center justify-between">
                      <span className={`font-bold font-mono ${st.done ? 'text-slate-900' : 'text-slate-400'}`}>
                        {st.label}
                      </span>
                      <span className="font-mono text-[11px] text-slate-500">{st.time}</span>
                    </div>
                    <p className="text-slate-600 text-xs mt-0.5">{st.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 17 Multi-Avatar Handoff Card */}
          <div className="bg-slate-50 border border-indigo-200 rounded-2xl p-5 shadow-xs text-xs space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-900 font-bold block">
              Multi-Agent Handoff Chain:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-left">
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold text-emerald-700 font-mono block">1. SETU</span>
                <p className="text-slate-700 mt-1 italic">"Understood citizen voice report."</p>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold text-cyan-700 font-mono block">2. JAL</span>
                <p className="text-slate-700 mt-1 italic">"Feeder pipeline failure detected."</p>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold text-amber-700 font-mono block">3. RAKSHA</span>
                <p className="text-slate-700 mt-1 italic">"School within 180m. Escalating."</p>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold text-indigo-700 font-mono block">4. PULSE</span>
                <p className="text-slate-700 mt-1 italic">"Route & Work Order coordinated."</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Facilities, Assigned Team & Photographic Evidence */}
        <div className="space-y-6">
          {/* Critical Facilities */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-md">
            <h4 className="text-xs font-mono uppercase text-slate-700 font-bold mb-3 flex items-center gap-2">
              <Building className="w-4 h-4 text-amber-600" />
              Proximity Risk (2.5 km Radius)
            </h4>
            <div className="space-y-2.5">
              {incident.criticalFacilities && incident.criticalFacilities.length > 0 ? (
                incident.criticalFacilities.map((f) => (
                  <CriticalFacilityCard key={f.id} facility={f} />
                ))
              ) : (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  Indiranagar Government High School (180m distance)
                </div>
              )}
            </div>
          </div>

          {/* Response Team Card */}
          {assignedTeam && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-md">
              <h4 className="text-xs font-mono uppercase text-slate-700 font-bold mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-600" />
                Assigned Municipal Unit
              </h4>
              <ResponseTeamCard team={assignedTeam} />
            </div>
          )}

          {/* Location Area & Photographic Evidence (Requirement 2) */}
          {(() => {
            const locationProfile = getLocationAreaImage(incident.address, incident.type);
            const areaImage = incident.imageUrl || locationProfile.imageUrl;
            const verificationImage = incident.verificationPhotoUrl || locationProfile.verificationPhotoUrl;
            const isResolved = incident.status === 'RESOLVED';

            return (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-md text-left space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono uppercase text-slate-700 font-bold flex items-center gap-2">
                    <Camera className="w-4 h-4 text-indigo-600" />
                    Location Area & Field Evidence
                  </h4>
                  <span className="text-[10px] font-mono text-slate-500">
                    {locationProfile.zone}
                  </span>
                </div>

                {/* Completion Confirmation Banner if resolved */}
                {isResolved && (
                  <div className="p-3.5 rounded-xl bg-emerald-600 text-white space-y-1">
                    <div className="flex items-center gap-1.5 font-black text-xs">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      <span>THIS WORK IS COMPLETED: ✅ Verified by Resolution Inspector Agent</span>
                    </div>
                    <p className="text-[11px] text-emerald-100">
                      இந்த வேலை வெற்றிகரமாக முடிவடைந்தது! Token: CERT-BBMP-RESOLVED-{incident.id}
                    </p>
                  </div>
                )}

                {/* 1. Location Area Image (Before / Site Spot) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="font-bold text-slate-700">Location Area Photo (அந்த ஏரியாவோட இமேஜ்)</span>
                    <span className="text-rose-600 font-semibold text-[10px]">INCIDENT SPOT</span>
                  </div>
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 group">
                    <img
                      src={areaImage}
                      alt={incident.address || locationProfile.areaName}
                      className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3 text-white">
                      <p className="font-bold text-xs line-clamp-1">{incident.address || locationProfile.areaName}</p>
                      <p className="text-[10px] text-slate-300 line-clamp-1">{locationProfile.landmark}</p>
                      <span className="text-[9px] font-mono text-emerald-300 mt-0.5">{locationProfile.wardName}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Field Verification Photo (After / Repaired) */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="font-bold text-slate-700">Field Resolution Evidence</span>
                    <span className="text-emerald-700 font-semibold text-[10px] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      INSPECTOR AUDITED
                    </span>
                  </div>
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 group">
                    <img
                      src={verificationImage}
                      alt="Field resolution verification photo"
                      className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3 text-white">
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-600 font-bold w-max mb-1">
                        POST-RESOLUTION TELEMETRY
                      </span>
                      <p className="font-bold text-xs line-clamp-1">Restored Civic Infrastructure</p>
                      <p className="text-[10px] text-emerald-200 line-clamp-1">Certified By Municipal Squad</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};
