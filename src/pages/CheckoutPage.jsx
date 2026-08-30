import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import PaymentModal from '../components/PaymentModal';
import { Shield, Lock, CreditCard, Sparkles, CheckCircle2, ArrowRight, DollarSign, Building2, Globe2, RefreshCw } from 'lucide-react';

// Platform Standard Rate: $1 USD = ₹100 INR
const USD_TO_INR_RATE = 100;

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  // Manual amount input state
  const [currencyMode, setCurrencyMode] = useState(searchParams.get('currency')?.toUpperCase() || 'USD');
  const [manualAmount, setManualAmount] = useState(searchParams.get('amount') || '100');
  const serviceName = searchParams.get('service') || 'Custom Engineering Scope / Milestone Retainer';
  const clientParam = searchParams.get('client') || '';

  const [selectedMethod, setSelectedMethod] = useState('razorpay');

  const parsedVal = parseFloat(manualAmount) || 0;
  const amountUSD = currencyMode === 'USD' ? parsedVal : Math.round((parsedVal / USD_TO_INR_RATE) * 100) / 100;
  const amountINR = currencyMode === 'INR' ? parsedVal : Math.round(parsedVal * USD_TO_INR_RATE);

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
            Enter your agreed scope amount manually in <strong>USD ($)</strong> or <strong>INR (₹)</strong> ($1 = ₹100 platform rate).
          </p>
        </div>

        {/* Invoice & Manual Amount Entry Card */}
        <div className="bg-white/95 border border-indigo-100 rounded-3xl shadow-xl p-6 sm:p-10 space-y-6">
          
          {/* Engagement Details */}
          <div className="pb-6 border-b border-slate-100">
            <div className="text-xs text-sky-700 font-mono font-semibold uppercase">Engagement Description</div>
            <h2 className="text-xl font-bold text-slate-950 mt-0.5">{serviceName}</h2>
            {clientParam && (
              <div className="text-xs text-slate-500 mt-1">Issued for: <strong>{clientParam}</strong></div>
            )}
          </div>

          {/* MANUAL AMOUNT ENTRY BOX */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-sky-50/90 via-indigo-50/40 to-slate-50 border-2 border-sky-300 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider block">
                  Enter Payable Amount Manually:
                </label>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                  Platform Standard Exchange: <strong className="text-sky-700 font-bold">$1 USD = ₹100 INR</strong>
                </div>
              </div>

              {/* Currency Selector */}
              <div className="inline-flex items-center rounded-2xl bg-white border border-sky-300 p-1 shadow-xs self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setCurrencyMode('USD')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currencyMode === 'USD' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  $ USD
                </button>
                <button
                  type="button"
                  onClick={() => setCurrencyMode('INR')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currencyMode === 'INR' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ₹ INR
                </button>
              </div>
            </div>

            {/* Input with large font */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl font-extrabold text-slate-400 font-mono">
                {currencyMode === 'USD' ? '$' : '₹'}
              </span>
              <input
                type="number"
                min="1"
                step="any"
                value={manualAmount}
                onChange={(e) => setManualAmount(e.target.value)}
                placeholder="Type amount..."
                className="w-full pl-12 pr-4 py-4 text-3xl font-extrabold font-mono text-slate-950 rounded-2xl bg-white border-2 border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-500/20 transition-all shadow-inner"
              />
            </div>

            {/* Dual live converted figures */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
                <div className="text-[11px] text-slate-500 font-mono uppercase">Payable in USD:</div>
                <div className="text-xl font-bold font-mono text-slate-950 mt-0.5">
                  ${amountUSD.toLocaleString()} USD
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
                <div className="text-[11px] text-slate-500 font-mono uppercase">Payable in INR (₹100 = $1):</div>
                <div className="text-xl font-bold font-mono text-emerald-700 mt-0.5">
                  ₹{amountINR.toLocaleString()} INR
                </div>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-mono text-slate-400">Quick Values:</span>
              {[50, 100, 250, 500, 1000, 2500, 5000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    if (currencyMode === 'USD') {
                      setManualAmount(String(val));
                    } else {
                      setManualAmount(String(val * USD_TO_INR_RATE));
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-sky-100 border border-sky-200 text-slate-700 text-xs font-mono font-semibold transition-colors cursor-pointer"
                >
                  {currencyMode === 'USD' ? `$${val}` : `₹${(val * USD_TO_INR_RATE).toLocaleString()}`}
                </button>
              ))}
            </div>
          </div>

          {/* Supported Gateways Pills (Directly Clickable) */}
          <div>
            <div className="text-[11px] font-mono text-slate-500 uppercase font-semibold mb-2">
              Select Preferred Payment Method to Open:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => { setSelectedMethod('razorpay'); setIsPaymentOpen(true); }}
                className="p-3 rounded-2xl bg-slate-50 hover:bg-sky-50 border border-slate-200/80 hover:border-sky-300 text-center flex flex-col justify-center min-h-[68px] transition-all cursor-pointer group hover:scale-[1.02]"
              >
                <div className="text-xs font-bold text-slate-900 group-hover:text-sky-700 leading-tight">UPI QR Scanner</div>
                <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">GPay, PhonePe, Paytm</div>
              </button>

              <button
                type="button"
                onClick={() => { setSelectedMethod('bank'); setIsPaymentOpen(true); }}
                className="p-3 rounded-2xl bg-slate-50 hover:bg-sky-50 border border-slate-200/80 hover:border-sky-300 text-center flex flex-col justify-center min-h-[68px] transition-all cursor-pointer group hover:scale-[1.02]"
              >
                <div className="text-xs font-bold text-slate-900 group-hover:text-sky-700 leading-tight">SBI Bank Transfer</div>
                <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">RTGS, NEFT, IMPS</div>
              </button>

              <button
                type="button"
                onClick={() => { setSelectedMethod('stripe'); setIsPaymentOpen(true); }}
                className="p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50 border border-slate-200/80 hover:border-indigo-300 text-center flex flex-col justify-center min-h-[68px] transition-all cursor-pointer group hover:scale-[1.02]"
              >
                <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-700 leading-tight">Cards & Stripe</div>
                <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">Global Credit/Debit</div>
              </button>

              <button
                type="button"
                onClick={() => { setSelectedMethod('crypto'); setIsPaymentOpen(true); }}
                className="p-3 rounded-2xl bg-slate-50 hover:bg-purple-50 border border-slate-200/80 hover:border-purple-300 text-center flex flex-col justify-center min-h-[68px] transition-all cursor-pointer group hover:scale-[1.02]"
              >
                <div className="text-xs font-bold text-slate-900 group-hover:text-purple-700 leading-tight">Web3 USDT</div>
                <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">Polygon, TRC20, ETH</div>
              </button>
            </div>
          </div>

          {/* Checkout CTA */}
          <button
            onClick={() => setIsPaymentOpen(true)}
            disabled={parsedVal <= 0}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-600 via-indigo-600 to-teal-600 hover:from-sky-500 hover:to-teal-500 text-white font-bold text-base flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-sky-600/25 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            <CreditCard className="w-5 h-5" />
            <span>Open Payment Gateway ({currencyMode === 'USD' ? `$${amountUSD.toLocaleString()}` : `₹${amountINR.toLocaleString()}`})</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <Link to="/" className="hover:text-slate-800 transition-colors">← Return to Homepage</Link>
            <span>256-Bit SSL Escrow Encrypted</span>
          </div>

        </div>

      </div>

      {/* Embedded Universal Payment Modal with Manual Amount, Currency & Selected Method */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        initialAmount={parsedVal}
        initialCurrency={currencyMode}
        initialMethod={selectedMethod}
        serviceName={serviceName}
      />
    </div>
  );
}
