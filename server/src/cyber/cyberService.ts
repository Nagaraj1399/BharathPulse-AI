import { GoogleGenAI } from '@google/genai';
import { CyberScanResult, CyberRiskLevel, DetailedCyberReason } from '../../../shared/types';

// Trusted reputable domains
const KNOWN_LEGITIMATE_DOMAINS = new Set([
  'google.com',
  'google.co.in',
  'gov.in',
  'nic.in',
  'karnataka.gov.in',
  'bbmp.gov.in',
  'bescom.karnataka.gov.in',
  'bwssb.karnataka.gov.in',
  'incometax.gov.in',
  'uidai.gov.in',
  'sbi.co.in',
  'onlinesbi.sbi',
  'hdfcbank.com',
  'icicibank.com',
  'axisbank.com',
  'kotak.com',
  'pnbindia.in',
  'phonepe.com',
  'paytm.com',
  'amazon.in',
  'amazon.com',
  'flipkart.com',
  'wikipedia.org',
  'github.com',
  'microsoft.com',
  'apple.com',
  'bharatpulse.ai',
]);

// URL Shortener domains
const URL_SHORTENERS = new Set([
  'bit.ly',
  'tinyurl.com',
  't.co',
  'goo.gl',
  'is.gd',
  'buff.ly',
  'ow.ly',
  'cutt.ly',
  'rb.gy',
  'shorturl.at',
  'tiny.cc',
  'rebrand.ly',
  'v.gd',
  'bl.ink',
  'snip.ly',
]);

// High-risk and abuse-prone TLDs
const SUSPICIOUS_TLDS = new Set([
  'top',
  'xyz',
  'click',
  'buzz',
  'fit',
  'rest',
  'gq',
  'cf',
  'ml',
  'tk',
  'ga',
  'work',
  'icu',
  'loan',
  'surf',
  'monster',
  'quest',
  'live',
  'shop',
  'bar',
  'link',
  'cfd',
  'sbs',
  'download',
  'racing',
  'country',
  'stream',
]);

// Target brand indicators
interface BrandProfile {
  name: string;
  category: string;
  keywords: string[];
  legitDomains: string[];
}

const MONITORED_BRANDS: BrandProfile[] = [
  {
    name: 'State Bank of India (SBI)',
    category: 'Banking',
    keywords: ['sbi', 'onlinesbi', 'statebank'],
    legitDomains: ['sbi.co.in', 'onlinesbi.sbi'],
  },
  {
    name: 'HDFC Bank',
    category: 'Banking',
    keywords: ['hdfc', 'hdfcbank'],
    legitDomains: ['hdfcbank.com'],
  },
  {
    name: 'ICICI Bank',
    category: 'Banking',
    keywords: ['icici', 'icicibank'],
    legitDomains: ['icicibank.com'],
  },
  {
    name: 'Income Tax Department (e-Filing)',
    category: 'Government & Tax',
    keywords: ['incometax', 'efiling', 'itr-refund'],
    legitDomains: ['incometax.gov.in'],
  },
  {
    name: 'Aadhaar (UIDAI)',
    category: 'Government ID',
    keywords: ['uidai', 'aadhaar', 'eaadhaar'],
    legitDomains: ['uidai.gov.in'],
  },
  {
    name: 'India Post',
    category: 'Postal & Delivery',
    keywords: ['indiapost', 'post-office', 'postal-tracking'],
    legitDomains: ['indiapost.gov.in'],
  },
  {
    name: 'PhonePe',
    category: 'UPI & Payments',
    keywords: ['phonepe'],
    legitDomains: ['phonepe.com'],
  },
  {
    name: 'Paytm',
    category: 'UPI & Payments',
    keywords: ['paytm'],
    legitDomains: ['paytm.com'],
  },
  {
    name: 'Google Pay',
    category: 'UPI & Payments',
    keywords: ['gpay', 'googlepay'],
    legitDomains: ['pay.google.com', 'google.com'],
  },
  {
    name: 'Amazon India',
    category: 'E-Commerce',
    keywords: ['amazon'],
    legitDomains: ['amazon.in', 'amazon.com'],
  },
  {
    name: 'Flipkart',
    category: 'E-Commerce',
    keywords: ['flipkart'],
    legitDomains: ['flipkart.com'],
  },
  {
    name: 'BBMP / Bengaluru Civic Services',
    category: 'Civic Utility',
    keywords: ['bbmp', 'bengaluru-tax'],
    legitDomains: ['bbmp.gov.in'],
  },
  {
    name: 'BESCOM Electricity Board',
    category: 'Civic Utility',
    keywords: ['bescom'],
    legitDomains: ['bescom.karnataka.gov.in'],
  },
  {
    name: 'WhatsApp',
    category: 'Social Messaging',
    keywords: ['whatsapp'],
    legitDomains: ['whatsapp.com', 'wa.me'],
  },
];

// Dangerous file extensions
const MALWARE_EXTENSIONS = ['.apk', '.exe', '.scr', '.bat', '.vbs', '.iso', '.zip', '.jar', '.cmd', '.msi'];

// Suspicious URL keywords
const SUSPICIOUS_KEYWORDS = [
  'kyc',
  'verify',
  'login',
  'account-update',
  'reward',
  'lottery',
  'free-recharge',
  'claim-refund',
  'bill-discount',
  'urgent-notice',
  'pan-link',
  'aadhaar-link',
  'sim-block',
  'power-cut',
  'security-alert',
  'otp',
  'bonus',
];

export async function analyzeSuspiciousLink(rawUrl: string): Promise<CyberScanResult> {
  // Input sanitization: Trim, prevent script injection, strip control chars
  const sanitizedInput = rawUrl.trim().replace(/[\x00-\x1F\x7F<>"]/g, '');
  if (!sanitizedInput) {
    throw new Error('Please enter a valid link to scan.');
  }

  // Parse URL safely without performing any HTTP fetch or navigation
  let parsedUrl: URL;
  let normalizedInput = sanitizedInput;
  if (!/^https?:\/\//i.test(normalizedInput)) {
    // If citizen entered e.g. "sbi-kyc.top/login", prepend https for URL parser
    normalizedInput = `http://${normalizedInput}`;
  }

  try {
    parsedUrl = new URL(normalizedInput);
  } catch {
    throw new Error('Invalid URL format. Please check the website address.');
  }

  const hostname = parsedUrl.hostname.toLowerCase();
  const protocol = parsedUrl.protocol.toLowerCase();
  const pathname = parsedUrl.pathname.toLowerCase();
  const search = parsedUrl.search.toLowerCase();
  const fullHref = parsedUrl.href;

  // Defanged URL representation for safe visual display
  const defangedUrl = fullHref
    .replace(/^http:\/\//, 'hxxp://')
    .replace(/^https:\/\//, 'hxxps://')
    .replace(/\./g, '[.]');

  const detailedReasons: DetailedCyberReason[] = [];
  const flags: string[] = [];
  let calculatedScore = 0; // 0 to 100

  // 1. IP Address Check
  const isIpAddress = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) || hostname.startsWith('[');
  if (isIpAddress) {
    calculatedScore += 45;
    flags.push('IP address host');
    detailedReasons.push({
      title: 'Raw IP address instead of registered domain',
      description:
        'The link points to a numerical IP address instead of a recognized organization domain name. Legitimate public services use registered domain names.',
      severity: 'high',
    });
  }

  // 2. URL Shortener Check
  const isUrlShortener = URL_SHORTENERS.has(hostname);
  if (isUrlShortener) {
    calculatedScore += 25;
    flags.push('URL shortener detected');
    detailedReasons.push({
      title: 'URL shortener detected',
      description:
        'This link uses a shortening service that conceals the true final destination website. Phishing campaigns often use shorteners to mask fake portals.',
      severity: 'medium',
    });
  }

  // 3. TLD Analysis
  const domainParts = hostname.split('.');
  const tld = domainParts.length > 1 ? domainParts[domainParts.length - 1] : '';
  const suspiciousTld = SUSPICIOUS_TLDS.has(tld);
  if (suspiciousTld) {
    calculatedScore += 30;
    flags.push(`Suspicious high-abuse domain extension (.${tld})`);
    detailedReasons.push({
      title: `Suspicious domain extension (.${tld})`,
      description: `The website uses a .${tld} top-level domain. These extensions have low registration fees and are frequently observed in automated smishing and phishing campaigns.`,
      severity: 'medium',
    });
  }

  // 4. Brand Impersonation / Lookalike Analysis
  let brandImpersonation: { detected: boolean; brandName?: string; details?: string } | undefined = undefined;

  for (const brand of MONITORED_BRANDS) {
    const isLegit = brand.legitDomains.some((legit) => hostname === legit || hostname.endsWith(`.${legit}`));
    if (isLegit) continue;

    // Check if brand keyword is inside an unofficial domain
    const hasKeyword = brand.keywords.some((kw) => hostname.includes(kw));
    if (hasKeyword) {
      const details = `The address resembles ${brand.name} (${brand.category}), but does not use the official verified domain (${brand.legitDomains.join(', ')}). Attackers often construct such lookalikes to capture confidential credentials.`;
      brandImpersonation = {
        detected: true,
        brandName: brand.name,
        details,
      };
      calculatedScore += 45;
      flags.push(`Possible ${brand.name} Impersonation`);
      detailedReasons.push({
        title: `Possible Brand Impersonation: ${brand.name}`,
        description: details,
        severity: 'high',
      });
      break;
    }
  }

  // 5. Suspicious Subdomain Stacking
  // e.g. sbi.verify.account-login.com
  const suspiciousSubdomains = domainParts.length > 3 && !hostname.endsWith('.gov.in');
  if (suspiciousSubdomains) {
    calculatedScore += 20;
    flags.push('Excessive subdomain stacking');
    detailedReasons.push({
      title: 'Complex multi-level subdomain',
      description:
        'The link uses multiple subdomain layers. Fraudulent links often insert well-known words as subdomains to distract citizens from the real host domain.',
      severity: 'medium',
    });
  }

  // 6. Suspicious Keyword Indicators in Domain or Path
  const combinedText = `${hostname} ${pathname} ${search}`.toLowerCase();
  const matchedKeywords = SUSPICIOUS_KEYWORDS.filter((kw) => combinedText.includes(kw));
  const suspiciousKeywords = matchedKeywords.length > 0;
  if (suspiciousKeywords) {
    const points = Math.min(30, matchedKeywords.length * 15);
    calculatedScore += points;
    flags.push(`Urgency / credential keyword detected: ${matchedKeywords.slice(0, 3).join(', ')}`);
    detailedReasons.push({
      title: 'High-risk civic/banking keywords detected',
      description: `The link contains terms (${matchedKeywords.join(', ')}) commonly used in social engineering scams to induce panic (e.g. KYC expiration, electric disconnection, instant lottery).`,
      severity: 'medium',
    });
  }

  // 7. Malware Download Extension
  const malwareIndicators = MALWARE_EXTENSIONS.some((ext) => pathname.endsWith(ext) || search.includes(ext));
  if (malwareIndicators) {
    calculatedScore += 55;
    flags.push('Direct executable or package download (.apk/.exe)');
    detailedReasons.push({
      title: 'Potential harmful app/executable download',
      description:
        'The link points directly to an installable package or script file. Cyber criminals often use fake APK links to install remote-access trojans on citizen smartphones.',
      severity: 'high',
    });
  }

  // 8. Homoglyphs & Punycode & Hyphen Flood
  const hasHomoglyphs = hostname.startsWith('xn--') || fullHref.includes('@');
  const hyphenCount = (hostname.match(/-/g) || []).length;
  if (hasHomoglyphs) {
    calculatedScore += 40;
    flags.push('Punycode / Homoglyph deceptive character pattern');
    detailedReasons.push({
      title: 'Internationalized homoglyph / deceptive character pattern',
      description:
        'The web address contains internationalized character sets or an embedded credentials marker (@). Attackers use visually identical letters (e.g., Cyrillic "а" instead of Latin "a") to deceive viewers.',
      severity: 'high',
    });
  } else if (hyphenCount >= 3) {
    calculatedScore += 20;
    flags.push('Excessive hyphens in domain name');
    detailedReasons.push({
      title: 'Hyphen-stuffed domain name',
      description:
        'The domain contains multiple hyphens stringing together legitimate service names, typical of throwaway scam domains.',
      severity: 'medium',
    });
  }

  // 9. Excessive Length
  const excessiveLength = fullHref.length > 110;
  if (excessiveLength) {
    calculatedScore += 15;
    flags.push('Unusually long URL structure');
    detailedReasons.push({
      title: 'Unusually long URL structure',
      description:
        'The URL is excessively long and contains obfuscated query parameters often used to conceal session tracking or exploit payloads.',
      severity: 'low',
    });
  }

  // 10. HTTPS Status Check
  const hasHttps = protocol === 'https:';
  if (!hasHttps) {
    calculatedScore += 25;
    flags.push('Unencrypted connection (HTTP only)');
    detailedReasons.push({
      title: 'Unencrypted HTTP protocol',
      description:
        'This website does not use HTTPS encryption. Any information submitted on this page can be intercepted by third parties.',
      severity: 'medium',
    });
  } else {
    // Note for HTTPS
    detailedReasons.push({
      title: 'HTTPS is present (Security Note)',
      description:
        'While HTTPS encrypts transmission, it does NOT prove the website is genuine or safe. Threat actors routinely configure free SSL certificates on phishing domains.',
      severity: 'low',
    });
  }

  // Check if known legitimate
  const isKnownLegit = Array.from(KNOWN_LEGITIMATE_DOMAINS).some(
    (d) => hostname === d || hostname.endsWith(`.${d}`)
  );

  if (isKnownLegit && !malwareIndicators && !hasHomoglyphs) {
    calculatedScore = Math.min(15, calculatedScore);
  }

  // Cap score to 0 - 100
  let finalScore = Math.min(100, Math.max(0, calculatedScore));

  // Determine classification
  let riskLevel: CyberRiskLevel = 'SAFE';
  let title = 'No known threat detected';
  let summary =
    'We did not find strong indicators of malicious activity, but no automated scan can guarantee that a website is completely safe.';

  if (finalScore >= 70 || malwareIndicators || (brandImpersonation?.detected && (suspiciousTld || !hasHttps))) {
    riskLevel = 'HIGH_RISK';
    title = 'Do Not Open This Link';
    summary =
      'High-risk indicators detected. This link displays characteristics consistent with phishing, fraudulent brand impersonation, or malicious software distribution.';
  } else if (finalScore >= 35) {
    riskLevel = 'SUSPICIOUS';
    title = 'Proceed with caution';
    summary =
      'This website exhibits anomalies such as an unusual domain structure, recent or low-reputation extension, or concealed destination.';
  } else if (hostname.length < 4 || (!hostname.includes('.') && !isIpAddress)) {
    riskLevel = 'UNKNOWN';
    title = 'Unable to Verify';
    summary =
      'Insufficient reputation and threat intelligence data available for this address format. Please proceed cautiously and do not disclose sensitive details.';
  }

  // Synthesize safety advice
  const safetyAdvice: string[] = [
    'Do not enter passwords, OTPs, UPI PINs, ATM PINs, or card details.',
    'Do not download unknown files or install requested APK packages.',
    'Do not grant screen-sharing or remote-desktop permissions (AnyDesk, TeamViewer, RustDesk).',
    'Verify any communication directly through the official website, verified app, or official customer care.',
    'Report suspected cyber fraud immediately to National Cyber Crime Helpline: 1930.',
  ];

  // Optional Gemini copilot enrichment if API key available
  if (process.env.GEMINI_API_KEY && riskLevel !== 'SAFE') {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `You are Cyber Suraksha, an elite cybersecurity intelligence advisor for Indian citizens.
Analyze this link safely without visiting it:
URL: ${fullHref}
Domain: ${hostname}
Detected Heuristics: ${flags.join(', ')}
Calculated Risk: ${riskLevel} (Score: ${finalScore}/100)

Provide a 2-sentence citizen-friendly explanation of why this link looks suspicious or dangerous, and 1 specific warning tailored to Indian cyber fraud patterns (e.g. Electricity bill disconnect, SBI KYC expiry, India Post parcel delay, lottery scam). Output strictly plain text without markdown formatting.`;

      const aiResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const aiText = aiResponse.text?.trim();
      if (aiText) {
        summary = aiText;
      }
    } catch (err) {
      console.warn('Gemini cyber enrichment notice (using deterministic heuristics):', err);
    }
  }

  return {
    url: fullHref,
    sanitizedUrl: defangedUrl,
    domain: hostname,
    protocol,
    riskLevel,
    riskScore: finalScore,
    title,
    summary,
    flags,
    detailedReasons,
    brandImpersonation,
    technicalSignals: {
      hasHttps,
      isIpAddress,
      isUrlShortener,
      hasHomoglyphs,
      excessiveLength,
      suspiciousTld,
      suspiciousKeywords,
      suspiciousSubdomains,
      malwareIndicators,
    },
    safetyAdvice,
    timestamp: new Date().toISOString(),
  };
}
