import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CONTACT_INFO } from '../data/agencyData';
import { MessageCircle, Send, Terminal, Calculator, Shield, ShieldCheck, ChevronUp, Sparkles, X, Bot } from 'lucide-react';

export default function FloatingDock({ onOpenTerminal, onOpenEstimator, onOpenScanner, onOpenAIChat }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5 font-sans">
      
      {/* Expanded Tools Menu */}
      {expanded && (
        <div className="flex flex-col items-end gap-2 mb-1 animate-fadeIn">
          
          {/* Executive Verification Portal */}
          <Link
            to="/admin/verify"
            onClick={() => setExpanded(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold shadow-xl hover:scale-105 transition-all border border-emerald-400/50 backdrop-blur-md"
          >
            <span className="text-emerald-300">Executive Portal 🛡️</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </Link>

          {/* Ask AI Assistant (GPT-4o) */}
          <button
            onClick={() => {
              if (onOpenAIChat) onOpenAIChat();
              setExpanded(false);
            }}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-950 text-white text-xs font-semibold shadow-xl hover:scale-105 transition-all border border-sky-400/40 backdrop-blur-md"
          >
            <span className="text-sky-300">Ask AI Architect (GPT-4o)</span>
            <Bot className="w-4 h-4 text-sky-400" />
          </button>

          {/* Telegram Channel */}
          <a
            href={CONTACT_INFO.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/95 border border-sky-300 text-sky-900 text-xs font-medium shadow-lg hover:scale-105 transition-all backdrop-blur-md"
          >
            <span>Telegram: {CONTACT_INFO.telegramUser}</span>
            <Send className="w-4 h-4 text-sky-600" />
          </a>

          {/* Scope Estimator */}
          <button
            onClick={() => {
              onOpenEstimator();
              setExpanded(false);
            }}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/95 border border-indigo-300 text-indigo-900 text-xs font-medium shadow-lg hover:scale-105 transition-all backdrop-blur-md"
          >
            <span>Scope Estimator</span>
            <Calculator className="w-4 h-4 text-indigo-600" />
          </button>

          {/* Security Audit Scanner */}
          <button
            onClick={() => {
              onOpenScanner();
              setExpanded(false);
            }}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/95 border border-sky-300 text-sky-900 text-xs font-medium shadow-lg hover:scale-105 transition-all backdrop-blur-md"
          >
            <span>Security Scanner</span>
            <Shield className="w-4 h-4 text-sky-600" />
          </button>

          {/* Interactive CLI Terminal */}
          <button
            onClick={() => {
              onOpenTerminal();
              setExpanded(false);
            }}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/95 border border-slate-300 text-slate-900 text-xs font-mono shadow-lg hover:scale-105 transition-all backdrop-blur-md"
          >
            <span>Engineer CLI [ ` ]</span>
            <Terminal className="w-4 h-4 text-slate-700" />
          </button>

        </div>
      )}

      {/* Main Floating Pill Dock */}
      <div className="flex items-center gap-2 p-1.5 rounded-full bg-white/95 border border-sky-300 shadow-xl backdrop-blur-xl">
        
        {/* Ask AI Assistant Button (Direct Trigger with Pulsing Glow) */}
        <button
          onClick={onOpenAIChat}
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-gradient-to-r from-slate-950 to-indigo-950 hover:from-slate-900 hover:to-indigo-900 text-white font-medium text-xs transition-all shadow-md group border border-sky-400/30"
          title="Ask Unfiltered GPT AI Assistant"
        >
          <Bot className="w-4 h-4 text-sky-400 group-hover:rotate-12 transition-transform" />
          <span className="text-sky-200">AI Bot</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>

        {/* Direct WhatsApp Button */}
        <a
          href={CONTACT_INFO.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-all shadow-md group"
          title="Direct WhatsApp"
        >
          <MessageCircle className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">WhatsApp</span>
        </a>

        {/* Toggle Tools Button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className={"p-2.5 rounded-full transition-all " + (
            expanded ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          )}
          title="Quick Actions"
        >
          {expanded ? <X className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>

      </div>

    </div>
  );
}
