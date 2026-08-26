import React from 'react';
import { 
  XCircle, 
  CheckCircle2, 
  Flame, 
  ShieldAlert, 
  Award,
  Zap
} from 'lucide-react';
import { comparisonData } from '../data/agencyData';

export default function Manifesto() {
  return (
    <section id="manifesto" className="py-24 bg-dark-900 border-t border-dark-800 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 right-10 w-80 h-80 bg-bronze-600/5 blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-dark-800 border border-bronze-500/30 text-bronze-400 text-xs font-mono mb-4">
            <Flame className="w-3.5 h-3.5" />
            <span>[THE_UNFILTERED_TRUTH]</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
            Why Global Enterprises Choose <br />
            <span className="bronze-gradient-text">The Unfiltered Engineer Tech Solutions.</span>
          </h2>
          <p className="mt-4 text-titanium-400 text-sm sm:text-base">
            Most legacy IT consultancies are sales machines that outsource code to junior developers. We are an elite technology company that delivers high-performance production tech and IT solutions.
          </p>
        </div>

        {/* Comparison Table Card */}
        <div className="max-w-5xl mx-auto rounded-2xl bg-dark-950 border border-dark-750 shadow-2xl overflow-hidden">
          
          {/* Table Header */}
          <div className="grid grid-cols-12 bg-dark-850 p-4 sm:p-6 border-b border-dark-750 font-mono text-xs text-titanium-400">
            <div className="col-span-4 uppercase tracking-wider font-bold">Standard Dimensions</div>
            <div className="col-span-4 text-red-400/90 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>Legacy IT Vendors</span>
            </div>
            <div className="col-span-4 text-bronze-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-bronze-400 shrink-0" />
              <span>The Unfiltered Engineer</span>
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-dark-800/80">
            {comparisonData.map((row, idx) => (
              <div
                key={idx}
                className={`grid grid-cols-12 p-4 sm:p-6 text-xs sm:text-sm items-center transition-colors ${
                  row.highlight ? 'bg-dark-900/60' : 'bg-dark-950 hover:bg-dark-900/40'
                }`}
              >
                {/* Feature Name */}
                <div className="col-span-4 font-mono font-semibold text-white pr-2">
                  {row.feature}
                </div>

                {/* Traditional Agency Flaw */}
                <div className="col-span-4 text-titanium-400 flex items-start gap-2 pr-4">
                  <span className="text-red-400 font-mono text-xs">✕</span>
                  <span className="text-xs leading-relaxed">{row.traditional}</span>
                </div>

                {/* The Unfiltered Engineer Advantage */}
                <div className="col-span-4 text-titanium-100 flex items-start gap-2 bg-bronze-950/30 p-2.5 rounded-lg border border-bronze-900/50">
                  <CheckCircle2 className="w-4 h-4 text-bronze-400 shrink-0 mt-0.5" />
                  <span className="text-xs font-medium text-bronze-100 leading-relaxed font-mono">
                    {row.unfiltered}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Banner */}
          <div className="bg-dark-850 p-6 border-t border-dark-750 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs font-mono text-titanium-300">
              <span className="text-bronze-400 font-bold">READY TO STOP WASTING MONTHS?</span> Direct kickoff within 72 hours.
            </div>
            <a
              href="#contact"
              className="px-5 py-2.5 rounded-xl bg-bronze-500 hover:bg-bronze-400 text-dark-950 font-bold text-xs uppercase tracking-wider transition-all shadow-bronze-sm"
            >
              Start Direct Kickoff
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
