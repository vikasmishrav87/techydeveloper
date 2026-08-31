import React, { useState } from 'react';
import { CONTACT_INFO, SERVICE_PILLARS } from '../data/agencyData';
import { saveInquiry } from '../services/storageService';
import { MessageCircle, Send, Mail, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

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
    return `https://wa.me/918369804739?text=${text}`;
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
        <div className="flex flex-wrap items-center gap-2">
          <span className="sticker-pill px-3 py-1 bg-[#FFC72E] text-[#141414] text-xs shadow-[2px_2px_0_0_#141414]">
            &lt;15M ESCALATION SLA
          </span>
          <a
            href={`mailto:${CONTACT_INFO.supportEmail}`}
            className="sticker-pill px-3 py-1 bg-[#F4EFE6] hover:bg-[#FF4D00] hover:text-[#FAF7EE] text-[#141414] text-xs shadow-[2px_2px_0_0_#141414] transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>EMAIL SUPPORT</span>
          </a>
        </div>
      </div>

      {submitted ? (
        <div className="rounded-3xl border-2 border-[#141414] bg-[#FFC72E] p-8 text-center space-y-4">
          <div className="font-display text-3xl sm:text-4xl font-black uppercase text-[#141414]">
            BRIEF DISPATCHED!
          </div>
          <p className="text-sm sm:text-base font-bold text-[#141414]">
            Vikas Sunil Mishra has been notified. For instant 24/7 priority routing, forward your inquiry directly to WhatsApp or Support Email:
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href={getWhatsAppForwardLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="sticker-pill px-8 py-4 bg-[#141414] hover:bg-[#FF4D00] text-[#FAF7EE] text-sm sm:text-base shadow-[4px_4px_0_0_#FF4D00]"
            >
              <MessageCircle className="size-4" />
              <span>CONTINUE ON WHATSAPP (+91 8369804739)</span>
            </a>
            <a
              href={`mailto:${CONTACT_INFO.supportEmail}?subject=${encodeURIComponent(`Project Brief: ${formData.name} - ${formData.selectedService}`)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nCompany: ${formData.company}\nSpecialization: ${formData.selectedService}\nModel: ${formData.budget}\nMessage:\n${formData.message}`)}`}
              className="sticker-pill px-6 py-4 bg-[#FAF7EE] hover:bg-[#FF4D00] hover:text-[#FAF7EE] text-[#141414] text-sm sm:text-base shadow-[4px_4px_0_0_#141414]"
            >
              <Mail className="size-4" />
              <span>SEND VIA SUPPORT EMAIL</span>
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
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Alex Vance"
                className="w-full px-4 py-3 rounded-2xl border-2 border-[#141414] bg-[#F4EFE6] text-[#141414] font-medium text-sm focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-display text-xs font-black uppercase text-[#141414] mb-1.5">
                CORPORATE EMAIL *
              </label>
              <input
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="alex@company.com"
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
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-3 rounded-2xl border-2 border-[#141414] bg-[#F4EFE6] text-[#141414] font-medium text-sm focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-display text-xs font-black uppercase text-[#141414] mb-1.5">
                COMPANY OR PROTOCOL
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Acme Corp / DAO"
                className="w-full px-4 py-3 rounded-2xl border-2 border-[#141414] bg-[#F4EFE6] text-[#141414] font-medium text-sm focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-display text-xs font-black uppercase text-[#141414] mb-1.5">
                ENGINEERING PRACTICE
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
              className="sticker-pill w-full sm:w-auto px-10 py-4 bg-[#FF4D00] hover:bg-[#FF5500] text-[#FAF7EE] text-sm font-black shadow-[4px_4px_0_0_#141414] cursor-pointer"
            >
              DISPATCH ARCHITECT BRIEF
            </button>

            <a
              href={CONTACT_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="sticker-pill w-full sm:w-auto px-8 py-4 bg-[#25D366] text-[#141414] text-sm font-black shadow-[4px_4px_0_0_#141414]"
            >
              <MessageCircle className="size-4" />
              <span>OR CHAT ON WHATSAPP</span>
            </a>

            <a
              href={`mailto:${CONTACT_INFO.supportEmail}`}
              className="sticker-pill w-full sm:w-auto px-6 py-4 bg-[#FFC72E] text-[#141414] text-sm font-black shadow-[4px_4px_0_0_#141414]"
              title="Mail Support"
            >
              <Mail className="size-4" />
              <span>EMAIL SUPPORT</span>
            </a>
          </div>
        </form>
      )}

    </div>
  );
}
