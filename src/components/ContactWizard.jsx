import React, { useState, useEffect } from 'react';
import { CONTACT_INFO, SERVICE_PILLARS } from '../data/agencyData';
import { saveInquiry } from '../services/storageService';
import { Send, MessageCircle, CheckCircle2, ShieldCheck, Lock, Sparkles, User, Mail, Building, FileText, ArrowRight, Phone, Check } from 'lucide-react';

export default function ContactWizard({ prefillData }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    selectedService: SERVICE_PILLARS[0].title,
    budget: 'Dedicated Monthly Squad',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  useEffect(() => {
    if (prefillData) {
      setFormData((prev) => ({
        ...prev,
        selectedService: prefillData.services ? prefillData.services[0] : prev.selectedService,
        message: prefillData.details || prefillData.techStackNotes || prev.message,
        budget: prefillData.estimatedCost || prev.budget,
      }));
    }
  }, [prefillData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    const saved = saveInquiry(formData);
    setSubmittedData(saved);
    setSubmitted(true);
  };

  const getWhatsAppForwardLink = () => {
    const text = encodeURIComponent("Hi Vikas, I submitted an inquiry on The Unfiltered Engineer platform:\n- Name: " + formData.name + "\n- Company: " + (formData.company || 'N/A') + "\n- Service: " + formData.selectedService + "\n- Engagement Model: " + formData.budget + "\n- Message: " + (formData.message || 'Ready to discuss scope.'));
    return "https://wa.me/919137507092?text=" + text;
  };

  return (
    <section id="contact" className="relative py-28 bg-[#EEF2FF] text-slate-900 overflow-hidden border-t border-b border-indigo-100/90">
      
      <div className="absolute inset-0 bg-light-grid opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 reveal-on-scroll">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-sky-200 text-sky-800 text-xs font-mono uppercase tracking-widest mb-4 shadow-xs">
            <Lock className="w-3.5 h-3.5 text-sky-600" />
            Direct Engineer Gateway
          </div>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-slate-950 mb-6">
            Initiate Direct <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 font-normal">Engagement</span>
          </h2>
          <p className="text-slate-700 text-base sm:text-lg font-normal leading-relaxed">
            Connect directly with Vikas Mishra & the specialized engineering leads. Fast turnarounds, strict non-disclosure, and zero vendor bureaucracy.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto items-start">
          
          {/* Left Column: Direct Contact Info & Direct Messengers */}
          <div className="lg:col-span-5 space-y-6 reveal-on-scroll">
            
            <div className="bg-white/95 border border-indigo-100 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-bold text-slate-950 mb-2">Speak Directly with Founders</h3>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                No salespeople or intermediate ticket queues. You talk directly with the engineers designing and building your systems.
              </p>

              <div className="space-y-3">
                <a
                  href={CONTACT_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 transition-all group shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-600 text-white">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Direct WhatsApp</div>
                      <div className="text-xs font-mono text-emerald-700">{CONTACT_INFO.phoneDisplay}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-700 group-hover:translate-x-1 transition-transform" />
                </a>

                <a
                  href={CONTACT_INFO.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 transition-all group shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-sky-600 text-white">
                      <Send className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Direct Telegram</div>
                      <div className="text-xs font-mono text-sky-700">{CONTACT_INFO.telegramUser}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-sky-700 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 text-xs text-slate-500 space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-sky-600" />
                  <span>Strict NDA & IP Assignment guaranteed</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>2-hour average response time during business hours</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Inquiry Form */}
          <div className="lg:col-span-7 reveal-on-scroll">
            <div className="bg-white/95 border border-indigo-100 rounded-3xl p-6 sm:p-8 shadow-sm">
              
              {submitted ? (
                <div className="text-center py-10 animate-fadeIn">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-950 mb-2">Inquiry Securely Received</h3>
                  <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
                    Thank you {formData.name}. Vikas Mishra and the squad lead will review your specifications and contact you within 2 hours.
                  </p>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-md mx-auto mb-6 text-left text-xs font-mono text-slate-700 space-y-1">
                    <div><strong>Reference ID:</strong> {submittedData?.id || 'UE-ENG-2026'}</div>
                    <div><strong>Service:</strong> {formData.selectedService}</div>
                    <div><strong>Budget Bracket:</strong> {formData.budget}</div>
                  </div>

                  <a
                    href={getWhatsAppForwardLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-all shadow-md shadow-emerald-600/20"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Instant Follow-Up on WhatsApp</span>
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-700 mb-1.5 font-semibold">Your Name *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Alex Mercer"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-700 mb-1.5 font-semibold">Work Email *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="alex@company.com"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-700 mb-1.5 font-semibold">Company / Protocol</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="e.g. Apex DeFi"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-700 mb-1.5 font-semibold">Phone / WhatsApp</label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-700 mb-1.5 font-semibold">Primary Practice</label>
                      <select
                        name="selectedService"
                        value={formData.selectedService}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                      >
                        {SERVICE_PILLARS.map((p) => (
                          <option key={p.id} value={p.title}>{p.title}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-700 mb-1.5 font-semibold">Engagement Model</label>
                      <select
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                      >
                        <option value="Rapid 2-Week Sprint">Rapid 2-Week Sprint (Audit / MVP)</option>
                        <option value="Dedicated Monthly Squad">Dedicated Monthly Squad (4-5 Engineers)</option>
                        <option value="Multi-Month Architecture">Multi-Month Custom Architecture</option>
                        <option value="Full Enterprise Retainer">Full Enterprise Retainer & 24/7 SLA</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-700 mb-1.5 font-semibold">Project Scope & Technical Details</label>
                    <textarea
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Describe your architecture requirements, timelines, or security targets..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-medium text-sm transition-all shadow-md shadow-sky-600/25 hover:scale-[1.01]"
                  >
                    <Send className="w-4 h-4" />
                    <span>Transmit Specifications to Vikas & Squad</span>
                  </button>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
