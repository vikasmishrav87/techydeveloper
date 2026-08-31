import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, Check, X, Clock, RefreshCw, Eye, MessageCircle, 
  ExternalLink, ArrowLeft, Search, Filter, AlertCircle 
} from 'lucide-react';
import { supabase } from '../services/supabaseClient';

export default function AdminVerifyPage() {
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get('id');

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('ue_admin_auth_verified') === 'true' || sessionStorage.getItem('ue_admin_auth_verified') === 'true';
  });
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === 'vikas87' || passcode === 'admin87' || passcode === 'vikasmishraji87' || passcode === '87') {
      setIsAuthenticated(true);
      localStorage.setItem('ue_admin_auth_verified', 'true');
      setAuthError('');
    } else {
      setAuthError('Invalid executive passkey.');
    }
  };

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch from serverless API
      const res = await fetch('/api/payments', {
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.payments) {
          setPayments(data.payments);
        }
      }
    } catch (e) {
      console.error('Fetch payments err:', e);
    }

    // 2. Also fetch from Supabase
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('createdAt', { ascending: false });
      if (data && !error && data.length > 0) {
        setPayments(data);
      }
    } catch (e) {}

    setIsLoading(false);
  };

  useEffect(() => {
    fetchPayments();
    const interval = setInterval(fetchPayments, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDecision = async (id, status, reason = '') => {
    setActionLoading(prev => ({ ...prev, [id]: true }));

    try {
      // 1. Update API
      await fetch('/api/payments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, reason })
      });

      // 2. Update local state
      setPayments(prev =>
        prev.map(p => (p.id === id ? { ...p, status, rejectionReason: reason, updatedAt: new Date().toISOString() } : p))
      );

      // 3. Update Supabase
      try {
        await supabase
          .from('payments')
          .update({ status, rejectionReason: reason, updatedAt: new Date().toISOString() })
          .eq('id', id);
      } catch (e) {}
    } catch (err) {
      alert('Error updating decision: ' + err.message);
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const filteredPayments = payments.filter(p => {
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.id?.toLowerCase().includes(q) ||
        p.clientName?.toLowerCase().includes(q) ||
        p.clientEmail?.toLowerCase().includes(q) ||
        p.utr?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-slate-950 text-white font-sans flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">Executive Verification Portal</h2>
            <p className="text-slate-400 text-xs mt-1">
              Restricted to Vikas Mishra. Enter your executive passkey to review and approve live client transactions.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter Executive Passkey..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-center font-mono text-sm focus:border-sky-500 focus:outline-none tracking-widest"
                autoFocus
              />
              {authError && (
                <div className="text-rose-400 text-xs font-semibold mt-1.5">{authError}</div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/20"
            >
              <span>Unlock Verification Ledger</span>
              <Check className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-950 text-white font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Executive Verification Ledger
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Payment Verification & Approvals</h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
              Real-time ledger for Vikas Mishra. Approving or denying instantly syncs to the client's screen.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchPayments}
              disabled={isLoading}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono font-semibold flex items-center gap-1.5 border border-slate-800 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Ledger</span>
            </button>
            <Link
              to="/checkout"
              className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-md"
            >
              Open Checkout ↗
            </Link>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID, Client Name, Email, or UTR..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none font-mono"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto font-mono text-xs">
            {['all', 'pending', 'approved', 'rejected'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg uppercase text-[11px] font-bold transition-all cursor-pointer ${
                  filterStatus === st
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Highlighted Alert if specific ID in URL */}
        {highlightId && (
          <div className="p-4 rounded-2xl bg-sky-950/80 border border-sky-600 text-sky-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-sky-400 flex-shrink-0" />
              <span>Viewing highlighted transaction: <strong>{highlightId}</strong></span>
            </div>
            <button
              onClick={() => setSearchQuery(highlightId)}
              className="text-[11px] underline font-mono text-sky-300 font-bold"
            >
              Filter to this order
            </button>
          </div>
        )}

        {/* Payments List */}
        <div className="space-y-4">
          {isLoading && payments.length === 0 ? (
            <div className="p-12 text-center text-slate-500 font-mono text-xs">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-slate-600" />
              Loading real-time payments ledger...
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="p-12 rounded-3xl bg-slate-900/50 border border-slate-800 text-center text-slate-500 font-mono text-xs">
              No transactions found matching criteria.
            </div>
          ) : (
            filteredPayments.map((p) => {
              const isHighlight = p.id === highlightId;
              const isPending = p.status === 'pending';
              const isApproved = p.status === 'approved';
              const isRejected = p.status === 'rejected';

              return (
                <div
                  key={p.id}
                  className={`p-5 sm:p-6 rounded-3xl border transition-all ${
                    isHighlight
                      ? 'bg-slate-900 border-sky-500 ring-2 ring-sky-500/30'
                      : isPending
                      ? 'bg-slate-900 border-amber-500/40 ring-1 ring-amber-500/20'
                      : isApproved
                      ? 'bg-slate-900/80 border-emerald-500/40'
                      : 'bg-slate-900/60 border-rose-500/30'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    
                    {/* Left: Info */}
                    <div className="space-y-3 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-mono font-bold text-sm text-sky-400 select-all">
                          {p.id}
                        </span>

                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                            isPending
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : isApproved
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {p.status}
                        </span>

                        <span className="text-slate-500 text-xs font-mono">
                          {new Date(p.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <div className="text-slate-500 text-[10px]">CLIENT</div>
                          <div className="font-bold text-white truncate">{p.clientName}</div>
                          <div className="text-slate-400 text-[11px] truncate">{p.clientEmail}</div>
                        </div>

                        <div>
                          <div className="text-slate-500 text-[10px]">PAYMENT METHOD</div>
                          <div className="font-bold text-white">{p.method}</div>
                          <div className="text-emerald-400 font-mono font-bold text-sm">
                            ${p.amountUSD?.toLocaleString()} USD <span className="text-slate-400 text-xs font-normal">(₹{p.amountINR?.toLocaleString()})</span>
                          </div>
                        </div>

                        <div>
                          <div className="text-slate-500 text-[10px]">SUBMITTED UTR / REFERENCE</div>
                          <div className="font-mono font-bold text-amber-400 text-xs break-all select-all">
                            {p.utr || 'No UTR provided'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Screenshot Preview */}
                    {p.screenshot && (
                      <div className="flex-shrink-0">
                        <img
                          src={p.screenshot}
                          alt="Screenshot Proof"
                          onClick={() => setSelectedImage(p.screenshot)}
                          className="w-20 h-20 rounded-2xl object-cover border border-slate-700 cursor-pointer hover:opacity-80 transition-opacity bg-black"
                          title="Click to view full image"
                        />
                        <div className="text-[10px] text-center text-slate-500 font-mono mt-1">
                          Click to expand
                        </div>
                      </div>
                    )}

                    {/* Decision Buttons */}
                    <div className="flex sm:flex-col gap-2 flex-shrink-0">
                      {isPending ? (
                        <>
                          <button
                            onClick={() => handleDecision(p.id, 'approved')}
                            disabled={actionLoading[p.id]}
                            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
                          >
                            <Check className="w-4 h-4 stroke-[3]" />
                            <span>Approve Payment</span>
                          </button>

                          <button
                            onClick={() => {
                              const reason = prompt('Enter rejection reason (optional):', 'UTR could not be matched with bank ledger');
                              if (reason !== null) handleDecision(p.id, 'rejected', reason);
                            }}
                            disabled={actionLoading[p.id]}
                            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
                          >
                            <X className="w-4 h-4 stroke-[3]" />
                            <span>Deny / Reject</span>
                          </button>
                        </>
                      ) : isApproved ? (
                        <div className="text-right">
                          <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-bold">
                            <Check className="w-4 h-4" /> Approved
                          </span>
                          <button
                            onClick={() => handleDecision(p.id, 'rejected', 'Revoked by Executive')}
                            className="block text-[10px] text-slate-500 hover:text-rose-400 underline mt-1"
                          >
                            Revoke Approval
                          </button>
                        </div>
                      ) : (
                        <div className="text-right">
                          <span className="inline-flex items-center gap-1 text-rose-400 text-xs font-bold">
                            <X className="w-4 h-4" /> Rejected
                          </span>
                          <button
                            onClick={() => handleDecision(p.id, 'approved')}
                            className="block text-[10px] text-slate-500 hover:text-emerald-400 underline mt-1"
                          >
                            Change to Approved
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

      {/* Full Resolution Image Lightbox Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-auto">
            <img
              src={selectedImage}
              alt="Full Resolution Proof"
              className="max-w-full max-h-[85vh] rounded-2xl border border-slate-700 shadow-2xl mx-auto"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 text-white hover:bg-slate-800"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
