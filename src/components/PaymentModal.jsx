import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  X, Check, ShieldCheck, CreditCard, QrCode, Globe, Building2, Copy, CheckCircle2, 
  Sparkles, Lock, ArrowRight, DollarSign, RefreshCw, Download, ExternalLink, Zap
} from 'lucide-react';
import { logSecurityEvent } from '../services/storageService';
import confetti from 'canvas-confetti';
import PaymentProofForm from './PaymentProofForm';
import LivePaymentStatus from './LivePaymentStatus';

const CRYPTO_WALLETS = {
  MATIC: {
    id: 'MATIC',
    name: 'Polygon (MATIC / POL)',
    network: 'Polygon Network (PoS Only)',
    address: '0xaf3c37fBD1091175f164d753d53Cc420f7bF2aB3',
    token: 'Native POL (MATIC) • USDT (Polygon) • USDC (Polygon)',
    qrImage: '/images/matic_qr.png',
    warning: 'CRITICAL: Send ONLY via the Polygon Network (PoS). Sending via any other network will result in permanent asset loss.'
  },
  BSC: {
    id: 'BSC',
    name: 'BNB Smart Chain (BEP-20)',
    network: 'BNB Smart Chain (BEP-20 Only)',
    address: '0xaf3c37fBD1091175f164d753d53Cc420f7bF2aB3',
    token: 'Native BNB • USDT (BEP-20) • USDC (BEP-20)',
    qrImage: '/images/bnb_qr.png',
    warning: 'CRITICAL: Send ONLY via the BNB Smart Chain (BEP-20). Sending via any other network will result in permanent asset loss.'
  },
  TRX: {
    id: 'TRX',
    name: 'Tron (TRC-20)',
    network: 'Tron Network (TRC-20 Only)',
    address: 'TEFjW6TYrSZBsZ7rTYAt7WAvCagqZFBz8F',
    token: 'USDT (TRC-20) • TRX',
    qrImage: '/images/trx_qr.png',
    warning: 'CRITICAL: Send ONLY via the Tron Network (TRC-20). Sending via any other network will result in permanent asset loss.'
  },
  SOL: {
    id: 'SOL',
    name: 'Solana (SOL)',
    network: 'Solana Network (SOL / SPL Only)',
    address: '6VuZVB62JPNi3kKoyHSjdGJzeTysKNawi3VTdVqwLzcd',
    token: 'Native SOL • USDT (SPL) • USDC (SPL)',
    qrImage: '/images/sol_qr.png',
    warning: 'CRITICAL: Send ONLY via the Solana Network (SPL). Sending via any other network will result in permanent asset loss.'
  },
  BTC: {
    id: 'BTC',
    name: 'Bitcoin (BTC)',
    network: 'Bitcoin Network (Native SegWit Only)',
    address: 'bc1qn3xhw0lptpj0gaecqs6lccw7va3fk9wczvhcn4',
    token: 'Native Bitcoin (BTC)',
    qrImage: '/images/btc_qr.png',
    warning: 'CRITICAL: Send ONLY via native Bitcoin Network. Sending via any other network will result in permanent asset loss.'
  },
  ETH: {
    id: 'ETH',
    name: 'Ethereum (ERC-20)',
    network: 'Ethereum Mainnet (ERC-20 Only)',
    address: '0xaf3c37fBD1091175f164d753d53Cc420f7bF2aB3',
    token: 'ETH • USDT • USDC (ERC-20)',
    qrImage: '/images/eth_qr.png',
    warning: 'CRITICAL: Send ONLY via Ethereum Network (ERC-20). Any transfer from other networks will result in permanent asset loss.'
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

// Platform Standard Rate: $1 USD = ₹100 INR
const USD_TO_INR_RATE = 100;

export default function PaymentModal({
  isOpen,
  onClose,
  initialAmount = '',
  initialCurrency = 'USD',
  initialMethod = 'razorpay',
  serviceName = 'Custom Engineering Retainer'
}) {
  const [paymentMethod, setPaymentMethod] = useState(initialMethod || 'razorpay'); // 'razorpay' | 'stripe' | 'crypto' | 'bank'
  const [currencyMode, setCurrencyMode] = useState(initialCurrency); // 'USD' | 'INR'
  const [rawAmountInput, setRawAmountInput] = useState(initialAmount ? String(initialAmount) : '100');
  
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [txHash, setTxHash] = useState('');
  const [copiedKey, setCopiedKey] = useState(null);
  const [selectedCrypto, setSelectedCrypto] = useState('MATIC');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [activeLivePayment, setActiveLivePayment] = useState(null);

  useEffect(() => {
    if (initialAmount) setRawAmountInput(String(initialAmount));
    if (initialCurrency) setCurrencyMode(initialCurrency);
    if (initialMethod) setPaymentMethod(initialMethod);
  }, [initialAmount, initialCurrency, initialMethod]);

  if (!isOpen) return null;

  // Calculate synchronized amounts using $1 = ₹100
  const parsedValue = parseFloat(rawAmountInput) || 0;
  const amountUSD = currencyMode === 'USD' ? parsedValue : Math.round((parsedValue / USD_TO_INR_RATE) * 100) / 100;
  const amountINR = currencyMode === 'INR' ? parsedValue : Math.round(parsedValue * USD_TO_INR_RATE);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // 1. Process Razorpay / UPI Payment
  const handleRazorpayPayment = async (e) => {
    e.preventDefault();
    if (!clientName || !clientEmail) {
      alert('Please provide your name and email.');
      return;
    }
    if (amountINR <= 0) {
      alert('Please enter a valid amount to pay.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const receipt = {
        txId: 'TXN-RZP-' + Date.now().toString().slice(-8),
        method: 'Razorpay / UPI / Cards',
        amount: amountINR,
        currency: 'INR',
        equivalentUSD: amountUSD,
        service: serviceName,
        clientName,
        clientEmail,
        clientCompany,
        timestamp: new Date().toISOString(),
        status: 'Confirmed & Escrow Secured'
      };

      try {
        const existing = JSON.parse(localStorage.getItem('ue_payment_transactions_v1') || '[]');
        existing.unshift(receipt);
        localStorage.setItem('ue_payment_transactions_v1', JSON.stringify(existing));
      } catch (e) {}

      setReceiptData(receipt);
      setPaymentSuccess(true);
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    }, 1500);
  };

  // 2. Process Stripe Global Card Payment
  const handleStripePayment = (e) => {
    e.preventDefault();
    if (!clientName || !clientEmail) {
      alert('Please provide your name and email.');
      return;
    }
    if (amountUSD <= 0) {
      alert('Please enter a valid amount.');
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
        clientCompany,
        timestamp: new Date().toISOString(),
        status: 'Paid & Settled'
      };

      try {
        const existing = JSON.parse(localStorage.getItem('ue_payment_transactions_v1') || '[]');
        existing.unshift(receipt);
        localStorage.setItem('ue_payment_transactions_v1', JSON.stringify(existing));
      } catch (e) {}

      setReceiptData(receipt);
      setPaymentSuccess(true);
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    }, 1500);
  };

  // 3. Confirm Crypto / USDT Payment
  const handleCryptoConfirm = (e) => {
    e.preventDefault();
    if (!txHash) {
      alert('Please enter your transaction hash / TxID.');
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

      try {
        const existing = JSON.parse(localStorage.getItem('ue_payment_transactions_v1') || '[]');
        existing.unshift(receipt);
        localStorage.setItem('ue_payment_transactions_v1', JSON.stringify(existing));
      } catch (e) {}

      setReceiptData(receipt);
      setPaymentSuccess(true);
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto font-sans animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-indigo-100 overflow-hidden my-8 text-left">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-[#0B1120] to-indigo-950 text-white p-6 sm:p-7 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-400/10 border border-sky-400/20 text-sky-300 text-[10px] font-mono uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3 text-sky-400" />
                Zero-Trust Secure Gateway
              </div>
              <h3 className="text-xl font-bold text-white mt-1">Manual Escrow Payment Portal</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8">
          
          {activeLivePayment ? (
            <LivePaymentStatus 
              payment={activeLivePayment} 
              onReset={() => setActiveLivePayment(null)} 
            />
          ) : !paymentSuccess ? (
            <div>
              
              {/* MANUAL AMOUNT ENTRY BOX */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-50 via-indigo-50/40 to-slate-50 border-2 border-sky-200/90 mb-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <label className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider block">
                      Enter Payment Amount Manually
                    </label>
                    <span className="text-[11px] text-slate-500 font-mono">Platform Conversion: <strong>$1 USD = ₹100 INR</strong></span>
                  </div>

                  {/* Currency Mode Selector */}
                  <div className="inline-flex items-center rounded-xl bg-white border border-sky-300 p-1 shadow-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrencyMode('USD');
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        currencyMode === 'USD' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      $ USD
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrencyMode('INR');
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        currencyMode === 'INR' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      ₹ INR
                    </button>
                  </div>
                </div>

                {/* Input with large font */}
                <div className="relative mb-3">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400 font-mono">
                    {currencyMode === 'USD' ? '$' : '₹'}
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={rawAmountInput}
                    onChange={(e) => setRawAmountInput(e.target.value)}
                    placeholder="Enter amount..."
                    className="w-full pl-10 pr-4 py-3 text-2xl font-bold font-mono text-slate-950 rounded-xl bg-white border-2 border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all shadow-inner"
                  />
                </div>

                {/* Live 2-way conversion display */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-sky-200/60 text-xs">
                  <div className="font-mono text-slate-700">
                    {currencyMode === 'USD' ? (
                      <span>Equivalent in INR: <strong className="text-emerald-700 font-bold text-sm">₹{amountINR.toLocaleString()}</strong></span>
                    ) : (
                      <span>Equivalent in USD: <strong className="text-emerald-700 font-bold text-sm">${amountUSD.toLocaleString()}</strong></span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Service: <strong>{serviceName}</strong>
                  </div>
                </div>

                {/* Preset Quick Buttons */}
                <div className="flex flex-wrap gap-1.5 mt-3 pt-2">
                  <span className="text-[10px] font-mono text-slate-400 self-center mr-1">Quick Presets:</span>
                  {[50, 100, 250, 500, 1000, 2500].map((presetUSD) => (
                    <button
                      key={presetUSD}
                      type="button"
                      onClick={() => {
                        if (currencyMode === 'USD') {
                          setRawAmountInput(String(presetUSD));
                        } else {
                          setRawAmountInput(String(presetUSD * USD_TO_INR_RATE));
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-sky-100 border border-sky-200 text-slate-700 text-xs font-mono font-semibold transition-colors cursor-pointer"
                    >
                      {currencyMode === 'USD' ? `$${presetUSD}` : `₹${(presetUSD * USD_TO_INR_RATE).toLocaleString()}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Gateway Method Tabs (DIRECT DEDICATED PAGE ACCESS) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 mb-6">
                
                {/* UPI QR Scanner Dedicated */}
                <Link
                  to={`/pay/upi?amount=${amountUSD}&currency=${currencyMode}`}
                  onClick={onClose}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[70px] group ${
                    paymentMethod === 'razorpay'
                      ? 'border-sky-500 bg-sky-50/90 ring-2 ring-sky-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-900 leading-tight">UPI QR Code</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold">Fast</span>
                  </div>
                  <div className="text-[10px] text-slate-500 group-hover:text-slate-700 leading-tight">GPay, PhonePe, Paytm ↗</div>
                </Link>

                {/* Direct Bank Wire Dedicated */}
                <Link
                  to={`/pay/bank?amount=${amountUSD}&currency=${currencyMode}`}
                  onClick={onClose}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[70px] group ${
                    paymentMethod === 'bank'
                      ? 'border-slate-800 bg-slate-100 ring-2 ring-slate-800/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-800 hover:bg-slate-100 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-slate-950 leading-tight">SBI Bank</span>
                    <Building2 className="w-3.5 h-3.5 text-slate-700" />
                  </div>
                  <div className="text-[10px] text-slate-500 group-hover:text-slate-700 leading-tight">RTGS, NEFT, IMPS ↗</div>
                </Link>

                {/* Stripe Global Dedicated */}
                <Link
                  to={`/pay/card?amount=${amountUSD}&currency=${currencyMode}`}
                  onClick={onClose}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[70px] group ${
                    paymentMethod === 'stripe'
                      ? 'border-indigo-500 bg-indigo-50/80 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-950 leading-tight">Cards / Stripe</span>
                    <Globe className="w-3.5 h-3.5 text-indigo-600" />
                  </div>
                  <div className="text-[10px] text-slate-500 group-hover:text-slate-700 leading-tight">Global Visa / Master ↗</div>
                </Link>

                {/* Crypto / Web3 Dedicated */}
                <Link
                  to={`/pay/polygon?amount=${amountUSD}&currency=${currencyMode}`}
                  onClick={onClose}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[70px] group ${
                    paymentMethod === 'crypto'
                      ? 'border-purple-500 bg-purple-50/80 ring-2 ring-purple-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-purple-950 leading-tight">Web3 USDT</span>
                    <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 text-[10px] font-bold">Crypto</span>
                  </div>
                  <div className="text-[10px] text-slate-500 group-hover:text-slate-700 leading-tight">Polygon, TRC20, ETH ↗</div>
                </Link>

              </div>

              {/* METHOD 1: UPI & QR SCANNER */}
              {paymentMethod === 'razorpay' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
                    <span className="font-semibold text-emerald-950">⚡ Want full screen QR?</span>
                    <Link
                      to={`/pay/upi?amount=${amountUSD}&currency=${currencyMode}`}
                      onClick={onClose}
                      className="inline-flex items-center gap-1 font-bold text-emerald-800 hover:text-emerald-950 bg-white px-2.5 py-0.5 rounded-lg border border-emerald-300 shadow-2xs hover:shadow-xs transition-all text-[11px]"
                    >
                      <span>Open Dedicated UPI Page</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-6">
                    {/* QR Code Image Container */}
                    <div className="bg-white p-3 rounded-2xl border-2 border-sky-300 shadow-md flex-shrink-0 text-center">
                      <img
                        src={BANK_DETAILS.qrImage}
                        alt="UPI QR Scanner - Vikas Mishra"
                        className="w-44 h-auto rounded-xl object-contain mx-auto"
                      />
                      <div className="text-[10px] font-mono text-slate-500 mt-1 font-semibold">
                        Scan to Pay with Any UPI App
                      </div>
                    </div>

                    {/* UPI Instructions & 1-Click Copy */}
                    <div className="flex-1 space-y-3 text-left w-full">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-mono font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Verified Merchant UPI
                      </div>

                      <div>
                        <div className="text-[11px] text-slate-500 uppercase font-mono font-semibold">Direct UPI ID:</div>
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 mt-1">
                          <span className="font-mono text-xs font-bold text-sky-700 select-all">{BANK_DETAILS.upiId}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(BANK_DETAILS.upiId, 'upi')}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            {copiedKey === 'upi' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedKey === 'upi' ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="text-xs text-slate-700 space-y-1">
                        <div>Beneficiary: <strong className="text-slate-950">{BANK_DETAILS.beneficiary}</strong></div>
                        <div>Amount: <strong className="text-emerald-700 font-mono text-sm">₹{amountINR.toLocaleString()} INR</strong> (${amountUSD.toLocaleString()} USD)</div>
                      </div>

                      <div className="text-[11px] text-slate-500">
                        Supports <strong>Google Pay, PhonePe, Paytm, BHIM, Cred, Amazon Pay</strong> and all bank UPI apps.
                      </div>
                    </div>
                  </div>

                  {/* Payment Proof Submission Form */}
                  <div className="pt-2 border-t border-slate-100">
                    <PaymentProofForm
                      methodName="UPI QR Scanner"
                      network="GPay / PhonePe / Paytm UPI"
                      amountUSD={amountUSD}
                      amountINR={amountINR}
                      currencyMode={currencyMode}
                      serviceName={serviceName}
                      defaultUtrLabel="12-Digit UPI UTR / Transaction ID"
                      utrPlaceholder="e.g. 423948293849"
                      onSubmitted={(p) => setActiveLivePayment(p)}
                    />
                  </div>
                </div>
              )}

              {/* METHOD 2: STRIPE GLOBAL FORM */}
              {paymentMethod === 'stripe' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-2.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs">
                    <span className="font-semibold text-indigo-950">💳 Full screen Stripe gateway?</span>
                    <Link
                      to={`/pay/card?amount=${amountUSD}&currency=${currencyMode}`}
                      onClick={onClose}
                      className="inline-flex items-center gap-1 font-bold text-indigo-800 hover:text-indigo-950 bg-white px-2.5 py-0.5 rounded-lg border border-indigo-300 shadow-2xs hover:shadow-xs transition-all text-[11px]"
                    >
                      <span>Open Dedicated Card Page</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>

                  {/* Payment Proof Submission Form */}
                  <div className="pt-2 border-t border-slate-100">
                    <PaymentProofForm
                      methodName="Stripe Global Cards"
                      network="Visa / Mastercard / Amex"
                      amountUSD={amountUSD}
                      amountINR={amountINR}
                      currencyMode={currencyMode}
                      serviceName={serviceName}
                      defaultUtrLabel="Stripe Payment Reference / Authorization ID"
                      utrPlaceholder="e.g. ch_3N28492842948291"
                      onSubmitted={(p) => setActiveLivePayment(p)}
                    />
                  </div>
                </div>
              )}

              {/* METHOD 3: WEB3 CRYPTO */}
              {paymentMethod === 'crypto' && (() => {
                const activeCryptoWallet = CRYPTO_WALLETS[selectedCrypto] || CRYPTO_WALLETS.MATIC;
                return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-2.5 rounded-2xl bg-purple-50 border border-purple-200 text-xs">
                    <span className="font-semibold text-purple-950">⛓️ Full screen Crypto portal?</span>
                    <Link
                      to={`${activeCryptoWallet.id === 'MATIC' ? '/pay/polygon' : activeCryptoWallet.id === 'BSC' ? '/pay/bnb' : activeCryptoWallet.id === 'TRX' ? '/pay/tron' : activeCryptoWallet.id === 'SOL' ? '/pay/sol' : activeCryptoWallet.id === 'BTC' ? '/pay/btc' : '/pay/eth'}?amount=${amountUSD}&currency=${currencyMode}`}
                      onClick={onClose}
                      className="inline-flex items-center gap-1 font-bold text-purple-800 hover:text-purple-950 bg-white px-2.5 py-0.5 rounded-lg border border-purple-300 shadow-2xs hover:shadow-xs transition-all text-[11px]"
                    >
                      <span>Open Dedicated {activeCryptoWallet.name} Page</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                  
                  {/* Network Selector Tabs */}
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-900 uppercase tracking-wider mb-2">
                      Choose Blockchain Network:
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedCrypto('MATIC')}
                        className={`p-2 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[64px] ${
                          (selectedCrypto || 'MATIC') === 'MATIC'
                            ? 'border-indigo-500 bg-indigo-50/80 ring-2 ring-indigo-500/30 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[11px] font-bold text-slate-950">Polygon</span>
                          <span className="w-4 h-4 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[9px]">
                            ⬡
                          </span>
                        </div>
                        <div className="text-[8px] text-slate-500 font-mono">POL</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedCrypto('BSC')}
                        className={`p-2 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[64px] ${
                          selectedCrypto === 'BSC'
                            ? 'border-yellow-500 bg-yellow-50/80 ring-2 ring-yellow-500/30 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[11px] font-bold text-slate-950">BNB</span>
                          <span className="w-4 h-4 rounded-full bg-yellow-500 text-white font-bold flex items-center justify-center text-[9px]">
                            🔶
                          </span>
                        </div>
                        <div className="text-[8px] text-slate-500 font-mono">BEP-20</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedCrypto('TRX')}
                        className={`p-2 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[64px] ${
                          selectedCrypto === 'TRX'
                            ? 'border-rose-500 bg-rose-50/80 ring-2 ring-rose-500/30 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[11px] font-bold text-slate-950">Tron</span>
                          <span className="w-4 h-4 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center text-[9px]">
                            ₮
                          </span>
                        </div>
                        <div className="text-[8px] text-slate-500 font-mono">TRC-20</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedCrypto('SOL')}
                        className={`p-2 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[64px] ${
                          selectedCrypto === 'SOL'
                            ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/30 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[11px] font-bold text-slate-950">Solana</span>
                          <span className="w-4 h-4 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-[9px]">
                            ◎
                          </span>
                        </div>
                        <div className="text-[8px] text-slate-500 font-mono">SPL</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedCrypto('BTC')}
                        className={`p-2 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[64px] ${
                          selectedCrypto === 'BTC'
                            ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-500/30 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[11px] font-bold text-slate-950">Bitcoin</span>
                          <span className="w-4 h-4 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-[9px]">
                            ₿
                          </span>
                        </div>
                        <div className="text-[8px] text-slate-500 font-mono">BTC</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedCrypto('ETH')}
                        className={`p-2 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[64px] ${
                          selectedCrypto === 'ETH'
                            ? 'border-purple-500 bg-purple-50/80 ring-2 ring-purple-500/30 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[11px] font-bold text-slate-950">Ethereum</span>
                          <span className="w-4 h-4 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-[9px]">
                            Ξ
                          </span>
                        </div>
                        <div className="text-[8px] text-slate-500 font-mono">ERC-20</div>
                      </button>
                    </div>
                  </div>

                  {/* CRITICAL NETWORK WARNING */}
                  <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-400 text-amber-950 flex items-start gap-2.5 shadow-xs">
                    <span className="text-lg">⚠️</span>
                    <div className="text-xs leading-relaxed">
                      <strong className="font-bold text-amber-900 block uppercase font-mono tracking-wider text-[11px]">
                        Critical {activeCryptoWallet.name} Requirement:
                      </strong>
                      {activeCryptoWallet.warning}
                    </div>
                  </div>

                  {/* Wallet & QR Box */}
                  <div className="p-5 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center gap-5 border border-slate-800 shadow-xl">
                    <div className={`bg-white p-2.5 rounded-2xl border-2 ${
                      selectedCrypto === 'MATIC' ? 'border-indigo-400' :
                      selectedCrypto === 'BSC' ? 'border-yellow-400' :
                      selectedCrypto === 'TRX' ? 'border-rose-400' :
                      selectedCrypto === 'SOL' ? 'border-emerald-400' :
                      selectedCrypto === 'BTC' ? 'border-amber-400' : 'border-purple-400'
                    } shadow-md flex-shrink-0 text-center`}>
                      <img
                        src={activeCryptoWallet.qrImage}
                        alt={`Vikas Mishra - ${activeCryptoWallet.name} QR Code`}
                        className="w-40 h-auto rounded-xl object-contain mx-auto"
                      />
                      <div className="text-[9px] font-mono text-slate-700 mt-1 font-bold">
                        Vikas Mishra / {activeCryptoWallet.id}
                      </div>
                    </div>

                    <div className="flex-1 space-y-2.5 text-left w-full">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                        selectedCrypto === 'MATIC' ? 'bg-indigo-500/20 text-indigo-300' :
                        selectedCrypto === 'BSC' ? 'bg-yellow-500/20 text-yellow-300' :
                        selectedCrypto === 'TRX' ? 'bg-rose-500/20 text-rose-300' :
                        selectedCrypto === 'SOL' ? 'bg-emerald-500/20 text-emerald-300' :
                        selectedCrypto === 'BTC' ? 'bg-amber-500/20 text-amber-300' : 
                        'bg-purple-500/20 text-purple-300'
                      }`}>
                        <Zap className="w-3 h-3" />
                        {activeCryptoWallet.network}
                      </div>

                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-mono font-semibold">Official {activeCryptoWallet.name} Wallet:</div>
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 mt-0.5 gap-2">
                          <span className="font-mono text-xs font-bold text-sky-400 break-all select-all">
                            {activeCryptoWallet.address}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(activeCryptoWallet.address, 'crypto')}
                            className="p-1.5 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer flex-shrink-0"
                            title="Copy Address"
                          >
                            {copiedKey === 'crypto' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedKey === 'crypto' ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-300">
                        Accepted: <strong className="text-white font-mono">{activeCryptoWallet.token}</strong><br />
                        Payable: <strong className="text-emerald-400 font-mono">${amountUSD.toLocaleString()} USD</strong> (₹{amountINR.toLocaleString()})
                      </div>
                    </div>
                  </div>

                  {/* Payment Proof Submission Form */}
                  <div className="pt-2 border-t border-slate-100">
                    <PaymentProofForm
                      methodName={`Web3 Crypto (${activeCryptoWallet.name})`}
                      network={activeCryptoWallet.network}
                      amountUSD={amountUSD}
                      amountINR={amountINR}
                      currencyMode={currencyMode}
                      serviceName={serviceName}
                      defaultUtrLabel={`${activeCryptoWallet.id} Transaction Hash (TxID) / Reference`}
                      utrPlaceholder={selectedCrypto === 'BTC' ? 'Bitcoin txid...' : '0x...'}
                      onSubmitted={(p) => setActiveLivePayment(p)}
                    />
                  </div>
                </div>
                );
              })()}

              {/* METHOD 4: DIRECT BANK WIRE / RTGS / NEFT (SBI) */}
              {paymentMethod === 'bank' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-2.5 rounded-2xl bg-sky-50 border border-sky-200 text-xs">
                    <span className="font-semibold text-sky-950">🏦 Full screen Bank wire?</span>
                    <Link
                      to={`/pay/bank?amount=${amountUSD}&currency=${currencyMode}`}
                      onClick={onClose}
                      className="inline-flex items-center gap-1 font-bold text-sky-800 hover:text-sky-950 bg-white px-2.5 py-0.5 rounded-lg border border-sky-300 shadow-2xs hover:shadow-xs transition-all text-[11px]"
                    >
                      <span>Open Dedicated Bank Page</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
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
                      <div className="p-3 rounded-xl bg-white border border-slate-200">
                        <div className="text-slate-500 text-[11px]">Beneficiary Name</div>
                        <div className="font-bold text-slate-950 text-sm mt-0.5">{BANK_DETAILS.beneficiary}</div>
                      </div>

                      {/* Bank Name */}
                      <div className="p-3 rounded-xl bg-white border border-slate-200">
                        <div className="text-slate-500 text-[11px]">Bank Name</div>
                        <div className="font-bold text-slate-950 text-sm mt-0.5">{BANK_DETAILS.bankName}</div>
                      </div>

                      {/* Account Number with Copy */}
                      <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                        <div>
                          <div className="text-slate-500 text-[11px]">Account Number</div>
                          <div className="font-mono font-bold text-slate-950 text-sm mt-0.5 select-all">{BANK_DETAILS.accountNo}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(BANK_DETAILS.accountNo, 'acc')}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          {copiedKey === 'acc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedKey === 'acc' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>

                      {/* IFSC Code with Copy */}
                      <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                        <div>
                          <div className="text-slate-500 text-[11px]">IFSC Code</div>
                          <div className="font-mono font-bold text-sky-700 text-sm mt-0.5 select-all">{BANK_DETAILS.ifscCode}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(BANK_DETAILS.ifscCode, 'ifsc')}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          {copiedKey === 'ifsc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedKey === 'ifsc' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>

                      {/* UPI ID */}
                      <div className="sm:col-span-2 p-3 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-between">
                        <div>
                          <div className="text-sky-800 text-[11px] font-mono">Linked UPI ID</div>
                          <div className="font-mono font-bold text-sky-950 text-sm mt-0.5 select-all">{BANK_DETAILS.upiId}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(BANK_DETAILS.upiId, 'upi2')}
                          className="p-1.5 rounded-lg bg-white hover:bg-sky-100 text-sky-800 text-xs font-semibold flex items-center gap-1 cursor-pointer border border-sky-200"
                        >
                          {copiedKey === 'upi2' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedKey === 'upi2' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>

                    </div>
                  </div>

                  {/* Payment Proof Submission Form */}
                  <div className="pt-2 border-t border-slate-100">
                    <PaymentProofForm
                      methodName="State Bank of India (SBI) Wire"
                      network="RTGS / NEFT / IMPS Wire Transfer"
                      amountUSD={amountUSD}
                      amountINR={amountINR}
                      currencyMode={currencyMode}
                      serviceName={serviceName}
                      defaultUtrLabel="Bank Reference / UTR / IMPS Number"
                      utrPlaceholder="e.g. SBIN49382948291"
                      onSubmitted={(p) => setActiveLivePayment(p)}
                    />
                  </div>
                </div>
              )}

            </div>
          ) : (
            
            /* PAYMENT SUCCESS RECEIPT SCREEN */
            <div className="text-center py-4 space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-mono font-semibold">
                  Payment Verified & Secured
                </span>
                <h3 className="text-2xl font-bold text-slate-950 mt-2">Transaction Confirmed!</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                  Thank you for deploying your engineering engagement with <strong>The Unfiltered Engineer</strong>.
                </p>
              </div>

              {/* Receipt Summary Card */}
              {receiptData && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left max-w-md mx-auto space-y-2 text-xs">
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Transaction ID:</span>
                    <span className="font-mono font-bold text-slate-900">{receiptData.txId}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Service:</span>
                    <span className="font-semibold text-slate-900">{receiptData.service}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Amount Paid:</span>
                    <span className="font-bold text-emerald-700">
                      {receiptData.currency === 'USD' ? `$${receiptData.amount.toLocaleString()} USD (₹${(receiptData.amount * 100).toLocaleString()})` : `₹${receiptData.amount.toLocaleString()} INR ($${(receiptData.amount / 100).toLocaleString()})`}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Method:</span>
                    <span className="font-semibold text-slate-900">{receiptData.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Date:</span>
                    <span className="font-mono text-slate-700">{new Date(receiptData.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Print Receipt / PDF</span>
                </button>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs cursor-pointer"
                >
                  Return to Platform
                </button>
              </div>
            </div>

          )}

        </div>

      </div>
    </div>
  );
}
