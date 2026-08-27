import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  getCurrentUser, 
  signInWithSupabase, 
  signUpWithSupabase, 
  signInWithGoogleOAuth 
} from '../services/authService';
import BrandLogo from '../components/BrandLogo';
import { Shield, Sparkles, Lock, ArrowRight, CheckCircle2, User, Mail, Zap, Globe2, ShieldCheck, Key, Check, AlertCircle, Fingerprint, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successNotice, setSuccessNotice] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      navigate('/account');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
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
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await signInWithGoogleOAuth();
    } catch (err) {
      setErrorMsg(err.message || 'Google OAuth failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-sky-lavender-mesh text-slate-900 flex items-center justify-center font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
        
        {/* Main Card Container */}
        <div className="bg-white/95 border border-indigo-100 rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Column: Real Auth Form */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center text-left">
            
            {/* Header */}
            <div className="mb-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-[11px] font-mono uppercase tracking-wider mb-2.5">
                <Lock className="w-3.5 h-3.5 text-sky-600" />
                Real Supabase Auth Gateway
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
                {authMode === 'signin' ? 'Sign In to Your Account' : 'Create Your Account'}
              </h2>
              
              <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">
                {authMode === 'signin'
                  ? 'Enter your credentials to access your security audits, saved estimators, and VIP client dashboard.'
                  : 'Register a verified member account backed by our enterprise zero-trust infrastructure.'}
              </p>
            </div>

            {/* Auth Mode Toggle Tabs */}
            <div className="flex rounded-2xl bg-slate-100 p-1 mb-5">
              <button
                type="button"
                onClick={() => { setAuthMode('signin'); setErrorMsg(''); }}
                className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  authMode === 'signin'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('signup'); setErrorMsg(''); }}
                className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  authMode === 'signup'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Create Account
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

            {/* Real Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* Full Name field (Only in Sign Up mode) */}
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

              {/* Email field */}
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

              {/* Password field */}
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
                  id="agreeTermsReal"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <label htmlFor="agreeTermsReal" className="cursor-pointer">
                  I agree to the{' '}
                  <Link to="/terms" target="_blank" className="text-sky-600 hover:underline font-semibold">Terms of Service</Link>{' '}
                  and{' '}
                  <Link to="/privacy" target="_blank" className="text-sky-600 hover:underline font-semibold">Privacy Policy</Link>.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-sky-600/20 active:scale-[0.99] disabled:opacity-50 mt-2 cursor-pointer"
              >
                <Fingerprint className="w-4 h-4" />
                <span>
                  {isSubmitting 
                    ? (authMode === 'signin' ? 'Authenticating...' : 'Creating Account...') 
                    : (authMode === 'signin' ? 'Sign In to Account' : 'Register Account')}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Divider */}
              <div className="relative my-3 text-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
                <span className="relative px-3 bg-white text-[11px] font-mono text-slate-400 uppercase">Or Google OAuth</span>
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
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <Link to="/" className="hover:text-slate-800 transition-colors">← Back to Home</Link>
              <Link to="/contact" className="hover:text-sky-600 transition-colors">Need Assistance?</Link>
            </div>
          </div>

          {/* Right Column: Benefits Showcase */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-[#0B1120] to-indigo-950 text-white p-6 sm:p-8 flex flex-col justify-between text-left">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>

              <h3 className="text-lg font-bold text-white mb-2">Enterprise Workspace Access</h3>
              <p className="text-slate-300 text-xs leading-relaxed mb-6">
                Your account is backed by Supabase PostgreSQL and cryptographically verified session security across all 8 practices:
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
