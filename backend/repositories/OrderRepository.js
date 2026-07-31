const BaseRepository = require('./BaseRepository');
const Order = require('../models/Order');

class OrderRepository extends BaseRepository {
  constructor() {
    super(Order);
  }

  async findByTenant(clientId) {
    return this.findAll({ where: { clientId } });
  }

  async updateForTenant(clientId, id, data) {
    const order = await this.findOne({ where: { id, clientId } });
    if (!order) return null;
    return order.update(data);
  }

  async deleteForTenant(clientId, id) {
    const order = await this.findOne({ where: { id, clientId } });
    if (!order) return false;
    await order.destroy();
    return true;
  }
}

module.exports = new OrderRepository();
