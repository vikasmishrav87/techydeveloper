import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CASE_STUDIES } from '../data/agencyData';
import { ArrowUpRight, MessageCircle, ArrowRight } from 'lucide-react';

export default function CaseStudies() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Cyber Security', 'AI & ML', 'Web3 & Blockchain', 'SaaS', '360° Growth'];

  const filteredStudies = selectedCategory === 'All'
    ? CASE_STUDIES
    : CASE_STUDIES.filter(s => {
        if (selectedCategory === 'Cyber Security') return s.tag.includes('Security');
        if (selectedCategory === 'AI & ML') return s.tag.includes('AI') || s.tag.includes('Agents');
        if (selectedCategory === 'Web3 & Blockchain') return s.tag.includes('Blockchain') || s.tag.includes('Web3');
        if (selectedCategory === 'SaaS') return s.tag.includes('SaaS') || s.tag.includes('Cloud');
        if (selectedCategory === '360° Growth') return s.tag.includes('Growth') || s.tag.includes('Marketing');
        return true;
      });

  return (
    <section id="work" className="relative py-16 sm:py-28 bg-[#F4EFE6] text-[#141414] border-b-2 border-[#141414]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-12">
          <div>
            <p className="font-display text-xs sm:text-sm font-black tracking-[0.2em] text-[#FF4D00] uppercase">
              SELECTED WORK
            </p>
            <h2 className="mt-2 font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-[#141414]">
              BUILT BY US. LOVED BY CLIENTS.
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base font-medium text-[#141414]/70">
            A few of the enterprise systems, security perimeters, and AI bots we architect and ship.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2.5 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`sticker-pill px-4 py-2 text-xs cursor-pointer transition-all ${
                selectedCategory === cat
                  ? 'bg-[#FF4D00] text-[#FAF7EE] shadow-[3px_3px_0_0_#141414]'
                  : 'bg-[#FAF7EE] hover:bg-[#FFC72E] text-[#141414] shadow-[3px_3px_0_0_#141414]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Case Studies Grid with Pop-in Response Animation */}
        <div key={selectedCategory} className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 animate-card-pop">
          {filteredStudies.map((study) => {
            return (
              <div
                key={study.id}
                className="brutal-card group block overflow-hidden rounded-3xl border-2 border-[#141414] bg-[#FAF7EE] shadow-[6px_6px_0_0_#141414]"
              >
                {/* Image / Header Preview */}
                <div className="relative aspect-[16/9] w-full overflow-hidden border-b-2 border-[#141414] bg-[#141414]">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414]/80 via-transparent to-transparent" />
                  
                  {/* Category Pill Tag */}
                  <span className="sticker-pill absolute top-3 left-3 sm:top-4 sm:left-4 bg-[#FFC72E] text-[#141414] px-3 py-1 text-[10px] sm:text-xs shadow-[3px_3px_0_0_#141414]">
                    {study.tag}
                  </span>

                  {/* Impact Metric Tag */}
                  <span className="sticker-pill absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-[#141414] text-[#FAF7EE] border-[#FAF7EE] px-3 py-1 text-[11px] sm:text-xs shadow-[3px_3px_0_0_#FAF7EE]">
                    {study.impact}
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-6 sm:p-7 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-display font-black text-[#FF4D00] uppercase tracking-wider">
                      CLIENT: {study.client} • {study.period}
                    </div>
                    <h3 className="mt-1 font-display text-xl sm:text-2xl font-black uppercase text-[#141414] group-hover:text-[#FF4D00] transition-colors leading-tight">
                      {study.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm font-medium text-[#141414]/70 line-clamp-2">
                      {study.description}
                    </p>
                  </div>

                  {/* Bottom Link Button */}
                  <div className="mt-6 pt-4 border-t-2 border-[#141414]/10 flex items-center justify-between">
                    <Link
                      to={`/case-studies/${study.id}`}
                      className="inline-flex items-center gap-2 font-display text-xs sm:text-sm font-black uppercase underline decoration-2 underline-offset-4 hover:text-[#FF4D00]"
                    >
                      <span>READ ARCHITECTURE DOSSIER</span>
                      <ArrowUpRight className="size-4" />
                    </Link>

                    <a
                      href={`https://wa.me/919137507092?text=${encodeURIComponent(`Hi Vikas, I read the "${study.title}" case study for ${study.client} and want to build a similar solution.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sticker-pill size-10 bg-[#25D366] text-[#141414] shadow-[3px_3px_0_0_#141414]"
                      title="Discuss via WhatsApp"
                    >
                      <MessageCircle className="size-4 text-[#141414]" />
                    </a>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <Link
            to="/case-studies"
            className="sticker-pill px-8 py-4 sm:px-10 sm:py-5 text-sm sm:text-base bg-[#141414] hover:bg-[#FF4D00] text-[#FAF7EE] shadow-[5px_5px_0_0_#FF4D00] cursor-pointer"
          >
            <span>VIEW ALL CLIENT CASE STUDIES</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
