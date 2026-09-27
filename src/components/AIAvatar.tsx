import React from 'react';
import { PersonaId, AI_PERSONAS } from '../lib/aiPersonas';

interface AIAvatarProps {
  personaId: PersonaId;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  state?: 'idle' | 'listening' | 'thinking' | 'acting' | 'alert';
  audioLevel?: number;
  showBadge?: boolean;
  className?: string;
  onClick?: () => void;
}

export const AIAvatar: React.FC<AIAvatarProps> = ({
  personaId,
  size = 'md',
  state = 'idle',
  audioLevel = 0.2,
  showBadge = false,
  className = '',
  onClick,
}) => {
  const persona = AI_PERSONAS[personaId] || AI_PERSONAS.pulse;

  const sizeDimensions = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32 sm:w-36 sm:h-36',
  };

  const isListening = state === 'listening';
  const isThinking = state === 'thinking';
  const isActing = state === 'acting';
  const isAlert = state === 'alert';

  // Render distinct abstract mathematical geometry per avatar
  const renderGeometry = () => {
    switch (personaId) {
      case 'jal':
        // JAL: Fluid wave / ripple concentric arcs
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full p-2.5">
            <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.25" />
            <circle cx="50" cy="50" r="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeOpacity="0.45" />
            <path
              d="M20 50 Q 35 36, 50 50 T 80 50"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              className={isListening || isThinking ? 'animate-pulse' : ''}
            />
            <path
              d="M25 60 Q 37.5 48, 50 60 T 75 60"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeOpacity="0.7"
              strokeLinecap="round"
            />
            <circle cx="50" cy="36" r="3" fill="currentColor" />
          </svg>
        );

      case 'raksha':
        // RAKSHA: Hexagonal / shield protective node geometry
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full p-2.5">
            <polygon
              points="50,15 82,32 82,68 50,85 18,68 18,32"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeOpacity="0.3"
            />
            <polygon
              points="50,26 72,38 72,62 50,74 28,62 28,38"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeOpacity="0.75"
              className={isAlert ? 'animate-ping opacity-60' : ''}
            />
            <circle cx="50" cy="50" r="5" fill="currentColor" />
            <line x1="50" y1="26" x2="50" y2="45" stroke="currentColor" strokeWidth="1.5" />
            <line x1="50" y1="55" x2="50" y2="74" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        );

      case 'drishti':
        // DRISHTI: Concentric radar sweep & predictive focal aperture
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full p-2.5">
            <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.25" strokeDasharray="3 3" />
            <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeOpacity="0.45" />
            <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.8" />
            <circle cx="50" cy="50" r="4" fill="currentColor" />
            {/* Predictive crosshairs */}
            <line x1="50" y1="8" x2="50" y2="20" stroke="currentColor" strokeWidth="1.5" />
            <line x1="50" y1="80" x2="50" y2="92" stroke="currentColor" strokeWidth="1.5" />
            <line x1="8" y1="50" x2="20" y2="50" stroke="currentColor" strokeWidth="1.5" />
            <line x1="80" y1="50" x2="92" y2="50" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        );

      case 'setu':
        // SETU: Soft organic harmonic speech bridge waveform
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full p-2.5">
            <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.25" />
            {/* Speech arc bars */}
            {[-18, -9, 0, 9, 18].map((offset, i) => (
              <line
                key={i}
                x1={50 + offset}
                y1={50 - Math.cos((offset / 25) * Math.PI) * (14 + audioLevel * 14)}
                x2={50 + offset}
                y2={50 + Math.cos((offset / 25) * Math.PI) * (14 + audioLevel * 14)}
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="transition-all duration-100"
              />
            ))}
          </svg>
        );

      case 'pulse':
      default:
        // PULSE: Clean circular core with breathing orbit rings
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full p-2.5">
            <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.2" />
            <circle
              cx="50"
              cy="50"
              r="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeOpacity="0.6"
              strokeDasharray="8 4"
              className={isThinking || isActing ? 'animate-spin origin-center' : ''}
              style={{ animationDuration: '6s' }}
            />
            <circle cx="50" cy="50" r="12" fill="currentColor" fillOpacity="0.85" />
            <circle cx="50" cy="50" r="5" fill="#FFFFFF" />
          </svg>
        );
    }
  };

  return (
    <div className={`relative inline-flex items-center gap-2 select-none ${className}`}>
      <div
        onClick={onClick}
        className={`relative ${sizeDimensions[size]} rounded-full flex items-center justify-center transition-all duration-300 ${
          onClick ? 'cursor-pointer hover:scale-105' : ''
        }`}
        style={{
          color: persona.color,
          backgroundColor: `${persona.color}14`,
          boxShadow: isAlert
            ? `0 0 25px ${persona.color}66`
            : isListening
            ? `0 0 20px ${persona.color}44`
            : isThinking
            ? `0 0 18px ${persona.color}33`
            : `0 0 10px ${persona.color}1A`,
          border: `1px solid ${persona.color}40`,
        }}
      >
        {/* Glow Ring on Active States */}
        {(isListening || isThinking || isActing || isAlert) && (
          <div
            className="absolute inset-0 rounded-full animate-ping opacity-20 pointer-events-none"
            style={{ backgroundColor: persona.color }}
          />
        )}

        {/* Abstract Geometry */}
        {renderGeometry()}

        {/* Status Dot */}
        <span
          className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-slate-950"
          style={{
            backgroundColor: isAlert ? '#EF4444' : isListening ? '#F59E0B' : isThinking ? '#06B6D4' : '#10B981',
          }}
        />
      </div>

      {showBadge && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold tracking-wider text-slate-100">{persona.name}</span>
            <span
              className="text-[9px] uppercase px-1.5 py-0.2 rounded font-mono font-semibold"
              style={{
                color: persona.color,
                backgroundColor: `${persona.color}20`,
                border: `1px solid ${persona.color}35`,
              }}
            >
              {persona.role.split(' ')[0]}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 truncate max-w-[140px]">{persona.subtitle}</span>
        </div>
      )}
    </div>
  );
};
