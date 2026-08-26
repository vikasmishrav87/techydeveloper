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
      {LogoIcon}
      {withText && (
        <div className="flex flex-col pr-1">
          <span className={`${currentSize.text} font-bold tracking-tight text-slate-950 group-hover:text-sky-700 transition-colors whitespace-nowrap leading-tight`}>
            The Unfiltered Engineer
          </span>
          <span className={`${currentSize.sub} font-mono font-medium text-indigo-600/90 tracking-widest uppercase flex items-center gap-1`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Blockchain · Web3 · AI
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
