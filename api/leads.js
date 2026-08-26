// Serverless API for Managing Real Customer Leads, Inquiries & Estimates
// Global in-memory storage across warm serverless container instances
let leadsDatabase = [];

const ADMIN_USER = 'vikasmishraji87';

function verifyAuth(req) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  return Boolean(token && (token.startsWith('ue_sec_') || token.includes('authenticated_token_') || token === 'admin_verified_vikas'));
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

  // GET: Retrieve all real leads (Admin Auth Required)
  if (req.method === 'GET') {
    if (!verifyAuth(req)) {
      return res.status(401).json({ error: 'Unauthorized: Executive Authentication Required' });
    }

    return res.status(200).json({
      success: true,
      count: leadsDatabase.length,
      leads: leadsDatabase
    });
  }

  // POST: Record a new real lead (Public endpoint from website contact, estimator, audit)
  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) {}
      }

      const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '198.51.100.1';
      const userAgent = req.headers['user-agent'] || 'Unknown Browser';
      const country = req.headers['x-vercel-ip-country'] || 'Global';
      const city = req.headers['x-vercel-ip-city'] || '';

      const newLead = {
        id: body.id || ('INQ-' + Date.now().toString().slice(-6)),
        type: body.type || 'inquiry', // inquiry, estimate, audit_lead, chat_lead
        name: body.name || 'Anonymous Prospect',
        email: body.email || '',
        phone: body.phone || '',
        company: body.company || '',
        service: body.service || body.selectedService || 'General Architecture',
        budget: body.budget || body.estimatedCost || 'Enterprise Scope',
        message: body.message || body.details || '',
        meta: body.meta || {},
        source: body.source || 'Website Form',
        clientIp: typeof clientIp === 'string' ? clientIp.split(',')[0].trim() : 'Protected IP',
        location: city ? `${city}, ${country}` : country,
        userAgent,
        timestamp: new Date().toISOString(),
        status: 'New / Priority'
      };

      // Prepend to database
      leadsDatabase.unshift(newLead);
      if (leadsDatabase.length > 500) leadsDatabase.pop();

      return res.status(201).json({
        success: true,
        message: 'Lead recorded in executive pipeline',
        lead: newLead
      });
    } catch (e) {
      return res.status(500).json({ success: false, error: 'Failed to record lead' });
    }
  }

  // PATCH: Update lead status (Admin Auth Required)
  if (req.method === 'PATCH') {
    if (!verifyAuth(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) {}
      }

      const { id, status, notes } = body || {};
      const lead = leadsDatabase.find(l => l.id === id);
      if (lead) {
        if (status) lead.status = status;
        if (notes) lead.notes = notes;
        lead.updatedAt = new Date().toISOString();
        return res.status(200).json({ success: true, lead });
      }

      return res.status(404).json({ error: 'Lead not found' });
    } catch (e) {
      return res.status(500).json({ error: 'Failed to update lead' });
    }
  }

  // DELETE: Delete lead (Admin Auth Required)
  if (req.method === 'DELETE') {
    if (!verifyAuth(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.query || {};
    if (id === 'ALL') {
      leadsDatabase = [];
      return res.status(200).json({ success: true, message: 'All leads cleared' });
    }

    leadsDatabase = leadsDatabase.filter(l => l.id !== id);
    return res.status(200).json({ success: true, message: 'Lead deleted' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
