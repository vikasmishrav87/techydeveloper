import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  Zap, Copy, Check, ArrowLeft, ShieldCheck, ArrowRight 
} from 'lucide-react';
import PaymentProofForm from '../components/PaymentProofForm';
import LivePaymentStatus from '../components/LivePaymentStatus';

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
    path: '/pay/polygon',
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
    path: '/pay/bnb',
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
    path: '/pay/tron',
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
    path: '/pay/sol',
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
    path: '/pay/btc',
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
    path: '/pay/eth',
    warning: 'CRITICAL: Send ONLY via the Ethereum Network (ERC-20). Any transfer from other networks (e.g. Tron, BSC, Solana, Polygon) will result in permanent loss of your assets.'
  }
};

export default function CryptoPaymentPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const resolveNetwork = () => {
    const path = location.pathname.toLowerCase();
    if (path.includes('polygon') || path.includes('matic') || path.includes('pol')) return 'MATIC';
    if (path.includes('bnb') || path.includes('bsc') || path.includes('bep20')) return 'BSC';
    if (path.includes('tron') || path.includes('trx') || path.includes('trc20')) return 'TRX';
    if (path.includes('sol') || path.includes('solana')) return 'SOL';
    if (path.includes('btc') || path.includes('bitcoin')) return 'BTC';
    if (path.includes('eth') || path.includes('ethereum') || path.includes('crypto')) return 'ETH';
    const qNet = searchParams.get('net')?.toUpperCase();
    if (qNet && CRYPTO_NETWORKS[qNet]) return qNet;
    return 'MATIC';
  };

  const [activeNetwork, setActiveNetwork] = useState(resolveNetwork());

  useEffect(() => {
    setActiveNetwork(resolveNetwork());
  }, [location.pathname, searchParams]);

  const [currencyMode, setCurrencyMode] = useState(searchParams.get('currency')?.toUpperCase() || 'USD');
  const [manualAmount, setManualAmount] = useState(searchParams.get('amount') || '100');
  const serviceName = searchParams.get('service') || 'Custom Engineering Scope / Milestone Retainer';
  const clientParam = searchParams.get('client') || '';

  const [activePayment, setActivePayment] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  const selectedWallet = CRYPTO_NETWORKS[activeNetwork] || CRYPTO_NETWORKS.MATIC;

  const parsedVal = parseFloat(manualAmount) || 0;
  const amountUSD = currencyMode === 'USD' ? parsedVal : Math.round((parsedVal / USD_TO_INR_RATE) * 100) / 100;
  const amountINR = currencyMode === 'INR' ? parsedVal : Math.round(parsedVal * USD_TO_INR_RATE);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleNetworkSelect = (netKey) => {
    setActiveNetwork(netKey);
    const targetPath = CRYPTO_NETWORKS[netKey]?.path || '/pay/crypto';
    const currentParams = searchParams.toString();
    navigate(`${targetPath}${currentParams ? `?${currentParams}` : ''}`);
  };

  return (
    <div className="min-h-screen pt-28 pb-24 bg-[#FAF7EE] text-[#141414] font-sans flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 w-full text-left">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/checkout" className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-slate-600 hover:text-sky-700 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Universal Checkout Suite</span>
          </Link>
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono font-bold ${selectedWallet.badgeClass}`}>
            <Zap className="w-3.5 h-3.5" />
            {selectedWallet.network}
          </div>
        </div>

        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="size-16 rounded-2xl overflow-hidden bg-[#141414] border-2 border-[#141414] shadow-[4px_4px_0_0_#FF4D00] p-1.5 mx-auto mb-4 hover:scale-105 transition-transform">
            <img src="/assets/brand-logo.png" alt="The Unfiltered Engineer Official Brand Logo" className="w-full h-full object-contain rounded-xl" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-mono uppercase font-bold tracking-wider mb-2">
            <span>Dedicated Payment Gateway</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
            {selectedWallet.name} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-sky-600 to-purple-600">Portal</span>
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1.5">
            Dedicated URL: <strong className="font-mono text-slate-900">{selectedWallet.path}</strong> • Direct on-chain settlement.
          </p>
        </div>

        {/* Main Card */}
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
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
                  Dedicated Blockchain Pages:
                </label>
                <span className="text-[11px] font-mono text-slate-500">6 Blockchains</span>
              </div>
              
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                
                {/* Polygon Tab */}
                <button
                  type="button"
                  onClick={() => handleNetworkSelect('MATIC')}
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
                  <div className="text-[8px] text-slate-500 font-mono">POL (PoS)</div>
                </button>

                {/* BNB Tab */}
                <button
                  type="button"
                  onClick={() => handleNetworkSelect('BSC')}
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
                  <div className="text-[8px] text-slate-500 font-mono">BEP-20</div>
                </button>

                {/* Tron Tab */}
                <button
                  type="button"
                  onClick={() => handleNetworkSelect('TRX')}
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
                  <div className="text-[8px] text-slate-500 font-mono">TRC-20</div>
                </button>

                {/* Solana Tab */}
                <button
                  type="button"
                  onClick={() => handleNetworkSelect('SOL')}
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
                  <div className="text-[8px] text-slate-500 font-mono">SPL</div>
                </button>

                {/* Bitcoin Tab */}
                <button
                  type="button"
                  onClick={() => handleNetworkSelect('BTC')}
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
                  <div className="text-[8px] text-slate-500 font-mono">Native BTC</div>
                </button>

                {/* Ethereum Tab */}
                <button
                  type="button"
                  onClick={() => handleNetworkSelect('ETH')}
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
                  <div className="text-[8px] text-slate-500 font-mono">ERC-20</div>
                </button>

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

            {/* Amount Box */}
            <div className="p-5 rounded-3xl bg-slate-50 border-2 border-indigo-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <label className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider block">
                    Payable Amount:
                  </label>
                  <div className="text-[11px] text-slate-500 font-mono">Rate standard: <strong>$1 = ₹100</strong></div>
                </div>

                <div className="inline-flex items-center rounded-2xl bg-white border border-slate-300 p-1 shadow-xs self-start sm:self-auto">
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
                <span className="font-mono text-slate-600">Crypto Total: <strong className="text-indigo-700 text-base font-bold font-mono">${amountUSD.toLocaleString()} USD</strong></span>
                <span className="font-mono text-slate-500">Equivalent INR: <strong className="text-slate-900 font-bold font-mono">₹{amountINR.toLocaleString()} INR</strong></span>
              </div>
            </div>

            {/* QR Scanner & Address Box */}
            <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center gap-6 border border-slate-800 shadow-xl">
              <div className="bg-white p-3 rounded-2xl border-2 border-indigo-400 shadow-lg flex-shrink-0 text-center">
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

            {/* Payment Proof Submission Form */}
            <div className="pt-2 border-t border-slate-100">
              <div className="mb-3">
                <h3 className="text-sm font-bold text-slate-950">Submit On-Chain Proof for Instant Executive Approval</h3>
                <p className="text-xs text-slate-500">
                  After broadcasting your {selectedWallet.name} transaction, enter your TxHash or attach a wallet screenshot below.
                </p>
              </div>

              <PaymentProofForm
                methodName={`Web3 Crypto (${selectedWallet.name})`}
                network={selectedWallet.network}
                amountUSD={amountUSD}
                amountINR={amountINR}
                currencyMode={currencyMode}
                serviceName={serviceName}
                defaultUtrLabel={`${selectedWallet.id} Transaction Hash (TxID) / Reference`}
                utrPlaceholder={activeNetwork === 'BTC' ? 'Bitcoin txid...' : '0x...'}
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
                <Link to={`/pay/card?amount=${amountUSD}&currency=${currencyMode}`} className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-200 hover:bg-indigo-100 font-medium">
                  💳 Stripe Cards
                </Link>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
