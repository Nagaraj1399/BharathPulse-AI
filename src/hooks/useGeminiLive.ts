import { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { api } from '../lib/api';
import { SupportedLanguage } from '../../shared/types';

export type GeminiLiveStatus =
  | 'idle'
  | 'connecting'
  | 'listening'
  | 'thinking'
  | 'coordinating'
  | 'speaking'
  | 'complete'
  | 'error';

export interface ChatMessage {
  id: string;
  sender: 'CITIZEN' | 'BHARATPULSE';
  text: string;
  timestamp: string;
  isPartial?: boolean;
}

export function useGeminiLive() {
  const [status, setStatus] = useState<GeminiLiveStatus>('idle');
  const [isConnected, setIsConnected] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0.2);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('en');
  const [incidentId, setIncidentId] = useState<string | null>(null);
  const [conversation, setConversation] = useState<ChatMessage[]>([]);
  const [transcript, setTranscript] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  // Refs for audio handling and Live session
  const liveSessionRef = useRef<any>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const micAudioCtxRef = useRef<AudioContext | null>(null);
  const micProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const nextPlaybackTimeRef = useRef<number>(0);
  const activeAudioSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const timerIntervalRef = useRef<any>(null);
  const isSpeakingRef = useRef<boolean>(false);
  const incidentIdRef = useRef<string | null>(null);
  const partialAssistantTextRef = useRef<string>('');
  const activeLangRef = useRef<SupportedLanguage>('en');
  const speechRecognitionRef = useRef<any>(null);

  incidentIdRef.current = incidentId;
  activeLangRef.current = selectedLanguage;

  // Stop output audio playback immediately (interruption/barge-in)
  const stopAudioPlayback = useCallback(() => {
    activeAudioSourcesRef.current.forEach((src) => {
      try {
        src.stop();
        src.disconnect();
      } catch (_) {}
    });
    activeAudioSourcesRef.current = [];
    if (outputAudioCtxRef.current && outputAudioCtxRef.current.state === 'running') {
      nextPlaybackTimeRef.current = outputAudioCtxRef.current.currentTime;
    }
    isSpeakingRef.current = false;
  }, []);

  // Stop all microphone streams and web audio nodes
  const stopMicrophoneResources = useCallback(() => {
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch (_) {}
      speechRecognitionRef.current = null;
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (micProcessorRef.current) {
      try {
        micProcessorRef.current.disconnect();
      } catch (_) {}
      micProcessorRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (_) {}
      });
      micStreamRef.current = null;
    }
    if (micAudioCtxRef.current && micAudioCtxRef.current.state !== 'closed') {
      try {
        micAudioCtxRef.current.close();
      } catch (_) {}
      micAudioCtxRef.current = null;
    }
  }, []);

  // Stop everything (disconnect)
  const disconnect = useCallback(() => {
    stopAudioPlayback();
    stopMicrophoneResources();

    if (outputAudioCtxRef.current && outputAudioCtxRef.current.state !== 'closed') {
      try {
        outputAudioCtxRef.current.close();
      } catch (_) {}
      outputAudioCtxRef.current = null;
    }

    if (liveSessionRef.current) {
      try {
        liveSessionRef.current.close();
      } catch (_) {}
      liveSessionRef.current = null;
    }

    setIsConnected(false);
    setStatus('idle');
    setAudioLevel(0.2);
    setRecordingSeconds(0);
  }, [stopAudioPlayback, stopMicrophoneResources]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  // Play a 24kHz PCM chunk received from Gemini Live
  const playPcmAudioChunk = useCallback(
    (base64Audio: string) => {
      try {
        // Initialize output AudioContext at 24000Hz (Gemini Live standard sample rate)
        if (!outputAudioCtxRef.current || outputAudioCtxRef.current.state === 'closed') {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          outputAudioCtxRef.current = new AudioContextClass({ sampleRate: 24000 });
          nextPlaybackTimeRef.current = outputAudioCtxRef.current.currentTime;
        }

        const ctx = outputAudioCtxRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }

        // Decode base64 to binary
        const binaryString = atob(base64Audio);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        // 16-bit signed PCM
        const pcm16 = new Int16Array(bytes.buffer);
        const float32 = new Float32Array(pcm16.length);
        for (let i = 0; i < pcm16.length; i++) {
          float32[i] = pcm16[i] / (pcm16[i] < 0 ? 0x8000 : 0x7fff);
        }

        const audioBuffer = ctx.createBuffer(1, float32.length, 24000);
        audioBuffer.copyToChannel(float32, 0);

        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);

        const now = ctx.currentTime;
        const startTime = Math.max(now, nextPlaybackTimeRef.current);
        source.start(startTime);
        nextPlaybackTimeRef.current = startTime + audioBuffer.duration;

        activeAudioSourcesRef.current.push(source);
        isSpeakingRef.current = true;
        setStatus('speaking');

        source.onended = () => {
          const index = activeAudioSourcesRef.current.indexOf(source);
          if (index !== -1) {
            activeAudioSourcesRef.current.splice(index, 1);
          }
          if (activeAudioSourcesRef.current.length === 0) {
            isSpeakingRef.current = false;
            setStatus((prev) => (prev === 'speaking' ? 'listening' : prev));
          }
        };
      } catch (err) {
        console.warn('PCM audio playback notice:', err);
      }
    },
    []
  );

  // Connect to Gemini Live API via backend ephemeral token
  const connect = useCallback(async () => {
    disconnect();
    setErrorMessage(null);
    setStatus('connecting');

    try {
      // 1. Request short-lived ephemeral token from BharatPulse backend
      const tokenData = await api.getLiveToken();
      if (!tokenData || !tokenData.token) {
        throw new Error('Backend failed to issue a valid Gemini Live ephemeral token.');
      }

      // 2. Request user microphone permission
      let stream: MediaStream | null = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            sampleRate: 16000,
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        micStreamRef.current = stream;
      } catch (micErr: any) {
        setStatus('error');
        setErrorMessage(
          'Microphone permission denied. Please allow microphone access or continue by typing your report below.'
        );
        return;
      }

      // 3. Connect to Gemini Live using @google/genai SDK with the ephemeral token
      const ai = new GoogleGenAI({
        apiKey: tokenData.token,
        httpOptions: { apiVersion: 'v1alpha' },
      });

      const lang = activeLangRef.current;
      const langInstruction =
        lang === 'hi'
          ? 'Respond in Hindi.'
          : lang === 'kn'
          ? 'Respond in Kannada.'
          : lang === 'ta'
          ? 'Respond in Tamil.'
          : lang === 'te'
          ? 'Respond in Telugu.'
          : lang === 'bn'
          ? 'Respond in Bengali.'
          : 'Respond in Indian English.';

      const session = await ai.live.connect({
        model: 'gemini-3.8-live',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Aoede' },
            },
          },
          systemInstruction: `${tokenData.systemInstruction}\n${langInstruction}`,
          tools: [{ functionDeclarations: tokenData.tools || [] }],
        },
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            setStatus('listening');
          },
          onmessage: async (message: any) => {
            // A. Interruption detection (barge-in): User started speaking
            if (message.serverContent?.interrupted) {
              stopAudioPlayback();
              setStatus('listening');
              return;
            }

            // B. Tool Call execution: Gemini requests backend operational action
            if (message.toolCall && message.toolCall.functionCalls) {
              setStatus('coordinating');
              const functionResponses: any[] = [];

              for (const call of message.toolCall.functionCalls) {
                try {
                  const execResult = await api.liveExecuteTool(
                    call.name,
                    call.args || {},
                    incidentIdRef.current || undefined
                  );

                  const resOutput = execResult.result || {};

                  // If an incident was created or returned, update state
                  if (resOutput.incidentId) {
                    setIncidentId(resOutput.incidentId);
                    incidentIdRef.current = resOutput.incidentId;
                  }

                  functionResponses.push({
                    id: call.id,
                    name: call.name,
                    response: { output: resOutput },
                  });
                } catch (tErr: any) {
                  functionResponses.push({
                    id: call.id,
                    name: call.name,
                    response: { output: { error: tErr.message || 'Tool execution failed' } },
                  });
                }
              }

              // Return confirmed structured results back to Gemini Live
              if (functionResponses.length > 0 && liveSessionRef.current) {
                try {
                  liveSessionRef.current.sendToolResponse({ functionResponses });
                } catch (err) {
                  console.warn('Error sending tool response to Live session:', err);
                }
              }
            }

            // C. Native Model Audio Turn & Transcripts
            if (message.serverContent?.modelTurn?.parts) {
              for (const part of message.serverContent.modelTurn.parts) {
                // Audio chunk
                if (part.inlineData?.data) {
                  playPcmAudioChunk(part.inlineData.data);
                }
                // Text transcript
                if (part.text) {
                  partialAssistantTextRef.current += part.text;
                  setResponseMessage(partialAssistantTextRef.current);
                }
              }
            }

            // D. Turn completed
            if (message.serverContent?.turnComplete) {
              if (partialAssistantTextRef.current) {
                const text = partialAssistantTextRef.current.trim();
                setConversation((prev) => [
                  ...prev,
                  {
                    id: `asst-${Date.now()}`,
                    sender: 'BHARATPULSE',
                    text,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  },
                ]);
                partialAssistantTextRef.current = '';
              }
              setStatus('complete');
              // Settle back to listening for follow-ups
              setTimeout(() => {
                setStatus((current) => (current === 'complete' ? 'listening' : current));
              }, 1800);
            }
          },
          onerror: (err: any) => {
            console.error('Gemini Live WebSocket error:', err);
            setErrorMessage('Gemini Live session interrupted. You can continue speaking or report via text.');
            setStatus('error');
          },
          onclose: () => {
            setIsConnected(false);
            setStatus('idle');
          },
        },
      });

      liveSessionRef.current = session;
      setIsConnected(true);
      setStatus('listening');

      // 4. Setup 16kHz PCM audio capture and streaming to Gemini Live
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const micAudioCtx = new AudioContextClass({ sampleRate: 16000 });
      micAudioCtxRef.current = micAudioCtx;

      const source = micAudioCtx.createMediaStreamSource(stream);
      // ScriptProcessor captures raw Float32Array PCM at 16kHz
      const processor = micAudioCtx.createScriptProcessor(4096, 1, 1);
      micProcessorRef.current = processor;

      const startTime = Date.now();
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds(Math.floor((Date.now() - startTime) / 1000));
      }, 500);

      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);

        // Calculate audio RMS level for VoiceOrb visualizer
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
          sum += inputData[i] * inputData[i];
        }
        const rms = Math.sqrt(sum / inputData.length);
        setAudioLevel(Math.min(1, Math.max(0.1, rms * 5)));

        // If user is speaking loudly while audio is playing, interrupt playback (barge-in)
        if (rms > 0.06 && isSpeakingRef.current) {
          stopAudioPlayback();
          setStatus('listening');
        }

        // Convert Float32Array to 16-bit PCM (Int16Array)
        const pcm16 = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]));
          pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }

        // Encode Int16Array buffer to Base64
        let binary = '';
        const bytes = new Uint8Array(pcm16.buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64Audio = btoa(binary);

        // Stream audio continuously to Gemini Live
        if (liveSessionRef.current) {
          try {
            liveSessionRef.current.sendRealtimeInput({
              audio: {
                data: base64Audio,
                mimeType: 'audio/pcm;rate=16000',
              },
            });
          } catch (streamErr) {
            console.warn('Realtime audio send notice:', streamErr);
          }
        }
      };

      source.connect(processor);
      processor.connect(micAudioCtx.destination);

      // 5. Browser speech transcription for live citizen display
      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognitionClass) {
        try {
          const recognition = new SpeechRecognitionClass();
          recognition.continuous = true;
          recognition.interimResults = true;
          const langCode = activeLangRef.current;
          recognition.lang =
            langCode === 'hi'
              ? 'hi-IN'
              : langCode === 'kn'
              ? 'kn-IN'
              : langCode === 'ta'
              ? 'ta-IN'
              : langCode === 'te'
              ? 'te-IN'
              : langCode === 'bn'
              ? 'bn-IN'
              : 'en-IN';

          recognition.onresult = (event: any) => {
            let interim = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
              const text = event.results[i][0].transcript;
              if (event.results[i].isFinal) {
                const trimmed = text.trim();
                if (trimmed) {
                  setTranscript(trimmed);
                  setConversation((prev) => {
                    if (
                      prev.length > 0 &&
                      prev[prev.length - 1].sender === 'CITIZEN' &&
                      prev[prev.length - 1].text === trimmed
                    ) {
                      return prev;
                    }
                    return [
                      ...prev,
                      {
                        id: `citizen-${Date.now()}`,
                        sender: 'CITIZEN',
                        text: trimmed,
                        timestamp: new Date().toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        }),
                      },
                    ];
                  });
                }
              } else {
                interim += text;
              }
            }
            if (interim) {
              setTranscript(interim);
            }
          };

          recognition.onerror = () => {};
          recognition.start();
          speechRecognitionRef.current = recognition;
        } catch (_) {}
      }
    } catch (err: any) {
      console.error('Failed to establish Gemini Live session:', err);
      setStatus('error');
      setErrorMessage(
        err.message || 'Voice temporarily unavailable. You can continue by typing your report below.'
      );
    }
  }, [disconnect, playPcmAudioChunk, stopAudioPlayback]);

  // Fallback text submit or quick prompt submission
  const submitText = useCallback(
    async (text: string, imageUrl?: string) => {
      const cleanText = text.trim();
      if (!cleanText) return;

      setTranscript(cleanText);
      setConversation((prev) => [
        ...prev,
        {
          id: `citizen-${Date.now()}`,
          sender: 'CITIZEN',
          text: cleanText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);

      setStatus('thinking');
      try {
        const result = await api.voiceCreateIncident({
          description: cleanText,
          latitude: 12.9782,
          longitude: 77.6415,
          language: selectedLanguage,
          imageUrl,
          address: 'Near Indiranagar Government High School, 100ft Rd, Bengaluru',
        });

        if (result.incidentId) {
          setIncidentId(result.incidentId);
        }

        setResponseMessage(result.message);
        setConversation((prev) => [
          ...prev,
          {
            id: `asst-${Date.now()}`,
            sender: 'BHARATPULSE',
            text: result.message,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);

        setStatus('complete');
      } catch (err: any) {
        console.error('Text report submission error:', err);
        setErrorMessage('Failed to register report. Please retry.');
        setStatus('error');
      }
    },
    [selectedLanguage]
  );

  const resetVoice = useCallback(() => {
    disconnect();
    setTranscript('');
    setResponseMessage('');
    setIncidentId(null);
    setConversation([]);
    setErrorMessage(null);
  }, [disconnect]);

  return {
    status,
    isConnected,
    audioLevel,
    recordingSeconds,
    errorMessage,
    selectedLanguage,
    setSelectedLanguage,
    incidentId,
    conversation,
    transcript,
    setTranscript,
    responseMessage,
    connect,
    disconnect,
    submitText,
    resetVoice,
  };
}
