/**
 * Sliding Window Token Bucket In-Memory Rate Limiter
 * Designed for serverless environments with automatic window resets
 */

global._RATE_LIMIT_STORE = global._RATE_LIMIT_STORE || new Map();

export function getClientIp(req) {
  const forwarded = req?.headers?.['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req?.headers?.['x-real-ip'] || req?.socket?.remoteAddress || '127.0.0.1';
}

/**
 * Check rate limit for a given key
 * @param {string} key - Unique key (e.g., "auth:192.168.1.1")
 * @param {number} maxRequests - Max requests allowed in the window
 * @param {number} windowMs - Window duration in milliseconds
 * @returns {{ allowed: boolean, remaining: number, retryAfter: number }}
 */
export function checkRateLimit(key, maxRequests = 10, windowMs = 60000) {
  const now = Date.now();
  const store = global._RATE_LIMIT_STORE;

  // Cleanup old entries if map grows too large
  if (store.size > 5000) {
    for (const [k, data] of store.entries()) {
      if (now > data.resetAt) store.delete(k);
    }
  }

  const record = store.get(key);

  if (!record || now > record.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return {
      allowed: true,
      remaining: maxRequests - 1,
      retryAfter: 0
    };
  }

  if (record.count >= maxRequests) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfter: retryAfter > 0 ? retryAfter : 1
    };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: maxRequests - record.count,
    retryAfter: 0
  };
}

/**
 * Express / Vercel Serverless Rate Limit Middleware
 * Responds with HTTP 429 if limit exceeded
 */
export function enforceRateLimit(req, res, action = 'auth', maxRequests = 5, windowMs = 60000) {
  const ip = getClientIp(req);
  const key = `${action}:${ip}`;
  const result = checkRateLimit(key, maxRequests, windowMs);

  res.setHeader('X-RateLimit-Limit', maxRequests);
  res.setHeader('X-RateLimit-Remaining', result.remaining);

  if (!result.allowed) {
    res.setHeader('Retry-After', result.retryAfter);
    res.status(429).json({
      success: false,
      error: `Too many requests. Rate limit exceeded for ${action}. Please retry after ${result.retryAfter} seconds.`,
      retryAfter: result.retryAfter
    });
    return false;
  }

  return true;
}
