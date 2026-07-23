const LeadService = require('../services/LeadService');
const { invalidateCache } = require('../middleware/cacheMiddleware');
const { emitToTenant } = require('../config/socket');

exports.getLeads = async (req, res) => {
  try {
    const tenantId = req.tenant.id;
    const leads = await LeadService.getLeadsByTenant(tenantId);
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createLead = async (req, res) => {
  try {
    const tenantId = req.tenant.id;
    const lead = await LeadService.createLead(tenantId, req.body);
    
    // Invalidate Redis Query Cache
    await invalidateCache(tenantId, 'leads');

    // Emit live real-time event to all connected sockets in this tenant room
    emitToTenant(tenantId, 'lead_created', lead);

    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
