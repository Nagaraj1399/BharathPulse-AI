import React, { useState, useEffect } from 'react';
import {
  Search,
  Command,
  HelpCircle,
  AlertTriangle,
  Droplets,
  Layers,
  Cpu,
  Shield,
  Play,
  Volume2,
  VolumeX,
  X,
  Mic,
} from 'lucide-react';
import { soundFx } from '../lib/soundFx';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: 'pulse' | 'map' | 'incidents' | 'intelligence' | 'citizen' | 'system' | 'cyber') => void;
  onOpenAskAI: () => void;
  onOpenCyber?: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenAskAI,
  onOpenCyber,
  soundEnabled,
  onToggleSound,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'ask',
      title: 'Ask BharatPulse Intelligence',
      category: 'AI Core',
      icon: HelpCircle,
      action: () => {
        onClose();
        onOpenAskAI();
      },
    },
    {
      id: 'citizen',
      title: 'Report Incident (Voice / Multilingual)',
      category: 'Citizen Interface',
      icon: Mic,
      action: () => {
        onClose();
        onNavigate('citizen');
      },
    },
    {
      id: 'incidents-critical',
      title: 'Show Critical City Incidents',
      category: 'Grid Operations',
      icon: AlertTriangle,
      action: () => {
        onClose();
        onNavigate('incidents');
      },
    },
    {
      id: 'water-risk',
      title: 'Show Water & Flood Risk Analysis',
      category: 'Environmental',
      icon: Droplets,
      action: () => {
        onClose();
        onNavigate('intelligence');
      },
    },
    {
      id: 'city-twin',
      title: 'Open 2030 Predictive City Twin',
      category: 'Future Modeling',
      icon: Layers,
      action: () => {
        onClose();
        onNavigate('intelligence');
      },
    },
    {
      id: 'simulation',
      title: 'Run 2030 Extreme Weather / Urban Simulation',
      category: 'Future Modeling',
      icon: Cpu,
      action: () => {
        onClose();
        onNavigate('intelligence');
      },
    },
    {
      id: 'action-ledger',
      title: 'Open Auditable AI Action Ledger',
      category: 'Governance',
      icon: Shield,
      action: () => {
        onClose();
        onNavigate('system');
      },
    },
    {
      id: 'city-shield',
      title: 'Inspect City Shield Cybersecurity Layer',
      category: 'Cyber Resilience',
      icon: Shield,
      action: () => {
        onClose();
        onNavigate('system');
      },
    },
    {
      id: 'cyber-link-checker',
      title: 'Scan Suspicious Link & Phishing URL',
      category: 'Cyber Resilience',
      icon: Shield,
      action: () => {
        onClose();
        if (onOpenCyber) {
          onOpenCyber();
        } else {
          onNavigate('cyber');
        }
      },
    },
    {
      id: 'citizen-voice-report',
      title: 'Voice Intake: Report Civic Emergency (குடிமக்கள் குரல்)',
      category: 'Citizen Services',
      icon: Mic,
      action: () => {
        onClose();
        onNavigate('citizen');
      },
    },
    {
      id: 'sound',
      title: soundEnabled ? 'Mute Mission Audio (Sound OFF)' : 'Unmute Mission Audio (Sound ON)',
      category: 'System',
      icon: soundEnabled ? VolumeX : Volume2,
      action: () => {
        onToggleSound();
      },
    },
  ];

  const filtered = actions.filter(
    (a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#090D16] border border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or jump to feature (or press Esc to exit)..."
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <kbd className="hidden sm:inline-block text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-850">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">
              No matching command found for "{query}".
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-850 text-left transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 group-hover:text-indigo-400 group-hover:border-indigo-500/40 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-200 group-hover:text-white block">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{item.category}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 group-hover:text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    Execute ↵
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts info */}
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-850 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>BharatPulse AI · India 2030</span>
          <span>Press ⌘K anytime to open</span>
        </div>
      </div>
    </div>
  );
};
