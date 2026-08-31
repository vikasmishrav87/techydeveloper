import React from 'react';
import { GLOBAL_HUBS, CONTACT_INFO } from '../data/agencyData';
import { Globe2, MessageCircle, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WorldwideGlobe() {
  return (
    <section id="worldwide" className="relative py-16 sm:py-28 bg-[#141414] text-[#FAF7EE] border-b-2 border-[#141414]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12 sm:mb-16">
          <div>
            <p className="font-display text-xs sm:text-sm font-black tracking-[0.2em] text-[#FF4D00] uppercase">
              DISTRIBUTED DEPLOYMENT MESH
            </p>
            <h2 className="mt-2 font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-[#FAF7EE]">
              WORLDWIDE HUBS & NODES
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base font-medium text-[#FAF7EE]/70">
            Global senior engineers operating across key financial and tech hubs with sub-20ms latency and 24/7 coverage.
          </p>
        </div>

        {/* Hubs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GLOBAL_HUBS.map((hub) => (
            <div
              key={hub.id}
              className="rounded-3xl border-2 border-[#FAF7EE]/20 bg-[#FAF7EE]/5 p-6 sm:p-8 backdrop-blur-md shadow-[5px_5px_0_0_#FF4D00] transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="font-display text-xl font-black uppercase text-[#FFC72E]">
                  {hub.city}
                </span>
                <span className="rounded-full bg-[#25D366] text-[#141414] px-2.5 py-0.5 font-display text-[10px] font-black uppercase">
                  {hub.status}
                </span>
              </div>

              <p className="text-xs font-bold uppercase text-[#FAF7EE]/70 mb-4">
                {hub.specialty}
              </p>

              <div className="space-y-2 border-t border-[#FAF7EE]/15 pt-4 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-[#FAF7EE]/50">LATENCY:</span>
                  <span className="text-[#25D366] font-bold">{hub.latency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#FAF7EE]/50">TIMEZONE:</span>
                  <span className="text-[#FAF7EE] font-bold">{hub.timezone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#FAF7EE]/50">ACTIVE SQUADS:</span>
                  <span className="text-[#FF4D00] font-bold">{hub.activeSquads}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#FAF7EE]/15">
                <a
                  href={`https://wa.me/918369804739?text=${encodeURIComponent(`Hi Vikas, I want to route a project through your ${hub.city} hub.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-full bg-[#FAF7EE] hover:bg-[#FF4D00] text-[#141414] hover:text-[#FAF7EE] font-display text-xs font-black uppercase flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="size-3.5" />
                  <span>CONNECT VIA {hub.city.toUpperCase()}</span>
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
