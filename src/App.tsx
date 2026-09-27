import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LandingHero } from './components/LandingHero';
import { CitizenPage } from './pages/Citizen';
import { CybersecurityPage } from './pages/CybersecurityPage';
import { DashboardPage } from './pages/Dashboard';
import { IncidentDetailPage } from './pages/IncidentDetail';
import { RiskIntelligencePage } from './pages/RiskIntelligence';
import { useIncidents } from './hooks/useIncidents';
import { useAgent } from './hooks/useAgent';
import { api } from './lib/api';
import { Incident, ResponseTeam, CriticalFacility, RiskZone } from '../shared/types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'landing' | 'citizen' | 'cyber' | 'dashboard' | 'risk'>('landing');
  const [detailedIncidentId, setDetailedIncidentId] = useState<string | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  // Sync state from current URL
  const syncFromUrl = useCallback(() => {
    const pathname = window.location.pathname;
    if (pathname.startsWith('/incident/')) {
      const id = pathname.replace('/incident/', '').trim();
      if (id) {
        setDetailedIncidentId(id);
        return;
      }
    }
    setDetailedIncidentId(null);
    if (pathname === '/cyber' || pathname === '/cybersecurity') {
      setActiveTab('cyber');
    } else if (pathname === '/dashboard') {
      setActiveTab('dashboard');
    } else if (pathname === '/risk' || pathname === '/risks') {
      setActiveTab('risk');
    } else if (pathname === '/citizen' || pathname === '/report') {
      setActiveTab('citizen');
    } else {
      setActiveTab('landing');
    }
  }, []);

  // Update browser URL history when tab or detailed incident changes
  const updateUrl = useCallback((tab: 'landing' | 'citizen' | 'cyber' | 'dashboard' | 'risk', incId: string | null) => {
    let targetPath = '/';
    if (incId) {
      targetPath = `/incident/${incId}`;
    } else if (tab === 'cyber') {
      targetPath = '/cyber';
    } else if (tab === 'dashboard') {
      targetPath = '/dashboard';
    } else if (tab === 'risk') {
      targetPath = '/risk';
    } else if (tab === 'citizen') {
      targetPath = '/citizen';
    }
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ tab, incId }, '', targetPath);
    }
  }, []);

  const navigateToTab = useCallback((tab: 'landing' | 'citizen' | 'cyber' | 'dashboard' | 'risk') => {
    setDetailedIncidentId(null);
    setActiveTab(tab);
    updateUrl(tab, null);
  }, [updateUrl]);

  const navigateToIncident = useCallback((id: string) => {
    setDetailedIncidentId(id);
    updateUrl(activeTab, id);
  }, [activeTab, updateUrl]);

  const navigateBackFromIncident = useCallback(() => {
    setDetailedIncidentId(null);
    setActiveTab('dashboard');
    updateUrl('dashboard', null);
  }, [updateUrl]);

  useEffect(() => {
    syncFromUrl();
    const handlePopState = () => {
      syncFromUrl();
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [syncFromUrl]);

  // Data fetching hooks
  const { incidents, refresh: refreshIncidents } = useIncidents(2500);
  const { actions, refresh: refreshActions } = useAgent();

  const [teams, setTeams] = useState<ResponseTeam[]>([]);
  const [facilities, setFacilities] = useState<CriticalFacility[]>([]);
  const [riskZones, setRiskZones] = useState<RiskZone[]>([]);

  const loadReferenceData = useCallback(async () => {
    try {
      const [teamsData, facilitiesData, riskData] = await Promise.all([
        api.getTeams(),
        api.getCriticalFacilities(),
        api.getRiskZones(),
      ]);
      setTeams(teamsData);
      setFacilities(facilitiesData);
      setRiskZones(riskData);
    } catch (e) {
      console.warn('Reference data load notice:', e);
    }
  }, []);

  useEffect(() => {
    loadReferenceData();
  }, [loadReferenceData]);

  // Set selected incident default if not set
  useEffect(() => {
    if (!selectedIncident && incidents.length > 0) {
      const defaultInc = incidents.find((i) => i.id === 'BP-2048') || incidents[0];
      setSelectedIncident(defaultInc);
    }
  }, [incidents, selectedIncident]);

  const handleSelectIncident = (inc: Incident) => {
    setSelectedIncident(inc);
  };

  const handleViewDetails = (id: string) => {
    setDetailedIncidentId(id);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} flex flex-col font-sans selection:bg-amber-200 selection:text-slate-900`}>
      {/* Header */}
      <Header
        activeTab={detailedIncidentId ? 'dashboard' : activeTab}
        setActiveTab={navigateToTab}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <Sidebar
          activeTab={detailedIncidentId ? 'dashboard' : activeTab}
          setActiveTab={navigateToTab}
          isDarkMode={isDarkMode}
        />

        {/* Main Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-hidden">
          {/* Router Switching */}
          {detailedIncidentId ? (
            <IncidentDetailPage
              incidentId={detailedIncidentId}
              onBack={navigateBackFromIncident}
              teams={teams}
            />
          ) : activeTab === 'landing' ? (
            <LandingHero
              onOpenVoice={() => navigateToTab('citizen')}
              onOpenDashboard={() => navigateToTab('dashboard')}
              onOpenCyber={() => navigateToTab('cyber')}
            />
          ) : activeTab === 'citizen' ? (
            <CitizenPage
              onIncidentCreated={(id) => {
                navigateToIncident(id);
              }}
              onOpenDashboard={() => navigateToTab('dashboard')}
            />
          ) : activeTab === 'cyber' ? (
            <CybersecurityPage
              onIncidentCreated={(id) => {
                navigateToIncident(id);
              }}
              onOpenDashboard={() => navigateToTab('dashboard')}
              isDarkMode={isDarkMode}
              onToggleDarkMode={handleToggleDarkMode}
            />
          ) : activeTab === 'dashboard' ? (
            <DashboardPage
              incidents={incidents}
              teams={teams}
              facilities={facilities}
              riskZones={riskZones}
              actions={actions}
              selectedIncident={selectedIncident}
              onSelectIncident={handleSelectIncident}
              onViewDetails={navigateToIncident}
              onOpenCyber={() => navigateToTab('cyber')}
              onRefresh={async () => {
                await refreshIncidents();
                await refreshActions();
              }}
            />
          ) : (
            <RiskIntelligencePage
              riskZones={riskZones}
              incidents={incidents}
              onSelectZone={(zone) => {
                console.log('Selected zone:', zone.name);
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
}
