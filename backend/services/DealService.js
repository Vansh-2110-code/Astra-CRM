const DealRepository = require('../repositories/DealRepository');

class DealService {
  async getDealsByTenant(tenantId) {
    return DealRepository.findByTenant(tenantId);
  }

  async createDeal(tenantId, dealData) {
    const { title, company, dealValue, stage, pipelineId } = dealData;

    const deal = await DealRepository.create({
      id: `deal-${Date.now()}`,
      clientId: tenantId,
      title,
      company,
      dealValue: parseFloat(dealValue) || 0,
      probability: stage === "Negotiation" ? 90 : 50,
      stage: stage || 'Lead',
      pipelineId: pipelineId || 'pipe-enterprise'
    });

    return deal;
  }
}

module.exports = new DealService();
