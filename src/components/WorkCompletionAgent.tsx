import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  ShieldCheck,
  Camera,
  Coins,
  Sparkles,
  Clock,
  MapPin,
  Users,
  Award,
  ArrowRight,
  RefreshCw,
  Eye,
  Check,
  Radio,
} from 'lucide-react';
import { Incident } from '../../shared/types';
import { soundFx } from '../lib/soundFx';
import { getLocationAreaImage } from '../lib/locationImages';

interface WorkCompletionAgentProps {
  incident: Incident;
  onWorkCompleted?: (incidentId: string) => void;
  onOpenDashboard?: () => void;
  isDarkMode?: boolean;
}

export const WorkCompletionAgent: React.FC<WorkCompletionAgentProps> = ({
  incident,
  onWorkCompleted,
  onOpenDashboard,
  isDarkMode = false,
}) => {
  // Current step in the resolution & verification pipeline
  // 1: Dispatch, 2: Field Crew On-Site, 3: Work in Progress, 4: Autonomous Inspection, 5: Completed
  const [pipelineStep, setPipelineStep] = useState<number>(() => {
    if (incident.status === 'RESOLVED') return 5;
    if (incident.status === 'VERIFYING') return 4;
    if (incident.status === 'ON_SITE') return 3;
    if (incident.status === 'DISPATCHED') return 2;
    return 1;
  });

  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(incident.status === 'RESOLVED');
  const [claimedReward, setClaimedReward] = useState<boolean>(false);
  const [citizenCoinBalance, setCitizenCoinBalance] = useState<number>(350);
  const [showInspectionLog, setShowInspectionLog] = useState<boolean>(false);

  const locationProfile = getLocationAreaImage(incident.address, incident.type);
  const areaImage = incident.imageUrl || locationProfile.imageUrl;
  const verificationImage = incident.verificationPhotoUrl || locationProfile.verificationPhotoUrl;

  // Auto-progress simulation if just filed
  useEffect(() => {
    if (isCompleted) return;

    const timer1 = setTimeout(() => {
      setPipelineStep(2);
    }, 2500);

    const timer2 = setTimeout(() => {
      setPipelineStep(3);
    }, 6000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isCompleted]);

  // Trigger autonomous work completion verification
  const handleVerifyAndCompleteWork = async () => {
    if (isVerifying || isCompleted) return;

    setIsVerifying(true);
    soundFx.playSignalReceived();

    // Step 4: Autonomous Inspection
    setPipelineStep(4);

    setTimeout(() => {
      setPipelineStep(5);
      setIsCompleted(true);
      setIsVerifying(false);
      soundFx.playVerificationSuccess();

      if (onWorkCompleted) {
        onWorkCompleted(incident.id);
      }
    }, 2200);
  };

  const handleClaimReward = () => {
    if (claimedReward) return;
    setClaimedReward(true);
    setCitizenCoinBalance((prev) => prev + 50);
    soundFx.playActionConfirmed();
  };

  return (
    <div
      className={`rounded-3xl border-2 transition-all overflow-hidden ${
        isCompleted
          ? 'border-emerald-500 bg-gradient-to-b from-emerald-50/80 to-white dark:from-emerald-950/30 dark:to-slate-900 shadow-xl'
          : isDarkMode
          ? 'border-slate-800 bg-slate-900 text-slate-100 shadow-xl'
          : 'border-indigo-200 bg-white text-slate-900 shadow-lg'
      }`}
    >
      {/* Header Banner */}
      <div
        className={`p-5 sm:p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          isCompleted
            ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-100/50 dark:bg-emerald-900/30'
            : isDarkMode
            ? 'border-slate-800 bg-slate-900/80'
            : 'border-indigo-100 bg-indigo-50/60'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-md ${
              isCompleted
                ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                : 'bg-indigo-600 text-white shadow-indigo-600/30'
            }`}
          >
            {isCompleted ? <ShieldCheck className="w-6 h-6" /> : <Radio className="w-6 h-6 animate-pulse" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black tracking-tight">
                {isCompleted ? 'WORK RESOLUTION VERIFIED' : 'AUTONOMOUS WORK COMPLETION AGENT'}
              </h3>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase border ${
                  isCompleted
                    ? 'bg-emerald-500 text-white border-emerald-600'
                    : 'bg-indigo-100 text-indigo-700 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-300'
                }`}
              >
                {isCompleted ? 'COMPLETED' : 'MONITORING ACTIVE'}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              வேலை நிறைவு சரிபார்ப்பு முகவர் · Autonomous Field Inspection & Citizen Resolution Validator
            </p>
          </div>
        </div>

        {/* Civic Coins Monetization Badge */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono text-xs ${
            claimedReward
              ? 'bg-amber-100/80 border-amber-300 text-amber-900 dark:bg-amber-950/50 dark:text-amber-300'
              : 'bg-white border-slate-200 text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200'
          }`}
        >
          <Coins className="w-4 h-4 text-amber-500" />
          <span className="font-bold">{citizenCoinBalance} Civic Coins</span>
          {claimedReward && (
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.2 rounded">
              +50 EARNED!
            </span>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* COMPLETED WORK BANNER (Triggered when resolved) */}
        {isCompleted ? (
          <div className="p-5 rounded-2xl bg-emerald-600 text-white space-y-3 shadow-lg shadow-emerald-600/20 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg sm:text-xl font-black tracking-tight">
                    THIS WORK IS COMPLETED
                  </h4>
                  <p className="text-xs text-emerald-100 font-medium">
                    இந்த வேலை வெற்றிகரமாக முடிவடைந்தது! Field repair inspected & verified by Agent.
                  </p>
                </div>
              </div>

              {!claimedReward ? (
                <button
                  type="button"
                  onClick={handleClaimReward}
                  className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 shrink-0"
                >
                  <Coins className="w-4 h-4 text-slate-950" />
                  <span>Claim +50 Civic Coins Reward</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold bg-white/20 px-3 py-1.5 rounded-xl self-center sm:self-auto">
                  <Award className="w-4 h-4 text-amber-300" />
                  <span>Verified Citizen Incentive Credited</span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-white/20 text-[11px] font-mono text-emerald-100 flex flex-wrap items-center justify-between gap-2">
              <span>Token: CERT-BBMP-RESOLVED-{incident.id}</span>
              <span>Inspection Timestamp: {new Date().toLocaleTimeString()}</span>
              <span>Supervising Squad: {incident.assignedTeamName || 'BBMP Emergency Taskforce'}</span>
            </div>
          </div>
        ) : (
          /* Real-time Work Progression Pipeline Stepper */
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold uppercase tracking-wider text-slate-500 font-mono">
                Live Resolution Progress
              </span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                Stage {pipelineStep} of 4: {pipelineStep === 1 ? 'Dispatching' : pipelineStep === 2 ? 'Squad Dispatched' : pipelineStep === 3 ? 'On-Site Repair' : 'Field Inspection'}
              </span>
            </div>

            {/* Stepper Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { step: 1, label: 'Complaint Registered', sub: 'SETU Multilingual' },
                { step: 2, label: 'Squad Dispatched', sub: 'Route Computed' },
                { step: 3, label: 'On-Site Repair', sub: 'Active Engineering' },
                { step: 4, label: 'Agent Verification', sub: 'Proof Inspection' },
              ].map((s) => {
                const isPassed = pipelineStep >= s.step;
                const isCurrent = pipelineStep === s.step;
                return (
                  <div
                    key={s.step}
                    className={`p-3 rounded-xl border text-xs transition-all ${
                      isPassed
                        ? 'border-indigo-500 bg-indigo-50/70 text-indigo-950 dark:bg-indigo-950/40 dark:text-indigo-200 dark:border-indigo-700'
                        : 'border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold opacity-60">0{s.step}</span>
                      {isPassed ? (
                        <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 opacity-40" />
                      )}
                    </div>
                    <p className={`font-bold mt-1 text-xs truncate ${isCurrent ? 'text-indigo-700 dark:text-indigo-300' : ''}`}>
                      {s.label}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {s.sub}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Location & Area Image Evidence Section (Requirement 2) */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-indigo-600" />
              <span>Location Area & Photographic Proof</span>
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              {locationProfile.zone} · {locationProfile.wardName}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Area & Location Image (Before / Site View) */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 group shadow-sm">
              <img
                src={areaImage}
                alt={incident.address || 'Location Area'}
                className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3.5 text-white">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-600 text-white font-bold w-max mb-1">
                  REPORTED AREA / PRE-REPAIR
                </span>
                <p className="font-bold text-xs line-clamp-1">{incident.address || locationProfile.areaName}</p>
                <p className="text-[11px] text-slate-300 line-clamp-1">{locationProfile.landmark}</p>
              </div>
            </div>

            {/* Post-Resolution Verification Photo (After / Repaired) */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 group shadow-sm">
              <img
                src={verificationImage}
                alt="Verification Photo"
                className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3.5 text-white">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-600 text-white font-bold w-max mb-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  FIELD VERIFICATION INSPECTION
                </span>
                <p className="font-bold text-xs line-clamp-1">Repaired Infrastructure & Restored Area</p>
                <p className="text-[11px] text-emerald-200 line-clamp-1">BBMP Certified Restoration Evidence</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons: Verify & Complete Work or Open Command Center */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {!isCompleted ? (
              <button
                type="button"
                onClick={handleVerifyAndCompleteWork}
                disabled={isVerifying}
                className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-emerald-600/25 active:scale-95 disabled:opacity-50"
              >
                <CheckCircle2 className={`w-4 h-4 ${isVerifying ? 'animate-spin' : ''}`} />
                <span>{isVerifying ? 'Agent Inspecting Site...' : 'Verify & Complete Work (திஸ் ஒர்க் இஸ் கம்ப்ளீட்டட்)'}</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs flex items-center gap-1.5 border border-emerald-300">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Resolution Approved by Municipal Agent
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowInspectionLog(!showInspectionLog)}
              className="px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showInspectionLog ? 'Hide Inspector Audit' : 'Inspector Audit Log'}</span>
            </button>
          </div>

          {onOpenDashboard && (
            <button
              type="button"
              onClick={onOpenDashboard}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Command Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Expandable Inspector Audit Log */}
        {showInspectionLog && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-mono space-y-2 text-left">
            <span className="font-bold text-indigo-700 dark:text-indigo-400 block uppercase">
              Autonomous Verification Dossier
            </span>
            <div className="space-y-1 text-slate-600 dark:text-slate-300">
              <p>• Incident ID: {incident.id} ({incident.type})</p>
              <p>• Location Ward: {incident.address || locationProfile.areaName}</p>
              <p>• Geographic Fix: Lat {incident.latitude}, Lng {incident.longitude}</p>
              <p>• Acoustic/Drone Scan: Obstruction cleared. Normal traffic/civic flow restored.</p>
              <p>• Assigned Unit: {incident.assignedTeamName || 'Bengaluru Emergency Squad'}</p>
              <p>• Inspector AI Status: Verified compliant with BBMP 2030 Civic Standards.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
