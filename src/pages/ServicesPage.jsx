import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SERVICE_PILLARS, CONTACT_INFO } from '../data/agencyData';
import { ArrowUpRight, MessageCircle, ArrowRight, ShieldCheck, Flame, Zap } from 'lucide-react';

export default function ServicesPage() {
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All', 'Security', 'Web3', 'AI & ML', 'SaaS', 'Cloud', 'Growth'];

  const filteredServices = activeFilter === 'All'
    ? SERVICE_PILLARS
    : SERVICE_PILLARS.filter(s => {
        if (activeFilter === 'Security') return s.id.includes('security');
        if (activeFilter === 'Web3') return s.id.includes('blockchain');
        if (activeFilter === 'AI & ML') return s.id.includes('ai');
        if (activeFilter === 'SaaS') return s.id.includes('saas') || s.id.includes('web');
        if (activeFilter === 'Cloud') return s.id.includes('software') || s.id.includes('data');
        if (activeFilter === 'Growth') return s.id.includes('marketing');
        return true;
      });

  const cardThemes = [
    { bg: 'bg-[#FFC72E]', text: 'text-[#141414]', numColor: 'text-[#FF4D00]', subText: 'text-[#141414]/80' },
    { bg: 'bg-[#F4EFE6]', text: 'text-[#141414]', numColor: 'text-[#FF4D00]', subText: 'text-[#141414]/80' },
    { bg: 'bg-[#141414]', text: 'text-[#FAF7EE]', numColor: 'text-[#FF4D00]', subText: 'text-[#FAF7EE]/80' },
    { bg: 'bg-[#FF4D00]', text: 'text-[#FAF7EE]', numColor: 'text-[#FFC72E]', subText: 'text-[#FAF7EE]/90' },
    { bg: 'bg-[#FAF7EE]', text: 'text-[#141414]', numColor: 'text-[#FF4D00]', subText: 'text-[#141414]/80' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7EE] text-[#141414] pt-28 pb-24 font-sans">
      
      {/* Top Studio Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border-2 border-[#141414] bg-[#FFC72E] text-[#141414] font-display text-xs font-black uppercase tracking-wider mb-6 shadow-[3px_3px_0_0_#141414]">
          <Flame className="size-3.5 text-[#FF4D00] fill-[#FF4D00]" />
          <span>VETTED SENIOR SQUADS • ZERO JUNIOR DELEGATION</span>
        </div>
        <h1 className="font-display text-4xl sm:text-7xl font-black uppercase tracking-tight text-[#141414] leading-[0.95]">
          WHAT WE <span className="text-[#FF4D00]">ENGINEER</span>
        </h1>
        <p className="mt-4 text-base sm:text-xl font-medium text-[#141414]/75 max-w-2xl">
          From zero-breach cyber defense and smart contract protocols to custom autonomous AI swarms — we deploy senior squads directly into your stack.
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-full font-display text-xs font-bold uppercase transition-all border-2 border-[#141414] cursor-pointer ${
                activeFilter === cat
                  ? 'bg-[#FF4D00] text-[#FAF7EE] shadow-[3px_3px_0_0_#141414]'
                  : 'bg-[#F4EFE6] hover:bg-[#FFC72E] text-[#141414]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredServices.map((service, index) => {
            const theme = cardThemes[index % cardThemes.length];
            const numStr = String(index + 1).padStart(2, '0');

            return (
              <div
                key={service.id}
                className={`flex flex-col justify-between rounded-3xl border-2 border-[#141414] p-6 sm:p-8 ${theme.bg} ${theme.text} shadow-[6px_6px_0_0_#141414] transition-transform duration-200 hover:-translate-y-1`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`font-display text-4xl sm:text-5xl font-black ${theme.numColor}`}>
                      {numStr}
                    </span>
                    <span className="rounded-full border border-current px-2.5 py-0.5 font-display text-[10px] font-black uppercase">
                      {service.category}
                    </span>
                  </div>

                  <h3 className="mt-3 font-display text-xl sm:text-2xl font-black tracking-tight uppercase leading-tight">
                    {service.title}
                  </h3>

                  <p className={`mt-2 text-sm font-medium leading-relaxed ${theme.subText}`}>
                    {service.tagline}
                  </p>

                  <ul className="mt-6 flex flex-col gap-2 border-t-2 border-current/20 pt-5">
                    {service.capabilities.map((cap, cIdx) => (
                      <li key={cIdx} className="flex items-center gap-2.5 font-display text-xs font-bold tracking-wide uppercase">
                        <span className="size-2 rounded-full bg-[#FF4D00] flex-shrink-0" />
                        <span className="truncate">{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-5 border-t-2 border-current/20 flex items-center justify-between gap-3">
                  <Link
                    to={`/services/${service.id}`}
                    className="inline-flex items-center gap-1.5 font-display text-xs sm:text-sm font-black uppercase underline decoration-2 underline-offset-4 hover:text-[#FF4D00] transition-colors"
                  >
                    <span>VIEW SQUAD DOSSIER</span>
                    <ArrowUpRight className="size-4" />
                  </Link>

                  <a
                    href={`https://wa.me/919137507092?text=${encodeURIComponent(`Hi Vikas, I want to discuss hiring the ${service.title} engineering squad.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid size-9 place-items-center rounded-full border-2 border-[#141414] bg-[#25D366] text-[#141414] shadow-[2px_2px_0_0_#141414] hover:scale-105 transition-transform"
                    title="Chat on WhatsApp"
                  >
                    <MessageCircle className="size-4 text-[#141414]" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24">
        <div className="rounded-3xl border-2 border-[#141414] bg-[#141414] text-[#FAF7EE] p-8 sm:p-12 text-center shadow-[7px_7px_0_0_#FF4D00]">
          <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight">
            NEED A CUSTOM DEDICATED SQUAD?
          </h2>
          <p className="mt-3 text-sm sm:text-lg font-medium text-[#FAF7EE]/70 max-w-xl mx-auto">
            Tell Vikas your architectural requirements. We assemble and deploy senior engineers in under 24 hours.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="rounded-full bg-[#FF4D00] hover:bg-[#FF5500] px-8 py-4 font-display text-sm sm:text-base font-black uppercase text-[#FAF7EE] shadow-[5px_5px_0_0_#FFC72E] transition-all hover:-translate-y-1 cursor-pointer"
            >
              START A PROJECT
            </Link>
            <a
              href={CONTACT_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#FAF7EE] px-8 py-4 font-display text-sm sm:text-base font-black uppercase text-[#FAF7EE] transition-all hover:bg-[#FAF7EE] hover:text-[#141414] hover:-translate-y-1"
            >
              <MessageCircle className="size-4" />
              <span>WHATSAPP VIKAS</span>
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
