import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Check, Copy, CheckCircle2, ArrowLeft, Building2, CreditCard, Zap, ShieldCheck 
} from 'lucide-react';
import PaymentProofForm from '../components/PaymentProofForm';
import LivePaymentStatus from '../components/LivePaymentStatus';

const USD_TO_INR_RATE = 100;

const BANK_DETAILS = {
  beneficiary: 'Vikas Sunil Mishra',
  bankName: 'State Bank of India (SBI)',
  accountNo: '42483253120',
  ifscCode: 'SBIN0001903',
  upiId: 'vikasmishraji87-2@oksbi',
  supportPhone: '+91 83698 04739',
  supportEmail: 'theunfilteredengineersupport@gmail.com',
  qrImage: '/images/upi_qr.png'
};

export default function UPIPaymentPage() {
  const [searchParams] = useSearchParams();

  const [currencyMode, setCurrencyMode] = useState(searchParams.get('currency')?.toUpperCase() || 'USD');
  const [manualAmount, setManualAmount] = useState(searchParams.get('amount') || '100');
  const serviceName = searchParams.get('service') || 'Custom Engineering Scope / Milestone Retainer';
  const clientParam = searchParams.get('client') || '';

  const [activePayment, setActivePayment] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  const parsedVal = parseFloat(manualAmount) || 0;
  const amountUSD = currencyMode === 'USD' ? parsedVal : Math.round((parsedVal / USD_TO_INR_RATE) * 100) / 100;
  const amountINR = currencyMode === 'INR' ? parsedVal : Math.round(parsedVal * USD_TO_INR_RATE);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="min-h-screen pt-28 pb-24 bg-[#FAF7EE] text-[#141414] font-sans flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 w-full text-left">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/checkout" className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-slate-600 hover:text-sky-700 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Payment Methods</span>
          </Link>
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-mono font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Direct UPI Gateway
          </div>
        </div>

        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
            UPI <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-sky-600">QR Scanner Portal</span>
          </h1>
          <p className="text-slate-600 text-sm mt-2">
            Scan with <strong>Google Pay, PhonePe, Paytm, BHIM, Cred</strong> or any bank UPI app.
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
                <div className="text-xs text-emerald-700 font-mono font-semibold uppercase">Engagement Description</div>
                <h2 className="text-lg font-bold text-slate-950 mt-0.5">{serviceName}</h2>
                {clientParam && (
                  <div className="text-xs text-slate-500 mt-1">Issued for: <strong>{clientParam}</strong></div>
                )}
              </div>
              <div className="text-xs font-bold font-mono text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 self-start sm:self-auto">
                $1 USD = ₹100 INR
              </div>
            </div>

            {/* Amount Box */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-50/90 via-sky-50/40 to-slate-50 border-2 border-emerald-300 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <label className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider block">
                    Payable Amount:
                  </label>
                  <div className="text-[11px] text-slate-500 font-mono">Platform standard: <strong>$1 = ₹100</strong></div>
                </div>

                {/* Currency Selector */}
                <div className="inline-flex items-center rounded-2xl bg-white border border-emerald-300 p-1 shadow-xs self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setCurrencyMode('USD')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      currencyMode === 'USD' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    $ USD
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrencyMode('INR')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      currencyMode === 'INR' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
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
                  className="w-full pl-12 pr-4 py-3.5 text-3xl font-extrabold font-mono text-slate-950 rounded-2xl bg-white border-2 border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all shadow-inner"
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="font-mono text-slate-600">Total in INR: <strong className="text-emerald-700 text-base font-bold font-mono">₹{amountINR.toLocaleString()} INR</strong></span>
                <span className="font-mono text-slate-500">Total in USD: <strong className="text-slate-900 font-bold font-mono">${amountUSD.toLocaleString()} USD</strong></span>
              </div>
            </div>

            {/* QR Scanner & Details */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-6">
              <div className="bg-white p-3 rounded-2xl border-2 border-emerald-400 shadow-md flex-shrink-0 text-center">
                <img
                  src={BANK_DETAILS.qrImage}
                  alt="UPI QR Scanner - Vikas Mishra"
                  className="w-52 h-auto rounded-xl object-contain mx-auto"
                />
                <div className="text-[10px] font-mono text-slate-600 mt-1.5 font-bold">
                  Scan with Any UPI App
                </div>
              </div>

              <div className="flex-1 space-y-3 text-left w-full">
                <div>
                  <div className="text-[11px] text-slate-500 uppercase font-mono font-semibold">Merchant UPI ID:</div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 mt-1">
                    <span className="font-mono text-sm font-bold text-emerald-700 select-all">{BANK_DETAILS.upiId}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(BANK_DETAILS.upiId, 'upi')}
                      className="p-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'upi' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'upi' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div className="text-xs text-slate-700 space-y-1">
                  <div>Beneficiary: <strong className="text-slate-950">{BANK_DETAILS.beneficiary}</strong></div>
                  <div>Payable Amount: <strong className="text-emerald-700 font-mono text-base">₹{amountINR.toLocaleString()} INR</strong></div>
                </div>
              </div>
            </div>

            {/* Payment Proof Submission Form */}
            <div className="pt-2 border-t border-slate-100">
              <div className="mb-3">
                <h3 className="text-sm font-bold text-slate-950">Submit Payment Proof for Instant Approval</h3>
                <p className="text-xs text-slate-500">
                  After paying on your UPI app, paste the 12-digit UTR number or attach a screenshot. Vikas Mishra will receive an instant approval request.
                </p>
              </div>

              <PaymentProofForm
                methodName="UPI QR Scanner"
                network="GPay / PhonePe / Paytm UPI"
                amountUSD={amountUSD}
                amountINR={amountINR}
                currencyMode={currencyMode}
                serviceName={serviceName}
                defaultUtrLabel="12-Digit UPI UTR / Transaction ID"
                utrPlaceholder="e.g. 423948293849"
                onSubmitted={(p) => setActivePayment(p)}
              />
            </div>

            {/* All Dedicated Gateways List */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <div className="text-[11px] font-mono text-slate-500 uppercase font-bold">
                All Dedicated Payment Portals:
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <Link to={`/pay/bank?amount=${amountUSD}&currency=${currencyMode}`} className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100 font-medium">
                  🏦 SBI Wire
                </Link>
                <Link to={`/pay/card?amount=${amountUSD}&currency=${currencyMode}`} className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-200 hover:bg-indigo-100 font-medium">
                  💳 Stripe Cards
                </Link>
                <Link to={`/pay/polygon?amount=${amountUSD}&currency=${currencyMode}`} className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100 font-medium">
                  ⬡ Polygon (POL)
                </Link>
                <Link to={`/pay/bnb?amount=${amountUSD}&currency=${currencyMode}`} className="px-2.5 py-1 rounded-lg bg-yellow-50 text-yellow-800 border border-yellow-200 hover:bg-yellow-100 font-medium">
                  🔶 BNB Chain
                </Link>
                <Link to={`/pay/tron?amount=${amountUSD}&currency=${currencyMode}`} className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100 font-medium">
                  ₮ Tron (TRC-20)
                </Link>
                <Link to={`/pay/sol?amount=${amountUSD}&currency=${currencyMode}`} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 font-medium">
                  ◎ Solana
                </Link>
                <Link to={`/pay/btc?amount=${amountUSD}&currency=${currencyMode}`} className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 font-medium">
                  ₿ Bitcoin
                </Link>
                <Link to={`/pay/eth?amount=${amountUSD}&currency=${currencyMode}`} className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100 font-medium">
                  Ξ Ethereum
                </Link>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
