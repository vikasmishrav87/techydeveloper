import React from 'react';
import { Link } from 'react-router-dom';
import CaseStudies from '../components/CaseStudies';
import { CONTACT_INFO } from '../data/agencyData';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Briefcase, ArrowLeft, MessageCircle } from 'lucide-react';

export default function CaseStudiesPage() {
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
        <CaseStudies />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 text-center reveal-on-scroll bg-white/95 rounded-3xl p-10 border border-indigo-100 shadow-sm">
        <h3 className="text-2xl font-light text-slate-950 mb-3">Enterprise Confidentiality & Custom Architectures</h3>
        <p className="text-base text-slate-600 mb-8 max-w-xl mx-auto">
          These are a curated sample of our public deployments. We maintain strict NDAs for many of our institutional hedge fund, defense, and private LLM clients.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href={CONTACT_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-base transition-all shadow-md shadow-emerald-600/20 hover:scale-105"
          >
            <MessageCircle className="w-5 h-5" /> Inquire via WhatsApp
          </a>
          <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-base transition-all shadow-sm hover:scale-105">
            <Briefcase className="w-5 h-5" /> Start Your Custom Project
          </Link>
        </div>
      </div>
    </div>
  );
}
