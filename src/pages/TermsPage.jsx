import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, ArrowRight, ShieldCheck } from 'lucide-react';
import BigCtaBanner from '../components/BigCtaBanner';

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-28 pb-24 bg-[#FAF7EE] text-[#141414] font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        
        {/* Header */}
        <div className="mb-12 pb-8 border-b-2 border-[#141414]/15">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFC72E] border-2 border-[#141414] text-[#141414] font-display text-xs font-black uppercase tracking-wider mb-4 shadow-[2px_2px_0_0_#141414]">
            <Scale className="size-3.5" />
            <span>LEGAL & MASTER GOVERNANCE AGREEMENT</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#141414]">
            TERMS OF SERVICE
          </h1>
          <p className="text-sm text-[#141414]/75 font-medium mt-2">
            Founder & Beneficiary: Vikas Sunil Mishra • Effective Version 2026.4 • Applicable worldwide.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6 text-sm leading-relaxed font-medium">
          
          <section className="p-6 sm:p-8 rounded-3xl border-2 border-[#141414] bg-[#F4EFE6] shadow-[5px_5px_0_0_#141414] space-y-3">
            <h2 className="font-display text-lg sm:text-xl font-black uppercase text-[#141414]">
              1. ACCEPTANCE OF TERMS & SQUAD ENGAGEMENT
            </h2>
            <p className="text-[#141414]/80">
              By accessing or engaging engineering squads from <strong className="text-[#141414]">The Unfiltered Engineer</strong>, you agree to these Terms. All architecture, code, and security artifacts are produced under high-reliability standards.
            </p>
          </section>

          <section className="p-6 sm:p-8 rounded-3xl border-2 border-[#141414] bg-[#F4EFE6] shadow-[5px_5px_0_0_#141414] space-y-3">
            <h2 className="font-display text-lg sm:text-xl font-black uppercase text-[#141414]">
              2. PAYMENT APPROVAL & ESCROW SETTLEMENT
            </h2>
            <p className="text-[#141414]/80">
              All payment gateways (Google Pay UPI, SBI Bank Wire, Polygon/USDT Web3) route into live executive radar and require manual confirmation by Vikas Mishra. Conversion rate is locked at <strong className="text-[#FF4D00] font-bold">$1 USD = ₹100 INR</strong>.
            </p>
          </section>

          <section className="p-6 sm:p-8 rounded-3xl border-2 border-[#141414] bg-[#F4EFE6] shadow-[5px_5px_0_0_#141414] space-y-3">
            <h2 className="font-display text-lg sm:text-xl font-black uppercase text-[#141414]">
              3. INTELLECTUAL PROPERTY & CODE TRANSFER
            </h2>
            <p className="text-[#141414]/80">
              Upon final milestone settlement, 100% of all custom source code, deployment scripts, and intellectual property transfer irrevocably to the client.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}
