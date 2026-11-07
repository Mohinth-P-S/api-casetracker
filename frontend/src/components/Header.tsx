import React from 'react';
import { 
  ShieldCheck, 
  Database, 
  Terminal, 
  Layers, 
  Activity, 
  CheckCircle2, 
  Home, 
  Users, 
  AlertCircle
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  systemStatus: {
    status?: string;
    memory_provider?: string;
    memory_provider_label?: string;
    hindsight_connected?: boolean;
    isolated_banks_count?: number;
  } | null;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, systemStatus }) => {
  const isHindsightLive = systemStatus?.hindsight_connected;

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'troubleshooting', label: 'Troubleshooting', icon: Terminal },
    { id: 'problems', label: 'Frequent Problems', icon: AlertCircle },
    { id: 'customers', label: 'Customer Profiles', icon: Users },
    { id: 'verified-fixes', label: 'Verified Fixes', icon: CheckCircle2 },
  ];

  return (
    <header className="border-b border-[#E3DBD0] bg-[#FAF8F5] sticky top-0 z-40 backdrop-blur-xs">
      {/* Top broadsheet line */}
      <div className="max-w-[1440px] mx-auto px-6 py-2.5 flex items-center justify-between border-b border-[#EAE3D9] text-xs font-mono text-[#5E7D6D]">
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-[#1E3A2F] uppercase tracking-wider">PERSISTENT MEMORY LAYER: HINDSIGHT ENGINE</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className={`w-2 h-2 rounded-full ${isHindsightLive ? 'bg-[#264E3A] animate-pulse' : 'bg-[#D97706]'}`}></span>
            <span className="text-[#1F2421] font-medium">
              {isHindsightLive ? 'Hindsight Cloud Connected' : 'Demo Memory Mode (Fictional Store)'}
            </span>
          </div>
          <span className="text-[#c1c8c3]">•</span>
          <div className="flex items-center space-x-1 text-[#4A554E]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1E3A2F]" />
            <span>Strict Customer Scopes Enforced</span>
          </div>
        </div>
      </div>

      {/* Main navigation & Title bar */}
      <div className="max-w-[1440px] mx-auto px-6 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="w-9 h-9 bg-[#07241A] text-[#FAF8F5] flex items-center justify-center rounded-[4px] shadow-xs">
            <Layers className="w-5 h-5 text-[#AECEBE]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-serif font-bold text-[#07241A] tracking-tight">API CaseTracker</span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded-[2px] bg-[#EAE3D9] text-[#1E3A2F] font-semibold border border-[#5E7D6D]/30">
                v2.1
              </span>
            </div>
            <p className="text-xs text-[#5E7D6D]">Support that remembers every customer API fix</p>
          </div>
        </div>

        {/* Tab navigation */}
        <nav className="flex items-center space-x-1 overflow-x-auto pb-1 md:pb-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-[4px] text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-[#1E3A2F] text-[#FAF8F5] shadow-xs'
                    : 'text-[#4A554E] hover:text-[#07241A] hover:bg-[#F4EFEA]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#AECEBE]' : 'text-[#7A8880]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
