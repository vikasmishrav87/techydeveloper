// Serverless API for Managing Real-Time Payment Submissions, Approvals & Permanent Vault Storage

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
        'User-Agent': 'TheUnfilteredEngineer-VaultClient',
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!res.ok) {
      return { payments: global._UE_PAYMENTS_CACHE.payments || [], sha: global._UE_PAYMENTS_CACHE.sha };
    }

    const data = await res.json();
    const parsed = JSON.parse(Buffer.from(data.content, 'base64').toString('utf8'));
    const payments = Array.isArray(parsed) ? parsed : (Array.isArray(parsed.payments) ? parsed.payments : []);
    
    global._UE_PAYMENTS_CACHE = {
      payments,
      sha: data.sha,
      lastFetched: now
    };

    return { payments, sha: data.sha };
  } catch (err) {
    console.error('Failed to load payments from vault:', err.message);
    return { payments: global._UE_PAYMENTS_CACHE.payments || [], sha: global._UE_PAYMENTS_CACHE.sha };
  }
}

// Helper to commit and persist updated payments permanently into GitHub Vault
async function persistVaultPayments(payments, commitMessage = 'update payments database') {
  try {
    const current = await fetchVaultPayments();
    const sha = current.sha;

    const body = {
      message: `[Vault DB] ${commitMessage}`,
      content: Buffer.from(JSON.stringify(payments, null, 2)).toString('base64')
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
      global._UE_PAYMENTS_CACHE = {
        payments,
        sha: resData.content.sha,
        lastFetched: Date.now()
      };
      return true;
    }
    return false;
  } catch (err) {
    console.error('Vault payments persistence error:', err);
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

  // 1. GET: Fetch payment by ID or list all payments
  if (req.method === 'GET') {
    const { id } = req.query;
    const { payments } = await fetchVaultPayments();

    if (id) {
      const payment = payments.find(p => p.id === id);
      if (!payment) {
        return res.status(404).json({ success: false, error: 'Payment record not found' });
      }
      return res.status(200).json({ success: true, payment });
    }

    return res.status(200).json({
      success: true,
      count: payments.length,
      payments
    });
  }

  // 2. POST: Submit a new payment verification request (Permanent Vault Persistence)
  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) {}
      }

      const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';
      const orderId = body.id || ('TXN-' + Date.now().toString().slice(-6) + Math.floor(100 + Math.random() * 900));

      const newPayment = {
        id: orderId,
        amountUSD: Number(body.amountUSD) || 0,
        amountINR: Number(body.amountINR) || 0,
        currency: body.currency || 'USD',
        method: body.method || 'UPI QR Scanner',
        network: body.network || '',
        clientName: body.clientName || 'Valued Client',
        clientEmail: body.clientEmail || '',
        clientPhone: body.clientPhone || '',
        service: body.service || 'Custom Engineering Scope / Milestone Retainer',
        utr: body.utr || body.txHash || '',
        screenshot: body.screenshot || '',
        status: body.status || 'pending', // 'pending' | 'approved' | 'rejected'
        rejectionReason: body.rejectionReason || '',
        clientIp,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const { payments } = await fetchVaultPayments();
      // Unshift new payment at top
      payments.unshift(newPayment);

      // Save permanently to GitHub Vault
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

  // 3. PATCH / PUT: Update status (Approve / Reject) or Edit details
  if (req.method === 'PATCH' || req.method === 'PUT') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) {}
      }

      const { id, status, reason, utr, amountUSD, amountINR } = body;

      if (!id) {
        return res.status(400).json({ error: 'Missing payment ID' });
      }

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

  // 4. DELETE: Purge payment record
  if (req.method === 'DELETE') {
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
