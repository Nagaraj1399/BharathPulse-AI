import React, { useState, useEffect, useRef } from 'react';
import { VoiceOrb } from './VoiceOrb';
import { LanguageSelector } from './LanguageSelector';
import { useVoiceAgent } from '../hooks/useVoiceAgent';
import {
  Camera,
  Send,
  Sparkles,
  Volume2,
  ArrowRight,
  AlertTriangle,
  Play,
  RefreshCw,
  Mic,
  MessageSquare,
  CheckCircle2,
  Radio,
  Coins,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { SupportedLanguage, Incident } from '../../shared/types';
import { AIAvatar } from './AIAvatar';
import { soundFx } from '../lib/soundFx';
import { WorkCompletionAgent } from './WorkCompletionAgent';
import { api } from '../lib/api';

interface VoiceAgentProps {
  onIncidentCreated?: (incidentId: string) => void;
  onOpenDashboard?: () => void;
}

export const VoiceAgent: React.FC<VoiceAgentProps> = ({
  onIncidentCreated,
  onOpenDashboard,
}) => {
  const {
    status,
    transcript,
    setTranscript,
    responseMessage,
    selectedLanguage,
    setSelectedLanguage,
    incidentId,
    conversation,
    audioLevel,
    errorMessage,
    recordingSeconds,
    startListening,
    stopListeningAndProcess,
    simulateVoiceInput,
    resetVoice,
  } = useVoiceAgent();

  const [showTypeInput, setShowTypeInput] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [typedMessage, setTypedMessage] = useState('');
  const [isContinuousListening, setIsContinuousListening] = useState(true);
  const [activeIncident, setActiveIncident] = useState<Incident | null>(null);
  const silenceTimerRef = useRef<any>(null);

  // Notify parent dashboard if an incident is confirmed
  useEffect(() => {
    if (incidentId) {
      onIncidentCreated?.(incidentId);
      soundFx.playVerificationSuccess();
    }
  }, [incidentId, onIncidentCreated]);

  // Continuous auto-submit: when speech is recognized, auto-process without forcing re-click
  useEffect(() => {
    if (!isContinuousListening) return;
    if (status === 'listening' && transcript && transcript.trim().length > 8) {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        soundFx.playActionConfirmed();
        stopListeningAndProcess(transcript, uploadedImage || undefined);
      }, 1600);
    }
    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
  }, [transcript, status, isContinuousListening, uploadedImage, stopListeningAndProcess]);

  // Load or construct active incident for the Work Completion Inspector Agent
  useEffect(() => {
    if (!incidentId) return;
    let mounted = true;
    api
      .getIncident(incidentId)
      .then((data) => {
        if (mounted && data) setActiveIncident(data);
      })
      .catch(() => {
        if (mounted) {
          setActiveIncident({
            id: incidentId,
            type: 'WATER_LEAK',
            description: transcript || 'Civic infrastructure breakdown reported via Citizen Voice',
            language: selectedLanguage,
            latitude: 12.9782,
            longitude: 77.6415,
            address: 'Near Indiranagar Government High School, 100ft Rd, Bengaluru',
            severity: 'HIGH',
            status: 'DISPATCHED',
            assignedTeamId: 'TEAM-BWSSB-01',
            assignedTeamName: 'BWSSB Rapid Water Unit 01',
            confidence: 0.95,
            workOrderId: `WO-BWSSB-${incidentId.replace('BP-', '')}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as Incident);
        }
      });
    return () => {
      mounted = false;
    };
  }, [incidentId, transcript, selectedLanguage]);

  // Sample quick civic reports with Tamil support
  const samplePrompts = [
    {
      title: 'Tamil: பள்ளியின் அருகே குடிநீர் குழாய் உடைப்பு',
      text: 'பள்ளியின் அருகே பிரதான குடிநீர் குழாய் உடைந்து சாலையில் வெள்ளம் ஏற்பட்டுள்ளது.',
      lang: 'ta' as SupportedLanguage,
    },
    {
      title: 'Tamil: சாலையில் பெரிய பள்ளம் மற்றும் விபத்து அபாயம்',
      text: 'சாலையில் பெரிய ஆபத்தான பள்ளம் ஏற்பட்டுள்ளது மற்றும் வாகனங்கள் செல்ல முடியவில்லை.',
      lang: 'ta' as SupportedLanguage,
    },
    {
      title: 'English: Water Leak & School Flood',
      text: 'There is a major water leak outside a school and the road is flooding.',
      lang: 'en' as SupportedLanguage,
    },
    {
      title: 'Hindi: स्कूल के बाहर पाइप लाइन लीकेज',
      text: 'स्कूल के बाहर पानी की बड़ी पाइपलाइन फट गई है और सड़क पर पानी भर रहा है।',
      lang: 'hi' as SupportedLanguage,
    },
    {
      title: 'Kannada: ಶಾಲೆಯ ಬಳಿ ರಸ್ತೆ ಜಲಾವೃತ',
      text: 'ಶಾಲೆಯ ಮುಂದೆ ನೀರಿನ ಪೈಪ್ ಒಡೆದು ರಸ್ತೆಯಲ್ಲಿ ನೀರು ನಿಂತಿದೆ.',
      lang: 'kn' as SupportedLanguage,
    },
    {
      title: 'Sparking Transformer near Bus Station',
      text: 'A high voltage transformer is sparking and dripping oil near the bus station.',
      lang: 'en' as SupportedLanguage,
    },
  ];

  const handleOrbClick = () => {
    if (status === 'idle' || status === 'error') {
      soundFx.playSignalReceived();
      startListening();
    } else if (status === 'listening') {
      soundFx.playActionConfirmed();
      stopListeningAndProcess(transcript, uploadedImage || undefined);
    } else if (status === 'complete') {
      resetVoice();
    }
  };

  const handleInspectSampleIncident = async () => {
    soundFx.playSignalReceived();
    try {
      const inc = await api.getIncident('BP-1028');
      setActiveIncident(inc);
    } catch {
      setActiveIncident({
        id: 'BP-1028',
        type: 'FLOODING',
        description: 'Stormwater overflow entering residential basements in HSR Sector 6.',
        language: 'ta',
        latitude: 12.9156,
        longitude: 77.6389,
        address: '14th Main Rd, HSR Layout Sector 6, Bengaluru',
        severity: 'CRITICAL',
        status: 'VERIFYING',
        assignedTeamId: 'TEAM-SWD-02',
        assignedTeamName: 'BBMP Stormwater Drainage Crew 02',
        workOrderId: 'WO-SWD-1028',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Incident);
    }
  };

  const handleSubmitText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() && !transcript.trim()) return;
    const textToSubmit = typedMessage.trim() || transcript.trim();
    setTypedMessage('');
    soundFx.playActionConfirmed();
    stopListeningAndProcess(textToSubmit, uploadedImage || undefined);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 select-none">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xl relative overflow-hidden text-center">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Top Controls: SETU Identity & Language Selector */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <AIAvatar personaId="setu" size="sm" state={status === 'listening' ? 'listening' : 'idle'} />
            <div className="text-left">
              <span className="font-bold text-xs text-slate-900 tracking-wide block">
                SETU · CITIZEN AI
              </span>
              <span className="text-[10px] text-emerald-600 font-mono font-semibold">
                Multilingual Voice Bridge · 2030
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsContinuousListening(!isContinuousListening)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
                isContinuousListening
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
              title="Continuous Auto-Listening Mode (Hands-free voice recognition)"
            >
              <Radio className={`w-3.5 h-3.5 ${isContinuousListening ? 'text-emerald-600 animate-pulse' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">
                {isContinuousListening ? 'Auto-Listen: ON (தொடர் முறை)' : 'Auto-Listen: OFF'}
              </span>
              <span className="sm:hidden">
                {isContinuousListening ? 'Auto ON' : 'Auto OFF'}
              </span>
            </button>

            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onSelect={(lang) => setSelectedLanguage(lang)}
            />
          </div>
        </div>

        {/* Main Minimalist Question Heading */}
        <div className="pt-8 pb-4">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            WHAT'S HAPPENING?
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
            Speak naturally in your mother tongue. SETU understands and activates municipal response.
          </p>
        </div>

        {/* Center Animated Voice Orb */}
        <div className="py-6 flex flex-col items-center justify-center">
          <VoiceOrb
            status={status}
            audioLevel={audioLevel}
            recordingSeconds={recordingSeconds}
            onClick={handleOrbClick}
            size="lg"
          />

          {/* Quick Action under Orb */}
          {status === 'listening' ? (
            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  soundFx.playActionConfirmed();
                  stopListeningAndProcess(transcript, uploadedImage || undefined);
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/25 flex items-center gap-1.5 transition-all"
              >
                <span>Finished Speaking — Send Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={resetVoice}
                className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all border border-slate-200"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={handleOrbClick}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20"
              >
                <Mic className="w-4 h-4" />
                <span>TALK TO SETU</span>
              </button>
              <button
                type="button"
                onClick={() => setShowTypeInput(!showTypeInput)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 flex items-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                <span>{showTypeInput ? 'Hide Typing' : 'TYPE INSTEAD'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={startListening}
              className="px-2.5 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 border border-rose-300 text-rose-900 font-bold shrink-0"
            >
              Retry Mic
            </button>
          </div>
        )}

        {/* Live Conversation Transcript Log */}
        {conversation.length > 0 && (
          <div className="space-y-3 mb-6 max-h-72 overflow-y-auto pr-1 text-left">
            {conversation.map((msg) => (
              <div
                key={msg.id}
                className={`p-4 rounded-2xl border transition-all ${
                  msg.sender === 'CITIZEN'
                    ? 'bg-amber-50/80 border-amber-200 ml-2 sm:ml-6 text-amber-950'
                    : 'bg-indigo-50/80 border-indigo-200 mr-2 sm:mr-6 shadow-sm text-slate-900'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono font-bold mb-1.5">
                  <span
                    className={`flex items-center gap-1.5 ${
                      msg.sender === 'CITIZEN' ? 'text-amber-800' : 'text-indigo-700'
                    }`}
                  >
                    {msg.sender === 'CITIZEN' ? <Mic className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                    {msg.sender === 'CITIZEN' ? 'CITIZEN' : 'BHARATPULSE'}
                  </span>
                  <span className="text-slate-400 text-[10px] font-normal">{msg.timestamp}</span>
                </div>
                <p className="text-slate-800 text-sm font-medium leading-relaxed whitespace-pre-wrap">
                  "{msg.text}"
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Live Partial Input Box when Active */}
        {(status === 'listening' || status === 'thinking' || status === 'coordinating') && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm mb-6 text-left">
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-1.5">
              <span className="flex items-center gap-1.5 text-amber-600 font-bold">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-500" />
                Live Sensory Input
              </span>
              <span className="uppercase text-indigo-700 font-bold">{status}</span>
            </div>
            <p className="text-slate-900 font-medium leading-relaxed min-h-[1.5rem]">
              {transcript ||
                (status === 'listening'
                  ? 'Listening to speech... Speak into your microphone.'
                  : 'Coordinating with Bengaluru City Grid...')}
            </p>
          </div>
        )}

        {/* Section 24 Structured Summary Card ("I understood this as:") */}
        {transcript && status !== 'listening' && !incidentId && (
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-300 text-left mb-6 animate-fade-in">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-800 mb-2 font-bold uppercase">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>SETU: "I understood this as:"</span>
            </div>
            <p className="text-sm text-slate-800 font-medium">"{transcript}"</p>
            <div className="mt-3 pt-3 border-t border-emerald-200 flex items-center justify-between">
              <button
                type="button"
                onClick={resetVoice}
                className="text-xs text-slate-600 hover:text-slate-900 font-medium"
              >
                [Correct / Re-record]
              </button>
              <button
                type="button"
                onClick={() => stopListeningAndProcess(transcript, uploadedImage || undefined)}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
              >
                <span>[Send Report]</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Confirmed Incident Action Badge */}
        {incidentId && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-sm mb-6 animate-fade-in shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-mono font-bold text-xs border border-amber-300">
                  {incidentId}
                </span>
                <span className="text-xs text-emerald-900 font-bold">
                  REPORT RECEIVED · MUNICIPAL DISPATCH ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Field squad assigned. Traffic-aware route computed.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onIncidentCreated?.(incidentId);
                onOpenDashboard?.();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center gap-1 hover:bg-indigo-700 shadow-sm shrink-0"
            >
              <span>Track in Command Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Input Bar with Camera & Typed Input */}
        {showTypeInput && (
          <form onSubmit={handleSubmitText} className="flex items-center gap-2 mb-6 animate-fade-in">
            <label
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer border border-slate-200 flex items-center justify-center transition-colors"
              title="Upload Incident Photo"
            >
              <Camera className="w-5 h-5 text-slate-600" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>

            <input
              type="text"
              value={typedMessage}
              onChange={(e) => setTypedMessage(e.target.value)}
              placeholder="Or describe the civic problem here..."
              className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />

            <button
              type="submit"
              disabled={status === 'thinking' || status === 'coordinating'}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </form>
        )}

        {/* Uploaded Image Preview Tag */}
        {uploadedImage && (
          <div className="mb-4 flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-200 max-w-sm text-left">
            <img
              src={uploadedImage}
              alt="Hazard upload"
              className="w-12 h-12 object-cover rounded-lg"
            />
            <div className="flex-1 text-xs">
              <span className="font-semibold text-slate-800">Incident Photo Attached</span>
              <p className="text-[10px] text-slate-500 truncate">Multimodal Gemini evidence</p>
            </div>
            <button
              type="button"
              onClick={() => setUploadedImage(null)}
              className="text-xs text-rose-600 hover:underline px-2 font-medium"
            >
              Remove
            </button>
          </div>
        )}

        {/* Quick Presets Section */}
        <div className="pt-4 border-t border-slate-200 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
              Quick Voice Presets (குரல் முன்னமைவுகள்):
            </span>
            <button
              type="button"
              onClick={handleInspectSampleIncident}
              className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-lg flex items-center gap-1 self-start sm:self-auto transition-colors shadow-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Inspect Completion Agent (வேலை நிறைவு சரிபார்ப்பு)</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  soundFx.playSignalReceived();
                  simulateVoiceInput(p.text, p.lang, uploadedImage || undefined);
                }}
                className="text-left p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800 group-hover:text-indigo-700">
                    {p.title}
                  </span>
                  <span className="text-[9px] font-mono text-slate-500 uppercase px-1.5 py-0.2 rounded bg-white border border-slate-200">
                    {p.lang}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                  "{p.text}"
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dedicated Autonomous Work Completion & Resolution Inspector Agent */}
      {activeIncident && (
        <div className="mt-8 text-left animate-fade-in">
          <WorkCompletionAgent
            incident={activeIncident}
            onWorkCompleted={(id) => {
              onIncidentCreated?.(id);
            }}
            onOpenDashboard={onOpenDashboard}
          />
        </div>
      )}
    </div>
  );
};
