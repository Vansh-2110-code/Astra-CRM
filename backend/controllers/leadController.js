const LeadService = require('../services/LeadService');

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
    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
