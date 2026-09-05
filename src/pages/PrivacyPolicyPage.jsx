import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, Lock, Eye, Database, Globe, FileText, 
  CheckCircle2, AlertCircle, ArrowRight, MessageCircle, Mail, Clock, Scale 
} from 'lucide-react';
import BigCtaBanner from '../components/BigCtaBanner';

export default function PrivacyPolicyPage() {
  const sections = [
    {
      id: 'scope',
      title: '1. INTRODUCTION & SCOPE OF THIS POLICY',
      content: (
        <div className="space-y-3">
          <p>
            Welcome to <strong>The Unfiltered Engineer</strong> ("we", "our", "us", or "the Studio"), operated under the executive direction of <strong>Vikas Sunil Mishra</strong>. This Privacy Policy describes in complete transparency how we collect, process, store, disclose, and protect your information when you visit our website (<strong>https://theunfilteredengineer.vercel.app</strong>), utilize our live diagnostic telemetry tools, engage our engineering squads, or communicate with our team.
          </p>
          <p>
            We adhere to the highest global data privacy benchmarks, including the <strong>European Union General Data Protection Regulation (GDPR)</strong>, the <strong>United Kingdom Data Protection Act 2018 (UK GDPR)</strong>, the <strong>California Consumer Privacy Act (CCPA/CPRA)</strong>, the <strong>India Digital Personal Data Protection Act (DPDP)</strong>, and global zero-trust cybersecurity standards.
          </p>
          <div className="p-3.5 rounded-2xl bg-[#FAF7EE] border border-[#141414] text-xs font-bold">
            <span className="text-[#FF4D00]">DATA CONTROLLER: </span>
            The Unfiltered Engineer • Principal: Vikas Sunil Mishra • Enterprise Contact: <a href="mailto:theunfilteredengineersupport@gmail.com" className="underline text-[#141414]">theunfilteredengineersupport@gmail.com</a>
          </div>
        </div>
      )
    },
    {
      id: 'collection',
      title: '2. INFORMATION WE COLLECT',
      content: (
        <div className="space-y-4">
          <p>We collect information across three primary operational categories:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div className="p-4 rounded-2xl bg-[#FAF7EE] border border-[#141414] space-y-2">
              <div className="text-xs font-display font-black uppercase text-[#FF4D00]">A. Information You Provide</div>
              <ul className="text-xs space-y-1.5 list-disc list-inside text-[#141414]/80">
                <li>Architecture briefs & inquiry details</li>
                <li>Full name, corporate email & phone number</li>
                <li>WhatsApp & Telegram handles</li>
                <li>Project scope & infrastructure requirements</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7EE] border border-[#141414] space-y-2">
              <div className="text-xs font-display font-black uppercase text-[#25D366]">B. Transaction Proof Data</div>
              <ul className="text-xs space-y-1.5 list-disc list-inside text-[#141414]/80">
                <li>Bank UTR numbers & wire proof slips</li>
                <li>UPI transaction reference numbers</li>
                <li>Web3 blockchain TX hashes (Polygon/USDT)</li>
                <li><em>Zero raw credit card/CVC numbers stored</em></li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7EE] border border-[#141414] space-y-2">
              <div className="text-xs font-display font-black uppercase text-[#FFC72E]">C. Diagnostic Telemetry</div>
              <ul className="text-xs space-y-1.5 list-disc list-inside text-[#141414]/80">
                <li>Public domain URLs submitted for audit</li>
                <li>TLS handshake, CSP & header response codes</li>
                <li>Lighthouse Core Web Vitals speed scores</li>
                <li>IP address & browser user-agent for rate-limiting</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'usage',
      title: '3. HOW WE USE YOUR INFORMATION',
      content: (
        <div className="space-y-3">
          <p>We process personal data strictly for legitimate, declared engineering and business objectives:</p>
          <ul className="space-y-2 text-xs">
            <li className="flex items-start gap-2">
              <span className="size-2 rounded-full bg-[#FF4D00] flex-shrink-0 mt-1" />
              <span><strong>Engineering Squad Assembly & Delivery:</strong> To review technical project specifications, assemble specialized software/security engineers, and execute contractual deliverables.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="size-2 rounded-full bg-[#25D366] flex-shrink-0 mt-1" />
              <span><strong>Payment Authentication & Verification:</strong> To reconcile incoming wire transfers, UPI payments, and cryptocurrency settlements within our live executive ledger overseen by Vikas Mishra.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="size-2 rounded-full bg-[#FFC72E] flex-shrink-0 mt-1" />
              <span><strong>Defensive Security Scans & SEO Telemetry:</strong> To generate dynamic 24-factor diagnostic reports on public websites entered into our free audit sandboxes.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="size-2 rounded-full bg-[#141414] flex-shrink-0 mt-1" />
              <span><strong>Security & Threat Mitigation:</strong> To detect malicious bots, prevent volumetric DDoS attacks, block unauthorized API scraping, and enforce eBPF kernel WAF rules.</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 'legal-basis',
      title: '4. LEGAL BASES FOR PROCESSING (GDPR & UK GDPR)',
      content: (
        <div className="space-y-3">
          <p>Under Article 6 of the EU/UK GDPR, our lawful processing bases include:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-[#FAF7EE] border border-[#141414]">
              <strong className="text-[#FF4D00] text-xs uppercase block mb-1">Contractual Necessity</strong>
              <p className="text-xs text-[#141414]/80">Processing necessary to enter into or execute client engineering and milestone agreements.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#FAF7EE] border border-[#141414]">
              <strong className="text-[#25D366] text-xs uppercase block mb-1">Legitimate Business Interests</strong>
              <p className="text-xs text-[#141414]/80">Maintaining zero-trust application security, preventing fraud, and optimizing infrastructure latency.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#FAF7EE] border border-[#141414]">
              <strong className="text-[#FFC72E] text-xs uppercase block mb-1">Explicit User Consent</strong>
              <p className="text-xs text-[#141414]/80">Where you voluntarily submit technical audit URLs or opt into direct WhatsApp/email communications.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#FAF7EE] border border-[#141414]">
              <strong className="text-[#141414] text-xs uppercase block mb-1">Legal Compliance</strong>
              <p className="text-xs text-[#141414]/80">Fulfilling statutory tax, financial auditing, and corporate accounting obligations.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'sharing',
      title: '5. DATA SHARING & SUB-PROCESSOR DISCLOSURES',
      content: (
        <div className="space-y-3">
          <p>
            <strong>We strictly NEVER sell, rent, monetize, or trade your personal data with third-party advertising brokers or data aggregators.</strong>
          </p>
          <p className="text-xs">We only share data with vetted infrastructure sub-processors necessary to run the platform:</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-[#FAF7EE] border border-[#141414] text-center">
              <strong>Vercel</strong>
              <div className="text-[10px] text-[#141414]/60">Global Edge Hosting</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#FAF7EE] border border-[#141414] text-center">
              <strong>Supabase</strong>
              <div className="text-[10px] text-[#141414]/60">Encrypted PostgreSQL</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#FAF7EE] border border-[#141414] text-center">
              <strong>Cloudflare</strong>
              <div className="text-[10px] text-[#141414]/60">Edge WAF & DNS</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#FAF7EE] border border-[#141414] text-center">
              <strong>WhatsApp Business</strong>
              <div className="text-[10px] text-[#141414]/60">End-to-End Chat</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'cookies',
      title: '6. COOKIES, PIXELS & FIRST-PARTY TRACKING',
      content: (
        <div className="space-y-3">
          <p>
            We respect the <strong>ePrivacy Directive</strong> and <strong>Google Consent Mode v2</strong>. Our platform utilizes:
          </p>
          <ul className="text-xs space-y-1.5 list-disc list-inside text-[#141414]/80">
            <li><strong>Strictly Necessary Cookies:</strong> Required for secure session persistence, CSRF protection, and executive passkey gateway authentication.</li>
            <li><strong>Functional Preferences:</strong> Stores your currency display toggle ($ USD / ₹ INR) and consent choice locally in your browser storage.</li>
            <li><strong>First-Party Attribution Telemetry:</strong> Optional server-side CAPI events to measure campaign conversion without tracking cross-site browsing history.</li>
          </ul>
          <p className="text-xs text-[#141414]/75">
            You can modify your cookie preferences at any time via your browser settings or our interactive bottom cookie banner.
          </p>
        </div>
      )
    },
    {
      id: 'transfers',
      title: '7. INTERNATIONAL DATA TRANSFERS & CROSS-BORDER SAFEGUARDS',
      content: (
        <div className="space-y-3">
          <p>
            As a global engineering agency serving clients across North America, Europe, Asia-Pacific, and the Middle East, information may be transferred to and processed in global edge server regions.
          </p>
          <p className="text-xs text-[#141414]/80">
            All cross-border transfers from the EEA, UK, or Switzerland to third countries are governed by <strong>Standard Contractual Clauses (SCCs)</strong> approved by the European Commission, combined with strict end-to-end TLS 1.3 in-transit encryption and AES-256 data-at-rest encryption.
          </p>
        </div>
      )
    },
    {
      id: 'retention',
      title: '8. DATA RETENTION & SCHEDULED PURGING',
      content: (
        <div className="space-y-3">
          <p>We do not retain personal information longer than necessary:</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#FAF7EE] border border-[#141414]">
              <strong className="text-[#141414] block mb-1">Inquiry Briefs</strong>
              <p className="text-[#141414]/70">Retained for 12 months for quote follow-up, or purged immediately upon client request.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#FAF7EE] border border-[#141414]">
              <strong className="text-[#141414] block mb-1">Financial Invoices</strong>
              <p className="text-[#141414]/70">Retained for 7 years to satisfy statutory tax, corporate, and banking audit regulations.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#FAF7EE] border border-[#141414]">
              <strong className="text-[#141414] block mb-1">Scanner Telemetry</strong>
              <p className="text-[#141414]/70">Transient domain scans are discarded after session generation; anonymous scores cached 24h.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'rights',
      title: '9. YOUR GLOBAL PRIVACY RIGHTS & CONTROLS',
      content: (
        <div className="space-y-3">
          <p>Regardless of your geographic location, you enjoy full sovereignty over your personal data:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#FAF7EE] border border-[#141414]">
              <strong className="text-[#FF4D00] block mb-1">Right of Access & Portability</strong>
              <p className="text-[#141414]/80">Request a complete machine-readable copy (JSON/CSV) of all personal data held in our ledgers.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#FAF7EE] border border-[#141414]">
              <strong className="text-[#25D366] block mb-1">Right to Erasure ("Right to Be Forgotten")</strong>
              <p className="text-[#141414]/80">Request immediate deletion of all non-statutory communication logs and contact records.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#FAF7EE] border border-[#141414]">
              <strong className="text-[#FFC72E] block mb-1">Right to Rectification</strong>
              <p className="text-[#141414]/80">Update or correct inaccurate corporate details, billing information, or contact credentials.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#FAF7EE] border border-[#141414]">
              <strong className="text-[#141414] block mb-1">Right to Object & Non-Discrimination</strong>
              <p className="text-[#141414]/80">Opt out of communications at any time with zero penalty or reduction in service quality.</p>
            </div>
          </div>
          <p className="text-xs text-[#141414]/80 pt-1">
            To exercise any of these rights, email us at <a href="mailto:theunfilteredengineersupport@gmail.com" className="underline font-bold text-[#FF4D00]">theunfilteredengineersupport@gmail.com</a>. We respond to all verified requests within <strong>48 hours</strong>.
          </p>
        </div>
      )
    },
    {
      id: 'security',
      title: '10. ZERO-TRUST CRYPTOGRAPHIC SECURITY SAFEGUARDS',
      content: (
        <div className="space-y-3">
          <p>
            We implement military-grade defense architectures to protect all client assets and data streams:
          </p>
          <ul className="text-xs space-y-1.5 list-disc list-inside text-[#141414]/80">
            <li><strong>Transport Security:</strong> Strict TLS 1.3 encryption with 2-year HSTS preload and modern cipher suites (AES-256-GCM / ChaCha20).</li>
            <li><strong>Access Control:</strong> Zero-Trust role-based access control (RBAC), multi-factor hardware authentication (WebAuthn/FIDO2), and WireGuard mTLS bastions.</li>
            <li><strong>Secrets Isolation:</strong> Cryptographic secrets and API keys isolated in HashiCorp Vault with automated 30-day rotation.</li>
            <li><strong>Edge WAF Protection:</strong> Real-time eBPF kernel packet inspection neutralizing volumetric Layer-7 DDoS and injection exploits.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'children',
      title: "11. CHILDREN'S PRIVACY PROTECTION",
      content: (
        <p className="text-xs leading-relaxed text-[#141414]/80">
          Our services are exclusively tailored for enterprise businesses, software founders, and technical professionals. We do not knowingly collect or solicit personal information from children under the age of 18. If you believe a minor has submitted personal details, contact us immediately for expedited deletion.
        </p>
      )
    },
    {
      id: 'updates',
      title: '12. UPDATES TO THIS PRIVACY POLICY',
      content: (
        <div className="space-y-2 text-xs text-[#141414]/80">
          <p>
            We may revise this Privacy Policy periodically to reflect infrastructure upgrades, new regulatory requirements, or service expansions. Any updates will be published on this page with an updated "Last Modified" timestamp. Continued engagement with our studio following policy amendments constitutes acknowledgment of the revised terms.
          </p>
          <p className="font-bold text-[#141414]">
            Current Version: 2026.4.1 • Last Modified: September 1, 2026
          </p>
        </div>
      )
    },
    {
      id: 'contact',
      title: '13. DATA PROTECTION OFFICER & ENTERPRISE CONTACT',
      content: (
        <div className="space-y-3 text-xs">
          <p>For any privacy inquiries, data subject access requests, or security vulnerability disclosures, contact our executive office directly:</p>
          
          <div className="p-4 rounded-2xl bg-[#141414] text-[#FAF7EE] space-y-2 border-2 border-[#141414]">
            <div className="font-display font-black text-sm text-[#FFC72E] uppercase">THE UNFILTERED ENGINEER • EXECUTIVE DATA DESK</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#FAF7EE]/80">
              <div><strong>Founder & Controller:</strong> Vikas Sunil Mishra</div>
              <div><strong>Support Email:</strong> <a href="mailto:theunfilteredengineersupport@gmail.com" className="text-[#FFC72E] underline">theunfilteredengineersupport@gmail.com</a></div>
              <div><strong>WhatsApp / Phone:</strong> <a href="https://wa.me/918369804739" className="text-[#25D366] underline">+91 8369804739</a></div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-20 bg-[#FAF7EE] text-[#141414] font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        
        {/* Top Header */}
        <div className="mb-10 pb-6 border-b-2 border-[#141414]/15">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFC72E] border-2 border-[#141414] text-[#141414] font-display text-xs font-black uppercase shadow-[2px_2px_0_0_#141414]">
              <ShieldCheck className="size-3.5" />
              <span>GLOBAL ENTERPRISE PRIVACY STANDARDS</span>
            </div>
            <span className="sticker-pill px-3 py-1 bg-[#25D366] text-[#141414] text-xs font-display font-black uppercase shadow-[2px_2px_0_0_#141414]">
              GDPR • CCPA • DPDP COMPLIANT
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#141414] leading-[0.98]">
            PRIVACY POLICY & DATA GOVERNANCE
          </h1>

          <p className="text-xs sm:text-sm text-[#141414]/80 font-medium mt-3 max-w-3xl leading-relaxed">
            The Unfiltered Engineer operates under a strict zero-data-monetization philosophy. We do not sell, rent, or trade client telemetry. All architecture briefs, UTR transaction records, and security scans are protected by cryptographic safeguards.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-4 text-xs font-mono font-bold text-[#141414]/70">
            <span>FOUNDER: <strong>VIKAS SUNIL MISHRA</strong></span>
            <span>•</span>
            <span>EFFECTIVE: <strong>SEPTEMBER 2026 (v2026.4)</strong></span>
            <span>•</span>
            <span>SUPPORT: <strong>theunfilteredengineersupport@gmail.com</strong></span>
          </div>
        </div>

        {/* Navigation Quick Links */}
        <div className="mb-8 p-4 rounded-2xl bg-[#F4EFE6] border-2 border-[#141414] shadow-[4px_4px_0_0_#141414]">
          <div className="text-xs font-display font-black uppercase text-[#FF4D00] mb-2.5 flex items-center gap-2">
            <FileText className="size-3.5" />
            <span>POLICY TABLE OF CONTENTS</span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-display font-bold">
            {sections.map((sec, idx) => (
              <a
                key={sec.id}
                href={'#' + sec.id}
                className="sticker-pill px-3 py-1 bg-[#FAF7EE] hover:bg-[#FFC72E] text-[#141414] text-[11px] shadow-[2px_2px_0_0_#141414] transition-colors"
              >
                {idx + 1}. {sec.title.split('. ')[1] || sec.title}
              </a>
            ))}
          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-6">
          {sections.map((sec) => (
            <section
              key={sec.id}
              id={sec.id}
              className="p-6 sm:p-8 rounded-3xl border-2 border-[#141414] bg-[#F4EFE6] shadow-[5px_5px_0_0_#141414] space-y-4 scroll-mt-28 transition-all hover:-translate-y-0.5"
            >
              <h2 className="font-display text-lg sm:text-xl font-black uppercase text-[#141414] border-b border-[#141414]/15 pb-2">
                {sec.title}
              </h2>
              <div className="text-xs sm:text-sm leading-relaxed text-[#141414]/85 font-medium">
                {sec.content}
              </div>
            </section>
          ))}
        </div>

        {/* Bottom Support Actions */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl border-2 border-[#141414] bg-[#FFC72E] text-[#141414] shadow-[6px_6px_0_0_#141414] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-xl sm:text-2xl font-black uppercase">HAVE A PRIVACY QUESTION OR AUDIT REQUEST?</h3>
            <p className="text-xs sm:text-sm font-medium text-[#141414]/80 mt-1">
              Contact Vikas Mishra directly via official support email or WhatsApp for privacy concerns.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="mailto:theunfilteredengineersupport@gmail.com"
              className="sticker-pill px-6 py-3 bg-[#141414] hover:bg-[#FF4D00] text-[#FAF7EE] text-xs font-display font-black shadow-[3px_3px_0_0_#FF4D00] cursor-pointer flex items-center gap-2"
            >
              <Mail className="size-4" />
              <span>EMAIL SUPPORT</span>
            </a>

            <a
              href="https://wa.me/918369804739?text=Hi%20Vikas%2C%20I%20have%20a%20question%20regarding%20The%20Unfiltered%20Engineer%20Privacy%20Policy."
              target="_blank"
              rel="noopener noreferrer"
              className="sticker-pill px-6 py-3 bg-[#25D366] text-[#141414] text-xs font-display font-black shadow-[3px_3px_0_0_#141414] cursor-pointer flex items-center gap-2"
            >
              <MessageCircle className="size-4" />
              <span>WHATSAPP (+91 8369804739)</span>
            </a>
          </div>
        </div>

      </div>

      <div className="mt-16">
        <BigCtaBanner />
      </div>
    </div>
  );
}
