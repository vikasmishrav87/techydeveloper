import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Scale, ShieldCheck, ArrowRight, FileText, CheckCircle2, 
  AlertTriangle, MessageCircle, Mail, DollarSign, Globe 
} from 'lucide-react';
import BigCtaBanner from '../components/BigCtaBanner';

export default function TermsPage() {
  const sections = [
    {
      id: 'acceptance',
      title: '1. ACCEPTANCE OF MASTER GOVERNANCE TERMS',
      content: (
        <div className="space-y-3">
          <p>
            By accessing the website at <strong>https://theunfilteredengineer.vercel.app</strong>, submitting architecture briefs, utilizing our live telemetry audit scanners, or engaging engineering squads from <strong>The Unfiltered Engineer</strong> ("the Studio", "we", "us"), operated under the leadership of <strong>Vikas Sunil Mishra</strong>, you agree to be bound by these Terms of Service.
          </p>
          <p className="text-xs text-[#141414]/80">
            If you are entering into this agreement on behalf of a corporation, venture-backed startup, or legal entity, you represent that you possess the full legal authority to bind that entity to these governance provisions.
          </p>
        </div>
      )
    },
    {
      id: 'services',
      title: '2. ENGINEERING SCOPE & SQUAD ENGAGEMENT',
      content: (
        <div className="space-y-3">
          <p>
            The Unfiltered Engineer delivers specialized high-throughput software architecture, offensive cybersecurity auditing, smart contract / Web3 protocols, AI neural swarm automation, and 360° technical growth engineering.
          </p>
          <ul className="text-xs space-y-1.5 list-disc list-inside text-[#141414]/80">
            <li><strong>Deliverables:</strong> Defined exclusively in mutual project milestone blueprints agreed upon prior to code deployment.</li>
            <li><strong>Sprint Execution:</strong> Dedicated engineering squads work in rapid milestone sprints with verified QA testing.</li>
            <li><strong>Infrastructure Governance:</strong> Production deployments are executed directly to client-controlled cloud environments (AWS, GCP, Cloudflare, Vercel, Supabase).</li>
          </ul>
        </div>
      )
    },
    {
      id: 'payment',
      title: '3. PRICING, CONVERSION RATE & ESCROW SETTLEMENT',
      content: (
        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-[#FFC72E] border-2 border-[#141414] text-xs font-black uppercase text-[#141414]">
            FIXED CONVERSION STANDARD: $1.00 USD = ₹100.00 INR (PEGGED ENTERPRISE RATE)
          </div>
          <p className="text-xs leading-relaxed text-[#141414]/80">
            All pricing tiers, custom quotes, and milestone invoices are denominated in USD and payable via:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
            <div className="p-3 rounded-xl bg-[#FAF7EE] border border-[#141414]">
              <strong>UPI Gateway:</strong>
              <div className="text-[11px] text-[#141414]/70 mt-0.5">Google Pay / PhonePe / Paytm</div>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF7EE] border border-[#141414]">
              <strong>SBI Bank Wire:</strong>
              <div className="text-[11px] text-[#141414]/70 mt-0.5">NEFT / RTGS / IMPS Wire</div>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF7EE] border border-[#141414]">
              <strong>Web3 Settlement:</strong>
              <div className="text-[11px] text-[#141414]/70 mt-0.5">USDT / USDC on Polygon</div>
            </div>
          </div>
          <p className="text-xs text-[#141414]/80">
            All transactions require submitter UTR / transaction hash verification and manual authorization by Founder Vikas Mishra before squad deployment.
          </p>
        </div>
      )
    },
    {
      id: 'ip',
      title: '4. INTELLECTUAL PROPERTY & 100% CODE TRANSFER',
      content: (
        <div className="space-y-3">
          <p>
            <strong>Client Sovereignty:</strong> Upon 100% financial settlement of the agreed project milestones, all bespoke source code, schema migrations, documentation, smart contracts, CI/CD pipelines, and proprietary assets transfer irrevocably to the client.
          </p>
          <p className="text-xs text-[#141414]/80">
            The Studio retains zero proprietary vendor lock-in claims. Clients receive full repository root ownership and commercial deployment rights worldwide.
          </p>
        </div>
      )
    },
    {
      id: 'confidentiality',
      title: '5. MUTUAL NON-DISCLOSURE & TRADE SECRETS',
      content: (
        <div className="space-y-3">
          <p className="text-xs leading-relaxed text-[#141414]/80">
            Both parties agree to hold all proprietary trade secrets, unreleased codebase architectures, cryptographic keys, business strategies, and user data in strict confidence. The Studio enforces zero-logging policies and does not share confidential architecture dossiers with third parties without explicit written consent.
          </p>
        </div>
      )
    },
    {
      id: 'liability',
      title: '6. LIMITATION OF LIABILITY & WARRANTY DISCLAIMER',
      content: (
        <div className="space-y-3 text-xs text-[#141414]/80 leading-relaxed">
          <p>
            While all codebases, smart contracts, and infrastructure blueprints undergo rigorous testing, live telemetry scanning, and zero-trust verification, the Studio's total cumulative liability arising from any contract or service shall not exceed the total fees paid by the client under the specific Statement of Work (SOW).
          </p>
          <p>
            In no event shall either party be liable for indirect, incidental, punitive, or consequential damages resulting from third-party hosting outages, blockchain network reorganizations, or unapproved client modifications.
          </p>
        </div>
      )
    },
    {
      id: 'termination',
      title: '7. TERMINATION & MILESTONE SETTLEMENT',
      content: (
        <p className="text-xs leading-relaxed text-[#141414]/80">
          Either party may terminate an ongoing engagement with 14 calendar days written notice. Upon termination, the client shall settle all hours or milestones completed up to the termination timestamp, and the Studio shall immediately deliver all repository commits and work-in-progress artifacts.
        </p>
      )
    },
    {
      id: 'jurisdiction',
      title: '8. GOVERNING LAW & DISPUTE RESOLUTION',
      content: (
        <p className="text-xs leading-relaxed text-[#141414]/80">
          These Terms of Service and any contractual disputes arising hereunder shall be governed by and construed in accordance with applicable laws, with initial mediation conducted in good faith directly with Executive Director Vikas Sunil Mishra.
        </p>
      )
    },
    {
      id: 'contact',
      title: '9. EXECUTIVE CONTACT & LEGAL DESK',
      content: (
        <div className="space-y-3 text-xs">
          <p>For contractual notices, custom enterprise Master Service Agreements (MSAs), or billing verifications:</p>
          
          <div className="p-4 rounded-2xl bg-[#141414] text-[#FAF7EE] space-y-2 border-2 border-[#141414]">
            <div className="font-display font-black text-sm text-[#FFC72E] uppercase">THE UNFILTERED ENGINEER • LEGAL & GOVERNANCE DESK</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#FAF7EE]/80">
              <div><strong>Principal Executive:</strong> Vikas Sunil Mishra</div>
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
              <Scale className="size-3.5" />
              <span>MASTER SERVICE & GOVERNANCE AGREEMENT</span>
            </div>
            <span className="sticker-pill px-3 py-1 bg-[#25D366] text-[#141414] text-xs font-display font-black uppercase shadow-[2px_2px_0_0_#141414]">
              ENTERPRISE GOVERNANCE v2026.4
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#141414] leading-[0.98]">
            TERMS OF SERVICE
          </h1>

          <p className="text-xs sm:text-sm text-[#141414]/80 font-medium mt-3 max-w-3xl leading-relaxed">
            Transparent, developer-first commercial terms governing engineering squad engagements, escrow payments ($1 USD = ₹100 INR), zero-lockin 100% intellectual property transfers, and mutual non-disclosure.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-4 text-xs font-mono font-bold text-[#141414]/70">
            <span>FOUNDER: <strong>VIKAS SUNIL MISHRA</strong></span>
            <span>•</span>
            <span>EFFECTIVE: <strong>SEPTEMBER 2026</strong></span>
            <span>•</span>
            <span>SUPPORT: <strong>theunfilteredengineersupport@gmail.com</strong></span>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="mb-8 p-4 rounded-2xl bg-[#F4EFE6] border-2 border-[#141414] shadow-[4px_4px_0_0_#141414]">
          <div className="text-xs font-display font-black uppercase text-[#FF4D00] mb-2.5 flex items-center gap-2">
            <FileText className="size-3.5" />
            <span>TERMS TABLE OF CONTENTS</span>
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

        {/* Sections */}
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
            <h3 className="font-display text-xl sm:text-2xl font-black uppercase">NEED A CUSTOM MASTER SERVICE AGREEMENT (MSA)?</h3>
            <p className="text-xs sm:text-sm font-medium text-[#141414]/80 mt-1">
              Contact Vikas Mishra for tailored enterprise vendor agreements, SLA commitments, and mutual NDA execution.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="mailto:theunfilteredengineersupport@gmail.com"
              className="sticker-pill px-6 py-3 bg-[#141414] hover:bg-[#FF4D00] text-[#FAF7EE] text-xs font-display font-black shadow-[3px_3px_0_0_#FF4D00] cursor-pointer flex items-center gap-2"
            >
              <Mail className="size-4" />
              <span>REQUEST CUSTOM MSA</span>
            </a>

            <a
              href="https://wa.me/918369804739?text=Hi%20Vikas%2C%20I%20want%20to%20discuss%20a%20Master%20Service%20Agreement%20for%20our%20enterprise%20project."
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
