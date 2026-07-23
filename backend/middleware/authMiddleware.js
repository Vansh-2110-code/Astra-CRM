const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/dbConfig');
const { Tenant } = require('../models');

async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: "Access Denied: Missing Authentication Bearer Token" });
    }

    // Verify token using cryptographical JWT signature check
    jwt.verify(token, jwtSecret, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: "Access Forbidden: Invalid Cryptographic Token Signature" });
      }

      // Securely-derived tenant context from decrypted JWT payload claims (preventing BOLA SEC-01)
      let tenantId = decoded.tenantId;

      // Allow Super Admin role to override tenantId with the x-tenant-id header
      if (decoded.role && decoded.role.startsWith('Super Admin') && req.headers['x-tenant-id']) {
        tenantId = req.headers['x-tenant-id'];
      }

      const tenant = await Tenant.findByPk(tenantId);
      if (!tenant) {
        return res.status(404).json({ error: "Tenant not found or has been suspended." });
      }

      // Inject validated tenant and user profile in request context
      req.user = decoded;
      req.userEmail = decoded.email;
      req.tenant = tenant;
      next();
    });
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(500).json({ error: "Internal Server Security Exception" });
  }
}

module.exports = {
  authenticateToken
};
