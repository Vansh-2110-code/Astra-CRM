const TenantService = require('../services/TenantService');

exports.getTenants = async (req, res) => {
  try {
    const tenants = await TenantService.getTenants();
    res.json(tenants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createTenant = async (req, res) => {
  try {
    const tenant = await TenantService.createTenant(req.body);
    res.status(201).json(tenant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
