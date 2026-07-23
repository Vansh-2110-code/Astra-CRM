const BaseRepository = require('./BaseRepository');
const Ticket = require('../models/Ticket');

class TicketRepository extends BaseRepository {
  constructor() {
    super(Ticket);
  }

  async findByTenant(clientId) {
    return this.findAll({ where: { clientId } });
  }
}

module.exports = new TicketRepository();
