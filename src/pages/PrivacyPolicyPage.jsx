import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen pt-28 pb-24 bg-[#FAF7EE] text-[#141414] font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        
        {/* Header */}
        <div className="mb-12 pb-8 border-b-2 border-[#141414]/15">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFC72E] border-2 border-[#141414] text-[#141414] font-display text-xs font-black uppercase tracking-wider mb-4 shadow-[2px_2px_0_0_#141414]">
            <ShieldCheck className="size-3.5" />
            <span>ZERO-DATA RETENTION PRIVACY POLICY</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#141414]">
            PRIVACY POLICY
          </h1>
          <p className="text-sm text-[#141414]/75 font-medium mt-2">
            The Unfiltered Engineer • Zero third-party telemetry or ad tracking cookies.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6 text-sm leading-relaxed font-medium">
          
          <section className="p-6 sm:p-8 rounded-3xl border-2 border-[#141414] bg-[#F4EFE6] shadow-[5px_5px_0_0_#141414] space-y-3">
            <h2 className="font-display text-lg sm:text-xl font-black uppercase text-[#141414]">
              1. ZERO-LOGGING ARCHITECTURE
            </h2>
            <p className="text-[#141414]/80">
              We do not sell, rent, or monetize client data. Technical audit results and project briefs are strictly encrypted and accessible only to authorized architects.
            </p>
          </section>

          <section className="p-6 sm:p-8 rounded-3xl border-2 border-[#141414] bg-[#F4EFE6] shadow-[5px_5px_0_0_#141414] space-y-3">
            <h2 className="font-display text-lg sm:text-xl font-black uppercase text-[#141414]">
              2. CRYPTOGRAPHIC PROOF OF SETTLEMENT
            </h2>
            <p className="text-[#141414]/80">
              Transaction receipts and UTR numbers provided during payment verification are stored solely for ledger audit purposes and WhatsApp founder verification.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}
