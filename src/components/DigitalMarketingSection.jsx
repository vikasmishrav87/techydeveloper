import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MARKETING_CHANNELS, CONTACT_INFO } from '../data/agencyData';
import { Megaphone, Target, Search, Compass, TrendingUp, DollarSign, BarChart3, CheckCircle2, MessageCircle, Send, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export default function DigitalMarketingSection() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedChannel, setSelectedChannel] = useState(MARKETING_CHANNELS[0]);
  
  // Interactive ROAS Calculator State
  const [adSpend, setAdSpend] = useState(15000);
  const [targetRoas, setTargetRoas] = useState(4.6);
  const [avgTicket, setAvgTicket] = useState(350);

  const projectedRevenue = Math.round(adSpend * targetRoas);
  const estimatedConversions = Math.round(projectedRevenue / avgTicket);
  const estimatedProfit = Math.round(projectedRevenue - adSpend - (projectedRevenue * 0.35));

  const getCustomWhatsAppLink = () => {
    const text = encodeURIComponent("Hi Vikas, I used the ROAS Calculator on The Unfiltered Engineer. My target monthly budget is $" + adSpend.toLocaleString() + " aiming for " + targetRoas + "x ROAS ($" + projectedRevenue.toLocaleString() + " projected revenue). Let's scale our campaigns.");
    return "https://wa.me/919137507092?text=" + text;
  };

  return (
    <section id="marketing" className="relative py-28 bg-[#EEF2FF] text-slate-900 overflow-hidden border-t border-b border-indigo-100/90">
      
      {/* Background Decorative Waves Watermark & Light Grids */}
      <div className="absolute inset-0 bg-light-grid opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 reveal-on-scroll">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-sky-200 text-sky-800 text-xs font-mono uppercase tracking-widest mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            360° Omnichannel Growth Engine
          </div>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-slate-950 mb-6">
            We Run <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 font-normal">All Types of Marketing</span> for Scaling Brands
          </h2>
          <p className="text-slate-700 text-base sm:text-lg font-normal leading-relaxed">
            Engineering-grade marketing execution. From server-side Meta CAPI algorithms and Google PMax smart bidding to programmatic SEO dominance and high-impact offline billboards — our specialized growth squad manages the entire lifecycle.
          </p>
        </div>

        {/* Marketing Pillars Grid & Deep Dive */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-start">
          
          {/* Left Column: Channel Selector Tabs */}
          <div className="lg:col-span-5 space-y-3 reveal-on-scroll">
            <h3 className="text-xs font-mono uppercase text-slate-500 tracking-wider mb-2 font-semibold">Select Growth Channel</h3>
            
            {MARKETING_CHANNELS.map((channel) => {
              const isSelected = selectedChannel.id === channel.id;
              return (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel)}
                  className={"w-full text-left p-5 rounded-2xl transition-all duration-300 border flex items-start gap-4 " + (
                    isSelected
                      ? "bg-slate-950 text-white border-slate-950 shadow-md translate-x-1"
                      : "bg-white/90 hover:bg-white text-slate-800 border-indigo-100 hover:border-sky-300 shadow-xs"
                  )}
                >
                  <div className={"p-3 rounded-xl " + (
                    isSelected ? "bg-sky-500 text-black" : "bg-sky-50 text-sky-700 border border-sky-100"
                  )}>
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-semibold tracking-tight">{channel.name}</h4>
                      <span className={"text-xs font-mono px-2 py-0.5 rounded-full " + (
                        isSelected ? "bg-slate-800 text-sky-300" : "bg-slate-100 text-slate-700 border border-slate-200"
                      )}>
                        {channel.roasBenchmark}
                      </span>
                    </div>
                    <p className={"text-xs mt-1.5 font-normal line-clamp-2 " + (
                      isSelected ? "text-slate-300" : "text-slate-600"
                    )}>
                      {channel.summary}
                    </p>
                  </div>
                </button>
              );
            })}

            {/* Specialized Team Badge */}
            <div className="p-4 rounded-2xl bg-white/90 border border-sky-200 text-slate-700 mt-4 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-mono text-sky-800 mb-1 font-semibold">
                <ShieldCheck className="w-4 h-4 text-sky-600" />
                Specialized Growth Squad
              </div>
              <p className="text-xs text-slate-600 font-normal leading-relaxed">
                6 Senior Media Buyers, Creative Animators, and Technical SEO Engineers dedicated exclusively to your campaigns.
              </p>
            </div>

          </div>

          {/* Right Column: Active Channel In-Depth Breakdown */}
          <div className="lg:col-span-7 reveal-on-scroll">
            <div className="bg-white/95 border border-indigo-100 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div>
                  <span className="text-xs font-mono text-sky-700 uppercase tracking-wider font-semibold">Specialized Execution</span>
                  <h3 className="text-2xl font-medium text-slate-950 mt-1">{selectedChannel.name}</h3>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-right shadow-xs">
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Benchmark ROAS</div>
                  <div className="text-base font-bold font-mono text-sky-700">{selectedChannel.roasBenchmark}</div>
                </div>
              </div>

              <div className="py-6">
                <h4 className="text-xs font-mono uppercase text-slate-500 tracking-wider mb-4 font-semibold">Technical Growth Capabilities</h4>
                <ul className="space-y-3.5">
                  {selectedChannel.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 font-normal">
                      <CheckCircle2 className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <a
                  href={getCustomWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Discuss {selectedChannel.name.split(' ')[0]} Growth</span>
                </a>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (location.pathname === '/marketing') {
                      const el = document.getElementById('growth-channels');
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    } else {
                      navigate('/marketing');
                      setTimeout(() => {
                        const el = document.getElementById('growth-channels');
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }, 200);
                    }
                  }}
                  className="text-xs font-semibold text-sky-700 hover:text-sky-800 flex items-center gap-1.5 cursor-pointer hover:underline"
                >
                  <span>Explore All Growth Channels</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Interactive ROAS Calculator Card */}
        <div className="bg-white/95 border border-indigo-100 rounded-3xl p-8 sm:p-10 shadow-sm reveal-on-scroll">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono mb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              Interactive Return On Ad Spend Simulator
            </div>
            <h3 className="text-2xl sm:text-3xl font-light text-slate-950">
              Calculate Your <span className="text-emerald-700 font-medium">Growth Potential</span>
            </h3>
            <p className="text-slate-600 text-sm mt-2">
              Adjust monthly ad spend and target ROAS to forecast revenue and customer volume.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            
            {/* Slider 1: Monthly Ad Spend */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-mono text-slate-600 font-semibold">Monthly Ad Spend</span>
                <span className="text-lg font-bold font-mono text-slate-950">${adSpend.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="3000"
                max="100000"
                step="1000"
                value={adSpend}
                onChange={(e) => setAdSpend(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-2">
                <span>$3,000</span>
                <span>$50,000</span>
                <span>$100,000+</span>
              </div>
            </div>

            {/* Slider 2: Target ROAS */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-mono text-slate-600 font-semibold">Target ROAS Multiplier</span>
                <span className="text-lg font-bold font-mono text-emerald-700">{targetRoas}x</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="8.0"
                step="0.1"
                value={targetRoas}
                onChange={(e) => setTargetRoas(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-2">
                <span>2.0x (Standard)</span>
                <span>4.6x (Our Avg)</span>
                <span>8.0x (Hyper)</span>
              </div>
            </div>

            {/* Output Metric Box */}
            <div className="bg-gradient-to-br from-slate-950 to-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md text-center">
              <div className="text-xs font-mono text-sky-400 uppercase tracking-wider mb-1">Projected Monthly Revenue</div>
              <div className="text-3xl font-bold font-mono text-white mb-2">
                ${projectedRevenue.toLocaleString()}
              </div>
              <div className="text-xs text-slate-400 font-light mb-4">
                Est. {estimatedConversions.toLocaleString()} customers • ~${estimatedProfit.toLocaleString()} gross profit
              </div>
              <a
                href={getCustomWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all shadow-sm"
              >
                <MessageCircle className="w-4 h-4 text-black" />
                <span>Lock in Strategy on WhatsApp</span>
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
