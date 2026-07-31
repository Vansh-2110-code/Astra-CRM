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

  async updateDeal(tenantId, id, dealData) {
    let deal = await DealRepository.findOne({ where: { id, clientId: tenantId } });

    if (!deal) {
      const cleanId = id.replace(/^deal-/, '');
      deal = await DealRepository.findOne({ where: { id: cleanId, clientId: tenantId } }) ||
             await DealRepository.findOne({ where: { id: `deal-${cleanId}`, clientId: tenantId } });
    }

    if (!deal && (dealData.company || dealData.title)) {
      const { Op } = require('sequelize');
      const conditions = [];
      if (dealData.company) conditions.push({ company: dealData.company });
      if (dealData.title) conditions.push({ title: dealData.title });

      if (conditions.length > 0) {
        deal = await DealRepository.findOne({
          where: {
            clientId: tenantId,
            [Op.or]: conditions
          }
        });
      }
    }

    if (!deal) {
      // Auto-provision deal in database if it existed only in transient local state
      deal = await DealRepository.create({
        id: id.startsWith('deal-') ? id : `deal-${id}`,
        clientId: tenantId,
        title: dealData.title || 'Ongoing Project Opportunity',
        company: dealData.company || 'Client Organization',
        dealValue: parseFloat(dealData.dealValue) || 100000,
        stage: dealData.stage || 'Won',
        projectStatus: dealData.projectStatus || 'In Progress',
        projectProgress: dealData.projectProgress !== undefined ? parseInt(dealData.projectProgress, 10) : 0,
        projectDeadline: dealData.projectDeadline || null
      });
      return deal;
    }

    const updates = {};
    const allowedFields = ['title', 'company', 'dealValue', 'probability', 'stage', 'pipelineId', 'projectStatus', 'projectProgress', 'projectDeadline'];
    for (const key of allowedFields) {
      if (dealData[key] !== undefined) {
        updates[key] = dealData[key];
      }
    }

    await deal.update(updates);
    return deal;
  }

  async deleteDeal(tenantId, id) {
    let deal = await DealRepository.findOne({ where: { id, clientId: tenantId } });

    if (!deal) {
      const cleanId = id.replace(/^deal-/, '');
      deal = await DealRepository.findOne({ where: { id: cleanId, clientId: tenantId } }) ||
             await DealRepository.findOne({ where: { id: `deal-${cleanId}`, clientId: tenantId } });
    }

    if (deal) {
      await deal.destroy();
      return true;
    }
    return true;
  }
}

module.exports = new DealService();
