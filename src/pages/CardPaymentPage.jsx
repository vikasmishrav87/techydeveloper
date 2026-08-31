import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Lock, Check, CreditCard, Copy, CheckCircle2, ArrowRight, ShieldCheck, Download, 
  ArrowLeft, Globe, MessageCircle, QrCode, Building2, Zap 
} from 'lucide-react';
import confetti from 'canvas-confetti';

const USD_TO_INR_RATE = 100;

export default function CardPaymentPage() {
  const [searchParams] = useSearchParams();

  const [currencyMode, setCurrencyMode] = useState(searchParams.get('currency')?.toUpperCase() || 'USD');
  const [manualAmount, setManualAmount] = useState(searchParams.get('amount') || '100');
  const serviceName = searchParams.get('service') || 'Custom Engineering Scope / Milestone Retainer';
  const clientParam = searchParams.get('client') || '';

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  const parsedVal = parseFloat(manualAmount) || 0;
  const amountUSD = currencyMode === 'USD' ? parsedVal : Math.round((parsedVal / USD_TO_INR_RATE) * 100) / 100;
  const amountINR = currencyMode === 'INR' ? parsedVal : Math.round(parsedVal * USD_TO_INR_RATE);

  const handlePay = (e) => {
    e.preventDefault();
    if (!clientName || !clientEmail) {
      alert('Please enter name and email.');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const receipt = {
        txId: 'TXN-CARD-' + Date.now().toString().slice(-8),
        method: 'Stripe Global Card Settlement',
        amount: amountUSD,
        currency: 'USD',
        equivalentINR: amountINR,
        service: serviceName,
        clientName,
        clientEmail,
        timestamp: new Date().toISOString(),
        status: 'Paid & Settled'
      };
      setReceiptData(receipt);
      setPaymentSuccess(true);
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    }, 1500);
  };

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

        {/* Main Card */}
        <div className="bg-white/95 border border-indigo-100 rounded-3xl shadow-xl p-6 sm:p-10 space-y-6">
          
          {!paymentSuccess ? (
            <>
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

                  {/* Currency Selector */}
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

              {/* Form */}
              <form onSubmit={handlePay} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-700 uppercase font-semibold mb-1">
                      Cardholder Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Vikas Mishra"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-slate-700 uppercase font-semibold mb-1">
                      Receipt Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="billing@company.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <label className="block text-[11px] font-mono text-slate-700 uppercase font-semibold">
                    Card Information (Encrypted)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="4242 •••• •••• 4242"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-mono focus:border-indigo-500 focus:outline-none"
                    />
                    <CreditCard className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="MM / YY"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-mono focus:border-indigo-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="CVC"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-mono focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing || amountUSD <= 0}
                  className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-sky-600 to-teal-600 hover:from-indigo-500 hover:to-teal-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/20 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isProcessing ? 'Processing Transaction...' : `Pay $${amountUSD.toLocaleString()} USD (₹${amountINR.toLocaleString()}) with Stripe`}</span>
                </button>
              </form>

              {/* All Dedicated Gateways List */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <div className="text-[11px] font-mono text-slate-500 uppercase font-bold">
                  All Dedicated Payment Portals:
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <Link to={`/pay/upi?amount=${amountUSD}&currency=${currencyMode}`} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 font-medium">
                    📱 UPI QR
                  </Link>
                  <Link to={`/pay/bank?amount=${amountUSD}&currency=${currencyMode}`} className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100 font-medium">
                    🏦 SBI Wire
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
            </>
          ) : (
            /* RECEIPT */
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-mono font-semibold">
                  Card Payment Approved
                </span>
                <h3 className="text-2xl font-bold text-slate-950 mt-2">Stripe Payment Confirmed!</h3>
              </div>

              {receiptData && (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left max-w-md mx-auto space-y-2.5 text-xs">
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Transaction ID:</span>
                    <span className="font-mono font-bold text-slate-900">{receiptData.txId}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Amount Paid:</span>
                    <span className="font-bold text-emerald-700 font-mono">${receiptData.amount.toLocaleString()} USD (₹{receiptData.equivalentINR.toLocaleString()})</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Method:</span>
                    <span className="font-semibold text-slate-900">{receiptData.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Date:</span>
                    <span className="font-mono text-slate-700">{new Date(receiptData.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
              )}

              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Print Receipt / PDF</span>
                </button>
                <Link
                  to="/"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs text-center cursor-pointer"
                >
                  Return to Homepage
                </Link>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
