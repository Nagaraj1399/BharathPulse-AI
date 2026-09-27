import { Router, Request, Response } from 'express';
import { analyzeSuspiciousLink } from '../cyber/cyberService';
import { executeN8nCyberWorkflow } from '../cyber/n8nWorkflow';
import { civicStore } from '../firebase/admin';
import { GoogleGenAI } from '@google/genai';

export const cyberRouter = Router();

// POST /api/cyber/scan
cyberRouter.post('/scan', async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string' || !url.trim()) {
      return res.status(400).json({ error: 'Please enter a valid link to scan.' });
    }

    const result = await analyzeSuspiciousLink(url);
    civicStore.recordCyberScan(result.riskLevel);
    res.json(result);
  } catch (error: any) {
    console.error('Cyber link verification error:', error);
    // Requirement 14: If the cybersecurity service/API is unavailable, show:
    // Link verification is temporarily unavailable. Do NOT incorrectly mark the URL as safe.
    res.status(500).json({
      error: 'Link verification is temporarily unavailable.',
      details: error.message || 'Threat intelligence service unreachable',
      retryAllowed: true,
      manualReportAllowed: true,
    });
  }
});

// POST /api/cyber/report
cyberRouter.post('/report', async (req: Request, res: Response) => {
  try {
    const { url, sanitizedUrl, domain, riskLevel, riskScore, flags, citizenNotes, clickedScenario } = req.body;

    if (!url && !domain) {
      return res.status(400).json({ error: 'URL or domain is required for incident report.' });
    }

    const report = await executeN8nCyberWorkflow({
      url: url || domain,
      sanitizedUrl: sanitizedUrl || domain,
      domain: domain || 'unknown-host',
      riskLevel: riskLevel || 'SUSPICIOUS',
      riskScore: typeof riskScore === 'number' ? riskScore : 50,
      flags: Array.isArray(flags) ? flags : [],
      citizenNotes,
      clickedScenario,
    });

    res.status(201).json(report);
  } catch (error: any) {
    console.error('n8n cyber report workflow error:', error);
    res.status(500).json({ error: error.message || 'Failed to dispatch cyber incident report' });
  }
});

// GET /api/cyber/stats
cyberRouter.get('/stats', (_req: Request, res: Response) => {
  res.json(civicStore.getCyberStats());
});

// POST /api/cyber/agent/chat - Cyber Suraksha Dedicated Voice / AI Agent
cyberRouter.post('/agent/chat', async (req: Request, res: Response) => {
  try {
    const { message, currentScan, language } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const userQuery = message.trim();
    const queryLower = userQuery.toLowerCase();

    // Context from currently analyzed URL if available
    let scanContext = '';
    if (currentScan) {
      scanContext = `\nCurrent URL Context:
Domain: ${currentScan.domain}
Risk Level: ${currentScan.riskLevel} (${currentScan.riskScore}/100)
Detected Flags: ${currentScan.flags?.join(', ')}
Summary: ${currentScan.summary}`;
    }

    // Default specialized responses based on common citizen situations
    let defaultResponse = '';

    if (queryLower.includes('whatsapp') || queryLower.includes('sms') || queryLower.includes('received this')) {
      defaultResponse =
        'Scammers widely use WhatsApp messages and SMS to distribute fraudulent links claiming prize winnings, electricity bill cancellations, free government recharge, or expired bank KYC. Official organizations never ask you to verify bank accounts or make payments through random links sent on WhatsApp. Do not forward or click on unfamiliar links.';
    } else if (queryLower.includes('why') && queryLower.includes('flagged')) {
      if (currentScan?.flags?.length) {
        defaultResponse = `This link was flagged due to key risk indicators: ${currentScan.flags.join(
          ', '
        )}. Legitimate organizations use their verified official portals. Fake addresses often use unusual domain extensions or misspelled names to deceive citizens.`;
      } else {
        defaultResponse =
          'Links are flagged when they exhibit suspicious signals such as imitating known banks or government portals, using raw IP addresses, concealing destinations through shorteners, or triggering malware warnings.';
      }
    } else if (queryLower.includes('already clicked') || queryLower.includes('clicked it')) {
      defaultResponse =
        'Stay calm. If you only viewed the page without entering anything, simply close the browser and clear your browsing history. However, if you entered a password, change it immediately from a different device. If you shared bank details, UPI PINs, or an OTP, call the 1930 Cyber Fraud Helpline immediately and freeze your card/account with your bank.';
    } else if (queryLower.includes('report') || queryLower.includes('how to report')) {
      defaultResponse =
        'You can click the "Report Cyber Incident" button right here in BharatPulse. Our integrated n8n automation will immediately generate an incident ticket, alert the Bengaluru Cyber Crime Rapid Cell (CID/CERT-In), and update the live municipal queue. You can also report cyber fraud at cybercrime.gov.in or call 1930.';
    } else if (queryLower.includes('suspicious') || queryLower.includes('safe') || queryLower.includes('is this link')) {
      if (currentScan) {
        defaultResponse = `Based on our threat scan, this link is classified as ${currentScan.riskLevel} with a risk score of ${currentScan.riskScore}/100. ${currentScan.summary} We recommend that you do not open it.`;
      } else {
        defaultResponse =
          'Paste the link into the URL input above and tap "Scan Link". Our scanner analyzes domain reputation, lookalike patterns, SSL certificates, and hidden redirect behavior without ever loading the site on your device.';
      }
    }

    // If Gemini API is available, generate empathetic, personalized citizen guidance
    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const systemPrompt = `You are "Cyber Suraksha Agent" (साइबर सुरक्षा), an authoritative yet reassuring civic cybersecurity voice advisor for citizens in India (BharatPulse AI).
Your mission:
- Guide citizens on suspicious links, phishing, WhatsApp/SMS scams, and digital safety.
- NEVER visit or instruct the citizen to open suspicious links.
- Emphasize safety: never share OTP, UPI PIN, passwords, or install AnyDesk/TeamViewer.
- Mention National Cyber Crime Helpline 1930 and Chakshu / cybercrime.gov.in when appropriate.
- If the citizen asks what to do if they already clicked, provide step-by-step triage without creating panic.
- Keep answers concise (2 to 4 sentences), clear, and free from heavy technical jargon.
- Respond in the requested language (default English, support Hindi/Kannada if requested).`;

        const prompt = `${scanContext}\nCitizen Question: "${userQuery}"\nLanguage: ${language || 'en'}`;

        const aiResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `${systemPrompt}\n\n${prompt}`,
        });

        const reply = aiResponse.text?.trim();
        if (reply) {
          return res.json({ reply });
        }
      } catch (err) {
        console.warn('Gemini cyber agent chat error (using rule fallback):', err);
      }
    }

    res.json({
      reply:
        defaultResponse ||
        'Cyber Suraksha Agent here. Please check any unfamiliar link with our scanner before opening it. Remember: Banks and government departments never ask for your passwords, OTP, or UPI PIN via SMS or WhatsApp. For urgent financial fraud assistance, call 1930 immediately.',
    });
  } catch (error: any) {
    console.error('Cyber agent error:', error);
    res.status(500).json({ error: error.message || 'Agent error' });
  }
});
