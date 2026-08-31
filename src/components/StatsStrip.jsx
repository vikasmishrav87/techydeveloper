import React from 'react';

export default function StatsStrip() {
  const stats = [
    {
      num: '0',
      label: 'SECURITY BREACHES',
      desc: '100% Zero-Trust Defense Record'
    },
    {
      num: '100+',
      label: 'PROJECTS SHIPPED',
      desc: 'Web3, AI, Cloud & Enterprise'
    },
    {
      num: '$50M+',
      label: 'VOLUME SECURED',
      desc: 'Zero Exploit Loss Since Day 1'
    },
    {
      num: '< 15M',
      label: 'RESPONSE SLA',
      desc: 'Direct Executive Escalation'
    }
  ];

  return (
    <section className="border-b-2 border-[#141414] bg-[#FFC72E] text-[#141414] select-none w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y-2 sm:divide-y-0 sm:divide-x-2 divide-[#141414] w-full">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="group px-4 py-8 sm:px-6 sm:py-12 text-center transition-colors duration-200 hover:bg-[#FFE600] cursor-default"
          >
            <p className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-none tracking-tight tabular-nums text-[#141414] group-hover:scale-105 transition-transform duration-200">
              {stat.num}
            </p>
            <p className="mt-2.5 font-display text-xs sm:text-sm font-black leading-tight tracking-[0.18em] text-[#141414]/90 uppercase">
              {stat.label}
            </p>
            <p className="text-[11px] font-bold text-[#141414]/70 mt-0.5">
              {stat.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
