import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SERVICE_PILLARS, CONTACT_INFO, WORK_MODEL_ECOSYSTEM } from '../data/agencyData';
import WorkModelEcosystem from '../components/WorkModelEcosystem';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { ArrowRight, CheckCircle2, Shield, Layers, Brain, Cpu, Globe2, Sparkles, MessageCircle, ArrowLeft, Database, Cloud, Code2, Rocket, Users, Bot } from 'lucide-react';

export default function ServicesPage() {
  useScrollReveal();
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All', 'AI Agents & Workflow Automation', 'AI & Machine Learning', 'SaaS & Cloud Platforms', 'Security & Defense', 'Full-Stack Web Engineering', 'Data & Analytics', 'Blockchain & Cryptography', 'Enterprise Software', 'Growth & Marketing'];

  const getServiceIcon = (id) => {
    switch (id) {
      case 'saas-products':
        return <Rocket className="w-6 h-6 text-sky-600" />;
      case 'cyber-security':
        return <Shield className="w-6 h-6 text-sky-600" />;
      case 'fullstack-web-dev':
        return <Code2 className="w-6 h-6 text-indigo-600" />;
      case 'data-engineering-models':
        return <Database className="w-6 h-6 text-sky-600" />;
      case 'blockchain-web3':
        return <Layers className="w-6 h-6 text-indigo-600" />;
      case 'ai-cognitive':
        return <Brain className="w-6 h-6 text-purple-600" />;
      case 'ai-agents-workflow':
        return <Bot className="w-6 h-6 text-indigo-600" />;
      case 'software-services':
        return <Cloud className="w-6 h-6 text-indigo-600" />;
      case 'digital-marketing-360':
        return <Globe2 className="w-6 h-6 text-emerald-600" />;
      default:
        return <Sparkles className="w-6 h-6 text-sky-600" />;
    }
  };

  const filteredServices = activeFilter === 'All'
    ? SERVICE_PILLARS
    : SERVICE_PILLARS.filter(s => s.category === activeFilter);

  return (
    <div className="min-h-screen bg-sky-lavender-mesh text-slate-900 pt-28 pb-24">
      
      {/* Top Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal-on-scroll mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-sky-200 text-sky-800 text-xs font-mono uppercase tracking-widest mb-4 shadow-xs">
          1,000+ Senior Engineers • 9 Specialized Practices
        </div>
        <h1 className="text-4xl sm:text-6xl font-light tracking-tight text-slate-950 mb-6">
          Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600 font-normal">Technology & IT Solutions</span> Practices
        </h1>
        <p className="text-slate-700 max-w-3xl mx-auto text-lg font-normal leading-relaxed">
          From SaaS product architectures and military cyber defense to autonomous AI agents, big data pipelines, blockchain protocols, and 360° tech solutions — we are a global technology company deploying specialized squads of vetted senior engineers for every mission.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 reveal-on-scroll">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={"px-4 py-2 rounded-xl text-xs font-semibold transition-all " + (
                activeFilter === cat
                  ? "bg-slate-950 text-white shadow-sm"
                  : "bg-white/90 hover:bg-white text-slate-700 border border-slate-200"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Cards List */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {filteredServices.map((pillar) => (
          <div 
            key={pillar.id} 
            className="animate-fadeIn bg-white/90 backdrop-blur-md rounded-3xl p-8 sm:p-10 border border-indigo-100 hover:border-sky-300 transition-all shadow-sm hover:shadow-md flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between"
          >
            {/* Left Content */}
            <div className="flex-1 w-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200">
                  {getServiceIcon(pillar.id)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 text-xs font-mono rounded-full bg-slate-100 border border-slate-200 text-slate-700">
                      {pillar.badge}
                    </span>
                    <span className="text-xs font-mono uppercase text-indigo-700 font-bold">
                      {pillar.category}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-slate-500 mt-1">👥 {pillar.squadName} • <strong className="text-slate-700">{pillar.squadHeadcount}</strong></div>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 mb-3">{pillar.title}</h2>
              <p className="text-slate-600 mb-6 font-normal leading-relaxed">{pillar.tagline}</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 py-4 border-t border-b border-slate-100">
                {pillar.keyStats.map((stat, idx) => (
                  <div key={idx}>
                    <div className="text-xl font-bold font-mono text-slate-900">{stat.value}</div>
                    <div className="text-xs text-slate-500 uppercase">{stat.label}</div>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <Link 
                  to={`/services/${pillar.id}`} 
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-sm transition-all shadow-xs"
                >
                  View Full Details <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={`https://wa.me/919137507092?text=Hi%20Vikas,%20I%20want%20to%20know%20in%20details%20about%20the%20${encodeURIComponent(pillar.title)}%20practice.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 text-sm font-medium transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Know Details on WhatsApp</span>
                </a>
              </div>
            </div>
            
            {/* Right Capabilities Box */}
            <div className="w-full lg:w-96 rounded-2xl bg-slate-50 border border-slate-200 p-6 flex-shrink-0">
              <h3 className="text-xs font-mono text-slate-500 mb-4 uppercase tracking-wider font-semibold">Core Capabilities</h3>
              <ul className="space-y-3">
                {pillar.capabilities.slice(0, 4).map((cap, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Engineering Ecosystem Section */}
      <div className="mt-28">
        <WorkModelEcosystem />
      </div>
      
      {/* Bottom Consultation CTA */}
      <div className="text-center mt-24 reveal-on-scroll max-w-4xl mx-auto px-4">
        <div className="bg-white/95 rounded-3xl p-10 border border-indigo-100 shadow-sm">
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-950 mb-3">
            Deploy with Our 1,000+ Senior Engineer Collective
          </h3>
          <p className="text-slate-600 max-w-xl mx-auto mb-8 text-sm leading-relaxed">
            Speak directly with Vikas Mishra & senior solutions architects. We assemble hand-picked squads for your exact technical specifications within 48 hours.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={CONTACT_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-base transition-all shadow-md shadow-emerald-600/20 hover:scale-105"
            >
              <MessageCircle className="w-5 h-5" /> Chat Directly on WhatsApp
            </a>
            <Link 
              to="/contact" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-medium text-base transition-all shadow-sm hover:scale-105"
            >
              <span>Schedule Architecture Blueprint Call</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
