import React from 'react';
import { Link } from 'react-router-dom';
import { SERVICE_PILLARS } from '../data/agencyData';
import { ArrowRight, MessageCircle, ArrowUpRight } from 'lucide-react';

export default function ServicesSection() {
  const cardThemes = [
    { bg: 'bg-[#FFC72E]', text: 'text-[#141414]', numColor: 'text-[#FF4D00]', subText: 'text-[#141414]/80' },
    { bg: 'bg-[#F4EFE6]', text: 'text-[#141414]', numColor: 'text-[#FF4D00]', subText: 'text-[#141414]/80' },
    { bg: 'bg-[#141414]', text: 'text-[#FAF7EE]', numColor: 'text-[#FF4D00]', subText: 'text-[#FAF7EE]/80' },
    { bg: 'bg-[#FF4D00]', text: 'text-[#FAF7EE]', numColor: 'text-[#FFC72E]', subText: 'text-[#FAF7EE]/90' },
    { bg: 'bg-[#FAF7EE]', text: 'text-[#141414]', numColor: 'text-[#FF4D00]', subText: 'text-[#141414]/80' },
  ];

  return (
    <section id="services" className="relative py-16 sm:py-28 bg-[#FAF7EE] text-[#141414] border-b-2 border-[#141414]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (aijugaad style) */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12 sm:mb-16">
          <div>
            <p className="font-display text-xs sm:text-sm font-black tracking-[0.2em] text-[#FF4D00] uppercase">
              CORE SPECIALIZATIONS. DONE RIGHT.
            </p>
            <h2 className="mt-2 font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-[#141414]">
              WHAT WE ENGINEER
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base font-medium text-[#141414]/70">
            Dedicated senior engineering squads deployed directly into your architecture. Zero fluff, 100% production delivery.
          </p>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {SERVICE_PILLARS.map((service, index) => {
            const theme = cardThemes[index % cardThemes.length];
            const numStr = String(index + 1).padStart(2, '0');

            return (
              <div
                key={service.id}
                className={`flex flex-col justify-between rounded-3xl border-2 border-[#141414] p-6 sm:p-8 ${theme.bg} ${theme.text} shadow-[6px_6px_0_0_#141414] transition-transform duration-200 hover:-translate-y-1`}
              >
                <div>
                  {/* Big Number */}
                  <span className={`font-display text-4xl sm:text-5xl font-black ${theme.numColor}`}>
                    {numStr}
                  </span>

                  {/* Title */}
                  <h3 className="mt-3 font-display text-xl sm:text-2xl font-black tracking-tight uppercase leading-tight">
                    {service.title}
                  </h3>

                  {/* Tagline */}
                  <p className={`mt-2 text-sm font-medium leading-relaxed ${theme.subText}`}>
                    {service.tagline}
                  </p>

                  {/* Capabilities List with Bullet Points */}
                  <ul className="mt-6 flex flex-col gap-2 border-t-2 border-current/20 pt-5">
                    {service.capabilities.slice(0, 4).map((cap, cIdx) => (
                      <li key={cIdx} className="flex items-center gap-2.5 font-display text-xs font-bold tracking-wide uppercase">
                        <span className="size-2 rounded-full bg-[#FF4D00] flex-shrink-0" />
                        <span className="truncate">{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Bottom CTA Link */}
                <div className="mt-8 pt-5 border-t-2 border-current/20 flex items-center justify-between gap-3">
                  <Link
                    to={`/services/${service.id}`}
                    className="inline-flex items-center gap-1.5 font-display text-xs sm:text-sm font-black uppercase tracking-wider underline decoration-2 underline-offset-4 hover:text-[#FF4D00] transition-colors"
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

        {/* View All Services Bottom Banner */}
        <div className="mt-14 sm:mt-16 text-center">
          <Link
            to="/services"
            className="inline-flex items-center gap-3 rounded-full border-2 border-[#141414] bg-[#141414] hover:bg-[#FF4D00] px-8 py-4 sm:px-10 sm:py-5 font-display text-sm sm:text-base font-black text-[#FAF7EE] shadow-[5px_5px_0_0_#FF4D00] transition-all hover:shadow-[5px_5px_0_0_#141414] hover:-translate-y-1 cursor-pointer uppercase"
          >
            <span>EXPLORE ALL SPECIALIZED SQUADS</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
