import { parseCookies } from './security.js';
import { getSession } from './sessionStore.js';

const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'vikasmusickeytosuccess';

/**
 * Retrieve verified session from incoming request cookies
 */
export async function getAuthenticatedSession(req) {
  const cookies = parseCookies(req);
  const sessionId = cookies['__Host-ue_session'] || cookies['ue_session'] || '';

  if (!sessionId) return null;

  const session = await getSession(sessionId, req);
  return session || null;
}

/**
 * Middleware: Require active client authentication
 * Returns the verified session or sends a 401 response
 */
export async function requireAuth(req, res) {
  const session = await getAuthenticatedSession(req);
  if (!session) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized: A valid, active server session is required to access this resource.'
    });
    return null;
  }
  return session;
}

/**
 * Middleware: Require administrator privileges
 * Enforces role-based access control (RBAC) on the server side
 */
export async function requireAdmin(req, res) {
  // Check 1: Verified server session with Admin role
  const session = await getAuthenticatedSession(req);
  if (session && (session.role === 'Admin' || session.role === 'SuperAdmin')) {
    return { session, isAdmin: true };
  }

  // Check 2: Secure administrator header / key (for automated maintenance / CLI)
  const passcode = req?.headers?.['x-admin-passcode'] || req?.query?.passcode || '';
  if (passcode && passcode.trim() === ADMIN_SECRET) {
    return { session: null, isAdmin: true };
  }

  res.status(403).json({
    success: false,
    error: 'Forbidden: Administrative access required.'
  });
  return null;
}
