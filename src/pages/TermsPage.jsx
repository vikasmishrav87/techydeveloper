import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, FileText, CheckCircle2, AlertTriangle, Scale, ArrowRight, Clock, Award } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#030712] text-slate-100 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        
        {/* Header */}
        <div className="mb-12 pb-8 border-b border-slate-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/80 border border-sky-500/30 text-sky-400 text-[11px] font-mono uppercase tracking-wider mb-4">
            <Scale className="w-3.5 h-3.5" />
            Legal & Governance Agreement
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
            Terms of Service & Master Services Agreement
          </h1>
          <p className="text-sm text-slate-400 font-light leading-relaxed">
            Effective Date: Current & In Full Force • Version 2026.4 • Applicable to all Global Engineering Solutions & Platform Users.
          </p>
        </div>

        {/* Legal Body Sections */}
        <div className="space-y-10 text-slate-300 text-sm leading-relaxed font-light">
          
          {/* Section 1 */}
          <section className="p-6 rounded-3xl bg-obsidian-900 border border-slate-800 space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-sky-400 font-mono">1.</span>
              Acceptance of Terms & Unilateral Modification Rights
            </h2>
            <p>
              By accessing, browsing, registering an account on, or engaging the engineering collective of <strong className="text-white">The Unfiltered Engineer</strong> ("Company", "Platform", "we", "us"), you ("Client", "User", "Member") agree to be bound by these Terms of Service.
            </p>
            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs leading-relaxed">
              <strong>⚠️ Critical Modification Clause:</strong> The Administrator and Executive Management of The Unfiltered Engineer expressly reserve the unilateral right to amend, revise, modify, or update these Terms, service pricing, subscription tiers, SLA parameters, and operational policies at any time at its sole discretion without prior notice. Continued use of the Platform after changes constitutes irrevocable acceptance of the revised Terms.
            </div>
          </section>

          {/* Section 2 */}
          <section className="p-6 rounded-3xl bg-obsidian-900 border border-slate-800 space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-sky-400 font-mono">2.</span>
              Executive Administrator Authority & Account Suspension
            </h2>
            <p>
              The Executive Administrator (<strong className="text-sky-300">Vikas Mishra / vikasmishraji87</strong>) retains exclusive, absolute authority to manage, audit, upgrade, downgrade, suspend, or permanently terminate any user account, API access, or subscription tier if an account is determined to be involved in:
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-400 pl-2">
              <li>Unauthorized reverse engineering or vulnerability exploitation of the platform infrastructure.</li>
              <li>Misuse of automated penetration testing tools or Live Security Scanners on unauthorized third-party targets.</li>
              <li>Breach of retainer payment obligations or non-disclosure agreements.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="p-6 rounded-3xl bg-obsidian-900 border border-slate-800 space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-sky-400 font-mono">3.</span>
              Intellectual Property, Code Ownership & Delivery
            </h2>
            <p>
              All proprietary algorithms, AI swarm orchestrators, zero-trust telemetry engines, architectural blueprints, and platform UI components developed by The Unfiltered Engineer remain the exclusive intellectual property of the Company until explicitly assigned under a formalized Master Services Agreement (MSA) or Statement of Work (SOW).
            </p>
            <p className="text-xs text-slate-400">
              Custom software code delivered under paid dedicated engineering squad contracts is assigned to the Client upon full clearance of all milestone invoices.
            </p>
          </section>

          {/* Section 4 */}
          <section className="p-6 rounded-3xl bg-obsidian-900 border border-slate-800 space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-sky-400 font-mono">4.</span>
              Strict Non-Disclosure (Zero-Trust NDA)
            </h2>
            <p>
              All technical specifications, codebase audits, smart contract formal verifications, and architectural diagrams shared through the platform or direct VIP communication channels are treated as strictly confidential proprietary information. Neither party shall disclose technical IP without express written consent.
            </p>
          </section>

          {/* Section 5 */}
          <section className="p-6 rounded-3xl bg-obsidian-900 border border-slate-800 space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-sky-400 font-mono">5.</span>
              Subscription Tiers, Squad Retainers & Cancellation
            </h2>
            <p>
              Memberships and retainer tiers (<strong className="text-slate-200">Free Explorer, Pro Engineering Member, Enterprise Dedicated Retainer</strong>) provide tier-specific SLA access. The Administrator reserves the right to adjust squad allocations, delivery velocities, and tooling features to maintain global system stability.
            </p>
          </section>

          {/* Section 6 */}
          <section className="p-6 rounded-3xl bg-obsidian-900 border border-slate-800 space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-sky-400 font-mono">6.</span>
              Limitation of Liability & Warranty Disclaimers
            </h2>
            <p className="text-xs text-slate-400">
              The Platform and its automated audit tools are provided on an "AS IS" and "AS AVAILABLE" basis. While our 1,000+ senior engineer collective maintains military-grade quality standards, The Unfiltered Engineer disclaims liability for indirect, incidental, or consequential damages resulting from third-party hosting outages, upstream API changes, or unauthorized system breaches.
            </p>
          </section>

          {/* Section 7 */}
          <section className="p-6 rounded-3xl bg-obsidian-900 border border-slate-800 space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-sky-400 font-mono">7.</span>
              Governing Law & Legal Jurisdiction
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with applicable corporate laws, with primary dispute resolution handled via expedited binding commercial arbitration.
            </p>
          </section>

        </div>

        {/* Footer Actions */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <Link to="/" className="text-sky-400 hover:underline">← Return to Homepage</Link>
          <Link to="/privacy" className="text-sky-400 hover:underline">Read Privacy Policy →</Link>
        </div>

      </div>
    </div>
  );
}
