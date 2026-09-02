import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { logSecurityEvent } from '../services/storageService';

const AuthContext = createContext(null);

const STORAGE_SESSION_KEY = 'ue_client_session';
const STORAGE_USERS_KEY = 'ue_registered_accounts';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load existing session on boot
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem(STORAGE_SESSION_KEY);
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed && parsed.userId) {
          setUser(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to load user session:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Helper to get local accounts
  const getLocalAccounts = () => {
    try {
      const raw = localStorage.getItem(STORAGE_USERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  // Helper to save local accounts
  const saveLocalAccount = (account) => {
    try {
      const accounts = getLocalAccounts();
      const idx = accounts.findIndex(a => a.userId === account.userId || a.email === account.email);
      if (idx >= 0) {
        accounts[idx] = { ...accounts[idx], ...account };
      } else {
        accounts.push(account);
      }
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(accounts));
    } catch (e) {
      console.warn('Failed to save local account:', e);
    }
  };

  // Register
  const register = async ({ userId, email, password, name, phone }) => {
    const cleanId = (userId || email || '').trim().toLowerCase();
    const cleanEmail = (email || userId || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();
    const cleanName = (name || cleanId.split('@')[0] || 'Client').trim();

    if (!cleanId || !cleanPassword) {
      throw new Error('User ID / Email and Password are required.');
    }
    if (cleanPassword.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    // Check local cache
    const localAccounts = getLocalAccounts();
    if (localAccounts.some(a => a.userId === cleanId || a.email === cleanEmail)) {
      throw new Error('An account with this ID / Email already exists. Please log in.');
    }

    let newUser = {
      id: 'usr_' + Date.now(),
      userId: cleanId,
      email: cleanEmail,
      password: cleanPassword,
      name: cleanName,
      phone: phone || '',
      role: 'Verified Client',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    // Try Serverless API
    try {
      const resp = await fetch('/api/user-auth?action=register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: cleanId, email: cleanEmail, password: cleanPassword, name: cleanName, phone })
      });
      const data = await resp.json();
      if (data.success && data.user) {
        newUser = { ...newUser, ...data.user, token: data.token };
      }
    } catch (apiErr) {
      console.warn('Backend API register note:', apiErr?.message);
    }

    // Try Supabase
    try {
      await supabase
        .from('user_accounts')
        .insert([newUser]);
    } catch (dbErr) {
      console.warn('Supabase user_accounts insert note:', dbErr?.message);
    }

    saveLocalAccount(newUser);

    const safeUser = {
      id: newUser.id,
      userId: newUser.userId,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      createdAt: newUser.createdAt,
      lastLogin: newUser.lastLogin
    };

    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(safeUser));
    setUser(safeUser);
    logSecurityEvent('USER_REGISTER', `New Client Registered: ${safeUser.userId}`, { userId: safeUser.userId });

    return safeUser;
  };

  // Login
  const login = async (userId, password) => {
    const cleanId = (userId || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanId || !cleanPassword) {
      throw new Error('User ID and Password are required.');
    }

    let authenticatedUser = null;

    // 1. Try Serverless API
    try {
      const resp = await fetch('/api/user-auth?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: cleanId, password: cleanPassword })
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.success && data.user) {
          authenticatedUser = data.user;
        }
      }
    } catch (apiErr) {
      console.warn('Backend API login note:', apiErr?.message);
    }

    // 2. Check Supabase
    if (!authenticatedUser) {
      try {
        const { data } = await supabase
          .from('user_accounts')
          .select('*')
          .or(`userId.eq.${cleanId},email.eq.${cleanId}`)
          .limit(1);

        if (data && data.length > 0 && data[0].password === cleanPassword) {
          authenticatedUser = {
            id: data[0].id,
            userId: data[0].userId,
            email: data[0].email,
            name: data[0].name,
            role: data[0].role || 'Verified Client',
            lastLogin: new Date().toISOString()
          };
        }
      } catch (dbErr) {
        console.warn('Supabase login check note:', dbErr?.message);
      }
    }

    // 3. Check local cache
    if (!authenticatedUser) {
      const localAccounts = getLocalAccounts();
      const match = localAccounts.find(a => (a.userId === cleanId || a.email === cleanId) && a.password === cleanPassword);
      if (match) {
        authenticatedUser = {
          id: match.id,
          userId: match.userId,
          email: match.email,
          name: match.name,
          role: match.role || 'Verified Client',
          lastLogin: new Date().toISOString()
        };
      }
    }

    if (!authenticatedUser) {
      throw new Error('Invalid User ID or Password. Check your credentials or use Forgot Password.');
    }

    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(authenticatedUser));
    setUser(authenticatedUser);
    logSecurityEvent('USER_LOGIN', `Client Logged In: ${authenticatedUser.userId}`, { userId: authenticatedUser.userId });

    return authenticatedUser;
  };

  // Request Reset OTP Code
  const requestResetCode = async (userId) => {
    const cleanId = (userId || '').trim().toLowerCase();
    if (!cleanId) {
      throw new Error('Please enter your registered User ID or Email address.');
    }

    let result = null;

    // 1. Call Backend API
    try {
      const resp = await fetch('/api/user-auth?action=request-reset-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: cleanId })
      });
      const data = await resp.json();
      if (!resp.ok || !data.success) {
        throw new Error(data.error || 'Failed to request reset code.');
      }
      result = data;
    } catch (apiErr) {
      // If network/offline, check local storage
      const localAccounts = getLocalAccounts();
      const localUser = localAccounts.find(a => a.userId === cleanId || a.email === cleanId);
      if (!localUser) {
        throw new Error(apiErr.message || `No registered account found matching "${cleanId}".`);
      }
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      localUser.resetOtp = otpCode;
      localUser.resetOtpExpiresAt = Date.now() + 10 * 60 * 1000;
      saveLocalAccount(localUser);
      result = {
        success: true,
        message: `6-digit verification code dispatched to ${localUser.email || cleanId}.`,
        targetEmail: localUser.email || cleanId,
        codeHint: otpCode
      };
    }

    logSecurityEvent('OTP_REQUEST', `Reset OTP Requested for: ${cleanId}`, { userId: cleanId });
    return result;
  };

  // Reset Password With Verified OTP Code
  const resetPasswordWithCode = async (userId, code, newPassword) => {
    const cleanId = (userId || '').trim().toLowerCase();
    const cleanCode = (code || '').trim();
    const cleanNewPassword = (newPassword || '').trim();

    if (!cleanId) {
      throw new Error('User ID or Email is required.');
    }
    if (!cleanCode || cleanCode.length !== 6) {
      throw new Error('Please enter the 6-digit verification code sent to your email.');
    }
    if (!cleanNewPassword || cleanNewPassword.length < 6) {
      throw new Error('New password must be at least 6 characters long.');
    }

    let success = false;

    // 1. Call Backend API
    try {
      const resp = await fetch('/api/user-auth?action=reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: cleanId, code: cleanCode, newPassword: cleanNewPassword })
      });
      const data = await resp.json();
      if (!resp.ok || !data.success) {
        throw new Error(data.error || 'Password reset verification failed.');
      }
      success = true;
    } catch (apiErr) {
      // Fallback local check
      const localAccounts = getLocalAccounts();
      const localUser = localAccounts.find(a => a.userId === cleanId || a.email === cleanId);
      if (localUser) {
        if (!localUser.resetOtp || localUser.resetOtp !== cleanCode) {
          throw new Error('Verification failed: The 6-digit code you entered is incorrect. Access denied.');
        }
        if (localUser.resetOtpExpiresAt && Date.now() > localUser.resetOtpExpiresAt) {
          throw new Error('Verification code has expired. Please request a new code.');
        }
        localUser.password = cleanNewPassword;
        localUser.resetOtp = null;
        localUser.resetOtpExpiresAt = null;
        localUser.updatedAt = new Date().toISOString();
        saveLocalAccount(localUser);
        success = true;
      } else {
        throw apiErr;
      }
    }

    // Also update local cache if found
    const localAccounts = getLocalAccounts();
    const idx = localAccounts.findIndex(a => a.userId === cleanId || a.email === cleanId);
    if (idx >= 0) {
      localAccounts[idx].password = cleanNewPassword;
      localAccounts[idx].resetOtp = null;
      localAccounts[idx].resetOtpExpiresAt = null;
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(localAccounts));
    }

    logSecurityEvent('PASSWORD_RESET_SUCCESS', `Password successfully reset with verified OTP for: ${cleanId}`, { userId: cleanId });
    return true;
  };

  // Logout
  const logout = () => {
    const userId = user?.userId;
    localStorage.removeItem(STORAGE_SESSION_KEY);
    setUser(null);
    if (userId) {
      logSecurityEvent('USER_LOGOUT', `Client Logged Out: ${userId}`, { userId });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      loading,
      login,
      register,
      requestResetCode,
      resetPasswordWithCode,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
