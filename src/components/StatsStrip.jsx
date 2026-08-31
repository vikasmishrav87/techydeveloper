import React from 'react';

export default function StatsStrip() {
  return (
    <section className="border-b-2 border-[#141414] bg-[#FFC72E] text-[#141414]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 sm:grid-cols-3 divide-y-2 sm:divide-y-0 sm:divide-x-2 divide-[#141414] border-x-0 sm:border-x-2 border-[#141414]">
        <div className="px-4 py-8 sm:px-6 sm:py-12 text-center">
          <p className="font-display text-4xl sm:text-6xl md:text-7xl font-black leading-none tracking-tight tabular-nums text-[#141414]">0</p>
          <p className="mt-2 font-display text-xs sm:text-sm font-black leading-tight tracking-[0.18em] text-[#141414]/80 uppercase">SECURITY BREACHES</p>
          <p className="text-[11px] font-medium text-[#141414]/60 mt-0.5">100% Zero-Trust Track Record</p>
        </div>
        <div className="px-4 py-8 sm:px-6 sm:py-12 text-center">
          <p className="font-display text-4xl sm:text-6xl md:text-7xl font-black leading-none tracking-tight tabular-nums text-[#141414]">100+</p>
          <p className="mt-2 font-display text-xs sm:text-sm font-black leading-tight tracking-[0.18em] text-[#141414]/80 uppercase">PROJECTS SHIPPED</p>
          <p className="text-[11px] font-medium text-[#141414]/60 mt-0.5">Web3, AI, Cloud & Enterprise</p>
        </div>
        <div className="px-4 py-8 sm:px-6 sm:py-12 text-center">
          <p className="font-display text-4xl sm:text-6xl md:text-7xl font-black leading-none tracking-tight tabular-nums text-[#141414]">&lt; 15M</p>
          <p className="mt-2 font-display text-xs sm:text-sm font-black leading-tight tracking-[0.18em] text-[#141414]/80 uppercase">RESPONSE SLA</p>
          <p className="text-[11px] font-medium text-[#141414]/60 mt-0.5">Direct Executive Escalation</p>
        </div>
      </div>
    </section>
  );
}
