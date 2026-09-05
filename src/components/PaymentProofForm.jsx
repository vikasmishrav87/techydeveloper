import React, { useState, useRef } from 'react';
import { 
  Upload, Check, X, ShieldCheck, Image as ImageIcon, Camera, Lock, Zap, ArrowRight 
} from 'lucide-react';
import { submitPaymentVerification, triggerWhatsAppApprovalAlert } from '../services/paymentService';

export default function PaymentProofForm({
  methodName,
  network = '',
  amountUSD,
  amountINR,
  currencyMode,
  serviceName,
  defaultUtrLabel = 'UTR / Reference Number',
  utrPlaceholder = 'e.g. 423948293849',
  onSubmitted
}) {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshotData, setScreenshotData] = useState('');
  const [screenshotFileName, setScreenshotFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, JPEG, WebP).');
      return;
    }
    setScreenshotFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const optimizedBase64 = canvas.toDataURL('image/jpeg', 0.85);
        setScreenshotData(optimizedBase64);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setScreenshotData('');
    setScreenshotFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clientName || !clientEmail) {
      alert('Please enter your Name and Email for payment receipt generation.');
      return;
    }
    if (!utrNumber || utrNumber.trim().length === 0) {
      alert('Please enter your 12-digit UTR, Tx Hash, or bank reference number.');
      return;
    }
    if (!screenshotData) {
      alert('⚠️ Mandatory Requirement: Please attach your payment screenshot or photo proof to verify this transaction.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payment = await submitPaymentVerification({
        amountUSD,
        amountINR,
        currency: currencyMode,
        method: methodName,
        network,
        clientName,
        clientEmail,
        clientPhone,
        service: serviceName,
        utr: utrNumber,
        screenshot: screenshotData
      });

      // Automatically trigger WhatsApp ping to Vikas Mishra with 1-click Approve / Deny
      triggerWhatsAppApprovalAlert(payment);

      if (onSubmitted) {
        onSubmitted(payment);
      }
    } catch (err) {
      console.error('Submission failed:', err);
      alert('Failed to submit verification. Please try again or message Vikas Mishra directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      
      {/* Client Identity Fields */}
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
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-sky-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-slate-700 uppercase font-semibold mb-1">
            Email for Official Receipt <span className="text-rose-500">*</span>
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

      {/* UTR / Transaction ID Input */}
      <div>
        <label className="block text-[11px] font-mono text-slate-700 uppercase font-semibold mb-1">
          {defaultUtrLabel} <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          required
          value={utrNumber}
          onChange={(e) => setUtrNumber(e.target.value)}
          placeholder={utrPlaceholder}
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono focus:bg-white focus:border-emerald-500 focus:outline-none"
        />
        <div className="text-[10px] text-slate-500 mt-1">
          Enter the 12-digit UTR, IMPS/NEFT Ref, TxHash, or Transaction ID from your banking/crypto app.
        </div>
      </div>

      {/* Screenshot / Photo Attachment */}
      <div>
        <label className="block text-[11px] font-mono text-slate-700 uppercase font-semibold mb-1 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span>Attach Payment Screenshot / Photo</span>
            <span className="text-rose-600 font-black text-sm">*</span>
          </span>
          <span className="text-rose-600 text-[10px] font-bold uppercase tracking-wider bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
            Mandatory Proof
          </span>
        </label>

        {!screenshotData ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`p-4 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all ${
              dragActive 
                ? 'border-emerald-500 bg-emerald-50/80 scale-[1.01]' 
                : 'border-rose-300 hover:border-emerald-500 bg-rose-50/20 hover:bg-emerald-50/30'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-rose-200 text-rose-500 flex items-center justify-center mx-auto mb-2">
              <Upload className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-slate-900 flex items-center justify-center gap-1">
              <span>Click to upload or drag & drop screenshot</span>
              <span className="text-rose-600 font-black">*</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Supports PNG, JPG, JPEG, camera photo slips (Required for verification)
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-300 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={screenshotData}
                alt="Uploaded Payment Slip"
                className="w-14 h-14 rounded-xl object-cover border border-emerald-400 bg-white"
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-950 truncate">{screenshotFileName || 'Payment_Slip.png'}</div>
                <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> Screenshot Attached Successfully
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRemoveImage}
              className="p-2 rounded-xl bg-white hover:bg-rose-100 hover:text-rose-600 text-slate-600 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
              title="Remove Screenshot"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Submit CTA Button */}
      <button
        type="submit"
        disabled={isSubmitting || amountUSD <= 0 || !screenshotData}
        className={`w-full py-4 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.99] cursor-pointer ${
          !screenshotData 
            ? 'bg-slate-300 text-slate-600 cursor-not-allowed shadow-none' 
            : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 text-white shadow-emerald-600/20'
        }`}
      >
        <Zap className="w-4 h-4" />
        <span>
          {isSubmitting
            ? 'Submitting Proof to Executive...'
            : !screenshotData
            ? '⚠️ Attach Screenshot Above to Submit Verification'
            : `Submit ₹${amountINR?.toLocaleString()} ($${amountUSD?.toLocaleString()} USD) for Instant Verification`}
        </span>
        <ArrowRight className="w-4 h-4" />
      </button>

    </form>
  );
}
