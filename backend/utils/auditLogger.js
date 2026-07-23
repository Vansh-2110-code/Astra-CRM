const { writeData } = require('../db');

function logAudit(data, tenantId, userEmail, roleName, action, resource, details, severity = 'INFO') {
  const newLog = {
    id: `log-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toISOString(),
    userEmail,
    roleName,
    action,
    resource,
    ipAddress: '192.168.1.99',
    severity,
    details,
    clientId: tenantId
  };
  if (!data.auditLogs) {
    data.auditLogs = [];
  }
  data.auditLogs.push(newLog);
}

module.exports = {
  logAudit
};
