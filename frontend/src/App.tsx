import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { TroubleshootingPage } from './pages/TroubleshootingPage';
import { FrequentProblemsPage } from './pages/FrequentProblemsPage';
import { CustomerProfilesPage } from './pages/CustomerProfilesPage';
import { VerifiedFixesPage } from './pages/VerifiedFixesPage';
import { api } from './api';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [activeFlow, setActiveFlow] = useState<'flow1a' | 'flow1b' | 'flow2' | null>(null);
  const [systemStatus, setSystemStatus] = useState<any>(null);

  useEffect(() => {
    api.getHealth()
      .then(setSystemStatus)
      .catch((err) => console.error('Failed to get health:', err));
  }, []);

  const handleOpenWorkspace = () => {
    setActiveTab('troubleshooting');
    setActiveFlow(null);
  };

  const handleSelectFlow = (flowId: 'flow1a' | 'flow1b' | 'flow2') => {
    setActiveFlow(flowId);
    setActiveTab('troubleshooting');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1B1C1A]">
      <Header 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'troubleshooting') setActiveFlow(null);
        }} 
        systemStatus={systemStatus} 
      />

      <main className="flex-1 pb-16">
        {activeTab === 'home' && (
          <HomePage 
            onOpenWorkspace={handleOpenWorkspace}
            onSelectFlow={handleSelectFlow}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardPage 
            onNavigateToTroubleshooting={handleOpenWorkspace}
            onSelectCase={(caseId) => {
              setActiveTab('verified-fixes');
            }}
          />
        )}

        {activeTab === 'troubleshooting' && (
          <TroubleshootingPage 
            initialFlow={activeFlow}
            onClearFlow={() => setActiveFlow(null)}
          />
        )}

        {activeTab === 'problems' && (
          <FrequentProblemsPage />
        )}

        {activeTab === 'customers' && (
          <CustomerProfilesPage />
        )}

        {activeTab === 'verified-fixes' && (
          <VerifiedFixesPage />
        )}
      </main>

      {/* Broadsheet Footer */}
      <footer className="border-t border-[#E3DBD0] bg-[#F4EFEA] py-8 text-xs font-mono text-[#5E7D6D]">
        <div className="max-w-[1440px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="font-serif font-bold text-[#07241A] text-sm">
              API CaseTracker — Editorial Engineering Atelier
            </div>
            <p>
              Persistent Memory Layer powered by Hindsight Python Client
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <span className="bg-[#EAE3D9] px-2.5 py-1 rounded-[2px] text-[#1E3A2F] border border-[#5E7D6D]/30">
              Customer Bank Partitioning: Active
            </span>
            <span>Promo Code: MEMHACK99 ($50 Hindsight Cloud Credits)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
