import React from 'react';
import Hero from '../components/Hero';
import ServicesSection from '../components/ServicesSection';
import WorkModelEcosystem from '../components/WorkModelEcosystem';
import DigitalMarketingSection from '../components/DigitalMarketingSection';
import LiveSEOAuditor from '../components/LiveSEOAuditor';
import WorldwideGlobe from '../components/WorldwideGlobe';
import LiveAuditScanner from '../components/LiveAuditScanner';
import ProjectEstimator from '../components/ProjectEstimator';
import CaseStudies from '../components/CaseStudies';
import PricingTiers from '../components/PricingTiers';
import ContactWizard from '../components/ContactWizard';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useNavigate } from 'react-router-dom';

export default function HomePage({ onOpenTerminal, onOpenAIChat }) {
  useScrollReveal();
  const navigate = useNavigate();

  const handleSelectService = () => {
    navigate('/services');
  };

  const handleHubSelect = () => {
    navigate('/worldwide');
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-sky-lavender-mesh text-slate-900">
      <div className="reveal-on-scroll">
        <Hero 
          onOpenTerminal={onOpenTerminal}
          onOpenScanner={() => scrollToSection('scanner')}
          onOpenGlobe={() => scrollToSection('worldwide')}
          onOpenEstimator={() => scrollToSection('estimator')}
          onOpenAIChat={onOpenAIChat}
        />
      </div>
      <div className="reveal-on-scroll">
        <ServicesSection onSelectService={handleSelectService} />
      </div>
      <div className="reveal-on-scroll">
        <WorkModelEcosystem />
      </div>
      <div className="reveal-on-scroll">
        <DigitalMarketingSection />
      </div>
      <div className="reveal-on-scroll">
        <LiveSEOAuditor />
      </div>
      <div className="reveal-on-scroll">
        <WorldwideGlobe onSelectHub={handleHubSelect} />
      </div>
      <div className="reveal-on-scroll">
        <LiveAuditScanner onRequestFix={() => scrollToSection('contact')} />
      </div>
      <div className="reveal-on-scroll">
        <ProjectEstimator onProceedToBooking={() => scrollToSection('contact')} />
      </div>
      <div className="reveal-on-scroll">
        <CaseStudies />
      </div>
      <div className="reveal-on-scroll">
        <PricingTiers />
      </div>
      <div className="reveal-on-scroll" id="contact">
        <ContactWizard />
      </div>
    </div>
  );
}
