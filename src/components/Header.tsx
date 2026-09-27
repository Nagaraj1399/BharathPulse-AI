import React, { useEffect, useState } from 'react';
import {
  Activity,
  Radio,
  Shield,
  ShieldAlert,
  Map,
  Layers,
  Cpu,
  LogIn,
  LogOut,
  Volume2,
  VolumeX,
  Search,
  Moon,
  Sun,
} from 'lucide-react';
import { auth, loginWithGoogle, logoutUser, onAuthStateChanged } from '../lib/firebase';
import type { User } from 'firebase/auth';
import { soundFx } from '../lib/soundFx';

export type AppTab = 'landing' | 'citizen' | 'cyber' | 'dashboard' | 'risk';

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  onOpenCommandPalette?: () => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenCommandPalette,
  soundEnabled: externalSoundEnabled,
  onToggleSound: externalToggleSound,
  isDarkMode = false,
  onToggleDarkMode,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [localSound, setLocalSound] = useState(() => soundFx.isEnabled());

  const isSoundActive = externalSoundEnabled !== undefined ? externalSoundEnabled : localSound;

  const handleToggleSound = () => {
    if (externalToggleSound) {
      externalToggleSound();
    } else {
      const next = soundFx.toggle();
      setLocalSound(next);
    }
  };

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      console.warn('Login dismissed or failed', err);
    }
  };

  const handleSignOut = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error('Logout error', err);
    }
  };

  const navItems: { id: AppTab; label: string; icon: any }[] = [
    { id: 'landing', label: 'OVERVIEW', icon: Activity },
    { id: 'citizen', label: 'CITIZEN VOICE', icon: Radio },
    { id: 'cyber', label: 'CYBER CHECKER', icon: ShieldAlert },
    { id: 'dashboard', label: 'COMMAND CENTER', icon: Map },
    { id: 'risk', label: 'RISK INTEL', icon: Shield },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand Zone */}
        <div
          className="flex items-center gap-3 cursor-pointer select-none shrink-0"
          onClick={() => setActiveTab('landing')}
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/20">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm sm:text-base tracking-wider text-slate-900">
                BHARAT<span className="text-indigo-600">PULSE</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold">
                2030
              </span>
            </div>
            <p className="text-[10px] text-slate-500 hidden xl:block font-medium">
              India's Autonomous City Intelligence OS
            </p>
          </div>
        </div>

        {/* Center Minimal Navigation */}
        <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-100/90 rounded-xl border border-slate-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  soundFx.playSignalReceived();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider font-mono flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2">
          {/* Command Palette Button */}
          {onOpenCommandPalette && (
            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono text-slate-600 hover:text-slate-900 bg-slate-100 border border-slate-200 hover:bg-slate-200 transition-colors"
              title="Command Palette (Cmd+K)"
            >
              <Search className="w-3 h-3 text-slate-500" />
              <span className="text-[11px] font-semibold">⌘K</span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={handleToggleSound}
            className={`p-2 rounded-lg border transition-colors ${
              isSoundActive
                ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                : 'bg-slate-100 border-slate-200 text-slate-400 hover:text-slate-600'
            }`}
            title={isSoundActive ? 'Mute Sound' : 'Enable Sound'}
          >
            {isSoundActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Light / Dark Mode Toggle */}
          {onToggleDarkMode && (
            <button
              type="button"
              onClick={onToggleDarkMode}
              className={`p-2 rounded-lg border transition-colors ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-amber-400'
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          )}

          {/* Municipal Emergency & Operational Status */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-700 dark:text-slate-300 font-semibold">1930 Cyber · 112 SOS</span>
          </div>

          {/* Google Auth Status */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-xl px-2 py-1">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'User'}
                  className="w-5 h-5 rounded-full object-cover border border-indigo-400/40"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {currentUser.displayName ? currentUser.displayName[0] : 'U'}
                </div>
              )}
              <button
                type="button"
                onClick={handleSignOut}
                title="Sign out"
                className="text-slate-400 hover:text-red-500 p-0.5 rounded transition-colors"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleSignIn}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 border border-slate-200 hover:border-slate-300 hover:bg-slate-200 hover:text-slate-900 transition-all"
            >
              <LogIn className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline text-xs font-semibold">Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Secondary Tab Navigation Bar */}
      <div className="md:hidden flex items-center justify-around px-2 py-1.5 bg-white border-t border-slate-200 overflow-x-auto text-[11px] font-mono">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                soundFx.playSignalReceived();
              }}
              className={`px-2 py-1 rounded-md transition-colors ${
                isActive ? 'text-indigo-700 font-bold bg-indigo-50 border border-indigo-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
