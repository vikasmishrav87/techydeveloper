import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CASE_STUDIES, CONTACT_INFO } from '../data/agencyData';
import { ArrowLeft, MessageCircle, ArrowRight, ShieldCheck, CheckCircle2, Star, Zap, Layers, Server } from 'lucide-react';
import BigCtaBanner from '../components/BigCtaBanner';

export default function CaseStudyDetailPage() {
  const { studyId } = useParams();
  const study = CASE_STUDIES.find(s => s.id === studyId) || CASE_STUDIES[0];

  const techList = study.tech || study.techStack || ['Production Stack', 'Distributed Microservices', 'CI/CD'];
  const resultsList = study.results || [
    { label: 'Production Uptime', value: '99.999%' },
    { label: 'Zero-Trust Verification', value: '100%' }
  ];
  const highlights = study.architectureHighlights || [
    'Sub-second latency across distributed global edge networks',
    'Military-grade cryptographic state verification',
    'Automated self-healing infrastructure with zero downtime'
  ];

  return (
    <div className="min-h-screen bg-[#FAF7EE] text-[#141414] pt-24 sm:pt-28 pb-20 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Navigation */}
        <div className="mb-6 sm:mb-8">
          <Link
            to="/case-studies"
            className="sticker-pill px-4 py-2 bg-[#F4EFE6] hover:bg-[#FFC72E] text-[#141414] text-xs shadow-[3px_3px_0_0_#141414] cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            <span>BACK TO ALL CASE STUDIES</span>
          </Link>
        </div>

        {/* Hero Card */}
        <div className="rounded-3xl border-2 border-[#141414] bg-[#141414] text-[#FAF7EE] p-6 sm:p-12 shadow-[7px_7px_0_0_#FF4D00] mb-10 overflow-hidden relative">
          
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className="sticker-pill px-3 py-1 bg-[#FF4D00] text-[#FAF7EE] border-[#FAF7EE] text-[11px] sm:text-xs shadow-[2px_2px_0_0_#FFC72E]">
              {study.tag || 'ENTERPRISE ARCHITECTURE'}
            </span>
            <span className="sticker-pill px-3 py-1 bg-[#25D366] text-[#141414] text-[11px] sm:text-xs shadow-[2px_2px_0_0_#141414]">
              CLIENT: {study.client}
            </span>
            <span className="sticker-pill px-3 py-1 bg-[#FFC72E] text-[#141414] text-[11px] sm:text-xs shadow-[2px_2px_0_0_#141414]">
              {study.timeline || study.period || 'DIRECT SENIOR SQUAD'}
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-[0.98]">
            {study.title}
          </h1>

          <p className="mt-4 text-sm sm:text-lg font-medium text-[#FAF7EE]/85 max-w-3xl leading-relaxed">
            {study.summary || study.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <a
              href={`https://wa.me/918369804739?text=${encodeURIComponent(`Hi Vikas, I read the "${study.title}" case study for ${study.client} and want to discuss building a similar system.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="sticker-pill px-7 py-3.5 sm:px-9 sm:py-4.5 bg-[#FF4D00] hover:bg-[#FFC72E] hover:text-[#141414] text-[#FAF7EE] text-xs sm:text-sm shadow-[4px_4px_0_0_#FFC72E] cursor-pointer"
            >
              <MessageCircle className="size-4" />
              <span>DISCUSS ARCHITECTURE ON WHATSAPP (+91 8369804739)</span>
            </a>

            <Link
              to="/contact"
              className="sticker-pill px-6 py-3.5 sm:px-8 sm:py-4.5 bg-[#FAF7EE] hover:bg-[#FFC72E] text-[#141414] text-xs sm:text-sm shadow-[4px_4px_0_0_#FAF7EE] cursor-pointer"
            >
              START A PROJECT
            </Link>
          </div>
        </div>

        {/* Production Metrics Results Grid */}
        <div className="mb-10">
          <p className="font-display text-xs font-black uppercase text-[#FF4D00] tracking-widest mb-3">
            VERIFIED OUTCOMES & METRICS
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {resultsList.map((res, idx) => (
              <div
                key={idx}
                className="brutal-card rounded-3xl border-2 border-[#141414] bg-[#FFC72E] p-6 text-center shadow-[5px_5px_0_0_#141414]"
              >
                <div className="font-display text-3xl sm:text-4xl font-black text-[#141414]">{res.value}</div>
                <div className="font-display text-xs font-black uppercase text-[#141414]/80 mt-1.5">{res.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Challenge vs Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-10">
          {study.challenge && (
            <div className="brutal-card rounded-3xl border-2 border-[#141414] bg-[#F4EFE6] p-6 sm:p-8 shadow-[5px_5px_0_0_#141414]">
              <p className="font-display text-xs font-black uppercase text-[#FF4D00] tracking-widest mb-2">THE BOTTLENECK</p>
              <h3 className="font-display text-xl sm:text-2xl font-black uppercase text-[#141414] mb-3">THE CHALLENGE</h3>
              <p className="text-sm font-medium text-[#141414]/80 leading-relaxed">{study.challenge}</p>
            </div>
          )}

          {study.solution && (
            <div className="brutal-card rounded-3xl border-2 border-[#141414] bg-[#FAF7EE] p-6 sm:p-8 shadow-[5px_5px_0_0_#141414]">
              <p className="font-display text-xs font-black uppercase text-[#25D366] tracking-widest mb-2">THE DEPLOYMENT</p>
              <h3 className="font-display text-xl sm:text-2xl font-black uppercase text-[#141414] mb-3">OUR ARCHITECTURAL SOLUTION</h3>
              <p className="text-sm font-medium text-[#141414]/80 leading-relaxed">{study.solution}</p>
            </div>
          )}
        </div>

        {/* Architecture Highlights & Tech Stack */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-16">
          <div className="brutal-card rounded-3xl border-2 border-[#141414] bg-[#FAF7EE] p-6 sm:p-8 shadow-[5px_5px_0_0_#141414]">
            <p className="font-display text-xs font-black uppercase text-[#FF4D00] tracking-widest mb-2">SYSTEM SPECIFICATIONS</p>
            <h3 className="font-display text-xl sm:text-2xl font-black uppercase text-[#141414] mb-4">ARCHITECTURE HIGHLIGHTS</h3>
            <ul className="space-y-3">
              {highlights.map((h, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm font-bold text-[#141414]">
                  <span className="size-2 rounded-full bg-[#FF4D00] flex-shrink-0 mt-1.5" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="brutal-card rounded-3xl border-2 border-[#141414] bg-[#141414] text-[#FAF7EE] p-6 sm:p-8 shadow-[5px_5px_0_0_#141414]">
            <p className="font-display text-xs font-black uppercase text-[#FFC72E] tracking-widest mb-2">STACK & PROTOCOLS</p>
            <h3 className="font-display text-xl sm:text-2xl font-black uppercase text-[#FAF7EE] mb-4">DEPLOYED ARTIFACTS</h3>
            <div className="flex flex-wrap gap-2">
              {techList.map((tech, idx) => (
                <span key={idx} className="sticker-pill px-3 py-1.5 bg-[#FAF7EE] text-[#141414] text-xs font-black uppercase shadow-[2px_2px_0_0_#FF4D00]">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      <BigCtaBanner />
    </div>
  );
}
