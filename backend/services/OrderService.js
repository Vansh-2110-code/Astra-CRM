const OrderRepository = require('../repositories/OrderRepository');

class OrderService {
  async getOrdersByTenant(tenantId) {
    return OrderRepository.findByTenant(tenantId);
  }

  async createOrder(tenantId, orderData) {
    const { customerName, totalValue, status, quoteId } = orderData;

    const order = await OrderRepository.create({
      id: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      clientId: tenantId,
      customerName,
      totalValue: parseFloat(totalValue) || 0,
      status: status || 'Pending',
      quoteId,
      createdDate: new Date().toISOString().split('T')[0]
    });

    return order;
  }
}

module.exports = new OrderService();
