import React from 'react';
import { Link } from 'react-router-dom';
import LiveSEOAuditor from '../components/LiveSEOAuditor';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { CONTACT_INFO } from '../data/agencyData';
import { ArrowLeft, TrendingUp, ShieldCheck, Zap, Layers, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';

export default function SEOAuditPage() {
  useScrollReveal();

  return (
    <div className="min-h-screen bg-sky-lavender-mesh text-slate-900 pt-28 pb-24 font-sans">
      
      {/* Back Link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 reveal-on-scroll">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-sky-700 font-medium transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>

      {/* Main Interactive SEO Auditor Tool */}
      <div className="reveal-on-scroll">
        <LiveSEOAuditor />
      </div>

      {/* Deep SEO Engineering Methodology Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 reveal-on-scroll">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h3 className="text-3xl font-light text-slate-950 mb-4">
            How Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600 font-normal">1,000+ Senior Engineers</span> Engineer High-Rank SEO
          </h3>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            We don’t do shallow blog posts. We build programmatic topic silos, sub-50ms server responses, and custom schema graphs designed to conquer organic search.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/95 p-8 rounded-3xl border border-indigo-100 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-950 mb-2">100/100 Core Web Vitals</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Sub-second Largest Contentful Paint (LCP), zero layout shifts, edge-cached dynamic content delivery, and ultra-compact next-gen image pipelines.
            </p>
          </div>

          <div className="bg-white/95 p-8 rounded-3xl border border-indigo-100 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mb-6">
              <Layers className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-950 mb-2">Programmatic Topic Clustering</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Automated generation of thousands of high-intent, authoritative programmatic landing pages ranking for long-tail transactional queries.
            </p>
          </div>

          <div className="bg-white/95 p-8 rounded-3xl border border-indigo-100 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-950 mb-2">Semantic Entity Graphs</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Deep JSON-LD structured data linking your company into Google’s Knowledge Graph for rich snippets, featured answer boxes, and voice search.
            </p>
          </div>
        </div>

        {/* Bottom Consultation Card */}
        <div className="mt-16 bg-white/95 rounded-3xl p-10 border border-indigo-100 shadow-sm text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-950 mb-3">
            Scale Your Organic Pipeline with Vikas Mishra
          </h3>
          <p className="text-slate-600 max-w-xl mx-auto mb-8 text-sm leading-relaxed">
            Connect directly on WhatsApp to receive a comprehensive manual technical SEO audit and squad roadmap for your web application.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={CONTACT_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-base transition-all shadow-md shadow-emerald-600/20 hover:scale-105"
            >
              <MessageCircle className="w-5 h-5" /> Chat on WhatsApp (+91 91375 07092)
            </a>
            <Link 
              to="/contact" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-medium text-base transition-all shadow-sm hover:scale-105"
            >
              <span>Book SEO Strategy Call</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
