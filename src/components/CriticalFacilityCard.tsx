import React from 'react';
import { CriticalFacility } from '../../shared/types';
import { School, Hospital, Shield, MapPin, AlertCircle } from 'lucide-react';

interface CriticalFacilityCardProps {
  facility: CriticalFacility;
}

export const CriticalFacilityCard: React.FC<CriticalFacilityCardProps> = ({ facility }) => {
  const isSchool = facility.type === 'school';
  const isHospital = facility.type === 'hospital';

  return (
    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs hover:border-slate-300 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className={`p-1.5 rounded-lg ${
              isSchool
                ? 'bg-amber-100 text-amber-800'
                : isHospital
                ? 'bg-rose-100 text-rose-800'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {isSchool ? (
              <School className="w-4 h-4" />
            ) : isHospital ? (
              <Hospital className="w-4 h-4" />
            ) : (
              <Shield className="w-4 h-4" />
            )}
          </div>
          <div>
            <h5 className="font-bold text-slate-900">{facility.name}</h5>
            <span className="text-[10px] text-slate-500 uppercase font-mono">{facility.type}</span>
          </div>
        </div>
        {facility.distanceMeters && (
          <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-amber-800 font-mono font-bold text-[10px]">
            {facility.distanceMeters}m away
          </span>
        )}
      </div>

      {facility.riskRelevance && (
        <div className="mt-2.5 p-2 rounded-lg bg-amber-50/80 border border-amber-200 text-slate-700 text-[11px] leading-relaxed flex items-start gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
          <span>{facility.riskRelevance}</span>
        </div>
      )}
    </div>
  );
};
