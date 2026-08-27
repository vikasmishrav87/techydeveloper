// Real Serverless Email OTP Verifier
global._OTP_STORE = global._OTP_STORE || new Map();

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { email, code } = req.body || {};
    const cleanEmail = (email || '').toLowerCase().trim();
    const cleanCode = (code || '').trim();

    if (!cleanEmail || !cleanCode || cleanCode.length !== 6) {
      return res.status(400).json({ error: 'Email and 6-digit verification code are required.' });
    }

    const record = global._OTP_STORE.get(cleanEmail);

    if (!record) {
      return res.status(401).json({ error: 'No verification code was requested for this email, or it has expired. Please request a new code.' });
    }

    if (Date.now() > record.expiresAt) {
      global._OTP_STORE.delete(cleanEmail);
      return res.status(401).json({ error: 'This verification code has expired (10 min limit). Please request a new code.' });
    }

    record.attempts = (record.attempts || 0) + 1;
    if (record.attempts > 5) {
      global._OTP_STORE.delete(cleanEmail);
      return res.status(429).json({ error: 'Too many incorrect attempts. Please request a new verification code.' });
    }

    // Strict validation
    if (record.code !== cleanCode) {
      return res.status(401).json({ error: 'Incorrect 6-digit code. Please check your email inbox and try again.' });
    }

    // Code is valid! Delete from store so it cannot be reused
    global._OTP_STORE.delete(cleanEmail);

    return res.status(200).json({
      success: true,
      verified: true,
      email: cleanEmail,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Serverless verify-otp error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
