// 100% Real Supabase Authentication & PostgreSQL Database Integration
import { logSecurityEvent } from './storageService';
import { supabase } from './supabaseClient';

const USER_STORAGE_KEYS = {
  CURRENT_USER: 'ue_active_user_session_v1',
  AUTH_TOKEN: 'ue_active_user_token_v1',
  ALL_USERS: 'ue_registered_users_registry_v1',
};

// Helper: Format user object from Supabase Auth response
function formatUserFromSupabase(sbUser, sessionToken, customName = '') {
  if (!sbUser) return null;
  const email = (sbUser.email || '').toLowerCase().trim();
  const name = customName || sbUser.user_metadata?.full_name || sbUser.user_metadata?.name || email.split('@')[0];
  const picture = sbUser.user_metadata?.avatar_url || sbUser.user_metadata?.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`;

  const existingUsers = getRegisteredUsers();
  let existing = existingUsers.find(u => u.email.toLowerCase() === email);

  const user = {
    id: 'USR-' + (sbUser.id ? sbUser.id.slice(-6).toUpperCase() : Date.now().toString().slice(-6)),
    supabaseId: sbUser.id,
    email,
    name,
    picture,
    authProvider: sbUser.app_metadata?.provider || 'supabase',
    subscription: existing?.subscription || {
      tier: 'free',
      status: 'active',
      planName: 'Free Explorer Tier',
      unlockedAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 365 * 24 * 3600000).toISOString(),
      features: [
        'Standard Zero-Trust PenTest Audits',
        'Custom Scope & Estimator Calculations',
        'AI Solutions Architect Inquiries'
      ]
    },
    savedAudits: existing?.savedAudits || [],
    savedEstimates: existing?.savedEstimates || [],
    createdAt: existing?.createdAt || sbUser.created_at || new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    loginCount: (existing?.loginCount || 0) + 1
  };

  saveRegisteredUser(user);
  localStorage.setItem(USER_STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  if (sessionToken) {
    localStorage.setItem(USER_STORAGE_KEYS.AUTH_TOKEN, sessionToken);
  }

  // Sync to API
  try {
    fetch('/api/user/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'supabase', email, name, picture, supabaseId: sbUser.id })
    }).catch(() => {});
  } catch (e) {}

  window.dispatchEvent(new Event('ue_auth_changed'));
  return user;
}

// Get all registered users (for admin & persistence)
export function getRegisteredUsers() {
  try {
    return JSON.parse(localStorage.getItem(USER_STORAGE_KEYS.ALL_USERS) || '[]');
  } catch (e) {
    return [];
  }
}

export function saveRegisteredUser(user) {
  try {
    const users = getRegisteredUsers();
    const index = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (index >= 0) {
      users[index] = { ...users[index], ...user, lastActive: new Date().toISOString() };
    } else {
      users.unshift({ ...user, lastActive: new Date().toISOString() });
    }
    localStorage.setItem(USER_STORAGE_KEYS.ALL_USERS, JSON.stringify(users));
  } catch (e) {}
}

// Get current active user
export function getCurrentUser() {
  try {
    const data = localStorage.getItem(USER_STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

// ----------------------------------------------------
// 1. Real Supabase Sign In (Email & Password)
// ----------------------------------------------------
export async function signInWithSupabase(email, password) {
  const cleanEmail = (email || '').toLowerCase().trim();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    throw new Error('Please enter a valid email address.');
  }
  if (!password) {
    throw new Error('Please enter your password.');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: cleanEmail,
    password: password
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data?.user) {
    throw new Error('Authentication failed. No user record returned.');
  }

  logSecurityEvent('USER_AUTH', `User Signed In (Supabase): ${cleanEmail}`, {
    supabaseId: data.user.id
  }, 'AUTHENTICATED');

  return formatUserFromSupabase(data.user, data.session?.access_token);
}

// ----------------------------------------------------
// 2. Real Supabase Sign Up / Register Account
// ----------------------------------------------------
export async function signUpWithSupabase(email, password, fullName = '') {
  const cleanEmail = (email || '').toLowerCase().trim();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    throw new Error('Please enter a valid email address.');
  }
  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  const { data, error } = await supabase.auth.signUp({
    email: cleanEmail,
    password: password,
    options: {
      data: {
        full_name: fullName || cleanEmail.split('@')[0],
        avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`
      }
    }
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data?.user) {
    throw new Error('Registration failed. Please try again.');
  }

  logSecurityEvent('USER_AUTH', `New User Registered (Supabase): ${cleanEmail}`, {
    supabaseId: data.user.id
  }, 'REGISTERED');

  return formatUserFromSupabase(data.user, data.session?.access_token, fullName);
}

// ----------------------------------------------------
// 3. Real Google OAuth Redirect (Direct Google Auth)
// ----------------------------------------------------
export async function signInWithGoogleOAuth() {
  const redirectUrl = `${window.location.origin}/account`;
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent'
      }
    }
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// ----------------------------------------------------
// 4. Upgrade User Subscription Plan
// ----------------------------------------------------
export function upgradeUserSubscription(tier = 'pro') {
  const user = getCurrentUser();
  if (!user) return null;

  const planDetails = {
    pro: {
      tier: 'pro',
      status: 'active',
      planName: 'Pro Engineering Member',
      unlockedAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 365 * 24 * 3600000).toISOString(),
      features: [
        'Unlimited Zero-Trust Security Audits & PDF Export',
        'Direct VIP WhatsApp Line with Vikas Mishra',
        'Private H100 GPU AI Agent Playground',
        '24/7 Red-Team War Room Dispatch Priority',
        '100% Multi-Tenant Cloud Architecture Blueprints'
      ]
    },
    enterprise: {
      tier: 'enterprise',
      status: 'active',
      planName: 'Enterprise Dedicated Retainer',
      unlockedAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 365 * 24 * 3600000).toISOString(),
      features: [
        'All Pro Tier Privileges Unlocked',
        'Dedicated 4-9 Senior Engineer Squad On-Demand',
        'Custom Smart Contract Formal Verification',
        '0-Day Vulnerability SLA Defense',
        'Executive Boardroom Strategy Deliverables'
      ]
    }
  };

  user.subscription = planDetails[tier] || planDetails.pro;
  saveRegisteredUser(user);
  localStorage.setItem(USER_STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));

  try {
    fetch('/api/user/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email, tier })
    }).catch(() => {});
  } catch (e) {}

  logSecurityEvent('SUBSCRIPTION', `Member Upgraded to ${user.subscription.planName}: ${user.email}`, {
    tier,
    user: user.name
  }, 'UPGRADED');

  window.dispatchEvent(new Event('ue_auth_changed'));
  return user;
}

// ----------------------------------------------------
// 5. User Logout (Real Supabase SignOut)
// ----------------------------------------------------
export async function logoutUser() {
  const user = getCurrentUser();
  if (user) {
    logSecurityEvent('USER_AUTH', `User Logged Out: ${user.email}`, { userId: user.id }, 'LOGGED_OUT');
  }

  try {
    await supabase.auth.signOut();
  } catch (e) {}

  localStorage.removeItem(USER_STORAGE_KEYS.CURRENT_USER);
  localStorage.removeItem(USER_STORAGE_KEYS.AUTH_TOKEN);
  window.dispatchEvent(new Event('ue_auth_changed'));
}

// ----------------------------------------------------
// 6. Supabase Real-Time Session Listener
// ----------------------------------------------------
export function initSupabaseSessionListener() {
  try {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        formatUserFromSupabase(session.user, session.access_token);
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem(USER_STORAGE_KEYS.CURRENT_USER);
        localStorage.removeItem(USER_STORAGE_KEYS.AUTH_TOKEN);
        window.dispatchEvent(new Event('ue_auth_changed'));
      }
    });
  } catch (e) {}
}
