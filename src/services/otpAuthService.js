// Real OTP Client Authentication Service
const OTP_STORAGE_KEY = 'ue_verified_client_session_v2';

export function getVerifiedUser() {
  try {
    const data = localStorage.getItem(OTP_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

export function logoutVerifiedUser() {
  localStorage.removeItem(OTP_STORAGE_KEY);
  window.dispatchEvent(new Event('ue_auth_changed'));
}

// 1. Send OTP via Serverless Email API
export async function sendOtpToEmail(email) {
  const cleanEmail = (email || '').toLowerCase().trim();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    throw new Error('Please enter a valid email address.');
  }

  const response = await fetch('/api/auth/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: cleanEmail })
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to dispatch email. Please check your address or try again.');
  }

  return { success: true, email: cleanEmail };
}

// 2. Verify OTP with Serverless API
export async function verifyOtpWithServer(email, code, fullName = '') {
  const cleanEmail = (email || '').toLowerCase().trim();
  const cleanCode = (code || '').trim();

  if (!cleanEmail || !cleanCode || cleanCode.length !== 6) {
    throw new Error('Please enter the full 6-digit verification code.');
  }

  const response = await fetch('/api/auth/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: cleanEmail, code: cleanCode })
  });

  const data = await response.json();

  if (!response.ok || !data.verified) {
    throw new Error(data.error || 'Invalid verification code. Please check your email inbox.');
  }

  // Create real verified user session
  const user = {
    id: 'USR-' + Date.now().toString().slice(-6),
    email: cleanEmail,
    name: fullName || cleanEmail.split('@')[0],
    picture: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`,
    verifiedAt: new Date().toISOString(),
    authMethod: 'email_otp'
  };

  localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event('ue_auth_changed'));
  return user;
}
