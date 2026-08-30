import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CONTACT_INFO } from '../data/agencyData';
import BrandLogo from './BrandLogo';
import { Terminal, Shield, MessageCircle, Send, Menu, X, Globe, Sparkles, UserCheck, Bot, ChevronDown } from 'lucide-react';

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
    { name: 'Free SEO & Speed Audit', to: '/seo-audit', icon: Sparkles, desc: 'Real-time Core Web Vitals scanner' },
    { name: 'Worldwide 3D Network', to: '/worldwide', icon: Globe, desc: '1,000+ senior engineers worldwide' },
    { name: 'Legal Terms of Service', to: '/terms', icon: Shield, desc: 'GDPR / CCPA enterprise compliance' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl border-b border-indigo-100/90 shadow-sm shadow-indigo-100/40 py-2.5'
          : 'bg-[#EEF2FF]/90 backdrop-blur-md border-b border-indigo-100/60 py-3.5'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 xl:gap-8">
        
        {/* Left: Brand Logo */}
        <div className="flex-shrink-0">
          <BrandLogo size="md" withText={true} linkTo="/" />
        </div>

        {/* Center: Desktop Nav Links with generous whitespace */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {primaryNavLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.name}
                to={link.to}
                className={`text-[13px] font-medium transition-all tracking-normal px-3 py-2 rounded-xl whitespace-nowrap ${
                  isActive 
                    ? "text-sky-700 bg-sky-100/80 font-semibold shadow-xs" 
                    : "text-slate-700 hover:text-sky-600 hover:bg-white/80"
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
              className="inline-flex items-center gap-1 text-[13px] font-medium text-slate-700 hover:text-sky-600 hover:bg-white/80 px-3 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap"
            >
              <span>More</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreDropdownOpen ? 'rotate-180 text-sky-600' : 'text-slate-400'}`} />
            </button>

            {moreDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 p-2 bg-white rounded-2xl border border-indigo-100 shadow-xl shadow-indigo-500/10 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                {extraTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.name}
                      to={tool.to}
                      onClick={() => setMoreDropdownOpen(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-sky-50/80 transition-colors text-left group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-900 group-hover:text-sky-700">{tool.name}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">{tool.desc}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Right: Clean Actions (AI Assistant + Terminal + WhatsApp) */}
        <div className="hidden md:flex items-center gap-2 xl:gap-2.5 flex-shrink-0">
          
          {/* AI Principal GPT Assistant */}
          <button
            onClick={onOpenAIChat}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-white transition-all text-xs font-semibold shadow-xs border border-sky-400/30 hover:scale-105 cursor-pointer whitespace-nowrap"
            title="Ask Unfiltered AI Principal"
          >
            <Bot className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            <span>AI Bot</span>
          </button>

          {/* CLI Terminal Shortcut */}
          <button
            onClick={onOpenTerminal}
            className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-sky-600 hover:border-sky-300 transition-all text-xs font-mono shadow-xs cursor-pointer"
            title="Open Interactive CLI Terminal (Ctrl+K or `)"
          >
            <Terminal className="w-4 h-4" />
          </button>

          {/* Executive Portal */}
          <button
            onClick={onOpenAdmin}
            className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 transition-all text-xs shadow-xs cursor-pointer"
            title="Executive Portal Login"
          >
            <UserCheck className="w-4 h-4" />
          </button>

          {/* WhatsApp Direct Line */}
          <a
            href={CONTACT_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs shadow-sm shadow-emerald-600/20 transition-all hover:scale-105 whitespace-nowrap ml-1"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>

        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={onOpenAIChat}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-950 text-white text-xs font-medium border border-sky-400/30"
          >
            <Bot className="w-3.5 h-3.5 text-sky-400" />
            <span>AI</span>
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-800 shadow-xs cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-3 pb-6 bg-white border-b border-slate-200 shadow-xl space-y-1 animate-in fade-in slide-in-from-top-2 duration-200 text-left">
          {primaryNavLinks.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3.5 py-2 rounded-xl text-sm font-medium text-slate-800 hover:bg-sky-50 hover:text-sky-700 transition-colors"
            >
              {link.name}
            </Link>
          ))}
          
          <div className="pt-3 mt-3 border-t border-slate-100 space-y-2">
            <Link
              to="/seo-audit"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3.5 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-sky-50"
            >
              ⚡ Free SEO & Core Web Vitals Audit
            </Link>
            <Link
              to="/worldwide"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3.5 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-sky-50"
            >
              🌍 Worldwide 3D Global Hubs
            </Link>

            <div className="pt-2 flex items-center gap-2">
              <a
                href={CONTACT_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Vikas
              </a>
              <a
                href={CONTACT_INFO.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                Telegram
              </a>
            </div>
          </div>
        </div>
      )}

    </header>
  );
}
