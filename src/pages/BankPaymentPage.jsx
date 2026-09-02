import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Building2, Copy, Check, CheckCircle2, ArrowLeft, ShieldCheck 
} from 'lucide-react';
import PaymentProofForm from '../components/PaymentProofForm';
import LivePaymentStatus from '../components/LivePaymentStatus';

const USD_TO_INR_RATE = 100;

const BANK_DETAILS = {
  beneficiary: 'Vikas Sunil Mishra',
  bankName: 'State Bank of India (SBI)',
  accountNo: '42483253120',
  accountType: 'Savings / Individual Business Account',
  ifscCode: 'SBIN0001903',
  swiftCode: 'SBININBBXXX',
  upiId: 'vikasmishraji87-2@oksbi',
  supportPhone: '+91 83698 04739',
  supportEmail: 'theunfilteredengineersupport@gmail.com'
};

export default function BankPaymentPage() {
  const [searchParams] = useSearchParams();

  const [currencyMode, setCurrencyMode] = useState(searchParams.get('currency')?.toUpperCase() || 'INR');
  const [manualAmount, setManualAmount] = useState(searchParams.get('amount') || '10000');
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
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-mono font-bold">
            <Building2 className="w-3.5 h-3.5 text-sky-400" />
            Official SBI Bank Portal
          </div>
        </div>

        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="size-16 rounded-2xl overflow-hidden bg-[#141414] border-2 border-[#141414] shadow-[4px_4px_0_0_#FF4D00] p-1.5 mx-auto mb-4 hover:scale-105 transition-transform">
            <img src="/assets/brand-logo.png" alt="The Unfiltered Engineer Official Brand Logo" className="w-full h-full object-contain rounded-xl" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
            State Bank of India <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600">Wire Portal</span>
          </h1>
          <p className="text-slate-600 text-sm mt-2">
            Direct RTGS, NEFT, IMPS, or SWIFT Wire Transfer directly to our official bank account.
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
                <div className="text-xs text-sky-700 font-mono font-semibold uppercase">Engagement Description</div>
                <h2 className="text-lg font-bold text-slate-950 mt-0.5">{serviceName}</h2>
                {clientParam && (
                  <div className="text-xs text-slate-500 mt-1">Issued for: <strong>{clientParam}</strong></div>
                )}
              </div>
              <div className="text-xs font-bold font-mono text-sky-800 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200 self-start sm:self-auto">
                $1 USD = ₹100 INR
              </div>
            </div>

            {/* Amount Box */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-50 via-sky-50/40 to-slate-50 border-2 border-slate-300 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <label className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider block">
                    Transfer Amount:
                  </label>
                  <div className="text-[11px] text-slate-500 font-mono">Platform standard: <strong>$1 = ₹100</strong></div>
                </div>

                {/* Currency Selector */}
                <div className="inline-flex items-center rounded-2xl bg-white border border-slate-300 p-1 shadow-xs self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setCurrencyMode('INR')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      currencyMode === 'INR' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    ₹ INR
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrencyMode('USD')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      currencyMode === 'USD' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    $ USD
                  </button>
                </div>
              </div>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl font-extrabold text-slate-400 font-mono">
                  {currencyMode === 'INR' ? '₹' : '$'}
                </span>
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={manualAmount}
                  onChange={(e) => setManualAmount(e.target.value)}
                  placeholder="Enter amount..."
                  className="w-full pl-12 pr-4 py-3.5 text-3xl font-extrabold font-mono text-slate-950 rounded-2xl bg-white border-2 border-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-500/20 transition-all shadow-inner"
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="font-mono text-slate-600">Total in INR: <strong className="text-slate-950 text-base font-bold font-mono">₹{amountINR.toLocaleString()} INR</strong></span>
                <span className="font-mono text-slate-500">Total in USD: <strong className="text-sky-700 font-bold font-mono">${amountUSD.toLocaleString()} USD</strong></span>
              </div>
            </div>

            {/* Official Banking Grid */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="text-xs font-mono font-bold text-slate-900 uppercase">
                  State Bank of India (SBI) Official Transfer Details
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                  RTGS / NEFT / IMPS / SWIFT
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                
                {/* Beneficiary Name */}
                <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                  <div className="text-slate-500 text-[11px]">Beneficiary Name</div>
                  <div className="font-bold text-slate-950 text-sm mt-0.5">{BANK_DETAILS.beneficiary}</div>
                </div>

                {/* Bank Name */}
                <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                  <div className="text-slate-500 text-[11px]">Bank Name</div>
                  <div className="font-bold text-slate-950 text-sm mt-0.5">{BANK_DETAILS.bankName}</div>
                </div>

                {/* Account Number with Copy */}
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="text-slate-500 text-[11px]">Account Number</div>
                    <div className="font-mono font-bold text-slate-950 text-sm mt-0.5 select-all">{BANK_DETAILS.accountNo}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(BANK_DETAILS.accountNo, 'acc')}
                    className="p-1.5 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'acc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'acc' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {/* IFSC Code with Copy */}
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="text-slate-500 text-[11px]">IFSC Code</div>
                    <div className="font-mono font-bold text-sky-700 text-sm mt-0.5 select-all">{BANK_DETAILS.ifscCode}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(BANK_DETAILS.ifscCode, 'ifsc')}
                    className="p-1.5 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'ifsc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'ifsc' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {/* UPI ID */}
                <div className="sm:col-span-2 p-3.5 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-between">
                  <div>
                    <div className="text-sky-800 text-[11px] font-mono">Linked Direct UPI ID</div>
                    <div className="font-mono font-bold text-sky-950 text-sm mt-0.5 select-all">{BANK_DETAILS.upiId}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(BANK_DETAILS.upiId, 'upi2')}
                    className="p-1.5 px-3 rounded-lg bg-white hover:bg-sky-100 text-sky-800 text-xs font-semibold flex items-center gap-1 cursor-pointer border border-sky-200"
                  >
                    {copiedKey === 'upi2' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'upi2' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

              </div>
            </div>

            {/* Payment Proof Submission Form */}
            <div className="pt-2 border-t border-slate-100">
              <div className="mb-3">
                <h3 className="text-sm font-bold text-slate-950">Submit Bank Transfer Proof / UTR for Approval</h3>
                <p className="text-xs text-slate-500">
                  After initiating your NEFT, RTGS, or IMPS transfer, enter the transaction reference number and attach your transfer slip below.
                </p>
              </div>

              <PaymentProofForm
                methodName="State Bank of India (SBI) Wire"
                network="RTGS / NEFT / IMPS Wire Transfer"
                amountUSD={amountUSD}
                amountINR={amountINR}
                currencyMode={currencyMode}
                serviceName={serviceName}
                defaultUtrLabel="Bank Reference / UTR / IMPS Number"
                utrPlaceholder="e.g. SBIN49382948291"
                onSubmitted={(p) => setActivePayment(p)}
              />
            </div>

            {/* All Dedicated Gateways List */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <div className="text-[11px] font-mono text-slate-500 uppercase font-bold">
                All Dedicated Payment Portals:
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <Link to={`/pay/upi?amount=${amountUSD}&currency=${currencyMode}`} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 font-medium">
                  📱 Google Pay UPI
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
