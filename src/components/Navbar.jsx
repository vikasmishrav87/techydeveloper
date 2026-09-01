import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CONTACT_INFO } from '../data/agencyData';
import BrandLogo from './BrandLogo';
import { Terminal, Shield, ShieldCheck, MessageCircle, Send, Menu, X, Globe, Sparkles, UserCheck, Bot, ChevronDown, CreditCard } from 'lucide-react';

export default function Navbar({ onOpenTerminal, onOpenAdmin, onOpenAIChat }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Primary spacious desktop navigation links
  const primaryNavLinks = [
    { name: 'Home', to: '/' },
    { name: 'Services', to: '/services' },
    { name: '360° Growth', to: '/marketing' },
    { name: 'Security Audit', to: '/security-audit' },
    { name: 'Estimator', to: '/estimator' },
    { name: 'Case Studies', to: '/case-studies' },
    { name: 'Pricing', to: '/pricing' },
    { name: 'Contact', to: '/contact' },
  ];

  // Secondary tools in clean dropdown
  const extraTools = [
    { name: 'Executive Verification Portal', to: '/admin/verify', icon: ShieldCheck, desc: 'Review & approve client payments (Passkey required)' },
    { name: 'Client Payment & Checkout', to: '/checkout', icon: CreditCard, desc: 'Pay via UPI, SBI Bank Wire, or Web3 USDT' },
    { name: 'Free SEO & Speed Audit', to: '/seo-audit', icon: Sparkles, desc: 'Real-time Core Web Vitals scanner' },
    { name: 'Worldwide 3D Network', to: '/worldwide', icon: Globe, desc: '1,000+ senior engineers worldwide' },
    { name: 'Legal Terms of Service', to: '/terms', icon: Shield, desc: 'GDPR / CCPA enterprise compliance' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b-2 border-[#141414] ${
        scrolled
          ? 'bg-[#FAF7EE]/95 backdrop-blur-md py-3 shadow-[0_4px_0_0_#141414]'
          : 'bg-[#FAF7EE]/90 backdrop-blur-sm py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo */}
        <div className="flex-shrink-0">
          <BrandLogo size="md" withText={true} linkTo="/" />
        </div>

        {/* Center: Desktop Nav Links (aijugaad style) */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {primaryNavLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.name}
                to={link.to}
                className={`font-display text-xs xl:text-sm font-bold tracking-wide uppercase transition-colors ${
                  isActive 
                    ? "text-[#FF4D00] underline decoration-[#141414] decoration-2 underline-offset-4" 
                    : "text-[#141414] hover:text-[#FF4D00]"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          {/* More Tools Dropdown */}
          <div className="relative">
            <button
              onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              onBlur={() => setTimeout(() => setMoreDropdownOpen(false), 250)}
              className="inline-flex items-center gap-1 font-display text-xs xl:text-sm font-bold tracking-wide uppercase text-[#141414] hover:text-[#FF4D00] transition-colors cursor-pointer"
            >
              <span>MORE</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreDropdownOpen ? 'rotate-180 text-[#FF4D00]' : 'text-[#141414]'}`} />
            </button>

            {moreDropdownOpen && (
              <div className="absolute top-full right-0 mt-3 w-72 p-2.5 bg-[#FAF7EE] rounded-2xl border-2 border-[#141414] shadow-[5px_5px_0_0_#141414] animate-in fade-in slide-in-from-top-2 duration-200 z-50 text-left">
                {extraTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.name}
                      to={tool.to}
                      onClick={() => setMoreDropdownOpen(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#FFC72E] border border-transparent hover:border-[#141414] transition-all group"
                    >
                      <div className="size-8 rounded-lg bg-[#141414] text-[#FF4D00] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-black uppercase text-[#141414]">{tool.name}</div>
                        <div className="text-[11px] text-[#141414]/70 font-medium line-clamp-1">{tool.desc}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Right: Studio Action Buttons */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          
          {/* Executive Portal */}
          <Link
            to="/admin/verify"
            className="brutal-btn inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#FFC72E] hover:bg-[#FFE600] text-[#141414] border-2 border-[#141414] text-xs font-display font-black shadow-[3px_3px_0_0_#141414] whitespace-nowrap cursor-pointer"
            title="Executive Verification Portal"
          >
            <ShieldCheck className="w-4 h-4 text-[#141414]" />
            <span>PORTAL</span>
          </Link>

          {/* AI Bot */}
          <button
            onClick={onOpenAIChat}
            className="brutal-btn inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#F4EFE6] hover:bg-white text-[#141414] border-2 border-[#141414] text-xs font-display font-bold shadow-[3px_3px_0_0_#141414] cursor-pointer whitespace-nowrap"
            title="Ask AI Principal"
          >
            <Bot className="w-4 h-4 text-[#FF4D00]" />
            <span>AI BOT</span>
          </button>

          {/* START A PROJECT Big Button */}
          <Link
            to="/contact"
            className="brutal-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#141414] hover:bg-[#FF4D00] text-[#FAF7EE] font-display text-xs xl:text-sm font-black tracking-wide uppercase shadow-[4px_4px_0_0_#FF4D00] whitespace-nowrap cursor-pointer"
          >
            <span>START A PROJECT</span>
          </Link>

        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={onOpenAIChat}
            className="brutal-btn flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#141414] text-[#FAF7EE] text-xs font-display font-black border-2 border-[#141414] shadow-[2px_2px_0_0_#FF4D00]"
          >
            <Bot className="w-3.5 h-3.5 text-[#FF4D00]" />
            <span>AI</span>
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="brutal-btn p-2 rounded-full bg-[#FAF7EE] border-2 border-[#141414] text-[#141414] shadow-[3px_3px_0_0_#141414] cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-4 pb-6 bg-[#FAF7EE] border-b-2 border-[#141414] shadow-[0_6px_0_0_#141414] space-y-2 animate-in fade-in slide-in-from-top-2 duration-200 text-left">
          {primaryNavLinks.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-2xl font-display text-sm font-black uppercase text-[#141414] hover:bg-[#FFC72E] border-2 border-transparent hover:border-[#141414] transition-all"
            >
              {link.name}
            </Link>
          ))}
          
          <div className="pt-3 mt-3 border-t-2 border-[#141414]/15 space-y-2.5">
            <Link
              to="/admin/verify"
              onClick={() => setMobileMenuOpen(false)}
              className="brutal-btn flex items-center justify-between px-4 py-3 rounded-full font-display text-xs font-black uppercase bg-[#FFC72E] text-[#141414] border-2 border-[#141414] shadow-[3px_3px_0_0_#141414]"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#141414]" />
                <span>EXECUTIVE PORTAL</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#141414] text-[#FAF7EE] text-[10px]">SECURED</span>
            </Link>

            <Link
              to="/checkout"
              onClick={() => setMobileMenuOpen(false)}
              className="brutal-btn block w-full text-center py-3 rounded-full font-display text-xs font-black uppercase bg-[#FF4D00] text-[#FAF7EE] border-2 border-[#141414] shadow-[3px_3px_0_0_#141414]"
            >
              💳 DIRECT CLIENT CHECKOUT
            </Link>

            <div className="pt-1 flex items-center gap-2">
              <a
                href={CONTACT_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="brutal-btn flex-1 py-3 px-4 rounded-full bg-[#25D366] text-[#141414] border-2 border-[#141414] text-xs font-display font-black uppercase flex items-center justify-center gap-2 shadow-[3px_3px_0_0_#141414]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WHATSAPP</span>
              </a>
              <a
                href={CONTACT_INFO.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="brutal-btn py-3 px-4 rounded-full bg-[#F4EFE6] text-[#141414] border-2 border-[#141414] text-xs font-display font-black uppercase flex items-center justify-center gap-1.5 shadow-[3px_3px_0_0_#141414]"
              >
                <Send className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>TELEGRAM</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </header>
  );
}
