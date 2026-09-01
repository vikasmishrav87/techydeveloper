import React from 'react';
import WorldwideGlobe from '../components/WorldwideGlobe';
import BigCtaBanner from '../components/BigCtaBanner';

export default function WorldwidePage() {
  return (
    <div className="min-h-screen bg-[#141414] text-[#FAF7EE] pt-16 sm:pt-20 font-sans">
      <WorldwideGlobe />
      <BigCtaBanner />
    </div>
  );
}
