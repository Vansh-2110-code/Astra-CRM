const BaseRepository = require('./BaseRepository');
const Order = require('../models/Order');

class OrderRepository extends BaseRepository {
  constructor() {
    super(Order);
  }

  async findByTenant(clientId) {
    return this.findAll({ where: { clientId } });
  }
}

module.exports = new OrderRepository();
