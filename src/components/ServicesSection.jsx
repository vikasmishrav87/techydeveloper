import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SERVICE_PILLARS } from '../data/agencyData';
import { ArrowRight, MessageCircle, ArrowUpRight, Zap } from 'lucide-react';

export default function ServicesSection() {
  const location = useLocation();
  const isServicesPage = location.pathname === '/services';
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Security', 'Web3', 'AI & ML', 'SaaS & Cloud', 'Growth'];

  const filteredServices = activeCategory === 'All'
    ? SERVICE_PILLARS
    : SERVICE_PILLARS.filter(s => {
        if (activeCategory === 'Security') return s.id.includes('security');
        if (activeCategory === 'Web3') return s.id.includes('blockchain');
        if (activeCategory === 'AI & ML') return s.id.includes('ai');
        if (activeCategory === 'SaaS & Cloud') return s.id.includes('saas') || s.id.includes('web') || s.id.includes('software');
        if (activeCategory === 'Growth') return s.id.includes('marketing');
        return true;
      });

  return (
    <section id="services" className="relative py-16 sm:py-28 bg-[#FAF7EE] text-[#141414] border-b-2 border-[#141414]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-12">
          <div>
            <p className="font-display text-xs sm:text-sm font-black tracking-[0.2em] text-[#FF4D00] uppercase">
              CAPABILITIES & SQUADS
            </p>
            <h2 className="mt-2 font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-[#141414]">
              WHAT WE BUILD & AUDIT
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base font-medium text-[#141414]/70">
            From offensive security perimeters to high-throughput Web3 protocols and autonomous AI agents.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2.5 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`sticker-pill px-4 py-2 text-xs cursor-pointer transition-all ${
                activeCategory === cat
                  ? 'bg-[#FF4D00] text-[#FAF7EE] shadow-[3px_3px_0_0_#141414]'
                  : 'bg-[#F4EFE6] hover:bg-[#FFC72E] text-[#141414] shadow-[3px_3px_0_0_#141414]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Grid with Pop-in Response Animation */}
        <div key={activeCategory} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 animate-card-pop">
          {filteredServices.map((service) => {
            return (
              <div
                key={service.id}
                className="brutal-card group flex flex-col justify-between overflow-hidden rounded-3xl border-2 border-[#141414] bg-[#F4EFE6] shadow-[6px_6px_0_0_#141414]"
              >
                {/* Visual Header Image Preview */}
                <div className="relative aspect-[16/10] w-full overflow-hidden border-b-2 border-[#141414] bg-[#141414]">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/assets/cyber-security.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414]/80 via-transparent to-transparent" />
                  
                  {/* Category Pill */}
                  <span className="sticker-pill absolute top-3 left-3 sm:top-4 sm:left-4 bg-[#FFC72E] text-[#141414] px-3 py-1 text-[10px] sm:text-xs shadow-[3px_3px_0_0_#141414]">
                    {service.badge}
                  </span>

                  {/* Primary Metric Pill */}
                  <span className="sticker-pill absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-[#141414] text-[#FAF7EE] border-[#FAF7EE] px-3 py-1 text-[11px] sm:text-xs shadow-[3px_3px_0_0_#FAF7EE]">
                    {service.keyStats?.[0]?.value} {service.keyStats?.[0]?.label}
                  </span>
                </div>

                {/* Service Details */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-display text-xl sm:text-2xl font-black uppercase text-[#141414] group-hover:text-[#FF4D00] transition-colors leading-tight">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm font-medium text-[#141414]/75 line-clamp-2">
                      {service.tagline || service.description}
                    </p>
                  </div>

                  {/* Tech Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {service.techStack?.slice(0, 3).map((tech, idx) => (
                      <span
                        key={idx}
                        className="sticker-pill px-2.5 py-0.5 text-[10px] bg-[#FAF7EE] text-[#141414] shadow-[1px_1px_0_0_#141414]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Bottom Actions */}
                <div className="p-6 sm:p-7 pt-0 border-t-2 border-[#141414]/10 flex items-center justify-between gap-3 mt-auto">
                  <Link
                    to={`/services/${service.id}`}
                    className="sticker-pill px-4 py-2 sm:px-5 sm:py-2.5 bg-[#141414] hover:bg-[#FF4D00] text-[#FAF7EE] text-xs font-display font-black shadow-[3px_3px_0_0_#FF4D00] hover:shadow-[4px_4px_0_0_#141414] cursor-pointer"
                  >
                    <span>VIEW SQUAD DOSSIER</span>
                    <ArrowUpRight className="size-3.5" />
                  </Link>

                  <a
                    href={`https://wa.me/918369804739?text=${encodeURIComponent(`Hi Vikas, I want to discuss hiring the ${service.title} engineering squad.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sticker-pill size-10 bg-[#25D366] text-[#141414] shadow-[3px_3px_0_0_#141414] flex items-center justify-center"
                    title="Chat on WhatsApp"
                  >
                    <MessageCircle className="size-4 text-[#141414]" />
                  </a>
                </div>

              </div>
            );
          })}
        </div>

        {/* View All Services Bottom Banner */}
        <div className="mt-14 sm:mt-16 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
          {isServicesPage ? (
            <>
              <Link
                to="/contact"
                onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
                className="sticker-pill px-8 py-4 sm:px-10 sm:py-5 text-sm sm:text-base bg-[#FF4D00] hover:bg-[#FFC72E] hover:text-[#141414] text-[#FAF7EE] shadow-[5px_5px_0_0_#141414] cursor-pointer flex items-center justify-center gap-2"
              >
                <Zap className="size-4" />
                <span>DEPLOY SPECIALIZED ENGINEERING SQUAD</span>
                <ArrowRight className="size-4" />
              </Link>
              <a
                href="https://wa.me/918369804739?text=Hi%20Vikas%2C%20I%20want%20to%20hire%20a%20specialized%20engineering%20squad%20for%20our%20product."
                target="_blank"
                rel="noopener noreferrer"
                className="sticker-pill px-6 py-4 text-sm bg-[#25D366] text-[#141414] shadow-[4px_4px_0_0_#141414] cursor-pointer flex items-center justify-center gap-2"
              >
                <MessageCircle className="size-4" />
                <span>WHATSAPP (+91 8369804739)</span>
              </a>
            </>
          ) : (
            <Link
              to="/services"
              onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
              className="sticker-pill px-8 py-4 sm:px-10 sm:py-5 text-sm sm:text-base bg-[#141414] hover:bg-[#FF4D00] text-[#FAF7EE] shadow-[5px_5px_0_0_#FF4D00] cursor-pointer flex items-center justify-center gap-2"
            >
              <span>EXPLORE ALL SPECIALIZED SQUADS</span>
              <ArrowRight className="size-4" />
            </Link>
          )}
        </div>

      </div>
    </section>
  );
}
