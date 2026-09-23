// Serverless API for Real-Time Security Telemetry & Visitor Activity
import { requireAdmin } from './lib/authMiddleware.js';
import { enforceRateLimit } from './lib/rateLimiter.js';

let telemetryLogs = [];

export default async function handler(req, res) {
  const reqOrigin = req.headers.origin || 'https://techydeveloper.vercel.app';
  res.setHeader('Access-Control-Allow-Origin', reqOrigin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, x-admin-passcode'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Retrieve telemetry logs (Admin Auth Required)
  if (req.method === 'GET') {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    return res.status(200).json({
      success: true,
      count: telemetryLogs.length,
      logs: telemetryLogs
    });
  }

  // POST: Record a real telemetry / audit / activity event
  if (req.method === 'POST') {
    if (!enforceRateLimit(req, res, 'telemetry-event', 60, 60000)) return;

    try {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) {}
      }

      const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '198.51.100.1';
      const userAgent = req.headers['user-agent'] || 'Unknown';
      const country = req.headers['x-vercel-ip-country'] || 'Global';
      const city = req.headers['x-vercel-ip-city'] || '';

      const newLog = {
        id: 'LOG-' + Date.now().toString().slice(-6),
        category: body.category || 'TRAFFIC', // AUDIT, INQUIRY, ESTIMATE, CHAT, CLICK, TRAFFIC
        event: body.event || 'Platform Interaction',
        details: body.details || {},
        sourceIp: typeof clientIp === 'string' ? clientIp.split(',')[0].trim() : 'Protected IP',
        location: city ? `${city}, ${country}` : country,
        proto: body.proto || 'HTTPS / TLS 1.3',
        status: body.status || 'VERIFIED',
        timestamp: new Date().toISOString()
      };

      telemetryLogs.unshift(newLog);
      if (telemetryLogs.length > 200) {
        telemetryLogs = telemetryLogs.slice(0, 200);
      }

      return res.status(201).json({ success: true, log: newLog });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // DELETE: Purge telemetry history (Admin Only)
  if (req.method === 'DELETE') {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    telemetryLogs = [];
    return res.status(200).json({ success: true, message: 'Telemetry log purged.' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
