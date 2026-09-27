import React from 'react';
import { CommandCenter } from '../components/CommandCenter';
import { Incident, ResponseTeam, CriticalFacility, RiskZone, AgentAction } from '../../shared/types';

interface DashboardPageProps {
  incidents: Incident[];
  teams: ResponseTeam[];
  facilities: CriticalFacility[];
  riskZones: RiskZone[];
  actions: AgentAction[];
  selectedIncident: Incident | null;
  onSelectIncident: (inc: Incident) => void;
  onViewDetails: (id: string) => void;
  onRefresh: () => void;
  onOpenCyber?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = (props) => {
  return (
    <div className="py-6">
      <CommandCenter {...props} />
    </div>
  );
};
