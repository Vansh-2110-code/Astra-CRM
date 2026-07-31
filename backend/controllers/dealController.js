const DealService = require('../services/DealService');
const { invalidateCache } = require('../middleware/cacheMiddleware');
const { emitToTenant } = require('../config/socket');

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

    // Invalidate Redis Query Cache
    await invalidateCache(tenantId, 'deals');

    // Emit live real-time event to all connected sockets in this tenant room
    emitToTenant(tenantId, 'deal_created', deal);

    res.status(201).json(deal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateDeal = async (req, res) => {
  try {
    const tenantId = req.tenant.id;
    const { id } = req.params;
    const updated = await DealService.updateDeal(tenantId, id, req.body);

    await invalidateCache(tenantId, 'deals');
    emitToTenant(tenantId, 'deal_updated', updated);

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
