import { useCallback } from 'react';
import { useGeminiLive, GeminiLiveStatus, ChatMessage } from './useGeminiLive';
import { SupportedLanguage } from '../../shared/types';

export type VoiceAgentStatus = GeminiLiveStatus;
export type { ChatMessage };

export function useVoiceAgent() {
  const live = useGeminiLive();

  const startListening = useCallback(() => {
    live.connect();
  }, [live]);

  const stopListeningAndProcess = useCallback(
    async (manualText?: string, imageUrl?: string) => {
      if (manualText && manualText.trim()) {
        await live.submitText(manualText.trim(), imageUrl);
      } else {
        live.disconnect();
      }
    },
    [live]
  );

  const simulateVoiceInput = useCallback(
    async (text: string, lang: SupportedLanguage = 'en', imageUrl?: string) => {
      live.setSelectedLanguage(lang);
      await live.submitText(text, imageUrl);
    },
    [live]
  );

  return {
    status: live.status,
    isConnected: live.isConnected,
    transcript: live.transcript,
    setTranscript: live.setTranscript,
    responseMessage: live.responseMessage,
    selectedLanguage: live.selectedLanguage,
    setSelectedLanguage: live.setSelectedLanguage,
    incidentId: live.incidentId,
    conversation: live.conversation,
    audioLevel: live.audioLevel,
    errorMessage: live.errorMessage,
    recordingSeconds: live.recordingSeconds,
    startListening,
    stopListeningAndProcess,
    simulateVoiceInput,
    resetVoice: live.resetVoice,
    connect: live.connect,
    disconnect: live.disconnect,
  };
}
