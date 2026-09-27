/**
 * BharatPulse Voice Playback Utility
 * Audio playback for confirmed municipal dispatches and demo steps
 */

export async function speakConfirmedText(text: string, language = 'en'): Promise<void> {
  if (!text) return;
  stopSpeaking();

  try {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      const lang = (language || 'en').toLowerCase();
      utterance.lang = lang === 'hi' ? 'hi-IN' : lang === 'kn' ? 'kn-IN' : lang === 'ta' ? 'ta-IN' : lang === 'te' ? 'te-IN' : lang === 'bn' ? 'bn-IN' : 'en-IN';
      window.speechSynthesis.speak(utterance);
    }
  } catch (err) {
    console.warn('Voice playback notice:', err);
  }
}

export function stopSpeaking(): void {
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (_) {}
  }
}
