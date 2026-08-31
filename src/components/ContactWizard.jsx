import React, { useState } from 'react';
import { CONTACT_INFO, SERVICE_PILLARS } from '../data/agencyData';
import { saveInquiry } from '../services/storageService';
import { MessageCircle, Send, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export default function ContactWizard() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    selectedService: SERVICE_PILLARS[0].title,
    budget: 'Sprint Squad',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    saveInquiry(formData);
    setSubmitted(true);
  };

  const getWhatsAppForwardLink = () => {
    const text = encodeURIComponent(`Hi Vikas, I am submitting a project inquiry:\n• Name: ${formData.name}\n• Company: ${formData.company || 'N/A'}\n• Specialization: ${formData.selectedService}\n• Model: ${formData.budget}\n• Brief: ${formData.message || 'Ready to start.'}`);
    return `https://wa.me/919137507092?text=${text}`;
  };

  return (
    <div className="rounded-3xl border-2 border-[#141414] bg-[#FAF7EE] p-6 sm:p-12 shadow-[7px_7px_0_0_#141414] text-[#141414] max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 pb-6 border-b-2 border-[#141414]/15">
        <div>
          <p className="font-display text-xs font-black uppercase text-[#FF4D00] tracking-widest">
            DIRECT ARCHITECT GATEWAY
          </p>
          <h2 className="mt-1 font-display text-3xl sm:text-5xl font-black uppercase text-[#141414]">
            START A PROJECT
          </h2>
        </div>
        <span className="px-3 py-1 rounded-full border-2 border-[#141414] bg-[#FFC72E] font-display text-xs font-black uppercase">
          &lt;15M ESCALATION SLA
        </span>
      </div>

      {submitted ? (
        <div className="rounded-3xl border-2 border-[#141414] bg-[#FFC72E] p-8 text-center space-y-4">
          <div className="font-display text-3xl sm:text-4xl font-black uppercase text-[#141414]">
            BRIEF DISPATCHED!
          </div>
          <p className="text-sm sm:text-base font-bold text-[#141414]">
            Vikas Sunil Mishra has been notified. For instant 24/7 priority routing, forward your inquiry directly to WhatsApp:
          </p>
          <div className="pt-2">
            <a
              href={getWhatsAppForwardLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#141414] hover:bg-[#FF4D00] text-[#FAF7EE] px-8 py-4 font-display text-sm sm:text-base font-black uppercase shadow-[4px_4px_0_0_#FF4D00] transition-all hover:-translate-y-0.5"
            >
              <MessageCircle className="size-4" />
              <span>CONTINUE ON WHATSAPP (+91 9137507092)</span>
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-display text-xs font-black uppercase text-[#141414] mb-1.5">
                YOUR NAME *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Alex Morgan"
                className="w-full px-4 py-3 rounded-2xl border-2 border-[#141414] bg-[#F4EFE6] text-[#141414] font-medium text-sm focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-display text-xs font-black uppercase text-[#141414] mb-1.5">
                WORK EMAIL *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="alex@enterprise.com"
                className="w-full px-4 py-3 rounded-2xl border-2 border-[#141414] bg-[#F4EFE6] text-[#141414] font-medium text-sm focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-display text-xs font-black uppercase text-[#141414] mb-1.5">
                PHONE / WHATSAPP NUMBER
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 019-2834"
                className="w-full px-4 py-3 rounded-2xl border-2 border-[#141414] bg-[#F4EFE6] text-[#141414] font-medium text-sm focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-display text-xs font-black uppercase text-[#141414] mb-1.5">
                COMPANY OR PROTOCOL NAME
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Apex Protocol Ltd"
                className="w-full px-4 py-3 rounded-2xl border-2 border-[#141414] bg-[#F4EFE6] text-[#141414] font-medium text-sm focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-display text-xs font-black uppercase text-[#141414] mb-1.5">
                PRIMARY PRACTICE SQUAD
              </label>
              <select
                name="selectedService"
                value={formData.selectedService}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl border-2 border-[#141414] bg-[#F4EFE6] text-[#141414] font-display text-xs font-black uppercase focus:bg-white focus:outline-none"
              >
                {SERVICE_PILLARS.map((s) => (
                  <option key={s.id} value={s.title}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-display text-xs font-black uppercase text-[#141414] mb-1.5">
                ENGAGEMENT MODEL
              </label>
              <select
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl border-2 border-[#141414] bg-[#F4EFE6] text-[#141414] font-display text-xs font-black uppercase focus:bg-white focus:outline-none"
              >
                <option value="Sprint Squad">SPRINT SQUAD (2-3 WEEKS)</option>
                <option value="Dedicated Monthly Squad">DEDICATED MONTHLY SQUAD</option>
                <option value="Enterprise Architecture Retainer">ENTERPRISE ARCHITECTURE RETAINER</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-display text-xs font-black uppercase text-[#141414] mb-1.5">
              PROJECT BRIEF OR ARCHITECTURAL GOALS
            </label>
            <textarea
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us what systems you want to build, security requirements, timeline, or current technical bottlenecks..."
              className="w-full px-4 py-3 rounded-2xl border-2 border-[#141414] bg-[#F4EFE6] text-[#141414] font-medium text-sm focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto px-10 py-4 rounded-full bg-[#FF4D00] hover:bg-[#FF5500] text-[#FAF7EE] font-display text-sm font-black uppercase shadow-[4px_4px_0_0_#141414] transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              DISPATCH ARCHITECT BRIEF
            </button>

            <a
              href={CONTACT_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-[#141414] bg-[#25D366] text-[#141414] font-display text-sm font-black uppercase shadow-[4px_4px_0_0_#141414] transition-all hover:-translate-y-0.5"
            >
              <MessageCircle className="size-4" />
              <span>OR INSTANT CHAT ON WHATSAPP</span>
            </a>
          </div>
        </form>
      )}

    </div>
  );
}
