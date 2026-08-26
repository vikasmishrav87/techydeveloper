// Serverless API for Real-Time Security Telemetry & Visitor Activity
let telemetryLogs = [];

function verifyAuth(req) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  return Boolean(token && (token.startsWith('ue_sec_') || token.includes('authenticated_token_') || token === 'admin_verified_vikas'));
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Retrieve telemetry logs (Admin Auth Required)
  if (req.method === 'GET') {
    if (!verifyAuth(req)) {
      return res.status(401).json({ error: 'Unauthorized: Executive Authentication Required' });
    }

    return res.status(200).json({
      success: true,
      count: telemetryLogs.length,
      logs: telemetryLogs
    });
  }

  // POST: Record a real telemetry / audit / activity event
  if (req.method === 'POST') {
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
      if (telemetryLogs.length > 300) telemetryLogs.pop();

      return res.status(201).json({
        success: true,
        log: newLog
      });
    } catch (e) {
      return res.status(500).json({ error: 'Failed to record telemetry' });
    }
  }

  // DELETE: Clear logs (Admin Auth Required)
  if (req.method === 'DELETE') {
    if (!verifyAuth(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    telemetryLogs = [];
    return res.status(200).json({ success: true, message: 'Telemetry logs cleared' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
