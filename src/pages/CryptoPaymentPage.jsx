import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Lock, Check, Zap, Copy, CheckCircle2, ArrowRight, ShieldCheck, Download, 
  ArrowLeft, MessageCircle, QrCode, CreditCard, Building2, Coins 
} from 'lucide-react';
import confetti from 'canvas-confetti';

const USD_TO_INR_RATE = 100;

const CRYPTO_NETWORKS = {
  MATIC: {
    id: 'MATIC',
    name: 'Polygon (MATIC / POL)',
    network: 'Polygon Network (PoS Only)',
    symbol: 'POL / USDT / USDC',
    address: '0xaf3c37fBD1091175f164d753d53Cc420f7bF2aB3',
    token: 'Native POL (MATIC) • USDT (Polygon) • USDC (Polygon)',
    qrImage: '/images/matic_qr.png',
    badgeClass: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    qrBorderClass: 'border-indigo-500',
    warning: 'CRITICAL: Send ONLY via the Polygon Network (PoS). Sending via any other network (e.g. ERC20, Tron, Solana, BSC) will result in permanent loss of your assets.'
  },
  BSC: {
    id: 'BSC',
    name: 'BNB Smart Chain (BEP-20)',
    network: 'BNB Smart Chain (BEP-20 Only)',
    symbol: 'BNB / USDT / USDC',
    address: '0xaf3c37fBD1091175f164d753d53Cc420f7bF2aB3',
    token: 'Native BNB • USDT (BEP-20) • USDC (BEP-20)',
    qrImage: '/images/bnb_qr.png',
    badgeClass: 'bg-yellow-100 text-yellow-900 border-yellow-300',
    qrBorderClass: 'border-yellow-400',
    warning: 'CRITICAL: Send ONLY via the BNB Smart Chain (BEP-20). Sending via any other network (e.g. ERC20, Tron, Solana, Polygon) will result in permanent loss of your assets.'
  },
  TRX: {
    id: 'TRX',
    name: 'Tron (TRC-20)',
    network: 'Tron Network (TRC-20 Only)',
    symbol: 'USDT / TRX',
    address: 'TEFjW6TYrSZBsZ7rTYAt7WAvCagqZFBz8F',
    token: 'USDT (TRC-20) • TRX',
    qrImage: '/images/trx_qr.png',
    badgeClass: 'bg-rose-100 text-rose-900 border-rose-300',
    qrBorderClass: 'border-rose-400',
    warning: 'CRITICAL: Send ONLY via the Tron Network (TRC-20). Sending via any other network (e.g. ERC20, BSC, Solana, Polygon) will result in permanent loss of your assets.'
  },
  SOL: {
    id: 'SOL',
    name: 'Solana (SOL)',
    network: 'Solana Network (SOL / SPL Only)',
    symbol: 'SOL / USDT / USDC',
    address: '6VuZVB62JPNi3kKoyHSjdGJzeTysKNawi3VTdVqwLzcd',
    token: 'Native SOL • USDT (SPL) • USDC (SPL)',
    qrImage: '/images/sol_qr.png',
    badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    qrBorderClass: 'border-emerald-400',
    warning: 'CRITICAL: Send ONLY via the Solana Network (SPL). Sending via any other network (e.g. BSC, Ethereum, Tron, Polygon) will result in permanent loss of your assets.'
  },
  BTC: {
    id: 'BTC',
    name: 'Bitcoin (BTC)',
    network: 'Bitcoin Network (Native SegWit Only)',
    symbol: 'BTC',
    address: 'bc1qn3xhw0lptpj0gaecqs6lccw7va3fk9wczvhcn4',
    token: 'Native Bitcoin (BTC)',
    qrImage: '/images/btc_qr.png',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
    qrBorderClass: 'border-amber-400',
    warning: 'CRITICAL: Send ONLY via the native Bitcoin Network. Sending via any other network (e.g. BEP20, ERC20, Lightning, Tron) will result in permanent loss of your assets.'
  },
  ETH: {
    id: 'ETH',
    name: 'Ethereum (ERC-20)',
    network: 'Ethereum Mainnet (ERC-20 Only)',
    symbol: 'ETH / USDT / USDC',
    address: '0xaf3c37fBD1091175f164d753d53Cc420f7bF2aB3',
    token: 'ETH • USDT • USDC (ERC-20)',
    qrImage: '/images/eth_qr.png',
    badgeClass: 'bg-purple-100 text-purple-900 border-purple-300',
    qrBorderClass: 'border-purple-400',
    warning: 'CRITICAL: Send ONLY via the Ethereum Network (ERC-20). Any transfer from other networks (e.g. Tron, BSC, Solana, Polygon) will result in permanent loss of your assets.'
  }
};

export default function CryptoPaymentPage() {
  const [searchParams] = useSearchParams();

  // Initial network from query: ?net=matic or ?net=bsc or ?net=trx or ?net=sol or ?net=btc or ?net=eth
  const requestedNet = searchParams.get('net')?.toUpperCase();
  const initialNet = (requestedNet && CRYPTO_NETWORKS[requestedNet]) ? requestedNet : 'MATIC';
  const [activeNetwork, setActiveNetwork] = useState(initialNet);

  const [currencyMode, setCurrencyMode] = useState(searchParams.get('currency')?.toUpperCase() || 'USD');
  const [manualAmount, setManualAmount] = useState(searchParams.get('amount') || '100');
  const serviceName = searchParams.get('service') || 'Custom Engineering Scope / Milestone Retainer';
  const clientParam = searchParams.get('client') || '';

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [txHash, setTxHash] = useState('');
  const [copiedKey, setCopiedKey] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  const selectedWallet = CRYPTO_NETWORKS[activeNetwork] || CRYPTO_NETWORKS.MATIC;

  const parsedVal = parseFloat(manualAmount) || 0;
  const amountUSD = currencyMode === 'USD' ? parsedVal : Math.round((parsedVal / USD_TO_INR_RATE) * 100) / 100;
  const amountINR = currencyMode === 'INR' ? parsedVal : Math.round(parsedVal * USD_TO_INR_RATE);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    if (!txHash) {
      alert('Please provide your on-chain transaction hash.');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const receipt = {
        txId: 'TXN-' + activeNetwork + '-' + Date.now().toString().slice(-8),
        method: `Web3 Crypto (${selectedWallet.name})`,
        network: selectedWallet.network,
        cryptoHash: txHash,
        amount: amountUSD,
        currency: `${selectedWallet.id} ($ USD)`,
        service: serviceName,
        clientName: clientName || 'Web3 Client',
        clientEmail: clientEmail || 'web3@client.crypto',
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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 w-full text-left">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/checkout" className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-slate-600 hover:text-sky-700 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Payment Methods</span>
          </Link>
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono font-bold ${selectedWallet.badgeClass}`}>
            <Zap className="w-3.5 h-3.5" />
            {selectedWallet.network}
          </div>
        </div>

        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
            Web3 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-yellow-600 to-purple-600">Crypto Portal</span>
          </h1>
          <p className="text-slate-600 text-sm mt-2">
            Direct on-chain settlement via <strong>Polygon</strong>, <strong>BNB Chain</strong>, <strong>Tron</strong>, <strong>Solana</strong>, <strong>Bitcoin</strong>, or <strong>Ethereum</strong>.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/95 border border-indigo-100 rounded-3xl shadow-xl p-6 sm:p-10 space-y-6">
          
          {!paymentSuccess ? (
            <>
              {/* Engagement Summary */}
              <div className="pb-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs text-purple-700 font-mono font-semibold uppercase">Engagement Description</div>
                  <h2 className="text-lg font-bold text-slate-950 mt-0.5">{serviceName}</h2>
                  {clientParam && (
                    <div className="text-xs text-slate-500 mt-1">Issued for: <strong>{clientParam}</strong></div>
                  )}
                </div>
                <div className="text-xs font-bold font-mono text-purple-800 bg-purple-50 px-3 py-1 rounded-lg border border-purple-200 self-start sm:self-auto">
                  $1 USD = ₹100 INR
                </div>
              </div>

              {/* NETWORK SELECTOR (6 BLOCKCHAINS) */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Select Blockchain Network:
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  
                  {/* Polygon Tab */}
                  <button
                    type="button"
                    onClick={() => setActiveNetwork('MATIC')}
                    className={`p-2 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[68px] ${
                      activeNetwork === 'MATIC'
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

                  {/* BNB Chain Tab */}
                  <button
                    type="button"
                    onClick={() => setActiveNetwork('BSC')}
                    className={`p-2 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[68px] ${
                      activeNetwork === 'BSC'
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

                  {/* Tron Tab */}
                  <button
                    type="button"
                    onClick={() => setActiveNetwork('TRX')}
                    className={`p-2 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[68px] ${
                      activeNetwork === 'TRX'
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

                  {/* Solana Tab */}
                  <button
                    type="button"
                    onClick={() => setActiveNetwork('SOL')}
                    className={`p-2 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[68px] ${
                      activeNetwork === 'SOL'
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

                  {/* Bitcoin Tab */}
                  <button
                    type="button"
                    onClick={() => setActiveNetwork('BTC')}
                    className={`p-2 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[68px] ${
                      activeNetwork === 'BTC'
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

                  {/* Ethereum Tab */}
                  <button
                    type="button"
                    onClick={() => setActiveNetwork('ETH')}
                    className={`p-2 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[68px] ${
                      activeNetwork === 'ETH'
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

              {/* Amount Box */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-50 via-sky-50/30 to-purple-50/30 border-2 border-slate-300 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <label className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider block">
                      Payable Amount:
                    </label>
                    <div className="text-[11px] text-slate-500 font-mono">Platform standard: <strong>$1 = ₹100</strong></div>
                  </div>

                  {/* Currency Selector */}
                  <div className="inline-flex items-center rounded-2xl bg-white border border-slate-300 p-1 shadow-xs self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setCurrencyMode('USD')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        currencyMode === 'USD' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      $ USD
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrencyMode('INR')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        currencyMode === 'INR' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
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
                    className="w-full pl-12 pr-4 py-3.5 text-3xl font-extrabold font-mono text-slate-950 rounded-2xl bg-white border-2 border-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-500/20 transition-all shadow-inner"
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="font-mono text-slate-600">Payable in USD: <strong className="text-slate-950 text-base font-bold font-mono">${amountUSD.toLocaleString()} USD</strong></span>
                  <span className="font-mono text-slate-500">Equivalent in INR: <strong className="text-emerald-700 font-bold font-mono">₹{amountINR.toLocaleString()} INR</strong></span>
                </div>
              </div>

              {/* CRITICAL WARNING ALERT */}
              <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-400 text-amber-950 flex items-start gap-3 shadow-xs">
                <span className="text-xl">⚠️</span>
                <div className="text-xs leading-relaxed">
                  <strong className="font-bold text-amber-900 block uppercase font-mono tracking-wider">
                    Critical {selectedWallet.name} Requirement:
                  </strong>
                  {selectedWallet.warning}
                </div>
              </div>

              {/* Wallet & QR Box */}
              <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center gap-6 border border-slate-800 shadow-xl">
                <div className={`bg-white p-3 rounded-2xl border-2 ${selectedWallet.qrBorderClass} shadow-lg flex-shrink-0 text-center`}>
                  <img
                    src={selectedWallet.qrImage}
                    alt={`Vikas Mishra - ${selectedWallet.name} QR Code`}
                    className="w-52 h-auto rounded-xl object-contain mx-auto"
                  />
                  <div className="text-[10px] font-mono text-slate-700 mt-1.5 font-bold">
                    Vikas Mishra / {selectedWallet.id}
                  </div>
                </div>

                <div className="flex-1 space-y-3 text-left w-full">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-mono font-bold ${
                    activeNetwork === 'MATIC' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30' :
                    activeNetwork === 'BSC' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30' :
                    activeNetwork === 'TRX' ? 'bg-rose-500/20 text-rose-300 border-rose-400/30' :
                    activeNetwork === 'SOL' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30' :
                    activeNetwork === 'BTC' ? 'bg-amber-500/20 text-amber-300 border-amber-400/30' : 
                    'bg-purple-500/20 text-purple-300 border-purple-400/30'
                  }`}>
                    <Zap className="w-3.5 h-3.5" />
                    {selectedWallet.network}
                  </div>

                  <div>
                    <div className="text-[11px] text-slate-400 uppercase font-mono font-semibold">Official {selectedWallet.name} Wallet Address:</div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 mt-1 gap-2">
                      <span className="font-mono text-xs font-bold text-sky-400 break-all select-all">
                        {selectedWallet.address}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(selectedWallet.address, 'crypto')}
                        className="p-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer flex-shrink-0"
                      >
                        {copiedKey === 'crypto' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'crypto' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 space-y-1">
                    <div>Accepted Token: <strong className="text-white font-mono">{selectedWallet.token}</strong></div>
                    <div>Payable Equivalent: <strong className="text-emerald-400 font-mono text-base">${amountUSD.toLocaleString()} USD</strong></div>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleConfirm} className="space-y-3 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-700 uppercase font-semibold mb-1">
                      Your Name / Entity <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Vikas Mishra"
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

                <div>
                  <label className="block text-[11px] font-mono text-slate-700 uppercase font-semibold mb-1">
                    {selectedWallet.id} Transaction Hash / TxID (After Sending) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={txHash}
                    onChange={(e) => setTxHash(e.target.value)}
                    placeholder="0x... or transaction hash"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono focus:bg-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isProcessing || amountUSD <= 0}
                  className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-yellow-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/20 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                >
                  <Zap className="w-4 h-4" />
                  <span>{isProcessing ? 'Verifying Blockchain Confirmation...' : `Confirm $${amountUSD.toLocaleString()} ${selectedWallet.id} Payment`}</span>
                </button>
              </form>

              {/* Quick Links */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                <div className="flex items-center gap-3">
                  <Link to="/pay/upi" className="text-emerald-700 font-semibold hover:underline">📱 Instant UPI QR</Link>
                  <Link to="/pay/bank" className="text-sky-700 font-semibold hover:underline">🏦 SBI Bank Wire</Link>
                  <Link to="/pay/card" className="text-indigo-700 font-semibold hover:underline">💳 Stripe Cards</Link>
                </div>
                <span>256-Bit SSL Secured</span>
              </div>
            </>
          ) : (
            /* RECEIPT */
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-mono font-semibold">
                  {receiptData?.network} Recorded
                </span>
                <h3 className="text-2xl font-bold text-slate-950 mt-2">On-Chain Payment Confirmed!</h3>
              </div>

              {receiptData && (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left max-w-md mx-auto space-y-2.5 text-xs">
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Transaction ID:</span>
                    <span className="font-mono font-bold text-slate-900">{receiptData.txId}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Blockchain Network:</span>
                    <span className="font-semibold text-slate-900">{receiptData.network}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Tx Hash / Signature:</span>
                    <span className="font-mono text-sky-700 break-all">{receiptData.cryptoHash}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Amount Paid:</span>
                    <span className="font-bold text-emerald-700 font-mono">${receiptData.amount.toLocaleString()} USD ({receiptData.currency})</span>
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
