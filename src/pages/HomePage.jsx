import React from 'react';
import Hero from '../components/Hero';
import StatsStrip from '../components/StatsStrip';
import ServicesSection from '../components/ServicesSection';
import ClientProofSection from '../components/ClientProofSection';
import ProcessSection from '../components/ProcessSection';
import ProjectEstimator from '../components/ProjectEstimator';
import LiveAuditScanner from '../components/LiveAuditScanner';
import BigCtaBanner from '../components/BigCtaBanner';
import ContactWizard from '../components/ContactWizard';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function HomePage({ onOpenTerminal, onOpenAIChat }) {
  useScrollReveal();

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF7EE] text-[#141414]">
      {/* 1. Studio Hero */}
      <Hero 
        onOpenTerminal={onOpenTerminal}
        onOpenScanner={() => scrollToSection('scanner')}
        onOpenAIChat={onOpenAIChat}
      />

      {/* 2. Yellow Giant Stats Strip */}
      <StatsStrip />

      {/* 3. Services Section */}
      <ServicesSection />

      {/* 4. Client DM Proofs & Reviews */}
      <ClientProofSection />

      {/* 6. Process / How It Works */}
      <ProcessSection />

      {/* 7. Interactive Estimator & Audit Scanner */}
      <section className="py-16 sm:py-24 bg-[#F4EFE6] border-b-2 border-[#141414]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <ProjectEstimator onProceedToBooking={() => scrollToSection('contact')} />
          <div id="scanner">
            <LiveAuditScanner onRequestFix={() => scrollToSection('contact')} />
          </div>
        </div>
      </section>

      {/* 8. Studio Big Bottom Banner */}
      <BigCtaBanner />

      {/* 9. Contact Wizard Section */}
      <div id="contact" className="py-16 sm:py-24 bg-[#FAF7EE] border-t-2 border-[#141414]">
        <ContactWizard />
      </div>
    </div>
  );
}
