import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { CONTACT_INFO } from '../data/agencyData';

export default function BigCtaBanner() {
  return (
    <section id="contact-banner" className="relative py-20 sm:py-32 bg-[#141414] text-[#FAF7EE] border-t-2 border-[#141414] text-center overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid size-14 place-items-center rounded-full bg-[#FF4D00] border-2 border-[#FAF7EE] mx-auto mb-6 shadow-[4px_4px_0_0_#FFC72E] hover:scale-110 active:scale-95 transition-transform cursor-pointer">
          <svg viewBox="0 0 64 64" className="size-7 text-[#FAF7EE]" aria-hidden="true">
            <g stroke="currentColor" strokeWidth="9" strokeLinecap="round">
              <line x1="32" y1="10" x2="32" y2="54"></line>
              <line x1="12.9" y1="21" x2="51.1" y2="43"></line>
              <line x1="12.9" y1="43" x2="51.1" y2="21"></line>
            </g>
          </svg>
        </div>
        <h2 className="font-display text-[clamp(2.5rem,8vw,6.5rem)] font-black uppercase leading-[0.95] tracking-tight text-[#FAF7EE]">
          GOT AN IDEA?
          <span className="block text-[#FF4D00]">LET’S BUILD IT.</span>
        </h2>
        <p className="mt-6 max-w-lg mx-auto text-base sm:text-xl font-medium text-[#FAF7EE]/70">
          One message is all it takes. Tell us about your high-stakes project and we assemble your senior squad in under 24 hours.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/contact"
            className="sticker-pill px-9 py-4 sm:px-12 sm:py-5 text-base sm:text-lg bg-[#FF4D00] hover:bg-[#FFC72E] hover:text-[#141414] text-[#FAF7EE] border-[#FAF7EE] shadow-[5px_5px_0_0_#FFC72E] cursor-pointer"
          >
            START A PROJECT
          </Link>
          <a
            href={CONTACT_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="sticker-pill px-8 py-4 sm:px-10 sm:py-5 text-base sm:text-lg bg-[#25D366] hover:bg-[#1EBE5D] text-[#141414] border-[#FAF7EE] shadow-[5px_5px_0_0_#FAF7EE] cursor-pointer"
          >
            <MessageCircle className="size-5 text-[#141414]" />
            <span>CHAT ON WHATSAPP</span>
          </a>
        </div>
        <p className="mt-8 font-display text-xs font-bold tracking-widest text-[#FAF7EE]/40 uppercase">
          FOUNDER DIRECT LINE: VIKAS SUNIL MISHRA (+91 9137507092)
        </p>
      </div>
    </section>
  );
}
