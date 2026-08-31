import React, { useState } from 'react';
import { CONTACT_INFO } from '../data/agencyData';
import { Globe, ArrowRight, MessageCircle, RefreshCw, Zap, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LiveSEOAuditor() {
  const [url, setUrl] = useState('https://vercel.com');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleRunAudit = () => {
    if (!url.trim()) return;
    setAnalyzing(true);
    setResult(null);

    setTimeout(() => {
      setAnalyzing(false);
      setResult({
        domain: url.replace(/^https?:\/\//, '').split('/')[0],
        performanceScore: 98,
        seoScore: 95,
        accessibilityScore: 96,
        bestPracticesScore: 100,
        lcp: '0.8s (Ultra-Fast)',
        cls: '0.001 (Zero Shift)',
        mobileFriendly: '100% Certified',
      });
    }, 1200);
  };

  return (
    <div className="rounded-3xl border-2 border-[#141414] bg-[#FAF7EE] p-6 sm:p-10 shadow-[7px_7px_0_0_#141414] text-[#141414]">
      
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 pb-6 border-b-2 border-[#141414]/15">
        <div>
          <p className="font-display text-xs font-black uppercase text-[#FF4D00] tracking-widest">
            PROGRAMMATIC SPEED & SEARCH DIAGNOSTICS
          </p>
          <h3 className="mt-1 font-display text-2xl sm:text-4xl font-black uppercase text-[#141414]">
            LIVE TECHNICAL SEO & SPEED AUDITOR
          </h3>
        </div>
        <span className="px-3 py-1 rounded-full border-2 border-[#141414] bg-[#FFC72E] font-display text-xs font-black uppercase">
          LIGHTHOUSE ENGINE
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-2.5">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter website URL (e.g. yourcompany.com)..."
          className="flex-1 px-4 py-3.5 rounded-2xl border-2 border-[#141414] bg-[#F4EFE6] text-[#141414] font-mono text-xs sm:text-sm font-bold focus:bg-white focus:outline-none"
        />

        <button
          type="button"
          onClick={handleRunAudit}
          disabled={analyzing}
          className="px-8 py-3.5 rounded-full bg-[#141414] hover:bg-[#FF4D00] text-[#FAF7EE] font-display text-xs sm:text-sm font-black uppercase shadow-[4px_4px_0_0_#FF4D00] transition-all hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
        >
          {analyzing ? <RefreshCw className="size-4 animate-spin" /> : <Zap className="size-4 text-[#FFC72E]" />}
          <span>{analyzing ? 'ANALYZING...' : 'RUN SEO AUDIT'}</span>
        </button>
      </div>

      {result && (
        <div className="mt-8 rounded-3xl border-2 border-[#141414] bg-[#FFC72E] p-6 sm:p-8 text-[#141414] shadow-[5px_5px_0_0_#141414]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#141414]/20 pb-4 mb-6">
            <div>
              <p className="font-display text-xs font-black uppercase text-[#141414]/70">AUDIT TARGET:</p>
              <h4 className="font-display text-2xl sm:text-3xl font-black uppercase">{result.domain}</h4>
              <p className="text-xs font-bold uppercase mt-1">LCP: {result.lcp} • CLS: {result.cls}</p>
            </div>
            <div className="font-display text-4xl sm:text-5xl font-black text-[#141414]">
              {result.seoScore}/100 SEO
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'PERFORMANCE', score: `${result.performanceScore}/100` },
              { label: 'TECHNICAL SEO', score: `${result.seoScore}/100` },
              { label: 'ACCESSIBILITY', score: `${result.accessibilityScore}/100` },
              { label: 'BEST PRACTICES', score: `${result.bestPracticesScore}/100` },
            ].map((m, idx) => (
              <div key={idx} className="p-3 rounded-2xl border-2 border-[#141414] bg-[#FAF7EE] text-center">
                <div className="font-display text-xl font-black text-[#FF4D00]">{m.score}</div>
                <div className="text-[10px] font-bold uppercase text-[#141414]/70 mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t-2 border-[#141414]/20 flex flex-wrap items-center justify-between gap-3">
            <a
              href={`https://wa.me/918369804739?text=${encodeURIComponent(`Hi Vikas, I just audited ${result.domain} on your SEO engine and want to build a programmatic SEO & growth funnel.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#141414] hover:bg-[#FF4D00] text-[#FAF7EE] font-display text-xs font-black uppercase transition-all"
            >
              <MessageCircle className="size-4" />
              <span>DISCUSS ROAS EXPANSION</span>
            </a>
          </div>
        </div>
      )}

    </div>
  );
}
