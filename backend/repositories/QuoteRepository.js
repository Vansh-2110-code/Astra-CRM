const BaseRepository = require('./BaseRepository');
const Quote = require('../models/Quote');

class QuoteRepository extends BaseRepository {
  constructor() {
    super(Quote);
  }

  async findByTenant(clientId) {
    return this.findAll({ where: { clientId } });
  }
}

module.exports = new QuoteRepository();
