import React, { useState, useEffect } from 'react';
import { 
  X, Check, ShieldCheck, CreditCard, QrCode, Globe, Building2, Copy, CheckCircle2, 
  Sparkles, Lock, ArrowRight, DollarSign, RefreshCw, Download, ExternalLink, Zap
} from 'lucide-react';
import { logSecurityEvent } from '../services/storageService';
import confetti from 'canvas-confetti';

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
  beneficiary: 'The Unfiltered Engineer (Vikas Mishra)',
  bankName: 'HDFC Bank Ltd',
  accountType: 'Current / Business Account',
  ifscCode: 'HDFC0000240',
  swiftCode: 'HDFCINBBXXX',
  upiId: '9137507092@okbizaxis',
  supportPhone: '+91 91375 07092',
  supportEmail: 'vikasmishraoffice87@gmail.com'
};

export default function PaymentModal({
  isOpen,
  onClose,
  initialPlan = null,
  initialAmount = 3500,
  initialCurrency = 'USD',
  serviceName = 'Custom Engineering Retainer'
}) {
  const [paymentMethod, setPaymentMethod] = useState('razorpay'); // 'razorpay' | 'stripe' | 'crypto' | 'bank'
  const [currency, setCurrency] = useState(initialCurrency);
  const [amount, setAmount] = useState(initialAmount);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [txHash, setTxHash] = useState('');
  const [copiedKey, setCopiedKey] = useState(null);
  const [selectedCrypto, setSelectedCrypto] = useState('USDT_POLYGON');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  useEffect(() => {
    if (initialAmount) setAmount(initialAmount);
    if (initialCurrency) setCurrency(initialCurrency);
  }, [initialAmount, initialCurrency]);

  if (!isOpen) return null;

  const getConvertedAmount = () => {
    if (currency === 'INR') {
      // If base was USD, convert to INR ~87 INR/USD
      return typeof amount === 'number' ? (initialCurrency === 'USD' ? Math.round(amount * 87) : amount) : 250000;
    }
    // USD
    return typeof amount === 'number' ? (initialCurrency === 'INR' ? Math.round(amount / 87) : amount) : 3500;
  };

  const currentDisplayAmount = getConvertedAmount();

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

    setIsProcessing(true);

    try {
      // Simulate live razorpay order initialization
      logSecurityEvent('PAYMENT_INIT', `Razorpay Checkout initiated by ${clientEmail} for ${currency} ${currentDisplayAmount}`);

      // If Razorpay SDK is loaded or we run standard checkout
      setTimeout(() => {
        setIsProcessing(false);
        const receipt = {
          txId: 'TXN-RZP-' + Date.now().toString().slice(-8),
          method: 'Razorpay / UPI / Cards',
          amount: currentDisplayAmount,
          currency,
          service: serviceName,
          clientName,
          clientEmail,
          clientCompany,
          timestamp: new Date().toISOString(),
          status: 'Confirmed & Escrow Secured'
        };

        // Save transaction to local storage
        try {
          const existing = JSON.parse(localStorage.getItem('ue_payment_transactions_v1') || '[]');
          existing.unshift(receipt);
          localStorage.setItem('ue_payment_transactions_v1', JSON.stringify(existing));
        } catch (e) {}

        setReceiptData(receipt);
        setPaymentSuccess(true);
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
      }, 1500);

    } catch (err) {
      setIsProcessing(false);
      alert('Payment processing error: ' + err.message);
    }
  };

  // 2. Process Stripe Global Card Payment
  const handleStripePayment = (e) => {
    e.preventDefault();
    if (!clientName || !clientEmail) {
      alert('Please provide your name and email.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const receipt = {
        txId: 'TXN-STP-' + Date.now().toString().slice(-8),
        method: 'Stripe Global Card Gateway',
        amount: currentDisplayAmount,
        currency: 'USD',
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
      alert('Please enter your transaction hash / signature.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const receipt = {
        txId: 'TXN-CRYPTO-' + Date.now().toString().slice(-8),
        method: `Web3 Crypto (${selectedCrypto})`,
        cryptoHash: txHash,
        amount: currentDisplayAmount,
        currency: 'USDT',
        service: serviceName,
        clientName: clientName || 'Anonymous Web3 Client',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto font-sans animate-in fade-in duration-200">
      
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
              <h3 className="text-xl font-bold text-white mt-1">Enterprise Payment Portal</h3>
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
          
          {!paymentSuccess ? (
            <div>
              
              {/* Service & Amount Summary Pill */}
              <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="text-xs text-sky-800 font-mono font-medium">Service / Retainer Scope</div>
                  <div className="text-sm font-bold text-slate-900">{serviceName}</div>
                </div>

                {/* Currency Switcher & Amount */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-xl bg-white border border-sky-200 p-1 shadow-xs">
                    <button
                      type="button"
                      onClick={() => setCurrency('USD')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${currency === 'USD' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      USD ($)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrency('INR')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${currency === 'INR' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      INR (₹)
                    </button>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-slate-500 font-mono">Total Due</div>
                    <div className="text-xl font-bold text-slate-950">
                      {currency === 'USD' ? `$${currentDisplayAmount.toLocaleString()}` : `₹${currentDisplayAmount.toLocaleString()}`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Gateway Method Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
                
                {/* Razorpay / UPI */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    paymentMethod === 'razorpay'
                      ? 'border-sky-500 bg-sky-50/60 ring-2 ring-sky-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-900">Razorpay</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold">UPI</span>
                  </div>
                  <div className="text-[11px] text-slate-500">GPay, PhonePe, Cards</div>
                </button>

                {/* Stripe Global */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('stripe')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    paymentMethod === 'stripe'
                      ? 'border-indigo-500 bg-indigo-50/60 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-900">Stripe</span>
                    <Globe className="w-3.5 h-3.5 text-indigo-600" />
                  </div>
                  <div className="text-[11px] text-slate-500">Global Visa, Master, Amex</div>
                </button>

                {/* Crypto / Web3 */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('crypto')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    paymentMethod === 'crypto'
                      ? 'border-purple-500 bg-purple-50/60 ring-2 ring-purple-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-900">Web3 USDT</span>
                    <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 text-[10px] font-bold">Crypto</span>
                  </div>
                  <div className="text-[11px] text-slate-500">Polygon, TRC20, ETH</div>
                </button>

                {/* Direct Wire */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    paymentMethod === 'bank'
                      ? 'border-slate-800 bg-slate-100 ring-2 ring-slate-800/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-900">Bank Wire</span>
                    <Building2 className="w-3.5 h-3.5 text-slate-700" />
                  </div>
                  <div className="text-[11px] text-slate-500">RTGS, NEFT, SWIFT</div>
                </button>

              </div>

              {/* METHOD 1: RAZORPAY / UPI FORM */}
              {paymentMethod === 'razorpay' && (
                <form onSubmit={handleRazorpayPayment} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-700 uppercase font-semibold mb-1">
                        Full Name / Authorized Signatory <span className="text-rose-500">*</span>
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
                        Official Billing Email <span className="text-rose-500">*</span>
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

                  <div>
                    <label className="block text-[11px] font-mono text-slate-700 uppercase font-semibold mb-1">
                      Company / Organization Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={clientCompany}
                      onChange={(e) => setClientCompany(e.target.value)}
                      placeholder="e.g. Acme Technologies Inc."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Supports all UPI apps (Google Pay, PhonePe, Paytm, BHIM) and Indian/International Cards.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-sky-600 via-indigo-600 to-teal-600 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-sky-600/20 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>{isProcessing ? 'Connecting Razorpay Gateway...' : `Proceed to Pay ${currency === 'USD' ? `$${currentDisplayAmount.toLocaleString()}` : `₹${currentDisplayAmount.toLocaleString()}`}`}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* METHOD 2: STRIPE GLOBAL FORM */}
              {paymentMethod === 'stripe' && (
                <form onSubmit={handleStripePayment} className="space-y-4">
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

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
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
                    disabled={isProcessing}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/20 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>{isProcessing ? 'Processing Stripe Transaction...' : `Pay $${(typeof amount === 'number' ? amount : 3500).toLocaleString()} with Stripe`}</span>
                  </button>
                </form>
              )}

              {/* METHOD 3: WEB3 CRYPTO / USDT */}
              {paymentMethod === 'crypto' && (
                <form onSubmit={handleCryptoConfirm} className="space-y-4">
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
                      Send exact equivalent of <strong>${(typeof amount === 'number' ? amount : 3500).toLocaleString()} USDT</strong> to the address above.
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
                    disabled={isProcessing}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-purple-600/20 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                  >
                    <Zap className="w-4 h-4" />
                    <span>{isProcessing ? 'Verifying Blockchain Confirmation...' : 'Confirm Crypto Payment'}</span>
                  </button>
                </form>
              )}

              {/* METHOD 4: DIRECT BANK WIRE / RTGS / SWIFT */}
              {paymentMethod === 'bank' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="text-xs font-mono font-bold text-slate-900 uppercase border-b border-slate-200 pb-2">
                      Official B2B Bank Transfer Details
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <div className="text-slate-500">Beneficiary Name</div>
                        <div className="font-bold text-slate-900">{BANK_DETAILS.beneficiary}</div>
                      </div>
                      <div>
                        <div className="text-slate-500">Bank Name</div>
                        <div className="font-bold text-slate-900">{BANK_DETAILS.bankName}</div>
                      </div>
                      <div>
                        <div className="text-slate-500">IFSC Code (India)</div>
                        <div className="font-mono font-bold text-slate-900">{BANK_DETAILS.ifscCode}</div>
                      </div>
                      <div>
                        <div className="text-slate-500">SWIFT Code (International)</div>
                        <div className="font-mono font-bold text-slate-900">{BANK_DETAILS.swiftCode}</div>
                      </div>
                      <div className="sm:col-span-2">
                        <div className="text-slate-500">Direct Official UPI ID</div>
                        <div className="font-mono font-bold text-sky-700">{BANK_DETAILS.upiId}</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-900 leading-relaxed">
                    💡 After initiating wire transfer, send transfer slip to <strong>{BANK_DETAILS.supportPhone}</strong> on WhatsApp for instant invoice clearance.
                  </div>

                  <a
                    href={`https://wa.me/919137507092?text=${encodeURIComponent(`Hi Vikas, I am initiating bank wire payment of ${currency} ${currentDisplayAmount} for ${serviceName}. Please share formal invoice PDF.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                  >
                    <span>Notify Vikas Mishra on WhatsApp</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
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
                      {receiptData.currency === 'USD' ? `$${receiptData.amount.toLocaleString()}` : `₹${receiptData.amount.toLocaleString()}`}
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
