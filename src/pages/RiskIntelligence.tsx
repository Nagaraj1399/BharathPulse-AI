import React from 'react';
import { RiskMap } from '../components/RiskMap';
import { RiskZone, Incident } from '../../shared/types';

interface RiskIntelligencePageProps {
  riskZones: RiskZone[];
  incidents: Incident[];
  onSelectZone?: (zone: RiskZone) => void;
}

export const RiskIntelligencePage: React.FC<RiskIntelligencePageProps> = ({
  riskZones,
  incidents,
  onSelectZone,
}) => {
  return (
    <div className="py-6">
      <RiskMap
        riskZones={riskZones}
        incidents={incidents}
        onSelectZone={onSelectZone}
      />
    </div>
  );
};
