import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PRICING_TIERS, CONTACT_INFO } from '../data/agencyData';
import PaymentModal from './PaymentModal';
import { Check, MessageCircle, Send, Zap, ArrowRight, ShieldCheck, Sparkles, CreditCard } from 'lucide-react';

export default function PricingTiers() {
  const [selectedTierForPayment, setSelectedTierForPayment] = useState(null);

  const getWhatsAppForTier = (tier) => {
    const text = encodeURIComponent(`Hi Vikas, I would like to know in details about The Unfiltered Engineer's "${tier.name}" (${tier.scopeType}) engagement for my company. Please share scope details and quote.`);
    return `https://wa.me/919137507092?text=${text}`;
  };

  const getTierEstimatedAmount = (tierId) => {
    if (tierId === 'scale') return 7500;
    if (tierId === 'enterprise') return 15000;
    return 3500;
  };

  return (
    <section id="pricing" className="relative py-28 bg-[#EEF2FF] text-slate-900 overflow-hidden border-t border-b border-indigo-100/90">
      
      <div className="absolute inset-0 bg-light-grid opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 reveal-on-scroll">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-sky-200 text-sky-800 text-xs font-mono uppercase tracking-widest mb-4 shadow-xs">
            <Zap className="w-3.5 h-3.5 text-sky-600" />
            Specialized Engagements
          </div>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-slate-950 mb-6">
            Tailored Scope. <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 font-normal">Dedicated Squads</span>.
          </h2>
          <p className="text-slate-700 text-base sm:text-lg font-normal leading-relaxed">
            Zero legacy IT overhead or bureaucracy. Dedicated senior engineering squads and tech architects working directly with your team. Pay retainers securely via Razorpay (UPI/Cards), Stripe, or Web3 USDT.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {PRICING_TIERS.map((tier) => {
            return (
              <div
                key={tier.id}
                className={"rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative bg-white/95 border " + (
                  tier.popular
                    ? "border-sky-400 shadow-xl shadow-sky-100 md:-translate-y-2 ring-2 ring-sky-400/30"
                    : "border-indigo-100 shadow-sm hover:shadow-md hover:border-sky-200"
                ) + " reveal-on-scroll"}
              >
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full bg-gradient-to-r from-sky-600 to-indigo-600 text-white text-xs font-semibold uppercase tracking-wider shadow-sm">
                      Most Popular For Enterprise
                    </span>
                  </div>
                )}

                <div>
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-slate-950">{tier.name}</h3>
                    <div className="inline-block mt-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-mono font-medium">
                      {tier.scopeType}
                    </div>
                    <p className="text-xs text-slate-600 font-normal mt-3 min-h-[34px] leading-relaxed">
                      {tier.tagline}
                    </p>
                  </div>

                  {/* Know Details Banner */}
                  <div className="py-4 border-t border-b border-slate-100 mb-6 bg-slate-50/60 rounded-2xl p-4 my-4">
                    <div className="text-xs font-mono uppercase text-slate-500 font-semibold mb-1">Pricing & Scope</div>
                    <div className="text-sm font-semibold text-slate-950 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-sky-600" />
                      <span>Starting at ${(getTierEstimatedAmount(tier.id)).toLocaleString()}/mo</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">Dedicated Squad • Zero Vendor Overhead</div>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3.5 mb-8">
                    <span className="text-xs font-mono uppercase text-slate-400 tracking-wider font-semibold">Included Deliverables</span>
                    {tier.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-3 text-xs text-slate-700">
                        <Check className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions: Direct Payment + WhatsApp Buttons */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedTierForPayment(tier)}
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-sky-600/20 hover:scale-[1.02] cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Deploy Squad & Pay Retainer</span>
                  </button>

                  <a
                    href={getWhatsAppForTier(tier)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-medium text-xs transition-all"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>Discuss Custom Scope on WhatsApp</span>
                  </a>
                </div>

              </div>
            );
          })}

        </div>

      </div>

      {/* Universal Payment Gateway Modal */}
      {selectedTierForPayment && (
        <PaymentModal
          isOpen={!!selectedTierForPayment}
          onClose={() => setSelectedTierForPayment(null)}
          initialAmount={getTierEstimatedAmount(selectedTierForPayment.id)}
          initialCurrency="USD"
          serviceName={`${selectedTierForPayment.name} (${selectedTierForPayment.scopeType})`}
        />
      )}
    </section>
  );
}
