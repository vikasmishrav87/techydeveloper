// Serverless API for Admin Authentication
const ADMIN_USER = 'vikasmishraji87';
const ADMIN_PASS = 'unfilteredtrader9372';

// In-memory token store for serverless lifecycle
const activeTokens = new Set();

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
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
      const { username, password } = body || {};
      const userClean = (username || '').trim().toLowerCase();
      const passClean = (password || '').trim();

      if (userClean === ADMIN_USER && passClean === ADMIN_PASS) {
        const token = 'ue_sec_' + Buffer.from(`${ADMIN_USER}:${Date.now()}:${Math.random()}`).toString('base64');
        activeTokens.add(token);

        return res.status(200).json({
          success: true,
          token,
          user: {
            username: ADMIN_USER,
            role: 'Super Executive Admin',
            authenticatedAt: new Date().toISOString()
          }
        });
      }

      return res.status(401).json({
        success: false,
        error: 'Invalid administrative credentials. Access denied.'
      });
    } catch (e) {
      return res.status(500).json({ success: false, error: 'Server authentication error' });
    }
  }

  if (req.method === 'GET') {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');

    if (token && (token.startsWith('ue_sec_') || activeTokens.has(token))) {
      return res.status(200).json({
        authenticated: true,
        user: ADMIN_USER
      });
    }

    return res.status(401).json({ authenticated: false });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
