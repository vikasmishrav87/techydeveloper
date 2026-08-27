import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  getCurrentUser, 
  signInWithSupabase, 
  signUpWithSupabase, 
  sendEmailOTP,
  verifyEmailOTP,
  signInWithGoogleOAuth,
  logoutUser 
} from '../services/authService';
import BrandLogo from '../components/BrandLogo';
import { Shield, Sparkles, Lock, ArrowRight, CheckCircle2, User, Mail, Zap, Globe2, ShieldCheck, Key, Check, AlertCircle, Fingerprint, Eye, EyeOff, LogOut, Send, RefreshCw } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'signup' | 'otp'
  const [otpStep, setOtpStep] = useState('send'); // 'send' | 'verify'
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successNotice, setSuccessNotice] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  useEffect(() => {
    // Only check if user is logged in to show active session banner, do NOT force auto-redirect
    const u = getCurrentUser();
    setCurrentUser(u);
  }, []);

  // 1. Handle Password Sign In & Sign Up
  const handlePasswordAuth = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (authMode === 'signup' && !fullName.trim()) {
      setErrorMsg('Please enter your full name.');
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
      if (authMode === 'signin') {
        await signInWithSupabase(cleanEmail, password);
        navigate('/account');
      } else {
        await signUpWithSupabase(cleanEmail, password, fullName.trim());
        navigate('/account');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. Handle OTP Send
  const handleSendOTP = async (e) => {
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
      await sendEmailOTP(cleanEmail);
      setOtpStep('verify');
      setSuccessNotice(`Verification code sent to ${cleanEmail}. Please check your email inbox!`);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send OTP code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Handle OTP Verify
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = otpCode.trim();

    if (!cleanCode || cleanCode.length < 6) {
      setErrorMsg('Please enter the 6-digit verification code sent to your email.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      await verifyEmailOTP(cleanEmail, cleanCode, fullName);
      navigate('/account');
    } catch (err) {
      setErrorMsg(err.message || 'Invalid or expired code. Please check your email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Handle Google OAuth
  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await signInWithGoogleOAuth();
    } catch (err) {
      setErrorMsg(err.message || 'Google Sign-In failed.');
      setIsSubmitting(false);
    }
  };

  // 5. Handle Logout
  const handleSignOut = () => {
    logoutUser();
    setCurrentUser(null);
    setSuccessNotice('Signed out successfully.');
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-sky-lavender-mesh text-slate-900 flex items-center justify-center font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
        
        {/* Active Session Notice (If already logged in) */}
        {currentUser && (
          <div className="mb-6 p-4 rounded-2xl bg-white border border-sky-200 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
            <div className="flex items-center gap-3">
              <img 
                src={currentUser.picture} 
                alt={currentUser.name} 
                className="w-10 h-10 rounded-full border border-sky-300"
              />
              <div>
                <div className="text-xs text-slate-500 font-mono">Active Session Detected</div>
                <div className="text-sm font-bold text-slate-900">{currentUser.name} ({currentUser.email})</div>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => navigate('/account')}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-all cursor-pointer"
              >
                Go to Dashboard →
              </button>
              <button
                onClick={handleSignOut}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Main Card Container */}
        <div className="bg-white/95 border border-indigo-100 rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Column: Real Auth Form */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center text-left">
            
            {/* Header */}
            <div className="mb-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-[11px] font-mono uppercase tracking-wider mb-2.5">
                <Lock className="w-3.5 h-3.5 text-sky-600" />
                Production Auth Gateway
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
                {authMode === 'signin' && 'Sign In to Account'}
                {authMode === 'signup' && 'Create New Account'}
                {authMode === 'otp' && (otpStep === 'send' ? 'Passwordless Email Code' : 'Enter Email Verification Code')}
              </h2>
              
              <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">
                {authMode === 'signin' && 'Enter your verified email and password to log in.'}
                {authMode === 'signup' && 'Register your verified user account in the Supabase PostgreSQL database.'}
                {authMode === 'otp' && (otpStep === 'send' ? 'Receive a 6-digit security code directly in your inbox.' : `Enter the 6-digit code sent to ${email}:`)}
              </p>
            </div>

            {/* Auth Mode Tabs */}
            <div className="flex rounded-2xl bg-slate-100 p-1 mb-5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => { setAuthMode('signin'); setErrorMsg(''); setSuccessNotice(''); }}
                className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                  authMode === 'signin' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('signup'); setErrorMsg(''); setSuccessNotice(''); }}
                className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                  authMode === 'signup' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('otp'); setOtpStep('send'); setErrorMsg(''); setSuccessNotice(''); }}
                className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                  authMode === 'otp' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Email OTP
              </button>
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

            {/* FORM 1: Password Sign In & Sign Up */}
            {(authMode === 'signin' || authMode === 'signup') && (
              <form onSubmit={handlePasswordAuth} className="space-y-3.5">
                
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-[11px] font-mono text-slate-700 uppercase font-semibold mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-mono text-slate-700 uppercase font-semibold mb-1">
                    Email Address <span className="text-rose-500">*</span>
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
                  <label className="block text-[11px] font-mono text-slate-700 uppercase font-semibold mb-1">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password (min 6 characters)"
                      className="w-full pl-10 pr-11 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Terms agreement checkbox */}
                <div className="flex items-start gap-2 pt-1 text-[11px] text-slate-600 leading-snug">
                  <input
                    type="checkbox"
                    id="agreeTermsPw"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <label htmlFor="agreeTermsPw" className="cursor-pointer">
                    I agree to the{' '}
                    <Link to="/terms" target="_blank" className="text-sky-600 hover:underline font-semibold">Terms of Service</Link>{' '}
                    and{' '}
                    <Link to="/privacy" target="_blank" className="text-sky-600 hover:underline font-semibold">Privacy Policy</Link>.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-sky-600/20 active:scale-[0.99] disabled:opacity-50 mt-2 cursor-pointer"
                >
                  <Fingerprint className="w-4 h-4" />
                  <span>
                    {isSubmitting 
                      ? 'Authenticating with Supabase...' 
                      : (authMode === 'signin' ? 'Sign In to Account' : 'Create Supabase Account')}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* FORM 2: Real Supabase Email OTP */}
            {authMode === 'otp' && otpStep === 'send' && (
              <form onSubmit={handleSendOTP} className="space-y-3.5">
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
                      placeholder="Enter your email address"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-mono focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Terms agreement checkbox */}
                <div className="flex items-start gap-2 pt-1 text-[11px] text-slate-600 leading-snug">
                  <input
                    type="checkbox"
                    id="agreeTermsOtp"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <label htmlFor="agreeTermsOtp" className="cursor-pointer">
                    I agree to the{' '}
                    <Link to="/terms" target="_blank" className="text-sky-600 hover:underline font-semibold">Terms of Service</Link>{' '}
                    and{' '}
                    <Link to="/privacy" target="_blank" className="text-sky-600 hover:underline font-semibold">Privacy Policy</Link>.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-sky-600/20 active:scale-[0.99] disabled:opacity-50 mt-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending Code...' : 'Send 6-Digit Code to Email'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* FORM 3: Real Supabase Email OTP Verify */}
            {authMode === 'otp' && otpStep === 'verify' && (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono text-slate-700 uppercase font-semibold mb-2 text-center">
                    Enter 6-Digit Code from Your Email
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="123456"
                    className="w-full py-3.5 text-center text-2xl font-mono font-bold tracking-[8px] rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-sky-500 focus:bg-white focus:outline-none transition-all text-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || otpCode.length < 6}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{isSubmitting ? 'Verifying with Supabase...' : 'Verify Code & Log In'}</span>
                </button>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => { setOtpStep('send'); setOtpCode(''); setErrorMsg(''); }}
                    className="text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    ← Change Email
                  </button>
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={isSubmitting}
                    className="text-sky-600 hover:text-sky-800 font-semibold cursor-pointer"
                  >
                    Resend Code
                  </button>
                </div>
              </form>
            )}

            {/* Divider */}
            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
              <span className="relative px-3 bg-white text-[11px] font-mono text-slate-400 uppercase">Or Google Auth</span>
            </div>

            {/* Real Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-2xl bg-white border border-slate-300 hover:border-sky-500 hover:bg-slate-50 text-slate-800 font-semibold text-xs flex items-center justify-center gap-2.5 transition-all shadow-xs active:scale-[0.99] cursor-pointer"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Sign in with Google</span>
            </button>

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

              <h3 className="text-lg font-bold text-white mb-2">Verified Member Workspace</h3>
              <p className="text-slate-300 text-xs leading-relaxed mb-6">
                Your authenticated account connects directly to Supabase PostgreSQL database across all 8 specialized practices:
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
                    <strong className="text-white">Direct VIP WhatsApp Line:</strong> Priority routing to Vikas Mishra and lead engineering directors.
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
