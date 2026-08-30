import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import PaymentModal from '../components/PaymentModal';
import { Shield, Lock, CreditCard, Sparkles, CheckCircle2, ArrowRight, DollarSign, Building2, Globe2 } from 'lucide-react';

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const initialAmount = parseInt(searchParams.get('amount') || '3500', 10);
  const initialCurrency = (searchParams.get('currency') || 'USD').toUpperCase();
  const serviceName = searchParams.get('service') || 'Full-Stack Dedicated Engineering Squad';
  const clientParam = searchParams.get('client') || '';

  return (
    <div className="min-h-screen pt-32 pb-24 bg-sky-lavender-mesh text-slate-900 font-sans flex items-center justify-center">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 w-full text-left">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-sky-200 text-sky-800 text-xs font-mono uppercase tracking-wider mb-3 shadow-xs">
            <Lock className="w-3.5 h-3.5 text-sky-600" />
            Official Enterprise Checkout Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
            Escrow-Secured <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600">Client Checkout</span>
          </h1>
          <p className="text-slate-600 text-sm mt-2">
            Securely settle engineering milestones, dedicated monthly retainers, or custom project invoices.
          </p>
        </div>

        {/* Invoice Summary Card */}
        <div className="bg-white/95 border border-indigo-100 rounded-3xl shadow-xl p-6 sm:p-10 space-y-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <div className="text-xs text-sky-700 font-mono font-semibold uppercase">Engagement Description</div>
              <h2 className="text-xl font-bold text-slate-950 mt-0.5">{serviceName}</h2>
              {clientParam && (
                <div className="text-xs text-slate-500 mt-1">Issued for: <strong>{clientParam}</strong></div>
              )}
            </div>

            <div className="text-left sm:text-right">
              <div className="text-xs text-slate-500 font-mono uppercase">Total Payable</div>
              <div className="text-3xl font-extrabold text-slate-950">
                {initialCurrency === 'INR' ? `₹${initialAmount.toLocaleString()}` : `$${initialAmount.toLocaleString()} USD`}
              </div>
            </div>
          </div>

          {/* Supported Gateways Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
              <div className="text-xs font-bold text-slate-900">Razorpay</div>
              <div className="text-[10px] text-slate-500">UPI, NetBanking, Cards</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
              <div className="text-xs font-bold text-slate-900">Stripe</div>
              <div className="text-[10px] text-slate-500">Global Credit/Debit</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
              <div className="text-xs font-bold text-slate-900">Web3 USDT</div>
              <div className="text-[10px] text-slate-500">Polygon, TRC20, ETH</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
              <div className="text-xs font-bold text-slate-900">Bank Wire</div>
              <div className="text-[10px] text-slate-500">RTGS, NEFT, SWIFT</div>
            </div>
          </div>

          {/* Checkout CTA */}
          <button
            onClick={() => setIsPaymentOpen(true)}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-600 via-indigo-600 to-teal-600 hover:from-sky-500 hover:to-teal-500 text-white font-bold text-base flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-sky-600/25 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <CreditCard className="w-5 h-5" />
            <span>Open Payment Gateway & Settle Invoice</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <Link to="/" className="hover:text-slate-800 transition-colors">← Return to Homepage</Link>
            <span>256-Bit SSL Escrow Encrypted</span>
          </div>

        </div>

      </div>

      {/* Embedded Universal Payment Modal */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        initialAmount={initialAmount}
        initialCurrency={initialCurrency}
        serviceName={serviceName}
      />
    </div>
  );
}
