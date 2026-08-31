import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CASE_STUDIES, CONTACT_INFO } from '../data/agencyData';
import { ArrowLeft, MessageCircle, ArrowRight, ShieldCheck, Star } from 'lucide-react';

export default function CaseStudyDetailPage() {
  const { studyId } = useParams();
  const study = CASE_STUDIES.find(s => s.id === studyId) || CASE_STUDIES[0];

  return (
    <div className="min-h-screen bg-[#FAF7EE] text-[#141414] pt-28 pb-24 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Navigation */}
        <Link
          to="/case-studies"
          className="inline-flex items-center gap-2 font-display text-xs font-black uppercase text-[#141414] hover:text-[#FF4D00] transition-colors mb-8"
        >
          <ArrowLeft className="size-4" />
          <span>BACK TO ALL CASE STUDIES</span>
        </Link>

        {/* Hero Card */}
        <div className="rounded-3xl border-2 border-[#141414] bg-[#141414] text-[#FAF7EE] p-8 sm:p-12 shadow-[7px_7px_0_0_#FF4D00] mb-12">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="rounded-full border border-[#FAF7EE] bg-[#FF4D00] text-[#FAF7EE] px-3 py-1 font-display text-xs font-black uppercase">
              {study.tag}
            </span>
            <span className="rounded-full border border-[#FAF7EE]/30 px-3 py-1 font-display text-xs font-bold text-[#FAF7EE]/80 uppercase">
              {study.period}
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight leading-[0.98]">
            {study.title}
          </h1>

          <p className="mt-4 text-base sm:text-xl font-medium text-[#FAF7EE]/80 max-w-2xl">
            {study.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={`https://wa.me/918369804739?text=${encodeURIComponent(`Hi Vikas, I read the "${study.title}" case study for ${study.client} and want to discuss building a similar system.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#FF4D00] hover:bg-[#FF5500] text-[#FAF7EE] px-8 py-4 font-display text-sm sm:text-base font-black uppercase shadow-[4px_4px_0_0_#FFC72E] transition-all hover:-translate-y-0.5"
            >
              <MessageCircle className="size-4" />
              <span>DISCUSS ARCHITECTURE ON WHATSAPP</span>
            </a>
          </div>
        </div>

        {/* Deliverables & Stack */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="rounded-3xl border-2 border-[#141414] bg-[#F4EFE6] p-7 sm:p-8 shadow-[5px_5px_0_0_#141414]">
            <p className="font-display text-xs font-black uppercase text-[#FF4D00] tracking-widest mb-2">KEY IMPACT</p>
            <h3 className="font-display text-2xl font-black uppercase text-[#141414] mb-4">PRODUCTION OUTCOME</h3>
            <div className="font-display text-3xl sm:text-4xl font-black text-[#FF4D00] mb-2">{study.impact}</div>
            <p className="text-sm font-medium text-[#141414]/75">Validated under live production conditions across distributed nodes.</p>
          </div>

          <div className="rounded-3xl border-2 border-[#141414] bg-[#FFC72E] p-7 sm:p-8 shadow-[5px_5px_0_0_#141414] text-[#141414]">
            <p className="font-display text-xs font-black uppercase text-[#141414] tracking-widest mb-2">TECHNOLOGY STACK</p>
            <h3 className="font-display text-2xl font-black uppercase text-[#141414] mb-4">DEPLOYED ARTIFACTS</h3>
            <div className="flex flex-wrap gap-2">
              {study.techStack.map((tech, idx) => (
                <span key={idx} className="px-3 py-1.5 rounded-xl border border-[#141414] bg-[#FAF7EE] font-display text-xs font-black uppercase">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
