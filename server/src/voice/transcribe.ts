import { getGeminiClient, GEMINI_MODEL } from '../agent/gemini';

/**
 * Transcribes audio base64 input using Gemini's native multimodal audio capabilities.
 * Supports English, Hindi, Kannada, Tamil, Telugu, and other regional Indian languages.
 */
export async function transcribeAudio(
  audioBase64: string,
  mimeType = 'audio/webm',
  languageHint = 'en'
): Promise<string> {
  const gemini = getGeminiClient();
  if (!gemini) {
    console.warn('Gemini client unavailable for audio transcription');
    return '';
  }

  // Strip potential data URL prefix
  const cleanBase64 = audioBase64.replace(/^data:audio\/[a-zA-Z0-9.-]+;base64,/, '');

  // 1. Try gemini-3.5-transcribe first (recommended specialized transcription model)
  try {
    const response = await gemini.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: [
        {
          inlineData: {
            mimeType: mimeType || 'audio/webm',
            data: cleanBase64,
          },
        },
        `You are the municipal voice transcription engine for BharatPulse AI (India's AI Operating System for Future Cities). 
The citizen is reporting an urgent civic problem, infrastructure hazard, or city emergency in Bengaluru, India.
The spoken language is likely ${languageHint} or Indian English, Hindi, Kannada, Tamil, Telugu, or Bengali.
Accurately transcribe the citizen's spoken words verbatim.
Return ONLY the raw transcribed text. Do NOT add conversational replies, markdown, quotes, notes, or timestamps.
If only background noise or silence is present, return an empty string.`,
      ],
    });

    const transcribed = response.text?.trim() || '';
    if (transcribed) {
      return transcribed;
    }
  } catch (err: any) {
    console.warn('gemini-3.5-transcribe notice:', err?.message || err);
  }

  // 2. Fall back to GEMINI_MODEL (gemini-3.8-flash)
  try {
    const response = await gemini.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          inlineData: {
            mimeType: mimeType || 'audio/webm',
            data: cleanBase64,
          },
        },
        `Listen carefully to this civic voice report from an Indian citizen and transcribe the speech into text. 
Return ONLY the exact spoken transcription. If nothing understandable was spoken, return empty text.`,
      ],
    });

    return response.text?.trim() || '';
  } catch (err: any) {
    console.error('Audio transcription fallback also failed:', err?.message || err);
    return '';
  }
}
