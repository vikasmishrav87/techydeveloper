import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, Key, Eye, EyeOff, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle, UserPlus, LogIn, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AuthPage({ initialMode = 'login' }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, login, register, resetPassword, isAuthenticated } = useAuth();

  const modeParam = searchParams.get('mode');
  const redirectParam = searchParams.get('redirect') || '/';

  const [mode, setMode] = useState(modeParam || initialMode); // 'login', 'signup', 'reset'
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
  const [newPassword, setNewPassword] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
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

        await register({
          userId: userId.trim(),
          email: email.trim() || userId.trim(),
          name: fullName.trim(),
          password: password.trim()
        });

        try {
          confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
        } catch {}

        navigate(redirectParam, { replace: true });
      } 
      else if (mode === 'reset') {
        if (!userId.trim() || !newPassword.trim()) {
          throw new Error('Please enter your User ID / Email and new Password.');
        }
        if (newPassword.length < 6) {
          throw new Error('New password must be at least 6 characters long.');
        }
        if (newPassword !== confirmPassword) {
          throw new Error('Passwords do not match. Please re-enter.');
        }

        await resetPassword(userId, newPassword);
        setSuccessMsg('Password updated successfully! You can now log in.');
        setMode('login');
        setPassword(newPassword);
      }
    } catch (err) {
      setError(err.message || 'Authentication error. Please try again.');
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
            {mode === 'reset' && 'RESET PASSWORD'}
          </h1>
          
          <p className="text-xs sm:text-sm font-medium text-[#141414]/75 mt-1">
            {mode === 'login' && 'Access your client dashboard, technical audits & diagnostic telemetry.'}
            {mode === 'signup' && 'Set up your client credentials to unlock full platform access.'}
            {mode === 'reset' && 'Forgot your password? Enter your User ID / Email to set a new password.'}
          </p>
        </div>

        {/* Tab Switcher */}
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

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-red-100 border-2 border-red-600 text-red-900 text-xs font-mono font-bold flex items-start gap-2 text-left">
            <AlertTriangle className="size-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">{error}</div>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-100 border-2 border-emerald-600 text-emerald-900 text-xs font-mono font-bold flex items-start gap-2 text-left">
            <CheckCircle2 className="size-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">{successMsg}</div>
          </div>
        )}

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          
          {/* User ID / Email */}
          <div>
            <label className="block text-xs font-display font-black uppercase text-[#141414] mb-1.5">
              USER ID OR EMAIL <span className="text-[#FF4D00]">*</span>
            </label>
            <div className="relative">
              <User className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#141414]/50" />
              <input
                type="text"
                required
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="e.g. yourname or company@domain.com"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-[#141414] bg-[#FAF7EE] text-[#141414] text-xs sm:text-sm font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF4D00]"
              />
            </div>
          </div>

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
                    placeholder="e.g. Alexander Vance"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-[#141414] bg-[#FAF7EE] text-[#141414] text-xs sm:text-sm font-mono font-bold focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-display font-black uppercase text-[#141414] mb-1.5">
                  OFFICIAL WORK EMAIL (OPTIONAL)
                </label>
                <div className="relative">
                  <Mail className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#141414]/50" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-[#141414] bg-[#FAF7EE] text-[#141414] text-xs sm:text-sm font-mono font-bold focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          {/* Password field (for Login or Signup) */}
          {mode !== 'reset' && (
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-display font-black uppercase text-[#141414]">
                  PASSWORD <span className="text-[#FF4D00]">*</span>
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => { setMode('reset'); setError(''); setSuccessMsg(''); }}
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

          {/* New Password field (for Reset mode) */}
          {mode === 'reset' && (
            <div>
              <label className="block text-xs font-display font-black uppercase text-[#141414] mb-1.5">
                NEW PASSWORD (MIN. 6 CHARACTERS) <span className="text-[#FF4D00]">*</span>
              </label>
              <div className="relative">
                <Key className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#141414]/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password..."
                  className="w-full pl-10 pr-10 py-3 rounded-2xl border-2 border-[#141414] bg-[#FAF7EE] text-[#141414] text-xs sm:text-sm font-mono font-bold focus:bg-white focus:outline-none"
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

          {/* Password Confirmation (for Signup or Reset) */}
          {(mode === 'signup' || mode === 'reset') && (
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
                <span>AUTHENTICATING...</span>
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
            ) : (
              <>
                <RefreshCw className="size-4 text-[#FFC72E]" />
                <span>UPDATE & RESET PASSWORD</span>
                <ArrowRight className="size-4" />
              </>
            )}
          </button>

        </form>

        {/* Mode switcher link footer */}
        <div className="pt-2 border-t-2 border-[#141414]/15 text-center text-xs font-bold text-[#141414]/70">
          {mode === 'reset' ? (
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); }}
              className="text-[#FF4D00] hover:underline cursor-pointer"
            >
              ← Back to Login Screen
            </button>
          ) : mode === 'login' ? (
            <p>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(''); }}
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
                onClick={() => { setMode('login'); setError(''); }}
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
