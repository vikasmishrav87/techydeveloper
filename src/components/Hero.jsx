import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CONTACT_INFO } from '../data/agencyData';
import { MessageCircle, Flame, Sparkles, Terminal, Shield, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Hero({ onOpenTerminal, onOpenScanner, onOpenAIChat }) {
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.65 },
        colors: ['#FF4D00', '#FFC72E', '#25D366', '#141414']
      });
    } catch {
      // Fallback if canvas is unavailable
    }
  };

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
      }, 300);
    }, 3200);

    return () => clearInterval(timer);
  }, [rotatingHeadlines.length]);

  const activeHeadline = rotatingHeadlines[currentIndex];

  return (
    <div className="relative overflow-hidden pt-20 sm:pt-24 bg-[#FAF7EE] text-[#141414]">
      
      {/* 1. HERO SECTION WITH DOT GRID & TACTILE CAPSULE STICKERS */}
      <section className="dot-grid relative min-h-[75vh] md:min-h-[85vh] flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-20 overflow-hidden">
        
        {/* Floating Sticker 1: Top Left */}
        <div className="hidden sm:block absolute left-[3%] top-[14%] md:top-[18%] z-20 animate-float-1">
          <Link
            to="/services/cyber-security"
            className="sticker-pill px-4 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-base bg-[#FFC72E] text-[#141414] shadow-[4px_4px_0_0_#141414]"
            title="Explore Cyber Security Practice"
          >
            <span>🛡️ CYBER SECURITY</span>
          </Link>
        </div>

        {/* Floating Sticker 2: Top Right */}
        <div className="hidden sm:block absolute right-[3%] top-[12%] md:top-[16%] z-20 animate-float-2">
          <Link
            to="/services/blockchain-web3"
            className="sticker-pill px-4 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-base bg-[#FF4D00] text-[#FAF7EE] shadow-[4px_4px_0_0_#141414]"
            title="Explore Web3 Practice"
          >
            <span>⬡ WEB3 & BLOCKCHAIN</span>
          </Link>
        </div>

        {/* Floating Sticker 3: Bottom Left */}
        <div className="hidden md:block absolute left-[4%] bottom-[16%] z-20 animate-float-3">
          <Link
            to="/services/software-services"
            className="sticker-pill px-5 py-2.5 text-sm bg-[#F4EFE6] text-[#141414] shadow-[4px_4px_0_0_#141414]"
            title="Explore Cloud Practice"
          >
            <span>☁️ CLOUD ARCHITECTURE</span>
          </Link>
        </div>

        {/* Floating Sticker 4: Bottom Right */}
        <div className="hidden sm:block absolute right-[4%] bottom-[14%] z-20 animate-float-4">
          <Link
            to="/services/ai-agents-workflow"
            className="sticker-pill px-5 py-2.5 text-sm bg-[#141414] text-[#FAF7EE] shadow-[4px_4px_0_0_#141414]"
            title="Explore AI Swarms Practice"
          >
            <span>⚡ AI SWARMS & BOTS</span>
          </Link>
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 mx-auto w-full max-w-6xl">
          
          {/* Eyebrow Tag + Rotation Dots */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="sticker-pill px-3.5 py-1 text-xs bg-[#FFC72E] text-[#141414] shadow-[3px_3px_0_0_#141414]">
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
                  title={`Jump to headline ${dotIdx + 1}`}
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

              {/* Action Capsule Buttons */}
              <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3.5">
                <Link
                  to="/contact"
                  onClick={triggerConfetti}
                  className="sticker-pill px-7 py-4 sm:px-9 sm:py-4.5 text-sm sm:text-base bg-[#141414] hover:bg-[#FF4D00] text-[#FAF7EE] shadow-[4px_4px_0_0_#FF4D00] hover:shadow-[6px_6px_0_0_#141414] cursor-pointer active:scale-95 transition-all"
                >
                  <Zap className="size-4 text-[#FFC72E]" />
                  <span>START A PROJECT</span>
                </Link>

                <Link
                  to="/services"
                  className="sticker-pill px-7 py-4 sm:px-9 sm:py-4.5 text-sm sm:text-base bg-[#F4EFE6] hover:bg-[#FFC72E] text-[#141414] shadow-[4px_4px_0_0_#141414] cursor-pointer active:scale-95 transition-all"
                >
                  <span>SEE CAPABILITIES</span>
                </Link>

                <a
                  href={CONTACT_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sticker-pill px-5 py-4 text-sm bg-[#25D366] text-[#141414] shadow-[4px_4px_0_0_#141414] cursor-pointer active:scale-95 transition-all"
                >
                  <MessageCircle className="size-4 text-[#141414]" />
                  <span>WHATSAPP</span>
                </a>
              </div>
            </div>

            {/* Circular Spinning Stamp Badge with Click Bounce */}
            <div className="hidden sm:block shrink-0">
              <div 
                onClick={triggerConfetti}
                className="group relative grid size-32 sm:size-36 place-items-center cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-90"
              >
                <svg viewBox="0 0 120 120" className="absolute inset-0 animate-rot size-full pointer-events-none select-none">
                  <defs>
                    <path id="badge-circle" d="M60,60 m-47,0 a47,47 0 1,1 94,0 a47,47 0 1,1 -94,0"></path>
                  </defs>
                  <text className="fill-[#141414] font-display text-[11px] font-black tracking-[0.2em] uppercase">
                    <textPath href="#badge-circle">ENGINEER • SECURE • DEPLOY • SCALE • REPEAT •</textPath>
                  </text>
                </svg>
                <span className="grid size-14 place-items-center rounded-full bg-[#FF4D00] border-2 border-[#141414] shadow-[3px_3px_0_0_#141414] group-hover:bg-[#FFC72E] group-hover:text-[#141414] transition-colors">
                  <svg viewBox="0 0 64 64" className="size-7 text-[#FAF7EE] group-hover:text-[#141414] transition-colors" aria-hidden="true">
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
