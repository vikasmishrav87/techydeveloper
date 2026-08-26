import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  getCurrentUser, 
  loginWithEmail, 
  loginWithGoogleOAuthProfile 
} from '../services/authService';
import BrandLogo from '../components/BrandLogo';
import GoogleOAuthModal from '../components/GoogleOAuthModal';
import { Shield, Sparkles, Lock, ArrowRight, CheckCircle2, User, Mail, Zap, Globe2, ShieldCheck, Key, Check, AlertCircle, Eye, EyeOff, UserPlus, LogIn } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
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

    if (isRegisterMode && !name.trim()) {
      setErrorMsg('Please enter your full name to register.');
      return;
    }

    if (!agreeTerms) {
      setErrorMsg('You must agree to the Terms of Service and Privacy Policy to continue.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      await loginWithEmail(cleanEmail, name.trim(), password);
      navigate('/account');
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = (user) => {
    navigate('/account');
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-sky-lavender-mesh text-slate-900 flex items-center justify-center font-sans">
      
      {/* Real Google OAuth Verification & Consent Modal */}
      <GoogleOAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSuccess={handleGoogleSuccess}
        initialEmail={email}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
        
        {/* Main Card */}
        <div className="bg-white/95 border border-indigo-100 rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
            
            <div className="mb-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-[11px] font-mono uppercase tracking-wider mb-3">
                <Lock className="w-3.5 h-3.5 text-sky-600" />
                Zero-Trust Secure Member Gateway
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
                {isRegisterMode ? 'Create Member Account' : 'Sign In to Portal'}
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-1.5 leading-relaxed">
                {isRegisterMode
                  ? 'Register your technical profile to unlock military-grade security dossiers and VIP engineering access.'
                  : 'Enter your credentials to access your saved audit reports, project scopes, and engineering membership.'}
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs mb-5 text-left flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Google Fast Connect Button */}
            <button
              type="button"
              onClick={() => setIsGoogleModalOpen(true)}
              className="w-full py-3.5 px-4 rounded-2xl bg-white border border-slate-300 hover:border-sky-500 hover:bg-slate-50 text-slate-800 font-semibold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all shadow-xs active:scale-[0.99] cursor-pointer mb-5"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google Identity</span>
            </button>

            {/* Divider */}
            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
              <span className="relative px-3 bg-white text-[11px] font-mono text-slate-400 uppercase">Or Work Email</span>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex rounded-2xl bg-slate-100 p-1 mb-5">
              <button
                type="button"
                onClick={() => { setIsRegisterMode(false); setErrorMsg(''); }}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                  !isRegisterMode
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LogIn className="w-3.5 h-3.5 text-sky-600" />
                <span>Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => { setIsRegisterMode(true); setErrorMsg(''); }}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                  isRegisterMode
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5 text-indigo-600" />
                <span>Register Account</span>
              </button>
            </div>

            {/* Authentication Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
              
              {/* Name Field (for registration) */}
              {isRegisterMode && (
                <div>
                  <label className="block text-[11px] font-mono text-slate-700 uppercase font-semibold mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required={isRegisterMode}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              )}

              {/* Email Field */}
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-sky-500 focus:bg-white transition-all font-mono"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-[11px] font-mono text-slate-700 uppercase font-semibold mb-1">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-sky-500 focus:bg-white transition-all font-mono"
                  />
                  <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Legal Terms Agreement Checkbox */}
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
                  <Link to="/privacy" target="_blank" className="text-sky-600 hover:underline font-semibold">Privacy Policy</Link>, including unilateral admin modification clauses and cookie consent.
                </label>
              </div>

              {/* Submit Primary Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-sky-600/20 active:scale-[0.99] disabled:opacity-50 mt-2 cursor-pointer"
              >
                <span>
                  {isSubmitting 
                    ? 'Authenticating...' 
                    : isRegisterMode 
                    ? 'Create Account & Join Platform' 
                    : 'Sign In to Account'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <button
                type="button"
                onClick={() => { setIsRegisterMode(!isRegisterMode); setErrorMsg(''); }}
                className="text-sky-600 hover:text-sky-800 font-semibold transition-colors"
              >
                {isRegisterMode ? 'Already have an account? Sign In' : "Don't have an account? Register"}
              </button>

              <Link to="/" className="hover:text-slate-800 transition-colors">Back to Home</Link>
            </div>
          </div>

          {/* Right Column: Benefits Showcase */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-[#0B1120] to-indigo-950 text-white p-6 sm:p-8 flex flex-col justify-between text-left">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>

              <h3 className="text-lg font-bold text-white mb-2">Member Privileges & Live Telemetry</h3>
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
