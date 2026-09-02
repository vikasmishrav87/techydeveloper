import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CONTACT_INFO } from '../data/agencyData';
import { MessageCircle, Send, ShieldCheck, X, Bot, Plus } from 'lucide-react';

export default function FloatingDock({ onOpenTerminal, onOpenAIChat }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5 font-sans">
      
      {/* Expanded Tools Menu in Studio Style */}
      {expanded && (
        <div className="flex flex-col items-end gap-2 mb-1 animate-fadeIn">
          
          {/* Executive Verification Portal */}
          <Link
            to="/admin/verify"
            onClick={() => setExpanded(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#FFC72E] text-[#141414] text-xs font-display font-black uppercase shadow-[3px_3px_0_0_#141414] border-2 border-[#141414] hover:-translate-y-0.5 transition-transform"
          >
            <span>EXECUTIVE PORTAL</span>
            <ShieldCheck className="size-4 text-[#141414]" />
          </Link>

          {/* Ask AI Architect */}
          <button
            onClick={() => {
              if (onOpenAIChat) onOpenAIChat();
              setExpanded(false);
            }}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#141414] text-[#FAF7EE] text-xs font-display font-black uppercase shadow-[3px_3px_0_0_#FF4D00] border-2 border-[#141414] hover:-translate-y-0.5 transition-transform cursor-pointer"
          >
            <span>ASK AI ARCHITECT</span>
            <img src="/assets/brand-logo.png" alt="AI" className="size-4 rounded-xs object-contain" />
          </button>

          {/* Telegram Channel */}
          <a
            href={CONTACT_INFO.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#FAF7EE] text-[#141414] text-xs font-display font-black uppercase shadow-[3px_3px_0_0_#141414] border-2 border-[#141414] hover:-translate-y-0.5 transition-transform"
          >
            <span>TELEGRAM VIP</span>
            <Send className="size-4 text-[#0284C7]" />
          </a>

        </div>
      )}

      {/* Main Dual Dock Buttons */}
      <div className="flex items-center gap-3">
        
        {/* Toggle Hub Button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="size-12 rounded-full border-2 border-[#141414] bg-[#141414] hover:bg-[#FFC72E] text-[#141414] shadow-[4px_4px_0_0_#141414] flex items-center justify-center transition-transform hover:-translate-y-0.5 cursor-pointer p-1"
          title="The Unfiltered Engineer Menu"
        >
          {expanded ? <X className="size-5 text-[#FAF7EE]" /> : <img src="/assets/brand-logo.png" alt="Brand Logo" className="size-8 object-contain rounded-md" />}
        </button>

        {/* Primary WhatsApp Direct Contact Floating Button */}
        <a
          href={CONTACT_INFO.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="h-12 px-5 rounded-full border-2 border-[#141414] bg-[#25D366] text-[#141414] font-display text-xs font-black uppercase tracking-wider shadow-[4px_4px_0_0_#141414] flex items-center gap-2 transition-transform hover:-translate-y-0.5"
          title="Direct WhatsApp with Founder Vikas Mishra"
        >
          <MessageCircle className="size-5 text-[#141414] fill-current" />
          <span className="hidden sm:inline">WHATSAPP FOUNDER</span>
        </a>

      </div>

    </div>
  );
}
