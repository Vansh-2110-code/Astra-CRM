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
    console.error('Create Order Backend Error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const tenantId = req.tenant.id;
    const { id } = req.params;
    const updatedOrder = await OrderService.updateOrder(tenantId, id, req.body);
    res.json(updatedOrder);
  } catch (error) {
    console.error('Update Order Error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const tenantId = req.tenant.id;
    const { id } = req.params;

    // Strict Admin authorization check
    const userRole = (req.user?.role || '').toLowerCase();
    const roleId = req.user?.roleId || '';
    const isAdmin = roleId === 'role-admin' || userRole.includes('admin') || req.user?.isSystemAdmin;

    if (!isAdmin) {
      return res.status(403).json({ error: 'Access Denied: Only Admin users can delete invoices.' });
    }

    await OrderService.deleteOrder(tenantId, id);
    res.json({ success: true, message: 'Invoice deleted successfully.' });
  } catch (error) {
    console.error('Delete Order Error:', error);
    res.status(500).json({ error: error.message });
  }
};
