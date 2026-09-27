import React from 'react';
import { Incident } from '../../shared/types';
import { StatusBadge } from './StatusBadge';
import { MapPin, Clock, Users, School, Waves, ChevronRight, ShieldAlert, ShieldCheck, Camera } from 'lucide-react';
import { getLocationAreaImage } from '../lib/locationImages';

interface IncidentCardProps {
  incident: Incident;
  isSelected?: boolean;
  onSelect?: (incident: Incident) => void;
  onViewDetails?: (id: string) => void;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({
  incident,
  isSelected = false,
  onSelect,
  onViewDetails,
}) => {
  const isCyber = incident.type === 'CYBERSECURITY';

  const timeAgo = (dateStr: string) => {
    const diff = (Date.now() - new Date(dateStr).getTime()) / 60000;
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${Math.round(diff)}m ago`;
    return `${Math.round(diff / 60)}h ago`;
  };

  // Requirement 15: For privacy, DO NOT publicly display the full suspicious URL.
  // Display something like: `Suspicious Link Report • Bengaluru`
  const displayDescription = isCyber
    ? 'Suspicious Link Report • Bengaluru'
    : incident.description;

  const locationProfile = getLocationAreaImage(incident.address, incident.type);
  const cardImage = incident.imageUrl || locationProfile.imageUrl;

  return (
    <div
      className={`rounded-2xl border transition-all cursor-pointer overflow-hidden ${
        isSelected
          ? 'bg-white border-2 border-indigo-600 shadow-md ring-2 ring-indigo-100'
          : isCyber
          ? 'bg-white border border-rose-200 hover:border-rose-400 hover:shadow-md'
          : 'bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md'
      }`}
      onClick={() => onSelect?.(incident)}
    >
      {/* Area & Location Photo Header */}
      <div className="relative h-28 w-full bg-slate-100 overflow-hidden">
        <img
          src={cardImage}
          alt={incident.address || locationProfile.areaName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

        {/* Top Badges over image */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1.5">
          <span className="font-mono text-[11px] font-bold text-white bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-lg border border-white/20">
            {incident.id}
          </span>
          <div className="flex items-center gap-1">
            {isCyber ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white shadow-xs">
                <ShieldAlert className="w-2.5 h-2.5" />
                CYBER
              </span>
            ) : (
              <StatusBadge severity={incident.severity} />
            )}
            <StatusBadge status={incident.status} />
          </div>
        </div>

        {/* Area Name on Image Base */}
        <div className="absolute bottom-1.5 left-2 right-2 flex items-center gap-1 text-[11px] font-semibold text-white truncate drop-shadow-sm">
          <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
          <span className="truncate">{locationProfile.areaLabel}</span>
        </div>
      </div>

      <div className="p-3.5 pt-2.5">
        {/* Description */}
        <p className="text-xs text-slate-800 font-medium line-clamp-2 leading-relaxed">
          {displayDescription}
        </p>

        {/* Full Location Address */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1.5 truncate">
          <span className="truncate text-slate-500 font-mono text-[10px]">
            {incident.address || `${incident.latitude}, ${incident.longitude}`}
          </span>
        </div>

      {/* Cyber Payload Pill */}
      {isCyber && incident.cyberPayload?.ticketId && (
        <div className="mt-2 flex items-center justify-between gap-1 px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-[10px] text-indigo-900 font-mono font-semibold">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-indigo-600" />
            n8n Ticket: {incident.cyberPayload.ticketId}
          </span>
          <span className="text-indigo-600">
            Risk: {incident.cyberPayload.riskScore || 85}/100
          </span>
        </div>
      )}

      {/* Cluster Warning Pill if detected */}
      {incident.clusterHypothesis && (
        <div className="mt-2 flex items-center gap-1 px-2 py-0.5 rounded bg-orange-50 border border-orange-200 text-[10px] text-orange-900 font-semibold">
          <Waves className="w-3 h-3 text-orange-600 animate-pulse" />
          <span>NETWORK-LEVEL RISK DETECTED</span>
        </div>
      )}

      {/* Nearby School/Facility Tag */}
      {incident.criticalFacilities && incident.criticalFacilities.length > 0 && (
        <div className="mt-2 flex items-center gap-1 text-[10px] text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 truncate font-medium">
          <School className="w-3 h-3 flex-shrink-0 text-amber-700" />
          <span className="truncate">{incident.criticalFacilities[0].name}</span>
          <span className="text-slate-500">({incident.criticalFacilities[0].distanceMeters}m)</span>
        </div>
      )}

      {/* Footer Metrics & Actions */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-3">
          {incident.assignedTeamName ? (
            <span className="flex items-center gap-1 text-indigo-700 font-medium">
              <Users className="w-3 h-3" />
              <span className="truncate max-w-[110px]">{incident.assignedTeamName}</span>
            </span>
          ) : (
            <span className="text-slate-400">Unassigned</span>
          )}

          {incident.etaMinutes && (
            <span className="flex items-center gap-1 text-amber-700 font-mono font-bold">
              <Clock className="w-3 h-3" />
              {incident.etaMinutes}m ETA
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-400 font-mono">{timeAgo(incident.createdAt)}</span>
          {onViewDetails && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(incident.id);
              }}
              className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-indigo-600"
              title="Inspect Incident Deep Dive"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};
