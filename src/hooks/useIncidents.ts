import { useState, useEffect, useCallback } from 'react';
import { Incident } from '../../shared/types';
import { api } from '../lib/api';

export function useIncidents(refreshIntervalMs = 3000) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIncidents = useCallback(async () => {
    try {
      const data = await api.getIncidents();
      setIncidents(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error fetching incidents');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIncidents();
    const interval = setInterval(fetchIncidents, refreshIntervalMs);
    return () => clearInterval(interval);
  }, [fetchIncidents, refreshIntervalMs]);

  return {
    incidents,
    loading,
    error,
    refresh: fetchIncidents,
  };
}
