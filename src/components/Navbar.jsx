import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CONTACT_INFO } from '../data/agencyData';
import BrandLogo from './BrandLogo';
import { Terminal, Shield, MessageCircle, Send, Menu, X, Globe, Sparkles, UserCheck, Code2, Bot } from 'lucide-react';

export default function Navbar({ onOpenTerminal, onOpenAdmin, onOpenAIChat }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', to: '/' },
    { name: 'Services', to: '/services' },
    { name: '360° Marketing', to: '/marketing' },
    { name: 'Free SEO Audit', to: '/seo-audit' },
    { name: 'Security Audit', to: '/security-audit' },
    { name: 'Worldwide 3D', to: '/worldwide' },
    { name: 'Case Studies', to: '/case-studies' },
    { name: 'Estimator', to: '/estimator' },
    { name: 'Pricing', to: '/pricing' },
    { name: 'Contact', to: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl border-b border-indigo-100/90 shadow-sm shadow-indigo-100/50 py-3'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo with Kinetic Reactor Symbol */}
        <BrandLogo size="md" withText={true} linkTo="/" />

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-3 xl:gap-5">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.name}
                to={link.to}
                className={`text-xs font-medium transition-colors tracking-wide px-2.5 py-1.5 rounded-lg ${
                  isActive 
                    ? "text-sky-700 bg-sky-100/80 font-semibold" 
                    : "text-slate-700 hover:text-sky-600 hover:bg-white/60"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Right Actions: AI Bot + CLI + Admin + Telegram + WhatsApp */}
        <div className="hidden sm:flex items-center gap-2.5">
          
          {/* AI GPT Assistant Trigger */}
          <button
            onClick={onOpenAIChat}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-white transition-all text-xs font-semibold shadow-xs border border-sky-400/40 hover:scale-105 cursor-pointer"
            title="Ask Unfiltered GPT AI Assistant"
          >
            <Bot className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            <span>AI Bot</span>
          </button>

          {/* CLI Terminal Shortcut */}
          <button
            onClick={onOpenTerminal}
            className="p-2.5 rounded-xl bg-white/80 border border-slate-200 text-slate-700 hover:text-sky-600 hover:border-sky-300 hover:bg-white transition-all text-xs font-mono shadow-xs cursor-pointer"
            title="Engineer CLI Terminal (`)"
          >
            <Terminal className="w-4 h-4" />
          </button>

          {/* Executive Portal */}
          <button
            onClick={onOpenAdmin}
            className="p-2.5 rounded-xl bg-white/80 border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 hover:bg-white transition-all text-xs shadow-xs cursor-pointer"
            title="Executive Portal"
          >
            <UserCheck className="w-4 h-4" />
          </button>

          {/* Telegram Direct Line */}
          <a
            href={CONTACT_INFO.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 hover:bg-sky-100 transition-all text-xs font-medium shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Telegram</span>
          </a>

          {/* WhatsApp Direct Line */}
          <a
            href={CONTACT_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs shadow-sm shadow-emerald-600/20 transition-all hover:scale-105"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp Vikas</span>
          </a>

        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={onOpenAIChat}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-950 text-white text-xs font-medium border border-sky-400/40"
          >
            <Bot className="w-4 h-4 text-sky-400" />
            <span>AI</span>
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 shadow-sm cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 border-b border-indigo-100 p-6 space-y-4 animate-fadeIn backdrop-blur-2xl shadow-xl">
          
          <div className="grid grid-cols-2 gap-3">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.name}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-2.5 rounded-xl text-xs font-medium ${
                    isActive 
                      ? "bg-sky-100 text-sky-800 font-semibold" 
                      : "bg-slate-50 text-slate-700 hover:bg-sky-50 hover:text-sky-700"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAIChat();
              }}
              className="inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-950 text-white font-medium text-xs shadow-sm border border-sky-400/40 cursor-pointer"
            >
              <Bot className="w-4 h-4 text-sky-400" />
              <span>Ask AI Assistant (GPT-4o)</span>
            </button>

            <a
              href={CONTACT_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 text-white font-medium text-xs shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp (+919137507092)</span>
            </a>

            <a
              href={CONTACT_INFO.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-sky-500 text-white font-medium text-xs shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>Message on Telegram (@Yourstrulyvikasmishra)</span>
            </a>
          </div>

        </div>
      )}

    </header>
  );
}
