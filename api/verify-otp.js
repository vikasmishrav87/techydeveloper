// Serverless API: Verify 6-Digit Email OTP Code
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

    // Check OTP from global runtime memory
    global._ACTIVE_EMAIL_OTPS = global._ACTIVE_EMAIL_OTPS || new Map();
    const record = global._ACTIVE_EMAIL_OTPS.get(cleanEmail);

    if (!record) {
      return res.status(401).json({ error: 'No verification code found for this email. Please request a new code.' });
    }

    if (Date.now() > record.expiresAt) {
      global._ACTIVE_EMAIL_OTPS.delete(cleanEmail);
      return res.status(401).json({ error: 'Verification code has expired. Please request a new code.' });
    }

    if (record.code !== cleanCode) {
      return res.status(401).json({ error: 'Invalid verification code. Please check your email and try again.' });
    }

    // Code is valid — delete it (one-time use)
    global._ACTIVE_EMAIL_OTPS.delete(cleanEmail);

    return res.status(200).json({
      success: true,
      verified: true,
      email: cleanEmail
    });

  } catch (error) {
    console.error('Verify OTP Handler error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
