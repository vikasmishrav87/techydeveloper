import React from 'react';
import { Link } from 'react-router-dom';

/**
 * BrandLogo Component
 * Uses the custom Blockchain Shield + Lightning crypto brand logo
 */
export default function BrandLogo({ size = 'md', withText = true, className = '', linkTo = '/' }) {
  const sizeMap = {
    sm: { icon: 'w-8 h-8', text: 'text-xs', sub: 'text-[9px]' },
    md: { icon: 'w-10 h-10', text: 'text-sm', sub: 'text-[10px]' },
    lg: { icon: 'w-14 h-14', text: 'text-lg', sub: 'text-xs' },
    xl: { icon: 'w-20 h-20', text: 'text-2xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const LogoIcon = (
    <div className={`relative ${currentSize.icon} flex-shrink-0 transition-transform duration-300 hover:scale-105 ${className}`}>
      <img
        src="/assets/brand-logo.jpg"
        alt="The Unfiltered Engineer"
        className="w-full h-full object-contain rounded-xl"
        draggable={false}
      />
    </div>
  );

  const content = (
    <div className="flex items-center gap-2.5 group flex-shrink-0">
      <span className="grid size-9 sm:size-10 place-items-center rounded-xl bg-[#141414] border border-[#141414] shadow-[3px_3px_0_0_#FF4D00] group-hover:scale-105 transition-transform">
        <svg viewBox="0 0 64 64" className="size-5 sm:size-6 text-[#FF4D00]" aria-hidden="true">
          <g stroke="currentColor" strokeWidth="8" strokeLinecap="round">
            <line x1="32" y1="10" x2="32" y2="54"></line>
            <line x1="12.9" y1="21" x2="51.1" y2="43"></line>
            <line x1="12.9" y1="43" x2="51.1" y2="21"></line>
          </g>
        </svg>
      </span>
      {withText && (
        <div className="flex flex-col pr-1">
          <span className="font-display text-base sm:text-lg font-black tracking-tight text-[#141414] group-hover:text-[#FF4D00] transition-colors whitespace-nowrap leading-none uppercase">
            THE UNFILTERED ENGINEER
          </span>
          <span className="text-[10px] font-display font-bold text-[#FF4D00] tracking-[0.14em] uppercase flex items-center gap-1.5 mt-0.5">
            <span className="size-1.5 rounded-full bg-[#FF4D00] animate-ping" />
            DESIGN • BUILD • AUTOMATE
          </span>
        </div>
      )}
    </div>
  );

  if (linkTo) {
    return <Link to={linkTo} className="inline-flex items-center">{content}</Link>;
  }

  return content;
}
