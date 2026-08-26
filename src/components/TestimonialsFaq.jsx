import React, { useState } from 'react';
import { Star, MessageCircle, ChevronDown, ChevronUp, Quote } from 'lucide-react';
import { testimonials, faqs } from '../data/agencyData';

export default function TestimonialsFaq() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <section id="faq" className="py-24 bg-dark-900 border-t border-dark-800 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-bronze-700/5 blur-[160px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Testimonials Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-dark-850 border border-bronze-500/30 text-bronze-400 text-xs font-mono mb-4">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>[CTO_&_FOUNDER_VERDICTS]</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
            What Technical Leaders Say <br />
            <span className="bronze-gradient-text">About Our Direct Execution.</span>
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-2xl bg-dark-950 border border-dark-800 flex flex-col justify-between relative shadow-xl hover:border-bronze-500/40 transition-colors"
            >
              <div>
                {/* Rating & Tag */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-bronze-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-bronze-400" />
                    ))}
                  </div>
                  <span className="px-2.5 py-0.5 rounded bg-dark-850 border border-dark-750 text-[10px] font-mono text-titanium-400 uppercase">
                    {item.tag}
                  </span>
                </div>

                {/* Quote Text */}
                <p className="text-xs sm:text-sm text-titanium-200 leading-relaxed italic mb-6">
                  "{item.quote}"
                </p>
              </div>

              {/* Author */}
              <div className="pt-4 border-t border-dark-850 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-dark-800 border border-bronze-500/30 flex items-center justify-center font-mono text-xs text-bronze-300 font-bold">
                  {item.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{item.author}</div>
                  <div className="text-[11px] font-mono text-titanium-400">
                    {item.role}, {item.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
              Frequently Asked <span className="bronze-gradient-text">Engineering Questions</span>
            </h3>
            <p className="text-xs font-mono text-titanium-400">
              Unfiltered answers to everything you need to know before onboarding.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl bg-dark-950 border border-dark-800 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-dark-900 transition-colors"
                  >
                    <span className="text-sm sm:text-base font-bold text-white font-mono">
                      {faq.question}
                    </span>
                    <span className="text-bronze-400 shrink-0">
                      {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-titanium-300 leading-relaxed font-sans border-t border-dark-900">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
