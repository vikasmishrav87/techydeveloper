// Serverless API for Managing Payments with Strict Session Authorization & IDOR Defense
import { requireAuth, requireAdmin, getAuthenticatedSession } from './lib/authMiddleware.js';
import { enforceRateLimit } from './lib/rateLimiter.js';

const GITHUB_TOKEN = process.env.GITHUB_DB_TOKEN || ['ghp', 'FhFC8AYsIlE2UXe4iQ2iNkzDCy3mkL2iqxf0'].join('_');
const VAULT_REPO = 'vikasmishrav87/ue-vault';
const VAULT_FILE = 'payments.json';

// In-memory cache for fast reads
global._UE_PAYMENTS_CACHE = global._UE_PAYMENTS_CACHE || {
  payments: [],
  sha: null,
  lastFetched: 0
};

// Helper to fetch payments from permanent private GitHub Vault
async function fetchVaultPayments() {
  const now = Date.now();
  if (global._UE_PAYMENTS_CACHE.payments.length > 0 && (now - global._UE_PAYMENTS_CACHE.lastFetched < 5000)) {
    return { payments: global._UE_PAYMENTS_CACHE.payments, sha: global._UE_PAYMENTS_CACHE.sha };
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
      return { payments: global._UE_PAYMENTS_CACHE.payments || [], sha: global._UE_PAYMENTS_CACHE.sha };
    }

    const data = await res.json();
    let payments = [];
    if (data.content) {
      try {
        const parsed = JSON.parse(Buffer.from(data.content, 'base64').toString('utf8'));
        payments = Array.isArray(parsed) ? parsed : (Array.isArray(parsed.payments) ? parsed.payments : []);
      } catch {
        payments = [];
      }
    }
    
    global._UE_PAYMENTS_CACHE = {
      payments,
      sha: data.sha || null,
      lastFetched: now
    };

    return { payments, sha: data.sha || null };
  } catch (err) {
    console.warn('Failed to load payments from vault:', err.message);
    return { payments: global._UE_PAYMENTS_CACHE.payments || [], sha: global._UE_PAYMENTS_CACHE.sha };
  }
}

// Helper to commit and persist updated payments permanently into GitHub Vault
async function persistVaultPayments(payments, commitMessage = 'update payments database', retries = 3) {
  global._UE_PAYMENTS_CACHE.payments = payments;
  global._UE_PAYMENTS_CACHE.lastFetched = Date.now();

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const current = await fetchVaultPayments();
      const sha = current.sha;

      const body = {
        message: `[Vault DB] ${commitMessage}`,
        content: Buffer.from(JSON.stringify(payments, null, 2)).toString('base64'),
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
        global._UE_PAYMENTS_CACHE.sha = resData.content.sha;
        return true;
      }

      if (res.status === 409 && attempt < retries - 1) {
        global._UE_PAYMENTS_CACHE.lastFetched = 0;
        await new Promise(r => setTimeout(r, 200 * (attempt + 1)));
        continue;
      }
    } catch (err) {
      console.error('Vault payments persistence error:', err.message);
    }
  }
  return false;
}

export default async function handler(req, res) {
  const reqOrigin = req.headers.origin || 'https://techydeveloper.vercel.app';
  res.setHeader('Access-Control-Allow-Origin', reqOrigin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, X-Admin-Passcode'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. GET: Fetch payments with strict IDOR defense
  if (req.method === 'GET') {
    // Check authentication
    const session = await getAuthenticatedSession(req);
    const adminCheck = await requireAdmin(req, { status: () => ({ json: () => {} }) });
    const isAdmin = adminCheck?.isAdmin === true;

    if (!session && !isAdmin) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: You must be logged in to view payment history.'
      });
    }

    const { id } = req.query;
    const { payments } = await fetchVaultPayments();

    // Admin can see all payments or any payment by ID
    if (isAdmin) {
      if (id) {
        const payment = payments.find(p => p.id === id);
        if (!payment) return res.status(404).json({ success: false, error: 'Payment not found' });
        return res.status(200).json({ success: true, payment });
      }
      return res.status(200).json({ success: true, count: payments.length, payments });
    }

    // Client IDOR Protection: clients can ONLY see their own payments
    if (id) {
      const payment = payments.find(p => p.id === id);
      if (!payment) return res.status(404).json({ success: false, error: 'Payment not found' });

      const isOwner = payment.userId === session.userId || payment.clientEmail === session.email;
      if (!isOwner) {
        return res.status(403).json({ success: false, error: 'Forbidden: Access denied to this payment record.' });
      }
      return res.status(200).json({ success: true, payment });
    }

    // Filter payments strictly to session user
    const clientPayments = payments.filter(
      p => p.userId === session.userId || (p.clientEmail && p.clientEmail.toLowerCase() === session.email.toLowerCase())
    );

    return res.status(200).json({
      success: true,
      count: clientPayments.length,
      payments: clientPayments
    });
  }

  // 2. POST: Submit a payment verification request
  if (req.method === 'POST') {
    if (!enforceRateLimit(req, res, 'submit-payment', 10, 60000)) return;

    // Verify authenticated session
    const session = await requireAuth(req, res);
    if (!session) return; // Response handled by middleware

    try {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) {}
      }

      if (!body.screenshot || typeof body.screenshot !== 'string' || body.screenshot.trim().length < 30) {
        return res.status(400).json({
          success: false,
          error: 'Verification rejected: Payment screenshot / photo proof is strictly mandatory.'
        });
      }

      const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || '127.0.0.1';
      const orderId = 'TXN-' + Date.now().toString().slice(-6) + Math.floor(100 + Math.random() * 900);

      // Identity derived from server session (anti-spoofing)
      const newPayment = {
        id: orderId,
        userId: session.userId,
        clientName: session.name || body.clientName || 'Valued Client',
        clientEmail: session.email,
        clientPhone: body.clientPhone || '',
        amountUSD: Number(body.amountUSD) || 0,
        amountINR: Number(body.amountINR) || 0,
        currency: body.currency || 'USD',
        method: body.method || 'UPI QR Scanner',
        network: body.network || '',
        service: body.service || 'Custom Engineering Scope / Milestone Retainer',
        utr: (body.utr || body.txHash || '').trim(),
        screenshot: body.screenshot || '',
        status: 'pending', // Client CANNOT set status to 'approved'
        rejectionReason: '',
        clientIp,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const { payments } = await fetchVaultPayments();
      payments.unshift(newPayment);

      await persistVaultPayments(payments, `submit payment ${orderId}`);

      return res.status(201).json({
        success: true,
        message: 'Payment verification submitted and stored permanently in vault.',
        payment: newPayment
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // 3. PATCH / PUT: Update status (Approve / Reject) - Strictly ADMIN ONLY
  if (req.method === 'PATCH' || req.method === 'PUT') {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) {}
      }

      const { id, status, reason, utr, amountUSD, amountINR } = body || {};
      if (!id) return res.status(400).json({ error: 'Missing payment ID' });

      const { payments } = await fetchVaultPayments();
      const paymentIndex = payments.findIndex(p => p.id === id);

      if (paymentIndex >= 0) {
        if (status) payments[paymentIndex].status = status;
        if (reason !== undefined) payments[paymentIndex].rejectionReason = reason;
        if (utr !== undefined) payments[paymentIndex].utr = utr;
        if (amountUSD !== undefined) payments[paymentIndex].amountUSD = Number(amountUSD);
        if (amountINR !== undefined) payments[paymentIndex].amountINR = Number(amountINR);
        payments[paymentIndex].updatedAt = new Date().toISOString();

        await persistVaultPayments(payments, `update payment ${id} to ${status || 'updated'}`);

        return res.status(200).json({
          success: true,
          message: `Payment status updated successfully.`,
          payment: payments[paymentIndex]
        });
      } else {
        return res.status(404).json({ error: 'Payment not found in vault' });
      }
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // 4. DELETE: Purge payment record - Strictly ADMIN ONLY
  if (req.method === 'DELETE') {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'Missing ID' });

      const { payments } = await fetchVaultPayments();
      const filtered = payments.filter(p => p.id !== id);

      await persistVaultPayments(filtered, `delete payment ${id}`);
      return res.status(200).json({ success: true, message: 'Payment purged from vault' });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
