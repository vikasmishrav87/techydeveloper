import fs from 'fs';
import path from 'path';

const files = {};

// 1. NAVBAR
files['src/components/Navbar.jsx'] = `import React, { useState, useEffect } from 'react';
import { CONTACT_INFO } from '../data/agencyData';
import { Terminal, Shield, MessageCircle, Send, Menu, X, Globe, Sparkles, UserCheck } from 'lucide-react';

export default function Navbar({ onOpenTerminal, onOpenAdmin }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Services', href: '#services' },
    { name: '360° Marketing', href: '#marketing' },
    { name: 'Worldwide 3D', href: '#worldwide' },
    { name: 'Security Audit', href: '#scanner' },
    { name: 'Case Studies', href: '#work' },
    { name: 'Estimator', href: '#estimator' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={"fixed top-0 left-0 right-0 z-40 transition-all duration-300 " + (
      scrolled
        ? "bg-[#030712]/90 backdrop-blur-xl border-b border-slate-800/80 py-3.5 shadow-2xl"
        : "bg-transparent py-5"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-400 to-lavender-500 p-0.5 shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#030712] rounded-[14px] flex items-center justify-center">
              <span className="text-sky-400 font-mono font-bold text-sm">UE</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-normal tracking-tight text-white group-hover:text-sky-300 transition-colors">
              The Unfiltered Engineer
            </span>
            <span className="text-[10px] font-mono text-slate-400 tracking-wider">
              CYBER • WEB3 • AI • GROWTH
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-xs font-light text-slate-300 hover:text-sky-400 transition-colors tracking-wide"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Right Actions: WhatsApp + Telegram + CLI + Admin */}
        <div className="hidden sm:flex items-center gap-2.5">
          
          {/* CLI Terminal Shortcut */}
          <button
            onClick={onOpenTerminal}
            className="p-2.5 rounded-xl bg-obsidian-900 border border-slate-800 text-slate-400 hover:text-sky-400 hover:border-sky-500/30 transition-all text-xs font-mono"
            title="Engineer CLI Terminal (\`)"
          >
            <Terminal className="w-4 h-4" />
          </button>

          {/* Admin Dashboard */}
          <button
            onClick={onOpenAdmin}
            className="p-2.5 rounded-xl bg-obsidian-900 border border-slate-800 text-slate-400 hover:text-lavender-400 hover:border-lavender-500/30 transition-all text-xs"
            title="Executive Portal"
          >
            <UserCheck className="w-4 h-4" />
          </button>

          {/* Telegram */}
          <a
            href={CONTACT_INFO.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:bg-sky-500/20 transition-all"
            title="Telegram Direct"
          >
            <Send className="w-4 h-4" />
          </a>

          {/* Primary WhatsApp CTA */}
          <a
            href={CONTACT_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-lavender-500 hover:opacity-95 text-black font-semibold text-xs transition-all shadow-md"
          >
            <MessageCircle className="w-4 h-4 text-black" />
            <span>WhatsApp: {CONTACT_INFO.phoneDisplay}</span>
          </a>

        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2.5 rounded-xl bg-obsidian-900 border border-slate-800 text-slate-300"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#030712]/95 border-b border-slate-800 p-6 space-y-4 animate-fadeIn backdrop-blur-2xl">
          <div className="grid grid-cols-2 gap-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-obsidian-900 text-xs font-light text-slate-300 hover:text-sky-400"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2.5">
            <a
              href={CONTACT_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 text-black font-semibold text-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp: {CONTACT_INFO.phoneDisplay}</span>
            </a>

            <div className="flex gap-2">
              <a
                href={CONTACT_INFO.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 text-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegram</span>
              </a>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-obsidian-900 border border-slate-700 text-slate-300 text-xs"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
`;

// 2. HERO
files['src/components/Hero.jsx'] = `import React, { useState, useEffect } from 'react';
import { CONTACT_INFO } from '../data/agencyData';
import { Shield, Sparkles, Terminal, ArrowRight, MessageCircle, Send, Globe2, CheckCircle2, Lock, Zap, ChevronRight, Activity } from 'lucide-react';

export default function Hero({ onOpenTerminal, onOpenScanner, onOpenGlobe, onOpenEstimator }) {
  const [activeCodeLine, setActiveCodeLine] = useState(0);

  const securityLogs = [
    { text: "INIT: Zero-Trust Enclave v4.9 Active", color: "text-sky-400" },
    { text: "SHA-256 HMAC Payload Verification: 100% PASS", color: "text-emerald-400" },
    { text: "LAYER-7 WAF: 0 Vulnerabilities Detected (< 3ms)", color: "text-sky-300" },
    { text: "SQUAD DISPATCH: 40+ Countries Synchronized", color: "text-lavender-300" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCodeLine((prev) => (prev + 1) % securityLogs.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-32 pb-20 bg-[#030712] text-slate-100 overflow-hidden">
      
      {/* Dynamic Background Light Fields */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] sm:w-[900px] h-[450px] bg-gradient-to-br from-sky-500/15 via-lavender-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-cyber-grid opacity-25 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* Top Military Defense Status Pill */}
        <div className="flex justify-center mb-8 reveal-on-scroll">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-obsidian-900/90 border border-sky-500/30 text-xs font-mono text-slate-300 shadow-lg shadow-sky-500/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-sky-400 font-semibold">{CONTACT_INFO.securityStatus}</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-slate-400 hidden sm:inline">0 Client Breaches</span>
          </div>
        </div>

        {/* Main Display Headline */}
        <div className="text-center max-w-4xl mx-auto reveal-on-scroll">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extralight tracking-tight text-white leading-[1.08] mb-8">
            The Unfiltered <span className="sky-lavender-gradient font-normal">Engineering</span> & Growth Agency.
          </h1>
          
          <p className="text-slate-300 text-lg sm:text-xl font-light leading-relaxed max-w-3xl mx-auto mb-10">
            We engineer unhackable <strong className="font-normal text-white">Cyber Security</strong>, high-throughput <strong className="font-normal text-white">Blockchain Protocols</strong>, autonomous <strong className="font-normal text-white">AI/ML Architectures</strong>, and full <strong className="font-normal text-white">360° Omnichannel Marketing</strong> for market-leading enterprises worldwide.
          </p>

          {/* Action CTAs: Direct WhatsApp, Telegram, and Interactive Tools */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
            
            {/* Primary Direct WhatsApp CTA */}
            <a
              href={CONTACT_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-sky-400 via-sky-500 to-lavender-500 hover:from-sky-300 hover:to-lavender-400 text-black font-semibold text-sm sm:text-base transition-all shadow-xl shadow-sky-500/25 hover:scale-[1.02] active:scale-[0.98] group"
            >
              <MessageCircle className="w-5 h-5 text-black group-hover:scale-110 transition-transform" />
              <span>Connect on WhatsApp ({CONTACT_INFO.phoneDisplay})</span>
              <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
            </a>

            {/* Telegram Direct Option */}
            <a
              href={CONTACT_INFO.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-obsidian-900/90 hover:bg-obsidian-800 text-slate-200 border border-slate-700 hover:border-sky-500/50 text-sm sm:text-base font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Send className="w-4 h-4 text-sky-400" />
              <span>Telegram: {CONTACT_INFO.telegramUser}</span>
            </a>

            {/* Live Security Scanner Trigger */}
            <button
              onClick={onOpenScanner}
              className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-sky-950/50 hover:bg-sky-950/80 text-sky-300 border border-sky-500/30 text-sm font-mono transition-all"
            >
              <Shield className="w-4 h-4 text-sky-400" />
              <span>Run Live Security Audit</span>
            </button>

          </div>

          {/* Interactive Feature Pills Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-4 border-t border-slate-800/80">
            <button
              onClick={onOpenGlobe}
              className="p-3 rounded-xl bg-obsidian-950/80 border border-slate-800/80 hover:border-sky-500/40 text-left transition-all group"
            >
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 group-hover:text-sky-300">
                <Globe2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Worldwide 3D Orbit</span>
              </div>
              <div className="text-xs font-light text-slate-300 mt-1">40+ Countries Served</div>
            </button>

            <button
              onClick={onOpenEstimator}
              className="p-3 rounded-xl bg-obsidian-950/80 border border-slate-800/80 hover:border-lavender-500/40 text-left transition-all group"
            >
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 group-hover:text-lavender-300">
                <Zap className="w-3.5 h-3.5 text-lavender-400" />
                <span>Scope Estimator</span>
              </div>
              <div className="text-xs font-light text-slate-300 mt-1">Instant Squad Pricing</div>
            </button>

            <a
              href="#marketing"
              className="p-3 rounded-xl bg-obsidian-950/80 border border-slate-800/80 hover:border-sky-500/40 text-left transition-all group"
            >
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 group-hover:text-sky-300">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>360° Growth ROAS</span>
              </div>
              <div className="text-xs font-light text-slate-300 mt-1">Meta, Google & SEO</div>
            </a>

            <button
              onClick={onOpenTerminal}
              className="p-3 rounded-xl bg-obsidian-950/80 border border-slate-800/80 hover:border-sky-500/40 text-left transition-all group"
            >
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 group-hover:text-sky-300">
                <Terminal className="w-3.5 h-3.5 text-sky-400" />
                <span>Engineer CLI</span>
              </div>
              <div className="text-xs font-light text-slate-300 mt-1">Press \` or Click</div>
            </button>
          </div>

        </div>

        {/* Live Defense Protocol Terminal Banner */}
        <div className="mt-14 max-w-2xl mx-auto glass-card-dark rounded-2xl p-4 border border-sky-500/25 glow-border-sky reveal-on-scroll">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 text-slate-300">defense-engine@unfiltered-core:~</span>
            </div>
            <span className="text-sky-400 font-semibold">ZERO-TRUST AUDIT STREAM</span>
          </div>

          <div className="font-mono text-xs flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
              <ChevronRight className="w-3.5 h-3.5 text-sky-400 flex-shrink-0 animate-pulse" />
              <span className={securityLogs[activeCodeLine].color}>
                {securityLogs[activeCodeLine].text}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 uppercase flex-shrink-0 ml-2">Real-Time</span>
          </div>
        </div>

      </div>
    </section>
  );
}
`;

// 3. SERVICES SECTION
files['src/components/ServicesSection.jsx'] = `import React, { useState } from 'react';
import { SERVICE_PILLARS, CONTACT_INFO } from '../data/agencyData';
import { Shield, Cpu, Brain, Layers, Globe2, ArrowRight, CheckCircle2, MessageCircle, Send, X, Users, Terminal, Sparkles } from 'lucide-react';

export default function ServicesSection({ onSelectService }) {
  const [activeModalService, setActiveModalService] = useState(null);

  const getServiceIcon = (id) => {
    switch (id) {
      case 'cyber-security':
        return <Shield className="w-5 h-5 text-sky-400" />;
      case 'blockchain-web3':
        return <Layers className="w-5 h-5 text-lavender-400" />;
      case 'ai-cognitive':
        return <Brain className="w-5 h-5 text-sky-400" />;
      case 'fullstack-cloud':
        return <Cpu className="w-5 h-5 text-lavender-400" />;
      case 'digital-marketing-360':
        return <Globe2 className="w-5 h-5 text-sky-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-sky-400" />;
    }
  };

  const getWhatsAppForService = (service) => {
    const text = encodeURIComponent("Hi Vikas, I am interested in engaging The Unfiltered Engineer's specialized " + service.title + " team for our company.");
    return "https://wa.me/919137507092?text=" + text;
  };

  return (
    <section id="services" className="relative py-28 bg-[#030712] text-slate-100 overflow-hidden">
      
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-lavender-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 reveal-on-scroll">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-950/70 border border-sky-500/30 text-sky-300 text-xs font-mono uppercase tracking-widest mb-4">
            <Users className="w-3.5 h-3.5 text-sky-400" />
            Specialized Engineering Squads
          </div>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-white mb-6">
            Elite Full-Stack & <span className="sky-lavender-gradient font-normal">Mission-Critical</span> Practices
          </h2>
          <p className="text-slate-400 text-base sm:text-lg font-light leading-relaxed">
            We do not employ generic generalists. Every practice is staffed by dedicated senior specialists with proven production track records in high-throughput cryptography, distributed systems, AI research, and high-ROAS growth.
          </p>
        </div>

        {/* 5 Service Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {SERVICE_PILLARS.map((service, index) => {
            const isSky = service.accentColor === 'sky';
            return (
              <div
                key={service.id}
                className={"group rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 relative overflow-hidden border " + (
                  isSky
                    ? "glass-card-dark border-sky-500/20 hover:border-sky-400/50 hover:shadow-sky-glow"
                    : "glass-card-dark border-lavender-500/20 hover:border-lavender-400/50 hover:shadow-lavender-glow"
                ) + " reveal-on-scroll"}
              >
                {/* Visual Image Preview */}
                <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-6 bg-obsidian-950 border border-slate-800">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent" />
                  
                  {/* Badge & Squad Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full bg-obsidian-950/90 border border-slate-700/70 text-slate-200 text-xs font-mono backdrop-blur-md">
                      {service.badge}
                    </span>
                  </div>
                </div>

                {/* Content Block */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={"p-2.5 rounded-xl " + (
                      isSky ? "bg-sky-950 border border-sky-500/30" : "bg-lavender-950 border border-lavender-500/30"
                    )}>
                      {getServiceIcon(service.id)}
                    </div>
                    <div>
                      <h3 className="text-xl font-normal text-white group-hover:text-sky-300 transition-colors">
                        {service.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[11px] font-mono text-slate-400 bg-obsidian-900 px-2.5 py-0.5 rounded-md border border-slate-800">
                      👥 {service.squadName}
                    </span>
                  </div>

                  <p className="text-slate-400 text-sm font-light leading-relaxed mb-6">
                    {service.tagline}
                  </p>

                  {/* Key Stats Bar */}
                  <div className="grid grid-cols-2 gap-3 py-3 border-t border-b border-slate-800/80 mb-6">
                    {service.keyStats.slice(0, 2).map((stat, sIdx) => (
                      <div key={sIdx}>
                        <div className="text-lg font-light text-white font-mono">{stat.value}</div>
                        <div className="text-[11px] text-slate-500 font-light">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => setActiveModalService(service)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-obsidian-900 hover:bg-obsidian-800 text-slate-200 border border-slate-700 text-xs font-medium transition-all"
                  >
                    <span>Inspect Squad & Specs</span>
                    <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
                  </button>

                  <a
                    href={getWhatsAppForService(service)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 transition-all"
                    title="Direct WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>

              </div>
            );
          })}

        </div>

      </div>

      {/* In-Depth Service & Squad Modal */}
      {activeModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-obsidian-900 border border-sky-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setActiveModalService(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-obsidian-950 text-slate-400 hover:text-white border border-slate-800 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-sky-950 border border-sky-500/30">
                {getServiceIcon(activeModalService.id)}
              </div>
              <div>
                <span className="text-xs font-mono text-sky-400 uppercase tracking-widest font-medium">Practice Specification</span>
                <h3 className="text-2xl font-light text-white">{activeModalService.title}</h3>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-obsidian-950 border border-slate-800 my-4">
              <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                <span>Squad: <strong className="text-sky-300">{activeModalService.squadName}</strong></span>
                <span>Staffing: <strong className="text-lavender-300">{activeModalService.squadHeadcount}</strong></span>
              </div>
            </div>

            {/* Key Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
              {activeModalService.keyStats.map((st, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-obsidian-950/80 border border-slate-800/80 text-center">
                  <div className="text-lg font-light text-white font-mono">{st.value}</div>
                  <div className="text-[10px] text-slate-400 font-light mt-0.5">{st.label}</div>
                </div>
              ))}
            </div>

            {/* Full Capabilities */}
            <div className="my-6">
              <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-3">Core Technical Capabilities</h4>
              <div className="space-y-2">
                {activeModalService.capabilities.map((cap, cIdx) => (
                  <div key={cIdx} className="flex items-start gap-2.5 text-xs font-light text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" />
                    <span>{cap}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack Pills */}
            <div className="my-4">
              <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-2">Verified Technology Stack</h4>
              <div className="flex flex-wrap gap-1.5">
                {activeModalService.techStack.map((tech, tIdx) => (
                  <span key={tIdx} className="px-2.5 py-1 rounded-lg bg-obsidian-950 border border-slate-800 text-sky-300 font-mono text-xs">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Deliverables */}
            <div className="p-4 rounded-xl bg-sky-950/40 border border-sky-500/20 my-4 text-xs font-light text-slate-300">
              <strong className="text-sky-300 font-normal">Standard Deliverables:</strong> {activeModalService.deliverables}
            </div>

            {/* Direct Connect Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-800">
              <a
                href={getWhatsAppForService(activeModalService)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 transition-all text-xs font-medium"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp: {CONTACT_INFO.phoneDisplay}</span>
              </a>
              <a
                href={CONTACT_INFO.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-300 hover:bg-sky-500/30 transition-all text-xs font-medium"
              >
                <Send className="w-4 h-4 text-sky-400" />
                <span>Telegram: {CONTACT_INFO.telegramUser}</span>
              </a>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
`;

// 4. DIGITAL MARKETING SECTION
files['src/components/DigitalMarketingSection.jsx'] = `import React, { useState } from 'react';
import { MARKETING_CHANNELS, CONTACT_INFO } from '../data/agencyData';
import { Megaphone, Target, Search, Compass, TrendingUp, DollarSign, BarChart3, CheckCircle2, MessageCircle, Send, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export default function DigitalMarketingSection({ onBookMarketing }) {
  const [selectedChannel, setSelectedChannel] = useState(MARKETING_CHANNELS[0]);
  
  // Interactive ROAS Calculator State
  const [adSpend, setAdSpend] = useState(15000);
  const [targetRoas, setTargetRoas] = useState(4.6);
  const [avgTicket, setAvgTicket] = useState(350);

  const projectedRevenue = Math.round(adSpend * targetRoas);
  const estimatedConversions = Math.round(projectedRevenue / avgTicket);
  const estimatedProfit = Math.round(projectedRevenue - adSpend - (projectedRevenue * 0.35));

  const iconMap = {
    Megaphone: Megaphone,
    Target: Target,
    Search: Search,
    Compass: Compass
  };

  const getCustomWhatsAppLink = () => {
    const text = encodeURIComponent("Hi Vikas, I tested the ROAS Growth Calculator on The Unfiltered Engineer website. My target monthly ad spend is $" + adSpend.toLocaleString() + " aiming for " + targetRoas + "x ROAS ($" + projectedRevenue.toLocaleString() + " revenue). Let's discuss a 360° growth strategy.");
    return "https://wa.me/919137507092?text=" + text;
  };

  return (
    <section id="marketing" className="relative py-24 bg-white text-slate-900 overflow-hidden border-t border-b border-slate-200">
      
      {/* Background Decorative Waves Watermark & Light Grids */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-[0.07] pointer-events-none mix-blend-multiply"
        style={{ backgroundImage: "url('/assets/wave-lavender-blue.jpg')" }}
      />
      <div className="absolute inset-0 bg-light-grid opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Inverted Light Band Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 reveal-on-scroll">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-mono uppercase tracking-widest mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            360° Omnichannel Growth Engine
          </div>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-slate-950 mb-6">
            We Run <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-lavender-600 font-normal">All Marketing</span> for Scaled Brands
          </h2>
          <p className="text-slate-600 text-base sm:text-lg font-light leading-relaxed">
            Engineering-grade marketing execution. From server-side Meta CAPI algorithms and Google PMax smart bidding to programmatic SEO dominance and high-impact offline billboards — our specialized growth squad manages the entire lifecycle.
          </p>
        </div>

        {/* Marketing Pillars Grid & Deep Dive */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-start">
          
          {/* Left Column: Channel Selector Tabs */}
          <div className="lg:col-span-5 space-y-3 reveal-on-scroll">
            <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-2">Select Growth Channel</h3>
            
            {MARKETING_CHANNELS.map((channel) => {
              const IconComp = iconMap[channel.icon] || Megaphone;
              const isSelected = selectedChannel.id === channel.id;
              return (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel)}
                  className={"w-full text-left p-5 rounded-2xl transition-all duration-300 border flex items-start gap-4 " + (
                    isSelected
                      ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-900/10 translate-x-1.5"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200/80 hover:border-slate-300"
                  )}
                >
                  <div className={"p-3 rounded-xl " + (
                    isSelected ? "bg-sky-500 text-black" : "bg-sky-100 text-sky-700"
                  )}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-medium tracking-tight">{channel.name}</h4>
                      <span className={"text-xs font-mono px-2 py-0.5 rounded-full " + (
                        isSelected ? "bg-slate-800 text-sky-300" : "bg-white text-slate-600 border border-slate-200"
                      )}>
                        {channel.roasBenchmark}
                      </span>
                    </div>
                    <p className={"text-xs mt-1.5 font-light line-clamp-2 " + (
                      isSelected ? "text-slate-300" : "text-slate-500"
                    )}>
                      {channel.summary}
                    </p>
                  </div>
                </button>
              );
            })}

            {/* Specialized Team Badge */}
            <div className="p-4 rounded-xl bg-sky-50/80 border border-sky-100 text-slate-700 mt-4">
              <div className="flex items-center gap-2 text-xs font-mono text-sky-800 mb-1">
                <ShieldCheck className="w-4 h-4 text-sky-600" />
                Specialized Growth Squad
              </div>
              <p className="text-xs text-slate-600 font-light">
                6 Senior Media Buyers, Creative Animators, and Technical SEO Engineers dedicated exclusively to your campaigns.
              </p>
            </div>

          </div>

          {/* Right Column: Active Channel In-Depth Breakdown */}
          <div className="lg:col-span-7 reveal-on-scroll">
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between pb-6 border-b border-slate-200">
                <div>
                  <span className="text-xs font-mono text-sky-600 uppercase tracking-wider font-semibold">Specialized Execution</span>
                  <h3 className="text-2xl font-light text-slate-900 mt-1">{selectedChannel.name}</h3>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-right shadow-sm">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Target Multiplier</div>
                  <div className="text-sm font-mono text-indigo-600 font-semibold">{selectedChannel.roasBenchmark}</div>
                </div>
              </div>

              <div className="my-6">
                <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-4">Engineering Capabilities & Protocols</h4>
                <div className="space-y-3.5">
                  {selectedChannel.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm font-light text-slate-700 leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fast Direct Action for Selected Channel */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={"https://wa.me/919137507092?text=Hi%20Vikas,%20I%20want%20to%20scale%20our%20" + encodeURIComponent(selectedChannel.name) + "%20with%20The%20Unfiltered%20Engineer."}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition-all shadow-md group"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span>Launch {selectedChannel.name.split(' ')[0]} via WhatsApp</span>
                </a>
                <a
                  href={CONTACT_INFO.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-medium text-sm transition-all"
                >
                  <Send className="w-4 h-4 text-sky-600" />
                  <span>Telegram Consultation</span>
                </a>
              </div>

            </div>
          </div>

        </div>

        {/* Interactive ROAS & Growth ROI Simulator */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-obsidian-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden reveal-on-scroll">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <TrendingUp className="w-48 h-48 text-sky-400" />
          </div>

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950 border border-sky-500/30 text-sky-400 text-xs font-mono uppercase tracking-widest mb-2">
                  <BarChart3 className="w-3.5 h-3.5 text-sky-400" />
                  Interactive Simulator
                </div>
                <h3 className="text-2xl sm:text-3xl font-light tracking-tight text-white">
                  360° Growth & ROAS <span className="sky-lavender-gradient font-normal">ROI Calculator</span>
                </h3>
              </div>
              <p className="text-xs text-slate-400 max-w-sm font-light">
                Simulate anticipated scale using our proprietary full-funnel attribution and automated bidding algorithms.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Sliders Area */}
              <div className="lg:col-span-6 space-y-6">
                
                {/* Monthly Ad Spend Slider */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300 font-light">Monthly Media Ad Spend</span>
                    <span className="text-sky-400 font-mono font-semibold">\${adSpend.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="3000"
                    max="100000"
                    step="1000"
                    value={adSpend}
                    onChange={(e) => setAdSpend(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
                    <span>\$3,000</span>
                    <span>\$50,000</span>
                    <span>\$100,000+</span>
                  </div>
                </div>

                {/* Target Blended ROAS Slider */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300 font-light">Target Blended ROAS</span>
                    <span className="text-lavender-300 font-mono font-semibold">{targetRoas}x Return</span>
                  </div>
                  <input
                    type="range"
                    min="2.5"
                    max="8.0"
                    step="0.1"
                    value={targetRoas}
                    onChange={(e) => setTargetRoas(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-lavender-400"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
                    <span>2.5x (Baseline)</span>
                    <span>4.6x (Agency Avg)</span>
                    <span>8.0x (Hyper-Growth)</span>
                  </div>
                </div>

                {/* Average Ticket / Order Value */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300 font-light">Average Order / Deal Size</span>
                    <span className="text-emerald-400 font-mono font-semibold">\${avgTicket.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="5000"
                    step="50"
                    value={avgTicket}
                    onChange={(e) => setAvgTicket(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
                    <span>\$50</span>
                    <span>\$1,000</span>
                    <span>\$5,000</span>
                  </div>
                </div>

              </div>

              {/* Live Output Metrics Display */}
              <div className="lg:col-span-6 bg-obsidian-900/90 rounded-2xl p-6 border border-slate-800 glow-border-sky">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  
                  <div className="p-4 rounded-xl bg-obsidian-950 border border-slate-800">
                    <div className="text-xs font-mono text-slate-400 uppercase">Projected Revenue</div>
                    <div className="text-2xl sm:text-3xl font-light text-sky-400 mt-1 font-mono">
                      \${projectedRevenue.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">At {targetRoas}x Multiplier</div>
                  </div>

                  <div className="p-4 rounded-xl bg-obsidian-950 border border-slate-800">
                    <div className="text-xs font-mono text-slate-400 uppercase">Projected Net Gain</div>
                    <div className="text-2xl sm:text-3xl font-light text-emerald-400 mt-1 font-mono">
                      +\${estimatedProfit.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">After Media & COGS</div>
                  </div>

                  <div className="p-4 rounded-xl bg-obsidian-950 border border-slate-800">
                    <div className="text-xs font-mono text-slate-400 uppercase">Total Conversions</div>
                    <div className="text-2xl sm:text-3xl font-light text-white mt-1 font-mono">
                      {estimatedConversions.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">Qualified Customers</div>
                  </div>

                  <div className="p-4 rounded-xl bg-obsidian-950 border border-slate-800">
                    <div className="text-xs font-mono text-slate-400 uppercase">Blended ROAS</div>
                    <div className="text-2xl sm:text-3xl font-light text-lavender-300 mt-1 font-mono">
                      {targetRoas}x
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">Full-Funnel Blended</div>
                  </div>

                </div>

                {/* Instant Quote WhatsApp Dispatch */}
                <a
                  href={getCustomWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-500 to-lavender-500 hover:opacity-95 text-black font-semibold text-sm transition-all shadow-lg shadow-sky-500/20"
                >
                  <MessageCircle className="w-5 h-5 text-black" />
                  <span>Send This Growth Plan Directly to WhatsApp ({CONTACT_INFO.phoneDisplay})</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </a>

              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
`;

// Write out all files
// 5. WORLDWIDE GLOBE
files['src/components/WorldwideGlobe.jsx'] = `import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLOBAL_HUBS, CONTACT_INFO } from '../data/agencyData';
import { Globe, Shield, Radio, Activity, Send, MessageCircle, ExternalLink, Zap } from 'lucide-react';

export default function WorldwideGlobe({ onSelectHub }) {
  const mountRef = useRef(null);
  const [activeHub, setActiveHub] = useState(GLOBAL_HUBS[5]);
  const [isRotating, setIsRotating] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 240;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const sphereGeo = new THREE.SphereGeometry(70, 48, 48);
    const sphereMat = new THREE.MeshPhongMaterial({
      color: 0x050b18,
      emissive: 0x030712,
      shininess: 25,
      transparent: true,
      opacity: 0.92,
    });
    const globeMesh = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(globeMesh);

    const wireframeGeo = new THREE.SphereGeometry(70.8, 28, 28);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const wireframeMesh = new THREE.Mesh(wireframeGeo, wireframeMat);
    globeGroup.add(wireframeMesh);

    const glowGeo = new THREE.SphereGeometry(75, 32, 32);
    const glowMat = new THREE.ShaderMaterial({
      vertexShader: "varying vec3 vNormal; void main() { vNormal = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
      fragmentShader: "varying vec3 vNormal; void main() { float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 2.2); gl_FragColor = vec4(0.22, 0.74, 0.97, 1.0) * intensity * 0.85; }",
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    globeGroup.add(glowMesh);

    const starGeo = new THREE.BufferGeometry();
    const starCount = 350;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 600;
      starPositions[i + 1] = (Math.random() - 0.5) * 600;
      starPositions[i + 2] = (Math.random() - 0.5) * 600;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xa5b4fc,
      size: 1.6,
      transparent: true,
      opacity: 0.6,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    const latLonToVector3 = (lat, lon, radius) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };

    const hubMarkers = [];
    GLOBAL_HUBS.forEach((hub) => {
      const pos = latLonToVector3(hub.lat, hub.lon, 71.5);
      
      const markerGeo = new THREE.SphereGeometry(1.6, 12, 12);
      const markerMat = new THREE.MeshBasicMaterial({
        color: hub.id === 'bom' ? 0x38bdf8 : 0x818cf8,
      });
      const markerMesh = new THREE.Mesh(markerGeo, markerMat);
      markerMesh.position.copy(pos);
      globeGroup.add(markerMesh);

      const ringGeo = new THREE.RingGeometry(2.0, 3.2, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos);
      ringMesh.lookAt(new THREE.Vector3(0, 0, 0));
      globeGroup.add(ringMesh);

      hubMarkers.push({ marker: markerMesh, ring: ringMesh, hub });
    });

    const createConnectionArc = (hub1, hub2, colorHex) => {
      const v1 = latLonToVector3(hub1.lat, hub1.lon, 71.5);
      const v2 = latLonToVector3(hub2.lat, hub2.lon, 71.5);
      const mid = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);
      const distance = v1.distanceTo(v2);
      mid.normalize().multiplyScalar(71.5 + distance * 0.28);

      const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
      const points = curve.getPoints(36);
      const curveGeo = new THREE.BufferGeometry().setFromPoints(points);
      const curveMat = new THREE.LineBasicMaterial({
        color: colorHex || 0x38bdf8,
        transparent: true,
        opacity: 0.55,
        linewidth: 2,
      });
      const curveMesh = new THREE.Line(curveGeo, curveMat);
      globeGroup.add(curveMesh);
    };

    createConnectionArc(GLOBAL_HUBS[5], GLOBAL_HUBS[2], 0x38bdf8);
    createConnectionArc(GLOBAL_HUBS[5], GLOBAL_HUBS[4], 0x818cf8);
    createConnectionArc(GLOBAL_HUBS[5], GLOBAL_HUBS[6], 0x38bdf8);
    createConnectionArc(GLOBAL_HUBS[2], GLOBAL_HUBS[1], 0x38bdf8);
    createConnectionArc(GLOBAL_HUBS[1], GLOBAL_HUBS[0], 0x818cf8);
    createConnectionArc(GLOBAL_HUBS[0], GLOBAL_HUBS[7], 0x38bdf8);
    createConnectionArc(GLOBAL_HUBS[6], GLOBAL_HUBS[8], 0x818cf8);
    createConnectionArc(GLOBAL_HUBS[2], GLOBAL_HUBS[3], 0x38bdf8);
    createConnectionArc(GLOBAL_HUBS[3], GLOBAL_HUBS[4], 0x818cf8);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 1.4);
    dirLight1.position.set(120, 100, 100);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x818cf8, 0.8);
    dirLight2.position.set(-120, -80, -100);
    scene.add(dirLight2);

    globeGroup.rotation.y = 1.4;
    globeGroup.rotation.x = 0.25;

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;
      globeGroup.rotation.y += deltaX * 0.005;
      globeGroup.rotation.x += deltaY * 0.005;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => { isDragging = false; };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (!isDragging) {
        globeGroup.rotation.y += 0.0022;
      }

      hubMarkers.forEach((item, idx) => {
        const scale = 1 + Math.sin(elapsedTime * 3 + idx) * 0.25;
        item.ring.scale.set(scale, scale, scale);
      });

      starField.rotation.y = elapsedTime * 0.0006;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      if (container.contains(domEl)) {
        container.removeChild(domEl);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <section id="worldwide" className="relative py-24 bg-[#030712] text-slate-100 overflow-hidden border-t border-b border-sky-900/30">
      
      <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-lavender-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16 reveal-on-scroll">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-950/70 border border-sky-500/30 text-sky-300 text-xs font-mono uppercase tracking-widest mb-4">
            <Radio className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            Global Engineering Network • 40+ Countries
          </div>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-white mb-6">
            Serving Brands & Enterprises <span className="sky-lavender-gradient font-normal">Worldwide</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg font-light leading-relaxed">
            From Silicon Valley to Zurich, Tokyo to Mumbai — our specialized engineering squads and digital marketing growth engines operate 24/7 across every time zone with zero latency compromise.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-5 space-y-6 reveal-on-scroll">
            
            <div className="glass-card-dark p-6 rounded-2xl border border-sky-500/20 glow-border-sky relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Globe className="w-28 h-28 text-sky-400" />
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase text-sky-400 tracking-wider">Global Infrastructure Status</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  100% OPERATIONAL
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 my-4">
                <div className="p-3.5 rounded-xl bg-obsidian-900/90 border border-slate-800">
                  <div className="text-2xl sm:text-3xl font-light text-white">40+</div>
                  <div className="text-xs text-slate-400 mt-1 font-light">Countries Served</div>
                </div>
                <div className="p-3.5 rounded-xl bg-obsidian-900/90 border border-slate-800">
                  <div className="text-2xl sm:text-3xl font-light text-sky-300">99.999%</div>
                  <div className="text-xs text-slate-400 mt-1 font-light">Zero-Breach Uptime SLA</div>
                </div>
                <div className="p-3.5 rounded-xl bg-obsidian-900/90 border border-slate-800">
                  <div className="text-2xl sm:text-3xl font-light text-lavender-300">150+</div>
                  <div className="text-xs text-slate-400 mt-1 font-light">Enterprise Deployments</div>
                </div>
                <div className="p-3.5 rounded-xl bg-obsidian-900/90 border border-slate-800">
                  <div className="text-2xl sm:text-3xl font-light text-white">24/7</div>
                  <div className="text-xs text-slate-400 mt-1 font-light">Follow-The-Sun NOC</div>
                </div>
              </div>

              <p className="text-xs text-slate-400 font-light leading-relaxed border-t border-slate-800/80 pt-3">
                Decentralized nodes ensure zero single-point-of-failure. Engineering squads deployed across North America, Europe, Middle East, and APAC.
              </p>
            </div>

            <div className="glass-card-lavender p-6 rounded-2xl border border-lavender-500/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-lavender-400 animate-pulse" />
                  <h4 className="text-sm font-medium text-white tracking-wide">Worldwide Regional Telemetry</h4>
                </div>
                <span className="text-xs font-mono text-slate-400">Click Hub Below</span>
              </div>

              <div className="p-4 rounded-xl bg-obsidian-950/80 border border-lavender-900/40 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-base font-normal text-white">{activeHub.name}</h5>
                    <p className="text-xs text-lavender-300 font-mono mt-0.5">{activeHub.role}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-0.5 rounded bg-sky-950 border border-sky-500/30 text-sky-300 text-xs font-mono">
                      {activeHub.ping}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1">{activeHub.clients} Active Projects</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {GLOBAL_HUBS.map((hub) => (
                  <button
                    key={hub.id}
                    onClick={() => setActiveHub(hub)}
                    className={"px-2.5 py-1 rounded-lg text-xs font-mono transition-all " + (
                      activeHub.id === hub.id
                        ? "bg-sky-500 text-black font-semibold shadow-lg shadow-sky-500/30"
                        : "bg-obsidian-900 text-slate-400 hover:text-white hover:bg-obsidian-800 border border-slate-800"
                    )}
                  >
                    {hub.name.split(',')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={CONTACT_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25 hover:text-white transition-all text-sm font-medium group"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>WhatsApp: {CONTACT_INFO.phoneDisplay}</span>
              </a>
              <a
                href={CONTACT_INFO.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-sky-500/15 border border-sky-500/40 text-sky-300 hover:bg-sky-500/25 hover:text-white transition-all text-sm font-medium group"
              >
                <Send className="w-4 h-4 text-sky-400 group-hover:translate-x-0.5 transition-transform" />
                <span>Telegram: {CONTACT_INFO.telegramUser}</span>
              </a>
            </div>

          </div>

          <div className="lg:col-span-7 relative reveal-on-scroll">
            <div className="relative w-full h-[460px] sm:h-[560px] rounded-3xl overflow-hidden glass-card-dark border border-sky-500/20 glow-border-sky flex items-center justify-center">
              
              <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

              <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto pointer-events-none">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-obsidian-950/90 border border-slate-700/60 text-slate-300 text-xs font-mono backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                  Interactive 3D Orbit: Drag with mouse to rotate
                </div>
              </div>

              <div className="absolute top-4 right-4 pointer-events-none">
                <div className="px-3 py-1.5 rounded-xl bg-obsidian-950/85 border border-sky-500/30 text-right backdrop-blur-md">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Synchronized Nodes</div>
                  <div className="text-xs font-mono text-sky-300 font-semibold">9 Hubs • 40+ Edge PoPs</div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
`;

// 6. LIVE AUDIT SCANNER
files['src/components/LiveAuditScanner.jsx'] = `import React, { useState } from 'react';
import { CONTACT_INFO } from '../data/agencyData';
import { Shield, ShieldAlert, ShieldCheck, Lock, Terminal, Activity, ArrowRight, MessageCircle, Send, CheckCircle2, AlertTriangle, RefreshCw, Cpu, Database } from 'lucide-react';
import { logSecurityEvent } from '../services/storageService';

export default function LiveAuditScanner({ onRequestFix }) {
  const [targetUrl, setTargetUrl] = useState('enterprise-client-core.io');
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentStepText, setCurrentStepText] = useState('');
  const [auditResult, setAuditResult] = useState(null);

  const presets = [
    { name: 'Fintech Banking Core', url: 'banking.solisfinance.ch' },
    { name: 'Web3 DEX & Bridge', url: 'app.defix-exchange.io' },
    { name: 'Enterprise AI Cloud', url: 'api.cognihealth.ai' },
    { name: 'High-Scale E-Commerce', url: 'store.apexbrand.com' },
  ];

  const runLiveAudit = () => {
    if (!targetUrl.trim()) return;
    setScanning(true);
    setScanProgress(0);
    setAuditResult(null);

    const steps = [
      { progress: 20, text: "Initializing Zero-Trust Penetration Sandbox..." },
      { progress: 45, text: "Testing TLS 1.3 Ciphers, HSTS & Certificate Pins..." },
      { progress: 70, text: "Decompiling Bytecode & Analyzing Reentrancy / Logic Vectors..." },
      { progress: 88, text: "Benchmarking Layer-7 DDoS & Edge WAF Latency (< 3.2ms)..." },
      { progress: 100, text: "Compiling Military-Grade Security Audit Dossier..." }
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setScanProgress(steps[stepIndex].progress);
        setCurrentStepText(steps[stepIndex].text);
        stepIndex++;
      } else {
        clearInterval(interval);
        setScanning(false);
        setAuditResult({
          domain: targetUrl,
          score: 98,
          grade: 'A+ (Military-Grade Defense)',
          sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          checks: [
            { name: "Content-Security-Policy & Anti-XSS Sanitization", status: "PASS", desc: "Strict script-src directives active. Zero reflection vulnerabilities." },
            { name: "HMAC-SHA256 Payload Signature Integrity", status: "PASS", desc: "Cryptographic validation blocks tampering & man-in-the-middle attacks." },
            { name: "Smart Contract Reentrancy & Overflow Immunity", status: "PASS", desc: "Formal verification confirms zero high/critical vulnerabilities." },
            { name: "Token Bucket Rate Limiting & Anti-DDoS WAF", status: "PASS", desc: "Perimeter drops malicious floods with < 3.8ms overhead." },
            { name: "Zero-Day CVE Vulnerability Surface", status: "CLEAN", desc: "0 unpatched CVE vulnerabilities discovered in dependency tree." }
          ]
        });
        logSecurityEvent("Security Scan Completed: [" + targetUrl + "]", '198.51.100.42', 'PenTest Sandbox');
      }
    }, 450);
  };

  const getWhatsAppAuditLink = () => {
    const text = encodeURIComponent("Hi Vikas, I just ran the Live Security Audit Scanner for \\"" + targetUrl + "\\" on The Unfiltered Engineer platform. I would like to schedule a full-scope exploit test and remediation sprint for our infrastructure.");
    return "https://wa.me/919137507092?text=" + text;
  };

  return (
    <section id="scanner" className="relative py-24 bg-[#F8FAFC] text-slate-900 overflow-hidden border-t border-b border-slate-200">
      
      <div className="absolute inset-0 bg-light-grid opacity-70 pointer-events-none" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16 reveal-on-scroll">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-100 border border-sky-300 text-sky-800 text-xs font-mono uppercase tracking-widest mb-4 shadow-sm">
            <Lock className="w-3.5 h-3.5 text-sky-700" />
            Live Zero-Trust Penetration Sandbox
          </div>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-slate-950 mb-6">
            Interactive <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600 font-normal">Security & Exploit</span> Audit
          </h2>
          <p className="text-slate-600 text-base sm:text-lg font-light leading-relaxed">
            Test any architecture against top-tier military defense standards. Our systems are built so even massive 10M+ coordinated threat vectors cannot breach zero-trust barriers.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-300 shadow-xl shadow-slate-900/5 mb-10 reveal-on-scroll">
          
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 font-mono text-sm">
                https://
              </div>
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="domain-or-contract-address.com"
                className="w-full pl-20 pr-4 py-3.5 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
              />
            </div>

            <button
              onClick={runLiveAudit}
              disabled={scanning}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-medium text-sm transition-all shadow-md disabled:opacity-50"
            >
              {scanning ? (
                <>
                  <RefreshCw className="w-4 h-4 text-sky-400 animate-spin" />
                  <span>Auditing Architecture...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 text-sky-400" />
                  <span>Execute Security Audit</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-mono text-slate-500">
            <span className="text-slate-400">Quick Test Targets:</span>
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setTargetUrl(p.url)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
              >
                {p.name}
              </button>
            ))}
          </div>

          {scanning && (
            <div className="mt-6 p-5 rounded-2xl bg-slate-950 text-white border border-slate-800 animate-fadeIn">
              <div className="flex items-center justify-between text-xs font-mono text-sky-300 mb-2">
                <span>{currentStepText}</span>
                <span>{scanProgress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-400 via-sky-500 to-lavender-500 transition-all duration-300 rounded-full"
                  style={{ width: scanProgress + "%" }}
                />
              </div>
            </div>
          )}

        </div>

        {auditResult && (
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-sky-200 shadow-xl shadow-sky-500/10 animate-fadeIn">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-9 h-9 text-emerald-600" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-mono mb-1">
                    {auditResult.grade}
                  </div>
                  <h3 className="text-xl font-light text-slate-950 font-mono">{auditResult.domain}</h3>
                </div>
              </div>

              <div className="text-right sm:border-l sm:border-slate-200 sm:pl-6">
                <div className="text-xs font-mono text-slate-500 uppercase">Defense Score</div>
                <div className="text-3xl font-light text-emerald-600 font-mono">{auditResult.score}/100</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 my-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
              <span className="text-slate-500">Audit Verification Fingerprint (SHA-256):</span>
              <span className="text-slate-800 font-medium truncate sm:max-w-md">{auditResult.sha256Hash}</span>
            </div>

            <div className="space-y-3 my-6">
              {auditResult.checks.map((chk, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-slate-900">{chk.name}</h4>
                      <p className="text-xs font-light text-slate-600 mt-0.5">{chk.desc}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-mono font-semibold">
                    {chk.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
              <a
                href={getWhatsAppAuditLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-all shadow-md"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span>Send Audit Dossier to WhatsApp ({CONTACT_INFO.phoneDisplay})</span>
              </a>

              <a
                href={CONTACT_INFO.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-sm transition-all border border-slate-300"
              >
                <Send className="w-4 h-4 text-sky-600" />
                <span>Telegram: {CONTACT_INFO.telegramUser}</span>
              </a>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
`;

// 7. PROJECT ESTIMATOR
files['src/components/ProjectEstimator.jsx'] = `import React, { useState } from 'react';
import { CONTACT_INFO } from '../data/agencyData';
import { Calculator, Shield, Cpu, Brain, Layers, Globe2, ArrowRight, MessageCircle, Send, Check, Sparkles, Clock, Users } from 'lucide-react';

export default function ProjectEstimator({ onProceedToBooking }) {
  const [selectedServices, setSelectedServices] = useState(['cyber-security', 'blockchain-web3']);
  const [squadScale, setSquadScale] = useState('dedicated');
  const [timelineSpeed, setTimelineSpeed] = useState('standard');

  const serviceOptions = [
    { id: 'cyber-security', name: 'Cyber Security & Exploit Audit', baseCost: 4500, icon: Shield },
    { id: 'blockchain-web3', name: 'Blockchain & Smart Contracts', baseCost: 5000, icon: Layers },
    { id: 'ai-cognitive', name: 'AI/ML Custom LLM & Agents', baseCost: 5500, icon: Brain },
    { id: 'fullstack-cloud', name: 'Full-Stack & Cloud Edge', baseCost: 4000, icon: Cpu },
    { id: 'digital-marketing-360', name: '360° Digital Marketing & SEO', baseCost: 3500, icon: Globe2 },
  ];

  const toggleService = (id) => {
    if (selectedServices.includes(id)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter((s) => s !== id));
      }
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  const calculateEstimate = () => {
    let base = selectedServices.reduce((sum, sId) => {
      const found = serviceOptions.find((o) => o.id === sId);
      return sum + (found ? found.baseCost : 0);
    }, 0);

    let scaleMultiplier = 1.0;
    let headcount = "2-3 Senior Engineers";
    if (squadScale === 'dedicated') {
      scaleMultiplier = 1.6;
      headcount = "4-5 Senior Specialists";
    } else if (squadScale === 'enterprise') {
      scaleMultiplier = 2.4;
      headcount = "7-9 Dedicated Engineers";
    }

    let speedMultiplier = 1.0;
    let weeks = "4 - 6 Weeks";
    if (timelineSpeed === 'fast') {
      speedMultiplier = 1.25;
      weeks = "2 - 3 Weeks (Fast-Track)";
    } else if (timelineSpeed === 'war-room') {
      speedMultiplier = 1.5;
      weeks = "7 - 14 Days (24/7 Red-Team War Room)";
    }

    const totalMin = Math.round((base * scaleMultiplier * speedMultiplier) * 0.9);
    const totalMax = Math.round((base * scaleMultiplier * speedMultiplier) * 1.15);

    return { totalMin, totalMax, headcount, weeks };
  };

  const { totalMin, totalMax, headcount, weeks } = calculateEstimate();

  const getWhatsAppEstimateLink = () => {
    const serviceNames = selectedServices.map(id => serviceOptions.find(o => o.id === id)?.name).join(', ');
    const text = encodeURIComponent("Hi Vikas, I created a project estimate on The Unfiltered Engineer platform:\\n- Services: " + serviceNames + "\\n- Squad Scale: " + squadScale + "\\n- Timeline: " + timelineSpeed + " (" + weeks + ")\\n- Estimated Budget: $" + totalMin.toLocaleString() + " - $" + totalMax.toLocaleString() + "\\nLet's schedule a call.");
    return "https://wa.me/919137507092?text=" + text;
  };

  return (
    <section id="estimator" className="relative py-24 bg-[#090D16] text-slate-100 overflow-hidden border-t border-b border-slate-800">
      
      <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-lavender-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16 reveal-on-scroll">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-950/70 border border-sky-500/30 text-sky-300 text-xs font-mono uppercase tracking-widest mb-4">
            <Calculator className="w-3.5 h-3.5 text-sky-400" />
            Transparent Scope & Pricing Engine
          </div>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-white mb-6">
            Interactive Project <span className="sky-lavender-gradient font-normal">Estimator</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg font-light leading-relaxed">
            Select your required practices, engineering squad headcount, and delivery speed to generate an instant upfront estimate.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-7 space-y-8 reveal-on-scroll">
            
            <div>
              <h3 className="text-xs font-mono uppercase text-sky-400 tracking-wider mb-3">1. Select Practices & Verticals</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {serviceOptions.map((opt) => {
                  const isSelected = selectedServices.includes(opt.id);
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => toggleService(opt.id)}
                      className={"p-4 rounded-2xl text-left border transition-all flex items-center justify-between " + (
                        isSelected
                          ? "bg-sky-950/70 border-sky-400 text-white shadow-lg shadow-sky-500/10"
                          : "bg-obsidian-950/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={"p-2 rounded-xl " + (isSelected ? "bg-sky-500 text-black" : "bg-obsidian-900 text-slate-400")}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">{opt.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono">From \${opt.baseCost.toLocaleString()}</div>
                        </div>
                      </div>
                      <div className={"w-5 h-5 rounded-full border flex items-center justify-center " + (
                        isSelected ? "bg-sky-400 border-sky-400 text-black" : "border-slate-700"
                      )}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-mono uppercase text-lavender-400 tracking-wider mb-3">2. Engineering Squad Scale</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'sprint', label: 'Sprint Team', sub: '2-3 Engineers' },
                  { id: 'dedicated', label: 'Dedicated Squad', sub: '4-5 Specialists' },
                  { id: 'enterprise', label: 'Enterprise Multi-Squad', sub: '7-9 Core Devs' },
                ].map((scale) => (
                  <button
                    key={scale.id}
                    onClick={() => setSquadScale(scale.id)}
                    className={"p-3.5 rounded-2xl text-center border transition-all " + (
                      squadScale === scale.id
                        ? "bg-lavender-950/70 border-lavender-400 text-white shadow-lg shadow-lavender-500/10"
                        : "bg-obsidian-950/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                    )}
                  >
                    <div className="text-xs sm:text-sm font-medium">{scale.label}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">{scale.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-mono uppercase text-emerald-400 tracking-wider mb-3">3. Delivery Speed & SLA</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'standard', label: 'Standard Delivery', time: '4 - 6 Weeks' },
                  { id: 'fast', label: 'Fast-Track', time: '2 - 3 Weeks' },
                  { id: 'war-room', label: '24/7 War Room', time: '7 - 14 Days' },
                ].map((speed) => (
                  <button
                    key={speed.id}
                    onClick={() => setTimelineSpeed(speed.id)}
                    className={"p-3.5 rounded-2xl text-center border transition-all " + (
                      timelineSpeed === speed.id
                        ? "bg-emerald-950/70 border-emerald-400 text-white shadow-lg shadow-emerald-500/10"
                        : "bg-obsidian-950/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                    )}
                  >
                    <div className="text-xs sm:text-sm font-medium">{speed.label}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">{speed.time}</div>
                  </button>
                ))}
              </div>
            </div>

          </div>

          <div className="lg:col-span-5 reveal-on-scroll">
            <div className="glass-card-dark p-6 sm:p-8 rounded-3xl border border-sky-500/30 glow-border-sky relative">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-mono text-sky-400 uppercase tracking-wider">Estimated Investment</span>
                <span className="px-2.5 py-0.5 rounded-full bg-sky-950 border border-sky-500/30 text-sky-300 text-xs font-mono">
                  Guaranteed SLA
                </span>
              </div>

              <div className="my-6">
                <div className="text-xs text-slate-400 font-light">Estimated Project Range:</div>
                <div className="text-3xl sm:text-4xl font-light text-white font-mono mt-1">
                  \${totalMin.toLocaleString()} – \${totalMax.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500 font-mono mt-1">
                  No hidden fees • Transparent milestone billing
                </div>
              </div>

              <div className="space-y-3 p-4 rounded-2xl bg-obsidian-950 border border-slate-800 my-6">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5 font-light">
                    <Users className="w-3.5 h-3.5 text-sky-400" />
                    Dedicated Staffing:
                  </span>
                  <span className="text-white font-mono">{headcount}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5 font-light">
                    <Clock className="w-3.5 h-3.5 text-lavender-400" />
                    Estimated Timeline:
                  </span>
                  <span className="text-white font-mono">{weeks}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5 font-light">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                    Security Guarantee:
                  </span>
                  <span className="text-emerald-400 font-mono">100% Zero-Breach SLA</span>
                </div>
              </div>

              <div className="space-y-3">
                <a
                  href={getWhatsAppEstimateLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-sky-400 to-lavender-500 hover:opacity-95 text-black font-semibold text-sm transition-all shadow-lg shadow-sky-500/20"
                >
                  <MessageCircle className="w-5 h-5 text-black" />
                  <span>Send Estimate to WhatsApp ({CONTACT_INFO.phoneDisplay})</span>
                </a>

                <div className="flex gap-2">
                  <a
                    href={CONTACT_INFO.telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-obsidian-900 hover:bg-obsidian-800 border border-slate-700 text-slate-200 text-xs font-medium transition-all"
                  >
                    <Send className="w-3.5 h-3.5 text-sky-400" />
                    <span>Telegram: {CONTACT_INFO.telegramUser}</span>
                  </a>

                  <button
                    onClick={() => {
                      const services = selectedServices.map(id => serviceOptions.find(o => o.id === id)?.name);
                      onProceedToBooking({ services, estimatedCost: "$" + totalMin.toLocaleString() + " - $" + totalMax.toLocaleString(), timeline: weeks });
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-sky-950/80 hover:bg-sky-900 border border-sky-500/30 text-sky-300 text-xs font-medium transition-all"
                  >
                    <span>Proceed to Wizard</span>
                    <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
`;

// 8. CASE STUDIES
files['src/components/CaseStudies.jsx'] = `import React from 'react';
import { CASE_STUDIES, CONTACT_INFO } from '../data/agencyData';
import { ExternalLink, CheckCircle, ArrowRight, MessageCircle, Send, Award, Sparkles } from 'lucide-react';

export default function CaseStudies() {
  return (
    <section id="work" className="relative py-28 bg-white text-slate-900 overflow-hidden border-t border-b border-slate-200">
      
      <div className="absolute inset-0 bg-light-grid opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-20 reveal-on-scroll">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-mono uppercase tracking-widest mb-4 shadow-sm">
            <Award className="w-3.5 h-3.5 text-sky-600" />
            Verifiable Track Record
          </div>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-slate-950 mb-6">
            Production <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600 font-normal">Case Studies</span> & Proof of Work
          </h2>
          <p className="text-slate-600 text-base sm:text-lg font-light leading-relaxed">
            Real enterprise deployments across high-frequency finance, autonomous medical AI, and multi-million dollar performance marketing engines.
          </p>
        </div>

        <div className="space-y-12">
          {CASE_STUDIES.map((study, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div
                key={study.id}
                className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 reveal-on-scroll"
              >
                <div className={"grid grid-cols-1 lg:grid-cols-12 gap-8 items-center " + (isEven ? "" : "lg:flex-row-reverse")}>
                  
                  <div className={"lg:col-span-5 " + (isEven ? "lg:order-1" : "lg:order-2")}>
                    <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden bg-slate-900 shadow-lg">
                      <img
                        src={study.image}
                        alt={study.title}
                        className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700 text-sky-300 text-xs font-mono backdrop-blur-md">
                          {study.tag}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={"lg:col-span-7 " + (isEven ? "lg:order-2" : "lg:order-1") + " space-y-5"}>
                    
                    <div>
                      <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">{study.client}</span>
                      <h3 className="text-2xl sm:text-3xl font-light text-slate-950 mt-1">{study.title}</h3>
                    </div>

                    <p className="text-slate-600 text-sm sm:text-base font-light leading-relaxed">
                      {study.summary}
                    </p>

                    <div className="grid grid-cols-3 gap-3 py-4 border-t border-b border-slate-200">
                      {study.results.map((res, rIdx) => (
                        <div key={rIdx}>
                          <div className="text-lg sm:text-xl font-light text-slate-900 font-mono">{res.value}</div>
                          <div className="text-[11px] text-slate-500 font-light mt-0.5">{res.label}</div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {study.tech.map((t, tIdx) => (
                        <span key={tIdx} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-mono shadow-xs">
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <a
                        href={"https://wa.me/919137507092?text=Hi%20Vikas,%20I%20reviewed%20the%20" + encodeURIComponent(study.title) + "%20case%20study%20and%20want%20to%20build%20a%20similar%20system."}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-all shadow-sm group"
                      >
                        <MessageCircle className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                        <span>Discuss Similar Project on WhatsApp</span>
                      </a>
                    </div>

                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
`;

// 9. PRICING TIERS
files['src/components/PricingTiers.jsx'] = `import React from 'react';
import { PRICING_TIERS, CONTACT_INFO } from '../data/agencyData';
import { Check, MessageCircle, Send, Zap, ArrowRight, ShieldCheck } from 'lucide-react';

export default function PricingTiers({ onSelectTier }) {
  const getWhatsAppForTier = (tier) => {
    const text = encodeURIComponent("Hi Vikas, I would like to book The Unfiltered Engineer's \\"" + tier.name + "\\" engagement (" + tier.price + tier.period + ") for my company.");
    return "https://wa.me/919137507092?text=" + text;
  };

  return (
    <section id="pricing" className="relative py-28 bg-[#030712] text-slate-100 overflow-hidden">
      
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-lavender-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-20 reveal-on-scroll">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-950/70 border border-sky-500/30 text-sky-300 text-xs font-mono uppercase tracking-widest mb-4">
            <Zap className="w-3.5 h-3.5 text-sky-400" />
            Transparent Engagements
          </div>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-white mb-6">
            Predictable Investment. <span className="sky-lavender-gradient font-normal">Zero Guesswork</span>.
          </h2>
          <p className="text-slate-400 text-base sm:text-lg font-light leading-relaxed">
            No bloated agency overhead. Dedicated senior engineering squads and growth media buyers working directly with your team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {PRICING_TIERS.map((tier) => {
            return (
              <div
                key={tier.id}
                className={"rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative " + (
                  tier.popular
                    ? "glass-card-sky border-sky-400/50 glow-border-sky shadow-2xl md:-translate-y-3"
                    : "glass-card-dark border-slate-800 hover:border-slate-700"
                ) + " reveal-on-scroll"}
              >
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full bg-gradient-to-r from-sky-400 to-lavender-400 text-black text-xs font-semibold uppercase tracking-wider shadow-md">
                      Most Popular For Enterprise
                    </span>
                  </div>
                )}

                <div>
                  <div className="mb-6">
                    <h3 className="text-xl font-normal text-white">{tier.name}</h3>
                    <p className="text-xs text-slate-400 font-light mt-1.5 min-h-[34px] leading-relaxed">
                      {tier.tagline}
                    </p>
                  </div>

                  <div className="py-4 border-t border-b border-slate-800/80 mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-light text-white font-mono">{tier.price}</span>
                      <span className="text-xs text-slate-400 font-light">{tier.period}</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    {tier.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-300 font-light">
                        <Check className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2.5 pt-2">
                  <a
                    href={getWhatsAppForTier(tier)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={"w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-semibold transition-all " + (
                      tier.popular
                        ? "bg-gradient-to-r from-sky-400 to-lavender-400 hover:opacity-95 text-black shadow-lg shadow-sky-500/20"
                        : "bg-obsidian-900 hover:bg-obsidian-800 text-white border border-slate-700"
                    )}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Book on WhatsApp ({CONTACT_INFO.phoneDisplay})</span>
                  </a>

                  <a
                    href={CONTACT_INFO.telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-obsidian-950/80 hover:bg-obsidian-900 border border-slate-800 text-slate-300 text-xs font-light transition-all"
                  >
                    <Send className="w-3.5 h-3.5 text-sky-400" />
                    <span>Inquire via Telegram</span>
                  </a>
                </div>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}
`;

// 10. CONTACT WIZARD
files['src/components/ContactWizard.jsx'] = `import React, { useState, useEffect } from 'react';
import { CONTACT_INFO, SERVICE_PILLARS } from '../data/agencyData';
import { saveInquiry } from '../services/storageService';
import { Send, MessageCircle, CheckCircle2, ShieldCheck, Lock, Sparkles, User, Mail, Building, FileText, ArrowRight } from 'lucide-react';

export default function ContactWizard({ prefillData }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    selectedService: SERVICE_PILLARS[0].title,
    budget: '$10,000 - $25,000',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  useEffect(() => {
    if (prefillData) {
      setFormData((prev) => ({
        ...prev,
        selectedService: prefillData.services ? prefillData.services[0] : prev.selectedService,
        message: prefillData.details || prefillData.techStackNotes || prev.message,
        budget: prefillData.estimatedCost || prev.budget,
      }));
    }
  }, [prefillData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    const saved = saveInquiry(formData);
    setSubmittedData(saved);
    setSubmitted(true);
  };

  const getWhatsAppForwardLink = () => {
    const text = encodeURIComponent("Hi Vikas, I submitted an inquiry on The Unfiltered Engineer platform:\\n- Name: " + formData.name + "\\n- Company: " + (formData.company || 'N/A') + "\\n- Service: " + formData.selectedService + "\\n- Budget: " + formData.budget + "\\n- Message: " + (formData.message || 'Ready to discuss scope.'));
    return "https://wa.me/919137507092?text=" + text;
  };

  return (
    <section id="contact" className="relative py-28 bg-[#030712] text-slate-100 overflow-hidden border-t border-slate-800">
      
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-lavender-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16 reveal-on-scroll">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-950/70 border border-sky-500/30 text-sky-300 text-xs font-mono uppercase tracking-widest mb-4">
            <Lock className="w-3.5 h-3.5 text-sky-400" />
            Encrypted Lead Gateway
          </div>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-white mb-6">
            Initiate Direct <span className="sky-lavender-gradient font-normal">Engagement</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg font-light leading-relaxed">
            Connect directly with Vikas Mishra & the specialized engineering leads. Fast turnarounds, strict non-disclosure, and zero vendor bureaucracy.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto items-start">
          
          <div className="lg:col-span-5 space-y-6 reveal-on-scroll">
            
            <div className="glass-card-dark p-6 rounded-3xl border border-sky-500/20 glow-border-sky">
              <h3 className="text-lg font-normal text-white mb-4">Direct Contact Channels</h3>
              
              <div className="space-y-4">
                <a
                  href={CONTACT_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-slate-200 transition-all group"
                >
                  <div className="p-3 rounded-xl bg-emerald-500 text-black group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-light">WhatsApp Direct</div>
                    <div className="text-sm font-semibold text-emerald-400 font-mono">{CONTACT_INFO.phoneDisplay}</div>
                  </div>
                </a>

                <a
                  href={CONTACT_INFO.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 hover:bg-sky-500/20 text-slate-200 transition-all group"
                >
                  <div className="p-3 rounded-xl bg-sky-500 text-black group-hover:scale-110 transition-transform">
                    <Send className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-light">Telegram Channel</div>
                    <div className="text-sm font-semibold text-sky-400 font-mono">{CONTACT_INFO.telegramUser}</div>
                  </div>
                </a>

                <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-obsidian-950 border border-slate-800 text-slate-200">
                  <div className="p-3 rounded-xl bg-lavender-900/50 text-lavender-300">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-light">Direct Email</div>
                    <div className="text-xs font-mono text-slate-300">{CONTACT_INFO.email}</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2 text-xs font-mono text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>NDA & SHA-256 Encrypted Gateway</span>
              </div>

            </div>

          </div>

          <div className="lg:col-span-7 reveal-on-scroll">
            <div className="glass-card-dark p-6 sm:p-8 rounded-3xl border border-slate-800">
              
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 uppercase mb-1.5">Your Name *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Alexander Wright"
                        className="w-full px-4 py-3 rounded-xl bg-obsidian-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-sky-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 uppercase mb-1.5">Work Email *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="a.wright@enterprise.com"
                        className="w-full px-4 py-3 rounded-xl bg-obsidian-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-sky-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 uppercase mb-1.5">Phone / WhatsApp</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-4 py-3 rounded-xl bg-obsidian-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-sky-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 uppercase mb-1.5">Company / Protocol</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Enterprise Co."
                        className="w-full px-4 py-3 rounded-xl bg-obsidian-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-sky-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 uppercase mb-1.5">Primary Practice</label>
                      <select
                        name="selectedService"
                        value={formData.selectedService}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-obsidian-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-sky-400"
                      >
                        {SERVICE_PILLARS.map((s) => (
                          <option key={s.id} value={s.title}>{s.title}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 uppercase mb-1.5">Anticipated Budget</label>
                      <select
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-obsidian-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-sky-400"
                      >
                        <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                        <option value="$10,000 - $25,000">$10,000 - $25,000</option>
                        <option value="$25,000 - $50,000">$25,000 - $50,000</option>
                        <option value="$50,000+">$50,000+ (Enterprise)</option>
                        <option value="Growth Retainer">Monthly Growth Retainer</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 uppercase mb-1.5">Project Scope / Technical Requirements</label>
                    <textarea
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Describe your architecture requirements, timeline constraints, or specific security/growth goals..."
                      className="w-full px-4 py-3 rounded-xl bg-obsidian-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-sky-400 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-sky-400 via-sky-500 to-lavender-500 hover:opacity-95 text-black font-semibold text-sm transition-all shadow-lg shadow-sky-500/20"
                  >
                    <Lock className="w-4 h-4 text-black" />
                    <span>Submit Encrypted Inquiry</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </button>

                </form>
              ) : (
                <div className="text-center py-8 space-y-6 animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-light text-white">Inquiry Securely Logged</h3>
                    <p className="text-xs font-mono text-sky-400 mt-1">Ticket Reference: {submittedData && submittedData.id}</p>
                    <p className="text-slate-400 text-xs font-light mt-2 max-w-md mx-auto">
                      Your technical request has been encrypted with HMAC-SHA256 and queued directly for Vikas Mishra & the engineering leads.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-obsidian-950 border border-slate-800 max-w-md mx-auto">
                    <div className="text-xs text-slate-300 font-light mb-3">Want an instant response in &lt; 15 minutes?</div>
                    <a
                      href={getWhatsAppForwardLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition-all"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Dispatch Directly to WhatsApp (+919137507092)</span>
                    </a>
                  </div>

                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-mono text-slate-500 hover:text-slate-300 underline"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
`;

// 11. FOOTER
files['src/components/Footer.jsx'] = `import React from 'react';
import { CONTACT_INFO, SERVICE_PILLARS, GLOBAL_HUBS } from '../data/agencyData';
import { Shield, MessageCircle, Send, Mail, Terminal, ArrowUp, Lock } from 'lucide-react';

export default function Footer({ onOpenTerminal, onOpenAdmin }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#02050B] text-slate-400 font-sans border-t border-slate-800/80 pt-20 pb-12 overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-16 border-b border-slate-800/80">
          
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-sky-400 to-lavender-500 p-0.5 shadow-lg shadow-sky-500/20">
                <div className="w-full h-full bg-obsidian-950 rounded-[14px] flex items-center justify-center">
                  <span className="text-sky-400 font-mono font-bold text-xs">UE</span>
                </div>
              </div>
              <span className="text-base font-normal tracking-tight text-white">
                The Unfiltered Engineer
              </span>
            </div>

            <p className="text-xs text-slate-400 font-light leading-relaxed max-w-sm">
              Global engineering and 360° growth agency delivering zero-breach Cyber Security, high-throughput Blockchain protocols, production AI/ML swarms, and high-ROAS marketing worldwide.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <a
                href={CONTACT_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 text-xs font-mono"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp: {CONTACT_INFO.phoneDisplay}</span>
              </a>

              <a
                href={CONTACT_INFO.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 hover:bg-sky-500/25 text-xs font-mono"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegram: {CONTACT_INFO.telegramUser}</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase text-sky-400 tracking-wider">Practice Areas</h4>
            <ul className="space-y-2 text-xs font-light text-slate-300">
              {SERVICE_PILLARS.map((s) => (
                <li key={s.id}>
                  <a href="#services" className="hover:text-sky-400 transition-colors">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase text-lavender-400 tracking-wider">Growth & Tools</h4>
            <ul className="space-y-2 text-xs font-light text-slate-300">
              <li><a href="#marketing" className="hover:text-lavender-400 transition-colors">Meta Ads CAPI & Scale</a></li>
              <li><a href="#marketing" className="hover:text-lavender-400 transition-colors">Google Ads & PMax Bidding</a></li>
              <li><a href="#marketing" className="hover:text-lavender-400 transition-colors">Technical & Programmatic SEO</a></li>
              <li><a href="#scanner" className="hover:text-lavender-400 transition-colors">Live Security & Exploit Scanner</a></li>
              <li><a href="#estimator" className="hover:text-lavender-400 transition-colors">Interactive Scope Estimator</a></li>
              <li><button onClick={onOpenTerminal} className="hover:text-lavender-400 transition-colors">Interactive CLI Terminal</button></li>
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider">Global PoPs</h4>
            <div className="flex flex-wrap gap-1 text-[11px] font-mono text-slate-500">
              {GLOBAL_HUBS.map((h) => (
                <span key={h.id} className="px-2 py-0.5 rounded bg-obsidian-950 border border-slate-800/80">
                  {h.name.split(',')[0]}
                </span>
              ))}
            </div>

            <div className="pt-4">
              <button
                onClick={onOpenAdmin}
                className="text-xs font-mono text-slate-500 hover:text-sky-400 underline"
              >
                Executive Admin Portal
              </button>
            </div>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>© 2026 The Unfiltered Engineer. All rights reserved. 100% Independent & Self-Contained.</span>
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}
`;

// 12. FLOATING DOCK
files['src/components/FloatingDock.jsx'] = `import React, { useState } from 'react';
import { CONTACT_INFO } from '../data/agencyData';
import { MessageCircle, Send, Terminal, Calculator, Shield, ChevronUp, Sparkles, X } from 'lucide-react';

export default function FloatingDock({ onOpenTerminal, onOpenEstimator, onOpenScanner }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5 font-sans">
      
      {expanded && (
        <div className="flex flex-col items-end gap-2 mb-1 animate-fadeIn">
          
          <a
            href={CONTACT_INFO.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-obsidian-900/95 border border-sky-500/40 text-sky-300 text-xs font-medium shadow-xl hover:scale-105 transition-all backdrop-blur-md"
          >
            <span>Telegram: {CONTACT_INFO.telegramUser}</span>
            <Send className="w-4 h-4 text-sky-400" />
          </a>

          <button
            onClick={() => {
              onOpenEstimator();
              setExpanded(false);
            }}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-obsidian-900/95 border border-lavender-500/40 text-lavender-300 text-xs font-medium shadow-xl hover:scale-105 transition-all backdrop-blur-md"
          >
            <span>Scope Estimator</span>
            <Calculator className="w-4 h-4 text-lavender-400" />
          </button>

          <button
            onClick={() => {
              onOpenScanner();
              setExpanded(false);
            }}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-obsidian-900/95 border border-sky-500/40 text-sky-300 text-xs font-medium shadow-xl hover:scale-105 transition-all backdrop-blur-md"
          >
            <span>Security Scanner</span>
            <Shield className="w-4 h-4 text-sky-400" />
          </button>

          <button
            onClick={() => {
              onOpenTerminal();
              setExpanded(false);
            }}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-obsidian-900/95 border border-slate-700 text-slate-300 text-xs font-mono shadow-xl hover:scale-105 transition-all backdrop-blur-md"
          >
            <span>Engineer CLI [ \` ]</span>
            <Terminal className="w-4 h-4 text-slate-300" />
          </button>

        </div>
      )}

      <div className="flex items-center gap-2 p-1.5 rounded-full bg-obsidian-950/90 border border-sky-500/30 shadow-2xl backdrop-blur-xl glow-border-sky">
        
        <a
          href={CONTACT_INFO.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all shadow-md group"
          title="Direct WhatsApp"
        >
          <MessageCircle className="w-4 h-4 text-black group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">WhatsApp ({CONTACT_INFO.phoneDisplay})</span>
          <span className="sm:hidden">WhatsApp</span>
        </a>

        <button
          onClick={() => setExpanded(!expanded)}
          className={"p-2.5 rounded-full transition-all " + (
            expanded ? "bg-sky-500 text-black" : "bg-obsidian-900 text-sky-400 hover:bg-obsidian-800"
          )}
          title="Quick Actions"
        >
          {expanded ? <X className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>

      </div>

    </div>
  );
}
`;

// 13. INTERACTIVE TERMINAL
files['src/components/InteractiveTerminal.jsx'] = `import React, { useState, useEffect, useRef } from 'react';
import { CONTACT_INFO, SERVICE_PILLARS, GLOBAL_HUBS } from '../data/agencyData';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, ArrowRight, CornerDownLeft } from 'lucide-react';

export default function InteractiveTerminal({ isOpen, onClose, onNavigateTo }) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', text: 'THE UNFILTERED ENGINEER — MILITARY-GRADE INTERACTIVE CLI v4.9' },
    { type: 'system', text: 'All sessions are end-to-end verified via HMAC-SHA256 zero-trust tokens.' },
    { type: 'system', text: 'Type "help" to view available engineer commands, or "whatsapp" / "telegram" to contact immediately.' }
  ]);
  const inputRef = useRef(null);
  const scrollBottomRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current && inputRef.current.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollBottomRef.current) {
      scrollBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  const handleCommand = (e) => {
    if (e.key !== 'Enter') return;
    const cmd = input.trim();
    if (!cmd) return;

    const newHistory = [...history, { type: 'user', text: "$ " + cmd }];
    const parts = cmd.toLowerCase().split(' ');
    const mainCmd = parts[0];

    switch (mainCmd) {
      case 'help':
        newHistory.push({
          type: 'output',
          text: "AVAILABLE COMMANDS:\\n  help              Display this command index\\n  services          List all 5 core engineering & marketing pillars\\n  squads            Inspect specialized engineering team rosters\\n  globe             Display worldwide connected delivery hubs & latencies\\n  security          Show unhackable zero-trust military defense specs\\n  audit <domain>    Run instant security & exploit assessment\\n  whatsapp          Launch WhatsApp direct channel (+919137507092)\\n  telegram          Launch Telegram direct channel (@Yourstrulyvikasmishra)\\n  pricing           View transparent retainer and sprint tiers\\n  clear             Clear terminal screen\\n  exit              Close interactive CLI session"
        });
        break;

      case 'services':
        newHistory.push({
          type: 'output',
          text: "PRACTICE VERTICALS:\\n  1. Cyber Security & Military Defense (0 breaches, red-team penetration, smart contract formal audits)\\n  2. Blockchain & Web3 Ecosystems ($1.2B+ TVL, EVM/Solana, ZK rollups)\\n  3. AI / ML & Cognitive Systems (Custom enterprise LLMs, multi-agent swarms, RAG)\\n  4. Full-Stack & Cloud Edge Systems (Go/Rust/Node microservices, 99.999% SLA)\\n  5. 360° Digital & Omni-Channel Marketing (Meta CAPI, Google PMax, Technical SEO, Offline Billboards)"
        });
        break;

      case 'squads':
        newHistory.push({
          type: 'output',
          text: "SPECIALIZED SQUADS ROSTER:\\n  • Red/Blue Defense Squad: 7 Principal Security Engineers\\n  • Core Protocol Squad: 6 Senior Protocol & ZK Devs\\n  • Neural Architectures Squad: 8 AI Scientists & MLOps SREs\\n  • Distributed Systems Core: 9 Senior Full-Stack Engineers\\n  • Growth & Media Squad: 6 Senior Media Buyers & SEO Leads"
        });
        break;

      case 'globe':
        newHistory.push({
          type: 'output',
          text: "GLOBAL DELIVERY HUBS (40+ Countries Served):\\n  • Mumbai NOC: Primary Engineering HQ (8ms)\\n  • San Francisco: AI Research & Vector Infra (14ms)\\n  • New York: Hedge Fund Cyber Defense (18ms)\\n  • London: Fintech & Smart Contract Audits (22ms)\\n  • Zurich: ZK Cryptography & Privacy (26ms)\\n  • Dubai: Web3 & Growth Hub (31ms)\\n  • Singapore: Exchange High-Frequency Infra (19ms)\\n  • Tokyo: Autonomous Robotics (27ms)\\n  • Sydney: Distributed Edge (38ms)"
        });
        break;

      case 'security':
        newHistory.push({
          type: 'output',
          text: "MILITARY-GRADE DEFENSE ARCHITECTURE:\\n  [✓] 100% Independent Self-Contained Stack (Zero 3rd-party vendor lock-in)\\n  [✓] HMAC-SHA256 Cryptographic Payload Signing on all API routes\\n  [✓] Token Bucket Rate Limiting & Anti-DDoS Layer-7 Protection\\n  [✓] Strict Zero-Trust Content Security Policy (CSP) & DOMPurify Anti-XSS\\n  [✓] Formal Smart Contract Bytecode Decompilation & Verification"
        });
        break;

      case 'audit':
        const target = parts[1] || 'target-system.io';
        newHistory.push({
          type: 'output',
          text: "Executing penetration audit on [" + target + "]...\\n  Testing TLS 1.3 / HSTS ........................ [OK]\\n  Bytecode Decompilation & Reentrancy Analysis .. [OK]\\n  Layer-7 DDoS Resistance Benchmarking .......... [PASS - < 3ms overhead]\\n  Zero-Day CVE Surface .......................... [CLEAN - 0 Vulnerabilities]\\n  OVERALL DEFENSE SCORE: 98/100 (Grade: A+)"
        });
        break;

      case 'whatsapp':
        window.open(CONTACT_INFO.whatsappUrl, '_blank');
        newHistory.push({
          type: 'output',
          text: "Opening WhatsApp chat with Vikas Mishra (" + CONTACT_INFO.phoneDisplay + ")..."
        });
        break;

      case 'telegram':
        window.open(CONTACT_INFO.telegramUrl, '_blank');
        newHistory.push({
          type: 'output',
          text: "Opening Telegram channel with " + CONTACT_INFO.telegramUser + "..."
        });
        break;

      case 'pricing':
        newHistory.push({
          type: 'output',
          text: "TRANSPARENT ENGAGEMENT TIERS:\\n  • Engineering Sprint: $4,800 / 2-week sprint (2-Senior Squad)\\n  • Dedicated Squad: $11,500 / month (4-5 Specialists, 99.999% SLA)\\n  • 360° Growth Retainer: $7,200 / month (Meta, Google, SEO, Offline)"
        });
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      case 'exit':
        onClose();
        setInput('');
        return;

      default:
        newHistory.push({
          type: 'error',
          text: "Command not recognized: \\"" + cmd + "\\". Type \\"help\\" to view list of commands."
        });
        break;
    }

    setHistory(newHistory);
    setInput('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl h-[520px] bg-obsidian-950 border border-sky-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden font-mono text-xs glow-border-sky">
        
        <div className="px-4 py-3 bg-obsidian-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 cursor-pointer" onClick={onClose} />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="ml-3 text-slate-400 font-sans text-xs">unfiltered-engineer-cli (bash)</span>
          </div>
          
          <div className="flex items-center gap-3 text-slate-400">
            <span className="text-[10px] text-sky-400 font-mono">TLS 1.3 SECURE</span>
            <button onClick={onClose} className="p-1 rounded hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-2 text-slate-300">
          {history.map((item, idx) => (
            <div key={idx} className="whitespace-pre-wrap leading-relaxed">
              {item.type === 'system' && (
                <span className="text-slate-400">{item.text}</span>
              )}
              {item.type === 'user' && (
                <span className="text-sky-300 font-semibold">{item.text}</span>
              )}
              {item.type === 'output' && (
                <span className="text-emerald-300">{item.text}</span>
              )}
              {item.type === 'error' && (
                <span className="text-red-400">{item.text}</span>
              )}
            </div>
          ))}
          <div ref={scrollBottomRef} />
        </div>

        <div className="p-3 bg-obsidian-900/90 border-t border-slate-800 flex items-center gap-2">
          <span className="text-sky-400 font-bold">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleCommand}
            placeholder="Type 'help', 'services', 'squads', 'whatsapp', 'telegram'..."
            className="flex-1 bg-transparent text-white font-mono text-xs focus:outline-none placeholder:text-slate-600"
          />
          <button
            onClick={() => handleCommand({ key: 'Enter' })}
            className="px-3 py-1 bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded text-[11px] hover:bg-sky-500/30"
          >
            Enter ↵
          </button>
        </div>

      </div>
    </div>
  );
}
`;

// 14. ADMIN DASHBOARD
files['src/components/AdminDashboard.jsx'] = `import React, { useState, useEffect } from 'react';
import { getInquiries, getSecurityLogs, verifyAdminCredentials, isAdminAuthenticated, adminLogout } from '../services/storageService';
import { Shield, Lock, Users, Activity, LogOut, X, RefreshCw, MessageCircle, Mail, Clock, CheckCircle2, Download } from 'lucide-react';

export default function AdminDashboard({ isOpen, onClose }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  
  const [activeTab, setActiveTab] = useState('inquiries');
  const [inquiries, setInquiries] = useState([]);
  const [securityLogs, setSecurityLogs] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const auth = isAdminAuthenticated();
      setIsAuthenticated(auth);
      if (auth) {
        loadData();
      }
    }
  }, [isOpen]);

  const loadData = () => {
    setInquiries(getInquiries());
    setSecurityLogs(getSecurityLogs());
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (verifyAdminCredentials(username, password)) {
      setIsAuthenticated(true);
      setAuthError('');
      loadData();
    } else {
      setAuthError('Invalid credentials. Use: admin / unfiltered2026');
    }
  };

  const handleLogout = () => {
    adminLogout();
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn font-sans">
      <div className="relative w-full max-w-5xl h-[620px] bg-obsidian-950 border border-sky-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        <div className="px-6 py-4 bg-obsidian-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-950 border border-sky-500/30 text-sky-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-normal text-white">Agency Executive & Security Portal</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">
                  AUTHENTICATED
                </span>
              </div>
              <p className="text-xs text-slate-400 font-light">Lead Management • Real-Time Security Telemetry</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-obsidian-950 border border-slate-700 text-xs text-slate-300 hover:text-white"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}
            <button onClick={onClose} className="p-2 rounded-xl bg-obsidian-950 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-sm p-8 rounded-3xl glass-card-dark border border-sky-500/20 text-center">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6" />
              </div>
              
              <h4 className="text-xl font-light text-white mb-1">Executive Authentication</h4>
              <p className="text-xs text-slate-400 font-light mb-6">Enter administrative credentials to access lead pipeline.</p>

              {authError && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs mb-4">
                  {authError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-3.5 text-left">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Admin Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin / vikas"
                    className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-sky-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Admin Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="unfiltered2026"
                    className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-sky-400 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-400 to-lavender-500 text-black font-semibold text-xs uppercase tracking-wider hover:opacity-90 transition-all mt-2"
                >
                  Verify Credentials
                </button>
              </form>

              <p className="text-[11px] text-slate-500 font-mono mt-4">Demo: admin / unfiltered2026</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            
            <div className="px-6 py-3 bg-obsidian-900/60 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('inquiries')}
                  className={"inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-mono transition-all " + (
                    activeTab === 'inquiries'
                      ? "bg-sky-500 text-black font-semibold"
                      : "bg-obsidian-950 text-slate-400 hover:text-white border border-slate-800"
                  )}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Incoming Inquiries ({inquiries.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('logs')}
                  className={"inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-mono transition-all " + (
                    activeTab === 'logs'
                      ? "bg-sky-500 text-black font-semibold"
                      : "bg-obsidian-950 text-slate-400 hover:text-white border border-slate-800"
                  )}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Security Telemetry Logs ({securityLogs.length})</span>
                </button>
              </div>

              <button
                onClick={loadData}
                className="p-1.5 rounded-lg bg-obsidian-950 text-slate-400 hover:text-white border border-slate-800"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {activeTab === 'inquiries' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {inquiries.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 font-mono text-xs">
                    No lead inquiries logged yet.
                  </div>
                ) : (
                  inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="p-5 rounded-2xl bg-obsidian-900 border border-slate-800 hover:border-sky-500/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-sky-950 border border-sky-500/30 text-sky-400 text-[10px] font-mono">
                            {inq.id}
                          </span>
                          <span className="text-sm font-medium text-white">{inq.name}</span>
                          {inq.company && (
                            <span className="text-xs text-slate-400 font-light">• {inq.company}</span>
                          )}
                        </div>

                        <div className="text-xs text-slate-300 font-light">
                          <strong className="text-lavender-300 font-normal">Practice:</strong> {inq.service || inq.selectedService} |{' '}
                          <strong className="text-emerald-400 font-normal">Budget:</strong> {inq.budget}
                        </div>

                        {inq.message && (
                          <p className="text-xs text-slate-400 italic bg-obsidian-950 p-2.5 rounded-xl border border-slate-800/80 max-w-2xl">
                            "{inq.message}"
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {inq.phone && (
                          <a
                            href={"https://wa.me/" + inq.phone.replace(/[^0-9]/g, '') + "?text=Hi%20" + encodeURIComponent(inq.name) + ",%20this%20is%20Vikas%20Mishra%20from%20The%20Unfiltered%20Engineer."}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 text-xs font-mono"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp Lead</span>
                          </a>
                        )}

                        <a
                          href={"mailto:" + inq.email + "?subject=The%20Unfiltered%20Engineer%20-%20Technical%20Proposal"}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-300 hover:bg-sky-500/25 text-xs font-mono"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Email</span>
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'logs' && (
              <div className="flex-1 overflow-y-auto p-6">
                <div className="rounded-2xl bg-obsidian-900 border border-slate-800 overflow-hidden font-mono text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-obsidian-950 text-slate-400 border-b border-slate-800 text-[11px] uppercase">
                      <tr>
                        <th className="p-3.5">Log ID</th>
                        <th className="p-3.5">Event Description</th>
                        <th className="p-3.5">Source IP</th>
                        <th className="p-3.5">Protocol</th>
                        <th className="p-3.5 text-right">Defense Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {securityLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-obsidian-950/60">
                          <td className="p-3.5 text-sky-400">{log.id}</td>
                          <td className="p-3.5 text-white">{log.event}</td>
                          <td className="p-3.5 text-slate-400">{log.sourceIp}</td>
                          <td className="p-3.5 text-lavender-300">{log.proto}</td>
                          <td className="p-3.5 text-right">
                            <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-[10px]">
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
`;

// Write out all files
for (const [filePath, content] of Object.entries(files)) {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully wrote: ' + filePath);
}
console.log('All components updated cleanly.');

