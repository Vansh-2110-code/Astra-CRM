const BaseRepository = require('./BaseRepository');
const Deal = require('../models/Deal');

class DealRepository extends BaseRepository {
  constructor() {
    super(Deal);
  }

  async findByTenant(clientId) {
    return this.findAll({ where: { clientId } });
  }
}

module.exports = new DealRepository();
