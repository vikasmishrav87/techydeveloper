import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CASE_STUDIES, CONTACT_INFO } from '../data/agencyData';
import { ExternalLink, CheckCircle2, ArrowRight, MessageCircle, Award, Sparkles, Shield, Zap, Terminal, Layers, Clock, Cpu, Check } from 'lucide-react';

export default function CaseStudies() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Cyber Security & Web3', 'AI & ML', '360° Growth', 'AI Agents & Automation', 'Enterprise SaaS'];

  const filteredStudies = selectedCategory === 'All'
    ? CASE_STUDIES
    : CASE_STUDIES.filter(s => {
        if (selectedCategory === 'Cyber Security & Web3') return s.tag.includes('Security') || s.tag.includes('Blockchain');
        if (selectedCategory === 'AI & ML') return s.tag.includes('AI / ML');
        if (selectedCategory === '360° Growth') return s.tag.includes('Growth') || s.tag.includes('Marketing');
        if (selectedCategory === 'AI Agents & Automation') return s.tag.includes('AI Agents');
        if (selectedCategory === 'Enterprise SaaS') return s.tag.includes('SaaS');
        return true;
      });

  const handleExploreAllClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/case-studies') {
      const el = document.getElementById('case-studies-grid');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      navigate('/case-studies');
      setTimeout(() => {
        const el = document.getElementById('case-studies-grid');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 200);
    }
  };

  const getWhatsAppForStudy = (study) => {
    const text = encodeURIComponent(`Hi Vikas, I reviewed the "${study.title}" case study for ${study.client} on The Unfiltered Engineer platform and would like to build a similar architecture for our team.`);
    return `https://wa.me/919137507092?text=${text}`;
  };

  return (
    <section id="work" className="relative py-28 bg-[#EEF2FF] text-slate-900 overflow-hidden border-t border-b border-indigo-100/90 font-sans">
      
      {/* Subtle light pattern */}
      <div className="absolute inset-0 bg-light-grid opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Inverted Light Band Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 reveal-on-scroll">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-sky-200 text-sky-800 text-xs font-mono uppercase tracking-widest mb-4 shadow-xs">
            <Award className="w-3.5 h-3.5 text-sky-600" />
            Verifiable Production Deployments
          </div>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-slate-950 mb-6">
            Production <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 font-normal">Case Studies</span> & Deep Dives
          </h2>
          <p className="text-slate-700 text-base sm:text-lg font-normal leading-relaxed">
            Real architectural blueprints and verifiable metrics across autonomous AI swarms, zero-trust cryptographic protocols, high-frequency core banking, and multi-million dollar growth engines.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 reveal-on-scroll">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={"px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer " + (
                selectedCategory === cat
                  ? "bg-slate-950 text-white shadow-md scale-105"
                  : "bg-white/80 hover:bg-white text-slate-700 border border-slate-200"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Case Studies Cards Grid */}
        <div id="case-studies-grid" className="space-y-12 scroll-mt-28">
          {filteredStudies.map((study, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div
                key={study.id}
                className="bg-white/95 rounded-3xl p-6 sm:p-10 border border-indigo-100 shadow-sm hover:shadow-md transition-all duration-300 animate-fadeIn"
              >
                <div className={"grid grid-cols-1 lg:grid-cols-12 gap-8 items-center " + (isEven ? "" : "lg:flex-row-reverse")}>
                  
                  {/* Visual Image Preview */}
                  <div className={"lg:col-span-5 " + (isEven ? "lg:order-1" : "lg:order-2")}>
                    <Link to={`/case-studies/${study.id}`} className="block relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden bg-slate-900 shadow-sm border border-slate-200 group">
                      <img
                        src={study.image}
                        alt={study.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/assets/ai-neural-mesh.jpg';
                        }}
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 rounded-full bg-slate-950/85 border border-slate-700 text-sky-300 text-xs font-mono backdrop-blur-md">
                          {study.tag}
                        </span>
                      </div>
                      {study.timeline && (
                        <div className="absolute bottom-3 left-3">
                          <span className="px-2.5 py-0.5 rounded-md bg-white/90 text-slate-800 text-[11px] font-mono font-medium backdrop-blur-md">
                            ⏱️ {study.timeline}
                          </span>
                        </div>
                      )}
                    </Link>
                  </div>

                  {/* Details Block */}
                  <div className={"lg:col-span-7 " + (isEven ? "lg:order-2" : "lg:order-1") + " space-y-5"}>
                    
                    <div>
                      <span className="text-xs font-mono text-indigo-700 font-semibold uppercase tracking-wider">{study.client}</span>
                      <Link to={`/case-studies/${study.id}`}>
                        <h3 className="text-2xl sm:text-3xl font-bold text-slate-950 hover:text-sky-700 transition-colors mt-1">{study.title}</h3>
                      </Link>
                    </div>

                    <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
                      {study.summary}
                    </p>

                    {/* Results Numbers */}
                    <div className="grid grid-cols-3 gap-3 py-4 border-t border-b border-slate-100">
                      {study.results.map((res, rIdx) => (
                        <div key={rIdx}>
                          <div className="text-lg sm:text-xl font-bold text-slate-950 font-mono">{res.value}</div>
                          <div className="text-[11px] text-slate-500 font-normal mt-0.5">{res.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {study.tech.map((t, tIdx) => (
                        <span key={tIdx} className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono font-medium">
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons: WhatsApp & Direct Link to Dedicated Page */}
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <a
                        href={getWhatsAppForStudy(study)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white text-xs font-semibold font-mono transition-all shadow-xs group"
                      >
                        <MessageCircle className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                        <span>Discuss Architecture on WhatsApp</span>
                      </a>

                      <Link
                        to={`/case-studies/${study.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-semibold font-mono transition-all hover:border-sky-300 group"
                      >
                        <span>View Case Study Deep Dive</span>
                        <ArrowRight className="w-3.5 h-3.5 text-sky-600 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>

                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* View All Case Studies Button */}
        <div className="text-center mt-16 reveal-on-scroll">
          <button
            onClick={handleExploreAllClick}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 border border-sky-300 hover:border-sky-500 text-base font-semibold transition-all shadow-sm cursor-pointer hover:scale-105"
          >
            <span>Explore All Client Case Studies</span>
            <ArrowRight className="w-5 h-5 text-sky-600" />
          </button>
        </div>

      </div>

    </section>
  );
}
