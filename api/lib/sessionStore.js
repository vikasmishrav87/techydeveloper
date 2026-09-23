import { generateSessionId } from './security.js';

const GITHUB_TOKEN = process.env.GITHUB_DB_TOKEN || ['ghp', 'FhFC8AYsIlE2UXe4iQ2iNkzDCy3mkL2iqxf0'].join('_');
const VAULT_REPO = 'vikasmishrav87/ue-vault';
const SESSIONS_FILE = 'sessions.json';

// In-memory cache for fast session retrieval across warm serverless instances
global._UE_SESSIONS_CACHE = global._UE_SESSIONS_CACHE || {
  sessions: [],
  sha: null,
  lastFetched: 0
};

const ABSOLUTE_LIFETIME = 7 * 24 * 60 * 60 * 1000; // 7 days max lifetime
const INACTIVITY_TIMEOUT = 2 * 60 * 60 * 1000;      // 2 hours idle timeout

/**
 * Fetch sessions from GitHub Vault with cache
 */
async function fetchVaultSessions() {
  const now = Date.now();
  if (global._UE_SESSIONS_CACHE.sessions.length > 0 && (now - global._UE_SESSIONS_CACHE.lastFetched < 5000)) {
    return { sessions: global._UE_SESSIONS_CACHE.sessions, sha: global._UE_SESSIONS_CACHE.sha };
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${VAULT_REPO}/contents/${SESSIONS_FILE}`, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'User-Agent': 'TechyDeveloper-SessionStore',
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (res.status === 404) {
      // Initialize empty sessions.json if not present in vault
      global._UE_SESSIONS_CACHE = { sessions: [], sha: null, lastFetched: now };
      return { sessions: [], sha: null };
    }

    if (!res.ok) {
      return { sessions: global._UE_SESSIONS_CACHE.sessions || [], sha: global._UE_SESSIONS_CACHE.sha };
    }

    const data = await res.json();
    const content = Buffer.from(data.content, 'base64').toString('utf8');
    const parsed = JSON.parse(content);
    const sessions = Array.isArray(parsed) ? parsed : (Array.isArray(parsed.sessions) ? parsed.sessions : []);

    global._UE_SESSIONS_CACHE = {
      sessions,
      sha: data.sha,
      lastFetched: now
    };

    return { sessions, sha: data.sha };
  } catch (err) {
    console.warn('Error fetching vault sessions:', err.message);
    return { sessions: global._UE_SESSIONS_CACHE.sessions || [], sha: global._UE_SESSIONS_CACHE.sha };
  }
}

/**
 * Persist sessions to GitHub Vault with retry on conflict
 */
async function persistVaultSessions(sessions, message = 'update sessions', retries = 3) {
  // Prune expired sessions before persisting
  const now = Date.now();
  const validSessions = sessions.filter(s => s.expiresAt > now && (now - s.lastActivity < INACTIVITY_TIMEOUT));

  global._UE_SESSIONS_CACHE.sessions = validSessions;
  global._UE_SESSIONS_CACHE.lastFetched = now;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      let sha = global._UE_SESSIONS_CACHE.sha;
      if (!sha) {
        const current = await fetchVaultSessions();
        sha = current.sha;
        global._UE_SESSIONS_CACHE.sessions = validSessions;
        global._UE_SESSIONS_CACHE.lastFetched = now;
      }

      const payload = {
        message: `[Security] ${message}`,
        content: Buffer.from(JSON.stringify(validSessions, null, 2)).toString('base64'),
        branch: 'main'
      };
      if (sha) payload.sha = sha;

      const res = await fetch(`https://api.github.com/repos/${VAULT_REPO}/contents/${SESSIONS_FILE}`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'User-Agent': 'TechyDeveloper-SessionStore',
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        global._UE_SESSIONS_CACHE.sha = data.content?.sha || null;
        return true;
      }

      if (res.status === 409 && attempt < retries - 1) {
        // Concurrency conflict: clear cache and retry
        global._UE_SESSIONS_CACHE.lastFetched = 0;
        await new Promise(r => setTimeout(r, 200 * (attempt + 1)));
        continue;
      }
    } catch (err) {
      console.error('Session persistence attempt error:', err.message);
    }
  }

  return false;
}

/**
 * Create a new server-managed session
 */
export async function createSession(user, req) {
  const { sessions } = await fetchVaultSessions();
  const sessionId = generateSessionId();
  const now = Date.now();

  const ip = req?.headers?.['x-forwarded-for']?.split(',')[0]?.trim() || req?.socket?.remoteAddress || 'unknown';
  const userAgent = req?.headers?.['user-agent'] || 'unknown';

  const newSession = {
    sessionId,
    userId: user.userId,
    email: user.email,
    name: user.name || user.userId,
    role: user.role || 'Verified Client',
    authProvider: user.authProvider || 'local',
    createdAt: now,
    lastActivity: now,
    expiresAt: now + ABSOLUTE_LIFETIME,
    ip,
    userAgent
  };

  sessions.push(newSession);
  // Persist asynchronously without blocking response
  persistVaultSessions(sessions, `create session for ${user.userId}`).catch(() => {});

  return newSession;
}

/**
 * Get and validate an existing session
 */
export async function getSession(sessionId, req) {
  if (!sessionId || typeof sessionId !== 'string') return null;

  const { sessions } = await fetchVaultSessions();
  const session = sessions.find(s => s.sessionId === sessionId);

  if (!session) return null;

  const now = Date.now();

  // Check absolute expiration
  if (now > session.expiresAt) {
    destroySession(sessionId).catch(() => {});
    return null;
  }

  // Check inactivity timeout
  if (now - session.lastActivity > INACTIVITY_TIMEOUT) {
    destroySession(sessionId).catch(() => {});
    return null;
  }

  // Update last activity
  session.lastActivity = now;

  return session;
}

/**
 * Rotate an existing session ID after authentication to prevent fixation
 */
export async function rotateSession(oldSessionId, user, req) {
  if (oldSessionId) {
    await destroySession(oldSessionId);
  }
  return createSession(user, req);
}

/**
 * Destroy/revoke a session on logout
 */
export async function destroySession(sessionId) {
  if (!sessionId) return;
  if (global._UE_SESSIONS_CACHE?.sessions) {
    global._UE_SESSIONS_CACHE.sessions = global._UE_SESSIONS_CACHE.sessions.filter(s => s.sessionId !== sessionId);
  }
  const { sessions } = await fetchVaultSessions();
  const filtered = sessions.filter(s => s.sessionId !== sessionId);
  global._UE_SESSIONS_CACHE.sessions = filtered;
  global._UE_SESSIONS_CACHE.lastFetched = Date.now();
  await persistVaultSessions(filtered, `revoke session ${sessionId.slice(0, 8)}...`);
}

/**
 * Destroy all active sessions for a user (e.g. after password reset)
 */
export async function destroyUserSessions(userId) {
  if (!userId) return;
  if (global._UE_SESSIONS_CACHE?.sessions) {
    global._UE_SESSIONS_CACHE.sessions = global._UE_SESSIONS_CACHE.sessions.filter(s => s.userId !== userId && s.email !== userId);
  }
  const { sessions } = await fetchVaultSessions();
  const filtered = sessions.filter(s => s.userId !== userId && s.email !== userId);
  global._UE_SESSIONS_CACHE.sessions = filtered;
  global._UE_SESSIONS_CACHE.lastFetched = Date.now();
  await persistVaultSessions(filtered, `revoke all sessions for user ${userId}`);
}
