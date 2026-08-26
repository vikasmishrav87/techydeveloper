import React, { useState } from 'react';
import { WORK_MODEL_ECOSYSTEM, CONTACT_INFO } from '../data/agencyData';
import { Users, Shield, Cpu, Zap, ArrowRight, MessageCircle, Send, CheckCircle2, Award, Clock, Layers, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WorkModelEcosystem() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="ecosystem" className="relative py-28 bg-[#EEF2FF] text-slate-900 overflow-hidden border-t border-b border-indigo-100/90">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-sky-200/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-indigo-200/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-light-grid opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 reveal-on-scroll">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-sky-200 text-sky-800 text-xs font-mono uppercase tracking-widest mb-4 shadow-xs">
            <Users className="w-3.5 h-3.5 text-sky-600" />
            1,000+ Senior Expert Engineers Bench
          </div>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-slate-950 mb-6">
            Our Work Model <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 font-normal">Ecosystem</span>
          </h2>
          <p className="text-slate-700 text-base sm:text-lg font-normal leading-relaxed">
            We operate a decentralized global collective of over <strong className="font-semibold text-slate-950">1,000+ senior expert engineers</strong> across Cyber Security, Web3 Protocols, AI/ML, Full-Stack, and High-ROAS Growth. Zero junior hand-offs, zero middle management.
          </p>
        </div>

        {/* 4 Value Pillars Badges */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16 reveal-on-scroll">
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-indigo-100 shadow-xs text-center">
            <div className="text-3xl font-bold font-mono text-sky-700 mb-1">1,000+</div>
            <div className="text-xs font-semibold uppercase text-slate-700">Vetted Senior Engineers</div>
            <p className="text-[11px] text-slate-500 mt-1">Ex-FAANG, Web3 core devs & AI PhDs</p>
          </div>

          <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-indigo-100 shadow-xs text-center">
            <div className="text-3xl font-bold font-mono text-emerald-700 mb-1">0</div>
            <div className="text-xs font-semibold uppercase text-slate-700">Junior Hand-offs</div>
            <p className="text-[11px] text-slate-500 mt-1">Direct communication with makers</p>
          </div>

          <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-indigo-100 shadow-xs text-center">
            <div className="text-3xl font-bold font-mono text-indigo-700 mb-1">48 Hrs</div>
            <div className="text-xs font-semibold uppercase text-slate-700">Squad Assembly SLA</div>
            <p className="text-[11px] text-slate-500 mt-1">Immediate tactical deployment</p>
          </div>

          <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-indigo-100 shadow-xs text-center">
            <div className="text-3xl font-bold font-mono text-purple-700 mb-1">99.999%</div>
            <div className="text-xs font-semibold uppercase text-slate-700">Zero-Breach SLA</div>
            <p className="text-[11px] text-slate-500 mt-1">Formal verification guaranteed</p>
          </div>
        </div>

        {/* 5-Step Interactive Execution Pipeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Step Selector Column */}
          <div className="lg:col-span-5 space-y-3 reveal-on-scroll">
            <h3 className="text-xs font-mono uppercase text-slate-500 tracking-wider mb-2 font-semibold">Execution Phases</h3>
            {WORK_MODEL_ECOSYSTEM.pillars.map((item, idx) => {
              const isSelected = activeStep === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={"w-full text-left p-5 rounded-2xl transition-all border flex items-start gap-4 " + (
                    isSelected
                      ? "bg-slate-950 text-white border-slate-950 shadow-md translate-x-1"
                      : "bg-white/90 hover:bg-white text-slate-800 border-indigo-100 hover:border-sky-300 shadow-xs"
                  )}
                >
                  <span className={"text-xs font-mono font-bold px-2.5 py-1 rounded-lg " + (
                    isSelected ? "bg-sky-500 text-black" : "bg-slate-100 text-slate-700"
                  )}>
                    {item.step}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold tracking-tight">{item.phase}</h4>
                    </div>
                    <span className={"text-[11px] font-mono mt-0.5 inline-block " + (
                      isSelected ? "text-sky-300" : "text-slate-500"
                    )}>
                      ⏱️ {item.duration}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Step Deep Dive Column */}
          <div className="lg:col-span-7 reveal-on-scroll">
            <div className="bg-white/95 border border-indigo-100 rounded-3xl p-8 shadow-sm">
              
              <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
                <div>
                  <span className="text-xs font-mono text-sky-700 font-semibold uppercase tracking-wider">
                    Phase {WORK_MODEL_ECOSYSTEM.pillars[activeStep].step}
                  </span>
                  <h3 className="text-2xl font-bold text-slate-950 mt-1">
                    {WORK_MODEL_ECOSYSTEM.pillars[activeStep].phase}
                  </h3>
                </div>
                <span className="px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-mono font-bold">
                  {WORK_MODEL_ECOSYSTEM.pillars[activeStep].duration}
                </span>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-2 font-semibold">How We Execute</h4>
                  <p className="text-slate-700 text-base leading-relaxed">
                    {WORK_MODEL_ECOSYSTEM.pillars[activeStep].desc}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-sky-50/80 border border-sky-200">
                  <div className="text-xs font-mono uppercase text-sky-900 font-bold mb-1">Standard Phase Deliverable</div>
                  <div className="text-sm text-slate-800 font-medium">
                    {WORK_MODEL_ECOSYSTEM.pillars[activeStep].deliverable}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <a
                  href={`https://wa.me/919137507092?text=Hi%20Vikas,%20I%20reviewed%20the%20${encodeURIComponent(WORK_MODEL_ECOSYSTEM.pillars[activeStep].phase)}%20phase%20and%20want%20to%20deploy%20a%20dedicated%20squad.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-all shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Deploy Squad on WhatsApp</span>
                </a>

                <Link
                  to="/services"
                  className="text-xs font-semibold text-sky-700 hover:text-sky-800 flex items-center gap-1"
                >
                  <span>Explore All 8 Practice Squads</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
