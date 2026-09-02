import React from 'react';
import { Link } from 'react-router-dom';

/**
 * BrandLogo Component
 * Uses the custom Blockchain Shield + Lightning crypto brand logo
 */
export default function BrandLogo({ size = 'md', withText = true, className = '', linkTo = '/' }) {
  const sizeMap = {
    xs: { icon: 'size-7', img: 'size-7', text: 'text-xs', sub: 'text-[8px]' },
    sm: { icon: 'size-8 sm:size-9', img: 'size-8 sm:size-9', text: 'text-xs sm:text-sm', sub: 'text-[9px]' },
    md: { icon: 'size-10 sm:size-11', img: 'size-10 sm:size-11', text: 'text-sm sm:text-base', sub: 'text-[10px]' },
    lg: { icon: 'size-12 sm:size-14', img: 'size-12 sm:size-14', text: 'text-base sm:text-lg', sub: 'text-xs' },
    xl: { icon: 'size-16 sm:size-20', img: 'size-16 sm:size-20', text: 'text-xl sm:text-2xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const content = (
    <div className={`flex items-center gap-2.5 sm:gap-3 group flex-shrink-0 ${className}`}>
      {/* Official Brand Logo Icon: Blockchain Hexagon + Shield + Lightning */}
      <div className={`relative ${currentSize.icon} rounded-xl overflow-hidden border-2 border-[#141414] bg-[#141414] shadow-[3px_3px_0_0_#FF4D00] group-hover:shadow-[4px_4px_0_0_#141414] group-hover:scale-105 transition-all flex-shrink-0 flex items-center justify-center p-0.5`}>
        <img
          src="/assets/brand-logo.png"
          alt="The Unfiltered Engineer Brand Logo"
          className="w-full h-full object-contain rounded-lg"
          loading="eager"
          draggable={false}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/assets/brand-logo.jpg';
          }}
        />
      </div>

      {withText && (
        <div className="flex flex-col pr-1">
          <span className={`font-display font-black tracking-tight text-[#141414] group-hover:text-[#FF4D00] transition-colors whitespace-nowrap leading-none uppercase ${currentSize.text}`}>
            THE UNFILTERED ENGINEER
          </span>
          <span className={`font-display font-bold text-[#FF4D00] tracking-[0.14em] uppercase flex items-center gap-1.5 mt-1 ${currentSize.sub}`}>
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
