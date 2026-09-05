import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Lock, Mail, User, Key, Eye, EyeOff, ArrowRight, ShieldCheck, 
  CheckCircle2, AlertTriangle, UserPlus, LogIn, RefreshCw, Send, ShieldAlert, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AuthPage({ initialMode = 'login' }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, login, register, requestResetCode, resetPasswordWithCode, isAuthenticated } = useAuth();

  const modeParam = searchParams.get('mode');
  const redirectParam = searchParams.get('redirect') || '/';

  const [mode, setMode] = useState(modeParam || initialMode); // 'login', 'signup', 'reset'
  const [resetStep, setResetStep] = useState(1); // 1 = Request code, 2 = Enter code & new password
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form Fields
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [targetEmailMasked, setTargetEmailMasked] = useState('');

  // Auto-redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectParam, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectParam]);

  // Sync mode if query param changes
  useEffect(() => {
    if (modeParam && ['login', 'signup', 'reset'].includes(modeParam)) {
      setMode(modeParam);
    }
  }, [modeParam]);

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      // 1. LOGIN
      if (mode === 'login') {
        if (!userId.trim() || !password.trim()) {
          throw new Error('Please enter both your User ID / Email and Password.');
        }
        await login(userId, password);
        try {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        } catch {}
        navigate(redirectParam, { replace: true });
      } 
      // 2. SIGN UP
      else if (mode === 'signup') {
        if (!userId.trim() || !password.trim()) {
          throw new Error('User ID / Email and Password are required.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long.');
        }
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match. Please re-enter.');
        }

        if (!email.trim() || !email.includes('@')) {
          throw new Error('A valid email address is required to register so you can receive verification codes.');
        }

        await register({
          userId: userId.trim(),
          email: email.trim(),
          name: fullName.trim(),
          password: password.trim()
        });

        try {
          confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
        } catch {}

        navigate(redirectParam, { replace: true });
      } 
      // 3. RESET - STEP 1: Send OTP Verification Code
      else if (mode === 'reset' && resetStep === 1) {
        if (!userId.trim()) {
          throw new Error('Please enter your registered User ID or Email to receive a verification code.');
        }

        const res = await requestResetCode(userId.trim());
        setTargetEmailMasked(res.targetEmail || userId.trim());
        setSuccessMsg(res.message || '6-digit verification code has been dispatched to your email.');
        setResetStep(2);
      }
      // 4. RESET - STEP 2: Verify Code & Update Password
      else if (mode === 'reset' && resetStep === 2) {
        if (!verificationCode.trim() || verificationCode.trim().length !== 6) {
          throw new Error('Please enter the 6-digit verification code sent to your email.');
        }
        if (!newPassword.trim() || newPassword.length < 6) {
          throw new Error('New password must be at least 6 characters long.');
        }
        if (newPassword !== confirmPassword) {
          throw new Error('Passwords do not match. Please re-enter.');
        }

        await resetPasswordWithCode(userId.trim(), verificationCode.trim(), newPassword.trim());
        
        try {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        } catch {}

        setSuccessMsg('Verification confirmed! Your password has been updated. You can now log in.');
        setMode('login');
        setResetStep(1);
        setPassword(newPassword);
        setVerificationCode('');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-24 bg-[#FAF7EE] text-[#141414] font-sans flex items-center justify-center px-4">
      <div className="max-w-md w-full p-8 sm:p-10 rounded-3xl bg-[#F4EFE6] border-2 border-[#141414] shadow-[8px_8px_0_0_#141414] text-center space-y-6 relative overflow-hidden animate-fadeIn">
        
        {/* Brand Logo Emblem */}
        <div className="size-16 sm:size-20 rounded-2xl bg-[#141414] overflow-hidden border-2 border-[#141414] shadow-[4px_4px_0_0_#FF4D00] p-1.5 mx-auto hover:scale-105 transition-transform">
          <img 
            src="/assets/brand-logo.png" 
            alt="The Unfiltered Engineer Official Brand Logo" 
            className="w-full h-full object-contain rounded-xl"
          />
        </div>

        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFC72E] border-2 border-[#141414] text-[#141414] text-xs font-display font-black uppercase mb-2 shadow-[2px_2px_0_0_#141414]">
            <ShieldCheck className="size-3.5" />
            <span>CLIENT ACCESS & IDENTITY GATEWAY</span>
          </div>
          
          <h1 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#141414]">
            {mode === 'login' && 'CLIENT LOGIN'}
            {mode === 'signup' && 'CREATE ACCOUNT'}
            {mode === 'reset' && (resetStep === 1 ? 'RESET PASSWORD' : 'ENTER VERIFICATION CODE')}
          </h1>
          
          <p className="text-xs sm:text-sm font-medium text-[#141414]/75 mt-1">
            {mode === 'login' && 'Access your client dashboard, technical audits & diagnostic telemetry.'}
            {mode === 'signup' && 'Set up your client credentials to unlock full platform access.'}
            {mode === 'reset' && resetStep === 1 && 'Enter your registered User ID or Email to receive a 6-digit security code.'}
            {mode === 'reset' && resetStep === 2 && `Enter the 6-digit code sent to ${targetEmailMasked || 'your email'} to authorize your password change.`}
          </p>
        </div>

        {/* Tab Switcher (Visible in Login / Signup mode) */}
        {mode !== 'reset' && (
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-[#FAF7EE] border-2 border-[#141414]">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
              className={`py-2.5 rounded-xl font-display text-xs font-black uppercase transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-[#141414] text-[#FAF7EE] shadow-[2px_2px_0_0_#FF4D00]'
                  : 'text-[#141414] hover:bg-[#FFC72E]'
              }`}
            >
              LOG IN
            </button>
            
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(''); setSuccessMsg(''); }}
              className={`py-2.5 rounded-xl font-display text-xs font-black uppercase transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-[#FF4D00] text-[#FAF7EE] shadow-[2px_2px_0_0_#141414]'
                  : 'text-[#141414] hover:bg-[#FFC72E]'
              }`}
            >
              CREATE ACCOUNT
            </button>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-red-100 border-2 border-red-600 text-red-900 text-xs font-mono font-bold flex items-start gap-2 text-left animate-fadeIn">
            <AlertTriangle className="size-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">{error}</div>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-100 border-2 border-emerald-600 text-emerald-900 text-xs font-mono font-bold flex items-start gap-2 text-left animate-fadeIn">
            <CheckCircle2 className="size-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">{successMsg}</div>
          </div>
        )}

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          
          {/* User ID / Email Input */}
          {(mode !== 'reset' || resetStep === 1) && (
            <div>
              <label className="block text-xs font-display font-black uppercase text-[#141414] mb-1.5">
                USER ID OR REGISTERED EMAIL <span className="text-[#FF4D00]">*</span>
              </label>
              <div className="relative">
                <User className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#141414]/50" />
                <input
                  type="text"
                  required
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter your User ID or Email address..."
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-[#141414] bg-[#FAF7EE] text-[#141414] text-xs sm:text-sm font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF4D00]"
                />
              </div>
            </div>
          )}

          {/* RESET PASSWORD - STEP 2: 6-Digit OTP Field */}
          {mode === 'reset' && resetStep === 2 && (
            <>
              {/* Account identifier badge */}
              <div className="flex items-center justify-between bg-[#FAF7EE] border-2 border-[#141414] px-3.5 py-2 rounded-2xl text-xs font-mono font-bold text-[#141414]">
                <div className="truncate">
                  Target: <span className="text-[#FF4D00] font-black">{userId}</span>
                </div>
                <button
                  type="button"
                  onClick={() => { setResetStep(1); setError(''); setSuccessMsg(''); }}
                  className="text-[10px] text-[#141414]/70 hover:text-[#FF4D00] underline font-sans font-bold cursor-pointer"
                >
                  Change
                </button>
              </div>

              <div>
                <label className="block text-xs font-display font-black uppercase text-[#141414] mb-1.5">
                  6-DIGIT VERIFICATION CODE <span className="text-[#FF4D00]">*</span>
                </label>
                <div className="relative">
                  <Key className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#141414]/50" />
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit code..."
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-[#141414] bg-[#FAF7EE] text-[#141414] text-base font-mono font-black tracking-[0.25em] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF4D00]"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-bold text-[#141414]/70 pt-1">
                  <span>Check Inbox &amp; Spam / Junk folder</span>
                  <button
                    type="button"
                    onClick={async () => {
                      setError('');
                      setSuccessMsg('Requesting fresh verification code...');
                      try {
                        const res = await requestResetCode(userId.trim());
                        setSuccessMsg(res.message || 'Fresh verification code dispatched to your email.');
                      } catch (e) {
                        setError(e.message);
                      }
                    }}
                    className="text-[#FF4D00] hover:underline cursor-pointer font-black uppercase"
                  >
                    Resend Code ↻
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-display font-black uppercase text-[#141414] mb-1.5">
                  NEW PASSWORD (MIN. 6 CHARS) <span className="text-[#FF4D00]">*</span>
                </label>
                <div className="relative">
                  <Key className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#141414]/50" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Set your new password..."
                    className="w-full pl-10 pr-10 py-3 rounded-2xl border-2 border-[#141414] bg-[#FAF7EE] text-[#141414] text-xs sm:text-sm font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF4D00]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#141414]/50 hover:text-[#141414] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-display font-black uppercase text-[#141414] mb-1.5">
                  CONFIRM NEW PASSWORD <span className="text-[#FF4D00]">*</span>
                </label>
                <div className="relative">
                  <Key className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#141414]/50" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password..."
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-[#141414] bg-[#FAF7EE] text-[#141414] text-xs sm:text-sm font-mono font-bold focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          {/* Additional fields for Sign Up */}
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-display font-black uppercase text-[#141414] mb-1.5">
                  FULL NAME OR COMPANY
                </label>
                <div className="relative">
                  <User className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#141414]/50" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name or company name..."
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-[#141414] bg-[#FAF7EE] text-[#141414] text-xs sm:text-sm font-mono font-bold focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-display font-black uppercase text-[#141414] mb-1.5">
                  EMAIL ADDRESS (FOR SECURITY &amp; OTP CODES) <span className="text-[#FF4D00]">*</span>
                </label>
                <div className="relative">
                  <Mail className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#141414]/50" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your valid email address..."
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-[#141414] bg-[#FAF7EE] text-[#141414] text-xs sm:text-sm font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF4D00]"
                  />
                </div>
              </div>
            </>
          )}

          {/* Password field for Login or Signup */}
          {mode !== 'reset' && (
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-display font-black uppercase text-[#141414]">
                  PASSWORD <span className="text-[#FF4D00]">*</span>
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => { setMode('reset'); setResetStep(1); setError(''); setSuccessMsg(''); }}
                    className="text-[11px] font-bold text-[#FF4D00] hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Key className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#141414]/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password (min. 6 chars)..."
                  className="w-full pl-10 pr-10 py-3 rounded-2xl border-2 border-[#141414] bg-[#FAF7EE] text-[#141414] text-xs sm:text-sm font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF4D00]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#141414]/50 hover:text-[#141414] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Password Confirmation for Signup */}
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-display font-black uppercase text-[#141414] mb-1.5">
                CONFIRM PASSWORD <span className="text-[#FF4D00]">*</span>
              </label>
              <div className="relative">
                <Key className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#141414]/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password..."
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-[#141414] bg-[#FAF7EE] text-[#141414] text-xs sm:text-sm font-mono font-bold focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="sticker-pill w-full py-4 bg-[#141414] hover:bg-[#FF4D00] text-[#FAF7EE] shadow-[4px_4px_0_0_#FF4D00] hover:shadow-[6px_6px_0_0_#141414] flex items-center justify-center gap-2 font-black text-xs sm:text-sm uppercase cursor-pointer active:scale-98 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="size-4 animate-spin" />
                <span>PROCESSING SECURITY CHECK...</span>
              </>
            ) : mode === 'login' ? (
              <>
                <LogIn className="size-4 text-[#FFC72E]" />
                <span>SIGN IN TO CLIENT ACCOUNT</span>
                <ArrowRight className="size-4" />
              </>
            ) : mode === 'signup' ? (
              <>
                <UserPlus className="size-4 text-[#FFC72E]" />
                <span>CREATE & ACTIVATE ACCOUNT</span>
                <ArrowRight className="size-4" />
              </>
            ) : resetStep === 1 ? (
              <>
                <Send className="size-4 text-[#FFC72E]" />
                <span>SEND 6-DIGIT VERIFICATION CODE</span>
                <ArrowRight className="size-4" />
              </>
            ) : (
              <>
                <Check className="size-4 text-[#25D366]" />
                <span>VERIFY CODE & SAVE NEW PASSWORD</span>
                <ArrowRight className="size-4" />
              </>
            )}
          </button>

          {mode === 'reset' && resetStep === 2 && (
            <div className="p-3 rounded-2xl bg-[#FAF7EE] border-2 border-[#141414] text-center text-xs font-mono">
              <span className="text-[#141414]/70">Mail delay or need urgent recovery?</span>{' '}
              <a
                href={`https://wa.me/918369804739?text=Hello%2C%20I%20need%20assistance%20verifying%20my%20account%20on%20The%20Unfiltered%20Engineer%3A%20${encodeURIComponent(userId)}`}
                target="_blank"
                rel="noreferrer"
                className="text-[#25D366] font-black underline hover:text-[#128C7E] inline-flex items-center gap-1"
              >
                WhatsApp Direct Support (+91 8369804739)
              </a>
            </div>
          )}

        </form>

        {/* Mode switcher link footer */}
        <div className="pt-2 border-t-2 border-[#141414]/15 text-center text-xs font-bold text-[#141414]/70">
          {mode === 'reset' ? (
            <button
              type="button"
              onClick={() => { setMode('login'); setResetStep(1); setError(''); setSuccessMsg(''); }}
              className="text-[#FF4D00] hover:underline cursor-pointer font-black"
            >
              ← Back to Login Screen
            </button>
          ) : mode === 'login' ? (
            <p>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(''); setSuccessMsg(''); }}
                className="text-[#FF4D00] hover:underline cursor-pointer font-black"
              >
                Create Account Here
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
                className="text-[#FF4D00] hover:underline cursor-pointer font-black"
              >
                Log In to Your Account
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
