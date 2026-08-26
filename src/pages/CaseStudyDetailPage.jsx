import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CASE_STUDIES, CONTACT_INFO } from '../data/agencyData';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { ArrowLeft, MessageCircle, ArrowRight, CheckCircle2, Zap, Shield, Award, Layers, Clock, Cpu, Check, Terminal, ExternalLink } from 'lucide-react';

export default function CaseStudyDetailPage() {
  useScrollReveal();
  const { studyId } = useParams();

  const study = CASE_STUDIES.find((s) => s.id === studyId);

  if (!study) {
    return (
      <div className="min-h-screen bg-sky-lavender-mesh text-slate-900 pt-32 pb-24 font-sans">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-slate-950 mb-4">Case Study Not Found</h1>
          <p className="text-slate-600 mb-8">The requested architectural case study could not be located in our production registry.</p>
          <Link
            to="/case-studies"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-950 text-white font-medium hover:bg-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Return to All Case Studies
          </Link>
        </div>
      </div>
    );
  }

  const getWhatsAppForStudy = () => {
    const text = encodeURIComponent(`Hi Vikas, I read the complete case study for "${study.title}" (${study.client}) on The Unfiltered Engineer and would like to build a similar architecture for our platform.`);
    return `https://wa.me/919137507092?text=${text}`;
  };

  const otherStudies = CASE_STUDIES.filter((s) => s.id !== study.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-sky-lavender-mesh text-slate-900 pt-28 pb-24 font-sans">
      
      {/* Top Breadcrumbs & Back Navigation */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 reveal-on-scroll">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <Link to="/" className="hover:text-sky-700 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/case-studies" className="hover:text-sky-700 transition-colors">Case Studies</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold truncate">{study.client}</span>
        </div>
        <div className="mt-4">
          <Link
            to="/case-studies"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-sky-700 font-medium transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Case Studies
          </Link>
        </div>
      </div>

      {/* Main Case Study Deep Dive Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Case Study Header Dossier */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 sm:p-12 border border-indigo-100 shadow-sm reveal-on-scroll">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3.5 py-1 rounded-full bg-slate-950 text-sky-300 text-xs font-mono font-medium">
              {study.tag}
            </span>
            <span className="text-xs font-mono text-indigo-700 font-bold uppercase tracking-wider">
              Client: {study.client}
            </span>
            {study.timeline && (
              <span className="px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-mono font-medium">
                ⏱️ {study.timeline}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-950 leading-tight mb-6">
            {study.title}
          </h1>

          <p className="text-slate-700 text-lg sm:text-xl font-normal leading-relaxed max-w-4xl">
            {study.summary}
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 mt-8 pt-6 border-t border-slate-100">
            <a
              href={getWhatsAppForStudy()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm sm:text-base transition-all shadow-md shadow-emerald-600/20 hover:scale-105"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Discuss Similar Architecture on WhatsApp</span>
            </a>

            <Link
              to="/estimator"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold text-sm sm:text-base transition-colors"
            >
              <Zap className="w-4 h-4 text-indigo-600" />
              <span>Estimate Project Scope</span>
            </Link>
          </div>
        </div>

        {/* Visual Showcase & Verifiable Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch reveal-on-scroll">
          
          {/* Image Banner */}
          <div className="lg:col-span-6">
            <div className="relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden bg-slate-950 border border-slate-200 shadow-sm">
              <img
                src={study.image}
                alt={study.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/assets/ai-neural-mesh.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="text-xs font-mono text-sky-300 uppercase tracking-widest mb-1">Architecture Showcase</div>
                <div className="text-lg font-bold text-white">{study.title}</div>
              </div>
            </div>
          </div>

          {/* 3 Metric Cards */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {study.results.map((res, rIdx) => (
              <div key={rIdx} className="bg-white/95 rounded-3xl p-6 border border-indigo-100 shadow-sm flex flex-col justify-center text-center sm:text-left">
                <div className="text-2xl sm:text-3xl font-bold font-mono text-sky-900 mb-1">{res.value}</div>
                <div className="text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold">{res.label}</div>
              </div>
            ))}
          </div>

        </div>

        {/* Challenge vs Engineering Solution Deep Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 reveal-on-scroll">
          
          {/* The Architectural Challenge */}
          <div className="bg-white/95 rounded-3xl p-8 border border-red-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 text-red-700 text-xs font-mono font-bold uppercase tracking-wider">
              <div className="p-2 rounded-xl bg-red-50 border border-red-200">
                <Zap className="w-4 h-4 text-red-600" />
              </div>
              <span>The Architectural Challenge</span>
            </div>
            <h3 className="text-xl font-bold text-slate-950">Bottlenecks & Security Exposure</h3>
            <p className="text-slate-700 text-base leading-relaxed font-normal">
              {study.challenge || study.summary}
            </p>
          </div>

          {/* The Engineering Solution */}
          <div className="bg-white/95 rounded-3xl p-8 border border-emerald-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 text-emerald-800 text-xs font-mono font-bold uppercase tracking-wider">
              <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <span>The Engineering Solution</span>
            </div>
            <h3 className="text-xl font-bold text-slate-950">Zero-Trust Implementation & Execution</h3>
            <p className="text-slate-800 text-base leading-relaxed font-normal">
              {study.solution || study.summary}
            </p>
          </div>

        </div>

        {/* Technical Architecture Highlights */}
        {study.architectureHighlights && (
          <div className="bg-white/95 rounded-3xl p-8 sm:p-10 border border-indigo-100 shadow-sm reveal-on-scroll space-y-6">
            <div>
              <div className="text-xs font-mono text-sky-700 font-bold uppercase tracking-wider mb-1">
                Engineering Specification
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-950">
                Key Technical Highlights & Implementation Milestones
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {study.architectureHighlights.map((hl, hIdx) => (
                <div key={hIdx} className="flex items-start gap-3.5 p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-sm text-slate-800 leading-relaxed">
                  <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="font-medium">{hl}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Verified Production Tech Stack */}
        <div className="bg-white/95 rounded-3xl p-8 sm:p-10 border border-indigo-100 shadow-sm reveal-on-scroll space-y-4">
          <div className="text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold">
            Verified Production Technologies & Tooling
          </div>
          <div className="flex flex-wrap gap-2.5">
            {study.tech.map((t, tIdx) => (
              <span key={tIdx} className="px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-xs font-mono font-medium hover:border-sky-300 transition-colors">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Explore Other Production Case Studies */}
        <div className="reveal-on-scroll pt-8 border-t border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-slate-950">Explore Related Case Studies</h3>
            <Link to="/case-studies" className="text-xs font-semibold text-sky-700 hover:text-sky-800 flex items-center gap-1">
              <span>View All Case Studies</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherStudies.map((other) => (
              <Link
                key={other.id}
                to={`/case-studies/${other.id}`}
                className="group bg-white/90 rounded-3xl p-6 border border-indigo-100 hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-mono text-sky-700 font-semibold uppercase">{other.tag}</span>
                  <h4 className="text-lg font-bold text-slate-950 group-hover:text-sky-700 transition-colors mt-1 mb-2 leading-snug">
                    {other.title}
                  </h4>
                  <p className="text-slate-600 text-xs line-clamp-3 leading-relaxed mb-4">{other.summary}</p>
                </div>
                <div className="text-xs font-semibold text-sky-700 group-hover:text-sky-800 flex items-center gap-1 pt-3 border-t border-slate-100">
                  <span>Read Deep Dive</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Global CTA Banner */}
        <div className="text-center reveal-on-scroll bg-white/95 rounded-3xl p-10 sm:p-14 border border-indigo-100 shadow-sm">
          <h3 className="text-2xl sm:text-4xl font-bold text-slate-950 mb-3">Ready to build your next breakthrough system?</h3>
          <p className="text-slate-600 max-w-xl mx-auto mb-8 text-sm sm:text-base leading-relaxed">
            Our 1,000+ senior engineers assemble dedicated squads within 48 hours for cyber defense, autonomous AI swarms, Web3 protocols, and enterprise SaaS.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={getWhatsAppForStudy()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-base transition-all shadow-md shadow-emerald-600/20 hover:scale-105"
            >
              <MessageCircle className="w-5 h-5" /> Connect on WhatsApp (+91 91375 07092)
            </a>
            <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-medium text-base transition-all shadow-sm hover:scale-105">
              <Layers className="w-5 h-5" /> Assemble Your Squad
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
