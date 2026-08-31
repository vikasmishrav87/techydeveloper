import React from 'react';
import PricingTiers from '../components/PricingTiers';
import BigCtaBanner from '../components/BigCtaBanner';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#FAF7EE] text-[#141414] pt-20">
      <PricingTiers />
      <BigCtaBanner />
    </div>
  );
}
