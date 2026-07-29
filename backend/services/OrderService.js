const OrderRepository = require('../repositories/OrderRepository');

class OrderService {
  async getOrdersByTenant(tenantId) {
    return OrderRepository.findByTenant(tenantId);
  }

  async createOrder(tenantId, orderData) {
    const { 
      customerName, 
      totalValue, 
      status, 
      quoteId,
      invoiceNumber,
      invoiceType,
      invoiceDate,
      customerAddress,
      customerState,
      customerGstin,
      reverseCharge,
      items,
      subtotal,
      cgstAmount,
      sgstAmount,
      taxTotal,
      shipping,
      grandTotal,
      sellerName,
      sellerLogo,
      sellerAddress,
      sellerWebsite,
      sellerGstin,
      bankName,
      bankAccountName,
      bankAccountType,
      bankAccountNumber,
      bankIfscCode,
      bankBranch
    } = orderData;

    const order = await OrderRepository.create({
      id: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      clientId: tenantId,
      customerName,
      totalValue: parseFloat(totalValue || grandTotal) || 0,
      status: status || 'Pending',
      quoteId,
      createdDate: new Date().toISOString().split('T')[0],
      invoiceNumber,
      invoiceType,
      invoiceDate: invoiceDate || new Date().toISOString().split('T')[0],
      customerAddress,
      customerState,
      customerGstin,
      reverseCharge: reverseCharge || 'N',
      items: items || [],
      subtotal: parseFloat(subtotal) || 0,
      cgstAmount: parseFloat(cgstAmount) || 0,
      sgstAmount: parseFloat(sgstAmount) || 0,
      taxTotal: parseFloat(taxTotal) || 0,
      shipping: parseFloat(shipping) || 0,
      grandTotal: parseFloat(grandTotal) || 0,
      sellerName: sellerName || 'Sanna Innovations',
      sellerLogo,
      sellerAddress,
      sellerWebsite,
      sellerGstin,
      bankName,
      bankAccountName,
      bankAccountType,
      bankAccountNumber,
      bankIfscCode,
      bankBranch
    });

    return order;
  }
}

module.exports = new OrderService();


