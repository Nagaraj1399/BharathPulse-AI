import React from 'react';
import { ShieldCheck, ArrowRight, Activity, Shield, Sparkles } from 'lucide-react';
import { PulseCore } from './PulseCore';

interface LandingHeroProps {
  onEnterCityPulse?: () => void;
  onOpenVoice?: () => void;
  onOpenDashboard?: () => void;
  onOpenCyber?: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onEnterCityPulse,
  onOpenVoice,
  onOpenDashboard,
  onOpenCyber,
}) => {
  const handleEnterDashboard = onOpenDashboard || onEnterCityPulse || (() => {});
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between items-center px-4 py-8 sm:py-12 select-none text-center">
      {/* Top Tagline */}
      <div className="pt-2 animate-fade-in">
        <span className="text-[11px] font-mono tracking-widest uppercase px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold">
          BHARAT FUTURE · 2030
        </span>
      </div>

      {/* Centerpiece: Wordmark + Animated Pulse Core + Philosophy */}
      <div className="flex flex-col items-center space-y-6 max-w-2xl my-auto animate-fade-in">
        <h1 className="text-4xl sm:text-6xl font-black text-slate-950 tracking-tight font-sans">
          BHARAT<span className="text-indigo-600">PULSE</span>
        </h1>

        <p className="text-lg sm:text-xl font-medium text-slate-600 max-w-lg">
          India's Autonomous AI Operating System for Future Cities.
        </p>

        {/* Central Pulse Core */}
        <div className="py-2">
          <PulseCore size="hero" state="idle" label="PULSE CORE · 2030" onClick={handleEnterDashboard} />
        </div>

        {/* Core Philosophy Linear Sequence */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-mono font-bold tracking-wider text-slate-500">
          <span>LISTEN</span>
          <span className="text-slate-300">·</span>
          <span>UNDERSTAND</span>
          <span className="text-slate-300">·</span>
          <span>PREDICT</span>
          <span className="text-slate-300">·</span>
          <span>ACT</span>
          <span className="text-slate-300">·</span>
          <span>VERIFY</span>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleEnterDashboard}
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20 active:scale-95"
          >
            <span>COMMAND CENTER</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {onOpenVoice && (
            <button
              type="button"
              onClick={onOpenVoice}
              className="px-5 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>CITIZEN VOICE (LIVE)</span>
            </button>
          )}

          {onOpenCyber && (
            <button
              type="button"
              onClick={onOpenCyber}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-emerald-700/20 active:scale-95"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>CYBER LINK CHECKER</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Track Identification */}
      <div className="pb-4 text-center text-xs font-mono text-slate-500 space-y-1 animate-fade-in">
        <p>Built for the challenges India faces tomorrow · Climate · Water · Urbanisation · Safety</p>
        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
          BHARAT FUTURE 2030 · AUTONOMOUS CITY INTELLIGENCE
        </span>
      </div>
    </div>
  );
};
