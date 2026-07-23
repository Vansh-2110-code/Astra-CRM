const IntegrationRepository = require('../repositories/IntegrationRepository');

class IntegrationService {
  async getIntegrationsByTenant(tenantId) {
    return IntegrationRepository.findByTenant(tenantId);
  }

  async updateIntegration(tenantId, integrationData) {
    const { name, enabled, config } = integrationData;

    let integration = await IntegrationRepository.findOne({
      where: { clientId: tenantId, name }
    });

    if (integration) {
      await integration.update({
        enabled: enabled !== undefined ? enabled : integration.enabled,
        config: config || integration.config
      });
    } else {
      integration = await IntegrationRepository.create({
        id: `int-${Date.now()}`,
        clientId: tenantId,
        name,
        enabled: enabled || false,
        config: config || {}
      });
    }

    return integration;
  }
}

module.exports = new IntegrationService();
