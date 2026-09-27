import React, { useState, useMemo } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
} from '@vis.gl/react-google-maps';
import { Incident, ResponseTeam, CriticalFacility, RiskZone } from '../../shared/types';
import { SEVERITY_CONFIG } from '../../shared/schemas';
import { Shield, School, Hospital, Navigation, Waves, MapPin, ZoomIn, ZoomOut, Compass, Map as MapIcon, Radio } from 'lucide-react';

interface IncidentMapProps {
  incidents: Incident[];
  teams?: ResponseTeam[];
  facilities?: CriticalFacility[];
  riskZones?: RiskZone[];
  selectedIncident?: Incident | null;
  onSelectIncident?: (incident: Incident) => void;
  showRiskZones?: boolean;
}

export const IncidentMap: React.FC<IncidentMapProps> = ({
  incidents,
  teams = [],
  facilities = [],
  riskZones = [],
  selectedIncident,
  onSelectIncident,
  showRiskZones = true,
}) => {
  const [zoom, setZoom] = useState(1);
  const [filterType, setFilterType] = useState<string>('all');
  const [activePopup, setActivePopup] = useState<{
    id: string;
    title: string;
    type: string;
    detail: string;
    lat: number;
    lng: number;
    teamName?: string;
    eta?: number;
  } | null>(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  const [viewMode, setViewMode] = useState<'google' | 'tactical'>(apiKey ? 'google' : 'tactical');

  // Map bounding box around Bengaluru urban area for tactical radar mode
  const bounds = {
    minLat: 12.83,
    maxLat: 13.04,
    minLng: 77.52,
    maxLng: 77.74,
  };

  const toCoords = (lat: number, lng: number) => {
    const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100;
    const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * 100;
    return {
      x: Math.max(4, Math.min(96, x)),
      y: Math.max(4, Math.min(96, y)),
    };
  };

  const filteredIncidents = useMemo(() => {
    if (filterType === 'all') return incidents;
    if (filterType === 'critical')
      return incidents.filter((i) => i.severity === 'HIGH' || i.severity === 'CRITICAL');
    if (filterType === 'active') return incidents.filter((i) => i.status !== 'RESOLVED');
    return incidents.filter((i) => i.type === filterType);
  }, [incidents, filterType]);

  const roadGrid = [
    { name: 'Outer Ring Road (ORR)', path: 'M 15 25 Q 40 45 75 75 Q 85 55 90 20' },
    { name: 'Old Airport Road', path: 'M 45 42 L 80 50' },
    { name: 'Hosur Road / Silk Board', path: 'M 48 55 L 60 90' },
    { name: '100 Feet Road Indiranagar', path: 'M 62 30 L 66 45' },
    { name: 'MG Road Corridor', path: 'M 40 40 L 58 38' },
  ];

  return (
    <div className="relative w-full h-[460px] sm:h-[540px] bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden shadow-md flex flex-col">
      {/* Map Header Overlay */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs pointer-events-auto">
          <Compass className="w-4 h-4 text-indigo-600 animate-spin-slow" />
          <span className="text-xs font-bold text-slate-800">
            {viewMode === 'google' ? 'GOOGLE MAPS PLATFORM' : 'BENGALURU TACTICAL MAP'}
          </span>
          <span className="text-[10px] text-slate-500 font-mono">12.9716° N, 77.5946° E</span>
        </div>

        {/* View Switcher & Filters */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {apiKey && (
            <div className="flex items-center bg-white/90 backdrop-blur-md p-0.5 rounded-xl border border-slate-200 shadow-xs text-xs">
              <button
                type="button"
                onClick={() => setViewMode('google')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  viewMode === 'google'
                    ? 'bg-indigo-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MapIcon className="w-3 h-3" />
                Google Maps
              </button>
              <button
                type="button"
                onClick={() => setViewMode('tactical')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  viewMode === 'tactical'
                    ? 'bg-amber-500 text-slate-950 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Radio className="w-3 h-3" />
                Radar
              </button>
            </div>
          )}

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md p-1 rounded-xl border border-slate-200 shadow-xs text-xs">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all ${
                filterType === 'all'
                  ? 'bg-slate-900 text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({incidents.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('critical')}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all ${
                filterType === 'critical'
                  ? 'bg-rose-600 text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              High Risk
            </button>
            <button
              type="button"
              onClick={() => setFilterType('active')}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all ${
                filterType === 'active'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Active
            </button>
          </div>
        </div>
      </div>

      {/* Primary Map Viewport */}
      {viewMode === 'google' && apiKey ? (
        <div className="relative flex-1 w-full h-full min-h-[350px]">
          <APIProvider apiKey={apiKey} solutionChannel="gmp_mcp_codeassist_v1_aistudio">
            <Map
              style={{ width: '100%', height: '100%' }}
              defaultCenter={{ lat: 12.9716, lng: 77.5946 }}
              defaultZoom={12}
              mapId="DEMO_MAP_ID"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              gestureHandling="greedy"
              disableDefaultUI={false}
            >
              {/* Incidents as Advanced Markers */}
              {filteredIncidents.map((incident) => {
                const config = SEVERITY_CONFIG[incident.severity] || SEVERITY_CONFIG.MEDIUM;
                const isSelected = selectedIncident?.id === incident.id;

                return (
                  <AdvancedMarker
                    key={incident.id}
                    position={{ lat: incident.latitude, lng: incident.longitude }}
                    title={`${incident.id}: ${incident.description}`}
                    onClick={() => {
                      setActivePopup({
                        id: incident.id,
                        title: `${incident.id} - ${incident.type.replace('_', ' ')}`,
                        type: incident.severity,
                        detail: incident.description,
                        lat: incident.latitude,
                        lng: incident.longitude,
                        teamName: incident.assignedTeamName,
                        eta: incident.etaMinutes,
                      });
                      onSelectIncident?.(incident);
                    }}
                  >
                    <div
                      className={`relative flex items-center justify-center p-1 rounded-full border-2 shadow-lg transition-transform ${
                        isSelected ? 'scale-125 ring-4 ring-cyan-400/50' : 'hover:scale-110'
                      }`}
                      style={{
                        backgroundColor: config.color,
                        borderColor: '#ffffff',
                      }}
                    >
                      <MapPin className="w-4 h-4 text-slate-950 fill-white" />
                      {incident.etaMinutes && incident.status !== 'RESOLVED' && (
                        <span className="absolute -bottom-3.5 bg-slate-950/90 text-cyan-300 font-mono text-[8px] px-1 rounded border border-cyan-500/40 whitespace-nowrap">
                          {incident.etaMinutes}m
                        </span>
                      )}
                    </div>
                  </AdvancedMarker>
                );
              })}

              {/* Response Teams */}
              {teams.map((team) => (
                <AdvancedMarker
                  key={team.id}
                  position={{ lat: team.latitude, lng: team.longitude }}
                  title={`${team.name} (${team.availability})`}
                  onClick={() =>
                    setActivePopup({
                      id: team.id,
                      title: team.name,
                      type: team.department,
                      detail: `Capabilities: ${team.capabilities.join(', ')} | Status: ${team.availability}`,
                      lat: team.latitude,
                      lng: team.longitude,
                    })
                  }
                >
                  <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center shadow-md">
                    <Navigation className="w-3.5 h-3.5 text-white" />
                  </div>
                </AdvancedMarker>
              ))}

              {/* Critical Facilities */}
              {facilities.map((fac) => (
                <AdvancedMarker
                  key={fac.id}
                  position={{ lat: fac.latitude, lng: fac.longitude }}
                  title={`${fac.name} (${fac.type})`}
                  onClick={() =>
                    setActivePopup({
                      id: fac.id,
                      title: fac.name,
                      type: fac.type.toUpperCase(),
                      detail: fac.vulnerabilityNotes || fac.vicinity || '',
                      lat: fac.latitude,
                      lng: fac.longitude,
                    })
                  }
                >
                  <div className="w-6 h-6 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center shadow-md">
                    {fac.type === 'hospital' ? (
                      <Hospital className="w-3.5 h-3.5 text-slate-950" />
                    ) : (
                      <School className="w-3.5 h-3.5 text-slate-950" />
                    )}
                  </div>
                </AdvancedMarker>
              ))}

              {/* Interactive Info Window */}
              {activePopup && (
                <InfoWindow
                  position={{ lat: activePopup.lat, lng: activePopup.lng }}
                  onCloseClick={() => setActivePopup(null)}
                >
                  <div className="p-1.5 text-slate-900 max-w-xs">
                    <div className="font-bold text-xs text-slate-950">{activePopup.title}</div>
                    <div className="text-[10px] text-amber-700 font-semibold uppercase mt-0.5">
                      {activePopup.type}
                    </div>
                    <p className="text-[11px] text-slate-700 mt-1 line-clamp-3 leading-relaxed">
                      {activePopup.detail}
                    </p>
                    {activePopup.teamName && (
                      <div className="mt-1.5 pt-1 border-t border-slate-200 text-[10px] text-cyan-800 font-medium">
                        Unit: {activePopup.teamName} {activePopup.eta ? `(${activePopup.eta}m ETA)` : ''}
                      </div>
                    )}
                  </div>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>
        </div>
      ) : (
        /* Tactical Radar Canvas View (Fallback) */
        <div
          className="relative flex-1 w-full h-full bg-slate-100 overflow-hidden select-none transition-transform duration-300"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* Subtle Military/Civic Coordinate Grid */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:24px_24px]" />

          {/* Animated Radar Sweep Overlay */}
          <div className="absolute -inset-[50%] bg-[conic-gradient(from_0deg,transparent_0_320deg,rgba(99,102,241,0.06)_360deg)] animate-[spin_10s_linear_infinite] pointer-events-none rounded-full" />

          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {roadGrid.map((road, idx) => (
              <path
                key={idx}
                d={road.path}
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="2.5"
                strokeDasharray="4,4"
              />
            ))}

            {showRiskZones &&
              riskZones.map((zone) => {
                const pos = toCoords(zone.latitude, zone.longitude);
                return (
                  <circle
                    key={zone.id}
                    cx={`${pos.x}%`}
                    cy={`${pos.y}%`}
                    r="40"
                    fill="rgba(244, 63, 94, 0.08)"
                    stroke="rgba(244, 63, 94, 0.45)"
                    strokeWidth="1.5"
                    strokeDasharray="3,3"
                  />
                );
              })}
          </svg>

          {/* Critical Facilities */}
          {facilities.map((fac) => {
            const pos = toCoords(fac.latitude, fac.longitude);
            return (
              <div
                key={fac.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                title={`${fac.name} (${fac.type})`}
              >
                <div className="w-5 h-5 rounded-full bg-white border border-slate-300 shadow-sm flex items-center justify-center text-slate-700">
                  {fac.type === 'school' ? (
                    <School className="w-3 h-3 text-amber-600" />
                  ) : fac.type === 'hospital' ? (
                    <Hospital className="w-3 h-3 text-rose-600" />
                  ) : (
                    <Shield className="w-3 h-3 text-cyan-600" />
                  )}
                </div>
              </div>
            );
          })}

          {/* Response Teams */}
          {teams.map((team) => {
            const pos = toCoords(team.latitude, team.longitude);
            return (
              <div
                key={team.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                title={`${team.name} (${team.availability})`}
              >
                <div className="w-6 h-6 rounded-lg bg-blue-600 border border-blue-400 flex items-center justify-center shadow-md">
                  <Navigation className="w-3.5 h-3.5 text-white animate-pulse" />
                </div>
              </div>
            );
          })}

          {/* Incidents */}
          {filteredIncidents.map((incident) => {
            const pos = toCoords(incident.latitude, incident.longitude);
            const config = SEVERITY_CONFIG[incident.severity] || SEVERITY_CONFIG.MEDIUM;
            const isSelected = selectedIncident?.id === incident.id;

            return (
              <div
                key={incident.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 z-30 ${
                  isSelected ? 'scale-125 z-40' : 'hover:scale-115'
                }`}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                onClick={() => onSelectIncident?.(incident)}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shadow-md border-2 border-white text-slate-950 font-bold text-[10px]"
                  style={{
                    backgroundColor: config.color,
                    boxShadow: isSelected ? `0 0 16px ${config.color}` : undefined,
                  }}
                >
                  <MapPin className="w-4 h-4 fill-white stroke-slate-900" />
                </div>
                {incident.etaMinutes && incident.status !== 'RESOLVED' && (
                  <span className="absolute -bottom-4 bg-white text-cyan-800 font-mono text-[9px] font-bold px-1 py-0.2 rounded border border-cyan-300 whitespace-nowrap shadow-xs">
                    {incident.etaMinutes}m ETA
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Map Legend Footer */}
      <div className="px-4 py-2.5 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-600">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-slate-500 font-bold uppercase text-[10px]">Legend:</span>
          <span className="flex items-center gap-1 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Low
          </span>
          <span className="flex items-center gap-1 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Medium
          </span>
          <span className="flex items-center gap-1 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> High
          </span>
          <span className="flex items-center gap-1 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" /> Critical
          </span>
          <span className="flex items-center gap-1 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Response Team
          </span>
          <span className="flex items-center gap-1 font-medium">
            <School className="w-3.5 h-3.5 text-amber-600" /> Critical Facility
          </span>
        </div>

        {/* Zoom Controls (Tactical View) */}
        {viewMode === 'tactical' && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(1.6, z + 0.15))}
              className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.9, z - 0.15))}
              className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
