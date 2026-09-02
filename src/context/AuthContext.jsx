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

    // 1. Check local cache to prevent duplicates
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

    // 2. Try Serverless API
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

    // 3. Try Supabase
    try {
      await supabase
        .from('user_accounts')
        .insert([newUser]);
    } catch (dbErr) {
      console.warn('Supabase user_accounts insert note:', dbErr?.message);
    }

    // 4. Save to local storage cache
    saveLocalAccount(newUser);

    // 5. Establish session
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

    // 1. Try Serverless API first
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

    // 2. If not verified by API, check Supabase
    if (!authenticatedUser) {
      try {
        const { data, error } = await supabase
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

    // 3. If not verified by remote, check local accounts cache
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
      throw new Error('Invalid User ID or Password. Check your credentials or use Password Reset.');
    }

    // Save session
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(authenticatedUser));
    setUser(authenticatedUser);
    logSecurityEvent('USER_LOGIN', `Client Logged In: ${authenticatedUser.userId}`, { userId: authenticatedUser.userId });

    return authenticatedUser;
  };

  // Reset Password
  const resetPassword = async (userId, newPassword) => {
    const cleanId = (userId || '').trim().toLowerCase();
    const cleanNewPassword = (newPassword || '').trim();

    if (!cleanId || !cleanNewPassword) {
      throw new Error('User ID and new password are required.');
    }
    if (cleanNewPassword.length < 6) {
      throw new Error('New password must be at least 6 characters long.');
    }

    let updated = false;

    // 1. Try Serverless API
    try {
      const resp = await fetch('/api/user-auth?action=reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: cleanId, newPassword: cleanNewPassword })
      });
      const data = await resp.json();
      if (data.success) {
        updated = true;
      }
    } catch (apiErr) {
      console.warn('API reset password note:', apiErr?.message);
    }

    // 2. Try Supabase
    try {
      const { error } = await supabase
        .from('user_accounts')
        .update({ password: cleanNewPassword, updatedAt: new Date().toISOString() })
        .or(`userId.eq.${cleanId},email.eq.${cleanId}`);
      if (!error) updated = true;
    } catch (dbErr) {
      console.warn('Supabase reset password note:', dbErr?.message);
    }

    // 3. Update local accounts
    const localAccounts = getLocalAccounts();
    const idx = localAccounts.findIndex(a => a.userId === cleanId || a.email === cleanId);
    if (idx >= 0) {
      localAccounts[idx].password = cleanNewPassword;
      localAccounts[idx].updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(localAccounts));
      updated = true;
    }

    if (!updated && idx < 0) {
      throw new Error(`No account found matching ID "${cleanId}". Please register first.`);
    }

    logSecurityEvent('PASSWORD_RESET', `Password reset executed for: ${cleanId}`, { userId: cleanId });
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
      resetPassword,
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
