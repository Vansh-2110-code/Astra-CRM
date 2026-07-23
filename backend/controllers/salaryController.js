const SalaryService = require('../services/SalaryService');

exports.getSlips = async (req, res) => {
  try {
    const clientId = req.user?.tenantId || req.query.clientId || 'client-001';
    const slips = await SalaryService.getSlipsByTenant(clientId);
    res.json(slips);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.generateSlip = async (req, res) => {
  try {
    const slip = await SalaryService.generateSlip(req.body);
    res.status(201).json(slip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markPaid = async (req, res) => {
  try {
    const slip = await SalaryService.markAsPaid(req.params.id);
    res.json(slip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
