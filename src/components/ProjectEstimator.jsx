import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CONTACT_INFO } from '../data/agencyData';
import PaymentModal from './PaymentModal';
import { Calculator, Shield, Cpu, Brain, Layers, Globe2, ArrowRight, MessageCircle, Send, Check, Sparkles, Clock, Users, CreditCard } from 'lucide-react';
import { saveEstimateRecord } from '../services/storageService';

export default function ProjectEstimator() {
  const [selectedServices, setSelectedServices] = useState(['cyber-security', 'blockchain-web3']);
  const [squadScale, setSquadScale] = useState('dedicated'); // sprint, dedicated, enterprise
  const [timelineSpeed, setTimelineSpeed] = useState('standard'); // standard, fast, war-room
  const [isDepositPaymentOpen, setIsDepositPaymentOpen] = useState(false);

  const serviceOptions = [
    { id: 'cyber-security', name: 'Cyber Security & Exploit Audit', icon: Shield },
    { id: 'blockchain-web3', name: 'Blockchain & Smart Contracts', icon: Layers },
    { id: 'ai-cognitive', name: 'AI/ML Custom LLM & Agents', icon: Brain },
    { id: 'fullstack-cloud', name: 'Full-Stack & Cloud Edge', icon: Cpu },
    { id: 'digital-marketing-360', name: '360° Digital Marketing & SEO', icon: Globe2 },
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

  const getSquadBreakdown = () => {
    let headcount = "2-3 Senior Engineers";
    if (squadScale === 'dedicated') {
      headcount = "4-5 Senior Specialists";
    } else if (squadScale === 'enterprise') {
      headcount = "7-9 Dedicated Engineers";
    }

    let weeks = "4 - 6 Weeks";
    if (timelineSpeed === 'fast') {
      weeks = "2 - 3 Weeks (Fast-Track)";
    } else if (timelineSpeed === 'war-room') {
      weeks = "7 - 14 Days (24/7 Red-Team War Room)";
    }

    return { headcount, weeks };
  };

  const squadInfo = getSquadBreakdown();

  const getWhatsAppEstimateLink = () => {
    const selectedNames = selectedServices.map((id) => serviceOptions.find((o) => o.id === id)?.name).filter(Boolean).join(', ');
    const text = encodeURIComponent(`Hi Vikas, I created a custom scope inquiry on The Unfiltered Engineer:\n• Selected Practices: ${selectedNames}\n• Squad Scale: ${squadScale.toUpperCase()} (${squadInfo.headcount})\n• Delivery Velocity: ${squadInfo.weeks}\n\nPlease share full scope details and proposal on WhatsApp.`);
    return `https://wa.me/919137507092?text=${text}`;
  };

  return (
    <section id="estimator" className="relative py-28 bg-[#EEF2FF] text-slate-900 overflow-hidden border-t border-b border-indigo-100/90">
      
      {/* Background patterns */}
      <div className="absolute inset-0 bg-light-grid opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 reveal-on-scroll">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-sky-200 text-sky-800 text-xs font-mono uppercase tracking-widest mb-4 shadow-xs">
            <Calculator className="w-3.5 h-3.5 text-sky-600" />
            Instant Project Scope & Squad Assembly
          </div>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-slate-950 mb-6">
            Custom <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 font-normal">Scope & Squad</span> Configurator
          </h2>
          <p className="text-slate-700 text-base sm:text-lg font-normal leading-relaxed">
            Select your technical practices to configure custom squad staffing, timeline velocity, and deliverables. Get exact details and custom proposal directly on WhatsApp.
          </p>
        </div>

        {/* Estimator Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          
          {/* Left Column: Requirements Selector */}
          <div className="lg:col-span-7 space-y-8 reveal-on-scroll">
            
            {/* Step 1: Services */}
            <div className="bg-white/95 border border-indigo-100 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-sm font-mono uppercase text-slate-500 tracking-wider mb-4 font-semibold">1. Select Required Practices</h3>
              <div className="space-y-3">
                {serviceOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isChecked = selectedServices.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => toggleService(opt.id)}
                      className={"w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left " + (
                        isChecked
                          ? "bg-sky-50/80 border-sky-300 text-slate-950 shadow-xs"
                          : "bg-slate-50/80 border-slate-200 text-slate-700 hover:bg-slate-100/80"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={"p-2 rounded-xl " + (isChecked ? "bg-sky-600 text-white" : "bg-slate-200 text-slate-600")}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-semibold">{opt.name}</span>
                      </div>
                      <div className={"w-6 h-6 rounded-lg flex items-center justify-center border " + (
                        isChecked ? "bg-sky-600 border-sky-600 text-white" : "border-slate-300 bg-white"
                      )}>
                        {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Squad Scale */}
            <div className="bg-white/95 border border-indigo-100 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-sm font-mono uppercase text-slate-500 tracking-wider mb-4 font-semibold">2. Squad Scale & Depth</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'sprint', name: 'Sprint', desc: '2-3 Senior Devs' },
                  { id: 'dedicated', name: 'Dedicated', desc: '4-5 Specialists' },
                  { id: 'enterprise', name: 'Enterprise', desc: '7-9 Engineers' },
                ].map((scale) => (
                  <button
                    key={scale.id}
                    onClick={() => setSquadScale(scale.id)}
                    className={"p-4 rounded-2xl border text-center transition-all " + (
                      squadScale === scale.id
                        ? "bg-slate-950 text-white border-slate-950 shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    )}
                  >
                    <div className="text-sm font-bold">{scale.name}</div>
                    <div className={"text-xs mt-1 " + (squadScale === scale.id ? "text-slate-300" : "text-slate-500")}>
                      {scale.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Speed */}
            <div className="bg-white/95 border border-indigo-100 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-sm font-mono uppercase text-slate-500 tracking-wider mb-4 font-semibold">3. Delivery Velocity</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'standard', name: 'Standard Pace', desc: 'Standard sprints' },
                  { id: 'fast', name: 'Fast-Track', desc: 'Accelerated' },
                  { id: 'war-room', name: '24/7 War Room', desc: 'Emergency NOC' },
                ].map((speed) => (
                  <button
                    key={speed.id}
                    onClick={() => setTimelineSpeed(speed.id)}
                    className={"p-4 rounded-2xl border text-center transition-all " + (
                      timelineSpeed === speed.id
                        ? "bg-indigo-700 text-white border-indigo-700 shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    )}
                  >
                    <div className="text-sm font-bold">{speed.name}</div>
                    <div className={"text-xs mt-1 " + (timelineSpeed === speed.id ? "text-indigo-100" : "text-slate-500")}>
                      {speed.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Scope & WhatsApp Action Card */}
          <div className="lg:col-span-5 sticky top-28 reveal-on-scroll">
            <div className="bg-white/95 border border-indigo-100 rounded-3xl p-8 shadow-lg shadow-sky-100/50">
              
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <span className="text-xs font-mono uppercase text-sky-700 tracking-wider font-semibold">Scope Summary</span>
                <span className="text-xs font-mono bg-sky-50 text-sky-800 px-3 py-1 rounded-full font-bold border border-sky-200">
                  {selectedServices.length} Practices Selected
                </span>
              </div>

              <div className="py-6 space-y-4">
                <div>
                  <div className="text-xs text-slate-500 uppercase font-mono mb-1">Squad Configuration</div>
                  <div className="text-2xl font-bold font-mono text-slate-950">
                    Custom Dedicated Squad
                  </div>
                  <p className="text-xs text-slate-600 mt-1">Direct access to Vikas Mishra & senior specialists</p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-xs text-slate-500 font-mono">Assigned Squad</div>
                    <div className="text-sm font-semibold text-slate-900 mt-0.5">{squadInfo.headcount}</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-xs text-slate-500 font-mono">Delivery Target</div>
                    <div className="text-sm font-semibold text-slate-900 mt-0.5">{squadInfo.weeks}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDepositPaymentOpen(true)}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-sky-600 via-indigo-600 to-teal-600 hover:from-sky-500 hover:to-teal-500 text-white font-semibold text-xs transition-all shadow-md shadow-sky-600/20 hover:scale-[1.02] cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Lock In Squad & Settle Initial Deposit ($1,500)</span>
                </button>

                <a
                  href={getWhatsAppEstimateLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    const selectedNames = selectedServices.map((id) => serviceOptions.find((o) => o.id === id)?.name).filter(Boolean);
                    saveEstimateRecord({
                      services: selectedNames,
                      squadScale: squadScale.toUpperCase(),
                      timelineSpeed: timelineSpeed,
                      headcount: squadInfo.headcount,
                      duration: squadInfo.weeks,
                      estimatedCost: 'Dedicated Squad Retainer'
                    });
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-medium text-xs transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Know in Details on WhatsApp</span>
                </a>

                <Link
                  to="/contact"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium transition-all"
                >
                  <span>Book Architecture Consultation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Estimator Deposit Payment Modal */}
      {isDepositPaymentOpen && (
        <PaymentModal
          isOpen={isDepositPaymentOpen}
          onClose={() => setIsDepositPaymentOpen(false)}
          initialAmount={1500}
          initialCurrency="USD"
          serviceName={`Milestone 1 Initial Deposit — ${squadScale.toUpperCase()} Squad (${selectedServices.length} Practices)`}
        />
      )}
    </section>
  );
}
