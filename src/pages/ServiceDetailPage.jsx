import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { SERVICE_PILLARS, CONTACT_INFO } from '../data/agencyData';
import { ArrowLeft, MessageCircle, ArrowRight, ShieldCheck, CheckCircle2, Star, Zap } from 'lucide-react';

export default function ServiceDetailPage() {
  const { serviceId } = useParams();
  const service = SERVICE_PILLARS.find(s => s.id === serviceId) || SERVICE_PILLARS[0];

  return (
    <div className="min-h-screen bg-[#FAF7EE] text-[#141414] pt-28 pb-24 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Navigation */}
        <Link
          to="/services"
          className="inline-flex items-center gap-2 font-display text-xs font-black uppercase text-[#141414] hover:text-[#FF4D00] transition-colors mb-8"
        >
          <ArrowLeft className="size-4" />
          <span>BACK TO ALL SERVICES</span>
        </Link>

        {/* Hero Card in Yellow / Studio style */}
        <div className="rounded-3xl border-2 border-[#141414] bg-[#FFC72E] p-8 sm:p-12 text-[#141414] shadow-[7px_7px_0_0_#141414] mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#141414] bg-[#FAF7EE] text-[#141414] font-display text-xs font-black uppercase mb-4 shadow-[2px_2px_0_0_#141414]">
            <span>{service.category}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-6xl font-black uppercase tracking-tight leading-[0.95]">
            {service.title}
          </h1>

          <p className="mt-4 text-base sm:text-xl font-medium leading-relaxed text-[#141414]/85 max-w-2xl">
            {service.tagline}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={`https://wa.me/919137507092?text=${encodeURIComponent(`Hi Vikas, I want to book the ${service.title} squad for our upcoming project.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#141414] hover:bg-[#FF4D00] text-[#FAF7EE] px-8 py-4 font-display text-sm sm:text-base font-black uppercase shadow-[4px_4px_0_0_#FF4D00] transition-all hover:-translate-y-0.5"
            >
              <MessageCircle className="size-4" />
              <span>BOOK SQUAD ON WHATSAPP</span>
            </a>

            <Link
              to="/contact"
              className="rounded-full border-2 border-[#141414] bg-[#FAF7EE] hover:bg-[#141414] hover:text-[#FAF7EE] px-8 py-4 font-display text-sm sm:text-base font-black uppercase text-[#141414] shadow-[4px_4px_0_0_#141414] transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              SUBMIT ARCHITECTURE BRIEF
            </Link>
          </div>
        </div>

        {/* Detailed Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          <div className="rounded-3xl border-2 border-[#141414] bg-[#F4EFE6] p-7 sm:p-8 shadow-[5px_5px_0_0_#141414]">
            <p className="font-display text-xs font-black uppercase text-[#FF4D00] tracking-widest mb-2">FULL CAPABILITIES</p>
            <h3 className="font-display text-2xl font-black uppercase text-[#141414] mb-6">WHAT WE DELIVER</h3>
            <ul className="space-y-3">
              {service.capabilities.map((cap, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm font-bold text-[#141414]">
                  <span className="grid size-5 place-items-center rounded-full bg-[#FF4D00] text-[#FAF7EE] text-[10px] flex-shrink-0 mt-0.5">✓</span>
                  <span>{cap}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border-2 border-[#141414] bg-[#141414] text-[#FAF7EE] p-7 sm:p-8 shadow-[5px_5px_0_0_#141414]">
            <p className="font-display text-xs font-black uppercase text-[#FFC72E] tracking-widest mb-2">PROVEN BENCHMARKS</p>
            <h3 className="font-display text-2xl font-black uppercase text-[#FAF7EE] mb-6">SQUAD METRICS</h3>
            <div className="space-y-5">
              {service.keyStats.map((st, idx) => (
                <div key={idx} className="border-b border-[#FAF7EE]/20 pb-3 last:border-b-0">
                  <div className="font-display text-3xl font-black text-[#FFC72E]">{st.value}</div>
                  <div className="text-xs font-bold uppercase text-[#FAF7EE]/70 mt-0.5">{st.label}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
