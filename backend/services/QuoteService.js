const QuoteRepository = require('../repositories/QuoteRepository');

class QuoteService {
  async getQuotesByTenant(tenantId) {
    return QuoteRepository.findByTenant(tenantId);
  }

  async createQuote(tenantId, quoteData) {
    const { customerName, contactPerson, contactEmail, items, discountPercent, notes, customLogoUrl, currency } = quoteData;

    // Perform Price Calculations
    let subtotal = 0;
    let taxTotal = 0;
    const computedItems = (items || []).map(item => {
      const quantity = item.quantity || 1;
      const unitPrice = item.unitPrice || 0;
      const itemSubtotal = unitPrice * quantity;
      subtotal += itemSubtotal;

      const itemDiscountPercent = item.discountPercent || 0;
      const itemDiscountAmount = itemSubtotal * (itemDiscountPercent / 100);
      const afterDiscount = itemSubtotal - itemDiscountAmount;

      const taxRate = item.taxRate || 0;
      const itemTax = afterDiscount * (taxRate / 100);
      taxTotal += itemTax;

      return {
        ...item,
        quantity,
        unitPrice,
        taxRate,
        discountPercent: itemDiscountPercent,
        total: afterDiscount + itemTax
      };
    });

    const discPercent = discountPercent || 0;
    const discountAmount = subtotal * (discPercent / 100);
    const grandTotal = (subtotal - discountAmount) + taxTotal;

    const quote = await QuoteRepository.create({
      id: `QT-2026-${Math.floor(100 + Math.random() * 900)}`,
      clientId: tenantId,
      customerName,
      contactPerson,
      contactEmail,
      items: computedItems,
      subtotal,
      discountPercent: discPercent,
      discountAmount,
      taxTotal,
      grandTotal,
      notes,
      customLogoUrl,
      currency: currency || "USD ($)",
      status: 'Draft',
      createdDate: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });

    return quote;
  }
}

module.exports = new QuoteService();
