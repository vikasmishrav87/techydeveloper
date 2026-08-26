import React from 'react';
import { Link } from 'react-router-dom';
import LiveAuditScanner from '../components/LiveAuditScanner';
import { SECURITY_FEATURES, CONTACT_INFO } from '../data/agencyData';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Shield, Lock, ArrowLeft, MessageCircle, ArrowRight, ShieldCheck, Key, Zap, CheckCircle2, AlertOctagon, Terminal } from 'lucide-react';

export default function SecurityAuditPage() {
  useScrollReveal();

  const attackVectorsEliminated = [
    {
      title: "Cross-Site Scripting (XSS) & Code Injection",
      desc: "Strict Content-Security-Policy (CSP) headers with cryptographic nonces and sanitized DOM execution pipelines eliminate unauthorized script execution.",
      mitigation: "Strict CSP + Contextual Escaping"
    },
    {
      title: "Clickjacking & UI Redress Attacks",
      desc: "X-Frame-Options: DENY and frame-ancestors directives guarantee your authenticated application interfaces can never be framed inside malicious third-party wrappers.",
      mitigation: "Frame-Ancestors Directives"
    },
    {
      title: "Smart Contract Reentrancy & Logic Exploits",
      desc: "Formal bytecode decompilation, mathematical property testing with Foundry & Slither, and automated invariant fuzzing prevent DeFi drainage.",
      mitigation: "Formal Mathematical Verification"
    },
    {
      title: "Volumetric Layer-7 DDoS & Bot Floods",
      desc: "Custom token-bucket rate limiting and intelligent perimeter heuristics drop malicious traffic spikes in sub-3.8ms before touching origin databases.",
      mitigation: "Edge WAF Token Bucket Defense"
    },
    {
      title: "Man-In-The-Middle (MITM) & SSL Stripping",
      desc: "HSTS preloading with max-age=31536000 and TLS 1.3 cipher pinning force full end-to-end encrypted transport across all subdomains.",
      mitigation: "HSTS Preload + TLS 1.3"
    },
    {
      title: "Information Disclosure & Reconnaissance",
      desc: "Complete stripping of Server, X-Powered-By, and verbose exception stack traces prevents automated scrapers from mapping your backend attack surface.",
      mitigation: "Header Sanitization & Enclaves"
    }
  ];

  return (
    <div className="min-h-screen bg-sky-lavender-mesh text-slate-900 pt-28 pb-24 font-sans">
      
      {/* Back to Home link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 reveal-on-scroll">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-sky-700 font-medium transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>

      {/* Main Interactive Live Security Auditor Tool */}
      <div className="reveal-on-scroll">
        <LiveAuditScanner />
      </div>

      {/* Military-Grade Security Architecture Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        
        <div className="text-center mb-16 reveal-on-scroll max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-sky-200 text-sky-800 text-xs font-mono uppercase tracking-widest mb-4 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
            Zero-Breach Guarantee
          </div>
          <h2 className="text-3xl md:text-5xl font-light text-slate-950 mb-6">
            Military-Grade <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600 font-normal">Defensive Engineering</span>
          </h2>
          <p className="text-lg text-slate-700 font-normal leading-relaxed">
            Every system audited and hardened by our 1,000+ senior engineer collective adheres to strict zero-trust standards, cryptographic verification, and 24/7 proactive NOC monitoring.
          </p>
        </div>

        {/* Security Core Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {SECURITY_FEATURES.map((feature, idx) => (
            <div key={idx} className="bg-white/90 backdrop-blur-md p-8 rounded-3xl border border-indigo-100 reveal-on-scroll shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center mb-6 text-sky-600">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-950 mb-2">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed font-normal text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Attack Vectors Eliminated Breakdown */}
        <div className="bg-white/95 rounded-3xl p-8 sm:p-12 border border-indigo-100 shadow-sm mb-20 reveal-on-scroll">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-mono uppercase text-sky-700 tracking-wider font-semibold">Threat Vector Neutralization</span>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-950 mt-1">Attack Vectors Our Squads Eliminate</h3>
            <p className="text-xs text-slate-600 mt-2">Comprehensive defensive engineering against the most critical web, cloud, and smart contract attack vectors.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attackVectorsEliminated.map((vec, vIdx) => (
              <div key={vIdx} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2">
                  <AlertOctagon className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                  <h4 className="text-sm font-bold text-slate-950">{vec.title}</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">{vec.desc}</p>
                <div className="pt-2 border-t border-slate-200 text-[11px] font-mono text-emerald-700 font-semibold">
                  ✓ {vec.mitigation}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Consultation Card */}
        <div className="text-center reveal-on-scroll bg-white/95 rounded-3xl p-10 border border-indigo-100 shadow-sm">
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-950 mb-3">Protect your infrastructure before an exploit happens</h3>
          <p className="text-slate-600 max-w-xl mx-auto mb-8 text-sm leading-relaxed">
            Connect directly with Vikas Mishra & our Red/Blue security engineering squad on WhatsApp to schedule an intensive black-box penetration test, smart contract audit, and automated CI/CD security gate.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={`https://wa.me/919137507092?text=Hi%20Vikas,%20I%20want%20to%20schedule%20a%20military-grade%20security%20audit%20and%20penetration%20test.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-base transition-all shadow-md shadow-emerald-600/20 hover:scale-105"
            >
              <MessageCircle className="w-5 h-5" /> Request Audit on WhatsApp (+91 91375 07092)
            </a>
            <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-medium text-base transition-all shadow-sm hover:scale-105">
              <Lock className="w-5 h-5" /> Schedule Full Security Review
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
