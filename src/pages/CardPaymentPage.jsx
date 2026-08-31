import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  CreditCard, Lock, Globe, ArrowLeft, ShieldCheck 
} from 'lucide-react';
import PaymentProofForm from '../components/PaymentProofForm';
import LivePaymentStatus from '../components/LivePaymentStatus';

const USD_TO_INR_RATE = 100;

export default function CardPaymentPage() {
  const [searchParams] = useSearchParams();

  const [currencyMode, setCurrencyMode] = useState(searchParams.get('currency')?.toUpperCase() || 'USD');
  const [manualAmount, setManualAmount] = useState(searchParams.get('amount') || '100');
  const serviceName = searchParams.get('service') || 'Custom Engineering Scope / Milestone Retainer';
  const clientParam = searchParams.get('client') || '';

  const [activePayment, setActivePayment] = useState(null);

  const parsedVal = parseFloat(manualAmount) || 0;
  const amountUSD = currencyMode === 'USD' ? parsedVal : Math.round((parsedVal / USD_TO_INR_RATE) * 100) / 100;
  const amountINR = currencyMode === 'INR' ? parsedVal : Math.round(parsedVal * USD_TO_INR_RATE);

  return (
    <div className="min-h-screen pt-32 pb-24 bg-sky-lavender-mesh text-slate-900 font-sans flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 w-full text-left">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/checkout" className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-slate-600 hover:text-sky-700 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Payment Methods</span>
          </Link>
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-mono font-bold">
            <Globe className="w-3.5 h-3.5 text-indigo-600" />
            Global Stripe Gateway
          </div>
        </div>

        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
            Card & <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-600">Stripe Gateway</span>
          </h1>
          <p className="text-slate-600 text-sm mt-2">
            Instant 256-bit AES encrypted settlement via Visa, Mastercard, American Express, or Apple Pay.
          </p>
        </div>

        {/* Main Content Area */}
        {activePayment ? (
          <LivePaymentStatus 
            payment={activePayment} 
            onReset={() => setActivePayment(null)} 
          />
        ) : (
          <div className="bg-white/95 border border-indigo-100 rounded-3xl shadow-xl p-6 sm:p-10 space-y-6">
            
            {/* Engagement Summary */}
            <div className="pb-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs text-indigo-700 font-mono font-semibold uppercase">Engagement Description</div>
                <h2 className="text-lg font-bold text-slate-950 mt-0.5">{serviceName}</h2>
                {clientParam && (
                  <div className="text-xs text-slate-500 mt-1">Issued for: <strong>{clientParam}</strong></div>
                )}
              </div>
              <div className="text-xs font-bold font-mono text-indigo-800 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200 self-start sm:self-auto">
                $1 USD = ₹100 INR
              </div>
            </div>

            {/* Amount Box */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-50/90 via-sky-50/40 to-slate-50 border-2 border-indigo-300 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <label className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider block">
                    Card Charge Amount:
                  </label>
                  <div className="text-[11px] text-slate-500 font-mono">Platform standard: <strong>$1 = ₹100</strong></div>
                </div>

                <div className="inline-flex items-center rounded-2xl bg-white border border-indigo-300 p-1 shadow-xs self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setCurrencyMode('USD')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      currencyMode === 'USD' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    $ USD
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrencyMode('INR')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      currencyMode === 'INR' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    ₹ INR
                  </button>
                </div>
              </div>

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
                  placeholder="Enter amount..."
                  className="w-full pl-12 pr-4 py-3.5 text-3xl font-extrabold font-mono text-slate-950 rounded-2xl bg-white border-2 border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all shadow-inner"
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="font-mono text-slate-600">Charge in USD: <strong className="text-indigo-700 text-base font-bold font-mono">${amountUSD.toLocaleString()} USD</strong></span>
                <span className="font-mono text-slate-500">Equivalent in INR: <strong className="text-slate-900 font-bold font-mono">₹{amountINR.toLocaleString()} INR</strong></span>
              </div>
            </div>

            {/* Card Information & Encrypted Details */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="text-xs font-mono font-bold text-slate-900 uppercase">
                  Global Credit & Debit Cards (256-bit AES SSL)
                </div>
                <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-mono font-bold">
                  Instant Settlement
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-600 mb-1 font-semibold">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="4242 •••• •••• 4242"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-mono focus:border-indigo-500 focus:outline-none"
                    />
                    <CreditCard className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-600 mb-1 font-semibold">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM / YY"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-mono focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-slate-600 mb-1 font-semibold">
                      Security CVC
                    </label>
                    <input
                      type="text"
                      placeholder="CVC"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-mono focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Proof Submission Form */}
            <div className="pt-2 border-t border-slate-100">
              <div className="mb-3">
                <h3 className="text-sm font-bold text-slate-950">Submit Card Authorization / Reference for Executive Approval</h3>
                <p className="text-xs text-slate-500">
                  Enter your cardholder details, reference code or receipt screenshot to initiate immediate executive verification.
                </p>
              </div>

              <PaymentProofForm
                methodName="Stripe Global Cards"
                network="Visa / Mastercard / Amex"
                amountUSD={amountUSD}
                amountINR={amountINR}
                currencyMode={currencyMode}
                serviceName={serviceName}
                defaultUtrLabel="Stripe Payment Reference / Authorization ID"
                utrPlaceholder="e.g. ch_3N28492842948291"
                onSubmitted={(p) => setActivePayment(p)}
              />
            </div>

            {/* Other Portals Badges */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <div className="text-[11px] font-mono text-slate-500 uppercase font-bold">
                All Dedicated Payment Portals:
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <Link to={`/pay/upi?amount=${amountUSD}&currency=${currencyMode}`} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 font-medium">
                  📱 Google Pay UPI
                </Link>
                <Link to={`/pay/bank?amount=${amountUSD}&currency=${currencyMode}`} className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100 font-medium">
                  🏦 SBI Bank Wire
                </Link>
                <Link to={`/pay/polygon?amount=${amountUSD}&currency=${currencyMode}`} className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100 font-medium">
                  ⬡ Polygon (POL)
                </Link>
                <Link to={`/pay/bnb?amount=${amountUSD}&currency=${currencyMode}`} className="px-2.5 py-1 rounded-lg bg-yellow-50 text-yellow-800 border border-yellow-200 hover:bg-yellow-100 font-medium">
                  🔶 BNB Chain
                </Link>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
