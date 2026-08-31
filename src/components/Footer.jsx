import React from 'react';
import { Link } from 'react-router-dom';
import { CONTACT_INFO, SERVICE_PILLARS, GLOBAL_HUBS } from '../data/agencyData';
import BrandLogo from './BrandLogo';
import { Shield, MessageCircle, Send, Mail, Terminal, ArrowUp, Lock, Award, Heart } from 'lucide-react';

export default function Footer({ onOpenTerminal, onOpenAdmin }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-white text-slate-700 font-sans border-t border-indigo-100 pt-20 pb-12 overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-16 border-b border-slate-100">
          
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-4 space-y-4">
            <BrandLogo size="md" withText={true} linkTo="/" />

            <p className="text-xs text-slate-600 font-normal leading-relaxed max-w-sm">
              Founded by Vikas Mishra. Global technology & IT solutions delivering zero-breach Cyber Security, high-throughput Blockchain protocols, production AI/ML swarms, enterprise cloud systems, and high-ROAS tech solutions worldwide.
            </p>

            {/* Direct Connect Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <a
                href={CONTACT_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 text-xs font-mono font-medium shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp: {CONTACT_INFO.phoneDisplay}</span>
              </a>

              <a
                href={CONTACT_INFO.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 hover:bg-sky-100 text-xs font-mono font-medium shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegram: {CONTACT_INFO.telegramUser}</span>
              </a>
            </div>
          </div>

          {/* Col 2: Engineering Practices */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase text-sky-800 tracking-wider font-semibold">Practice Areas</h4>
            <ul className="space-y-2 text-xs font-normal text-slate-700">
              {SERVICE_PILLARS.map((s) => (
                <li key={s.id}>
                  <Link to={`/services/${s.id}`} className="hover:text-sky-700 transition-colors">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: 360° Growth & Tools */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase text-indigo-800 tracking-wider font-semibold">Growth & Tools</h4>
            <ul className="space-y-2 text-xs font-normal text-slate-700">
              <li><Link to="/seo-audit" className="hover:text-sky-700 transition-colors font-medium text-sky-800">⚡ Free Live SEO & Speed Audit</Link></li>
              <li><Link to="/security-audit" className="hover:text-sky-700 transition-colors">Live Security & Exploit Scanner</Link></li>
              <li><Link to="/estimator" className="hover:text-sky-700 transition-colors">Interactive Scope Estimator</Link></li>
              <li><Link to="/checkout" className="hover:text-sky-700 transition-colors font-semibold text-slate-900">💳 Universal Client Checkout</Link></li>
              <li><button onClick={onOpenTerminal} className="hover:text-sky-700 transition-colors">Interactive CLI Terminal</button></li>
            </ul>
          </div>

          {/* Col 4: Payment Portals & Admin */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-mono uppercase text-emerald-800 tracking-wider font-semibold">Payment Portals</h4>
            <ul className="space-y-1.5 text-xs font-mono text-slate-600">
              <li><Link to="/pay/upi" className="hover:text-emerald-700 transition-colors">📱 Google Pay UPI</Link></li>
              <li><Link to="/pay/bank" className="hover:text-sky-700 transition-colors">🏦 SBI Wire Transfer</Link></li>
              <li><Link to="/pay/crypto" className="hover:text-purple-700 transition-colors">⛓️ Ethereum ERC-20</Link></li>
              <li><Link to="/pay/card" className="hover:text-indigo-700 transition-colors">💳 Stripe Global Cards</Link></li>
            </ul>

            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="text-[11px] font-mono text-slate-400 hover:text-sky-700 underline"
              >
                Executive Portal
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Legal Links, Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-normal text-slate-500">
          <div className="flex flex-wrap items-center gap-3">
            <span>© {new Date().getFullYear()} The Unfiltered Engineer. All Rights Reserved.</span>
            <span>•</span>
            <Link to="/terms" className="hover:text-sky-700 underline transition-colors">Terms of Service</Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-sky-700 underline transition-colors">Privacy Policy</Link>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-600">
              <span>Crafted with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>for High-Stakes Systems</span>
            </span>

            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Back to Top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
