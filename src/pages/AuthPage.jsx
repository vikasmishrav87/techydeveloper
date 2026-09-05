import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Lock, Mail, User, Key, Eye, EyeOff, ArrowRight, ShieldCheck, 
  CheckCircle2, AlertTriangle, UserPlus, LogIn, ShieldAlert, Check, Copy, Sparkles, Shield
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AuthPage({ initialMode = 'login' }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, login, register, verifyRecoveryKey, updatePasswordWithRecoveryKey, isAuthenticated } = useAuth();

  const modeParam = searchParams.get('mode');
  const redirectParam = searchParams.get('redirect') || '/';

  const [mode, setMode] = useState(modeParam || initialMode); // 'login', 'signup', 'reset'
  const [resetStep, setResetStep] = useState(1); // 1 = Enter Email & 12-digit Key, 2 = Set New Password
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
  const [secretRecoveryKey, setSecretRecoveryKey] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  // Registration Recovery Key Modal State
  const [registeredKey, setRegisteredKey] = useState('');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Auto-redirect if already logged in (and not currently viewing the newly registered key modal)
  useEffect(() => {
    if (isAuthenticated && !showKeyModal) {
      navigate(redirectParam, { replace: true });
    }
  }, [isAuthenticated, showKeyModal, navigate, redirectParam]);

  // Sync mode if query param changes
  useEffect(() => {
    if (modeParam && ['login', 'signup', 'reset'].includes(modeParam)) {
      setMode(modeParam);
    }
  }, [modeParam]);

  // Copy Key Helper
  const handleCopyKey = () => {
    if (registeredKey) {
      navigator.clipboard.writeText(registeredKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

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
      // 2. SIGN UP: creates account & displays 12-digit secret recovery key
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
          throw new Error('A valid email address is required for client authentication.');
        }

        const res = await register({
          userId: userId.trim(),
          email: email.trim(),
          name: fullName.trim(),
          password: password.trim()
        });

        const key = res.recoveryKey;
        setRegisteredKey(key);
        setShowKeyModal(true);

        try {
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
        } catch {}
      } 
      // 3. RESET - STEP 1: Verify 12-Digit Secret Recovery Key
      else if (mode === 'reset' && resetStep === 1) {
        if (!userId.trim()) {
          throw new Error('Please enter your registered User ID or Email.');
        }
        if (!secretRecoveryKey.trim()) {
          throw new Error('Please enter your 12-digit Secret Recovery Key.');
        }

        const res = await verifyRecoveryKey(userId.trim(), secretRecoveryKey.trim());
        setSuccessMsg(res.message || 'Secret Recovery Key verified! You may now set your new password.');
        setResetStep(2);
      }
      // 4. RESET - STEP 2: Update Password With Verified Key
      else if (mode === 'reset' && resetStep === 2) {
        if (!newPassword.trim() || newPassword.length < 6) {
          throw new Error('New password must be at least 6 characters long.');
        }
        if (newPassword !== confirmPassword) {
          throw new Error('Passwords do not match. Please re-enter.');
        }

        await updatePasswordWithRecoveryKey(userId.trim(), secretRecoveryKey.trim(), newPassword.trim());
        
        try {
          confetti({ particleCount: 110, spread: 70, origin: { y: 0.6 } });
        } catch {}

        setSuccessMsg('Verification confirmed! Your password has been successfully updated. You can now log in.');
        setMode('login');
        setResetStep(1);
        setPassword(newPassword);
        setSecretRecoveryKey('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-24 bg-[#FAF7EE] text-[#141414] font-sans flex items-center justify-center px-4">
      
      {/* ============================================================ */}
      {/* 12-DIGIT SECRET RECOVERY KEY MANDATORY MODAL (AFTER SIGN UP) */}
      {/* ============================================================ */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-[#141414]/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="max-w-lg w-full bg-[#FAF7EE] border-4 border-[#141414] rounded-3xl p-6 sm:p-8 shadow-[12px_12px_0_0_#FF4D00] text-left space-y-5 animate-scaleUp">
            
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-2xl bg-[#FF4D00] border-2 border-[#141414] shadow-[3px_3px_0_0_#141414] flex items-center justify-center text-white flex-shrink-0">
                <ShieldAlert className="size-6 text-[#FAF7EE]" />
              </div>
              <div>
                <span className="text-[10px] font-display font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FFC72E] border border-[#141414] text-[#141414]">
                  CRITICAL SECURITY CREDENTIAL
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-black uppercase text-[#141414] leading-tight mt-0.5">
                  YOUR SECRET RECOVERY KEY
                </h2>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#141414] text-[#FAF7EE] border-2 border-[#141414] text-center space-y-2 shadow-[4px_4px_0_0_#FFC72E]">
              <div className="text-[11px] font-mono uppercase tracking-widest text-[#FAF7EE]/70 font-bold">
                12-Digit Master Identity Key
              </div>
              <div className="font-mono text-2xl sm:text-3xl font-black tracking-[0.2em] text-[#FFC72E] select-all py-1">
                {registeredKey || 'GENERATING...'}
              </div>
              <button
                type="button"
                onClick={handleCopyKey}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FF4D00] hover:bg-[#ff6524] text-[#FAF7EE] text-xs font-display font-black uppercase transition-all shadow-[2px_2px_0_0_#FAF7EE] cursor-pointer"
              >
                {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                <span>{copied ? 'COPIED TO CLIPBOARD!' : 'COPY SECRET KEY'}</span>
              </button>
            </div>

            <div className="space-y-2 text-xs font-medium text-[#141414]/85 leading-relaxed bg-[#FAF7EE] border-2 border-[#141414] p-3.5 rounded-2xl">
              <p className="font-bold text-[#FF4D00] flex items-center gap-1.5">
                <AlertTriangle className="size-4 flex-shrink-0" />
                <span>MANDATORY STORAGE REQUIREMENT:</span>
              </p>
              <p>
                This 12-digit secret recovery key is unique to your registered email (<strong>{email}</strong>) and is permanently saved in our backend database.
              </p>
              <p>
                If you ever forget your password, <strong>this secret key is the ONLY way to verify your identity</strong> and unlock password reset. We do not use email links; you must provide this key.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowKeyModal(false);
                navigate(redirectParam, { replace: true });
              }}
              className="brutal-btn w-full py-3.5 px-6 rounded-2xl bg-[#141414] hover:bg-[#FF4D00] text-[#FAF7EE] font-display text-sm font-black uppercase tracking-wide flex items-center justify-center gap-2 shadow-[4px_4px_0_0_#141414] cursor-pointer"
            >
              <span>I HAVE STORED MY KEY — CONTINUE TO DASHBOARD</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Authentication Container */}
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
            {mode === 'reset' && (resetStep === 1 ? 'RECOVER PASSWORD' : 'SET NEW PASSWORD')}
          </h1>
          
          <p className="text-xs sm:text-sm font-medium text-[#141414]/75 mt-1">
            {mode === 'login' && 'Access your client dashboard, technical audits & diagnostic telemetry.'}
            {mode === 'signup' && 'Register your client account. You will receive a 12-digit secret recovery key.'}
            {mode === 'reset' && resetStep === 1 && 'Enter your registered User ID / Email and your 12-digit secret recovery key.'}
            {mode === 'reset' && resetStep === 2 && 'Identity verified with your secret key! Set your new password below.'}
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

        {/* Feedback Alerts */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-red-100 border-2 border-red-600 text-red-900 text-xs font-mono font-bold flex items-start gap-2 text-left animate-shake">
            <AlertTriangle className="size-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">{error}</div>
          </div>
        )}

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

          {/* RESET PASSWORD - STEP 1: 12-Digit Secret Recovery Key Field */}
          {mode === 'reset' && resetStep === 1 && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-display font-black uppercase text-[#141414]">
                  12-DIGIT SECRET RECOVERY KEY <span className="text-[#FF4D00]">*</span>
                </label>
              </div>
              <div className="relative">
                <Shield className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#141414]/50" />
                <input
                  type="text"
                  required
                  value={secretRecoveryKey}
                  onChange={(e) => setSecretRecoveryKey(e.target.value.toUpperCase())}
                  placeholder="e.g. K97P-4W2N-8B5X"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-[#141414] bg-[#FAF7EE] text-[#141414] text-xs sm:text-sm font-mono font-black tracking-wider uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF4D00]"
                />
              </div>
              <p className="text-[11px] font-bold text-[#141414]/70 pt-1">
                Enter the 12-digit key generated when you created your account.
              </p>
            </div>
          )}

          {/* RESET PASSWORD - STEP 2: Enter New Password */}
          {mode === 'reset' && resetStep === 2 && (
            <>
              {/* Verified account badge */}
              <div className="flex items-center justify-between bg-emerald-50 border-2 border-emerald-600 px-3.5 py-2.5 rounded-2xl text-xs font-mono font-bold text-emerald-950">
                <div className="flex items-center gap-1.5 truncate">
                  <CheckCircle2 className="size-4 text-emerald-600 flex-shrink-0" />
                  <span>Verified Account: <strong className="text-[#141414]">{userId}</strong></span>
                </div>
                <button
                  type="button"
                  onClick={() => { setResetStep(1); setError(''); setSuccessMsg(''); }}
                  className="text-[10px] text-[#141414]/70 hover:text-[#FF4D00] underline font-sans font-bold cursor-pointer flex-shrink-0 ml-2"
                >
                  Change
                </button>
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
                    placeholder="Enter your new password..."
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
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-[#141414] bg-[#FAF7EE] text-[#141414] text-xs sm:text-sm font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF4D00]"
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
                  EMAIL ADDRESS <span className="text-[#FF4D00]">*</span>
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
                  placeholder="Re-enter your password to verify..."
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-[#141414] bg-[#FAF7EE] text-[#141414] text-xs sm:text-sm font-mono font-bold focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="brutal-btn w-full py-3.5 px-6 rounded-2xl bg-[#141414] hover:bg-[#FF4D00] text-[#FAF7EE] font-display text-sm font-black uppercase tracking-wide flex items-center justify-center gap-2 shadow-[4px_4px_0_0_#FF4D00] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
          >
            {loading ? (
              <span>PROCESSING...</span>
            ) : mode === 'login' ? (
              <>
                <LogIn className="size-4" />
                <span>AUTHENTICATE &amp; ACCESS</span>
              </>
            ) : mode === 'signup' ? (
              <>
                <UserPlus className="size-4" />
                <span>CREATE ACCOUNT &amp; GET KEY</span>
              </>
            ) : resetStep === 1 ? (
              <>
                <ShieldCheck className="size-4 text-[#FFC72E]" />
                <span>VERIFY SECRET RECOVERY KEY</span>
              </>
            ) : (
              <>
                <Key className="size-4 text-[#FFC72E]" />
                <span>UPDATE &amp; SAVE NEW PASSWORD</span>
              </>
            )}
          </button>

        </form>

        {/* Back button when in Reset Password Mode */}
        {mode === 'reset' && (
          <div className="pt-2 border-t-2 border-[#141414]/15">
            <button
              type="button"
              onClick={() => { setMode('login'); setResetStep(1); setError(''); setSuccessMsg(''); }}
              className="text-xs font-mono font-bold text-[#141414]/80 hover:text-[#FF4D00] inline-flex items-center gap-1 cursor-pointer"
            >
              ← Back to Client Log In
            </button>
          </div>
        )}

        {/* Emergency WhatsApp Help */}
        {mode === 'reset' && (
          <div className="p-3 rounded-2xl bg-[#FAF7EE] border-2 border-[#141414] text-center text-xs font-mono">
            <span className="text-[#141414]/70">Lost your 12-digit secret recovery key?</span>{' '}
            <a
              href={`https://wa.me/918369804739?text=Hello%2C%20I%20need%20executive%20assistance%20recovering%20my%20account%20on%20The%20Unfiltered%20Engineer%3A%20${encodeURIComponent(userId)}`}
              target="_blank"
              rel="noreferrer"
              className="text-[#25D366] font-black underline hover:text-[#128C7E] inline-flex items-center gap-1"
            >
              WhatsApp Direct Support (+91 8369804739)
            </a>
          </div>
        )}

        {/* Security Assurance Badge */}
        <div className="pt-4 border-t-2 border-[#141414]/15 flex items-center justify-center gap-2 text-[11px] font-mono text-[#141414]/70">
          <Lock className="size-3 text-[#FF4D00]" />
          <span>PERMANENT VAULT ENCRYPTION • ZERO-DATA-LOSS SLA</span>
        </div>

      </div>
    </div>
  );
}
