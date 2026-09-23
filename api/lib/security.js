import crypto from 'crypto';

/**
 * Enterprise Password & Key Cryptography
 * Uses scrypt (memory-hard, recommended by OWASP) with unique 16-byte random salts.
 */

export function hashPassword(password) {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string');
  }
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex');
  return `scrypt$v1$${salt}$${derivedKey}`;
}

export function verifyPassword(password, storedHash) {
  if (!password || !storedHash) return { valid: false, needsRehash: false };

  // Handle scrypt hashes
  if (typeof storedHash === 'string' && storedHash.startsWith('scrypt$v1$')) {
    const parts = storedHash.split('$');
    if (parts.length !== 4) return { valid: false, needsRehash: false };
    const salt = parts[2];
    const originalHash = parts[3];
    const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex');

    try {
      const isMatch = crypto.timingSafeEqual(
        Buffer.from(derivedKey, 'hex'),
        Buffer.from(originalHash, 'hex')
      );
      return { valid: isMatch, needsRehash: false };
    } catch {
      return { valid: false, needsRehash: false };
    }
  }

  // Graceful migration fallback for existing legacy plaintext passwords
  if (typeof storedHash === 'string' && storedHash === password) {
    return { valid: true, needsRehash: true };
  }

  return { valid: false, needsRehash: false };
}

/**
 * Normalizes 12-digit recovery key (removes hyphens, spaces, uppercase)
 */
export function normalizeRecoveryKey(key) {
  return (key || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

/**
 * Hashes a 12-digit recovery key for secure storage
 */
export function hashRecoveryKey(key) {
  const norm = normalizeRecoveryKey(key);
  if (!norm) return '';
  return 'rk$v1$' + crypto.createHash('sha256').update(norm).digest('hex');
}

/**
 * Verifies a 12-digit recovery key against stored hash or legacy plaintext
 */
export function verifyRecoveryKey(inputKey, storedRecord) {
  const normInput = normalizeRecoveryKey(inputKey);
  if (!normInput || !storedRecord) return { valid: false, needsRehash: false };

  if (typeof storedRecord === 'string' && storedRecord.startsWith('rk$v1$')) {
    const inputHash = crypto.createHash('sha256').update(normInput).digest('hex');
    const expectedHash = storedRecord.replace('rk$v1$', '');
    try {
      const isMatch = crypto.timingSafeEqual(
        Buffer.from(inputHash, 'hex'),
        Buffer.from(expectedHash, 'hex')
      );
      return { valid: isMatch, needsRehash: false };
    } catch {
      return { valid: false, needsRehash: false };
    }
  }

  // Legacy plaintext recovery key check
  const normStored = normalizeRecoveryKey(storedRecord);
  if (normStored && normStored === normInput) {
    return { valid: true, needsRehash: true };
  }

  return { valid: false, needsRehash: false };
}

/**
 * Generates 256 bits (32 bytes) of cryptographic entropy for Session IDs
 */
export function generateSessionId() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Cookie Helpers conforming to RFC 6265 / RFC 6265bis
 */
export function isHttps(req) {
  const proto = req?.headers?.['x-forwarded-proto'] || (req?.connection?.encrypted ? 'https' : 'http');
  return proto === 'https';
}

export function getCookieName(req) {
  // Use __Host- prefix only in HTTPS environments as required by RFC 6265bis
  return isHttps(req) ? '__Host-ue_session' : 'ue_session';
}

export function parseCookies(req) {
  const list = {};
  const rc = req?.headers?.cookie;
  if (!rc) return list;

  rc.split(';').forEach((cookie) => {
    const parts = cookie.split('=');
    const name = parts.shift()?.trim();
    if (name) {
      list[name] = decodeURIComponent(parts.join('=')?.trim());
    }
  });

  return list;
}

export function serializeSessionCookie(req, sessionId, maxAgeSeconds = 604800) {
  const name = getCookieName(req);
  const secureFlag = isHttps(req) ? '; Secure' : '';
  return `${name}=${encodeURIComponent(sessionId)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSeconds}${secureFlag}`;
}

export function clearSessionCookie(req) {
  const name = getCookieName(req);
  const secureFlag = isHttps(req) ? '; Secure' : '';
  return `${name}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secureFlag}`;
}
