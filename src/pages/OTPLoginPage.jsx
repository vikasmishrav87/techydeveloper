import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  getVerifiedUser, 
  sendOtpToEmail, 
  verifyOtpWithServer,
  logoutVerifiedUser 
} from '../services/otpAuthService';
import BrandLogo from '../components/BrandLogo';
import { Shield, Sparkles, Lock, ArrowRight, CheckCircle2, User, Mail, Zap, Globe2, ShieldCheck, Key, Check, AlertCircle, RefreshCw, ArrowLeft, Send, Fingerprint, LogOut } from 'lucide-react';

export default function OTPLoginPage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [step, setStep] = useState('email'); // 'email' | 'otp' | 'success'
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successNotice, setSuccessNotice] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  const otpInputsRef = useRef([]);

  useEffect(() => {
    setCurrentUser(getVerifiedUser());
  }, []);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => setResendTimer(t => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  // Step 1: Send OTP to real email
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessNotice('');

    try {
      await sendOtpToEmail(cleanEmail);
      setStep('otp');
      setResendTimer(60);
      setSuccessNotice(`A 6-digit security code has been sent to ${cleanEmail}. Please check your email inbox!`);

      setTimeout(() => {
        if (otpInputsRef.current[0]) otpInputsRef.current[0].focus();
      }, 100);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send OTP code. Please check your email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Handle individual digit inputs
  const handleDigitChange = (index, value) => {
    const cleanChar = value.replace(/[^0-9]/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = cleanChar;
    setOtpDigits(newDigits);

    if (cleanChar && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }

    const fullCode = newDigits.join('');
    if (fullCode.length === 6 && !newDigits.includes('')) {
      handleVerify(fullCode);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim().replace(/[^0-9]/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtpDigits(pasted.split(''));
      handleVerify(pasted);
    }
  };

  // Step 3: Verify with real server
  const handleVerify = async (codeToVerify) => {
    const code = codeToVerify || otpDigits.join('');
    if (code.length !== 6) {
      setErrorMsg('Please enter all 6 digits.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const user = await verifyOtpWithServer(email, code, fullName);
      setCurrentUser(user);
      setStep('success');
    } catch (err) {
      setErrorMsg(err.message || 'Incorrect verification code. Please check your email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = () => {
    logoutVerifiedUser();
    setCurrentUser(null);
    setStep('email');
    setEmail('');
    setOtpDigits(['', '', '', '', '', '']);
    setSuccessNotice('Signed out successfully.');
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-sky-lavender-mesh text-slate-900 flex items-center justify-center font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
        
        {/* Active Verified Session Banner */}
        {currentUser && step !== 'success' && (
          <div className="mb-6 p-4 rounded-2xl bg-white border border-emerald-200 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-emerald-600 font-mono font-semibold">Verified Member Session Active</div>
                <div className="text-sm font-bold text-slate-900">{currentUser.email}</div>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        )}

        {/* Main Card Container */}
        <div className="bg-white/95 border border-indigo-100 rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Column: Real OTP Form */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center text-left">
            
            {/* Header */}
            <div className="mb-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-[11px] font-mono uppercase tracking-wider mb-2.5">
                <Lock className="w-3.5 h-3.5 text-sky-600" />
                Live Email OTP Verification
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
                {step === 'email' && 'Email Security Verification'}
                {step === 'otp' && 'Enter 6-Digit Security Code'}
                {step === 'success' && 'Identity Verified!'}
              </h2>
              
              <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">
                {step === 'email' && 'Enter your email address to receive a real 6-digit cryptographic passcode in your inbox.'}
                {step === 'otp' && `Enter the 6-digit code dispatched to:`}
                {step === 'success' && 'Your session is cryptographically authenticated and active.'}
              </p>

              {step === 'otp' && (
                <div className="mt-2 font-mono text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1.5 rounded-xl inline-flex items-center gap-2 border border-sky-200">
                  <Mail className="w-3.5 h-3.5 text-sky-600" />
                  <span>{email}</span>
                </div>
              )}
            </div>

            {/* Error Message Alert */}
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Success Notice Alert */}
            {successNotice && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                <span>{successNotice}</span>
              </div>
            )}

            {/* STEP 1: Enter Email */}
            {step === 'email' && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono text-slate-700 uppercase font-semibold mb-1">
                    Your Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email (e.g. vikasmishraoffice87@gmail.com)"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-mono focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-700 uppercase font-semibold mb-1">
                    Full Name (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-sky-600/20 active:scale-[0.99] disabled:opacity-50 mt-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Dispatching Real Email...' : 'Send 6-Digit Code to Email'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* STEP 2: 6-Digit Code Input */}
            {step === 'otp' && (
              <div className="space-y-5">
                <div>
                  <label className="block text-[11px] font-mono text-slate-700 uppercase font-semibold mb-3 text-center">
                    Enter the 6-Digit Code from Your Email Inbox
                  </label>
                  
                  <div className="flex items-center justify-center gap-2 sm:gap-2.5" onPaste={handlePaste}>
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (otpInputsRef.current[idx] = el)}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleDigitChange(idx, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(idx, e)}
                        className="w-10 h-12 sm:w-11 sm:h-13 text-center text-xl sm:text-2xl font-mono font-bold rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-sky-500 focus:bg-white focus:outline-none transition-all text-slate-900 shadow-xs"
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleVerify()}
                  disabled={isSubmitting || otpDigits.join('').length < 6}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{isSubmitting ? 'Verifying with Server...' : 'Verify Code'}</span>
                </button>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => { setStep('email'); setOtpDigits(['', '', '', '', '', '']); setErrorMsg(''); }}
                    className="text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Change Email
                  </button>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={resendTimer > 0 || isSubmitting}
                    className="text-sky-600 hover:text-sky-800 font-semibold flex items-center gap-1 cursor-pointer disabled:text-slate-400"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${resendTimer > 0 ? '' : 'hover:rotate-180 transition-transform'}`} />
                    <span>{resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Verification Success */}
            {step === 'success' && (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Email Verified Successfully!</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Welcome to <strong>The Unfiltered Engineer</strong>. Your identity has been verified via 6-digit email OTP.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    to="/"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs"
                  >
                    Explore Practices →
                  </Link>
                  <Link
                    to="/security-audit"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs"
                  >
                    Run Security Audit
                  </Link>
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <Link to="/" className="hover:text-slate-800 transition-colors">← Back to Home</Link>
              <Link to="/contact" className="hover:text-sky-600 transition-colors">Contact Vikas Mishra</Link>
            </div>
          </div>

          {/* Right Column: Benefits Showcase */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-[#0B1120] to-indigo-950 text-white p-6 sm:p-8 flex flex-col justify-between text-left">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>

              <h3 className="text-lg font-bold text-white mb-2">Live Email OTP Security</h3>
              <p className="text-slate-300 text-xs leading-relaxed mb-6">
                Direct passwordless cryptographic authentication dispatched to your inbox in real time:
              </p>

              <div className="space-y-3.5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-white">Real Email Inbox Dispatch:</strong> Codes sent in &lt;1 second directly to your email address.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-white">10-Minute Expiration:</strong> Zero-trust expiring OTP token storage.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-white">Direct VIP WhatsApp:</strong> Priority line with Vikas Mishra (+919137507092).
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
              Zero Vendor Overhead • 1,000+ Senior Engineers Worldwide
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
