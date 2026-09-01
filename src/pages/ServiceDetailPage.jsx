import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { SERVICE_PILLARS, CONTACT_INFO } from '../data/agencyData';
import { ArrowLeft, MessageCircle, ArrowRight, ShieldCheck, CheckCircle2, Star, Zap } from 'lucide-react';
import BigCtaBanner from '../components/BigCtaBanner';

export default function ServiceDetailPage() {
  const { serviceId } = useParams();
  const service = SERVICE_PILLARS.find(s => s.id === serviceId) || SERVICE_PILLARS[0];

  const capabilities = service.capabilities || [];
  const keyStats = service.keyStats || [];
  const techStack = service.techStack || [];

  return (
    <div className="min-h-screen bg-[#FAF7EE] text-[#141414] pt-24 sm:pt-28 pb-20 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Navigation */}
        <div className="mb-6 sm:mb-8">
          <Link
            to="/services"
            className="sticker-pill px-4 py-2 bg-[#F4EFE6] hover:bg-[#FFC72E] text-[#141414] text-xs shadow-[3px_3px_0_0_#141414] cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            <span>BACK TO ALL SERVICES</span>
          </Link>
        </div>

        {/* Hero Card */}
        <div className="rounded-3xl border-2 border-[#141414] bg-[#FFC72E] p-6 sm:p-12 text-[#141414] shadow-[7px_7px_0_0_#141414] mb-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="sticker-pill px-3 py-1 bg-[#FAF7EE] text-[#141414] text-xs shadow-[2px_2px_0_0_#141414]">
              {service.category || 'CORE ENGINEERING'}
            </span>
            <span className="sticker-pill px-3 py-1 bg-[#FF4D00] text-[#FAF7EE] text-xs shadow-[2px_2px_0_0_#141414]">
              {service.badge || 'PRODUCTION SQUAD'}
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-[0.95]">
            {service.title}
          </h1>

          <p className="mt-4 text-sm sm:text-lg font-medium leading-relaxed text-[#141414]/85 max-w-3xl">
            {service.tagline}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <a
              href={`https://wa.me/918369804739?text=${encodeURIComponent(`Hi Vikas, I want to book the ${service.title} squad for our upcoming project.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="sticker-pill px-7 py-3.5 sm:px-9 sm:py-4.5 bg-[#141414] hover:bg-[#FF4D00] text-[#FAF7EE] text-xs sm:text-sm shadow-[4px_4px_0_0_#FF4D00] cursor-pointer"
            >
              <MessageCircle className="size-4" />
              <span>BOOK SQUAD ON WHATSAPP (+91 8369804739)</span>
            </a>

            <Link
              to="/contact"
              className="sticker-pill px-6 py-3.5 sm:px-8 sm:py-4.5 bg-[#FAF7EE] hover:bg-[#141414] hover:text-[#FAF7EE] text-[#141414] text-xs sm:text-sm shadow-[4px_4px_0_0_#141414] cursor-pointer"
            >
              SUBMIT ARCHITECTURE BRIEF
            </Link>
          </div>
        </div>

        {/* Capabilities and Squad Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-10">
          
          <div className="brutal-card rounded-3xl border-2 border-[#141414] bg-[#F4EFE6] p-6 sm:p-8 shadow-[5px_5px_0_0_#141414]">
            <p className="font-display text-xs font-black uppercase text-[#FF4D00] tracking-widest mb-2">FULL CAPABILITIES</p>
            <h3 className="font-display text-xl sm:text-2xl font-black uppercase text-[#141414] mb-4">WHAT WE DELIVER</h3>
            <ul className="space-y-3">
              {capabilities.map((cap, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm font-bold text-[#141414]">
                  <span className="grid size-5 place-items-center rounded-full bg-[#FF4D00] text-[#FAF7EE] text-[10px] flex-shrink-0 mt-0.5 font-black">✓</span>
                  <span>{cap}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="brutal-card rounded-3xl border-2 border-[#141414] bg-[#141414] text-[#FAF7EE] p-6 sm:p-8 shadow-[5px_5px_0_0_#141414]">
            <p className="font-display text-xs font-black uppercase text-[#FFC72E] tracking-widest mb-2">PROVEN BENCHMARKS</p>
            <h3 className="font-display text-xl sm:text-2xl font-black uppercase text-[#FAF7EE] mb-4">SQUAD METRICS</h3>
            <div className="space-y-4">
              {keyStats.map((st, idx) => (
                <div key={idx} className="border-b border-[#FAF7EE]/20 pb-3 last:border-b-0">
                  <div className="font-display text-2xl sm:text-3xl font-black text-[#FFC72E]">{st.value}</div>
                  <div className="text-xs font-bold uppercase text-[#FAF7EE]/70 mt-0.5">{st.label}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Tech Stack Pills */}
        {techStack.length > 0 && (
          <div className="brutal-card rounded-3xl border-2 border-[#141414] bg-[#FAF7EE] p-6 sm:p-8 shadow-[5px_5px_0_0_#141414] mb-16">
            <p className="font-display text-xs font-black uppercase text-[#FF4D00] tracking-widest mb-2">TECHNOLOGY STACK</p>
            <h3 className="font-display text-xl sm:text-2xl font-black uppercase text-[#141414] mb-4">ENGINEERING ARTIFACTS</h3>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech, idx) => (
                <span key={idx} className="sticker-pill px-3 py-1.5 bg-[#F4EFE6] text-[#141414] text-xs font-black uppercase shadow-[2px_2px_0_0_#141414]">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>

      <BigCtaBanner />
    </div>
  );
}
