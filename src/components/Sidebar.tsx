import React from 'react';
import { Home, Radio, Activity, Shield, ShieldAlert, Info, Layers } from 'lucide-react';
import { AppTab } from './Header';

interface SidebarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  isOpen?: boolean;
  onClose?: () => void;
  isDarkMode?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isDarkMode = false,
}) => {
  const items = [
    { id: 'landing', label: 'Overview', icon: Home, badge: 'Home' },
    { id: 'citizen', label: 'Citizen Voice', icon: Radio, badge: 'Gemini Live' },
    { id: 'cyber', label: 'Cybersecurity', icon: ShieldAlert, badge: 'Link Scan' },
    { id: 'dashboard', label: 'Command Center', icon: Activity, badge: 'Live Ops' },
    { id: 'risk', label: 'Risk Intelligence', icon: Shield, badge: '2030 Model' },
  ] as const;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 hidden md:flex min-h-[calc(100vh-4.25rem)]">
      <div>
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Layers className="w-3 h-3 text-indigo-600" />
          Operating Architecture
        </div>
        <nav className="mt-2 space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-900 border border-indigo-200 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-indigo-600' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                  isActive ? 'bg-indigo-100 text-indigo-700 font-bold' : 'bg-slate-100 text-slate-500'
                }`}>
                  {item.badge}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Autonomous System Status Box */}
      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-800">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Agent Loop
          </span>
          <span className="text-cyan-700 font-mono font-bold">AUTONOMOUS</span>
        </div>
        <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
          Gemini Multimodal Brain + Node Action Tools + Gemini Live Voice
        </p>
        <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-600 font-mono">
          <span>Target: Bengaluru</span>
          <span className="text-emerald-700 font-bold">READY</span>
        </div>
      </div>
    </aside>
  );
};
