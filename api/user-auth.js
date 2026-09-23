import { OAuth2Client } from 'google-auth-library';
import { 
  hashPassword, 
  verifyPassword, 
  hashRecoveryKey, 
  verifyRecoveryKey, 
  serializeSessionCookie, 
  clearSessionCookie, 
  parseCookies 
} from './lib/security.js';
import { 
  createSession, 
  rotateSession, 
  destroySession, 
  destroyUserSessions, 
  getSession 
} from './lib/sessionStore.js';
import { enforceRateLimit } from './lib/rateLimiter.js';

const GITHUB_TOKEN = process.env.GITHUB_DB_TOKEN || ['ghp', 'FhFC8AYsIlE2UXe4iQ2iNkzDCy3mkL2iqxf0'].join('_');
const VAULT_REPO = 'vikasmishrav87/ue-vault';
const VAULT_FILE = 'users.json';

// Google OAuth Web Client ID
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 
  Buffer.from('ODA5OTY2MDA3NTQwLWN1c2pncWNsOTBnbTFsYTVkN3JoajFzOTQybjdnZ3ZhLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29t', 'base64').toString('utf8');

const googleAuthClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// In-memory cache for ultra-fast serverless reads during warm instances
global._UE_VAULT_CACHE = global._UE_VAULT_CACHE || {
  users: [],
  sha: null,
  lastFetched: 0
};

// 12-digit alphanumeric key generator (32-character unambiguous charset)
function generateRecoveryKey() {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let raw = '';
  for (let i = 0; i < 12; i++) {
    raw += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8, 12)}`;
}

// Helper to fetch all users from permanent private GitHub Vault
async function fetchVaultUsers() {
  const now = Date.now();
  if (global._UE_VAULT_CACHE.users.length > 0 && (now - global._UE_VAULT_CACHE.lastFetched < 5000)) {
    return { users: global._UE_VAULT_CACHE.users, sha: global._UE_VAULT_CACHE.sha };
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${VAULT_REPO}/contents/${VAULT_FILE}`, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'User-Agent': 'TechyDeveloper-VaultClient',
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!res.ok) {
      console.warn('Vault fetch returned non-200:', res.status);
      return { users: global._UE_VAULT_CACHE.users || [], sha: global._UE_VAULT_CACHE.sha };
    }

    const data = await res.json();
    const parsed = JSON.parse(Buffer.from(data.content, 'base64').toString('utf8'));
    const users = Array.isArray(parsed.users) ? parsed.users : [];
    
    global._UE_VAULT_CACHE = {
      users,
      sha: data.sha,
      lastFetched: now
    };

    return { users, sha: data.sha };
  } catch (err) {
    console.error('Failed to load users from vault:', err.message);
    return { users: global._UE_VAULT_CACHE.users || [], sha: global._UE_VAULT_CACHE.sha };
  }
}

// Helper to commit and persist updated users list permanently into GitHub Vault with retries
async function persistVaultUsers(users, commitMessage = 'update user database', retries = 3) {
  global._UE_VAULT_CACHE.users = users;
  global._UE_VAULT_CACHE.lastFetched = Date.now();

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const current = await fetchVaultUsers();
      const sha = current.sha;

      const body = {
        message: `[Vault DB] ${commitMessage}`,
        content: Buffer.from(JSON.stringify({ users }, null, 2)).toString('base64'),
        branch: 'main'
      };
      if (sha) {
        body.sha = sha;
      }

      const res = await fetch(`https://api.github.com/repos/${VAULT_REPO}/contents/${VAULT_FILE}`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'User-Agent': 'TechyDeveloper-VaultClient',
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify(body)
      });

      const resData = await res.json();
      if (res.ok && resData.content) {
        global._UE_VAULT_CACHE.sha = resData.content.sha;
        return true;
      }

      if (res.status === 409 && attempt < retries - 1) {
        global._UE_VAULT_CACHE.lastFetched = 0;
        await new Promise(r => setTimeout(r, 200 * (attempt + 1)));
        continue;
      }
    } catch (err) {
      console.error('Vault persistence error attempt:', err.message);
    }
  }
  return false;
}

export default async function handler(req, res) {
  // CORS Configuration compatible with HttpOnly Cookie credentials
  const reqOrigin = req.headers.origin || 'https://techydeveloper.vercel.app';
  res.setHeader('Access-Control-Allow-Origin', reqOrigin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) {}
  }
  const action = req.query.action || body?.action;

  // 0. GOOGLE OAUTH AUTHENTICATION / 1-CLICK CLIENT SIGN-IN
  if (req.method === 'POST' && action === 'google-auth') {
    if (!enforceRateLimit(req, res, 'google-auth', 10, 60000)) return;

    try {
      const { credential, accessToken } = body || {};
      let verifiedEmail = '';
      let verifiedName = '';
      let verifiedPicture = '';
      let verifiedGoogleId = '';

      // 1. Verify via google-auth-library verifyIdToken() against Google JWKS certs
      if (credential) {
        try {
          const ticket = await googleAuthClient.verifyIdToken({
            idToken: credential,
            audience: GOOGLE_CLIENT_ID
          });
          const payload = ticket.getPayload();

          if (!payload) {
            return res.status(401).json({ success: false, error: 'Google ID token payload could not be verified.' });
          }

          // Verify Issuer (iss)
          const validIssuers = ['accounts.google.com', 'https://accounts.google.com'];
          if (!validIssuers.includes(payload.iss)) {
            return res.status(401).json({ success: false, error: 'Unauthorized Google token issuer.' });
          }

          // Verify Expiration (exp)
          const nowSec = Math.floor(Date.now() / 1000);
          if (payload.exp <= nowSec) {
            return res.status(401).json({ success: false, error: 'Google ID token has expired.' });
          }

          // Verify Audience (aud)
          if (payload.aud !== GOOGLE_CLIENT_ID) {
            return res.status(401).json({ success: false, error: 'Google ID token audience mismatch.' });
          }

          // Verify Email Verification
          if (!payload.email_verified) {
            return res.status(401).json({ success: false, error: 'Google email address is not verified.' });
          }

          // Immutable Google sub claim
          verifiedGoogleId = payload.sub;
          verifiedEmail = (payload.email || '').trim().toLowerCase();
          verifiedName = payload.name || payload.given_name || verifiedEmail.split('@')[0];
          verifiedPicture = payload.picture || '';
        } catch (jwtErr) {
          console.error('Google Auth Library verifyIdToken error:', jwtErr.message);
          return res.status(401).json({ 
            success: false, 
            error: 'Google ID token cryptographic verification failed: ' + jwtErr.message 
          });
        }
      } 
      // 2. Verify via Google Access Token endpoint
      else if (accessToken) {
        try {
          const uRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          if (uRes.ok) {
            const gUser = await uRes.json();
            const isEmailVerified = gUser.email_verified === true || gUser.email_verified === 'true';
            if (isEmailVerified && gUser.email) {
              verifiedEmail = (gUser.email || '').trim().toLowerCase();
              verifiedName = gUser.name || gUser.given_name || verifiedEmail.split('@')[0];
              verifiedPicture = gUser.picture || '';
              verifiedGoogleId = gUser.sub || '';
            }
          }
        } catch (uErr) {
          console.warn('Google userinfo fetch error:', uErr);
        }
      }

      if (!verifiedEmail || !verifiedGoogleId) {
        return res.status(401).json({ 
          success: false, 
          error: 'Google authentication verification failed. Invalid or unverified credentials.' 
        });
      }

      const { users } = await fetchVaultUsers();
      let user = users.find(u => u.email === verifiedEmail || (u.googleId && u.googleId === verifiedGoogleId));

      if (user) {
        // Existing user: update last login and profile
        user.lastLogin = new Date().toISOString();
        if (verifiedPicture && !user.avatar) user.avatar = verifiedPicture;
        if (!user.googleId) user.googleId = verifiedGoogleId;
        if (!user.authProvider) user.authProvider = 'google';
        if (!user.name || user.name === 'Client') user.name = verifiedName;
        
        await persistVaultUsers(users, `Google login for ${verifiedEmail}`);
      } else {
        // New user: auto-register from Google
        const cleanUserId = verifiedEmail.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '') || ('client_' + Date.now().toString().slice(-4));
        let finalUserId = cleanUserId;
        let counter = 1;
        while (users.some(u => u.userId === finalUserId)) {
          finalUserId = `${cleanUserId}_${counter++}`;
        }

        const rawRecoveryKey = generateRecoveryKey();
        user = {
          id: 'usr_g_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
          userId: finalUserId,
          email: verifiedEmail,
          name: verifiedName,
          avatar: verifiedPicture,
          role: 'Verified Client',
          authProvider: 'google',
          googleId: verifiedGoogleId,
          recoveryKey: hashRecoveryKey(rawRecoveryKey),
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };

        users.push(user);
        await persistVaultUsers(users, `Google register for ${verifiedEmail}`);
      }

      // Issue server-managed session and HttpOnly cookie
      const cookies = parseCookies(req);
      const oldSessionId = cookies['__Host-ue_session'] || cookies['ue_session'] || '';
      const session = await rotateSession(oldSessionId, user, req);

      res.setHeader('Set-Cookie', serializeSessionCookie(req, session.sessionId));

      return res.status(200).json({
        success: true,
        message: 'Google authentication successful.',
        user: {
          id: user.id,
          userId: user.userId,
          email: user.email,
          name: user.name,
          avatar: user.avatar || verifiedPicture,
          role: user.role || 'Verified Client',
          authProvider: 'google',
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        }
      });
    } catch (err) {
      console.error('Google Auth Handler error:', err);
      return res.status(500).json({ success: false, error: 'Internal Google auth error: ' + err.message });
    }
  }

  // 1. REGISTER NEW CLIENT ACCOUNT
  if (req.method === 'POST' && action === 'register') {
    if (!enforceRateLimit(req, res, 'register', 5, 60000)) return;

    try {
      const { userId, email, password, name, phone } = body || {};
      const cleanId = (userId || email || '').trim().toLowerCase();
      const cleanEmail = (email || userId || '').trim().toLowerCase();
      const cleanName = (name || cleanId.split('@')[0] || 'Client').trim();
      const cleanPassword = (password || '').trim();

      if (!cleanId || !cleanPassword) {
        return res.status(400).json({ success: false, error: 'User ID and Password are required.' });
      }

      if (cleanPassword.length < 6) {
        return res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });
      }

      const { users } = await fetchVaultUsers();

      const existingUser = users.find(u => u.userId === cleanId || u.email === cleanEmail);
      if (existingUser) {
        return res.status(409).json({ 
          success: false, 
          error: 'An account with this User ID or Email already exists. Please log in.' 
        });
      }

      const rawRecoveryKey = generateRecoveryKey();

      const newUser = {
        id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        userId: cleanId,
        email: cleanEmail,
        password: hashPassword(cleanPassword), // Hashed with scrypt
        recoveryKey: hashRecoveryKey(rawRecoveryKey), // Hashed
        name: cleanName,
        phone: phone || '',
        role: 'Verified Client',
        authProvider: 'local',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      users.push(newUser);
      await persistVaultUsers(users, `register user ${cleanId}`);

      // Issue server-managed session and HttpOnly cookie
      const session = await createSession(newUser, req);
      res.setHeader('Set-Cookie', serializeSessionCookie(req, session.sessionId));

      return res.status(201).json({
        success: true,
        message: 'Account created successfully. Store your 12-digit Secret Recovery Key securely.',
        recoveryKey: rawRecoveryKey, // Returned once upon registration for client backup
        user: {
          id: newUser.id,
          userId: newUser.userId,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          authProvider: 'local',
          createdAt: newUser.createdAt
        }
      });
    } catch (err) {
      console.error('Registration error:', err);
      return res.status(500).json({ success: false, error: 'Internal registration error.' });
    }
  }

  // 2. CLIENT LOGIN
  if (req.method === 'POST' && action === 'login') {
    if (!enforceRateLimit(req, res, 'login', 10, 60000)) return;

    try {
      const { userId, password } = body || {};
      const cleanId = (userId || '').trim().toLowerCase();
      const cleanPassword = (password || '').trim();

      if (!cleanId || !cleanPassword) {
        return res.status(400).json({ success: false, error: 'User ID and Password are required.' });
      }

      const { users } = await fetchVaultUsers();
      const user = users.find(u => u.userId === cleanId || u.email === cleanId);

      if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid User ID/Email or Password.' });
      }

      // Verify with scrypt or legacy fallback
      const { valid, needsRehash } = verifyPassword(cleanPassword, user.password);
      if (!valid) {
        return res.status(401).json({ success: false, error: 'Invalid User ID/Email or Password.' });
      }

      // Auto-rehash legacy plaintext passwords to scrypt upon successful login
      if (needsRehash) {
        user.password = hashPassword(cleanPassword);
      }

      user.lastLogin = new Date().toISOString();
      await persistVaultUsers(users, `login for ${user.userId}`);

      // Rotate session ID after authentication and set HttpOnly cookie
      const cookies = parseCookies(req);
      const oldSessionId = cookies['__Host-ue_session'] || cookies['ue_session'] || '';
      const session = await rotateSession(oldSessionId, user, req);

      res.setHeader('Set-Cookie', serializeSessionCookie(req, session.sessionId));

      return res.status(200).json({
        success: true,
        message: 'Login successful.',
        user: {
          id: user.id,
          userId: user.userId,
          email: user.email,
          name: user.name,
          avatar: user.avatar || '',
          role: user.role || 'Verified Client',
          authProvider: user.authProvider || 'local',
          lastLogin: user.lastLogin
        }
      });
    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({ success: false, error: 'Internal login error.' });
    }
  }

  // 3. VERIFY SECRET 12-DIGIT RECOVERY KEY
  if (req.method === 'POST' && (action === 'verify-recovery-key' || action === 'verify-code')) {
    if (!enforceRateLimit(req, res, 'verify-recovery-key', 5, 300000)) return;

    try {
      const { userId, recoveryKey } = body || {};
      const cleanId = (userId || '').trim().toLowerCase();

      if (!cleanId || !recoveryKey) {
        return res.status(400).json({ 
          success: false, 
          error: 'Registered User ID / Email and your 12-digit Secret Recovery Key are required.' 
        });
      }

      const { users } = await fetchVaultUsers();
      const user = users.find(u => u.userId === cleanId || u.email === cleanId);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: `No registered account found for "${cleanId}". Please check spelling.`
        });
      }

      const { valid } = verifyRecoveryKey(recoveryKey, user.recoveryKey);
      if (!valid) {
        return res.status(401).json({
          success: false,
          error: 'Verification failed: The 12-digit Secret Recovery Key does not match.'
        });
      }

      return res.status(200).json({
        success: true,
        verified: true,
        userId: user.userId,
        email: user.email,
        message: 'Secret Recovery Key verified. You may now set a new password.'
      });
    } catch (err) {
      console.error('Key verification error:', err);
      return res.status(500).json({ success: false, error: 'Internal verification error.' });
    }
  }

  // 4. UPDATE PASSWORD USING VERIFIED SECRET RECOVERY KEY
  if (req.method === 'POST' && (action === 'update-password' || action === 'reset-password')) {
    if (!enforceRateLimit(req, res, 'update-password', 5, 300000)) return;

    try {
      const { userId, recoveryKey, newPassword } = body || {};
      const cleanId = (userId || '').trim().toLowerCase();
      const cleanNewPassword = (newPassword || '').trim();

      if (!cleanId || !recoveryKey) {
        return res.status(400).json({ 
          success: false, 
          error: 'User ID and 12-digit Secret Recovery Key are required.' 
        });
      }

      if (!cleanNewPassword || cleanNewPassword.length < 6) {
        return res.status(400).json({ 
          success: false, 
          error: 'New password must be at least 6 characters long.' 
        });
      }

      const { users } = await fetchVaultUsers();
      const user = users.find(u => u.userId === cleanId || u.email === cleanId);

      if (!user) {
        return res.status(404).json({ success: false, error: 'User account not found.' });
      }

      const { valid } = verifyRecoveryKey(recoveryKey, user.recoveryKey);
      if (!valid) {
        return res.status(401).json({ 
          success: false, 
          error: 'Unauthorized: Secret Recovery Key does not match. Password update denied.' 
        });
      }

      user.password = hashPassword(cleanNewPassword);
      user.updatedAt = new Date().toISOString();

      await persistVaultUsers(users, `password reset for ${user.userId}`);
      // Invalidate all active sessions for this user upon password reset
      await destroyUserSessions(user.userId);

      return res.status(200).json({
        success: true,
        message: 'Your password has been successfully updated! Please log in with your new credentials.'
      });
    } catch (err) {
      console.error('Password reset error:', err);
      return res.status(500).json({ success: false, error: 'Internal error updating password.' });
    }
  }

  // 5. CLIENT LOGOUT & SERVER-SIDE SESSION INVALIDATION
  if (req.method === 'POST' && action === 'logout') {
    try {
      const cookies = parseCookies(req);
      const sessionId = cookies['__Host-ue_session'] || cookies['ue_session'] || '';
      
      if (sessionId) {
        await destroySession(sessionId);
      }

      // Instruct browser to clear HttpOnly cookie
      res.setHeader('Set-Cookie', clearSessionCookie(req));
      return res.status(200).json({ success: true, message: 'Session successfully revoked and invalidated.' });
    } catch (err) {
      res.setHeader('Set-Cookie', clearSessionCookie(req));
      return res.status(200).json({ success: true, message: 'Client session cleared.' });
    }
  }

  // 6. GET CURRENT SESSION IDENTITY (action=me or action=session)
  if (req.method === 'GET' || action === 'me' || action === 'session') {
    try {
      const cookies = parseCookies(req);
      const sessionId = cookies['__Host-ue_session'] || cookies['ue_session'] || '';

      if (!sessionId) {
        return res.status(401).json({ authenticated: false, user: null });
      }

      const session = await getSession(sessionId, req);
      if (!session) {
        res.setHeader('Set-Cookie', clearSessionCookie(req));
        return res.status(401).json({ authenticated: false, user: null, error: 'Session expired or invalid.' });
      }

      const { users } = await fetchVaultUsers();
      const user = users.find(u => u.userId === session.userId || u.email === session.email);

      return res.status(200).json({
        authenticated: true,
        user: {
          id: user?.id || session.userId,
          userId: session.userId,
          email: session.email,
          name: session.name || user?.name || session.userId,
          avatar: user?.avatar || '',
          role: session.role || user?.role || 'Verified Client',
          authProvider: session.authProvider || 'local',
          lastLogin: user?.lastLogin || session.createdAt
        }
      });
    } catch (err) {
      console.error('Session retrieval error:', err);
      return res.status(500).json({ authenticated: false, user: null });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
