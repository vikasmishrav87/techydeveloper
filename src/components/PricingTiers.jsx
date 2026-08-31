import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PRICING_TIERS, CONTACT_INFO } from '../data/agencyData';
import PaymentModal from './PaymentModal';
import { Check, MessageCircle, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function PricingTiers() {
  const [selectedTierForPayment, setSelectedTierForPayment] = useState(null);

  const cardThemes = [
    { bg: 'bg-[#F4EFE6]', text: 'text-[#141414]', border: 'border-[#141414]', badgeBg: 'bg-[#141414]', badgeText: 'text-[#FAF7EE]' },
    { bg: 'bg-[#FFC72E]', text: 'text-[#141414]', border: 'border-[#141414]', badgeBg: 'bg-[#FF4D00]', badgeText: 'text-[#FAF7EE]', popular: true },
    { bg: 'bg-[#141414]', text: 'text-[#FAF7EE]', border: 'border-[#141414]', badgeBg: 'bg-[#FFC72E]', badgeText: 'text-[#141414]' },
  ];

  return (
    <section id="pricing" className="relative py-16 sm:py-28 bg-[#FAF7EE] text-[#141414] border-b-2 border-[#141414]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12 sm:mb-16">
          <div>
            <p className="font-display text-xs sm:text-sm font-black tracking-[0.2em] text-[#FF4D00] uppercase">
              TRANSPARENT SQUAD PRICING
            </p>
            <h2 className="mt-2 font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-[#141414]">
              TAILORED SCOPE. ZERO FLUFF.
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base font-medium text-[#141414]/70">
            Dedicated senior engineering squads deployed directly into your stack. Pay via UPI, SBI Wire, or Web3 USDT.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {PRICING_TIERS.map((tier, idx) => {
            const theme = cardThemes[idx % cardThemes.length];

            return (
              <div
                key={tier.id}
                className={`rounded-3xl border-2 border-[#141414] p-7 sm:p-8 flex flex-col justify-between ${theme.bg} ${theme.text} shadow-[6px_6px_0_0_#141414] transition-transform duration-200 hover:-translate-y-1`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="font-display text-xs font-black uppercase tracking-wider text-[#FF4D00]">
                      {tier.scopeType}
                    </span>
                    {tier.popular && (
                      <span className="rounded-full bg-[#FF4D00] px-3 py-0.5 font-display text-[10px] font-black uppercase text-[#FAF7EE]">
                        MOST POPULAR
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl font-black uppercase leading-tight">
                    {tier.name}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm font-medium opacity-80 line-clamp-2">
                    {tier.tagline}
                  </p>

                  <div className="mt-6 pt-6 border-t-2 border-current/20">
                    <span className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight">
                      {tier.priceRange}
                    </span>
                  </div>

                  <ul className="mt-6 flex flex-col gap-2.5 border-t-2 border-current/20 pt-6">
                    {tier.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2 text-xs sm:text-sm font-bold">
                        <span className="grid size-4 place-items-center rounded-full bg-[#FF4D00] text-[#FAF7EE] text-[9px] flex-shrink-0">✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t-2 border-current/20 flex flex-col gap-2.5">
                  <a
                    href={`https://wa.me/918369804739?text=${encodeURIComponent(`Hi Vikas, I am interested in The Unfiltered Engineer's "${tier.name}" plan. Let's discuss scope and contract.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 rounded-full bg-[#141414] hover:bg-[#FF4D00] text-[#FAF7EE] font-display text-xs sm:text-sm font-black uppercase text-center shadow-[4px_4px_0_0_#FF4D00] transition-all hover:-translate-y-0.5 cursor-pointer"
                  >
                    REQUEST SQUAD SCOPING
                  </a>

                  <Link
                    to="/checkout"
                    className="w-full py-3 rounded-full border-2 border-current bg-transparent hover:bg-black/10 text-center font-display text-xs font-bold uppercase transition-all"
                  >
                    DIRECT CLIENT CHECKOUT
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {selectedTierForPayment && (
        <PaymentModal
          isOpen={true}
          onClose={() => setSelectedTierForPayment(null)}
          serviceName={selectedTierForPayment.name}
          initialAmount={3500}
        />
      )}
    </section>
  );
}
