import React from 'react';
import { Link } from 'react-router-dom';
import { MARKETING_CHANNELS, CONTACT_INFO } from '../data/agencyData';
import { ArrowUpRight, MessageCircle, ArrowRight, TrendingUp } from 'lucide-react';

export default function DigitalMarketingSection() {
  return (
    <section id="marketing" className="relative py-16 sm:py-28 bg-[#F4EFE6] text-[#141414] border-b-2 border-[#141414]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12 sm:mb-16">
          <div>
            <p className="font-display text-xs sm:text-sm font-black tracking-[0.2em] text-[#FF4D00] uppercase">
              GROWTH & TRAFFIC ENGINES
            </p>
            <h2 className="mt-2 font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-[#141414]">
              360° TECH MARKETING & ROAS
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base font-medium text-[#141414]/70">
            Engineered conversion funnels, programmatic SEO, and data-driven ad attribution designed for software & Web3.
          </p>
        </div>

        {/* Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {MARKETING_CHANNELS.map((ch, idx) => (
            <div
              key={ch.id}
              className="flex flex-col justify-between rounded-3xl border-2 border-[#141414] bg-[#FAF7EE] p-6 sm:p-8 shadow-[6px_6px_0_0_#141414] transition-transform duration-200 hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-display text-2xl sm:text-3xl font-black text-[#FF4D00]">
                    0{idx + 1}
                  </span>
                  <span className="rounded-full bg-[#FFC72E] border border-[#141414] px-2.5 py-0.5 font-display text-[10px] font-black uppercase">
                    {ch.badge}
                  </span>
                </div>

                <h3 className="font-display text-xl sm:text-2xl font-black uppercase text-[#141414] leading-tight">
                  {ch.title}
                </h3>

                <p className="mt-2 text-xs sm:text-sm font-medium text-[#141414]/75">
                  {ch.tagline}
                </p>

                <ul className="mt-6 flex flex-col gap-2 border-t-2 border-[#141414]/15 pt-5">
                  {ch.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2 font-display text-xs font-bold uppercase">
                      <span className="size-2 rounded-full bg-[#FF4D00] flex-shrink-0" />
                      <span className="truncate">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-5 border-t-2 border-[#141414]/15 flex items-center justify-between">
                <span className="font-display text-xs font-black uppercase text-[#FF4D00]">
                  ROAS: {ch.roasMultiplier}
                </span>

                <a
                  href={`https://wa.me/918369804739?text=${encodeURIComponent(`Hi Vikas, I want to discuss scaling our traffic with your ${ch.title} growth engine.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid size-9 place-items-center rounded-full border-2 border-[#141414] bg-[#25D366] text-[#141414] shadow-[2px_2px_0_0_#141414] hover:scale-105 transition-transform"
                  title="Discuss on WhatsApp"
                >
                  <MessageCircle className="size-4 text-[#141414]" />
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
