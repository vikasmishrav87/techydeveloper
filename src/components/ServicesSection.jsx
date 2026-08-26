import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SERVICE_PILLARS, CONTACT_INFO } from '../data/agencyData';
import { Shield, Cpu, Brain, Layers, Globe2, ArrowRight, CheckCircle2, MessageCircle, Send, Users, Terminal, Sparkles, Database, Cloud, Code2, Rocket, Bot } from 'lucide-react';

export default function ServicesSection() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'AI Agents', 'AI/ML', 'SaaS', 'Security', 'Web', 'Data', 'Web3', 'Enterprise', 'Growth'];

  const getServiceIcon = (id) => {
    switch (id) {
      case 'saas-products':
        return <Rocket className="w-5 h-5 text-sky-600" />;
      case 'cyber-security':
        return <Shield className="w-5 h-5 text-sky-600" />;
      case 'fullstack-web-dev':
        return <Code2 className="w-5 h-5 text-indigo-600" />;
      case 'data-engineering-models':
        return <Database className="w-5 h-5 text-sky-600" />;
      case 'blockchain-web3':
        return <Layers className="w-5 h-5 text-indigo-600" />;
      case 'ai-cognitive':
        return <Brain className="w-5 h-5 text-purple-600" />;
      case 'ai-agents-workflow':
        return <Bot className="w-5 h-5 text-indigo-600" />;
      case 'software-services':
        return <Cloud className="w-5 h-5 text-indigo-600" />;
      case 'digital-marketing-360':
        return <Globe2 className="w-5 h-5 text-emerald-600" />;
      default:
        return <Sparkles className="w-5 h-5 text-sky-600" />;
    }
  };

  const filteredServices = selectedCategory === 'All' 
    ? SERVICE_PILLARS 
    : SERVICE_PILLARS.filter(s => {
        if (selectedCategory === 'AI Agents') return s.id === 'ai-agents-workflow';
        if (selectedCategory === 'AI/ML') return s.id === 'ai-cognitive';
        if (selectedCategory === 'SaaS') return s.id === 'saas-products';
        if (selectedCategory === 'Security') return s.id === 'cyber-security';
        if (selectedCategory === 'Web') return s.id === 'fullstack-web-dev';
        if (selectedCategory === 'Data') return s.id === 'data-engineering-models';
        if (selectedCategory === 'Web3') return s.id === 'blockchain-web3';
        if (selectedCategory === 'Enterprise') return s.id === 'software-services';
        if (selectedCategory === 'Growth') return s.id === 'digital-marketing-360';
        return true;
      });

  const getWhatsAppForService = (service) => {
    const text = encodeURIComponent("Hi Vikas, I want to discuss engaging The Unfiltered Engineer's specialized " + service.title + " team.");
    return "https://wa.me/919137507092?text=" + text;
  };

  return (
    <section id="services" className="relative py-28 bg-[#EEF2FF] text-slate-900 overflow-hidden">
      
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-light-grid opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 reveal-on-scroll">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-sky-200 text-sky-800 text-xs font-mono uppercase tracking-widest mb-4 shadow-xs">
            <Users className="w-3.5 h-3.5 text-sky-600" />
            1,000+ Senior Engineers • 9 Specialized Practices
          </div>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-slate-950 mb-6">
            Enterprise Technology & <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 font-normal">IT Solutions</span> Practices
          </h2>
          <p className="text-slate-700 text-base sm:text-lg font-normal leading-relaxed">
            We deliver full-lifecycle enterprise technology and IT solutions across all modern technological pillars. Every practice is staffed by dedicated senior specialists with proven track records.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-14 reveal-on-scroll">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={"px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer " + (
                selectedCategory === cat
                  ? "bg-slate-950 text-white shadow-sm scale-105"
                  : "bg-white/80 hover:bg-white text-slate-700 border border-slate-200"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 9 Service Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          {filteredServices.map((service) => {
            return (
              <div
                key={service.id}
                className="group rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 relative overflow-hidden bg-white/90 border border-indigo-100 hover:border-sky-300 hover:shadow-lg hover:shadow-sky-100/60 animate-fadeIn"
              >
                {/* Visual Image Preview */}
                <div className="relative w-full h-40 rounded-2xl overflow-hidden mb-5 bg-slate-900 border border-slate-200 shadow-sm">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/assets/ai-neural-mesh.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  
                  {/* Badge Pill */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-950/85 border border-slate-700 text-sky-300 text-[10px] font-mono backdrop-blur-md">
                      {service.badge}
                    </span>
                  </div>
                </div>

                {/* Content Block */}
                <div className="flex-1">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="p-2 rounded-xl bg-sky-50 border border-sky-200 flex-shrink-0">
                      {getServiceIcon(service.id)}
                    </div>
                    <div className="text-[10px] font-mono uppercase text-indigo-700 font-bold tracking-wider truncate">
                      {service.category}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-950 group-hover:text-sky-700 transition-colors mb-2 leading-snug">
                    {service.title}
                  </h3>

                  <p className="text-slate-600 text-xs font-normal leading-relaxed mb-4 line-clamp-3">
                    {service.tagline}
                  </p>

                  {/* Key Stats Bar */}
                  <div className="grid grid-cols-2 gap-2 py-2.5 border-t border-b border-slate-100 mb-4">
                    {service.keyStats.slice(0, 2).map((stat, sIdx) => (
                      <div key={sIdx}>
                        <div className="text-base font-bold text-slate-900 font-mono">{stat.value}</div>
                        <div className="text-[10px] text-slate-500 uppercase">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions — Direct Link to Dedicated Page */}
                <div className="pt-2 flex items-center gap-2">
                  <Link
                    to={"/services/" + service.id}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-all shadow-xs"
                  >
                    <span>View Full Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <a
                    href={getWhatsAppForService(service)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-all shadow-xs"
                    title="Direct WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>

              </div>
            );
          })}

        </div>

        {/* View All Services CTA */}
        <div className="text-center mt-16 reveal-on-scroll">
          <Link
            to="/services"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 border border-sky-300 hover:border-sky-500 text-base font-semibold transition-all shadow-sm"
          >
            <span>Explore All 8 Practice Squads in Depth</span>
            <ArrowRight className="w-5 h-5 text-sky-600" />
          </Link>
        </div>

      </div>

    </section>
  );
}
