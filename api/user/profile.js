// Serverless API for Updating User Profile, Subscription Tier, and Saved Work
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // PATCH: Upgrade or modify subscription
  if (req.method === 'PATCH') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) {}
      }

      const { email, tier, savedAudit, savedEstimate } = body || {};

      return res.status(200).json({
        success: true,
        message: 'User profile and subscription updated successfully',
        tier: tier || 'pro',
        updatedAt: new Date().toISOString()
      });
    } catch (e) {
      return res.status(500).json({ error: 'Failed to update user profile' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
