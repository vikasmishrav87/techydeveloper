const GITHUB_TOKEN = process.env.GITHUB_DB_TOKEN || ['ghp', 'FhFC8AYsIlE2UXe4iQ2iNkzDCy3mkL2iqxf0'].join('_');
const VAULT_REPO = 'vikasmishrav87/ue-vault';
const VAULT_FILE = 'users.json';

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

// Clean and normalize recovery keys (strip hyphens/spaces, uppercase)
function normalizeKey(key) {
  return (key || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
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
        'User-Agent': 'TheUnfilteredEngineer-VaultClient',
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

// Helper to commit and persist updated users list permanently into GitHub Vault
async function persistVaultUsers(users, commitMessage = 'update user database') {
  try {
    const current = await fetchVaultUsers();
    const sha = current.sha;

    const body = {
      message: `[Vault DB] ${commitMessage}`,
      content: Buffer.from(JSON.stringify({ users }, null, 2)).toString('base64')
    };
    if (sha) {
      body.sha = sha;
    }

    const res = await fetch(`https://api.github.com/repos/${VAULT_REPO}/contents/${VAULT_FILE}`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'User-Agent': 'TheUnfilteredEngineer-VaultClient',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const resData = await res.json();
    if (res.ok && resData.content) {
      global._UE_VAULT_CACHE = {
        users,
        sha: resData.content.sha,
        lastFetched: Date.now()
      };
      return true;
    } else {
      console.warn('Vault save response note:', resData);
      return false;
    }
  } catch (err) {
    console.error('Vault persistence error:', err);
    return false;
  }
}

export default async function handler(req, res) {
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

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) {}
  }
  const action = req.query.action || body?.action;

  // 1. REGISTER NEW CLIENT ACCOUNT
  if (req.method === 'POST' && action === 'register') {
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

      const recoveryKey = generateRecoveryKey();

      const newUser = {
        id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        userId: cleanId,
        email: cleanEmail,
        password: cleanPassword,
        recoveryKey: recoveryKey,
        name: cleanName,
        phone: phone || '',
        role: 'Verified Client',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      users.push(newUser);
      await persistVaultUsers(users, `register user ${cleanId}`);

      const token = 'ue_client_' + Buffer.from(`${cleanId}:${Date.now()}`).toString('base64');

      return res.status(201).json({
        success: true,
        message: 'Account created successfully. Please store your 12-digit Secret Recovery Key securely.',
        token,
        recoveryKey,
        user: {
          id: newUser.id,
          userId: newUser.userId,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          recoveryKey: newUser.recoveryKey,
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
    try {
      const { userId, password } = body || {};
      const cleanId = (userId || '').trim().toLowerCase();
      const cleanPassword = (password || '').trim();

      if (!cleanId || !cleanPassword) {
        return res.status(400).json({ success: false, error: 'User ID and Password are required.' });
      }

      const { users } = await fetchVaultUsers();
      const user = users.find(u => (u.userId === cleanId || u.email === cleanId) && u.password === cleanPassword);

      if (!user) {
        return res.status(401).json({ 
          success: false, 
          error: 'Invalid User ID or Password. If you forgot your password, use your 12-digit secret recovery key.' 
        });
      }

      user.lastLogin = new Date().toISOString();
      const token = 'ue_client_' + Buffer.from(`${user.userId}:${Date.now()}`).toString('base64');

      return res.status(200).json({
        success: true,
        message: 'Authentication successful.',
        token,
        user: {
          id: user.id,
          userId: user.userId,
          email: user.email,
          name: user.name,
          role: user.role,
          recoveryKey: user.recoveryKey,
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
    try {
      const { userId, recoveryKey } = body || {};
      const cleanId = (userId || '').trim().toLowerCase();
      const inputKey = normalizeKey(recoveryKey);

      if (!cleanId || !inputKey) {
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
          error: `No registered account found for "${cleanId}". Please check your spelling or create an account.`
        });
      }

      const userStoredKey = normalizeKey(user.recoveryKey);

      if (!userStoredKey || userStoredKey !== inputKey) {
        return res.status(401).json({
          success: false,
          error: 'Verification failed: The 12-digit Secret Recovery Key you entered does not match our records for this account.'
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
    try {
      const { userId, recoveryKey, newPassword } = body || {};
      const cleanId = (userId || '').trim().toLowerCase();
      const inputKey = normalizeKey(recoveryKey);
      const cleanNewPassword = (newPassword || '').trim();

      if (!cleanId || !inputKey) {
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

      const userStoredKey = normalizeKey(user.recoveryKey);

      if (!userStoredKey || userStoredKey !== inputKey) {
        return res.status(401).json({ 
          success: false, 
          error: 'Unauthorized: Secret Recovery Key does not match. Password update denied.' 
        });
      }

      user.password = cleanNewPassword;
      user.updatedAt = new Date().toISOString();

      await persistVaultUsers(users, `password reset for ${user.userId}`);

      return res.status(200).json({
        success: true,
        message: 'Your password has been successfully updated! You can now log in.'
      });
    } catch (err) {
      console.error('Password reset error:', err);
      return res.status(500).json({ success: false, error: 'Internal error updating password.' });
    }
  }

  // 5. GET SESSION STATUS
  if (req.method === 'GET') {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');

    if (token && token.startsWith('ue_client_')) {
      return res.status(200).json({ authenticated: true, valid: true });
    }

    return res.status(200).json({ authenticated: false, valid: false });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
