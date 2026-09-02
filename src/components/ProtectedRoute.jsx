import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, ShieldAlert, ArrowRight, UserPlus, LogIn, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ProtectedRoute({ children, toolName = 'Diagnostic Telemetry Engine' }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#FAF7EE] text-[#141414]">
        <div className="flex flex-col items-center gap-3">
          <div className="size-10 rounded-full border-3 border-[#141414] border-t-[#FF4D00] animate-spin" />
          <span className="font-mono text-xs uppercase font-bold text-[#141414]/70">Verifying Client Identity...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    const redirectUrl = encodeURIComponent(location.pathname);

    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-[#FAF7EE] text-[#141414] font-sans">
        <div className="max-w-xl w-full p-8 sm:p-12 rounded-3xl bg-[#F4EFE6] border-2 border-[#141414] shadow-[8px_8px_0_0_#141414] text-center space-y-6 animate-fadeIn">
          
          {/* Brand Logo Emblem */}
          <div className="size-20 rounded-2xl bg-[#141414] overflow-hidden border-2 border-[#141414] shadow-[4px_4px_0_0_#FF4D00] p-2 mx-auto hover:scale-105 transition-transform">
            <img 
              src="/assets/brand-logo.png" 
              alt="The Unfiltered Engineer Brand Logo" 
              className="w-full h-full object-contain rounded-xl"
            />
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFC72E] border-2 border-[#141414] text-[#141414] text-xs font-display font-black uppercase mb-3 shadow-[2px_2px_0_0_#141414]">
              <Lock className="size-3.5 text-[#141414]" />
              <span>CLIENT AUTHENTICATION REQUIRED</span>
            </div>
            
            <h2 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#141414] leading-tight">
              ACCESS RESTRICTED
            </h2>
            
            <p className="text-xs sm:text-sm font-medium text-[#141414]/80 mt-3 leading-relaxed max-w-md mx-auto">
              The <strong>Deep 24-Factor Technical SEO Auditor</strong> and <strong>Zero-Trust Offensive Security Sandbox</strong> are restricted to authenticated client accounts.
            </p>
          </div>

          {/* Benefits checklist */}
          <div className="bg-[#FAF7EE] border-2 border-[#141414] rounded-2xl p-4 text-left text-xs font-mono font-bold text-[#141414] space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-[#25D366] flex-shrink-0" />
              <span>Unlimited 24-Factor Multi-Pillar Technical Audits</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-[#25D366] flex-shrink-0" />
              <span>Full Offensive Vulnerability Scans & CVE Telemetry</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-[#25D366] flex-shrink-0" />
              <span>Exportable Engineering Action Roadmaps</span>
            </div>
          </div>

          {/* Dual Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to={`/login?redirect=${redirectUrl}`}
              className="sticker-pill w-full sm:w-auto px-7 py-4 bg-[#141414] hover:bg-[#FF4D00] text-[#FAF7EE] shadow-[4px_4px_0_0_#FF4D00] flex items-center justify-center gap-2 font-black text-xs sm:text-sm uppercase cursor-pointer"
            >
              <LogIn className="size-4" />
              <span>LOG IN TO ACCESS</span>
              <ArrowRight className="size-4" />
            </Link>

            <Link
              to={`/signup?redirect=${redirectUrl}`}
              className="sticker-pill w-full sm:w-auto px-7 py-4 bg-[#FFC72E] hover:bg-[#FF4D00] hover:text-[#FAF7EE] text-[#141414] shadow-[4px_4px_0_0_#141414] flex items-center justify-center gap-2 font-black text-xs sm:text-sm uppercase cursor-pointer"
            >
              <UserPlus className="size-4" />
              <span>CREATE FREE ACCOUNT</span>
            </Link>
          </div>

          <div className="pt-3 border-t-2 border-[#141414]/15">
            <Link to="/" className="text-xs font-display font-black uppercase text-[#FF4D00] hover:underline">
              ← RETURN TO HOMEPAGE
            </Link>
          </div>

        </div>
      </div>
    );
  }

  return children;
}
