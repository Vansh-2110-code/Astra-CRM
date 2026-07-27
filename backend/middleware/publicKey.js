// backend/middleware/publicKey.js
// Middleware to validate a simple API key for public lead submissions.
// It also injects a dummy tenant ID so that existing lead service logic works.

require('dotenv').config();

module.exports.validatePublicKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const expectedKey = process.env.PUBLIC_LEAD_API_KEY;

  if (!expectedKey) {
    console.error('PUBLIC_LEAD_API_KEY not set in .env');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  if (!apiKey || apiKey !== expectedKey) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  // Attach a tenant context for lead service (could be a dedicated "web" tenant).
  const tenantId = process.env.WEB_LEAD_TENANT_ID || 'public-tenant';
  req.tenant = { id: tenantId };
  next();
};
