import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { SERVICE_PILLARS, CONTACT_INFO, WORK_MODEL_ECOSYSTEM } from '../data/agencyData';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { ArrowLeft, CheckCircle2, MessageCircle, Send, Shield, Layers, Brain, Cpu, Globe2, Sparkles, Terminal, Award, Clock, Database, Cloud, Code2, Rocket, Users, Bot } from 'lucide-react';

export default function ServiceDetailPage() {
  useScrollReveal();
  const { serviceId } = useParams();
  const service = SERVICE_PILLARS.find((p) => p.id === serviceId);

  if (!service) {
    return (
      <div className="min-h-screen bg-sky-lavender-mesh text-slate-900 flex items-center justify-center pt-28 px-4">
        <div className="text-center bg-white p-10 rounded-3xl border border-slate-200 shadow-md max-w-md">
          <h1 className="text-3xl font-bold text-slate-950 mb-3">Service Not Found</h1>
          <p className="text-slate-600 mb-6">The practice you are looking for does not exist or has been relocated.</p>
          <Link to="/services" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-sm transition-all shadow-xs">
            <ArrowLeft className="w-4 h-4" /> Back to All Services
          </Link>
        </div>
      </div>
    );
  }

  const getWhatsAppForService = () => {
    const text = encodeURIComponent(`Hi Vikas, I am interested in knowing in details about The Unfiltered Engineer's specialized "${service.title}" practice. Please share scope specifications and squad details.`);
    return `https://wa.me/919137507092?text=${text}`;
  };

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

  return (
    <div className="min-h-screen bg-sky-lavender-mesh text-slate-900 pt-28 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Back Link */}
        <div className="mb-8 reveal-on-scroll">
          <Link to="/services" className="inline-flex items-center gap-2 text-slate-600 hover:text-sky-700 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to All 8 Practices
          </Link>
        </div>

        {/* Hero Header */}
        <div className="reveal-on-scroll mb-14 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="px-3.5 py-1 rounded-full bg-white border border-sky-200 text-sky-800 text-xs font-mono uppercase tracking-widest shadow-xs">
              {service.badge}
            </span>
            <span className="px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-mono uppercase tracking-widest shadow-xs">
              {service.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-light tracking-tight text-slate-950 mb-6">
            {service.title}
          </h1>
          <p className="text-lg md:text-xl text-slate-700 max-w-3xl mx-auto font-normal leading-relaxed">
            {service.tagline}
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="reveal-on-scroll grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {service.keyStats.map((stat, idx) => (
            <div key={idx} className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-indigo-100 shadow-xs text-center">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-950 mb-1">{stat.value}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main Content Grid: Capabilities & Squad Structure */}
        <div className="grid md:grid-cols-2 gap-10 mb-14 reveal-on-scroll">
          
          {/* Capabilities */}
          <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl border border-indigo-100 shadow-xs">
            <h3 className="text-xl font-bold text-slate-950 mb-6 pb-3 border-b border-slate-100 flex items-center gap-2">
              <span>Technical Capabilities & Deliverables</span>
            </h3>
            <ul className="space-y-4">
              {service.capabilities.map((cap, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-700 font-normal">
                  <CheckCircle2 className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                  <span className="leading-snug text-sm">{cap}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Squad & Stack Details */}
          <div className="space-y-6">
            
            {/* Squad Structure */}
            <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-indigo-100 shadow-xs">
              <h3 className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-2 font-semibold">Assigned Senior Squad</h3>
              <div className="text-lg font-bold text-slate-950 mb-1">{service.squadName}</div>
              <div className="text-slate-600 text-sm font-normal">{service.squadHeadcount}</div>
              <div className="text-[11px] text-sky-800 font-mono mt-2 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200 inline-block">
                ⚡ Assembled from our 1,000+ Senior Engineer collective within 48h
              </div>
            </div>
            
            {/* Tech Stack */}
            <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-indigo-100 shadow-xs">
              <h3 className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-3 font-semibold">Verified Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {service.techStack.map((tech, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-xs font-mono font-medium">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Standard Deliverables */}
            <div className="bg-sky-50/80 p-6 rounded-3xl border border-sky-200 shadow-xs">
              <h3 className="text-xs font-mono text-sky-900 uppercase tracking-wider mb-2 font-bold">Standard Phase Deliverables</h3>
              <p className="text-slate-700 text-sm leading-relaxed">{service.deliverables}</p>
            </div>

          </div>
        </div>

        {/* Action Bar (WhatsApp & Contact Booking) */}
        <div className="bg-white/95 rounded-3xl p-8 sm:p-10 border border-indigo-100 shadow-sm text-center reveal-on-scroll">
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-950 mb-3">
            Deploy this specialized {service.title} squad
          </h3>
          <p className="text-slate-600 max-w-xl mx-auto mb-8 text-sm leading-relaxed">
            Connect directly with Vikas Mishra & the dedicated senior squad lead on WhatsApp for instant scope breakdown, architecture blueprinting, and timeline milestones.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={getWhatsAppForService()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-base transition-all shadow-md shadow-emerald-600/20 hover:scale-[1.02]"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Know in Details on WhatsApp ({CONTACT_INFO.phoneDisplay})</span>
            </a>

            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-medium text-base transition-all shadow-sm hover:scale-[1.02]"
            >
              <span>Book Architecture Call</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
