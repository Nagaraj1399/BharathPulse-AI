import React from 'react';
import { VoiceAgent } from '../components/VoiceAgent';

interface CitizenPageProps {
  onIncidentCreated?: (incidentId: string) => void;
  onOpenDashboard?: () => void;
}

export const CitizenPage: React.FC<CitizenPageProps> = ({
  onIncidentCreated,
  onOpenDashboard,
}) => {
  return (
    <div className="py-6 space-y-6">
      <VoiceAgent
        onIncidentCreated={onIncidentCreated}
        onOpenDashboard={onOpenDashboard}
      />
    </div>
  );
};
