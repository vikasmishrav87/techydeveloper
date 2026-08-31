import React from 'react';
import { Link } from 'react-router-dom';

export default function ProcessSection() {
  const steps = [
    {
      num: '1',
      title: 'BRIEF & SCOPE',
      desc: 'Tell us what you need. One 15-minute briefing call or message is enough to scope and assemble your squad.'
    },
    {
      num: '2',
      title: 'BUILD & WIRE',
      desc: 'Design, clean code, zero-trust security & AI automation wired together — with transparent daily updates.'
    },
    {
      num: '3',
      title: 'LAUNCH & SCALE',
      desc: 'You go live to production. We stick around for 24/7 incident response, security patches, and scaling.'
    }
  ];

  return (
    <section id="process" className="relative py-16 sm:py-28 bg-[#FAF7EE] text-[#141414] border-b-2 border-[#141414]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 sm:mb-16">
          <p className="font-display text-xs sm:text-sm font-black tracking-[0.2em] text-[#FF4D00] uppercase">HOW IT WORKS</p>
          <h2 className="mt-2 font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-[#141414]">NO DRAMA. JUST DELIVERY.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step) => (
            <div key={step.num} className="brutal-card flex flex-col justify-between rounded-3xl border-2 border-[#141414] bg-[#F4EFE6] p-7 sm:p-8 shadow-[6px_6px_0_0_#141414]">
              <div>
                <div className="grid size-12 place-items-center rounded-full bg-[#FF4D00] font-display text-xl font-black text-[#FAF7EE] shadow-[3px_3px_0_0_#141414] group-hover:scale-110 transition-transform">
                  {step.num}
                </div>
                <h3 className="mt-6 font-display text-xl sm:text-2xl font-black uppercase text-[#141414]">{step.title}</h3>
                <p className="mt-3 text-sm font-medium leading-relaxed text-[#141414]/75">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
