import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CONTACT_INFO } from '../data/agencyData';
import BrandLogo from './BrandLogo';
import { getCurrentUser } from '../services/authService';
import { Terminal, Shield, MessageCircle, Send, Menu, X, Globe, Sparkles, UserCheck, Code2, Bot, User, LogIn } from 'lucide-react';

export default function Navbar({ onOpenTerminal, onOpenAdmin, onOpenAIChat }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Initial auth load
    setCurrentUser(getCurrentUser());

    // Listen for auth changes
    const onAuthChange = () => {
      setCurrentUser(getCurrentUser());
    };
    window.addEventListener('ue_auth_changed', onAuthChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('ue_auth_changed', onAuthChange);
    };
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
        
        {/* Brand Logo with Custom Kinetic Reactor Symbol */}
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

        {/* Right Actions: User Login/Account + AI Bot + CLI + Admin + Telegram + WhatsApp */}
        <div className="hidden sm:flex items-center gap-2.5">
          
          {/* User Sign In / Account Gateway */}
          {currentUser ? (
            <Link
              to="/account"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-all text-xs font-semibold shadow-xs border border-sky-400/40"
              title="Your Account & Subscriptions"
            >
              <img
                src={currentUser.picture}
                alt={currentUser.name}
                className="w-5 h-5 rounded-full object-cover border border-sky-400"
              />
              <span className="max-w-[80px] truncate">{currentUser.name.split(' ')[0]}</span>
              <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                currentUser.subscription?.tier === 'enterprise'
                  ? 'bg-purple-500 text-white'
                  : currentUser.subscription?.tier === 'pro'
                  ? 'bg-sky-400 text-black'
                  : 'bg-slate-700 text-slate-300'
              }`}>
                {currentUser.subscription?.tier === 'enterprise' ? 'ENT' : currentUser.subscription?.tier === 'pro' ? 'PRO' : 'FREE'}
              </span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 transition-all text-xs font-semibold shadow-xs border border-slate-300 hover:border-sky-400"
              title="Sign In with Google"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Sign In</span>
            </Link>
          )}

          {/* AI GPT Assistant Trigger */}
          <button
            onClick={onOpenAIChat}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-white transition-all text-xs font-semibold shadow-xs border border-sky-400/40 hover:scale-105"
            title="Ask Unfiltered GPT AI Assistant"
          >
            <Bot className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            <span>AI Bot</span>
          </button>

          {/* CLI Terminal Shortcut */}
          <button
            onClick={onOpenTerminal}
            className="p-2.5 rounded-xl bg-white/80 border border-slate-200 text-slate-700 hover:text-sky-600 hover:border-sky-300 hover:bg-white transition-all text-xs font-mono shadow-xs"
            title="Engineer CLI Terminal (`)"
          >
            <Terminal className="w-4 h-4" />
          </button>

          {/* Admin Dashboard */}
          <button
            onClick={onOpenAdmin}
            className="p-2.5 rounded-xl bg-white/80 border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 hover:bg-white transition-all text-xs shadow-xs"
            title="Executive Portal"
          >
            <UserCheck className="w-4 h-4" />
          </button>

          {/* Telegram */}
          <a
            href={CONTACT_INFO.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-600 hover:bg-sky-100 transition-all shadow-xs"
            title="Telegram Direct (@Yourstrulyvikasmishra)"
          >
            <Send className="w-4 h-4" />
          </a>

          {/* Primary WhatsApp CTA */}
          <a
            href={CONTACT_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-all shadow-sm shadow-emerald-600/20 hover:scale-[1.02]"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>

        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={onOpenAIChat}
            className="p-2 rounded-xl bg-slate-950 text-white border border-sky-400/40 text-xs font-semibold flex items-center gap-1 shadow-xs"
          >
            <Bot className="w-4 h-4 text-sky-400" />
            <span>AI</span>
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 shadow-sm"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 border-b border-indigo-100 p-6 space-y-4 animate-fadeIn backdrop-blur-2xl shadow-xl">
          {/* Mobile User Profile Gateway */}
          {currentUser ? (
            <Link
              to="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 text-white text-xs font-semibold"
            >
              <div className="flex items-center gap-2.5">
                <img
                  src={currentUser.picture}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-sky-400"
                />
                <div>
                  <div className="font-bold">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{currentUser.email}</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-400 text-black font-bold uppercase">
                {currentUser.subscription?.tier || 'Free'}
              </span>
            </Link>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Sign In with Google</span>
            </Link>
          )}

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
              className="inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-950 text-white font-medium text-xs shadow-sm border border-sky-400/40"
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
              <span>WhatsApp: {CONTACT_INFO.phoneDisplay}</span>
            </a>

            <div className="flex gap-2">
              <a
                href={CONTACT_INFO.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 text-xs font-medium"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegram</span>
              </a>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Portal</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </header>
  );
}
