import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CONTACT_INFO } from '../data/agencyData';
import { Calculator, Shield, Cpu, Brain, Layers, Globe2, MessageCircle, ArrowRight, Check, Zap } from 'lucide-react';

export default function ProjectEstimator() {
  const [selectedServices, setSelectedServices] = useState(['cyber-security', 'blockchain-web3']);
  const [squadScale, setSquadScale] = useState('dedicated');
  const [timelineSpeed, setTimelineSpeed] = useState('standard');

  const serviceOptions = [
    { id: 'cyber-security', name: 'Cyber Security & Exploit Audit' },
    { id: 'blockchain-web3', name: 'Blockchain & Smart Contracts' },
    { id: 'ai-cognitive', name: 'AI/ML Custom LLM & Swarms' },
    { id: 'fullstack-cloud', name: 'Full-Stack & Cloud Architecture' },
    { id: 'digital-marketing-360', name: '360° Tech Marketing & SEO' },
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
      headcount = "7-9 Dedicated Specialists";
    }

    let weeks = "4 - 6 Weeks";
    if (timelineSpeed === 'fast') {
      weeks = "2 - 3 Weeks (Fast-Track)";
    } else if (timelineSpeed === 'war-room') {
      weeks = "7 - 14 Days (War Room Sprint)";
    }

    return { headcount, weeks };
  };

  const squadInfo = getSquadBreakdown();

  const getWhatsAppEstimateLink = () => {
    const selectedNames = selectedServices.map((id) => serviceOptions.find((o) => o.id === id)?.name).filter(Boolean).join(', ');
    const text = encodeURIComponent(`Hi Vikas, I created a custom scope estimate:\n• Practices: ${selectedNames}\n• Squad Scale: ${squadScale.toUpperCase()} (${squadInfo.headcount})\n• Timeline: ${squadInfo.weeks}\n\nLet's discuss onboarding.`);
    return `https://wa.me/919137507092?text=${text}`;
  };

  return (
    <div className="rounded-3xl border-2 border-[#141414] bg-[#FAF7EE] p-6 sm:p-10 shadow-[7px_7px_0_0_#141414] text-[#141414]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 pb-6 border-b-2 border-[#141414]/15">
        <div>
          <p className="font-display text-xs font-black uppercase text-[#FF4D00] tracking-widest">
            SCOPE & TIMELINE CALCULATOR
          </p>
          <h3 className="mt-1 font-display text-2xl sm:text-4xl font-black uppercase text-[#141414]">
            ASSEMBLE YOUR SQUAD
          </h3>
        </div>
        <span className="px-3 py-1 rounded-full border-2 border-[#141414] bg-[#FFC72E] font-display text-xs font-black uppercase">
          LIVE PRICING ENGINE
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Controls */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <label className="block font-display text-xs font-black uppercase text-[#141414] mb-3">
              1. CHOOSE PRACTICE SPECIALIZATIONS:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {serviceOptions.map((opt) => {
                const isSelected = selectedServices.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleService(opt.id)}
                    className={`p-3.5 rounded-2xl border-2 border-[#141414] font-display text-xs font-bold text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#FF4D00] text-[#FAF7EE] shadow-[3px_3px_0_0_#141414]'
                        : 'bg-[#F4EFE6] text-[#141414] hover:bg-[#FFC72E]'
                    }`}
                  >
                    <span>{opt.name}</span>
                    {isSelected && <span className="font-black">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block font-display text-xs font-black uppercase text-[#141414] mb-3">
              2. SQUAD INTENSITY SCALE:
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'sprint', label: 'SPRINT', sub: '2-3 Engineers' },
                { id: 'dedicated', label: 'DEDICATED', sub: '4-5 Engineers' },
                { id: 'enterprise', label: 'ENTERPRISE', sub: '7-9 Engineers' },
              ].map((scale) => (
                <button
                  key={scale.id}
                  type="button"
                  onClick={() => setSquadScale(scale.id)}
                  className={`p-3 rounded-2xl border-2 border-[#141414] font-display text-center transition-all cursor-pointer ${
                    squadScale === scale.id
                      ? 'bg-[#141414] text-[#FAF7EE] shadow-[3px_3px_0_0_#FF4D00]'
                      : 'bg-[#F4EFE6] text-[#141414] hover:bg-[#FFC72E]'
                  }`}
                >
                  <div className="text-xs font-black uppercase">{scale.label}</div>
                  <div className="text-[10px] font-medium opacity-80 mt-0.5">{scale.sub}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output Card */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl border-2 border-[#141414] bg-[#FFC72E] p-6 sm:p-8 text-[#141414] shadow-[5px_5px_0_0_#141414]">
          <div>
            <p className="font-display text-xs font-black uppercase tracking-widest text-[#141414]/70 mb-1">
              ESTIMATED ASSEMBLED SQUAD
            </p>
            <div className="font-display text-3xl font-black uppercase text-[#141414]">
              {squadInfo.headcount}
            </div>

            <div className="mt-6 pt-4 border-t-2 border-[#141414]/20 space-y-3">
              <div>
                <span className="text-[11px] font-bold uppercase text-[#141414]/70">Delivery Timeline:</span>
                <div className="font-display text-base font-black uppercase text-[#141414] mt-0.5">{squadInfo.weeks}</div>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase text-[#141414]/70">Executive Oversight:</span>
                <div className="font-display text-base font-black uppercase text-[#141414] mt-0.5">Vikas Sunil Mishra</div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t-2 border-[#141414]/20 space-y-2.5">
            <a
              href={getWhatsAppEstimateLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-full bg-[#141414] hover:bg-[#FF4D00] text-[#FAF7EE] font-display text-xs sm:text-sm font-black uppercase flex items-center justify-center gap-2 shadow-[3px_3px_0_0_#FF4D00] transition-all hover:-translate-y-0.5"
            >
              <MessageCircle className="size-4 text-[#FAF7EE]" />
              <span>SEND BRIEF ON WHATSAPP</span>
            </a>

            <Link
              to="/checkout"
              className="w-full py-3 rounded-full border-2 border-[#141414] bg-[#FAF7EE] hover:bg-[#141414] hover:text-[#FAF7EE] text-center font-display text-xs font-black uppercase transition-all block"
            >
              DIRECT CLIENT CHECKOUT
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
