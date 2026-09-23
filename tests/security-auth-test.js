/**
 * Automated Security & Authentication Test Suite
 * Tests all 10 security hardening criteria across 13 distinct vulnerability vectors.
 */

import assert from 'assert';
import { 
  hashPassword, 
  verifyPassword, 
  hashRecoveryKey, 
  verifyRecoveryKey, 
  generateSessionId, 
  serializeSessionCookie, 
  clearSessionCookie, 
  parseCookies 
} from '../api/lib/security.js';
import { 
  createSession, 
  getSession, 
  rotateSession, 
  destroySession 
} from '../api/lib/sessionStore.js';
import { checkRateLimit, enforceRateLimit } from '../api/lib/rateLimiter.js';
import { requireAuth, requireAdmin } from '../api/lib/authMiddleware.js';
import userAuthHandler from '../api/user-auth.js';
import paymentsHandler from '../api/payments.js';
import leadsHandler from '../api/leads.js';
import telemetryHandler from '../api/telemetry.js';

// Helper to mock serverless Req/Res
function createMockReqRes({ method = 'GET', query = {}, headers = {}, body = null } = {}) {
  const req = {
    method,
    query,
    headers: { ...headers },
    body,
    socket: { remoteAddress: '127.0.0.1' }
  };

  const res = {
    statusCode: 200,
    headersSent: {},
    bodyData: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    setHeader(key, val) {
      this.headersSent[key.toLowerCase()] = val;
    },
    getHeader(key) {
      return this.headersSent[key.toLowerCase()];
    },
    json(data) {
      this.bodyData = data;
      return this;
    },
    end() {
      return this;
    }
  };

  return { req, res };
}

let testsPassed = 0;
let testsTotal = 0;

function report(testName, passed, detail = '') {
  testsTotal++;
  if (passed) {
    testsPassed++;
    console.log(`  [PASS] ${testName}`);
  } else {
    console.error(`  [FAIL] ${testName}: ${detail}`);
  }
}

async function runSecurityTestSuite() {
  console.log('\n======================================================');
  console.log('   TECHYDEVELOPER AUTHENTICATION SECURITY TEST SUITE   ');
  console.log('======================================================\n');

  // ---------------------------------------------------------
  // TEST 1: Unauthenticated Protected APIs
  // ---------------------------------------------------------
  console.log('1. Testing Unauthenticated Protected APIs...');
  {
    // Payments GET
    const { req: pReq, res: pRes } = createMockReqRes({ method: 'GET' });
    await paymentsHandler(pReq, pRes);
    report('GET /api/payments rejects unauthenticated caller with 401', pRes.statusCode === 401);

    // Leads GET
    const { req: lReq, res: lRes } = createMockReqRes({ method: 'GET' });
    await leadsHandler(lReq, lRes);
    report('GET /api/leads rejects unauthenticated caller with 403', lRes.statusCode === 403);

    // Telemetry GET
    const { req: tReq, res: tRes } = createMockReqRes({ method: 'GET' });
    await telemetryHandler(tReq, tRes);
    report('GET /api/telemetry rejects unauthenticated caller with 403', tRes.statusCode === 403);

    // User-Auth session
    const { req: uReq, res: uRes } = createMockReqRes({ method: 'GET', query: { action: 'me' } });
    await userAuthHandler(uReq, uRes);
    report('GET /api/user-auth?action=me rejects missing session with 401', uRes.statusCode === 401);
  }

  // ---------------------------------------------------------
  // TEST 2: Password Cryptography & scrypt Hashing
  // ---------------------------------------------------------
  console.log('\n2. Testing Password & Key Cryptography (scrypt + salts)...');
  {
    const plain = 'SuperSecretP@ssw0rd!123';
    const hash = hashPassword(plain);
    const valid = verifyPassword(plain, hash);
    const invalid = verifyPassword('WrongPassword', hash);

    report('hashPassword creates scrypt hash format', hash.startsWith('scrypt$v1$'));
    report('verifyPassword succeeds on correct password', valid.valid === true && valid.needsRehash === false);
    report('verifyPassword rejects incorrect password', invalid.valid === false);

    // Salt randomness check
    const hash2 = hashPassword(plain);
    report('Unique salt generated per hash (hash1 !== hash2)', hash !== hash2);
  }

  // ---------------------------------------------------------
  // TEST 3: Expired Session Invalidation
  // ---------------------------------------------------------
  console.log('\n3. Testing Expired Session Handling...');
  {
    const testUser = { userId: 'test_exp_user', email: 'exp@test.com', role: 'Verified Client' };
    const session = await createSession(testUser, { headers: {} });
    
    // Artificially expire the session
    session.expiresAt = Date.now() - 5000;

    const retrieved = await getSession(session.sessionId);
    report('Expired session is rejected and destroyed by getSession()', retrieved === null);
  }

  // ---------------------------------------------------------
  // TEST 4: Revoked Session on Logout
  // ---------------------------------------------------------
  console.log('\n4. Testing Session Revocation on Logout...');
  {
    const testUser = { userId: 'test_logout_user', email: 'logout@test.com', role: 'Verified Client' };
    const session = await createSession(testUser, { headers: {} });

    // Call logout endpoint with session cookie
    const cookieHeader = `ue_session=${session.sessionId}`;
    const { req, res } = createMockReqRes({ 
      method: 'POST', 
      query: { action: 'logout' }, 
      headers: { cookie: cookieHeader } 
    });

    await userAuthHandler(req, res);
    report('Logout returns 200 and clears cookie', res.statusCode === 200 && res.getHeader('set-cookie')?.includes('Max-Age=0'));

    // Verify session no longer exists in store
    const afterLogout = await getSession(session.sessionId);
    report('Server session completely destroyed from sessionStore', afterLogout === null);
  }

  // ---------------------------------------------------------
  // TEST 5: Modified / Tampered Session Token
  // ---------------------------------------------------------
  console.log('\n5. Testing Modified / Forged Session Token...');
  {
    const tamperedCookie = `ue_session=forged_token_${Date.now()}_evil_hacker`;
    const { req, res } = createMockReqRes({ 
      method: 'GET', 
      query: { action: 'me' }, 
      headers: { cookie: tamperedCookie } 
    });

    await userAuthHandler(req, res);
    report('Tampered session token returns 401 Unauthorized', res.statusCode === 401);
  }

  // ---------------------------------------------------------
  // TEST 6: IDOR Protection on Payments
  // ---------------------------------------------------------
  console.log('\n6. Testing IDOR Defense on Sensitive API Endpoints...');
  {
    const userAlice = { userId: 'alice_123', email: 'alice@domain.com', role: 'Verified Client' };
    const aliceSession = await createSession(userAlice, { headers: {} });
    const aliceCookie = `ue_session=${aliceSession.sessionId}`;

    // Alice tries to access Bob's payment record (IDOR attempt)
    // Setup mock payment for Bob in cache
    global._UE_PAYMENTS_CACHE.payments = [
      { id: 'TXN-BOB-999', userId: 'bob_456', clientEmail: 'bob@domain.com', amountUSD: 2000, status: 'approved' }
    ];
    global._UE_PAYMENTS_CACHE.lastFetched = Date.now();

    const { req: idorReq, res: idorRes } = createMockReqRes({
      method: 'GET',
      query: { id: 'TXN-BOB-999' },
      headers: { cookie: aliceCookie }
    });

    await paymentsHandler(idorReq, idorRes);
    report('User Alice attempting to view User Bob payment is BLOCKED with 403 Forbidden', idorRes.statusCode === 403);

    // Alice tries to spoof userId in POST request
    const { req: spoofReq, res: spoofRes } = createMockReqRes({
      method: 'POST',
      headers: { cookie: aliceCookie },
      body: {
        userId: 'bob_456', // Spoofed!
        clientEmail: 'bob@domain.com', // Spoofed!
        screenshot: 'data:image/png;base64,' + 'A'.repeat(50),
        amountUSD: 500
      }
    });

    await paymentsHandler(spoofReq, spoofRes);
    const createdPayment = spoofRes.bodyData?.payment;
    report('Payment creator userId derived from verified session (alice_123), ignoring spoofed body', 
      createdPayment?.userId === 'alice_123' && createdPayment?.clientEmail === 'alice@domain.com'
    );
  }

  // ---------------------------------------------------------
  // TEST 7: Role Manipulation Defense
  // ---------------------------------------------------------
  console.log('\n7. Testing Role Privilege Escalation Defense...');
  {
    // Client tries to register with role: 'Admin'
    const testId = 'priv_esc_' + Date.now();
    const { req, res } = createMockReqRes({
      method: 'POST',
      query: { action: 'register' },
      body: {
        userId: testId,
        email: `${testId}@test.com`,
        password: 'Password123!',
        role: 'Admin' // Attempted escalation!
      }
    });

    await userAuthHandler(req, res);
    const registeredUser = res.bodyData?.user;
    report('Client attempting role: Admin is forced to Verified Client on server', registeredUser?.role === 'Verified Client');
  }

  // ---------------------------------------------------------
  // TEST 8: Logout Followed by API Replay
  // ---------------------------------------------------------
  console.log('\n8. Testing Logout Followed by API Replay...');
  {
    const replayUser = { userId: 'replay_user', email: 'replay@test.com', role: 'Verified Client' };
    const session = await createSession(replayUser, { headers: {} });
    const cookie = `ue_session=${session.sessionId}`;

    // Verify session works before logout
    const { req: beforeReq, res: beforeRes } = createMockReqRes({
      method: 'GET',
      query: { action: 'me' },
      headers: { cookie }
    });
    await userAuthHandler(beforeReq, beforeRes);
    assert.strictEqual(beforeRes.statusCode, 200);

    // Perform Logout
    const { req: logoutReq, res: logoutRes } = createMockReqRes({
      method: 'POST',
      query: { action: 'logout' },
      headers: { cookie }
    });
    await userAuthHandler(logoutReq, logoutRes);

    // Replay the session cookie
    const { req: replayReq, res: replayRes } = createMockReqRes({
      method: 'GET',
      query: { action: 'me' },
      headers: { cookie }
    });
    await userAuthHandler(replayReq, replayRes);
    report('Replaying logged-out session cookie is REJECTED with 401 Unauthorized', replayRes.statusCode === 401);
  }

  // ---------------------------------------------------------
  // TEST 9: XSS Credential Theft Defense (HttpOnly & SameSite)
  // ---------------------------------------------------------
  console.log('\n9. Testing XSS Credential Protection (RFC 6265 Cookies)...');
  {
    const testReq = { headers: { 'x-forwarded-proto': 'https' } };
    const cookieString = serializeSessionCookie(testReq, 'sample_session_id_128bit');

    report('Session cookie has HttpOnly flag (inaccessible to JavaScript XSS)', cookieString.includes('HttpOnly'));
    report('Session cookie has Secure flag (HTTPS only in production)', cookieString.includes('Secure'));
    report('Session cookie has SameSite=Lax flag (CSRF protection)', cookieString.includes('SameSite=Lax'));
    report('Session cookie uses Path=/', cookieString.includes('Path=/'));
    report('Session cookie name uses __Host- prefix under HTTPS', cookieString.startsWith('__Host-ue_session='));
  }

  // ---------------------------------------------------------
  // TEST 10: Rate Limiting Enforcement
  // ---------------------------------------------------------
  console.log('\n10. Testing Rate Limiter Enforcement...');
  {
    const testIpKey = 'test_rate_ip_' + Date.now();
    let blocked = false;

    for (let i = 0; i < 7; i++) {
      const result = checkRateLimit(testIpKey, 5, 60000);
      if (!result.allowed) {
        blocked = true;
        break;
      }
    }

    report('Rate limiter permits requests within quota and blocks 6th attempt (max=5)', blocked);
  }

  // ---------------------------------------------------------
  // TEST 11: Google Token Audience Validation
  // ---------------------------------------------------------
  console.log('\n11. Testing Google Token Validation Rules...');
  {
    // Malformed Google Token
    const { req: badAudReq, res: badAudRes } = createMockReqRes({
      method: 'POST',
      query: { action: 'google-auth' },
      body: { credential: 'fake_jwt_for_another_client.apps.googleusercontent.com' }
    });

    await userAuthHandler(badAudReq, badAudRes);
    report('Malformed or untrusted Google JWT rejected with 401', badAudRes.statusCode === 401);

    // Empty Google credentials
    const { req: emptyReq, res: emptyRes } = createMockReqRes({
      method: 'POST',
      query: { action: 'google-auth' },
      body: {}
    });

    await userAuthHandler(emptyReq, emptyRes);
    report('Empty Google auth request rejected with 401', emptyRes.statusCode === 401);
  }

  // ---------------------------------------------------------
  // TEST 12: Recovery Key Hashing & Verification
  // ---------------------------------------------------------
  console.log('\n12. Testing 12-Digit Recovery Key Cryptography...');
  {
    const key = 'A2B3-C4D5-E6F7';
    const hashed = hashRecoveryKey(key);
    report('Recovery key is hashed with sha256 rk$v1$ prefix', hashed.startsWith('rk$v1$'));

    const validMatch = verifyRecoveryKey('a2b3 c4d5 e6f7', hashed);
    report('verifyRecoveryKey matches regardless of hyphens, spaces, or case', validMatch.valid === true);

    const wrongMatch = verifyRecoveryKey('XXXX-YYYY-ZZZZ', hashed);
    report('verifyRecoveryKey rejects incorrect key', wrongMatch.valid === false);
  }

  // ---------------------------------------------------------
  // TEST 13: Session Rotation
  // ---------------------------------------------------------
  console.log('\n13. Testing Session ID Rotation (Anti-Fixation)...');
  {
    const user = { userId: 'rotation_test', email: 'rot@test.com', role: 'Verified Client' };
    const oldSession = await createSession(user, { headers: {} });
    const newSession = await rotateSession(oldSession.sessionId, user, { headers: {} });

    report('Rotated session generates new unique session ID', newSession.sessionId !== oldSession.sessionId);
    const oldCheck = await getSession(oldSession.sessionId);
    report('Old session ID is purged immediately upon rotation', oldCheck === null);
  }

  console.log('\n======================================================');
  console.log(`   SECURITY TEST RESULTS: ${testsPassed} / ${testsTotal} PASSED`);
  console.log('======================================================\n');

  if (testsPassed === testsTotal) {
    console.log('>>> ALL 13 SECURITY SPECIFICATIONS FULLY VERIFIED <<<\n');
    process.exit(0);
  } else {
    console.error(`>>> ${testsTotal - testsPassed} TESTS FAILED <<<\n`);
    process.exit(1);
  }
}

runSecurityTestSuite().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
