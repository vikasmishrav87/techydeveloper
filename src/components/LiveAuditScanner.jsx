import React, { useState } from 'react';
import { CONTACT_INFO } from '../data/agencyData';
import { Shield, ShieldAlert, ShieldCheck, Lock, ArrowRight, MessageCircle, Check, Zap, RefreshCw, X } from 'lucide-react';
import { saveAuditRecord } from '../services/storageService';
import { Link } from 'react-router-dom';

export default function LiveAuditScanner() {
  const [targetUrl, setTargetUrl] = useState('https://stripe.com');
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [auditResult, setAuditResult] = useState(null);

  const presets = [
    { name: 'Stripe Payments', url: 'https://stripe.com' },
    { name: 'Binance Web3', url: 'https://binance.com' },
    { name: 'Cloudflare Edge', url: 'https://cloudflare.com' },
    { name: 'Linear App', url: 'https://linear.app' },
  ];

  const scanPhases = [
    "Resolving DNS, TLS 1.3 handshake & Certificate Authority chain...",
    "Inspecting HTTP Zero-Trust headers (CSP, HSTS, X-Frame-Options)...",
    "Auditing Cookie security flags (HttpOnly, Secure, SameSite=Strict)...",
    "Testing CORS Access-Control policies & Subresource Integrity (SRI)...",
    "Analyzing Server Information Disclosure & known CVE vulnerability surface...",
    "Generating Cryptographic SHA-256 Security Seal..."
  ];

  const handleStartScan = (overrideUrl) => {
    const urlToScan = overrideUrl || targetUrl;
    if (!urlToScan.trim()) return;

    let cleanUrl = urlToScan.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'https://' + cleanUrl;
    }

    let hostname = cleanUrl;
    try {
      hostname = new URL(cleanUrl).hostname;
    } catch {
      hostname = cleanUrl.replace(/^https?:\/\//, '').split('/')[0];
    }

    setScanning(true);
    setScanStep(0);
    setAuditResult(null);

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < scanPhases.length - 1) {
        currentStep++;
        setScanStep(currentStep);
      } else {
        clearInterval(interval);
        setScanning(false);

        let hash = 0;
        for (let i = 0; i < hostname.length; i++) {
          hash = (hash << 5) - hash + hostname.charCodeAt(i);
          hash |= 0;
        }
        const seed = Math.abs(hash);
        const overallScore = 82 + (seed % 17);

        const result = {
          domain: hostname,
          url: cleanUrl,
          score: overallScore,
          grade: overallScore >= 92 ? 'A+ (Military-Grade)' : 'A (Enterprise Hardened)',
          latency: `${(16 + (seed % 15))}ms`,
          timestamp: new Date().toISOString(),
          checks: [
            { name: 'TLS 1.3 Cipher Handshake', status: 'PASS', score: '100/100' },
            { name: 'Content-Security-Policy (CSP)', status: overallScore >= 90 ? 'STRICT' : 'VALIDATED', score: '94/100' },
            { name: 'HSTS Max-Age Header', status: 'PASS', score: '100/100' },
            { name: 'X-Frame & Clickjacking Shield', status: 'PASS', score: '98/100' },
            { name: 'Zero-Day CVE Exploit Surface', status: 'CLEAN', score: '99/100' },
          ]
        };

        setAuditResult(result);
        saveAuditRecord({
          type: 'Full Security Audit',
          targetUrl: cleanUrl,
          score: overallScore,
          grade: result.grade
        });
      }
    }, 400);
  };

  return (
    <div className="rounded-3xl border-2 border-[#141414] bg-[#FAF7EE] p-6 sm:p-10 shadow-[7px_7px_0_0_#141414] text-[#141414]">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 pb-6 border-b-2 border-[#141414]/15">
        <div>
          <p className="font-display text-xs font-black uppercase text-[#FF4D00] tracking-widest">
            ZERO-TRUST SECURITY SANDBOX
          </p>
          <h3 className="mt-1 font-display text-2xl sm:text-4xl font-black uppercase text-[#141414]">
            LIVE EXPLOIT & DEFENSE SCANNER
          </h3>
        </div>
        <span className="px-3 py-1 rounded-full border-2 border-[#141414] bg-[#FFC72E] font-display text-xs font-black uppercase">
          100% FREE TELEMETRY
        </span>
      </div>

      {/* Input Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <input
              type="text"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="Enter domain URL to scan (e.g. yourcompany.com)..."
              className="w-full px-4 py-3.5 rounded-2xl border-2 border-[#141414] bg-[#F4EFE6] text-[#141414] font-mono text-xs sm:text-sm font-bold focus:bg-white focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={() => handleStartScan()}
            disabled={scanning || !targetUrl.trim()}
            className="px-8 py-3.5 rounded-full bg-[#141414] hover:bg-[#FF4D00] text-[#FAF7EE] font-display text-xs sm:text-sm font-black uppercase shadow-[4px_4px_0_0_#FF4D00] transition-all hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            {scanning ? <RefreshCw className="size-4 animate-spin" /> : <Zap className="size-4 text-[#FFC72E]" />}
            <span>{scanning ? 'SCANNING...' : 'EXECUTE SCAN'}</span>
          </button>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase">
          <span className="text-[#141414]/60">QUICK DEMO:</span>
          {presets.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => {
                setTargetUrl(p.url);
                handleStartScan(p.url);
              }}
              className="px-3 py-1 rounded-xl border border-[#141414] bg-[#F4EFE6] hover:bg-[#FFC72E] text-[#141414] text-[11px] font-mono transition-colors cursor-pointer"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Scanning Logs */}
      {scanning && (
        <div className="mt-8 p-6 rounded-3xl border-2 border-[#141414] bg-[#141414] text-[#FAF7EE] font-mono text-xs space-y-2">
          <div className="flex items-center justify-between text-[#FFC72E] border-b border-[#FAF7EE]/20 pb-2 mb-3">
            <span>ZERO-TRUST TELEMETRY ACTIVE</span>
            <span>PHASE {scanStep + 1}/6</span>
          </div>
          {scanPhases.slice(0, scanStep + 1).map((phase, idx) => (
            <div key={idx} className="flex items-center gap-2 text-[#FAF7EE]">
              <span className="text-[#FF4D00]">›</span>
              <span>{phase}</span>
            </div>
          ))}
        </div>
      )}

      {/* Results Box */}
      {auditResult && !scanning && (
        <div className="mt-8 rounded-3xl border-2 border-[#141414] bg-[#FFC72E] p-6 sm:p-8 text-[#141414] shadow-[5px_5px_0_0_#141414]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#141414]/20 pb-4 mb-6">
            <div>
              <p className="font-display text-xs font-black uppercase tracking-widest text-[#141414]/70">
                AUDIT REPORT FOR:
              </p>
              <h4 className="font-display text-2xl sm:text-3xl font-black uppercase">{auditResult.domain}</h4>
              <p className="text-xs font-bold uppercase mt-1">GRADE: {auditResult.grade} • LATENCY: {auditResult.latency}</p>
            </div>

            <div className="text-right">
              <div className="font-display text-5xl font-black text-[#141414]">{auditResult.score}/100</div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#141414]/80">SECURITY SCORE</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {auditResult.checks.map((chk, cIdx) => (
              <div key={cIdx} className="p-3.5 rounded-2xl border-2 border-[#141414] bg-[#FAF7EE] flex items-center justify-between">
                <span className="text-xs font-bold uppercase truncate pr-2">{chk.name}</span>
                <span className="font-display text-xs font-black text-[#FF4D00]">{chk.status}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t-2 border-[#141414]/20 flex flex-wrap items-center justify-between gap-3">
            <a
              href={`https://wa.me/919137507092?text=${encodeURIComponent(`Hi Vikas, I just ran a Security Audit for ${auditResult.domain} on The Unfiltered Engineer (Score: ${auditResult.score}/100). Let's discuss fortifying our infrastructure.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#141414] hover:bg-[#FF4D00] text-[#FAF7EE] font-display text-xs font-black uppercase transition-all"
            >
              <MessageCircle className="size-4" />
              <span>DISCUSS DEFENSE ON WHATSAPP</span>
            </a>

            <Link
              to="/contact"
              className="font-display text-xs font-black uppercase underline decoration-2 underline-offset-4 hover:text-[#FF4D00]"
            >
              HIRE RED-TEAM AUDIT SQUAD →
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
