const IntegrationService = require('../services/IntegrationService');

exports.getIntegrations = async (req, res) => {
  try {
    const tenantId = req.tenant.id;
    const integrations = await IntegrationService.getIntegrationsByTenant(tenantId);
    res.json(integrations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateIntegration = async (req, res) => {
  try {
    const tenantId = req.tenant.id;
    const integration = await IntegrationService.updateIntegration(tenantId, req.body);
    res.json(integration);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
