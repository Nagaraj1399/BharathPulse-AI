import { useState, useEffect, useCallback } from 'react';
import { AgentAction, AgentLoopPhase } from '../../shared/types';
import { api } from '../lib/api';

export function useAgent(incidentId?: string) {
  const [actions, setActions] = useState<AgentAction[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<AgentLoopPhase>('OBSERVE');

  const fetchActions = useCallback(async () => {
    try {
      const data = await api.getAgentActions(incidentId);
      setActions(data);

      if (data.length > 0) {
        const latest = data[0];
        if (latest.tool === 'verifyResolution' || latest.tool === 'generateIncidentReport') {
          setCurrentPhase('RESOLVE');
        } else if (latest.tool === 'requestVerification') {
          setCurrentPhase('VERIFY');
        } else if (latest.tool === 'createWorkOrder' || latest.tool === 'notifyResponseTeam') {
          setCurrentPhase('ACT');
        } else if (latest.tool === 'findNearbyCriticalPlaces' || latest.tool === 'findAvailableResponseTeams' || latest.tool === 'calculateResponseRoute') {
          setCurrentPhase('INVESTIGATE');
        } else if (latest.tool === 'classifyIncident') {
          setCurrentPhase('UNDERSTAND');
        }
      }
    } catch (err) {
      console.error('Failed to load agent actions:', err);
    }
  }, [incidentId]);

  useEffect(() => {
    fetchActions();
    const interval = setInterval(fetchActions, 2000);
    return () => clearInterval(interval);
  }, [fetchActions]);

  const triggerOrchestration = async (id: string) => {
    setLoading(true);
    try {
      const res = await api.runAgent(id);
      await fetchActions();
      return res;
    } finally {
      setLoading(false);
    }
  };

  return {
    actions,
    currentPhase,
    loading,
    refresh: fetchActions,
    triggerOrchestration,
  };
}
