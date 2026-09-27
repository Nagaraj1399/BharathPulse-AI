import React from 'react';
import { Mic, Activity, CheckCircle2, ShieldAlert, Loader2 } from 'lucide-react';

export type VoiceOrbStatus =
  | 'idle'
  | 'connecting'
  | 'listening'
  | 'transcribing'
  | 'thinking'
  | 'coordinating'
  | 'acting'
  | 'speaking'
  | 'complete'
  | 'error';

interface VoiceOrbProps {
  status: VoiceOrbStatus;
  audioLevel?: number;
  recordingSeconds?: number;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const VoiceOrb: React.FC<VoiceOrbProps> = ({
  status,
  audioLevel = 0.2,
  recordingSeconds = 0,
  onClick,
  size = 'lg',
}) => {
  const isConnecting = status === 'connecting';
  const isListening = status === 'listening';
  const isTranscribing = status === 'transcribing';
  const isThinking = status === 'thinking';
  const isCoordinating = status === 'coordinating' || status === 'acting';
  const isSpeaking = status === 'speaking';
  const isComplete = status === 'complete';
  const isError = status === 'error';

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-36 h-36',
    lg: 'w-48 h-48 sm:w-56 sm:h-56',
  };

  const getStatusText = () => {
    switch (status) {
      case 'connecting':
        return 'Connecting...';
      case 'listening':
        return recordingSeconds > 0 ? `Listening... (${recordingSeconds}s)` : 'Listening...';
      case 'transcribing':
      case 'thinking':
        return 'BharatPulse Understanding...';
      case 'coordinating':
      case 'acting':
        return 'Coordinating with City Grid...';
      case 'speaking':
        return 'BharatPulse Speaking...';
      case 'complete':
        return 'Incident Coordinated';
      case 'error':
        return 'Voice temporarily unavailable';
      default:
        return 'TALK TO BHARATPULSE';
    }
  };

  const getGlowColor = () => {
    if (isConnecting) return 'rgba(234, 179, 8, 0.4)';
    if (isListening) return 'rgba(249, 115, 22, 0.55)'; // Saffron pulse
    if (isTranscribing || isThinking) return 'rgba(6, 182, 212, 0.55)'; // Cyan intelligence
    if (isCoordinating) return 'rgba(16, 185, 129, 0.5)'; // Green execution
    if (isSpeaking) return 'rgba(168, 85, 247, 0.55)'; // Purple native voice
    if (isComplete) return 'rgba(16, 185, 129, 0.6)';
    if (isError) return 'rgba(239, 68, 68, 0.5)';
    return 'rgba(245, 158, 11, 0.25)';
  };

  return (
    <div className="flex flex-col items-center justify-center select-none">
      <div className="relative flex items-center justify-center p-4">
        {/* Background Ripple Waves when Active */}
        {(isListening || isSpeaking || isThinking || isCoordinating || isConnecting) && (
          <>
            <div
              className="absolute inset-0 rounded-full animate-ping opacity-25"
              style={{
                backgroundColor: getGlowColor(),
                animationDuration: isListening ? '1.4s' : '2.2s',
              }}
            />
            <div
              className="absolute -inset-4 rounded-full opacity-20 blur-xl animate-pulse"
              style={{
                backgroundColor: getGlowColor(),
                transform: `scale(${1 + audioLevel * 0.4})`,
              }}
            />
          </>
        )}

        {/* Outer Ring */}
        <div
          className={`relative rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer ${
            sizeClasses[size]
          } ${
            isConnecting
              ? 'ring-4 ring-yellow-500/60 shadow-[0_0_50px_rgba(234,179,8,0.5)] animate-pulse'
              : isListening
              ? 'ring-4 ring-amber-500/60 shadow-[0_0_50px_rgba(245,158,11,0.5)]'
              : isThinking || isTranscribing
              ? 'ring-4 ring-cyan-400/60 shadow-[0_0_50px_rgba(6,182,212,0.5)] animate-spin-slow'
              : isCoordinating
              ? 'ring-4 ring-emerald-400/60 shadow-[0_0_50px_rgba(16,185,129,0.5)] animate-pulse'
              : isSpeaking
              ? 'ring-4 ring-purple-400/60 shadow-[0_0_50px_rgba(168,85,247,0.5)]'
              : isError
              ? 'ring-4 ring-rose-500/60 shadow-[0_0_40px_rgba(239,68,68,0.4)]'
              : 'hover:ring-2 hover:ring-indigo-400 shadow-[0_4px_25px_rgba(99,102,241,0.15)] bg-white'
          }`}
          onClick={onClick}
          role="button"
          tabIndex={0}
          aria-label={getStatusText()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onClick?.();
            }
          }}
        >
          {/* Sphere Gradient Core */}
          <div
            className="w-full h-full rounded-full flex flex-col items-center justify-center overflow-hidden relative border border-slate-200 shadow-inner"
            style={{
              background: isConnecting
                ? 'radial-gradient(circle, #ca8a04 0%, #713f12 55%, #0f172a 100%)'
                : isListening
                ? 'radial-gradient(circle, #ea580c 0%, #7c2d12 55%, #0f172a 100%)'
                : isThinking || isTranscribing
                ? 'radial-gradient(circle, #0891b2 0%, #164e63 55%, #0f172a 100%)'
                : isCoordinating
                ? 'radial-gradient(circle, #059669 0%, #064e3b 55%, #0f172a 100%)'
                : isSpeaking
                ? 'radial-gradient(circle, #9333ea 0%, #581c87 55%, #0f172a 100%)'
                : isError
                ? 'radial-gradient(circle, #dc2626 0%, #7f1d1d 55%, #0f172a 100%)'
                : 'radial-gradient(circle, #ffffff 0%, #f1f5f9 65%, #e2e8f0 100%)',
            }}
          >
            {/* Center Dynamic Icon */}
            {isComplete ? (
              <CheckCircle2 className="w-12 h-12 text-emerald-300 transition-transform scale-110" />
            ) : isConnecting ? (
              <Loader2 className="w-12 h-12 text-yellow-300 animate-spin" />
            ) : isThinking || isTranscribing ? (
              <Activity className="w-12 h-12 text-cyan-300 animate-pulse" />
            ) : isCoordinating ? (
              <ShieldAlert className="w-12 h-12 text-emerald-300 animate-bounce" />
            ) : (
              <Mic
                className={`w-12 h-12 transition-all duration-200 ${
                  isListening
                    ? 'text-amber-200 scale-125'
                    : isSpeaking
                    ? 'text-purple-200 scale-115'
                    : isError
                    ? 'text-rose-300'
                    : 'text-slate-600 hover:text-indigo-600'
                }`}
              />
            )}

            {/* Audio Waveform Bars */}
            {(isListening || isSpeaking) && (
              <div className="absolute bottom-6 flex items-center gap-1">
                {[0.4, 0.8, 0.5, 0.9, 0.6, 0.7, 0.3].map((val, idx) => (
                  <div
                    key={idx}
                    className="w-1 bg-white/90 rounded-full transition-all duration-100"
                    style={{
                      height: `${Math.max(4, val * audioLevel * 28)}px`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Label */}
      <div className="mt-4 text-center max-w-sm px-2">
        <p
          className={`text-sm sm:text-base font-bold tracking-wide uppercase transition-colors ${
            isConnecting
              ? 'text-yellow-600'
              : isListening
              ? 'text-amber-600'
              : isThinking || isTranscribing
              ? 'text-cyan-700'
              : isCoordinating
              ? 'text-emerald-700'
              : isSpeaking
              ? 'text-purple-700'
              : isComplete
              ? 'text-emerald-700'
              : isError
              ? 'text-rose-600'
              : 'text-slate-900'
          }`}
        >
          {getStatusText()}
        </p>
        <p className="text-xs text-slate-500 mt-0.5">
          {status === 'idle'
            ? 'Tap orb to start real-time voice conversation'
            : isConnecting
            ? 'Establishing secure ephemeral session...'
            : isListening
            ? 'Speak naturally • Gemini Live is listening'
            : isError
            ? 'Voice issue detected • You can type your report below'
            : 'Google Gemini Live API • Native Audio & Tool Gateway'}
        </p>
      </div>
    </div>
  );
};
