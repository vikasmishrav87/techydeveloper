import React, { useState, useEffect } from 'react';
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

  // Dynamic Rotating Headline Phrases (Original & Tailored to The Unfiltered Engineer)
  const rotatingHeadlines = [
    {
      line1: 'WE ARE ARCHITECTS.',
      line2: 'WE COOK SYSTEMS',
      line3: 'AND SCALE AI.',
      sub: 'Zero-breach Cyber Security, high-throughput Web3 protocols, production AI swarms, and high-converting tech architectures.'
    },
    {
      line1: 'WE ARE BUILDERS.',
      line2: 'WE CODE PLATFORMS',
      line3: 'THAT NEVER CRASH.',
      sub: 'Enterprise SaaS, real-time distributed microservices, and battle-tested cloud backbones deployed with sub-second latency.'
    },
    {
      line1: 'WE ARE RED-TEAMS.',
      line2: 'WE AUDIT WEB3',
      line3: 'AND DEFEND DATA.',
      sub: 'Military-grade cryptographic defense, smart contract penetration testing, and zero-trust perimeters for high-stakes protocols.'
    },
    {
      line1: 'WE ARE INNOVATORS.',
      line2: 'WE DEPLOY SWARMS',
      line3: 'OF AUTONOMOUS BOTS.',
      sub: 'Custom LLMs, automated WhatsApp agents, and multi-agent neural pipelines that replace 100+ hours of manual labor.'
    },
    {
      line1: 'WE ARE ACCELERATORS.',
      line2: 'WE ENGINEER FUNNELS',
      line3: 'AND DOMINATE ROAS.',
      sub: 'Programmatic technical SEO, ultra-fast Lighthouse 100/100 web performance, and high-converting revenue infrastructure.'
    },
    {
      line1: 'WE ARE WAR ROOMS.',
      line2: 'WE SHIP PRODUCTION',
      line3: 'WITH ZERO EXCUSES.',
      sub: 'Senior squads deployed directly into your engineering roadmap. Zero junior delegation, 100% direct accountability.'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % rotatingHeadlines.length);
        setIsFading(false);
      }, 300); // 300ms transition fade
    }, 3200); // changes every 3.2s

    return () => clearInterval(timer);
  }, [rotatingHeadlines.length]);

  const activeHeadline = rotatingHeadlines[currentIndex];

  return (
    <div className="relative overflow-hidden pt-20 sm:pt-24 bg-[#FAF7EE] text-[#141414]">
      
      {/* 1. HERO SECTION WITH DOT GRID & FLOATING ANIMATED STICKERS */}
      <section className="dot-grid relative min-h-[75vh] md:min-h-[85vh] flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-20 overflow-hidden">
        
        {/* Floating Sticker 1: Top Left */}
        <div className="hidden sm:block absolute left-[3%] top-[14%] md:top-[18%] z-20 animate-float-1 transition-transform duration-300 hover:scale-110 cursor-pointer">
          <div className="flex items-center gap-2 rounded-full border-2 border-[#141414] px-4 py-2 sm:px-6 sm:py-2.5 font-display text-xs sm:text-base font-black tracking-tight bg-[#FFC72E] text-[#141414] shadow-[4px_4px_0_0_#141414] hover:shadow-[6px_6px_0_0_#141414] transition-all">
            <span>🛡️ CYBER SECURITY</span>
          </div>
        </div>

        {/* Floating Sticker 2: Top Right */}
        <div className="hidden sm:block absolute right-[3%] top-[12%] md:top-[16%] z-20 animate-float-2 transition-transform duration-300 hover:scale-110 cursor-pointer">
          <div className="flex items-center gap-2 rounded-full border-2 border-[#141414] px-4 py-2 sm:px-6 sm:py-2.5 font-display text-xs sm:text-base font-black tracking-tight bg-[#FF4D00] text-[#FAF7EE] shadow-[5px_5px_0_0_#141414] hover:shadow-[7px_7px_0_0_#141414] transition-all">
            <span>⬡ WEB3 & BLOCKCHAIN</span>
          </div>
        </div>

        {/* Floating Sticker 3: Bottom Left */}
        <div className="hidden md:block absolute left-[4%] bottom-[16%] z-20 animate-float-3 transition-transform duration-300 hover:scale-110 cursor-pointer">
          <div className="flex items-center gap-2 rounded-full border-2 border-[#141414] px-5 py-2.5 font-display text-sm font-black tracking-tight bg-[#F4EFE6] text-[#141414] shadow-[4px_4px_0_0_#141414] hover:shadow-[6px_6px_0_0_#141414] transition-all">
            <span>☁️ CLOUD ARCHITECTURE</span>
          </div>
        </div>

        {/* Floating Sticker 4: Bottom Right */}
        <div className="hidden sm:block absolute right-[4%] bottom-[14%] z-20 animate-float-4 transition-transform duration-300 hover:scale-110 cursor-pointer">
          <div className="flex items-center gap-2 rounded-full border-2 border-[#141414] px-5 py-2.5 font-display text-sm font-black tracking-tight bg-[#141414] text-[#FAF7EE] shadow-[4px_4px_0_0_#141414] hover:shadow-[6px_6px_0_0_#FF4D00] transition-all">
            <span>⚡ AI SWARMS & BOTS</span>
          </div>
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 mx-auto w-full max-w-6xl">
          
          {/* Eyebrow Tag + Rotation Dots */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border-2 border-[#141414] bg-[#FFC72E] text-[#141414] font-display text-xs font-black uppercase tracking-wider shadow-[3px_3px_0_0_#141414]">
              <Flame className="size-3.5 text-[#FF4D00] fill-[#FF4D00] animate-pulse" />
              <span>GLOBAL ARCHITECTURE & AI COLLECTIVE</span>
            </div>

            {/* Quick Phrase Jump Indicators */}
            <div className="hidden sm:flex items-center gap-1.5 bg-[#FAF7EE] border-2 border-[#141414] px-3 py-1 rounded-full shadow-[2px_2px_0_0_#141414]">
              {rotatingHeadlines.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => setCurrentIndex(dotIdx)}
                  className={`size-2.5 rounded-full border border-[#141414] transition-all cursor-pointer ${
                    currentIndex === dotIdx ? 'bg-[#FF4D00] scale-125' : 'bg-[#141414]/20 hover:bg-[#FFC72E]'
                  }`}
                  title={`Phrase ${dotIdx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Dynamic Rotating Display Typography */}
          <div className={`transition-all duration-300 transform ${isFading ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'}`}>
            <h1 className="font-display text-[clamp(2.4rem,7.5vw,7.2rem)] font-black uppercase leading-[0.92] tracking-tight text-[#141414]">
              <span>{activeHeadline.line1}</span>
              <span className="block text-outline mt-1 sm:mt-2">
                {activeHeadline.line2}
              </span>
              <span className="block text-[#FF4D00] mt-1 sm:mt-2">
                {activeHeadline.line3}
              </span>
            </h1>
          </div>

          {/* Subtext and Action Split Row */}
          <div className="mt-6 sm:mt-10 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            
            <div className="max-w-xl">
              <p className={`text-base sm:text-xl font-medium leading-relaxed text-[#141414]/85 min-h-[56px] transition-all duration-300 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
                {activeHeadline.sub}
              </p>

              {/* Action Buttons */}
              <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3.5">
                <Link
                  to="/contact"
                  className="brutal-btn rounded-full bg-[#141414] hover:bg-[#FF4D00] px-7 py-4 sm:px-9 sm:py-4.5 font-display text-sm sm:text-base font-black uppercase text-[#FAF7EE] shadow-[5px_5px_0_0_#FF4D00] cursor-pointer"
                >
                  START A PROJECT
                </Link>

                <Link
                  to="/services"
                  className="brutal-btn rounded-full border-2 border-[#141414] bg-[#F4EFE6] hover:bg-[#FFC72E] px-7 py-4 sm:px-9 sm:py-4.5 font-display text-sm sm:text-base font-black uppercase text-[#141414] shadow-[5px_5px_0_0_#141414] cursor-pointer"
                >
                  SEE CAPABILITIES
                </Link>

                <a
                  href={CONTACT_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brutal-btn inline-flex items-center gap-1.5 rounded-full border-2 border-[#141414] bg-[#25D366] px-5 py-4 font-display text-sm font-black text-[#141414] shadow-[4px_4px_0_0_#141414]"
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

      {/* 2. INFINITE ORANGE MARQUEE RIBBON */}
      <div className="relative border-y-2 border-[#141414] bg-[#FF4D00] py-4 sm:py-5 overflow-hidden select-none">
        <div className="flex w-max animate-marquee">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, idx) => (
            <div key={idx} className="flex items-center gap-6 sm:gap-8 mx-3 sm:mx-4">
              <span className="font-display text-base sm:text-xl font-black uppercase tracking-wider text-[#FAF7EE]">
                {item}
              </span>
              <span className="text-[#FFC72E] text-lg sm:text-xl">★</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
