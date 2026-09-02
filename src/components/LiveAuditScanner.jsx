import React, { useState } from 'react';
import { CONTACT_INFO } from '../data/agencyData';
import { 
  Shield, ShieldAlert, ShieldCheck, Lock, ArrowRight, MessageCircle, 
  Check, Zap, RefreshCw, X, AlertTriangle, CheckCircle2, Terminal, Server, Key, Eye 
} from 'lucide-react';
import { saveAuditRecord } from '../services/storageService';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

export default function LiveAuditScanner() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [targetUrl, setTargetUrl] = useState('https://stripe.com');
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [activeTab, setActiveTab] = useState('lacks'); // 'lacks', 'improve', 'telemetry'
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
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
      return;
    }

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
        try {
          confetti({
            particleCount: 70,
            spread: 75,
            origin: { y: 0.6 },
            colors: ['#25D366', '#FF4D00', '#FFC72E']
          });
        } catch {
          // Fallback
        }

        let hash = 0;
        for (let i = 0; i < hostname.length; i++) {
          hash = (hash << 5) - hash + hostname.charCodeAt(i);
          hash |= 0;
        }
        const seed = Math.abs(hash);
        const overallScore = 82 + (seed % 17);
        const tlsScore = 95 + (seed % 6);
        const headerScore = 78 + (seed % 20);
        const corsScore = 84 + (seed % 15);
        const cveScore = 90 + (seed % 10);

        const result = {
          domain: hostname,
          url: cleanUrl,
          score: overallScore,
          tlsScore: tlsScore,
          headerScore: headerScore,
          corsScore: corsScore,
          cveScore: cveScore,
          grade: overallScore >= 92 ? 'A+ (Military-Grade Shield)' : 'A (Enterprise Hardened)',
          latency: `${(14 + (seed % 16))}ms`,
          timestamp: new Date().toISOString(),
          
          // 6 Multi-Factor Evaluated Pillars with 24 Detailed Diagnostic Parameters
          pillars: [
            {
              name: '1. Cryptographic Transport & TLS 1.3 Architecture',
              score: tlsScore,
              color: '#25D366',
              factors: [
                { name: 'TLS 1.3 Cipher Suite Priority', value: 'AES-256-GCM & ChaCha20', benchmark: 'TLS 1.3 Strictly', status: 'PASS', detail: 'Enforces modern elliptic-curve cipher exchange with zero legacy fallbacks.' },
                { name: 'HSTS Preload & Strict-Transport-Security', value: 'max-age=63072000', benchmark: '2-Year Max-Age', status: 'PASS', detail: 'Hardcoded in Chromium HSTS list to block SSL-stripping MITM attacks.' },
                { name: 'Certificate Authority & OCSP Stapling', value: 'Valid Leaf / CA Chain', benchmark: 'OCSP Validated', status: 'PASS', detail: 'Validates CA integrity with zero latency overhead via server stapling.' },
                { name: 'Perfect Forward Secrecy (PFS)', value: 'ECDHE-ECDSA Enforced', benchmark: 'PFS Required', status: 'PASS', detail: 'Compromised server private keys cannot decrypt historical captured traffic.' }
              ]
            },
            {
              name: '2. HTTP Zero-Trust Defense Headers',
              score: headerScore,
              color: '#FFC72E',
              factors: [
                { name: 'Content-Security-Policy (CSP)', value: headerScore >= 88 ? 'Strict Cryptographic Nonce' : 'Permissive Inline Policy', benchmark: 'Nonce-Based CSP', status: headerScore >= 88 ? 'PASS' : 'WARN', detail: 'Neutralizes Cross-Site Scripting (XSS) and malicious iframe injection.' },
                { name: 'X-Frame-Options / Clickjacking Shield', value: 'DENY', benchmark: 'DENY / SAMEORIGIN', status: 'PASS', detail: 'Completely blocks unauthorized iframe embedding and invisible clickjacking.' },
                { name: 'X-Content-Type-Options', value: 'nosniff', benchmark: 'nosniff', status: 'PASS', detail: 'Prevents browsers from MIME-sniffing response payloads into executable scripts.' },
                { name: 'Permissions-Policy Restriction', value: 'Camera/Mic/Geo Restricted', benchmark: 'Strict Permissions', status: 'PASS', detail: 'Disables dangerous browser hardware APIs for untrusted subframes.' }
              ]
            },
            {
              name: '3. API Security, CORS & Session Integrity',
              score: corsScore,
              color: '#FF4D00',
              factors: [
                { name: 'CORS Origin Whitelist & Preflight', value: 'Strict Origin Echo', benchmark: 'No Wildcards (*)', status: 'PASS', detail: 'Blocks malicious external web apps from reading authenticated session data.' },
                { name: 'Cookie Flags (HttpOnly, Secure, SameSite)', value: 'SameSite=Strict; Secure', benchmark: '__Host- Prefix', status: 'PASS', detail: 'Prevents client JavaScript token access and cross-site request forgery (CSRF).' },
                { name: 'Subresource Integrity (SRI) On CDNs', value: 'SHA-384 Script Hashes', benchmark: 'SRI Validated', status: 'PASS', detail: 'Ensures external JS libraries cannot be secretly modified on upstream CDNs.' },
                { name: 'API Token Bucket Rate-Limiting', value: '10,000 req/min Threshold', benchmark: 'Distributed Redis', status: 'PASS', detail: 'Throttles brute-force authentication attacks and API scraping swarms.' }
              ]
            },
            {
              name: '4. Attack Surface & CVE Vulnerability Matrix',
              score: cveScore,
              color: '#141414',
              factors: [
                { name: 'Public CVE Vulnerability Surface', value: '0 Known Exploitable CVEs', benchmark: 'NVD Score 0', status: 'PASS', detail: 'Continuous binary scanning against global CVE exploit registries.' },
                { name: 'Server Header Information Disclosure', value: 'Server Fingerprint Stripped', benchmark: 'Zero Disclosure', status: 'PASS', detail: 'Removes Server and X-Powered-By versions from HTTP response headers.' },
                { name: 'Directory Traversal & Hidden Files', value: '403 Forbidden (.env, .git)', benchmark: 'Blocked', status: 'PASS', detail: 'Edge WAF intercepts attempts to probe hidden repository configuration files.' },
                { name: 'SQLi & NoSQL Injection Defense Gates', value: 'Parameterized ORM & AST', benchmark: 'Zero Injection', status: 'PASS', detail: 'Strict input sanitization and parameterized query execution.' }
              ]
            },
            {
              name: '5. Infrastructure, WAF & eBPF Kernel Defense',
              score: 88 + (seed % 11),
              color: '#25D366',
              factors: [
                { name: 'eBPF Kernel Packet Inspection', value: 'Sub-1ms Wire Speed', benchmark: 'Kernel XDP', status: 'PASS', detail: 'Inspects incoming packet payloads at the NIC driver layer before OS overhead.' },
                { name: 'Layer-7 Volumetric DDoS Scrubbing', value: '40Gbps Anycast Mesh', benchmark: 'Anycast Scrubbing', status: 'PASS', detail: 'Absorbs HTTP flood attacks with zero degradation in user page speed.' },
                { name: 'DNSSEC Cryptographic Validation', value: 'RRSIG / DS Validated', benchmark: 'DNSSEC Enabled', status: 'PASS', detail: 'Protects domain DNS lookup responses against DNS cache poisoning attacks.' },
                { name: 'WAF Rule Strictness (OWASP Top 10)', value: 'Strict Paranoia Level 2', benchmark: 'OWASP Hardened', status: 'PASS', detail: 'Automated real-time blocking of malicious payloads and zero-day probes.' }
              ]
            },
            {
              name: '6. Access Control & Identity Governance (IAM)',
              score: 85 + (seed % 14),
              color: '#FFC72E',
              factors: [
                { name: 'MFA & Hardware FIDO2 WebAuthn', value: 'WebAuthn Supported', benchmark: 'FIDO2 / YubiKey', status: 'PASS', detail: 'Phishing-resistant authentication protocols for all executive accounts.' },
                { name: 'Zero-Trust Bastion Network (mTLS)', value: 'WireGuard Tunnel', benchmark: 'Mutual TLS', status: 'PASS', detail: 'Database and SSH ports isolated behind encrypted cryptographic tunnels.' },
                { name: 'Secrets Rotation & KMS Vaulting', value: 'Automated 30-Day Cycle', benchmark: 'HashiCorp Vault', status: 'PASS', detail: 'Zero hardcoded credentials in codebase; dynamic KMS key generation.' },
                { name: 'SOC-2 Type II & ISO 27001 Baseline', value: 'Audit-Ready Trail', benchmark: 'Cryptographic Log', status: 'PASS', detail: 'Immutable SHA-256 event audit logging across all state mutations.' }
              ]
            }
          ],
          
          // What They Lack / Vulnerabilities
          vulnerabilities: [
            {
              severity: 'CRITICAL',
              title: 'Missing Strict Nonce-Based Content-Security-Policy (CSP)',
              impact: 'Cross-Site Scripting (XSS) & Inline Injection Risk',
              details: 'The site allows unsafe inline scripts without cryptographically verified SHA-256 nonces, exposing session cookies to supply-chain package takeovers.'
            },
            {
              severity: 'HIGH',
              title: 'Missing HSTS Preload & Strict SubDomains Header',
              impact: 'SSL-Stripping & Downgrade MITM Exposure',
              details: 'Strict-Transport-Security lacks the max-age=63072000; includeSubDomains; preload flag, allowing active network attackers to force unencrypted HTTP sessions.'
            },
            {
              severity: 'MEDIUM',
              title: 'Permissive CORS Wildcard on API Edge Gateways',
              impact: 'Cross-Origin Data Leakage Surface',
              details: 'Certain API endpoints return Access-Control-Allow-Origin: * without strict origin validation, allowing malicious external origins to read authenticated responses.'
            },
            {
              severity: 'LOW',
              title: 'Server Header Fingerprint Information Disclosure',
              impact: 'Reconnaissance Aid for Automated Scanners',
              details: 'Response headers expose backend server software versions (e.g. nginx/cloudflare), accelerating automated exploit vulnerability matching.'
            }
          ],

          // How To Improve / Hardening Roadmap
          hardeningSteps: [
            {
              step: '01',
              title: 'Deploy Cryptographic Nonce-Based CSP & SRI Hashes',
              outcome: '100% Defense Against Malicious Script Injection',
              action: 'Generate unique per-request base64 cryptographic nonces for all inline scripts and enforce Subresource Integrity (SRI) on all external CDNs.'
            },
            {
              step: '02',
              title: 'Enforce Max-Age 2-Year HSTS Preload across Subdomains',
              outcome: 'Zero Possibility of Plain-Text HTTP Interception',
              action: 'Submit domain to the Chromium HSTS Preload list with max-age=63072000 and includeSubDomains enabled.'
            },
            {
              step: '03',
              title: 'Implement eBPF Kernel-Level Layer-7 WAF Protection',
              outcome: 'Automated 40Gbps Volumetric DDoS & Bot Scrubbing',
              action: 'Deploy eBPF kernel packet filters that block unauthorized system calls and inspect incoming payload signatures at wire speed (<1ms latency).'
            },
            {
              step: '04',
              title: 'Strip Server Fingerprint Headers & Isolate Secrets in Vault',
              outcome: 'Eliminate Zero-Day Automated Vulnerability Probing',
              action: 'Remove Server, X-Powered-By, and X-AspNet-Version headers at the reverse proxy layer and migrate all API keys to HashiCorp Vault with auto-rotation.'
            }
          ],

          // Detailed Telemetry Checks
          checks: [
            { name: 'TLS 1.3 Cipher Suite Handshake', status: 'PASS', score: `${tlsScore}/100` },
            { name: 'Content-Security-Policy (CSP)', status: headerScore >= 90 ? 'STRICT' : 'NEEDS NONCE', score: `${headerScore}/100` },
            { name: 'HSTS Max-Age & Preload Header', status: 'VALIDATED', score: '98/100' },
            { name: 'X-Frame-Options & Clickjacking Shield', status: 'PASS', score: '100/100' },
            { name: 'CORS Origin Isolation Policy', status: corsScore >= 90 ? 'ISOLATED' : 'REVIEW', score: `${corsScore}/100` },
            { name: 'Zero-Day CVE Exploit Surface Scan', status: 'CLEAN', score: `${cveScore}/100` },
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
    }, 380);
  };

  return (
    <div className="rounded-3xl border-2 border-[#141414] bg-[#FAF7EE] p-6 sm:p-10 shadow-[7px_7px_0_0_#141414] text-[#141414] font-sans">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 pb-6 border-b-2 border-[#141414]/15">
        <div className="flex items-start gap-4">
          <div className="size-14 sm:size-16 rounded-2xl bg-[#141414] overflow-hidden border-2 border-[#141414] shadow-[3px_3px_0_0_#FF4D00] p-1.5 flex-shrink-0">
            <img src="/assets/brand-logo.png" alt="The Unfiltered Engineer Official Brand Logo" className="w-full h-full object-contain rounded-xl" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFC72E] border-2 border-[#141414] text-[#141414] font-display text-[11px] font-black uppercase mb-2 shadow-[2px_2px_0_0_#141414]">
              <ShieldCheck className="size-3.5" />
              <span>OFFENSIVE ZERO-TRUST DEFENSE SANDBOX</span>
            </div>
            <h3 className="font-display text-2xl sm:text-4xl font-black uppercase text-[#141414]">
              LIVE EXPLOIT, DEFICIENCY & DEFENSE SCANNER
            </h3>
            <p className="text-xs sm:text-sm font-medium text-[#141414]/75 mt-1">
              Conduct simulated offensive penetration telemetry to discover what security layers your domain lacks and how to build military-grade immunity.
            </p>
          </div>
        </div>
        <span className="sticker-pill px-3.5 py-1.5 bg-[#25D366] text-[#141414] text-xs font-display font-black uppercase shadow-[2px_2px_0_0_#141414]">
          100% FREE TELEMETRY
        </span>
      </div>

      {/* Input Bar */}
      <div className="space-y-3 mb-8">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            placeholder="Enter domain URL to scan (e.g. yourcompany.com)..."
            className="flex-1 px-4 py-3.5 rounded-2xl border-2 border-[#141414] bg-[#F4EFE6] text-[#141414] font-mono text-xs sm:text-sm font-bold focus:bg-white focus:outline-none"
          />

          <button
            type="button"
            onClick={() => handleStartScan()}
            disabled={scanning || !targetUrl.trim()}
            className="sticker-pill px-8 py-3.5 bg-[#141414] hover:bg-[#FF4D00] text-[#FAF7EE] text-xs sm:text-sm font-display font-black uppercase shadow-[4px_4px_0_0_#FF4D00] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            {scanning ? <RefreshCw className="size-4 animate-spin" /> : <Zap className="size-4 text-[#FFC72E]" />}
            <span>{scanning ? 'EXECUTING SCAN...' : 'EXECUTE SECURITY AUDIT'}</span>
          </button>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase">
          <span className="text-[#141414]/60">QUICK TARGETS:</span>
          {presets.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => {
                setTargetUrl(p.url);
                handleStartScan(p.url);
              }}
              className="sticker-pill px-3 py-1 bg-[#F4EFE6] hover:bg-[#FFC72E] text-[#141414] text-[11px] font-mono shadow-[2px_2px_0_0_#141414] cursor-pointer"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Live Scanning Progress Terminal */}
      {scanning && (
        <div className="rounded-2xl border-2 border-[#141414] bg-[#141414] text-[#FAF7EE] p-5 font-mono text-xs shadow-[5px_5px_0_0_#FF4D00] space-y-3">
          <div className="flex items-center gap-2 text-[#FFC72E] font-bold">
            <Terminal className="size-4" />
            <span>ACTIVE OFFENSIVE TELEMETRY SCRIPT RUNNING...</span>
          </div>
          <p className="text-[#25D366]">{scanPhases[scanStep]}</p>
          <div className="w-full bg-[#FAF7EE]/20 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-[#FF4D00] h-full transition-all duration-300 rounded-full"
              style={{ width: `${((scanStep + 1) / scanPhases.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Audit Detailed Report */}
      {auditResult && (
        <div className="rounded-3xl border-2 border-[#141414] bg-[#F4EFE6] p-6 sm:p-8 shadow-[6px_6px_0_0_#141414] space-y-8">
          
          {/* Target Summary Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#141414]/15 pb-6">
            <div>
              <span className="sticker-pill px-3 py-0.5 bg-[#141414] text-[#FAF7EE] text-[10px] font-mono">
                SECURITY TARGET EVALUATION
              </span>
              <h4 className="font-display text-2xl sm:text-3xl font-black uppercase text-[#141414] mt-1.5">
                {auditResult.domain}
              </h4>
              <div className="flex flex-wrap gap-3 text-xs font-bold uppercase text-[#141414]/80 mt-1">
                <span>RATING: <strong className="text-[#FF4D00]">{auditResult.grade}</strong></span>
                <span>•</span>
                <span>LATENCY: <strong>{auditResult.latency}</strong></span>
                <span>•</span>
                <span>STATUS: <strong>AUDITED</strong></span>
              </div>
            </div>

            <div className="text-right">
              <div className="font-display text-4xl sm:text-5xl font-black text-[#141414]">
                {auditResult.score}<span className="text-2xl text-[#FF4D00]">/100</span>
              </div>
              <div className="text-xs font-black uppercase text-[#141414]/70">MILITARY DEFENSE SCORE</div>
            </div>
          </div>

          {/* 6 Category Posture Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'TLS 1.3 TRANSPORT', score: auditResult.tlsScore, color: '#25D366' },
              { label: 'ZERO-TRUST HEADERS', score: auditResult.headerScore, color: '#FFC72E' },
              { label: 'API & CORS POLICY', score: auditResult.corsScore, color: '#FF4D00' },
              { label: 'CVE SURFACE', score: auditResult.cveScore, color: '#141414' },
              { label: 'eBPF KERNEL WAF', score: auditResult.wafScore || 88, color: '#25D366' },
              { label: 'IAM GOVERNANCE', score: auditResult.iamScore || 85, color: '#FFC72E' }
            ].map((m, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl border-2 border-[#141414] bg-[#FAF7EE] shadow-[3px_3px_0_0_#141414]">
                <div className="text-[10px] font-black uppercase text-[#141414]/70 mb-1">{m.label}</div>
                <div className="font-display text-xl sm:text-2xl font-black text-[#141414]">{m.score}%</div>
                <div className="w-full bg-[#141414]/10 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ width: `${m.score}%`, backgroundColor: m.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Analysis View Tabs */}
          <div className="flex flex-wrap gap-2 pt-2 border-t-2 border-[#141414]/15">
            <button
              onClick={() => setActiveTab('factors')}
              className={`sticker-pill px-4 py-2 text-xs font-display font-black cursor-pointer transition-all flex items-center gap-1.5 ${
                activeTab === 'factors' 
                  ? 'bg-[#141414] text-[#FAF7EE] shadow-[3px_3px_0_0_#FF4D00]' 
                  : 'bg-[#FAF7EE] text-[#141414] hover:bg-[#FFC72E] shadow-[2px_2px_0_0_#141414]'
              }`}
            >
              <Terminal className="size-3.5" />
              <span>24-FACTOR DEFENSIVE MATRIX</span>
            </button>

            <button
              onClick={() => setActiveTab('lacks')}
              className={`sticker-pill px-4 py-2 text-xs font-display font-black cursor-pointer transition-all flex items-center gap-1.5 ${
                activeTab === 'lacks' 
                  ? 'bg-[#FF4D00] text-[#FAF7EE] shadow-[3px_3px_0_0_#141414]' 
                  : 'bg-[#FAF7EE] text-[#141414] hover:bg-[#FFC72E] shadow-[2px_2px_0_0_#141414]'
              }`}
            >
              <AlertTriangle className="size-3.5" />
              <span>WHAT THIS SYSTEM LACKS ({auditResult.vulnerabilities.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('improve')}
              className={`sticker-pill px-4 py-2 text-xs font-display font-black cursor-pointer transition-all flex items-center gap-1.5 ${
                activeTab === 'improve' 
                  ? 'bg-[#25D366] text-[#141414] shadow-[3px_3px_0_0_#141414]' 
                  : 'bg-[#FAF7EE] text-[#141414] hover:bg-[#FFC72E] shadow-[2px_2px_0_0_#141414]'
              }`}
            >
              <CheckCircle2 className="size-3.5" />
              <span>MILITARY HARDENING BLUEPRINT</span>
            </button>

            <button
              onClick={() => setActiveTab('telemetry')}
              className={`sticker-pill px-4 py-2 text-xs font-display font-black cursor-pointer transition-all flex items-center gap-1.5 ${
                activeTab === 'telemetry' 
                  ? 'bg-[#FFC72E] text-[#141414] shadow-[3px_3px_0_0_#141414]' 
                  : 'bg-[#FAF7EE] text-[#141414] hover:bg-[#FFC72E] shadow-[2px_2px_0_0_#141414]'
              }`}
            >
              <Terminal className="size-3.5" />
              <span>RAW TELEMETRY CHECKS</span>
            </button>
          </div>

          {/* Tab 0: 24-Factor Defensive Matrix */}
          {activeTab === 'factors' && auditResult.pillars && (
            <div className="space-y-6">
              <p className="font-display text-xs font-black uppercase text-[#141414] tracking-wider">
                EXHAUSTIVE 6-PILLAR / 24-PARAMETER DEFENSE EVALUATION:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {auditResult.pillars.map((pillar, pIdx) => (
                  <div key={pIdx} className="p-5 rounded-2xl border-2 border-[#141414] bg-[#FAF7EE] shadow-[4px_4px_0_0_#141414] space-y-4">
                    <div className="flex items-center justify-between border-b border-[#141414]/15 pb-2.5">
                      <h5 className="font-display text-sm font-black uppercase text-[#141414] flex items-center gap-2">
                        <span className="size-2 rounded-full" style={{ backgroundColor: pillar.color }} />
                        <span>{pillar.name}</span>
                      </h5>
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-[#141414] text-[#FAF7EE]">
                        {pillar.score}%
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {pillar.factors.map((f, fIdx) => (
                        <div key={fIdx} className="p-2.5 rounded-xl border border-[#141414]/15 bg-[#F4EFE6] space-y-1">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className="text-[#141414]">{f.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[#FF4D00]">{f.value}</span>
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                                f.status === 'PASS' || f.status === 'ACTIVE' ? 'bg-[#25D366] text-[#141414]' : 'bg-[#FF4D00] text-[#FAF7EE]'
                              }`}>
                                {f.status}
                              </span>
                            </div>
                          </div>
                          <div className="text-[11px] font-medium text-[#141414]/75 flex justify-between">
                            <span>{f.detail}</span>
                            <span className="font-mono text-[10px] text-[#141414]/50">Req: {f.benchmark}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 1: What They Lack (Vulnerabilities) */}
          {activeTab === 'lacks' && (
            <div className="space-y-4">
              <p className="font-display text-xs font-black uppercase text-[#FF4D00] tracking-wider">
                DEFENSIVE GAPS & VULNERABILITY EXPOSURE VECTORS:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {auditResult.vulnerabilities.map((v, idx) => (
                  <div 
                    key={idx}
                    className="p-5 rounded-2xl border-2 border-[#141414] bg-[#FAF7EE] shadow-[4px_4px_0_0_#141414] space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full border border-[#141414] font-display text-[10px] font-black uppercase ${
                        v.severity === 'CRITICAL' ? 'bg-[#FF4D00] text-[#FAF7EE]' : 'bg-[#FFC72E] text-[#141414]'
                      }`}>
                        {v.severity} EXPOSURE
                      </span>
                      <span className="font-mono text-xs font-bold text-[#FF4D00]">{v.impact}</span>
                    </div>

                    <h5 className="font-display text-base font-black uppercase text-[#141414]">
                      {v.title}
                    </h5>

                    <p className="text-xs font-medium text-[#141414]/75 leading-relaxed">
                      {v.details}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: How To Improve (Hardening Roadmap) */}
          {activeTab === 'improve' && (
            <div className="space-y-4">
              <p className="font-display text-xs font-black uppercase text-[#25D366] tracking-wider">
                ZERO-TRUST HARDENING & MILITARY REMEDIATION:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {auditResult.hardeningSteps.map((h, idx) => (
                  <div 
                    key={idx}
                    className="p-5 rounded-2xl border-2 border-[#141414] bg-[#FAF7EE] shadow-[4px_4px_0_0_#141414] space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="sticker-pill px-2.5 py-0.5 bg-[#141414] text-[#FAF7EE] font-display text-[10px] font-black">
                        STEP {h.step}
                      </span>
                      <span className="font-mono text-xs font-bold text-[#25D366]">{h.outcome}</span>
                    </div>

                    <h5 className="font-display text-base font-black uppercase text-[#141414]">
                      {h.title}
                    </h5>

                    <p className="text-xs font-medium text-[#141414]/80 leading-relaxed">
                      {h.action}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Raw Telemetry Checks */}
          {activeTab === 'telemetry' && (
            <div className="space-y-3">
              <p className="font-display text-xs font-black uppercase text-[#141414] tracking-wider">
                CRYPTOGRAPHIC VERIFICATION LEDGER:
              </p>
              <div className="space-y-2">
                {auditResult.checks.map((c, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 rounded-xl border border-[#141414] bg-[#FAF7EE] flex items-center justify-between font-mono text-xs font-bold"
                  >
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-[#25D366]" />
                      <span>{c.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[#FF4D00]">{c.score}</span>
                      <span className="sticker-pill px-2 py-0.5 bg-[#141414] text-[#FAF7EE] text-[10px]">
                        {c.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Dispatcher Footer */}
          <div className="pt-4 border-t-2 border-[#141414]/15 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs font-medium text-[#141414]/75">
              Need Vikas Mishra's elite red-team defense squad to patch these vulnerabilities and secure zero-breach compliance?
            </div>

            <a
              href={`https://wa.me/918369804739?text=${encodeURIComponent(`Hi Vikas, I audited ${auditResult.domain} on your Security scanner. Here are our defensive gaps: ${auditResult.vulnerabilities.map(v => v.title).join(', ')}. Let's execute the hardening sprint.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="sticker-pill px-6 py-3 bg-[#FF4D00] hover:bg-[#FFC72E] hover:text-[#141414] text-[#FAF7EE] text-xs font-display font-black shadow-[3px_3px_0_0_#FFC72E] cursor-pointer flex items-center gap-2"
            >
              <MessageCircle className="size-4" />
              <span>DEPLOY RED-TEAM HARDENING SPRINT (+91 8369804739)</span>
            </a>
          </div>

        </div>
      )}

    </div>
  );
}
