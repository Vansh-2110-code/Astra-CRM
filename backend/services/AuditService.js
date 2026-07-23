const AuditLogRepository = require('../repositories/AuditLogRepository');

class AuditService {
  async getLogsByTenant(tenantId) {
    return AuditLogRepository.findByTenant(tenantId);
  }

  async logAction(tenantId, userEmail, roleName, action, resource, details, severity = 'INFO') {
    const log = await AuditLogRepository.create({
      id: `log-${Date.now().toString().slice(-4)}`,
      clientId: tenantId,
      userEmail,
      roleName,
      action,
      resource,
      ipAddress: '192.168.1.99',
      severity,
      details
    });
    return log;
  }
}

module.exports = new AuditService();
