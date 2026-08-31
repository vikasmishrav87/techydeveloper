import React from 'react';
import ProjectEstimator from '../components/ProjectEstimator';
import BigCtaBanner from '../components/BigCtaBanner';

export default function EstimatorPage() {
  return (
    <div className="min-h-screen bg-[#FAF7EE] text-[#141414] pt-28 pb-24 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <ProjectEstimator />
        <BigCtaBanner />
      </div>
    </div>
  );
}
