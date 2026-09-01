import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MARKETING_CHANNELS, CONTACT_INFO } from '../data/agencyData';
import { 
  ArrowUpRight, MessageCircle, ArrowRight, TrendingUp, CheckCircle2, 
  BarChart3, Target, Zap, ShieldCheck, DollarSign, Calculator, Layers, Sparkles 
} from 'lucide-react';

export default function DigitalMarketingSection() {
  const [activeTab, setActiveTab] = useState('all');
  const [monthlySpend, setMonthlySpend] = useState(25000);
  const [targetRoas, setTargetRoas] = useState(4.8);

  const projectedRevenue = Math.round(monthlySpend * targetRoas);
  const projectedNet = Math.round(projectedRevenue - monthlySpend);

  const filteredChannels = activeTab === 'all' 
    ? MARKETING_CHANNELS 
    : MARKETING_CHANNELS.filter(c => {
        if (activeTab === 'paid') return ['meta-ads', 'google-ads', 'linkedin-abm'].includes(c.id);
        if (activeTab === 'organic') return ['technical-seo', 'instagram-tiktok-video'].includes(c.id);
        if (activeTab === 'retention') return ['email-sms-retention', 'influencer-affiliate', 'offline-marketing'].includes(c.id);
        return true;
      });

  return (
    <section id="marketing" className="relative py-16 sm:py-28 bg-[#FAF7EE] text-[#141414] border-b-2 border-[#141414] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFC72E] border-2 border-[#141414] text-[#141414] font-display text-xs font-black uppercase mb-3 shadow-[2px_2px_0_0_#141414]">
              <TrendingUp className="size-3.5 text-[#141414]" />
              <span>360° OMNICHANNEL REVENUE ENGINES</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#141414] leading-[0.98]">
              360° TECH MARKETING & ROAS
            </h2>
          </div>
          <p className="max-w-lg text-sm sm:text-base font-medium text-[#141414]/80 leading-relaxed">
            Engineered conversion funnels, first-party CAPI attribution, programmatic SEO directories, and high-velocity viral content squads built strictly for tech founders, SaaS, and Web3 enterprises.
          </p>
        </div>

        {/* 360° Visual Clock Hub & Architecture Overview */}
        <div className="rounded-3xl border-2 border-[#141414] bg-[#141414] text-[#FAF7EE] p-6 sm:p-10 shadow-[7px_7px_0_0_#FF4D00] mb-14 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Infographic Preview */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="rounded-2xl border-2 border-[#FAF7EE]/20 bg-[#FAF7EE] p-3 sm:p-4 shadow-[5px_5px_0_0_#FFC72E] max-w-sm w-full">
                <img 
                  src="/assets/digital-marketing-360.png" 
                  alt="360° Digital Marketing Ecosystem" 
                  className="w-full h-auto rounded-xl object-contain"
                />
                <div className="mt-3 text-center">
                  <span className="font-display text-[11px] font-black uppercase text-[#141414] tracking-wider">
                    360° FULL-SPECTRUM REVENUE LOOP
                  </span>
                </div>
              </div>
            </div>

            {/* Strategic Pillars */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF4D00] text-[#FAF7EE] text-xs font-display font-black uppercase border border-[#FAF7EE]/20">
                <Sparkles className="size-3.5" />
                <span>UNFILTERED GROWTH FORMULA</span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-[#FAF7EE] leading-tight">
                WE DO NOT BURN AD BUDGET. WE BUILD PREDICTABLE CUSTOMER ACQUISITION ASSETS.
              </h3>
              <p className="text-sm sm:text-base font-medium text-[#FAF7EE]/80 leading-relaxed">
                Most agencies run basic ads and hope for clicks. We engineer first-party server-side data pipelines, programmatic high-intent SEO directories, and algorithmic dynamic creative testing (DCT) that consistently delivers <strong>3.8x to 6.8x blended ROAS</strong>.
              </p>

              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-[#FAF7EE]/10 border border-[#FAF7EE]/20">
                  <div className="font-display text-2xl sm:text-3xl font-black text-[#FFC72E]">$40M+</div>
                  <div className="text-[10px] font-bold uppercase text-[#FAF7EE]/70">Ad Spend Managed</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FAF7EE]/10 border border-[#FAF7EE]/20">
                  <div className="font-display text-2xl sm:text-3xl font-black text-[#25D366]">4.6x</div>
                  <div className="text-[10px] font-bold uppercase text-[#FAF7EE]/70">Blended ROAS</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FAF7EE]/10 border border-[#FAF7EE]/20">
                  <div className="font-display text-2xl sm:text-3xl font-black text-[#FF4D00]">850K+</div>
                  <div className="text-[10px] font-bold uppercase text-[#FAF7EE]/70">Inbound Leads</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FAF7EE]/10 border border-[#FAF7EE]/20">
                  <div className="font-display text-2xl sm:text-3xl font-black text-[#FAF7EE]">14.5K+</div>
                  <div className="text-[10px] font-bold uppercase text-[#FAF7EE]/70">Top 3 Keywords</div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={`https://wa.me/918369804739?text=${encodeURIComponent('Hi Vikas, I want to discuss hiring your 360° Tech Marketing squad for our growth campaigns.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sticker-pill px-6 py-3.5 bg-[#FFC72E] hover:bg-[#FFE600] text-[#141414] text-xs font-display font-black shadow-[3px_3px_0_0_#FF4D00] cursor-pointer"
                >
                  <MessageCircle className="size-4" />
                  <span>BOOK 360° GROWTH AUDIT ON WHATSAPP (+91 8369804739)</span>
                </a>
              </div>

            </div>

          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2.5 mb-8">
          {[
            { id: 'all', label: 'ALL CHANNELS (8)' },
            { id: 'paid', label: 'PAID MEDIA & CAPI' },
            { id: 'organic', label: 'SEO & VIRAL CONTENT' },
            { id: 'retention', label: 'RETENTION, INFLUENCERS & OFFLINE' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`sticker-pill px-4 py-2 text-xs font-display font-black cursor-pointer transition-all ${
                activeTab === tab.id
                  ? 'bg-[#141414] text-[#FAF7EE] shadow-[3px_3px_0_0_#FF4D00]'
                  : 'bg-[#F4EFE6] text-[#141414] hover:bg-[#FFC72E] shadow-[2px_2px_0_0_#141414]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Detailed Marketing Channels List (No cramped boxes) */}
        <div className="space-y-6 mb-16">
          {filteredChannels.map((ch, idx) => (
            <div
              key={ch.id}
              className="rounded-3xl border-2 border-[#141414] bg-[#F4EFE6] p-6 sm:p-8 shadow-[6px_6px_0_0_#141414] transition-all hover:-translate-y-0.5"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Channel Title & Summary */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="sticker-pill px-3 py-1 bg-[#141414] text-[#FAF7EE] text-[11px] font-display font-black">
                      ENGINE 0{idx + 1}
                    </span>
                    <span className="sticker-pill px-3 py-1 bg-[#FFC72E] text-[#141414] text-[11px] font-display font-black">
                      {ch.roasBenchmark || 'HIGH-CONVERSION'}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl font-black uppercase text-[#141414] leading-tight">
                    {ch.name}
                  </h3>

                  <p className="text-xs sm:text-sm font-medium text-[#141414]/80 leading-relaxed">
                    {ch.summary}
                  </p>

                  <div className="pt-2">
                    <a
                      href={`https://wa.me/918369804739?text=${encodeURIComponent(`Hi Vikas, I want to discuss scaling our pipeline with the "${ch.name}" channel.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sticker-pill px-4 py-2.5 bg-[#25D366] text-[#141414] text-xs font-display font-black shadow-[3px_3px_0_0_#141414] cursor-pointer inline-flex items-center gap-2"
                    >
                      <MessageCircle className="size-3.5" />
                      <span>CONSULT ON WHATSAPP</span>
                    </a>
                  </div>
                </div>

                {/* Features & Deliverables Checklist */}
                <div className="lg:col-span-7 bg-[#FAF7EE] rounded-2xl border-2 border-[#141414] p-5 sm:p-6 shadow-[3px_3px_0_0_#141414]">
                  <p className="font-display text-[11px] font-black uppercase text-[#FF4D00] tracking-wider mb-3">
                    DEPLOYED TACTICS & DELIVERABLES
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ch.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm font-bold text-[#141414] leading-snug">
                        <span className="grid size-4 place-items-center rounded-full bg-[#FF4D00] text-[#FAF7EE] text-[9px] flex-shrink-0 mt-0.5 font-black">✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Interactive ROAS & Pipeline Growth Calculator */}
        <div className="rounded-3xl border-2 border-[#141414] bg-[#FFC72E] p-6 sm:p-10 shadow-[7px_7px_0_0_#141414] mb-14">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7EE] border-2 border-[#141414] text-[#141414] text-xs font-display font-black uppercase mb-2 shadow-[2px_2px_0_0_#141414]">
                <Calculator className="size-3.5" />
                <span>DYNAMIC REVENUE ESTIMATOR</span>
              </div>
              <h3 className="font-display text-2xl sm:text-4xl font-black uppercase text-[#141414]">
                ESTIMATE YOUR 360° GROWTH ROI
              </h3>
              <p className="text-xs sm:text-sm font-medium text-[#141414]/80 mt-1 max-w-lg mx-auto">
                Adjust your monthly growth budget and target ROAS multiplier to view projected customer pipeline generation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-[#FAF7EE] rounded-3xl border-2 border-[#141414] p-6 sm:p-8 shadow-[5px_5px_0_0_#141414]">
              
              {/* Sliders */}
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-display text-xs font-black uppercase text-[#141414]">MONTHLY AD SPEND</span>
                    <span className="sticker-pill px-3 py-1 bg-[#141414] text-[#FAF7EE] text-xs font-mono font-bold">
                      ${monthlySpend.toLocaleString()} USD
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="200000"
                    step="5000"
                    value={monthlySpend}
                    onChange={(e) => setMonthlySpend(Number(e.target.value))}
                    className="w-full accent-[#FF4D00] h-2.5 bg-[#F4EFE6] rounded-lg border border-[#141414] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-[#141414]/60 mt-1">
                    <span>$5K</span>
                    <span>$100K</span>
                    <span>$200K+</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-display text-xs font-black uppercase text-[#141414]">TARGET ROAS MULTIPLIER</span>
                    <span className="sticker-pill px-3 py-1 bg-[#FF4D00] text-[#FAF7EE] text-xs font-mono font-bold">
                      {targetRoas}x ROAS
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2.5"
                    max="8.0"
                    step="0.1"
                    value={targetRoas}
                    onChange={(e) => setTargetRoas(Number(e.target.value))}
                    className="w-full accent-[#FF4D00] h-2.5 bg-[#F4EFE6] rounded-lg border border-[#141414] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-[#141414]/60 mt-1">
                    <span>2.5x (Baseline)</span>
                    <span>5.0x (Omnichannel)</span>
                    <span>8.0x (Viral)</span>
                  </div>
                </div>
              </div>

              {/* Projected Results Card */}
              <div className="rounded-2xl border-2 border-[#141414] bg-[#141414] text-[#FAF7EE] p-6 text-center space-y-4 shadow-[4px_4px_0_0_#FF4D00]">
                <div>
                  <div className="text-xs font-bold uppercase text-[#FAF7EE]/70">PROJECTED MONTHLY REVENUE</div>
                  <div className="font-display text-3xl sm:text-4xl font-black text-[#FFC72E] mt-1">
                    ${projectedRevenue.toLocaleString()}
                  </div>
                </div>

                <div className="border-t border-[#FAF7EE]/15 pt-3 flex justify-around">
                  <div>
                    <div className="text-[10px] font-bold uppercase text-[#FAF7EE]/60">NET VALUE GAIN</div>
                    <div className="font-display text-lg font-bold text-[#25D366]">+${projectedNet.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase text-[#FAF7EE]/60">EST. CONVERSIONS</div>
                    <div className="font-display text-lg font-bold text-[#FAF7EE]">
                      {Math.round(projectedRevenue / 180).toLocaleString()}+
                    </div>
                  </div>
                </div>

                <a
                  href={`https://wa.me/918369804739?text=${encodeURIComponent(`Hi Vikas, I ran the 360° Growth Estimator with $${monthlySpend.toLocaleString()} monthly spend targeting ${targetRoas}x ROAS ($${projectedRevenue.toLocaleString()} revenue). Let's build the campaign.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sticker-pill w-full py-3 bg-[#FF4D00] hover:bg-[#FFC72E] hover:text-[#141414] text-[#FAF7EE] text-xs font-display font-black shadow-[3px_3px_0_0_#FFC72E] cursor-pointer flex items-center justify-center gap-2"
                >
                  <MessageCircle className="size-4" />
                  <span>DEPLOY SQUAD FOR THIS TARGET</span>
                </a>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
