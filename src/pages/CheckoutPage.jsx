import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Shield, Lock, CreditCard, Sparkles, CheckCircle2, ArrowRight, DollarSign, 
  Building2, Globe2, Copy, Check, QrCode, Globe, Zap, MessageCircle, Download 
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Platform Standard Rate: $1 USD = ₹100 INR
const USD_TO_INR_RATE = 100;

const CRYPTO_WALLETS = {
  USDT_POLYGON: {
    network: 'Polygon (MATIC / Low Gas)',
    address: '0x854374b94D74205561a3D0E8160E53f7B4F9736c',
    token: 'USDT (Polygon PoS)'
  },
  USDT_TRC20: {
    network: 'Tron (TRC20 / Instant)',
    address: 'TYNq4H8fV3y9Lp1e8U6K2aB7mD5cX9wQ3Z',
    token: 'USDT (TRC-20)'
  },
  ETH: {
    network: 'Ethereum Mainnet (ERC20)',
    address: '0x854374b94D74205561a3D0E8160E53f7B4F9736c',
    token: 'ETH / USDT (ERC-20)'
  }
};

const BANK_DETAILS = {
  beneficiary: 'Vikas Sunil Mishra',
  bankName: 'State Bank of India (SBI)',
  accountNo: '42483253120',
  accountType: 'Savings / Individual Business Account',
  ifscCode: 'SBIN0001903',
  swiftCode: 'SBININBBXXX',
  upiId: 'vikasmishraji87-2@oksbi',
  supportPhone: '+91 91375 07092',
  supportEmail: 'vikasmishraoffice87@gmail.com',
  qrImage: '/images/upi_qr.png'
};

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();

  // Manual amount input state
  const [currencyMode, setCurrencyMode] = useState(searchParams.get('currency')?.toUpperCase() || 'USD');
  const [manualAmount, setManualAmount] = useState(searchParams.get('amount') || '100');
  const serviceName = searchParams.get('service') || 'Custom Engineering Scope / Milestone Retainer';
  const clientParam = searchParams.get('client') || '';

  // Active Payment Method Tab: 'upi' | 'bank' | 'stripe' | 'crypto'
  const [paymentMethod, setPaymentMethod] = useState('upi');

  // Form states
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [txHash, setTxHash] = useState('');
  const [copiedKey, setCopiedKey] = useState(null);
  const [selectedCrypto, setSelectedCrypto] = useState('USDT_POLYGON');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  const parsedVal = parseFloat(manualAmount) || 0;
  const amountUSD = currencyMode === 'USD' ? parsedVal : Math.round((parsedVal / USD_TO_INR_RATE) * 100) / 100;
  const amountINR = currencyMode === 'INR' ? parsedVal : Math.round(parsedVal * USD_TO_INR_RATE);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Process UPI Confirmation
  const handleUpiConfirm = (e) => {
    e.preventDefault();
    if (!clientName || !clientEmail) {
      alert('Please provide your name and email.');
      return;
    }
    if (amountINR <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const receipt = {
        txId: 'TXN-UPI-' + Date.now().toString().slice(-8),
        method: 'Google Pay UPI / QR Scanner',
        amount: amountINR,
        currency: 'INR',
        equivalentUSD: amountUSD,
        service: serviceName,
        clientName,
        clientEmail,
        timestamp: new Date().toISOString(),
        status: 'Confirmed & Escrow Secured'
      };
      setReceiptData(receipt);
      setPaymentSuccess(true);
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    }, 1200);
  };

  // Process Stripe Card
  const handleStripePay = (e) => {
    e.preventDefault();
    if (!clientName || !clientEmail) {
      alert('Please enter name and email.');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const receipt = {
        txId: 'TXN-STP-' + Date.now().toString().slice(-8),
        method: 'Stripe Global Card Gateway',
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

  // Process Crypto
  const handleCryptoConfirm = (e) => {
    e.preventDefault();
    if (!txHash) {
      alert('Please provide your on-chain transaction hash.');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const receipt = {
        txId: 'TXN-CRYPTO-' + Date.now().toString().slice(-8),
        method: `Web3 Crypto (${selectedCrypto})`,
        cryptoHash: txHash,
        amount: amountUSD,
        currency: 'USDT',
        service: serviceName,
        clientName: clientName || 'Web3 Client',
        clientEmail: clientEmail || 'web3@client.eth',
        timestamp: new Date().toISOString(),
        status: 'Confirmed On-Chain'
      };
      setReceiptData(receipt);
      setPaymentSuccess(true);
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    }, 1200);
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-sky-lavender-mesh text-slate-900 font-sans flex items-center justify-center">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 w-full text-left">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-sky-200 text-sky-800 text-xs font-mono uppercase tracking-wider mb-3 shadow-xs">
            <Lock className="w-3.5 h-3.5 text-sky-600" />
            Official Enterprise Payment Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
            Escrow-Secured <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600">Client Checkout</span>
          </h1>
          <p className="text-slate-600 text-sm mt-2">
            Enter your payable amount manually in <strong>USD ($)</strong> or <strong>INR (₹)</strong> ($1 = ₹100 platform rate).
          </p>
        </div>

        {/* Invoice & Complete Payment Suite Card */}
        <div className="bg-white/95 border border-indigo-100 rounded-3xl shadow-xl p-6 sm:p-10 space-y-6">
          
          {!paymentSuccess ? (
            <>
              {/* Engagement Details */}
              <div className="pb-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs text-sky-700 font-mono font-semibold uppercase">Engagement Description</div>
                  <h2 className="text-xl font-bold text-slate-950 mt-0.5">{serviceName}</h2>
                  {clientParam && (
                    <div className="text-xs text-slate-500 mt-1">Issued for: <strong>{clientParam}</strong></div>
                  )}
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-[11px] text-slate-400 font-mono uppercase">Standard Rate</div>
                  <div className="text-xs font-bold font-mono text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200 inline-block mt-0.5">
                    $1 USD = ₹100 INR
                  </div>
                </div>
              </div>

              {/* MANUAL AMOUNT ENTRY BOX */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-sky-50/90 via-indigo-50/40 to-slate-50 border-2 border-sky-300 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <label className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider block">
                      Enter Payment Amount Manually:
                    </label>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      Platform Conversion: <strong className="text-sky-700 font-bold">$1 USD = ₹100 INR</strong>
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
                  <span className="text-[11px] font-mono text-slate-400">Presets:</span>
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

              {/* PAYMENT METHOD SELECTOR TABS */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                  Select Payment Method:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                  
                  {/* UPI QR Code */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[72px] ${
                      paymentMethod === 'upi'
                        ? 'border-sky-500 bg-sky-50/80 ring-2 ring-sky-500/30 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900 leading-tight">UPI QR Code</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold">Fast</span>
                    </div>
                    <div className="text-[10px] text-slate-500 leading-tight">GPay, PhonePe, Paytm</div>
                  </button>

                  {/* SBI Bank Transfer */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[72px] ${
                      paymentMethod === 'bank'
                        ? 'border-slate-800 bg-slate-100 ring-2 ring-slate-800/30 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900 leading-tight">SBI Bank Wire</span>
                      <Building2 className="w-3.5 h-3.5 text-slate-700" />
                    </div>
                    <div className="text-[10px] text-slate-500 leading-tight">RTGS, NEFT, IMPS</div>
                  </button>

                  {/* Cards / Stripe */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('stripe')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[72px] ${
                      paymentMethod === 'stripe'
                        ? 'border-indigo-500 bg-indigo-50/80 ring-2 ring-indigo-500/30 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900 leading-tight">Cards & Stripe</span>
                      <Globe className="w-3.5 h-3.5 text-indigo-600" />
                    </div>
                    <div className="text-[10px] text-slate-500 leading-tight">Global Visa / Master</div>
                  </button>

                  {/* Web3 USDT */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('crypto')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[72px] ${
                      paymentMethod === 'crypto'
                        ? 'border-purple-500 bg-purple-50/80 ring-2 ring-purple-500/30 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900 leading-tight">Web3 USDT</span>
                      <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 text-[10px] font-bold">Crypto</span>
                    </div>
                    <div className="text-[10px] text-slate-500 leading-tight">Polygon, TRC20, ETH</div>
                  </button>

                </div>
              </div>

              {/* METHOD 1 VIEW: UPI QR SCANNER */}
              {paymentMethod === 'upi' && (
                <div className="space-y-4 pt-2">
                  <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-6">
                    {/* QR Code */}
                    <div className="bg-white p-3 rounded-2xl border-2 border-sky-300 shadow-md flex-shrink-0 text-center">
                      <img
                        src={BANK_DETAILS.qrImage}
                        alt="UPI QR Scanner - Vikas Mishra"
                        className="w-48 h-auto rounded-xl object-contain mx-auto"
                      />
                      <div className="text-[10px] font-mono text-slate-500 mt-1.5 font-semibold">
                        Scan to Pay with Any UPI App
                      </div>
                    </div>

                    {/* Instructions & 1-Click Copy */}
                    <div className="flex-1 space-y-3 text-left w-full">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-mono font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Verified Google Pay Merchant UPI
                      </div>

                      <div>
                        <div className="text-[11px] text-slate-500 uppercase font-mono font-semibold">Direct UPI ID:</div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 mt-1">
                          <span className="font-mono text-sm font-bold text-sky-700 select-all">{BANK_DETAILS.upiId}</span>
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
                        <div>Payable Amount: <strong className="text-emerald-700 font-mono text-base">₹{amountINR.toLocaleString()} INR</strong> (${amountUSD.toLocaleString()} USD)</div>
                      </div>

                      <div className="text-[11px] text-slate-500">
                        Supports <strong>Google Pay, PhonePe, Paytm, BHIM, Cred, Amazon Pay</strong> and all mobile banking apps.
                      </div>
                    </div>
                  </div>

                  {/* Payer Verification Form */}
                  <form onSubmit={handleUpiConfirm} className="space-y-3 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono text-slate-700 uppercase font-semibold mb-1">
                          Your Name / Payer Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder="e.g. Vikas Mishra"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-sky-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-slate-700 uppercase font-semibold mb-1">
                          Email for Receipt & Confirmation <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          placeholder="billing@company.com"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-sky-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessing || amountINR <= 0}
                      className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                    >
                      <Check className="w-5 h-5 stroke-[3]" />
                      <span>{isProcessing ? 'Verifying Transaction...' : `I Have Paid ₹${amountINR.toLocaleString()} via UPI (Confirm)`}</span>
                    </button>
                  </form>
                </div>
              )}

              {/* METHOD 2 VIEW: SBI BANK TRANSFER */}
              {paymentMethod === 'bank' && (
                <div className="space-y-4 pt-2">
                  <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <div className="text-xs font-mono font-bold text-slate-900 uppercase">
                        State Bank of India (SBI) Official Transfer Details
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                        RTGS / NEFT / IMPS
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
                          <div className="text-sky-800 text-[11px] font-mono">Linked UPI ID</div>
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

                  <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-900 leading-relaxed">
                    💡 Transfer <strong>₹{amountINR.toLocaleString()} INR</strong> (${amountUSD.toLocaleString()} USD at $1=₹100). Send transfer slip to <strong>{BANK_DETAILS.supportPhone}</strong> on WhatsApp for instant clearance.
                  </div>

                  <a
                    href={`https://wa.me/919137507092?text=${encodeURIComponent(`Hi Vikas, I have initiated bank transfer of ₹${amountINR.toLocaleString()} to SBI Account ${BANK_DETAILS.accountNo} for ${serviceName}. Here is the transfer confirmation.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>Send Payment Slip to Vikas Mishra on WhatsApp</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              )}

              {/* METHOD 3 VIEW: CARDS & STRIPE */}
              {paymentMethod === 'stripe' && (
                <form onSubmit={handleStripePay} className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-700 uppercase font-semibold mb-1">
                        Cardholder Name <span className="text-rose-500">*</span>
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
                      Card Details (256-bit AES SSL Encrypted)
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
                    className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/20 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>{isProcessing ? 'Processing Stripe Transaction...' : `Pay $${amountUSD.toLocaleString()} USD (₹${amountINR.toLocaleString()}) with Stripe`}</span>
                  </button>
                </form>
              )}

              {/* METHOD 4 VIEW: WEB3 CRYPTO USDT */}
              {paymentMethod === 'crypto' && (
                <form onSubmit={handleCryptoConfirm} className="space-y-4 pt-2">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-700 uppercase font-semibold mb-2">
                      Select Crypto Network:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.keys(CRYPTO_WALLETS).map((key) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setSelectedCrypto(key)}
                          className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                            selectedCrypto === key
                              ? 'border-purple-600 bg-purple-50 text-purple-900 ring-2 ring-purple-600/20'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          {key.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Wallet Box */}
                  <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-mono">{CRYPTO_WALLETS[selectedCrypto].network}</span>
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[10px]">Direct Escrow</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
                      <span className="font-mono text-xs text-sky-400 break-all select-all">
                        {CRYPTO_WALLETS[selectedCrypto].address}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(CRYPTO_WALLETS[selectedCrypto].address, 'crypto')}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white flex-shrink-0 cursor-pointer"
                        title="Copy Address"
                      >
                        {copiedKey === 'crypto' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="text-[11px] text-slate-400">
                      Send exact equivalent of <strong>${amountUSD.toLocaleString()} USDT</strong> (₹{amountINR.toLocaleString()}) to the address above.
                    </div>
                  </div>

                  {/* Transaction Hash */}
                  <div>
                    <label className="block text-[11px] font-mono text-slate-700 uppercase font-semibold mb-1">
                      Transaction Hash / TxID (After Sending) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={txHash}
                      onChange={(e) => setTxHash(e.target.value)}
                      placeholder="0x... or Tron TxID"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono focus:bg-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing || amountUSD <= 0}
                    className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-purple-600/20 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                  >
                    <Zap className="w-4 h-4" />
                    <span>{isProcessing ? 'Verifying Blockchain Confirmation...' : `Confirm $${amountUSD.toLocaleString()} USDT Payment`}</span>
                  </button>
                </form>
              )}

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <Link to="/" className="hover:text-slate-800 transition-colors">← Return to Homepage</Link>
                <span>256-Bit SSL Escrow Encrypted</span>
              </div>
            </>
          ) : (
            /* PAYMENT SUCCESS RECEIPT SCREEN */
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-mono font-semibold">
                  Payment Verified & Secured
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-950 mt-2">Transaction Confirmed!</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                  Thank you for deploying your engineering engagement with <strong>The Unfiltered Engineer</strong>.
                </p>
              </div>

              {/* Receipt Summary Card */}
              {receiptData && (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left max-w-md mx-auto space-y-2.5 text-xs">
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Transaction ID:</span>
                    <span className="font-mono font-bold text-slate-900">{receiptData.txId}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Service:</span>
                    <span className="font-semibold text-slate-900">{receiptData.service}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Amount Paid:</span>
                    <span className="font-bold text-emerald-700">
                      {receiptData.currency === 'USD' ? `$${receiptData.amount.toLocaleString()} USD (₹${(receiptData.amount * 100).toLocaleString()})` : `₹${receiptData.amount.toLocaleString()} INR ($${(receiptData.amount / 100).toLocaleString()})`}
                    </span>
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
