import React from 'react';
import { Star } from 'lucide-react';

export default function ClientProofSection() {
  const reviews = [
    {
      client: 'FINTECH ECOSYSTEMS',
      domain: 'fintech-apex.io',
      role: 'CORE BANKING INFRASTRUCTURE',
      tag: 'WHATSAPP VERIFIED',
      quote: 'Vikas and his engineering squad migrated our entire core ledger with zero downtime. Security audit score 100/100.',
      author: 'Managing Director, Fintech'
    },
    {
      client: 'DECENTRALIZED PROTOCOLS',
      domain: 'polygon-bridge.eth',
      role: 'WEB3 SMART CONTRACTS',
      tag: 'TELEGRAM ESCALATION',
      quote: 'Audited + in TVL smart contracts and patched critical reentrancy vector within 3 hours. Absolute rockstar team.',
      author: 'Lead Protocol Architect'
    },
    {
      client: 'VELORA LOGISTICS & E-COM',
      domain: 'velora-supply.com',
      role: 'AI AUTOMATION SWARM',
      tag: 'INSTAGRAM DM',
      quote: 'Automated 10,000+ monthly customer WhatsApp requests via custom LLM agents. Conversion rate jumped 42%.',
      author: 'Chief Operating Officer'
    }
  ];

  return (
    <section className="relative py-16 sm:py-28 bg-[#FAF7EE] text-[#141414] border-b-2 border-[#141414] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12 sm:mb-16">
          <div>
            <p className="font-display text-xs sm:text-sm font-black tracking-[0.2em] text-[#FF4D00] uppercase">SCREENSHOTS DON’T LIE</p>
            <h2 className="mt-2 font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-[#141414]">STRAIGHT FROM THE DMS.</h2>
          </div>
          <p className="max-w-md text-sm sm:text-base font-medium text-[#141414]/70">Real enterprise founders, real messages — exactly as they landed.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {reviews.map((rev, idx) => (
            <article key={idx} className="flex flex-col justify-between rounded-3xl border-2 border-[#141414] bg-[#F4EFE6] p-6 sm:p-8 shadow-[6px_6px_0_0_#141414] transition-transform duration-200 hover:-translate-y-1">
              <div>
                <div className="flex items-center justify-between gap-2 border-b-2 border-[#141414]/15 pb-4 mb-4">
                  <span className="font-display text-xs font-black uppercase text-[#141414]">{rev.client}</span>
                  <span className="rounded-full border border-[#141414] bg-[#FFC72E] px-2.5 py-0.5 font-display text-[10px] font-black uppercase text-[#141414]">{rev.tag}</span>
                </div>
                <div className="flex gap-1 text-[#FF4D00] mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-4 fill-[#FF4D00]" />
                  ))}
                </div>
                <p className="text-sm sm:text-base font-bold italic text-[#141414] leading-relaxed">“{rev.quote}”</p>
              </div>
              <div className="mt-6 pt-4 border-t-2 border-[#141414]/15 flex items-center justify-between">
                <div>
                  <div className="font-display text-xs font-black uppercase text-[#141414]">{rev.author}</div>
                  <div className="text-[11px] font-bold text-[#FF4D00] uppercase">{rev.role}</div>
                </div>
                <span className="text-xs font-mono font-bold text-[#141414]/50 underline">{rev.domain}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
