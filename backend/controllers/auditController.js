const AuditService = require('../services/AuditService');

exports.getAuditLogs = async (req, res) => {
  try {
    const tenantId = req.tenant.id;
    const logs = await AuditService.getLogsByTenant(tenantId);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
