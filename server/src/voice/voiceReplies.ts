/**
 * BharatPulse Confirmed Voice Responses for Indian Citizens
 * Supports English, Hindi, Kannada, Tamil, Telugu, and Bengali
 */

export function generateVoiceReply(
  language: string,
  incidentId: string,
  teamName: string,
  etaMinutes: number
): string {
  const lang = (language || 'en').toLowerCase();

  switch (lang) {
    case 'hi':
      return `मैंने घटना ${incidentId} दर्ज कर ली है। पास की ${teamName} टीम को तैनात किया गया है। उनके पहुँचने का अनुमानित समय ${etaMinutes} मिनट है।`;
    case 'kn':
      return `ನಾನು ಘಟನೆ ${incidentId} ಅನ್ನು ನೋಂದಾಯಿಸಿದ್ದೇನೆ. ಹತ್ತಿರದ ${teamName} ತಂಡವನ್ನು ನಿಯೋಜಿಸಲಾಗಿದೆ. ಅವರ ಆಗಮನದ ಅಂದಾಜು ಸಮಯ ${etaMinutes} ನಿಮಿಷಗಳು.`;
    case 'ta':
      return `நான் ${incidentId} சம்பவத்தை பதிவு செய்துள்ளேன். அருகிலுள்ள ${teamName} குழு நியமிக்கப்பட்டுள்ளது. அவர்கள் வர தோராயமாக ${etaMinutes} நிமிடங்கள் ஆகும்.`;
    case 'te':
      return `నేను సంఘటన ${incidentId} ని నమోదు చేసాను. సమీపంలోని ${teamName} బృందం కేటాయించబడింది. వారు రావడానికి అంచనా వేసిన సమయం ${etaMinutes} నిమిషాలు.`;
    case 'bn':
      return `আমি ঘটনা ${incidentId} নিবন্ধন করেছি। নিকটস্থ ${teamName} দলকে দায়িত্ব দেওয়া হয়েছে। পৌঁছানোর আনুমানিক সময় ${etaMinutes} মিনিট।`;
    case 'en':
    default:
      return `I've created incident ${incidentId}. A nearby ${teamName} has been assigned. Their estimated arrival time is ${etaMinutes} minutes.`;
  }
}
