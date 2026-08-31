import React from 'react';
import DigitalMarketingSection from '../components/DigitalMarketingSection';
import LiveSEOAuditor from '../components/LiveSEOAuditor';
import BigCtaBanner from '../components/BigCtaBanner';

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-[#FAF7EE] text-[#141414] pt-20 font-sans">
      <DigitalMarketingSection />
      <div className="py-16 bg-[#FAF7EE] border-b-2 border-[#141414]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <LiveSEOAuditor />
        </div>
      </div>
      <BigCtaBanner />
    </div>
  );
}
