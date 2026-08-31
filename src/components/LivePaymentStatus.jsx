import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, XCircle, Clock, ShieldCheck, Download, RefreshCw, 
  MessageCircle, ExternalLink, ArrowRight, Copy, Check, Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { checkPaymentStatus, triggerWhatsAppApprovalAlert, clearActiveClientPayment } from '../services/paymentService';

export default function LivePaymentStatus({ payment, onReset }) {
  const [currentPayment, setCurrentPayment] = useState(payment);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [copiedKey, setCopiedKey] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Timer tick
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Poll status every 2 seconds while pending
  useEffect(() => {
    if (!currentPayment || currentPayment.status !== 'pending') return;

    const interval = setInterval(async () => {
      const updated = await checkPaymentStatus(currentPayment.id);
      if (updated && updated.status !== currentPayment.status) {
        setCurrentPayment(prev => ({ ...prev, ...updated }));
        if (updated.status === 'approved') {
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 }
          });
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [currentPayment?.id, currentPayment?.status]);

  const handleManualCheck = async () => {
    setIsRefreshing(true);
    const updated = await checkPaymentStatus(currentPayment.id);
    if (updated) {
      setCurrentPayment(prev => ({ ...prev, ...updated }));
      if (updated.status === 'approved') {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      }
    }
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // 1. APPROVED STATE
  if (currentPayment.status === 'approved') {
    return (
      <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-emerald-400 shadow-2xl text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-mono font-bold uppercase mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Executive Verified & Confirmed
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">Payment Received & Confirmed! 🎉</h2>
          <p className="text-slate-600 text-sm mt-1">
            Your transaction has been approved by Vikas Mishra. Your engineering retainer & milestone is now officially active.
          </p>
        </div>

        {/* Official Receipt Card */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left font-mono text-xs space-y-3 print:border-none print:shadow-none">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="font-bold text-slate-950 text-sm">THE UNFILTERED ENGINEER</span>
            <span className="text-emerald-700 font-bold">OFFICIAL RECEIPT</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-slate-700">
            <div>
              <span className="text-slate-400 text-[10px]">ORDER ID:</span>
              <div className="font-bold text-slate-950 select-all">{currentPayment.id}</div>
            </div>
            <div>
              <span className="text-slate-400 text-[10px]">METHOD:</span>
              <div className="font-bold text-slate-950">{currentPayment.method}</div>
            </div>
            <div>
              <span className="text-slate-400 text-[10px]">AMOUNT:</span>
              <div className="font-bold text-emerald-700 text-sm">${currentPayment.amountUSD?.toLocaleString()} USD (₹{currentPayment.amountINR?.toLocaleString()})</div>
            </div>
            <div>
              <span className="text-slate-400 text-[10px]">UTR / TXID:</span>
              <div className="font-bold text-slate-950 truncate">{currentPayment.utr || 'Direct Escrow'}</div>
            </div>
            <div>
              <span className="text-slate-400 text-[10px]">CLIENT:</span>
              <div className="font-bold text-slate-950">{currentPayment.clientName}</div>
            </div>
            <div>
              <span className="text-slate-400 text-[10px]">TIMESTAMP:</span>
              <div className="text-slate-950">{new Date(currentPayment.updatedAt || currentPayment.createdAt).toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handlePrint}
            className="flex-1 py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Download / Print PDF Receipt</span>
          </button>
          
          <a
            href={`https://wa.me/919137507092?text=${encodeURIComponent(`Hi Vikas, my payment of $${currentPayment.amountUSD} (Order: ${currentPayment.id}) is confirmed. Let's start the project scope.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Message Vikas on WhatsApp</span>
          </a>
        </div>
      </div>
    );
  }

  // 2. REJECTED / FAILED STATE
  if (currentPayment.status === 'rejected') {
    return (
      <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-rose-400 shadow-2xl text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto ring-8 ring-rose-50">
          <XCircle className="w-10 h-10" />
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-mono font-bold uppercase mb-2">
            Payment Verification Denied
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">Verification Unsuccessful ❌</h2>
          <p className="text-slate-600 text-sm mt-1">
            {currentPayment.rejectionReason || 'The UTR / reference number or screenshot provided could not be verified in the bank/ledger records.'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 font-mono text-left space-y-1">
          <div><strong>Order ID:</strong> {currentPayment.id}</div>
          <div><strong>Submitted UTR:</strong> {currentPayment.utr}</div>
          <div><strong>Status:</strong> Not cleared in ledger records</div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => {
              clearActiveClientPayment();
              if (onReset) onReset();
            }}
            className="flex-1 py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Re-Submit Valid Payment Proof</span>
          </button>

          <a
            href={`https://wa.me/919137507092?text=${encodeURIComponent(`Hi Vikas, my payment verification for Order ${currentPayment.id} ($${currentPayment.amountUSD}) was denied. Here is my correct transaction details.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Resolve on WhatsApp</span>
          </a>
        </div>
      </div>
    );
  }

  // 3. PENDING WAITING STATE (REAL-TIME RADAR)
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-2xl space-y-6 text-center animate-fade-in relative overflow-hidden">
      
      {/* Background Animated Pulse */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.08)_0%,transparent_70%)] pointer-events-none" />

      {/* Radar Animation */}
      <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-sky-500/30 animate-ping" />
        <div className="absolute inset-2 rounded-full border border-sky-400/40 animate-pulse" />
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/30">
          <Clock className="w-8 h-8 animate-spin-slow" />
        </div>
      </div>

      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-mono font-bold uppercase tracking-wider mb-2 border border-sky-500/30">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
          Awaiting Executive Approval
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Verifying Your Transaction...</h2>
        <p className="text-slate-400 text-sm mt-1 max-w-md mx-auto">
          We have notified Vikas Mishra directly on WhatsApp. This screen will <strong>automatically update</strong> the instant your payment is approved.
        </p>
      </div>

      {/* Live Counter & Details Box */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-left font-mono text-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">ORDER ID:</span>
            <span className="font-bold text-sky-400 select-all">{currentPayment.id}</span>
          </div>
          <div className="text-slate-400 text-[11px]">
            Waiting: <span className="text-emerald-400 font-bold">{formatTime(elapsedSeconds)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-slate-300">
          <div>
            <span className="text-slate-500 text-[10px] block">PAYABLE AMOUNT</span>
            <strong className="text-white text-sm">${currentPayment.amountUSD?.toLocaleString()} USD</strong> (₹{currentPayment.amountINR?.toLocaleString()})
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">PAYMENT METHOD</span>
            <strong className="text-white">{currentPayment.method}</strong>
          </div>
          <div className="col-span-2">
            <span className="text-slate-500 text-[10px] block">SUBMITTED UTR / REFERENCE / TXID</span>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800 mt-0.5">
              <span className="font-bold text-amber-400 truncate select-all">{currentPayment.utr}</span>
              <button
                type="button"
                onClick={() => handleCopy(currentPayment.utr, 'utr')}
                className="text-[10px] text-slate-400 hover:text-white px-2 py-0.5 rounded bg-white/10"
              >
                {copiedKey === 'utr' ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {currentPayment.screenshot && (
          <div className="pt-2 border-t border-slate-800 flex items-center gap-3">
            <img
              src={currentPayment.screenshot}
              alt="Payment Proof Preview"
              className="w-12 h-12 rounded-lg object-cover border border-slate-700 bg-black"
            />
            <div className="text-[11px] text-slate-400">
              <span className="text-emerald-400 font-semibold">✓ Payment Screenshot Attached</span>
              <div className="text-[10px] text-slate-500">Transferred securely to executive verification ledger</div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-1">
        <button
          type="button"
          onClick={() => triggerWhatsAppApprovalAlert(currentPayment)}
          className="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/20 active:scale-[0.99]"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Ping Vikas on WhatsApp for Fast-Track Approval</span>
        </button>

        <button
          type="button"
          onClick={handleManualCheck}
          disabled={isRefreshing}
          className="py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Check Status</span>
        </button>
      </div>

      <div className="text-[11px] text-slate-500">
        💡 <em>Do not close this page. Once Vikas Mishra approves the transaction from WhatsApp, your receipt will load automatically.</em>
      </div>

    </div>
  );
}
