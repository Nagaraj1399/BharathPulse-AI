import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Search,
  RotateCcw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Lock,
  Unlock,
  Radio,
  FileWarning,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  Server,
  Activity,
  Send,
  CheckCircle2,
  Clock,
  Info,
} from 'lucide-react';
import { api } from '../lib/api';
import { CyberScanResult, CyberIncidentReport, CyberRiskLevel } from '../../shared/types';
import { soundFx } from '../lib/soundFx';

interface CyberSecurityCheckerProps {
  onScanComplete?: (result: CyberScanResult) => void;
  onReportCreated?: (report: CyberIncidentReport) => void;
  isDarkMode?: boolean;
}

export const CyberSecurityChecker: React.FC<CyberSecurityCheckerProps> = ({
  onScanComplete,
  onReportCreated,
  isDarkMode = false,
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<CyberScanResult | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [isFlaggedExpanded, setIsFlaggedExpanded] = useState(false);
  const [isClickedModalOpen, setIsClickedModalOpen] = useState(false);
  const [selectedClickedScenario, setSelectedClickedScenario] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Reporting workflow state
  const [isReporting, setIsReporting] = useState(false);
  const [reportResult, setReportResult] = useState<CyberIncidentReport | null>(null);
  const [reportNotes, setReportNotes] = useState('');

  // Sample realistic phishing / scam links for testers
  const sampleLinks = [
    {
      label: 'Fake SBI KYC SMS',
      url: 'http://sbi-kyc-update-login.top/verify-aadhaar',
      note: 'Lookalike bank domain & .top TLD',
    },
    {
      label: 'Free Electricity Offer',
      url: 'http://192.168.1.104/bescom-bill-waive.apk',
      note: 'Raw IP host + direct APK download',
    },
    {
      label: 'Concealed Bit.ly Shortener',
      url: 'https://bit.ly/3xClaimIncomeTaxRefund',
      note: 'Masked redirection service',
    },
    {
      label: 'Official BBMP Portal (Safe)',
      url: 'https://bbmp.gov.in',
      note: 'Verified Karnataka State Civic Portal',
    },
  ];

  const handleScan = async (e?: React.FormEvent, customUrl?: string) => {
    if (e) e.preventDefault();
    const targetUrl = (customUrl || urlInput).trim();
    if (!targetUrl || isScanning) return;

    setIsScanning(true);
    setScanError(null);
    setReportResult(null);
    soundFx.playSignalReceived();

    try {
      const result = await api.scanCyberLink(targetUrl);
      setScanResult(result);
      setIsFlaggedExpanded(result.riskLevel !== 'SAFE');
      onScanComplete?.(result);

      if (result.riskLevel === 'HIGH_RISK') {
        soundFx.playAlert();
      } else {
        soundFx.playActionConfirmed();
      }
    } catch (err: any) {
      console.error('Scan error:', err);
      // Requirement 14: Show exact message on failure
      setScanError('Link verification is temporarily unavailable.');
      setScanResult(null);
    } finally {
      setIsScanning(false);
    }
  };

  const handleClear = () => {
    setUrlInput('');
    setScanResult(null);
    setScanError(null);
    setReportResult(null);
    setIsFlaggedExpanded(false);
    setSelectedClickedScenario(null);
    setIsClickedModalOpen(false);
  };

  const handleCopySanitized = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleReportCyberIncident = async () => {
    if (!scanResult && !urlInput.trim()) return;
    setIsReporting(true);
    soundFx.playActionConfirmed();

    try {
      const payload = {
        url: scanResult?.url || urlInput.trim(),
        sanitizedUrl: scanResult?.sanitizedUrl,
        domain: scanResult?.domain || 'unverified-source',
        riskLevel: scanResult?.riskLevel || 'SUSPICIOUS',
        riskScore: scanResult?.riskScore || 65,
        flags: scanResult?.flags || ['Manual citizen suspicious link report'],
        citizenNotes: reportNotes || undefined,
        clickedScenario: selectedClickedScenario || undefined,
      };

      const result = await api.reportCyberIncident(payload);
      setReportResult(result);
      onReportCreated?.(result);
      soundFx.playVerificationSuccess();
    } catch (err: any) {
      console.error('Incident report error:', err);
      alert('Failed to submit report. Please try again.');
    } finally {
      setIsReporting(false);
    }
  };

  // Clicked scenarios and reassuring advice
  const clickedScenarios = [
    {
      id: 'only_opened',
      label: 'Only opened the page',
      advice: [
        'Close the browser tab immediately.',
        'Do NOT accept any download prompts or notification permission requests.',
        'Clear your browser cache and cookies for the past 24 hours.',
        'As long as you entered no passwords or credentials, your financial accounts remain secure.',
      ],
      urgency: 'low',
    },
    {
      id: 'entered_password',
      label: 'Entered a password or login ID',
      advice: [
        'Immediately change the password for that account from a trusted, different device.',
        'If you use the same password on other accounts (email, bank, social), change those immediately as well.',
        'Enable Two-Factor Authentication (2FA) or Multi-Factor Authentication (MFA) on all related accounts.',
        'Check recent login activity or active sessions in your account security settings.',
      ],
      urgency: 'high',
    },
    {
      id: 'entered_banking',
      label: 'Entered banking or card information',
      advice: [
        'Call the National Cyber Crime Helpline: 1930 immediately.',
        'Immediately call your bank customer support to block your debit/credit card and freeze netbanking access.',
        'Use your official banking app (if accessible) to temporarily disable domestic and international card transactions.',
        'Monitor your bank statements closely for unauthorized transactions.',
      ],
      urgency: 'critical',
    },
    {
      id: 'shared_otp',
      label: 'Shared an OTP (One-Time Password)',
      advice: [
        'Call 1930 Cyber Fraud Helpline and your bank immediately.',
        'An OTP is the final authorization step for transactions; inform your bank to place an immediate financial freeze.',
        'Request the bank fraud cell to initiate a transaction recall / chargeback if funds were debited.',
      ],
      urgency: 'critical',
    },
    {
      id: 'installed_app',
      label: 'Installed or downloaded an APK / app',
      advice: [
        'Put your phone on Airplane Mode immediately to stop malicious apps from communicating with remote servers.',
        'Go to Settings > Apps and uninstall any recently added or unfamiliar apps (especially apps asking for Accessibility or Screen Sharing permissions).',
        'Revoke device administrator and accessibility privileges for suspicious apps.',
        'Run a full security scan using Google Play Protect or a trusted mobile antivirus.',
      ],
      urgency: 'high',
    },
    {
      id: 'made_payment',
      label: 'Made a payment or sent money via UPI',
      advice: [
        'Immediately report the transaction on the 1930 National Helpline (within the Golden Hour to freeze transferred funds).',
        'File an official report on the National Cyber Crime Reporting Portal at https://cybercrime.gov.in.',
        'Note down the UPI Transaction Reference ID (UTR / RRN number) and report it to your UPI app support (GPay, PhonePe, Paytm).',
      ],
      urgency: 'critical',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Privacy Notice Banner */}
      <div
        className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
          isDarkMode
            ? 'bg-amber-950/30 border-amber-900/60 text-amber-300'
            : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}
      >
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="font-semibold">
            Privacy First: Never enter passwords, OTPs, UPI PINs or banking credentials into this checker.
          </span>
        </div>
        <span className="text-[11px] opacity-80 hidden md:inline">
          Server-side sandbox analysis
        </span>
      </div>

      {/* Main Cybersecurity Card */}
      <div
        className={`rounded-2xl border transition-colors overflow-hidden ${
          isDarkMode
            ? 'bg-slate-900/90 border-slate-800 text-slate-100 shadow-xl'
            : 'bg-white border-slate-200 text-slate-900 shadow-sm'
        }`}
      >
        {/* Card Header */}
        <div
          className={`p-6 border-b ${
            isDarkMode ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-slate-50/60'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                    Check Before You Click
                  </h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/20">
                    CYBER DEFENSE INTELLIGENCE
                  </span>
                </div>
              </div>
              <p
                className={`text-xs sm:text-sm mt-2 leading-relaxed ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                Received an unfamiliar link through SMS, WhatsApp, email or social media? Check it before opening.
              </p>
            </div>

            {/* Emergency Action Pill */}
            <button
              type="button"
              onClick={() => setIsClickedModalOpen(true)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border shadow-xs self-start sm:self-auto shrink-0 ${
                isDarkMode
                  ? 'bg-rose-950/40 text-rose-300 border-rose-800 hover:bg-rose-900/40'
                  : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>I already clicked this link</span>
            </button>
          </div>

          {/* URL Input Form */}
          <form onSubmit={handleScan} className="mt-6 space-y-3">
            <div className="relative">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Paste a suspicious link here... (e.g. https://example.com)"
                className={`w-full text-xs sm:text-sm px-4 py-3.5 pr-28 rounded-xl border transition-all outline-hidden font-mono ${
                  isDarkMode
                    ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20'
                    : 'bg-slate-50/80 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20'
                }`}
              />

              <div className="absolute right-2 top-2 bottom-2 flex items-center gap-1.5">
                {urlInput && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      isDarkMode
                        ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={!urlInput.trim() || isScanning}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20 active:scale-98"
                >
                  <Search className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
                  <span>{isScanning ? 'Scanning Threat Signals...' : 'Scan Link'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleClear}
                  className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-colors ${
                    isDarkMode
                      ? 'border-slate-700 hover:bg-slate-800 text-slate-300'
                      : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  Clear
                </button>
              </div>

              {/* Security Guarantee Disclaimer */}
              <p
                className={`text-[11px] italic ${
                  isDarkMode ? 'text-slate-500' : 'text-slate-500'
                }`}
              >
                No automated scan can guarantee 100% safety. Always exercise caution.
              </p>
            </div>
          </form>

          {/* Quick Try Samples */}
          <div className="mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
            <span
              className={`text-[11px] font-bold uppercase tracking-wider ${
                isDarkMode ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              Test with common threat patterns:
            </span>
            <div className="flex flex-wrap gap-2 mt-2">
              {sampleLinks.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setUrlInput(item.url);
                    handleScan(undefined, item.url);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border text-left transition-all ${
                    isDarkMode
                      ? 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 text-slate-200'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-2xs'
                  }`}
                >
                  <span className="font-semibold block">{item.label}</span>
                  <span
                    className={`text-[10px] ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    {item.note}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Temporary Failure Banner */}
        {scanError && (
          <div className="p-6 bg-amber-500/10 border-b border-amber-500/20 text-amber-700 dark:text-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <p className="font-bold text-sm">{scanError}</p>
                <p className="text-xs opacity-90 mt-0.5">
                  Threat verification engine could not verify this host. Do NOT assume the link is safe.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleScan()}
                className="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition-colors shadow-xs"
              >
                Try Again
              </button>
              <button
                type="button"
                onClick={handleReportCyberIncident}
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs border border-amber-400 transition-colors"
              >
                Report Anyway
              </button>
            </div>
          </div>
        )}

        {/* Scan Results View */}
        {scanResult && (
          <div className="p-6 space-y-6">
            {/* Classification Card */}
            <div
              className={`p-5 rounded-2xl border-2 transition-all ${
                scanResult.riskLevel === 'SAFE'
                  ? isDarkMode
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-100'
                    : 'bg-emerald-50/70 border-emerald-400 text-emerald-900'
                  : scanResult.riskLevel === 'SUSPICIOUS'
                  ? isDarkMode
                    ? 'bg-amber-950/20 border-amber-500/40 text-amber-100'
                    : 'bg-amber-50/70 border-amber-400 text-amber-900'
                  : scanResult.riskLevel === 'HIGH_RISK'
                  ? isDarkMode
                    ? 'bg-rose-950/25 border-rose-500/50 text-rose-100'
                    : 'bg-rose-50/80 border-rose-400 text-rose-900'
                  : isDarkMode
                  ? 'bg-slate-800/40 border-slate-700 text-slate-200'
                  : 'bg-slate-100 border-slate-300 text-slate-800'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                      scanResult.riskLevel === 'SAFE'
                        ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                        : scanResult.riskLevel === 'SUSPICIOUS'
                        ? 'bg-amber-600 text-white shadow-amber-600/20'
                        : scanResult.riskLevel === 'HIGH_RISK'
                        ? 'bg-rose-600 text-white shadow-rose-600/30 animate-pulse'
                        : 'bg-slate-600 text-white'
                    }`}
                  >
                    {scanResult.riskLevel === 'SAFE' ? (
                      <ShieldCheck className="w-6 h-6" />
                    ) : scanResult.riskLevel === 'SUSPICIOUS' ? (
                      <AlertTriangle className="w-6 h-6" />
                    ) : scanResult.riskLevel === 'HIGH_RISK' ? (
                      <FileWarning className="w-6 h-6" />
                    ) : (
                      <HelpCircle className="w-6 h-6" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg sm:text-xl font-extrabold tracking-tight">
                        {scanResult.title}
                      </h3>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase border ${
                          scanResult.riskLevel === 'SAFE'
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                            : scanResult.riskLevel === 'SUSPICIOUS'
                            ? 'bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400'
                            : scanResult.riskLevel === 'HIGH_RISK'
                            ? 'bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400'
                            : 'bg-slate-500/10 border-slate-500 text-slate-500'
                        }`}
                      >
                        {scanResult.riskLevel.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm mt-1 leading-relaxed opacity-90 max-w-2xl">
                      {scanResult.summary}
                    </p>
                  </div>
                </div>

                {/* Technical Risk Score Badge (0-100) */}
                <div
                  className={`p-3 rounded-xl border text-center shrink-0 min-w-[120px] ${
                    isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/90 border-slate-200'
                  }`}
                >
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider block ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    Link Risk Score
                  </span>
                  <div className="flex items-baseline justify-center gap-1 mt-0.5">
                    <span
                      className={`text-2xl font-black font-mono ${
                        scanResult.riskScore >= 70
                          ? 'text-rose-600 dark:text-rose-400'
                          : scanResult.riskScore >= 35
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {scanResult.riskScore}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">/100</span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500">
                    {scanResult.riskLevel === 'SAFE'
                      ? 'Low Risk'
                      : scanResult.riskLevel === 'SUSPICIOUS'
                      ? 'Medium Risk'
                      : 'High Threat'}
                  </span>
                </div>
              </div>

              {/* Defanged URL & Action bar */}
              <div
                className={`mt-4 pt-3 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                  scanResult.riskLevel === 'SAFE'
                    ? 'border-emerald-200/60 dark:border-emerald-800/40'
                    : scanResult.riskLevel === 'SUSPICIOUS'
                    ? 'border-amber-200/60 dark:border-amber-800/40'
                    : 'border-rose-200/60 dark:border-rose-800/40'
                }`}
              >
                <div className="flex items-center gap-2 font-mono text-[11px] truncate max-w-lg">
                  <span className="text-slate-400 font-sans">Defanged Address:</span>
                  <span className="truncate bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">
                    {scanResult.sanitizedUrl}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopySanitized(scanResult.sanitizedUrl)}
                    className="p-1 hover:opacity-80 transition-opacity"
                    title="Copy sanitized link"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleReportCyberIncident}
                    disabled={isReporting}
                    className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>{isReporting ? 'Routing via n8n...' : 'Report Cyber Incident'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClear}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                      isDarkMode
                        ? 'border-slate-700 hover:bg-slate-800 text-slate-300'
                        : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    Scan Another Link
                  </button>
                </div>
              </div>
            </div>

            {/* Possible Brand Impersonation Alert */}
            {scanResult.brandImpersonation?.detected && (
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  isDarkMode
                    ? 'bg-amber-950/30 border-amber-700/60 text-amber-200'
                    : 'bg-amber-50 border-amber-300 text-amber-950'
                }`}
              >
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold flex items-center gap-2">
                    <span>Possible Brand Impersonation</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-600/10 text-amber-700 dark:text-amber-400 font-mono">
                      {scanResult.brandImpersonation.brandName}
                    </span>
                  </h4>
                  <p className="text-xs mt-1 leading-relaxed opacity-95">
                    {scanResult.brandImpersonation.details}
                  </p>
                </div>
              </div>
            )}

            {/* Expandable "Why was this link flagged?" Section */}
            <div
              className={`rounded-xl border transition-colors ${
                isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-slate-50/50'
              }`}
            >
              <button
                type="button"
                onClick={() => setIsFlaggedExpanded(!isFlaggedExpanded)}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-indigo-600" />
                  <span className="font-bold text-xs sm:text-sm">
                    Why was this link flagged? ({scanResult.detailedReasons.length} signals evaluated)
                  </span>
                </div>
                {isFlaggedExpanded ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {isFlaggedExpanded && (
                <div
                  className={`p-4 pt-0 space-y-2.5 border-t ${
                    isDarkMode ? 'border-slate-800' : 'border-slate-200/60'
                  }`}
                >
                  {scanResult.detailedReasons.map((reason, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border text-xs ${
                        reason.severity === 'high'
                          ? isDarkMode
                            ? 'bg-rose-950/20 border-rose-900/40 text-rose-200'
                            : 'bg-rose-50 border-rose-200 text-rose-900'
                          : reason.severity === 'medium'
                          ? isDarkMode
                            ? 'bg-amber-950/20 border-amber-900/40 text-amber-200'
                            : 'bg-amber-50 border-amber-200 text-amber-900'
                          : isDarkMode
                          ? 'bg-slate-800/40 border-slate-700 text-slate-300'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{reason.title}</span>
                        <span
                          className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-mono font-bold ${
                            reason.severity === 'high'
                              ? 'bg-rose-600/20 text-rose-600'
                              : reason.severity === 'medium'
                              ? 'bg-amber-600/20 text-amber-600'
                              : 'bg-slate-600/20 text-slate-500'
                          }`}
                        >
                          {reason.severity}
                        </span>
                      </div>
                      <p className="mt-1 leading-relaxed opacity-90">{reason.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Citizen Safety Guidance: "What should I do?" */}
            {(scanResult.riskLevel === 'SUSPICIOUS' || scanResult.riskLevel === 'HIGH_RISK') && (
              <div
                className={`p-5 rounded-xl border ${
                  isDarkMode
                    ? 'bg-slate-900/80 border-slate-800 text-slate-100'
                    : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <ShieldAlert className="w-4 h-4 text-indigo-600" />
                  <h4 className="font-extrabold text-sm uppercase tracking-wide">
                    What should I do?
                  </h4>
                </div>

                <ul className="space-y-2 text-xs leading-relaxed">
                  {scanResult.safetyAdvice.map((advice, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                      <span>{advice}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* n8n Report Confirmation Banner if submitted */}
            {reportResult && (
              <div
                className={`p-5 rounded-2xl border-2 border-indigo-500/50 space-y-3 ${
                  isDarkMode ? 'bg-indigo-950/30 text-indigo-100' : 'bg-indigo-50/70 text-indigo-950'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                    <span className="font-extrabold text-sm sm:text-base">
                      Incident Dispatched via n8n Automation Engine
                    </span>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-600 text-white font-bold">
                    {reportResult.ticketId}
                  </span>
                </div>

                <p className="text-xs leading-relaxed opacity-90">
                  Your cybersecurity report was sanitized and processed through the n8n orchestration webhook.
                  It has been synchronized into the Live Municipal Incident Queue under ID{' '}
                  <span className="font-mono font-bold">{reportResult.incidentId}</span> and dispatched to{' '}
                  <span className="font-bold">{reportResult.assignedTeam}</span>.
                </p>

                {/* n8n Live Execution Graph Steps */}
                <div className="mt-3 space-y-1.5 text-[11px] font-mono">
                  {reportResult.n8nExecution.steps.map((st, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2 px-2.5 py-1 rounded ${
                        isDarkMode ? 'bg-slate-900/60' : 'bg-white'
                      }`}
                    >
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span className="font-semibold">{st.name}:</span>
                      <span className="truncate text-slate-500">{st.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal: "I already clicked this link" Emergency Helper */}
      {isClickedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div
            className={`w-full max-w-xl rounded-2xl border p-6 space-y-5 transition-all ${
              isDarkMode
                ? 'bg-slate-900 border-slate-800 text-slate-100'
                : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-500" />
                  <span>I Already Clicked This Link — Immediate Next Steps</span>
                </h3>
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Stay calm. Select exactly what occurred so we can provide step-by-step guidance without unnecessary alarm.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsClickedModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Situation Selection Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {clickedScenarios.map((sc) => {
                const isSelected = selectedClickedScenario === sc.id;
                return (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => setSelectedClickedScenario(sc.id)}
                    className={`p-3 rounded-xl border text-left font-medium transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-200 dark:border-indigo-400 font-bold'
                        : isDarkMode
                        ? 'border-slate-800 bg-slate-800/40 text-slate-300 hover:bg-slate-800'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{sc.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Targeted Guidance Display */}
            {selectedClickedScenario && (
              <div
                className={`p-4 rounded-xl border space-y-2.5 text-xs ${
                  isDarkMode
                    ? 'bg-slate-800/60 border-slate-700 text-slate-200'
                    : 'bg-indigo-50/50 border-indigo-100 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold uppercase text-[11px] text-indigo-600 dark:text-indigo-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Recommended Action Plan:</span>
                </div>

                <ul className="space-y-2 leading-relaxed">
                  {clickedScenarios
                    .find((s) => s.id === selectedClickedScenario)
                    ?.advice.map((adv, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                        <span>{adv}</span>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-rose-600 dark:text-rose-400">
                <span className="font-bold">Helpline:</span>
                <span>Dial 1930 for financial cyber fraud</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsClickedModalOpen(false);
                    handleReportCyberIncident();
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors"
                >
                  Report Cyber Incident
                </button>
                <button
                  type="button"
                  onClick={() => setIsClickedModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
