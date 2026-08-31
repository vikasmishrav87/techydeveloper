import React from 'react';
import { Link } from 'react-router-dom';
import { CONTACT_INFO } from '../data/agencyData';
import { MessageCircle, Flame } from 'lucide-react';

export default function Hero({ onOpenTerminal, onOpenScanner, onOpenAIChat }) {
  const marqueeItems = [
    'CYBER SECURITY',
    'BLOCKCHAIN & WEB3',
    'AI AUTOMATION',
    'FULL-STACK SAAS',
    'ENTERPRISE CLOUD',
    'SMART CONTRACTS',
    'WHATSAPP BOTS',
    'REVERSE ENGINEERING',
    'ZERO-TRUST DEFENSE',
    '360° TECH GROWTH'
  ];

  return (
    <div className="relative overflow-hidden pt-20 sm:pt-24 bg-[#FAF7EE] text-[#141414]">
      
      {/* 1. HERO SECTION WITH DOT GRID & TILTED BRUTALIST STICKERS */}
      <section className="dot-grid relative min-h-[75vh] md:min-h-[85vh] flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-20 overflow-hidden">
        
        {/* Floating Sticker 1: Top Left */}
        <div 
          className="hidden sm:block absolute left-[3%] top-[14%] md:top-[18%] z-20 transition-transform duration-300 hover:scale-110 cursor-pointer"
          style={{ transform: 'rotate(-12deg)' }}
        >
          <div className="flex items-center gap-2 rounded-full border-2 border-[#141414] px-4 py-2 sm:px-6 sm:py-2.5 font-display text-xs sm:text-base font-black tracking-tight bg-[#FFC72E] text-[#141414] shadow-[4px_4px_0_0_#141414]">
            <span>🛡️ CYBER SECURITY</span>
          </div>
        </div>

        {/* Floating Sticker 2: Top Right */}
        <div 
          className="hidden sm:block absolute right-[3%] top-[12%] md:top-[16%] z-20 transition-transform duration-300 hover:scale-110 cursor-pointer"
          style={{ transform: 'rotate(14deg)' }}
        >
          <div className="flex items-center gap-2 rounded-full border-2 border-[#141414] px-4 py-2 sm:px-6 sm:py-2.5 font-display text-xs sm:text-base font-black tracking-tight bg-[#FF4D00] text-[#FAF7EE] shadow-[5px_5px_0_0_#141414]">
            <span>⬡ WEB3 & BLOCKCHAIN</span>
          </div>
        </div>

        {/* Floating Sticker 3: Bottom Left */}
        <div 
          className="hidden md:block absolute left-[4%] bottom-[16%] z-20 transition-transform duration-300 hover:scale-110 cursor-pointer"
          style={{ transform: 'rotate(8deg)' }}
        >
          <div className="flex items-center gap-2 rounded-full border-2 border-[#141414] px-5 py-2.5 font-display text-sm font-black tracking-tight bg-[#F4EFE6] text-[#141414] shadow-[4px_4px_0_0_#141414]">
            <span>☁️ CLOUD ARCHITECTURE</span>
          </div>
        </div>

        {/* Floating Sticker 4: Bottom Right */}
        <div 
          className="hidden sm:block absolute right-[4%] bottom-[14%] z-20 transition-transform duration-300 hover:scale-110 cursor-pointer"
          style={{ transform: 'rotate(-10deg)' }}
        >
          <div className="flex items-center gap-2 rounded-full border-2 border-[#141414] px-5 py-2.5 font-display text-sm font-black tracking-tight bg-[#141414] text-[#FAF7EE] shadow-[4px_4px_0_0_#141414]">
            <span>⚡ AI SWARMS & BOTS</span>
          </div>
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 mx-auto w-full max-w-6xl">
          
          {/* Studio Mini Eyebrow Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border-2 border-[#141414] bg-[#FFC72E] text-[#141414] font-display text-xs font-black uppercase tracking-wider mb-6 shadow-[3px_3px_0_0_#141414]">
            <Flame className="size-3.5 text-[#FF4D00] fill-[#FF4D00]" />
            <span>FOUNDED BY VIKAS MISHRA • GLOBAL IT STUDIO</span>
          </div>

          {/* Giant Neo-Brutalist Typography (aijugaad style) */}
          <h1 className="font-display text-[clamp(2.4rem,7.5vw,6.4rem)] font-black uppercase leading-[0.96] tracking-tight text-[#141414]">
            <span className="block">WE ARE ARCHITECTS.</span>
            <span className="block text-outline">WE COOK SYSTEMS</span>
            <span className="block text-[#FF4D00]">AND SCALE AI.</span>
          </h1>

          {/* Subtext and Action Split Row */}
          <div className="mt-6 sm:mt-10 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            
            <div className="max-w-xl">
              <p className="text-base sm:text-xl font-medium leading-relaxed text-[#141414]/85">
                Zero-breach Cyber Security, high-throughput Blockchain protocols, and custom AI automation — engineered for real high-stakes businesses, not for design awards.
              </p>

              {/* Dual Hero Buttons */}
              <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3.5">
                <Link
                  to="/contact"
                  className="rounded-full bg-[#141414] hover:bg-[#FF4D00] px-7 py-4 sm:px-9 sm:py-4.5 font-display text-sm sm:text-base font-black uppercase text-[#FAF7EE] shadow-[5px_5px_0_0_#FF4D00] transition-all hover:shadow-[5px_5px_0_0_#141414] hover:-translate-y-1 cursor-pointer"
                >
                  START A PROJECT
                </Link>

                <Link
                  to="/services"
                  className="rounded-full border-2 border-[#141414] bg-[#F4EFE6] hover:bg-[#FFC72E] px-7 py-4 sm:px-9 sm:py-4.5 font-display text-sm sm:text-base font-black uppercase text-[#141414] shadow-[5px_5px_0_0_#141414] transition-all hover:-translate-y-1 cursor-pointer"
                >
                  SEE CAPABILITIES
                </Link>

                <a
                  href={CONTACT_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#141414] bg-[#25D366] hover:bg-[#1EBE5D] px-5 py-4 font-display text-sm font-black text-[#141414] shadow-[4px_4px_0_0_#141414] transition-transform hover:-translate-y-0.5"
                >
                  <MessageCircle className="size-4 text-[#141414]" />
                  <span>WHATSAPP</span>
                </a>
              </div>
            </div>

            {/* Circular Spinning Stamp Badge */}
            <div className="hidden sm:block shrink-0">
              <div className="relative grid size-32 sm:size-36 place-items-center">
                <svg viewBox="0 0 120 120" className="absolute inset-0 animate-rot size-full pointer-events-none select-none">
                  <defs>
                    <path id="badge-circle" d="M60,60 m-47,0 a47,47 0 1,1 94,0 a47,47 0 1,1 -94,0"></path>
                  </defs>
                  <text className="fill-[#141414] font-display text-[11px] font-black tracking-[0.2em] uppercase">
                    <textPath href="#badge-circle">ENGINEER • SECURE • DEPLOY • SCALE • REPEAT •</textPath>
                  </text>
                </svg>
                <span className="grid size-14 place-items-center rounded-full bg-[#FF4D00] border-2 border-[#141414] shadow-[3px_3px_0_0_#141414]">
                  <svg viewBox="0 0 64 64" className="size-7 text-[#FAF7EE]" aria-hidden="true">
                    <g stroke="currentColor" strokeWidth="9" strokeLinecap="round">
                      <line x1="32" y1="10" x2="32" y2="54"></line>
                      <line x1="12.9" y1="21" x2="51.1" y2="43"></line>
                      <line x1="12.9" y1="43" x2="51.1" y2="21"></line>
                    </g>
                  </svg>
                </span>
              </div>
            </div>

          </div>

          <p className="mt-8 font-display text-[11px] sm:text-xs font-bold tracking-[0.2em] text-[#141414]/50 uppercase">
            PSST — ZERO JUNIOR DELEGATION • 100% DIRECT SENIOR EXECUTION
          </p>

        </div>
      </section>

      {/* 2. INFINITE SCROLLING MARQUEE BANNER (aijugaad style in Vibrant Orange) */}
      <div className="overflow-hidden border-y-2 border-[#141414] bg-[#FF4D00] py-4 select-none">
        <div className="animate-marquee flex w-max items-center gap-8 pr-8">
          
          <div className="flex items-center gap-8" aria-hidden="false">
            {marqueeItems.map((item, index) => (
              <span key={index} className="flex items-center gap-8 font-display text-lg sm:text-2xl font-black tracking-tight text-[#FAF7EE] uppercase whitespace-nowrap">
                {item}
                <svg viewBox="0 0 64 64" className="size-4 sm:size-5 text-[#FFC72E]" aria-hidden="true">
                  <g stroke="currentColor" strokeWidth="10" strokeLinecap="round">
                    <line x1="32" y1="8" x2="32" y2="56"></line>
                    <line x1="11.2" y1="20" x2="52.8" y2="44"></line>
                    <line x1="11.2" y1="44" x2="52.8" y2="20"></line>
                  </g>
                </svg>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-8" aria-hidden="true">
            {marqueeItems.map((item, index) => (
              <span key={`dup-${index}`} className="flex items-center gap-8 font-display text-lg sm:text-2xl font-black tracking-tight text-[#FAF7EE] uppercase whitespace-nowrap">
                {item}
                <svg viewBox="0 0 64 64" className="size-4 sm:size-5 text-[#FFC72E]" aria-hidden="true">
                  <g stroke="currentColor" strokeWidth="10" strokeLinecap="round">
                    <line x1="32" y1="8" x2="32" y2="56"></line>
                    <line x1="11.2" y1="20" x2="52.8" y2="44"></line>
                    <line x1="11.2" y1="44" x2="52.8" y2="20"></line>
                  </g>
                </svg>
              </span>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
}
