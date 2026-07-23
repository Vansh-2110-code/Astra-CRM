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

exports.upgradeTenant = async (req, res) => {
  try {
    const { id } = req.params;
    const { plan } = req.body;
    const tenant = await TenantService.upgradeTenant(id, plan);
    res.json(tenant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
