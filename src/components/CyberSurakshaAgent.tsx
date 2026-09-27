import React, { useState, useEffect } from 'react';
import { ShieldAlert, Mic, MicOff, Volume2, VolumeX, Send, Sparkles, AlertCircle, HelpCircle, PhoneCall } from 'lucide-react';
import { api } from '../lib/api';
import { CyberScanResult } from '../../shared/types';
import { soundFx } from '../lib/soundFx';

interface CyberSurakshaAgentProps {
  currentScan: CyberScanResult | null;
  onSelectPrompt?: (text: string) => void;
  isDarkMode?: boolean;
}

export const CyberSurakshaAgent: React.FC<CyberSurakshaAgentProps> = ({
  currentScan,
  isDarkMode = false,
}) => {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'agent'; text: string; time: string }>>([
    {
      sender: 'agent',
      text: 'Namaste! I am Cyber Suraksha Agent (साइबर सुरक्षा). Received a suspicious SMS, WhatsApp link, or urgent notification? Ask me below or select a quick question.',
      time: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);

  // Quick preset questions required by brief
  const quickQuestions = [
    'Is this link suspicious?',
    'I received this through WhatsApp.',
    'Why was this website flagged?',
    'What should I do if I already clicked it?',
    'How can I report this?',
  ];

  // Speech synthesis
  const speakText = (text: string) => {
    if (!speechEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isThinking) return;

    setInputText('');
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [...prev, { sender: 'user', text, time: now }]);
    setIsThinking(true);
    soundFx.playSignalReceived();

    try {
      const res = await api.chatCyberAgent(text, currentScan);
      const reply = res.reply;
      setMessages((prev) => [...prev, { sender: 'agent', text: reply, time: 'Just now' }]);
      soundFx.playActionConfirmed();
      speakText(reply);
    } catch (err: any) {
      const fallbackReply =
        'Please proceed with extreme caution. Do not enter passwords, OTPs, or UPI PINs. If you shared any financial information, dial 1930 immediately.';
      setMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: fallbackReply,
          time: 'Just now',
        },
      ]);
      speakText(fallbackReply);
    } finally {
      setIsThinking(false);
    }
  };

  // Microphone speech recognition
  const toggleListening = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const spokenText = event.results[0][0].transcript;
        setIsListening(false);
        if (spokenText) {
          handleSendMessage(spokenText);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.warn('Speech recognition start failed:', e);
      setIsListening(false);
    }
  };

  return (
    <div
      className={`rounded-2xl border transition-colors flex flex-col h-full ${
        isDarkMode
          ? 'bg-slate-900/90 border-slate-800 text-slate-100 shadow-xl'
          : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}
    >
      {/* Header */}
      <div
        className={`p-4 border-b flex items-center justify-between ${
          isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50/50'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold tracking-tight">Cyber Suraksha Agent</h3>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold border border-cyan-500/20">
                AI DEFENDER
              </span>
            </div>
            <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Autonomous Civic Cybersecurity Advisor
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (speechEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
              window.speechSynthesis.cancel();
            }
            setSpeechEnabled(!speechEnabled);
          }}
          className={`p-2 rounded-lg border text-xs transition-colors ${
            speechEnabled
              ? isDarkMode
                ? 'bg-cyan-950/60 border-cyan-700/60 text-cyan-400'
                : 'bg-indigo-50 border-indigo-200 text-indigo-700'
              : isDarkMode
              ? 'bg-slate-800 border-slate-700 text-slate-400'
              : 'bg-slate-100 border-slate-200 text-slate-400'
          }`}
          title={speechEnabled ? 'Mute Speech Readback' : 'Enable Speech Readback'}
        >
          {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Quick Prompts Carousel */}
      <div
        className={`p-3 border-b text-xs flex gap-1.5 overflow-x-auto no-scrollbar ${
          isDarkMode ? 'border-slate-800 bg-slate-950/30' : 'border-slate-100 bg-slate-50/40'
        }`}
      >
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(q)}
            className={`whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-medium transition-all shrink-0 ${
              isDarkMode
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs'
            }`}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[360px] text-xs">
        {messages.map((m, idx) => {
          const isAgent = m.sender === 'agent';
          return (
            <div
              key={idx}
              className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                  isAgent
                    ? isDarkMode
                      ? 'bg-slate-800 text-slate-100 border border-slate-700/80 rounded-tl-xs'
                      : 'bg-indigo-50/70 text-slate-900 border border-indigo-100 rounded-tl-xs'
                    : isDarkMode
                    ? 'bg-indigo-600 text-white rounded-tr-xs'
                    : 'bg-indigo-600 text-white rounded-tr-xs shadow-xs'
                }`}
              >
                {m.text}
              </div>
              <span className={`text-[10px] mt-1 px-1 font-mono ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                {m.time}
              </span>
            </div>
          );
        })}

        {isThinking && (
          <div className="flex items-center gap-2 text-indigo-500 animate-pulse text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cyber Suraksha analyzing guidance...</span>
          </div>
        )}
      </div>

      {/* Emergency Helpline Banner */}
      <div
        className={`mx-4 mb-2 p-2.5 rounded-xl border flex items-center justify-between text-xs ${
          isDarkMode
            ? 'bg-rose-950/30 border-rose-900/50 text-rose-300'
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}
      >
        <div className="flex items-center gap-2">
          <PhoneCall className="w-3.5 h-3.5 text-rose-500 shrink-0" />
          <span className="font-semibold text-[11px]">National Cyber Crime Helpline:</span>
        </div>
        <span className="font-mono font-extrabold text-sm text-rose-600 dark:text-rose-400">
          1930
        </span>
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className={`p-3 border-t flex items-center gap-2 ${
          isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50/50'
        }`}
      >
        <button
          type="button"
          onClick={toggleListening}
          className={`p-2.5 rounded-xl transition-all ${
            isListening
              ? 'bg-rose-600 text-white animate-pulse'
              : isDarkMode
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
          title={isListening ? 'Listening... click to stop' : 'Speak your question'}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask Cyber Suraksha Agent..."
          className={`flex-1 text-xs px-3.5 py-2.5 rounded-xl border transition-colors outline-hidden focus:ring-2 focus:ring-indigo-500/20 ${
            isDarkMode
              ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-indigo-400'
              : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500'
          }`}
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isThinking}
          className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white transition-all shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
