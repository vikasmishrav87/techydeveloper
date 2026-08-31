import React from 'react';
import CaseStudies from '../components/CaseStudies';
import ClientProofSection from '../components/ClientProofSection';
import BigCtaBanner from '../components/BigCtaBanner';

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-[#FAF7EE] text-[#141414] pt-20">
      <CaseStudies />
      <ClientProofSection />
      <BigCtaBanner />
    </div>
  );
}
