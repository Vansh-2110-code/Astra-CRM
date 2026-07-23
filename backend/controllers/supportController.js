const TicketService = require('../services/TicketService');

exports.getTickets = async (req, res) => {
  try {
    const tenantId = req.tenant.id;
    const tickets = await TicketService.getTicketsByTenant(tenantId);
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createTicket = async (req, res) => {
  try {
    const tenantId = req.tenant.id;
    const ticket = await TicketService.createTicket(tenantId, req.body);
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
