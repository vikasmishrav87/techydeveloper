import React from 'react';
import WorldwideGlobe from '../components/WorldwideGlobe';
import BigCtaBanner from '../components/BigCtaBanner';

export default function WorldwidePage() {
  return (
    <div className="min-h-screen bg-[#FAF7EE] text-[#141414] pt-24 font-sans">
      <WorldwideGlobe />
      <BigCtaBanner />
    </div>
  );
}
