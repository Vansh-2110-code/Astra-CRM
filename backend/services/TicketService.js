const TicketRepository = require('../repositories/TicketRepository');

class TicketService {
  async getTicketsByTenant(tenantId) {
    return TicketRepository.findByTenant(tenantId);
  }

  async createTicket(tenantId, ticketData) {
    const { title, subject, description, priority, customerName, contactEmail, productName, warrantyStatus, messages } = ticketData;

    const finalTitle = title || subject || 'Customer Support Request';
    const initMessages = messages || [
      { sender: customerName || 'Customer', text: description || finalTitle, time: 'Just now' }
    ];

    const ticket = await TicketRepository.create({
      id: `TCK-${Math.floor(10000 + Math.random() * 90000)}`,
      clientId: tenantId,
      title: finalTitle,
      description: description || '',
      priority: priority || 'Medium',
      customerName: customerName || 'Unknown Customer',
      contactEmail: contactEmail || 'support@client.com',
      productName: productName || 'Standard Tier License',
      warrantyStatus: warrantyStatus || 'Active Warranty',
      messages: initMessages,
      status: 'Open',
      createdDate: new Date().toISOString()
    });

    return ticket;
  }
}

module.exports = new TicketService();
