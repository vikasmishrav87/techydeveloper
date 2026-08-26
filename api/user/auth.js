// Serverless API for Real User Authentication & Google OAuth
let usersDatabase = [];

function base64UrlDecode(str) {
  try {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    return JSON.parse(Buffer.from(base64, 'base64').toString('utf8'));
  } catch (e) {
    return null;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) {}
      }

      const { type, credential, email, password, name, picture } = body || {};

      let userData = {
        email: '',
        name: '',
        picture: '',
        googleSubId: '',
        authProvider: 'email'
      };

      // 1. Google OAuth (Google Identity Services Credential JWT or direct profile)
      if (type === 'google' || credential) {
        if (credential) {
          const parts = credential.split('.');
          if (parts.length === 3) {
            const payload = base64UrlDecode(parts[1]);
            if (payload && payload.email) {
              userData.email = payload.email.toLowerCase();
              userData.name = payload.name || payload.given_name || 'Google User';
              userData.picture = payload.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userData.email)}`;
              userData.googleSubId = payload.sub || '';
              userData.authProvider = 'google';
            }
          }
        }

        if (!userData.email && body.email) {
          userData.email = (body.email || '').toLowerCase().trim();
          userData.name = body.name || 'Google User';
          userData.picture = body.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userData.email)}`;
          userData.googleSubId = body.googleSubId || '';
          userData.authProvider = 'google';
        }
      } else {
        // 2. Work Email / Password Sign In or Sign Up
        userData.email = (email || '').toLowerCase().trim();
        userData.name = name || userData.email.split('@')[0] || 'Engineer Member';
        userData.picture = picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userData.email)}`;
        userData.authProvider = 'email';
      }

      if (!userData.email) {
        return res.status(400).json({ error: 'Valid email address required for authentication' });
      }

      // Check if user already exists in database
      let user = usersDatabase.find(u => u.email === userData.email);

      if (!user) {
        // Create new user profile with default free tier
        user = {
          id: 'USR-' + Date.now().toString().slice(-6),
          email: userData.email,
          name: userData.name,
          picture: userData.picture,
          googleSubId: userData.googleSubId,
          authProvider: userData.authProvider,
          subscription: {
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
          savedAudits: [],
          savedEstimates: [],
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          loginCount: 1
        };
        usersDatabase.unshift(user);
      } else {
        // Update existing user on login
        if (userData.name && userData.name !== 'Google User') user.name = userData.name;
        if (userData.picture) user.picture = userData.picture;
        user.lastLoginAt = new Date().toISOString();
        user.loginCount = (user.loginCount || 1) + 1;
      }

      const token = 'ue_usr_' + Buffer.from(`${user.id}:${user.email}:${Date.now()}`).toString('base64');

      return res.status(200).json({
        success: true,
        message: 'Authentication successful',
        token,
        user
      });
    } catch (e) {
      return res.status(500).json({ error: 'Authentication processing error' });
    }
  }

  // GET: Validate token & return user
  if (req.method === 'GET') {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');

    if (!token || !token.startsWith('ue_usr_')) {
      return res.status(401).json({ error: 'Invalid or missing user authentication token' });
    }

    try {
      const decoded = Buffer.from(token.replace('ue_usr_', ''), 'base64').toString('utf8');
      const [userId, email] = decoded.split(':');
      const user = usersDatabase.find(u => u.id === userId || u.email === email);

      if (user) {
        return res.status(200).json({ success: true, user });
      }
    } catch (e) {}

    return res.status(401).json({ error: 'User session expired' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
