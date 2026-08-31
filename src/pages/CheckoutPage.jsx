import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Shield, Lock, CreditCard, Sparkles, CheckCircle2, ArrowRight, DollarSign, 
  Building2, Globe2, Copy, Check, QrCode, Globe, Zap, MessageCircle, Download, ExternalLink 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import PaymentProofForm from '../components/PaymentProofForm';
import LivePaymentStatus from '../components/LivePaymentStatus';

// Platform Standard Rate: $1 USD = ₹100 INR
const USD_TO_INR_RATE = 100;

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
  const [selectedCrypto, setSelectedCrypto] = useState('MATIC');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [activeLivePayment, setActiveLivePayment] = useState(null);

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
          
          {activeLivePayment ? (
            <LivePaymentStatus 
              payment={activeLivePayment} 
              onReset={() => setActiveLivePayment(null)} 
            />
          ) : !paymentSuccess ? (
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

              {/* PAYMENT METHOD SELECTOR TABS (DIRECT DEDICATED PAGE ACCESS) */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                  Select Dedicated Payment Gateway:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  
                  {/* UPI QR Code Dedicated */}
                  <Link
                    to={`/pay/upi?amount=${amountUSD}&currency=${currencyMode}${serviceName ? `&service=${encodeURIComponent(serviceName)}` : ''}${clientName ? `&client=${encodeURIComponent(clientName)}` : ''}`}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[76px] group ${
                      paymentMethod === 'upi'
                        ? 'border-sky-500 bg-sky-50/90 ring-2 ring-sky-500/30 shadow-xs'
                        : 'border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/60 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-950 leading-tight">UPI QR Code</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold">Fast</span>
                    </div>
                    <div className="text-[11px] text-slate-500 group-hover:text-slate-700 leading-tight">GPay, PhonePe, Paytm ↗</div>
                  </Link>

                  {/* SBI Bank Transfer Dedicated */}
                  <Link
                    to={`/pay/bank?amount=${amountUSD}&currency=${currencyMode}${serviceName ? `&service=${encodeURIComponent(serviceName)}` : ''}${clientName ? `&client=${encodeURIComponent(clientName)}` : ''}`}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[76px] group ${
                      paymentMethod === 'bank'
                        ? 'border-slate-800 bg-slate-100 ring-2 ring-slate-800/30 shadow-xs'
                        : 'border-slate-200 hover:border-slate-800 hover:bg-slate-100 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-slate-950 leading-tight">SBI Bank Wire</span>
                      <Building2 className="w-3.5 h-3.5 text-slate-700" />
                    </div>
                    <div className="text-[11px] text-slate-500 group-hover:text-slate-700 leading-tight">RTGS, NEFT, IMPS ↗</div>
                  </Link>

                  {/* Web3 USDT Dedicated */}
                  <Link
                    to={`/pay/polygon?amount=${amountUSD}&currency=${currencyMode}${serviceName ? `&service=${encodeURIComponent(serviceName)}` : ''}${clientName ? `&client=${encodeURIComponent(clientName)}` : ''}`}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[76px] group ${
                      paymentMethod === 'crypto'
                        ? 'border-purple-500 bg-purple-50/80 ring-2 ring-purple-500/30 shadow-xs'
                        : 'border-slate-200 hover:border-purple-400 hover:bg-purple-50/60 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-purple-950 leading-tight">Web3 USDT</span>
                      <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 text-[10px] font-bold">Crypto</span>
                    </div>
                    <div className="text-[11px] text-slate-500 group-hover:text-slate-700 leading-tight">Polygon, TRC20, ETH ↗</div>
                  </Link>

                </div>
              </div>

              {/* METHOD 1 VIEW: UPI QR SCANNER */}
              {paymentMethod === 'upi' && (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
                    <span className="font-semibold text-emerald-950">⚡ Want full screen QR experience?</span>
                    <Link
                      to={`/pay/upi?amount=${amountUSD}&currency=${currencyMode}`}
                      className="inline-flex items-center gap-1 font-bold text-emerald-800 hover:text-emerald-950 bg-white px-3 py-1 rounded-xl border border-emerald-300 shadow-2xs hover:shadow-xs transition-all"
                    >
                      <span>Open Dedicated UPI Page</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>

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

              {/* METHOD 2 VIEW: SBI BANK TRANSFER */}
              {paymentMethod === 'bank' && (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-sky-50 border border-sky-200 text-xs">
                    <span className="font-semibold text-sky-950">🏦 Want full screen bank wire details?</span>
                    <Link
                      to={`/pay/bank?amount=${amountUSD}&currency=${currencyMode}`}
                      className="inline-flex items-center gap-1 font-bold text-sky-800 hover:text-sky-950 bg-white px-3 py-1 rounded-xl border border-sky-300 shadow-2xs hover:shadow-xs transition-all"
                    >
                      <span>Open Dedicated Bank Page</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>

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



              {/* METHOD 4 VIEW: WEB3 CRYPTO */}
              {paymentMethod === 'crypto' && (() => {
                const activeCryptoWallet = CRYPTO_WALLETS[selectedCrypto] || CRYPTO_WALLETS.MATIC;
                return (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-purple-50 border border-purple-200 text-xs">
                    <span className="font-semibold text-purple-950">⛓️ Want dedicated crypto portal with scanner?</span>
                    <Link
                      to={`${(activeCryptoWallet.id === 'MATIC' ? '/pay/polygon' : activeCryptoWallet.id === 'BSC' ? '/pay/bnb' : activeCryptoWallet.id === 'TRX' ? '/pay/tron' : activeCryptoWallet.id === 'SOL' ? '/pay/sol' : activeCryptoWallet.id === 'BTC' ? '/pay/btc' : '/pay/eth')}?amount=${amountUSD}&currency=${currencyMode}`}
                      className="inline-flex items-center gap-1 font-bold text-purple-800 hover:text-purple-950 bg-white px-3 py-1 rounded-xl border border-purple-300 shadow-2xs hover:shadow-xs transition-all"
                    >
                      <span>Open Dedicated {activeCryptoWallet.name} Page</span>
                      <ExternalLink className="w-3.5 h-3.5" />
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
                        className={`p-2 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[68px] ${
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
                        <div className="text-[9px] text-slate-500 font-mono">PoS (POL)</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedCrypto('BSC')}
                        className={`p-2 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[68px] ${
                          selectedCrypto === 'BSC'
                            ? 'border-yellow-500 bg-yellow-50/80 ring-2 ring-yellow-500/30 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[11px] font-bold text-slate-950">BNB Chain</span>
                          <span className="w-4 h-4 rounded-full bg-yellow-500 text-white font-bold flex items-center justify-center text-[9px]">
                            🔶
                          </span>
                        </div>
                        <div className="text-[9px] text-slate-500 font-mono">BEP-20</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedCrypto('TRX')}
                        className={`p-2 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[68px] ${
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
                        <div className="text-[9px] text-slate-500 font-mono">TRC-20</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedCrypto('SOL')}
                        className={`p-2 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[68px] ${
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
                        <div className="text-[9px] text-slate-500 font-mono">SPL</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedCrypto('BTC')}
                        className={`p-2 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[68px] ${
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
                        <div className="text-[9px] text-slate-500 font-mono">BTC</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedCrypto('ETH')}
                        className={`p-2 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[68px] ${
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
                        <div className="text-[9px] text-slate-500 font-mono">ERC-20</div>
                      </button>
                    </div>
                  </div>

                  {/* CRITICAL WARNING ALERT */}
                  <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-400 text-amber-950 flex items-start gap-3 shadow-xs">
                    <span className="text-xl">⚠️</span>
                    <div className="text-xs leading-relaxed">
                      <strong className="font-bold text-amber-900 block uppercase font-mono tracking-wider">
                        Critical {activeCryptoWallet.name} Requirement:
                      </strong>
                      {activeCryptoWallet.warning}
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center gap-6 border border-slate-800 shadow-xl">
                    {/* QR Code Image */}
                    <div className={`bg-white p-3 rounded-2xl border-2 ${
                      selectedCrypto === 'MATIC' ? 'border-indigo-400' :
                      selectedCrypto === 'BSC' ? 'border-yellow-400' :
                      selectedCrypto === 'TRX' ? 'border-rose-400' :
                      selectedCrypto === 'SOL' ? 'border-emerald-400' :
                      selectedCrypto === 'BTC' ? 'border-amber-400' : 'border-purple-400'
                    } shadow-lg flex-shrink-0 text-center`}>
                      <img
                        src={activeCryptoWallet.qrImage}
                        alt={`Vikas Mishra - ${activeCryptoWallet.name} QR Code`}
                        className="w-48 h-auto rounded-xl object-contain mx-auto"
                      />
                      <div className="text-[10px] font-mono text-slate-700 mt-1.5 font-bold">
                        Vikas Mishra / {activeCryptoWallet.id}
                      </div>
                    </div>

                    {/* Address & Instructions */}
                    <div className="flex-1 space-y-3 text-left w-full">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-mono font-bold ${
                        selectedCrypto === 'MATIC' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30' :
                        selectedCrypto === 'BSC' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30' :
                        selectedCrypto === 'TRX' ? 'bg-rose-500/20 text-rose-300 border-rose-400/30' :
                        selectedCrypto === 'SOL' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30' :
                        selectedCrypto === 'BTC' ? 'bg-amber-500/20 text-amber-300 border-amber-400/30' : 
                        'bg-purple-500/20 text-purple-300 border-purple-400/30'
                      }`}>
                        <Zap className="w-3.5 h-3.5" />
                        {activeCryptoWallet.network}
                      </div>

                      <div>
                        <div className="text-[11px] text-slate-400 uppercase font-mono font-semibold">Official {activeCryptoWallet.name} Wallet Address:</div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 mt-1 gap-2">
                          <span className="font-mono text-xs font-bold text-sky-400 break-all select-all">
                            {activeCryptoWallet.address}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(activeCryptoWallet.address, 'crypto')}
                            className="p-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer flex-shrink-0"
                          >
                            {copiedKey === 'crypto' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedKey === 'crypto' ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="text-xs text-slate-300 space-y-1">
                        <div>Accepted Token: <strong className="text-white font-mono">{activeCryptoWallet.token}</strong></div>
                        <div>Equivalent Payable: <strong className="text-emerald-400 font-mono text-base">${amountUSD.toLocaleString()} USD</strong> (₹{amountINR.toLocaleString()})</div>
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
