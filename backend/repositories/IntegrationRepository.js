const BaseRepository = require('./BaseRepository');
const Integration = require('../models/Integration');

class IntegrationRepository extends BaseRepository {
  constructor() {
    super(Integration);
  }

  async findByTenant(clientId) {
    return this.findAll({ where: { clientId } });
  }
}

module.exports = new IntegrationRepository();
