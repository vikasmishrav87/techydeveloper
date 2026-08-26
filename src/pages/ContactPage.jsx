import React from 'react';
import { Link } from 'react-router-dom';
import ContactWizard from '../components/ContactWizard';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { ArrowLeft } from 'lucide-react';

export default function ContactPage() {
  useScrollReveal();

  return (
    <div className="min-h-screen bg-sky-lavender-mesh text-slate-900 pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 reveal-on-scroll">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-sky-700 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>

      <div className="reveal-on-scroll">
        <ContactWizard />
      </div>
    </div>
  );
}
