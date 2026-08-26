import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Cookie, Check, X, Shield, Lock } from 'lucide-react';
import { logSecurityEvent } from '../services/storageService';

const COOKIE_STORAGE_KEY = 'ue_cookie_consent_choice_v1';

export default function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_STORAGE_KEY);
    if (!consent) {
      // Delay display slightly for smooth page load
      const timer = setTimeout(() => setShowBanner(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify({
      choice: 'ALL',
      necessary: true,
      telemetry: true,
      analytics: true,
      timestamp: new Date().toISOString()
    }));
    logSecurityEvent('PRIVACY', 'User Accepted All Cookies & Telemetry Policy', {}, 'CONSENT_ALL');
    setShowBanner(false);
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify({
      choice: 'NECESSARY_ONLY',
      necessary: true,
      telemetry: false,
      analytics: false,
      timestamp: new Date().toISOString()
    }));
    logSecurityEvent('PRIVACY', 'User Accepted Necessary Security Cookies Only', {}, 'CONSENT_NECESSARY');
    setShowBanner(false);
  };

  const handleDenyOptional = () => {
    localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify({
      choice: 'DENIED_OPTIONAL',
      necessary: true,
      telemetry: false,
      analytics: false,
      timestamp: new Date().toISOString()
    }));
    logSecurityEvent('PRIVACY', 'User Denied Optional Cookies', {}, 'CONSENT_DENIED');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-6 md:left-auto md:right-6 md:max-w-xl z-50 animate-fadeIn font-sans">
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-950/95 text-white border border-sky-500/30 shadow-2xl backdrop-blur-xl text-left">
        
        <div className="flex items-start gap-3.5 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center flex-shrink-0">
            <Cookie className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <span>Zero-Trust Privacy & Cookie Compliance</span>
              <span className="px-2 py-0.2 rounded-full bg-sky-950 border border-sky-500/40 text-sky-400 text-[10px] font-mono">
                GDPR / CCPA
              </span>
            </h4>
            <p className="text-xs text-slate-300 font-light mt-1 leading-relaxed">
              We use strictly essential cryptographic cookies for zero-trust member authentication, and optional telemetry cookies for real-time security audit execution and system performance.
            </p>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 mb-4 font-light">
          By selecting an option, you agree to our{' '}
          <Link to="/terms" className="text-sky-400 hover:underline font-medium">Terms of Service</Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-sky-400 hover:underline font-medium">Privacy Policy</Link>.
        </div>

        {/* 3 Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleAcceptAll}
            className="flex-1 py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-sky-500/20 active:scale-[0.98] cursor-pointer"
          >
            Accept All Cookies
          </button>

          <button
            type="button"
            onClick={handleAcceptNecessary}
            className="py-2.5 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs transition-all active:scale-[0.98] cursor-pointer"
          >
            Accept Necessary
          </button>

          <button
            type="button"
            onClick={handleDenyOptional}
            className="py-2.5 px-3 rounded-xl bg-transparent hover:bg-slate-900 text-slate-400 hover:text-slate-200 text-xs transition-colors cursor-pointer"
          >
            Deny Optional
          </button>
        </div>

      </div>
    </div>
  );
}
