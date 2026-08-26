import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import WorldwideGlobe from '../components/WorldwideGlobe';
import { GLOBAL_HUBS, CONTACT_INFO } from '../data/agencyData';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Radio, Activity, Globe2, ArrowLeft, MessageCircle, ArrowRight, Server, Zap, Shield, Cpu } from 'lucide-react';

export default function WorldwidePage() {
  useScrollReveal();
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedHub, setSelectedHub] = useState(null);

  const regionMap = {
    'San Francisco, USA': 'Americas',
    'New York, USA': 'Americas',
    'London, UK': 'Europe',
    'Zurich, Switzerland': 'Europe',
    'Dubai, UAE': 'Middle East',
    'Mumbai, India': 'APAC',
    'Singapore': 'APAC',
    'Tokyo, Japan': 'APAC',
    'Sydney, Australia': 'APAC'
  };

  const filteredHubs = selectedRegion === 'All'
    ? GLOBAL_HUBS
    : GLOBAL_HUBS.filter(h => regionMap[h.name] === selectedRegion);

  const getWhatsAppForHub = (hub) => {
    const text = encodeURIComponent(`Hi Vikas, I am reviewing the ${hub.name} Regional Node (${hub.role}) on The Unfiltered Engineer platform and would like to deploy a specialized squad for our project.`);
    return `https://wa.me/919137507092?text=${text}`;
  };

  return (
    <div className="min-h-screen bg-sky-lavender-mesh text-slate-900 pt-28 pb-24 font-sans">
      
      {/* Back to Home link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 reveal-on-scroll">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-sky-700 font-medium transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>

      {/* 3D Rotating Globe Section */}
      <div className="reveal-on-scroll">
        <WorldwideGlobe />
      </div>

      {/* Full Global Node Directory */}
      <div id="nodes-directory" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 scroll-mt-24">
        
        <div className="text-center mb-14 reveal-on-scroll">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-sky-200 text-sky-800 text-xs font-mono uppercase tracking-widest mb-4 shadow-xs">
            <Globe2 className="w-3.5 h-3.5 text-sky-600" />
            9 Synchronized Regional PoPs & NOCs
          </div>
          <h2 className="text-3xl md:text-5xl font-light text-slate-950 mb-6">
            Global Node Directory & <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600 font-normal">Active Delivery Hubs</span>
          </h2>
          <p className="text-lg text-slate-700 max-w-2xl mx-auto font-normal leading-relaxed">
            Our 1,000+ senior engineering squad operates across a decentralized network of active hubs, ensuring sub-50ms latency, zero single points of failure, and 24/7 Follow-the-Sun delivery.
          </p>
        </div>

        {/* Region Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 reveal-on-scroll">
          {['All', 'Americas', 'Europe', 'Middle East', 'APAC'].map((reg) => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`px-5 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all ${
                selectedRegion === reg
                  ? 'bg-slate-950 text-white shadow-md'
                  : 'bg-white/80 text-slate-700 hover:bg-white border border-slate-200'
              }`}
            >
              {reg === 'All' ? 'All 9 Global Hubs' : `${reg} PoPs`}
            </button>
          ))}
        </div>

        {/* 9 Global Nodes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {filteredHubs.map((hub, idx) => (
            <div 
              key={idx} 
              className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-indigo-100 hover:border-sky-300 transition-all animate-fadeIn shadow-xs hover:shadow-md flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                      {regionMap[hub.name] || 'Global PoP'}
                    </span>
                    <h3 className="text-xl font-bold text-slate-950 mt-0.5">{hub.name}</h3>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold border ${
                    hub.status === 'Primary NOC' 
                      ? 'bg-purple-50 text-purple-800 border-purple-200' 
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${hub.status === 'Primary NOC' ? 'bg-purple-500' : 'bg-emerald-500'} animate-ping`} />
                    {hub.status}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-sky-50/50 border border-sky-100 mb-5">
                  <span className="text-xs font-mono text-sky-700 block font-semibold">Specialized Practice:</span>
                  <p className="text-slate-800 font-medium text-sm mt-0.5">{hub.role}</p>
                </div>

                <div className="flex items-center justify-between py-3 border-t border-b border-slate-100 text-xs font-mono mb-6">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Activity className="w-4 h-4 text-indigo-600" />
                    <span className="font-bold text-slate-900">{hub.ping} Edge Latency</span>
                  </div>
                  <div className="text-slate-600">
                    <strong className="text-slate-900">{hub.clients}</strong> Active Squads
                  </div>
                </div>
              </div>

              {/* Direct Regional WhatsApp Button */}
              <a
                href={getWhatsAppForHub(hub)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 border border-slate-200 hover:border-emerald-200 text-xs font-semibold font-mono transition-all group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Deploy {hub.name.split(',')[0]} Squad →</span>
              </a>

            </div>
          ))}
        </div>

        {/* Global Network Deployment CTA */}
        <div className="text-center reveal-on-scroll bg-white/95 rounded-3xl p-10 border border-indigo-100 shadow-sm">
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-950 mb-3">Deploy across our global engineering network</h3>
          <p className="text-slate-600 max-w-xl mx-auto mb-8 text-sm leading-relaxed">
            Whether you need low-latency protocol relays in Tokyo, AI vector pipelines in San Francisco, ZK cryptography in Zurich, or 24/7 NOC oversight from Mumbai, our senior squads deploy in 48 hours.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={CONTACT_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-base transition-all shadow-md shadow-emerald-600/20 hover:scale-105"
            >
              <MessageCircle className="w-5 h-5" /> Connect on WhatsApp (+91 91375 07092)
            </a>
            <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-medium text-base transition-all shadow-sm hover:scale-105">
              <Globe2 className="w-5 h-5" /> Deploy with Our Global Team
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
