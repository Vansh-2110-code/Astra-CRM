const BaseRepository = require('./BaseRepository');
const Lead = require('../models/Lead');

class LeadRepository extends BaseRepository {
  constructor() {
    super(Lead);
  }

  async findByTenant(clientId) {
    return this.findAll({ where: { clientId } });
  }
}

module.exports = new LeadRepository();
