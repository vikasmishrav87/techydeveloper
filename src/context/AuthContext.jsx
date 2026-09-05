import React, { createContext, useContext, useState, useEffect } from 'react';
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

  // 1. REGISTER: creates account and generates unique 12-digit recovery key
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

    let newUser = {
      id: 'usr_' + Date.now(),
      userId: cleanId,
      email: cleanEmail,
      name: cleanName,
      phone: phone || '',
      role: 'Verified Client',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    let recoveryKey = '';

    // Call Backend Vault API
    try {
      const resp = await fetch('/api/user-auth?action=register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: cleanId, email: cleanEmail, password: cleanPassword, name: cleanName, phone })
      });
      const data = await resp.json();
      if (!resp.ok || !data.success) {
        throw new Error(data.error || 'Registration failed.');
      }
      if (data.user) {
        newUser = { ...newUser, ...data.user, token: data.token };
      }
      recoveryKey = data.recoveryKey || '';
    } catch (apiErr) {
      throw new Error(apiErr.message || 'Registration service error.');
    }

    newUser.recoveryKey = recoveryKey;
    saveLocalAccount({ ...newUser, password: cleanPassword });

    const safeUser = {
      id: newUser.id,
      userId: newUser.userId,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      recoveryKey: newUser.recoveryKey,
      createdAt: newUser.createdAt,
      lastLogin: newUser.lastLogin
    };

    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(safeUser));
    setUser(safeUser);
    logSecurityEvent('USER_REGISTER', `New Client Registered: ${safeUser.userId}`, { userId: safeUser.userId });

    return { user: safeUser, recoveryKey };
  };

  // 2. LOGIN
  const login = async (userId, password) => {
    const cleanId = (userId || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanId || !cleanPassword) {
      throw new Error('User ID and Password are required.');
    }

    let authenticatedUser = null;

    // Call Backend Vault API
    try {
      const resp = await fetch('/api/user-auth?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: cleanId, password: cleanPassword })
      });
      const data = await resp.json();
      if (resp.ok && data.success && data.user) {
        authenticatedUser = data.user;
      } else if (!resp.ok) {
        throw new Error(data.error || 'Invalid User ID or Password.');
      }
    } catch (apiErr) {
      // Fallback check local cache
      const localAccounts = getLocalAccounts();
      const match = localAccounts.find(a => (a.userId === cleanId || a.email === cleanId) && a.password === cleanPassword);
      if (match) {
        authenticatedUser = {
          id: match.id,
          userId: match.userId,
          email: match.email,
          name: match.name,
          role: match.role || 'Verified Client',
          recoveryKey: match.recoveryKey || '',
          lastLogin: new Date().toISOString()
        };
      } else {
        throw new Error(apiErr.message || 'Invalid credentials. Check User ID and Password.');
      }
    }

    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(authenticatedUser));
    setUser(authenticatedUser);
    logSecurityEvent('USER_LOGIN', `Client Logged In: ${authenticatedUser.userId}`, { userId: authenticatedUser.userId });

    return authenticatedUser;
  };

  // 3. VERIFY 12-DIGIT SECRET RECOVERY KEY
  const verifyRecoveryKey = async (userId, recoveryKey) => {
    const cleanId = (userId || '').trim().toLowerCase();
    const cleanKey = (recoveryKey || '').trim();

    if (!cleanId) {
      throw new Error('Please enter your registered User ID or Email address.');
    }
    if (!cleanKey) {
      throw new Error('Please enter your 12-digit Secret Recovery Key.');
    }

    try {
      const resp = await fetch('/api/user-auth?action=verify-recovery-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: cleanId, recoveryKey: cleanKey })
      });
      const data = await resp.json();
      if (!resp.ok || !data.success) {
        throw new Error(data.error || 'Secret Recovery Key verification failed.');
      }
      logSecurityEvent('RECOVERY_KEY_VERIFIED', `Recovery Key verified for: ${cleanId}`, { userId: cleanId });
      return data;
    } catch (err) {
      // Check local accounts as fallback
      const localAccounts = getLocalAccounts();
      const user = localAccounts.find(u => u.userId === cleanId || u.email === cleanId);
      if (user && user.recoveryKey) {
        const normLocal = user.recoveryKey.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        const normInput = cleanKey.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        if (normLocal === normInput) {
          return { success: true, verified: true, userId: user.userId, email: user.email };
        }
      }
      throw new Error(err.message || 'Invalid Secret Recovery Key for this account. Access denied.');
    }
  };

  // 4. UPDATE PASSWORD WITH VERIFIED SECRET RECOVERY KEY
  const updatePasswordWithRecoveryKey = async (userId, recoveryKey, newPassword) => {
    const cleanId = (userId || '').trim().toLowerCase();
    const cleanKey = (recoveryKey || '').trim();
    const cleanNewPassword = (newPassword || '').trim();

    if (!cleanId || !cleanKey) {
      throw new Error('User ID and 12-digit Secret Recovery Key are required.');
    }
    if (!cleanNewPassword || cleanNewPassword.length < 6) {
      throw new Error('New password must be at least 6 characters long.');
    }

    try {
      const resp = await fetch('/api/user-auth?action=update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: cleanId, recoveryKey: cleanKey, newPassword: cleanNewPassword })
      });
      const data = await resp.json();
      if (!resp.ok || !data.success) {
        throw new Error(data.error || 'Failed to update password.');
      }

      // Update local storage
      const localAccounts = getLocalAccounts();
      const idx = localAccounts.findIndex(a => a.userId === cleanId || a.email === cleanId);
      if (idx >= 0) {
        localAccounts[idx].password = cleanNewPassword;
        localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(localAccounts));
      }

      logSecurityEvent('PASSWORD_UPDATE_SUCCESS', `Password successfully updated with recovery key for: ${cleanId}`, { userId: cleanId });
      return data;
    } catch (err) {
      throw new Error(err.message || 'Error updating password.');
    }
  };

  // Backwards compatible aliases
  const requestResetCode = async (userId) => verifyRecoveryKey(userId, '');
  const resetPasswordWithCode = async (userId, code, newPassword) => updatePasswordWithRecoveryKey(userId, code, newPassword);

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
      verifyRecoveryKey,
      updatePasswordWithRecoveryKey,
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
