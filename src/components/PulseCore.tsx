import React from 'react';

export type PulseCoreState =
  | 'idle'
  | 'listening'
  | 'thinking'
  | 'tool_execution'
  | 'critical'
  | 'resolved';

interface PulseCoreProps {
  state?: PulseCoreState;
  audioLevel?: number;
  label?: string;
  onClick?: () => void;
  size?: 'md' | 'lg' | 'hero';
}

export const PulseCore: React.FC<PulseCoreProps> = ({
  state = 'idle',
  audioLevel = 0.2,
  label,
  onClick,
  size = 'lg',
}) => {
  const isListening = state === 'listening';
  const isThinking = state === 'thinking';
  const isTool = state === 'tool_execution';
  const isCritical = state === 'critical';
  const isResolved = state === 'resolved';

  const sizeClasses = {
    md: 'w-24 h-24 sm:w-28 sm:h-28',
    lg: 'w-36 h-36 sm:w-44 sm:h-44',
    hero: 'w-48 h-48 sm:w-60 sm:h-60',
  };

  const getCoreColor = () => {
    if (isCritical) return '#EF4444'; // Red alert
    if (isListening) return '#F59E0B'; // Amber voice intake
    if (isThinking) return '#06B6D4'; // Cyan intelligence
    if (isTool) return '#6366F1'; // Indigo tool execution
    if (isResolved) return '#10B981'; // Green verified
    return '#4F46E5'; // Intelligent Blue default
  };

  const color = getCoreColor();

  return (
    <div className="flex flex-col items-center justify-center select-none group">
      <div className="relative flex items-center justify-center p-6">
        {/* Deep Ambient Glow Aura */}
        <div
          className="absolute inset-0 rounded-full blur-2xl transition-all duration-700 pointer-events-none"
          style={{
            backgroundColor: color,
            opacity: isListening ? 0.35 + audioLevel * 0.4 : isCritical ? 0.45 : isTool ? 0.35 : 0.2,
            transform: `scale(${1 + audioLevel * 0.3})`,
          }}
        />

        {/* Outer Orbital Resonator Ring */}
        <div
          className={`absolute rounded-full border transition-all duration-500 pointer-events-none ${
            size === 'hero' ? 'w-64 h-64 sm:w-80 sm:h-80' : size === 'lg' ? 'w-48 h-48 sm:w-56 sm:h-56' : 'w-32 h-32 sm:w-36 sm:h-36'
          } ${
            isThinking || isTool ? 'animate-spin' : isListening ? 'animate-pulse' : ''
          }`}
          style={{
            borderColor: `${color}30`,
            borderStyle: 'dashed',
            animationDuration: isThinking ? '8s' : '16s',
          }}
        />

        {/* Concentric Pulse Ring for Tools/Alert */}
        {(isTool || isCritical || isListening) && (
          <div
            className="absolute inset-2 rounded-full animate-ping opacity-25 pointer-events-none"
            style={{
              backgroundColor: color,
              animationDuration: isListening ? '1.2s' : isCritical ? '0.9s' : '2.4s',
            }}
          />
        )}

        {/* Interactive Pulse Core Orb */}
        <div
          onClick={onClick}
          role="button"
          tabIndex={0}
          aria-label={label || 'BharatPulse AI Core'}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onClick?.();
            }
          }}
          className={`relative rounded-full transition-all duration-500 flex items-center justify-center overflow-hidden cursor-pointer ${
            sizeClasses[size]
          } group-hover:scale-105 active:scale-95`}
          style={{
            backgroundColor: '#ffffff',
            boxShadow: `0 10px 40px ${color}30, 0 2px 12px ${color}20, inset 0 0 25px ${color}15`,
            border: `2px solid ${color}45`,
          }}
        >
          {/* Subtle Radial Gradient Depth */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${color}18 0%, #ffffff 85%)`,
            }}
          />

          {/* SVG Animated Center Wave / Core Intelligence */}
          <svg viewBox="0 0 100 100" className="w-full h-full p-6 relative z-10">
            {/* Inner Ring */}
            <circle
              cx="50"
              cy="50"
              r="34"
              fill="none"
              stroke={color}
              strokeWidth="1.5"
              strokeOpacity="0.4"
              strokeDasharray={isThinking ? '6 6' : 'none'}
              className={isThinking ? 'animate-spin origin-center' : ''}
              style={{ animationDuration: '10s' }}
            />

            {/* Core Nucleus */}
            <circle
              cx="50"
              cy="50"
              r={isListening ? 14 + audioLevel * 10 : isTool ? 18 : 13}
              fill={color}
              fillOpacity={0.9}
              className="transition-all duration-200"
            />
            <circle cx="50" cy="50" r="5" fill="#FFFFFF" fillOpacity="0.95" />

            {/* Orbiting Telemetry Nodes */}
            <circle cx="50" cy="18" r="2.5" fill={color} fillOpacity="0.9" />
            <circle cx="82" cy="50" r="2" fill={color} fillOpacity="0.6" />
            <circle cx="50" cy="82" r="2" fill={color} fillOpacity="0.6" />
            <circle cx="18" cy="50" r="2" fill={color} fillOpacity="0.6" />
          </svg>

          {/* Audio Wave Bars when Listening */}
          {isListening && (
            <div className="absolute bottom-5 sm:bottom-7 flex items-center gap-1 z-20">
              {[0.4, 0.8, 0.5, 0.95, 0.65, 0.7, 0.35].map((val, idx) => (
                <div
                  key={idx}
                  className="w-1 bg-indigo-600 rounded-full transition-all duration-100"
                  style={{
                    height: `${Math.max(3, val * audioLevel * 24)}px`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Caption & State Label */}
      <div className="mt-2 text-center max-w-xs px-3">
        <div className="flex items-center justify-center gap-2">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: color }}
          />
          <span className="text-xs font-bold tracking-wider uppercase text-slate-900">
            {label ||
              (isCritical
                ? 'CRITICAL INCIDENT SIGNAL'
                : isTool
                ? 'AUTONOMOUS TOOL EXECUTION'
                : isListening
                ? 'LISTENING TO CITIZEN'
                : isThinking
                ? 'REASONING & COORDINATING'
                : isResolved
                ? 'OUTCOME CONFIRMED'
                : 'PULSE CORE · 2030')}
          </span>
        </div>
        <p className="text-[11px] text-slate-500 mt-0.5">
          {onClick ? 'Click to Ask BharatPulse Intelligence' : 'India’s Autonomous City Operating System'}
        </p>
      </div>
    </div>
  );
};
