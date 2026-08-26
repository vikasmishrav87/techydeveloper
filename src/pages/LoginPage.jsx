import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  getCurrentUser, 
  sendEmailOTP, 
  verifyEmailOTP 
} from '../services/authService';
import BrandLogo from '../components/BrandLogo';
import GoogleOAuthModal from '../components/GoogleOAuthModal';
import { Shield, Sparkles, Lock, ArrowRight, CheckCircle2, User, Mail, Zap, Globe2, ShieldCheck, Key, Check, AlertCircle, RefreshCw, ArrowLeft, Send } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [authStep, setAuthStep] = useState('email_input'); // 'email_input' | 'otp_verify'
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successNotice, setSuccessNotice] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const otpInputsRef = useRef([]);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      navigate('/account');
    }
  }, [navigate]);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => setResendCooldown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Step 1: Send OTP to Email
  const handleSendCode = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!agreeTerms) {
      setErrorMsg('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessNotice('');

    try {
      const res = await sendEmailOTP(cleanEmail);
      setAuthStep('otp_verify');
      setResendCooldown(45);
      
      if (res.hintCode) {
        setSuccessNotice(`Verification code dispatched to ${cleanEmail}. (Code: ${res.hintCode})`);
      } else {
        setSuccessNotice(`Verification code sent to ${cleanEmail}. Please check your inbox!`);
      }

      // Auto-focus first OTP input after render
      setTimeout(() => {
        if (otpInputsRef.current[0]) otpInputsRef.current[0].focus();
      }, 100);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send verification code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Handle 6-digit OTP input change
  const handleOtpChange = (index, value) => {
    const char = value.slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = char;
    setOtpDigits(newDigits);

    // Auto move to next input
    if (char && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }

    // If all 6 digits entered, auto submit
    const fullCode = newDigits.join('');
    if (fullCode.length === 6 && !newDigits.includes('')) {
      handleVerifyCode(fullCode);
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim().replace(/[^0-9]/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const newDigits = pasted.split('');
      setOtpDigits(newDigits);
      handleVerifyCode(pasted);
    }
  };

  // Step 3: Verify Code & Authenticate
  const handleVerifyCode = async (codeToVerify) => {
    const code = codeToVerify || otpDigits.join('');
    if (code.length !== 6) {
      setErrorMsg('Please enter all 6 digits of the code.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      await verifyEmailOTP(email, code, name);
      navigate('/account');
    } catch (err) {
      setErrorMsg(err.message || 'Invalid verification code. Please check and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await sendEmailOTP(email);
      setResendCooldown(45);
      if (res.hintCode) {
        setSuccessNotice(`New code sent to ${email}. (Code: ${res.hintCode})`);
      } else {
        setSuccessNotice(`New verification code sent to ${email}.`);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Could not resend code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-sky-lavender-mesh text-slate-900 flex items-center justify-center font-sans">
      
      {/* Real Google OAuth Verification Modal */}
      <GoogleOAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSuccess={() => navigate('/account')}
        initialEmail={email}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
        
        {/* Main Card Container */}
        <div className="bg-white/95 border border-indigo-100 rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Column: Interactive Form */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
            
            <div className="mb-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-[11px] font-mono uppercase tracking-wider mb-3">
                <Lock className="w-3.5 h-3.5 text-sky-600" />
                Zero-Trust Passwordless Gateway
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
                {authStep === 'email_input' ? 'Sign In with Email OTP' : 'Enter 6-Digit Security Code'}
              </h2>
              
              <p className="text-slate-600 text-xs sm:text-sm mt-1.5 leading-relaxed">
                {authStep === 'email_input'
                  ? 'We deliver an encrypted 6-digit one-time code to your email inbox for passwordless zero-trust authentication.'
                  : `Enter the 6-digit cryptographic verification code sent to:`}
              </p>

              {authStep === 'otp_verify' && (
                <div className="mt-2 font-mono text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1.5 rounded-xl inline-flex items-center gap-2 border border-sky-200">
                  <Mail className="w-3.5 h-3.5 text-sky-600" />
                  <span>{email}</span>
                </div>
              )}
            </div>

            {/* Error Message Alert */}
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs mb-5 text-left flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Success / Info Alert */}
            {successNotice && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs mb-5 text-left flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                <span>{successNotice}</span>
              </div>
            )}

            {/* STEP 1: Enter Email & Send Code */}
            {authStep === 'email_input' ? (
              <form onSubmit={handleSendCode} className="space-y-4 text-left">
                
                <div>
                  <label className="block text-[11px] font-mono text-slate-700 uppercase font-semibold mb-1.5">
                    Your Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-mono focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-700 uppercase font-semibold mb-1.5">
                    Your Full Name (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Terms agreement checkbox */}
                <div className="flex items-start gap-2 pt-1 text-[11px] text-slate-600 leading-snug">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <label htmlFor="agreeTerms" className="cursor-pointer">
                    I agree to the{' '}
                    <Link to="/terms" target="_blank" className="text-sky-600 hover:underline font-semibold">Terms of Service</Link>{' '}
                    and{' '}
                    <Link to="/privacy" target="_blank" className="text-sky-600 hover:underline font-semibold">Privacy Policy</Link>.
                  </label>
                </div>

                {/* Primary Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-sky-600/20 active:scale-[0.99] disabled:opacity-50 mt-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending Security Code...' : 'Send 6-Digit Code to Email'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Divider */}
                <div className="relative my-4 text-center">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
                  <span className="relative px-3 bg-white text-[11px] font-mono text-slate-400 uppercase">Or Google Auth</span>
                </div>

                {/* Google Sign In Option */}
                <button
                  type="button"
                  onClick={() => setIsGoogleModalOpen(true)}
                  className="w-full py-3 px-4 rounded-2xl bg-white border border-slate-300 hover:border-sky-500 hover:bg-slate-50 text-slate-800 font-semibold text-xs flex items-center justify-center gap-2.5 transition-all shadow-xs active:scale-[0.99] cursor-pointer"
                >
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Continue with Google Identity</span>
                </button>
              </form>
            ) : (
              /* STEP 2: 6-Digit OTP Verification Screen */
              <div className="space-y-6 text-left">
                
                {/* 6 Digit Input Boxes */}
                <div>
                  <label className="block text-[11px] font-mono text-slate-700 uppercase font-semibold mb-3 text-center">
                    Enter 6-Digit Verification Code
                  </label>
                  
                  <div className="flex items-center justify-center gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (otpInputsRef.current[idx] = el)}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-mono font-bold rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-sky-500 focus:bg-white focus:outline-none transition-all text-slate-900 shadow-xs"
                      />
                    ))}
                  </div>
                </div>

                {/* Verify Button */}
                <button
                  type="button"
                  onClick={() => handleVerifyCode()}
                  disabled={isSubmitting || otpDigits.join('').length !== 6}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{isSubmitting ? 'Verifying Code...' : 'Verify Code & Access Account'}</span>
                </button>

                {/* Footer Controls: Resend Code & Change Email */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={resendCooldown > 0 || isSubmitting}
                    className="text-sky-600 hover:text-sky-800 font-semibold disabled:text-slate-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${resendCooldown > 0 ? '' : 'hover:rotate-180 transition-transform'}`} />
                    <span>{resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend Security Code'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setAuthStep('email_input'); setErrorMsg(''); setSuccessNotice(''); }}
                    className="text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Change Email Address</span>
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <Link to="/" className="hover:text-slate-800 transition-colors">← Back to Home</Link>
              <Link to="/contact" className="hover:text-sky-600 transition-colors">Need Technical Support?</Link>
            </div>
          </div>

          {/* Right Column: Benefits Showcase */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-[#0B1120] to-indigo-950 text-white p-6 sm:p-8 flex flex-col justify-between text-left">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>

              <h3 className="text-lg font-bold text-white mb-2">Passwordless Zero-Trust Access</h3>
              <p className="text-slate-300 text-xs leading-relaxed mb-6">
                Your authenticated account preserves your technical workspace across all 8 specialized practices:
              </p>

              <div className="space-y-3.5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-white">Preserved Security & SEO Audits:</strong> Full cryptographic reports saved to your profile for continuous tracking.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-white">Custom Estimator Workspaces:</strong> Save and compare complex squad staffing models and delivery timelines.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-white">Direct VIP WhatsApp Line:</strong> Priority routing to Vikas Mishra and dedicated lead specialists.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-white">Instant Pro Membership Upgrade:</strong> Unlock 24/7 Red-Team war room dispatch and deep architecture blueprints.
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
