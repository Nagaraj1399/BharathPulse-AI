import React from 'react';
import { WorkOrder } from '../../shared/types';
import { Layers, Clock, ShieldAlert, CheckCircle, FileText } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface WorkOrderCardProps {
  workOrder?: WorkOrder | null;
  workOrderId?: string;
  incidentId?: string;
  etaMinutes?: number;
  teamName?: string;
}

export const WorkOrderCard: React.FC<WorkOrderCardProps> = ({
  workOrder,
  workOrderId,
  incidentId,
  etaMinutes,
  teamName,
}) => {
  const id = workOrder?.id || workOrderId || 'WO-BWSSB-2048';
  const eta = workOrder?.etaMinutes || etaMinutes || 8;
  const team = workOrder?.teamName || teamName || 'BWSSB Rapid Water Unit 01';

  return (
    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs shadow-lg">
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-amber-400" />
          <span className="font-mono font-bold text-white tracking-wide">{id}</span>
        </div>
        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase">
          DISPATCHED & ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-3">
        <div>
          <span className="text-[10px] text-slate-500 uppercase block">Assigned Unit</span>
          <span className="font-bold text-slate-200 mt-0.5 block">{team}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 uppercase block">Confirmed ETA</span>
          <span className="font-mono font-bold text-cyan-400 text-sm mt-0.5 block">
            {eta} Minutes
          </span>
        </div>
      </div>

      <div className="mt-3 p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed">
        <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-0.5">
          Dispatch Orders
        </span>
        {workOrder?.instructions ||
          'Secure high-pressure water pipe rupture. Divert standing flood water away from school gates. Inspect adjacent storm drainage.'}
      </div>

      <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
        <span>Authorized via Municipal Action Layer</span>
        <span className="text-emerald-400">STATUS: EN ROUTE</span>
      </div>
    </div>
  );
};
