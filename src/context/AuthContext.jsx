import React, { createContext, useContext, useState, useEffect } from 'react';
import { logSecurityEvent } from '../services/storageService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Clean up legacy localStorage credentials on boot
  useEffect(() => {
    try {
      localStorage.removeItem('ue_client_session');
      localStorage.removeItem('ue_registered_accounts');
    } catch {}
  }, []);

  // Fetch current session from server via HttpOnly Cookie
  useEffect(() => {
    let isMounted = true;

    async function checkServerSession() {
      try {
        const resp = await fetch('/api/user-auth?action=me', {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          credentials: 'include' // Attaches __Host-ue_session HttpOnly cookie
        });

        if (resp.ok) {
          const data = await resp.json();
          if (isMounted && data.authenticated && data.user) {
            setUser(data.user);
          } else if (isMounted) {
            setUser(null);
          }
        } else if (isMounted) {
          setUser(null);
        }
      } catch (err) {
        console.warn('Session verification notice:', err.message);
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    checkServerSession();

    return () => {
      isMounted = false;
    };
  }, []);

  // 1. REGISTER NEW ACCOUNT
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

    const resp = await fetch('/api/user-auth?action=register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ userId: cleanId, email: cleanEmail, password: cleanPassword, name: cleanName, phone })
    });

    const data = await resp.json();
    if (!resp.ok || !data.success) {
      throw new Error(data.error || 'Registration failed.');
    }

    setUser(data.user);
    logSecurityEvent('USER_REGISTER', `New Client Registered: ${cleanId}`, { userId: cleanId });

    return { user: data.user, recoveryKey: data.recoveryKey };
  };

  // 2. LOGIN
  const login = async (userId, password) => {
    const cleanId = (userId || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanId || !cleanPassword) {
      throw new Error('User ID and Password are required.');
    }

    const resp = await fetch('/api/user-auth?action=login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ userId: cleanId, password: cleanPassword })
    });

    const data = await resp.json();
    if (!resp.ok || !data.success) {
      throw new Error(data.error || 'Invalid User ID or Password.');
    }

    setUser(data.user);
    logSecurityEvent('USER_LOGIN', `Client Logged In: ${cleanId}`, { userId: cleanId });

    return data.user;
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

    const resp = await fetch('/api/user-auth?action=verify-recovery-key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ userId: cleanId, recoveryKey: cleanKey })
    });

    const data = await resp.json();
    if (!resp.ok || !data.success) {
      throw new Error(data.error || 'Secret Recovery Key verification failed.');
    }

    logSecurityEvent('RECOVERY_KEY_VERIFIED', `Recovery Key verified for: ${cleanId}`, { userId: cleanId });
    return data;
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

    const resp = await fetch('/api/user-auth?action=update-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ userId: cleanId, recoveryKey: cleanKey, newPassword: cleanNewPassword })
    });

    const data = await resp.json();
    if (!resp.ok || !data.success) {
      throw new Error(data.error || 'Failed to update password.');
    }

    logSecurityEvent('PASSWORD_UPDATE_SUCCESS', `Password updated for: ${cleanId}`, { userId: cleanId });
    return data;
  };

  // 5. GOOGLE OAUTH CLIENT LOGIN
  const loginWithGoogle = async (googleResponse) => {
    let authPayload = {};
    if (typeof googleResponse === 'string') {
      authPayload = { credential: googleResponse };
    } else if (googleResponse?.credential) {
      authPayload = { credential: googleResponse.credential };
    } else if (googleResponse?.access_token) {
      authPayload = { accessToken: googleResponse.access_token };
    } else {
      authPayload = googleResponse || {};
    }

    const resp = await fetch('/api/user-auth?action=google-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(authPayload)
    });

    const data = await resp.json();
    if (!resp.ok || !data.success) {
      throw new Error(data.error || 'Google authentication failed.');
    }

    setUser(data.user);
    logSecurityEvent('GOOGLE_AUTH_SUCCESS', `Client signed in with Google: ${data.user.email}`, { 
      userId: data.user.userId,
      email: data.user.email
    });

    return data.user;
  };

  // Backwards compatible aliases
  const requestResetCode = async (userId) => verifyRecoveryKey(userId, '');
  const resetPasswordWithCode = async (userId, code, newPassword) => updatePasswordWithRecoveryKey(userId, code, newPassword);

  // 6. LOGOUT (Server-Side Session Revocation + Cookie Destruction)
  const logout = async () => {
    const userId = user?.userId;
    try {
      await fetch('/api/user-auth?action=logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
    } catch (err) {
      console.warn('Logout notification error:', err.message);
    }

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
      loginWithGoogle,
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
