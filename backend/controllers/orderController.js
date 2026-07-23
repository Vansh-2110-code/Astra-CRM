const OrderService = require('../services/OrderService');

exports.getOrders = async (req, res) => {
  try {
    const tenantId = req.tenant.id;
    const orders = await OrderService.getOrdersByTenant(tenantId);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const tenantId = req.tenant.id;
    const order = await OrderService.createOrder(tenantId, req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
