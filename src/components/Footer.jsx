import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CONTACT_INFO, SERVICE_PILLARS } from '../data/agencyData';
import BrandLogo from './BrandLogo';
import { ShieldCheck, MessageCircle, Send, Mail, Check, ArrowUp } from 'lucide-react';

export default function Footer({ onOpenTerminal }) {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(CONTACT_INFO.supportEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <footer className="relative bg-[#FAF7EE] text-[#141414] font-sans border-t-2 border-[#141414] pt-16 sm:pt-20 pb-12 overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-16 border-b-2 border-[#141414]/15">
          
          {/* Col 1: Brand, Bio & Direct Contacts */}
          <div className="lg:col-span-4 space-y-4">
            <BrandLogo size="md" withText={true} linkTo="/" />

            <p className="text-xs sm:text-sm text-[#141414]/75 font-medium leading-relaxed max-w-sm">
              Founded by Vikas Mishra. Global design & engineering studio delivering zero-breach Cyber Security, high-throughput Web3 protocols, production AI swarms, and high-converting tech architectures.
            </p>

            {/* Direct Connect Capsule Buttons */}
            <div className="flex flex-col gap-2.5 pt-2">
              <a
                href={CONTACT_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="sticker-pill w-max px-4 py-2 bg-[#25D366] text-[#141414] text-xs shadow-[3px_3px_0_0_#141414]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp (+91 83698 04739)</span>
              </a>

              <a
                href={`mailto:${CONTACT_INFO.supportEmail}`}
                className="sticker-pill w-max px-4 py-2 bg-[#FFC72E] text-[#141414] text-xs shadow-[3px_3px_0_0_#141414]"
                title="Send Support Email"
              >
                <Mail className="w-4 h-4 text-[#141414]" />
                <span>{CONTACT_INFO.supportEmail}</span>
              </a>

              <a
                href={CONTACT_INFO.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="sticker-pill w-max px-4 py-2 bg-[#F4EFE6] text-[#141414] text-xs shadow-[3px_3px_0_0_#141414]"
              >
                <Send className="w-4 h-4 text-[#0284C7]" />
                <span>Telegram: @Yourstrulyvikasmishra</span>
              </a>
            </div>
          </div>

          {/* Col 2: Engineering Practices */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-display text-xs font-black uppercase text-[#FF4D00] tracking-[0.18em]">PRACTICE SQUADS</h4>
            <ul className="space-y-2 text-xs sm:text-sm font-bold uppercase text-[#141414]">
              {SERVICE_PILLARS.slice(0, 5).map((s) => (
                <li key={s.id}>
                  <Link to={`/services/${s.id}`} className="hover:text-[#FF4D00] transition-colors underline decoration-1 underline-offset-2">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Studio Growth & Tools */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-display text-xs font-black uppercase text-[#FF4D00] tracking-[0.18em]">TOOLS & CALCULATORS</h4>
            <ul className="space-y-2 text-xs sm:text-sm font-bold uppercase text-[#141414]">
              <li><Link to="/seo-audit" className="hover:text-[#FF4D00] transition-colors">⚡ Free Technical SEO Audit</Link></li>
              <li><Link to="/security-audit" className="hover:text-[#FF4D00] transition-colors">🛡️ Zero-Trust Security Sandbox</Link></li>
              <li><Link to="/worldwide" className="hover:text-[#FF4D00] transition-colors">🌐 Worldwide 3D Network (9 Hubs)</Link></li>
              <li><Link to="/estimator" className="hover:text-[#FF4D00] transition-colors">🧮 Interactive Scope Estimator</Link></li>
              <li><Link to="/checkout" className="hover:text-[#FF4D00] transition-colors font-black text-[#FF4D00]">💳 Client Payment Gateway</Link></li>
              <li><button onClick={onOpenTerminal} className="hover:text-[#FF4D00] transition-colors text-left uppercase">💻 Interactive CLI Terminal</button></li>
            </ul>
          </div>

          {/* Col 4: Payment Portals & Admin */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-display text-xs font-black uppercase text-[#FF4D00] tracking-[0.18em]">DIRECT SETTLEMENT</h4>
            <ul className="space-y-1.5 text-xs font-mono font-bold text-[#141414]/80">
              <li><Link to="/pay/upi" className="hover:text-[#FF4D00] transition-colors">📱 Google Pay UPI</Link></li>
              <li><Link to="/pay/bank" className="hover:text-[#FF4D00] transition-colors">🏦 SBI Bank Wire</Link></li>
              <li><Link to="/pay/polygon" className="hover:text-[#FF4D00] transition-colors">⬡ Polygon (POL)</Link></li>
              <li><Link to="/pay/bnb" className="hover:text-[#FF4D00] transition-colors">🔶 BNB Chain</Link></li>
              <li><Link to="/pay/tron" className="hover:text-[#FF4D00] transition-colors">₮ Tron (TRC-20)</Link></li>
              <li><Link to="/pay/sol" className="hover:text-[#FF4D00] transition-colors">◎ Solana (SPL)</Link></li>
            </ul>

            <div className="pt-2">
              <Link
                to="/admin/verify"
                className="sticker-pill px-3.5 py-2 bg-[#FFC72E] text-[#141414] text-xs shadow-[3px_3px_0_0_#141414]"
              >
                <ShieldCheck className="w-4 h-4 text-[#141414]" />
                <span>EXECUTIVE PORTAL</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Legal Links, Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-[#141414]/70">
          <div className="flex flex-wrap items-center gap-3">
            <span>© {new Date().getFullYear()} THE UNFILTERED ENGINEER. FOUNDED BY VIKAS SUNIL MISHRA.</span>
            <span>•</span>
            <a href={`mailto:${CONTACT_INFO.supportEmail}`} className="text-[#FF4D00] hover:underline font-mono">
              {CONTACT_INFO.supportEmail}
            </a>
            <span>•</span>
            <Link to="/terms" className="hover:text-[#FF4D00] underline transition-colors">TERMS OF SERVICE</Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-[#FF4D00] underline transition-colors">PRIVACY POLICY</Link>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="sticker-pill size-10 bg-[#FAF7EE] hover:bg-[#FFC72E] text-[#141414] shadow-[3px_3px_0_0_#141414] cursor-pointer"
              title="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
