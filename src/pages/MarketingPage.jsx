import React from 'react';
import { Link } from 'react-router-dom';
import DigitalMarketingSection from '../components/DigitalMarketingSection';
import LiveSEOAuditor from '../components/LiveSEOAuditor';
import { MARKETING_CHANNELS, CONTACT_INFO } from '../data/agencyData';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { CheckCircle2, TrendingUp, ArrowRight, MessageCircle, Megaphone, ArrowLeft } from 'lucide-react';

export default function MarketingPage() {
  useScrollReveal();

  return (
    <div className="min-h-screen bg-sky-lavender-mesh text-slate-900 pt-28 pb-24">
      
      {/* Back to Home link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 reveal-on-scroll">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-sky-700 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>

      <div className="reveal-on-scroll">
        <DigitalMarketingSection />
      </div>

      {/* Free Live SEO & Speed Audit Tool */}
      <div className="reveal-on-scroll mt-16">
        <LiveSEOAuditor />
      </div>

      <div id="growth-channels" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 scroll-mt-28">
        <div className="text-center mb-16 reveal-on-scroll">
          <h2 className="text-3xl md:text-5xl font-light text-slate-950 mb-6">
            Detailed <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600 font-normal">Omnichannel Channel</span> Specs
          </h2>
          <p className="text-lg text-slate-700 max-w-2xl mx-auto font-normal leading-relaxed">
            Every campaign is built with first-party data capture, custom tracking servers, and algorithmic budget management.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {MARKETING_CHANNELS.map((channel, idx) => (
            <div key={idx} className="bg-white/90 backdrop-blur-md border border-indigo-100 rounded-3xl p-8 reveal-on-scroll shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-semibold text-slate-950">{channel.name}</h3>
                <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-mono font-semibold">
                  {channel.roasBenchmark}
                </span>
              </div>
              <p className="text-slate-600 mb-6 min-h-[44px] leading-relaxed">{channel.summary}</p>
              
              <ul className="space-y-3">
                {channel.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-3 text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <a
                  href={`https://wa.me/919137507092?text=Hi%20Vikas,%20I%20want%20to%20discuss%20the%20${encodeURIComponent(channel.name)}%20growth%20strategy.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Discuss this channel directly on WhatsApp →</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center reveal-on-scroll bg-white/95 rounded-3xl p-10 border border-indigo-100 shadow-sm">
          <h3 className="text-2xl font-light text-slate-950 mb-3">Ready to scale your brand's growth?</h3>
          <p className="text-slate-600 max-w-xl mx-auto mb-8 text-sm">
            Book a complimentary growth audit where we inspect your current ad accounts, tracking architecture, and organic keyword positions.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={CONTACT_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-base transition-all shadow-md shadow-emerald-600/20 hover:scale-105"
            >
              <MessageCircle className="w-5 h-5" /> Chat on WhatsApp (+91 91375 07092)
            </a>
            <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-medium text-base transition-all shadow-sm hover:scale-105">
              <span>Book SEO & Growth Call</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
