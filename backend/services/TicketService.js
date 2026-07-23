const TicketRepository = require('../repositories/TicketRepository');

class TicketService {
  async getTicketsByTenant(tenantId) {
    return TicketRepository.findByTenant(tenantId);
  }

  async createTicket(tenantId, ticketData) {
    const { title, description, priority, customerName } = ticketData;

    const ticket = await TicketRepository.create({
      id: `TCK-${Math.floor(10000 + Math.random() * 90000)}`,
      clientId: tenantId,
      title,
      description,
      priority: priority || 'Medium',
      customerName,
      status: 'Open',
      createdDate: new Date().toISOString()
    });

    return ticket;
  }
}

module.exports = new TicketService();
