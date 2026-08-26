import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, CheckCircle2, Cookie, Database, ArrowRight } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#030712] text-slate-100 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        
        {/* Header */}
        <div className="mb-12 pb-8 border-b border-slate-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/80 border border-sky-500/30 text-sky-400 text-[11px] font-mono uppercase tracking-wider mb-4">
            <Lock className="w-3.5 h-3.5" />
            Zero-Trust Privacy Standard
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
            Global Privacy & Cookie Policy
          </h1>
          <p className="text-sm text-slate-400 font-light leading-relaxed">
            GDPR, CCPA & Cryptographic Security Telemetry Compliance • Version 2026.4
          </p>
        </div>

        {/* Policy Body */}
        <div className="space-y-10 text-slate-300 text-sm leading-relaxed font-light">
          
          <section className="p-6 rounded-3xl bg-obsidian-900 border border-slate-800 space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-sky-400 font-mono">1.</span>
              Information We Collect
            </h2>
            <p>
              When you interact with The Unfiltered Engineer platform, we collect technical data essential for service delivery:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-400 pl-2">
              <li><strong className="text-slate-200">Account Identity Data:</strong> Verified Google Name, Email, Profile Picture, and Google Sub ID during OAuth login, or Work Email during direct sign-up.</li>
              <li><strong className="text-slate-200">Security & SEO Telemetry:</strong> Target URLs submitted for automated penetration testing and audit scoring.</li>
              <li><strong className="text-slate-200">Project Scoping Metadata:</strong> Selected engineering practices, estimated timeline velocity, and squad scale parameters.</li>
            </ul>
          </section>

          <section className="p-6 rounded-3xl bg-obsidian-900 border border-slate-800 space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-sky-400 font-mono">2.</span>
              Cookie Classifications & Consent Controls
            </h2>
            <p>
              In accordance with international privacy regulations, our cookie classifications include:
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-obsidian-950 border border-slate-800">
                <strong className="text-emerald-400">Strictly Necessary Cookies:</strong> Essential for session authentication, cryptographic token validation, and account security. Cannot be disabled.
              </div>
              <div className="p-3 rounded-xl bg-obsidian-950 border border-slate-800">
                <strong className="text-sky-400">Telemetry & Performance Cookies:</strong> Used to record live zero-trust security scan logs, system response times, and prevent DDoS abuse.
              </div>
            </div>
          </section>

          <section className="p-6 rounded-3xl bg-obsidian-900 border border-slate-800 space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-sky-400 font-mono">3.</span>
              Data Protection & Zero Third-Party Monetization
            </h2>
            <p>
              <strong className="text-white">We never sell, monetize, or rent your personal or technical data to third-party advertisers.</strong> All data is used strictly for engineering execution, audit generation, and direct communication with Vikas Mishra and assigned squad leads.
            </p>
          </section>

          <section className="p-6 rounded-3xl bg-obsidian-900 border border-slate-800 space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-sky-400 font-mono">4.</span>
              Your Rights & Account Deletion
            </h2>
            <p>
              You have the right to request a full export of your registered data, or request permanent deletion of your profile and audit records by contacting the Executive Admin via the portal or direct WhatsApp concierge.
            </p>
          </section>

        </div>

        {/* Footer Actions */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <Link to="/" className="text-sky-400 hover:underline">← Return to Homepage</Link>
          <Link to="/terms" className="text-sky-400 hover:underline">Read Terms of Service →</Link>
        </div>

      </div>
    </div>
  );
}
