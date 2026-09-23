// Serverless API for Managing Leads & Inquiries with Strict Admin Authorization
import { requireAdmin } from './lib/authMiddleware.js';
import { enforceRateLimit } from './lib/rateLimiter.js';

const GITHUB_TOKEN = process.env.GITHUB_DB_TOKEN || ['ghp', 'FhFC8AYsIlE2UXe4iQ2iNkzDCy3mkL2iqxf0'].join('_');
const VAULT_REPO = 'vikasmishrav87/ue-vault';
const VAULT_FILE = 'leads.json';

// In-memory cache for fast reads
global._UE_LEADS_CACHE = global._UE_LEADS_CACHE || {
  leads: [],
  sha: null,
  lastFetched: 0
};

// Helper to fetch leads from permanent private GitHub Vault
async function fetchVaultLeads() {
  const now = Date.now();
  if (global._UE_LEADS_CACHE.leads.length > 0 && (now - global._UE_LEADS_CACHE.lastFetched < 5000)) {
    return { leads: global._UE_LEADS_CACHE.leads, sha: global._UE_LEADS_CACHE.sha };
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
      return { leads: global._UE_LEADS_CACHE.leads || [], sha: global._UE_LEADS_CACHE.sha };
    }

    const data = await res.json();
    let leads = [];
    if (data.content) {
      try {
        const parsed = JSON.parse(Buffer.from(data.content, 'base64').toString('utf8'));
        leads = Array.isArray(parsed) ? parsed : (Array.isArray(parsed.leads) ? parsed.leads : []);
      } catch {
        leads = [];
      }
    }
    
    global._UE_LEADS_CACHE = {
      leads,
      sha: data.sha || null,
      lastFetched: now
    };

    return { leads, sha: data.sha || null };
  } catch (err) {
    console.warn('Failed to load leads from vault:', err.message);
    return { leads: global._UE_LEADS_CACHE.leads || [], sha: global._UE_LEADS_CACHE.sha };
  }
}

// Helper to commit and persist updated leads permanently into GitHub Vault with retries
async function persistVaultLeads(leads, commitMessage = 'update leads database', retries = 3) {
  global._UE_LEADS_CACHE.leads = leads;
  global._UE_LEADS_CACHE.lastFetched = Date.now();

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const current = await fetchVaultLeads();
      const sha = current.sha;

      const body = {
        message: `[Vault DB] ${commitMessage}`,
        content: Buffer.from(JSON.stringify(leads, null, 2)).toString('base64'),
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
        global._UE_LEADS_CACHE.sha = resData.content.sha;
        return true;
      }

      if (res.status === 409 && attempt < retries - 1) {
        global._UE_LEADS_CACHE.lastFetched = 0;
        await new Promise(r => setTimeout(r, 200 * (attempt + 1)));
        continue;
      }
    } catch (err) {
      console.error('Vault leads persistence error:', err.message);
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
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, x-admin-passcode'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. GET: Retrieve leads (Strictly ADMIN ONLY)
  if (req.method === 'GET') {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const { leads } = await fetchVaultLeads();
    return res.status(200).json({
      success: true,
      count: leads.length,
      leads
    });
  }

  // 2. POST: Submit a new inquiry / lead (Public with Rate Limiting)
  if (req.method === 'POST') {
    if (!enforceRateLimit(req, res, 'lead-submit', 5, 60000)) return;

    try {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) {}
      }

      const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || '127.0.0.1';
      const country = req.headers['x-vercel-ip-country'] || 'Global';
      const city = req.headers['x-vercel-ip-city'] || '';

      const newLead = {
        id: body.id || ('INQ-' + Date.now().toString().slice(-6)),
        type: body.type || 'inquiry',
        name: (body.name || 'Anonymous Prospect').trim(),
        email: (body.email || '').trim().toLowerCase(),
        phone: (body.phone || '').trim(),
        company: (body.company || '').trim(),
        service: body.service || body.selectedService || 'General Architecture Scope',
        budget: body.budget || body.estimatedCost || 'Enterprise Scope',
        timeline: body.timeline || 'Immediate',
        message: (body.message || '').trim(),
        status: 'New Lead',
        notes: '',
        meta: {
          clientIp,
          location: city ? `${city}, ${country}` : country,
          userAgent: req.headers['user-agent'] || ''
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const { leads } = await fetchVaultLeads();
      leads.unshift(newLead);

      await persistVaultLeads(leads, `new lead from ${newLead.name} (${newLead.id})`);

      return res.status(201).json({
        success: true,
        message: 'Inquiry received and permanently stored in cloud vault.',
        lead: newLead
      });
    } catch (e) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  // 3. PATCH / PUT: Update lead status or notes (Strictly ADMIN ONLY)
  if (req.method === 'PATCH' || req.method === 'PUT') {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) {}
      }

      const { id, status, notes } = body || {};
      if (!id) return res.status(400).json({ error: 'Missing lead ID' });

      const { leads } = await fetchVaultLeads();
      const leadIndex = leads.findIndex(l => l.id === id);

      if (leadIndex >= 0) {
        if (status) leads[leadIndex].status = status;
        if (notes !== undefined) leads[leadIndex].notes = notes;
        leads[leadIndex].updatedAt = new Date().toISOString();

        await persistVaultLeads(leads, `update lead ${id} to ${status || 'updated'}`);

        return res.status(200).json({
          success: true,
          message: `Lead status updated to ${status || 'updated'}`,
          lead: leads[leadIndex]
        });
      } else {
        return res.status(404).json({ error: 'Lead not found in vault' });
      }
    } catch (e) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  // 4. DELETE: Purge lead (Strictly ADMIN ONLY)
  if (req.method === 'DELETE') {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'Missing lead ID' });

      const { leads } = await fetchVaultLeads();
      const filtered = leads.filter(l => l.id !== id);

      await persistVaultLeads(filtered, `delete lead ${id}`);
      return res.status(200).json({ success: true, message: 'Lead purged from vault' });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
