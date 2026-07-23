const DealService = require('../services/DealService');

exports.getDeals = async (req, res) => {
  try {
    const tenantId = req.tenant.id;
    const deals = await DealService.getDealsByTenant(tenantId);
    res.json(deals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createDeal = async (req, res) => {
  try {
    const tenantId = req.tenant.id;
    const deal = await DealService.createDeal(tenantId, req.body);
    res.status(201).json(deal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
