import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  FileText,
  Plus,
  Trash2,
  CheckCircle2,
  Printer,
  Download,
  ShoppingBag,
  Clock,
  ShieldCheck,
  AlertCircle,
  Percent
} from 'lucide-react';
import QuotePreviewModal from './QuotePreviewModal';

const QuoteBuilder = () => {
  const { quotes, products, leads, createQuote, approveQuote, convertQuoteToOrder, activeRole } = useCRM();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [previewQuote, setPreviewQuote] = useState(null);

  // New Quote Form State
  const [customerName, setCustomerName] = useState('Acme Corporation');
  const [contactPerson, setContactPerson] = useState('Jonathan Sterling');
  const [contactEmail, setContactEmail] = useState('j.sterling@acmecorp.com');
  const [discountPercent, setDiscountPercent] = useState(8);
  const [notes, setNotes] = useState('Includes 24-month extended hardware warranty and white-glove setup.');
  const [customLogoUrl, setCustomLogoUrl] = useState('');
  const [currency, setCurrency] = useState('USD ($)');


  const [lineItems, setLineItems] = useState([
    { productId: products[0]?.id || 'prod-100', productName: products[0]?.name || 'OmniHub Server', qty: 2, unitPrice: products[0]?.unitPrice || 24500, taxRate: products[0]?.taxRatePercent || 8.5 }
  ]);

  const addLineItem = () => {
    const defaultProd = products[0] || { id: 'p1', name: 'Standard Unit', unitPrice: 5000, taxRatePercent: 8.5 };
    setLineItems(prev => [
      ...prev,
      { productId: defaultProd.id, productName: defaultProd.name, qty: 1, unitPrice: defaultProd.unitPrice, taxRate: defaultProd.taxRatePercent }
    ]);
  };

  const removeLineItem = (index) => {
    setLineItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateLineItem = (index, field, value) => {
    setLineItems(prev => prev.map((item, i) => {
      if (i === index) {
        if (field === 'productId') {
          const selectedProd = products.find(p => p.id === value);
          return {
            ...item,
            productId: value,
            productName: selectedProd ? selectedProd.name : item.productName,
            unitPrice: selectedProd ? selectedProd.unitPrice : item.unitPrice,
            taxRate: selectedProd ? selectedProd.taxRatePercent : item.taxRate
          };
        }
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  // Math calculations
  const subtotal = lineItems.reduce((sum, item) => sum + (item.unitPrice * item.qty), 0);
  const discountAmount = (subtotal * (discountPercent / 100));
  const subtotalAfterDiscount = subtotal - discountAmount;
  const taxTotal = lineItems.reduce((sum, item) => {
    const itemSub = (item.unitPrice * item.qty);
    const itemAfterDisc = itemSub - (itemSub * (discountPercent / 100));
    return sum + (itemAfterDisc * (item.taxRate / 100));
  }, 0);
  const grandTotal = subtotalAfterDiscount + taxTotal;

  const handleCreateQuoteSubmit = (e) => {
    e.preventDefault();
    if (lineItems.length === 0) return;

    createQuote({
      customerName,
      contactPerson,
      contactEmail,
      items: lineItems,
      subtotal,
      discountPercent,
      discountAmount,
      taxTotal,
      grandTotal,
      notes,
      customLogoUrl,
      currency
    });

    setShowCreateModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#60a5fa', fontWeight: '700', textTransform: 'uppercase' }}>
            Automated Pricing, Taxes & PDF Generator
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '4px 0' }}>
            Quotation & Discount Management ({quotes.length})
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Build multi-product quotations with line-item volume discounts, VAT/GST tax calculation, manager approval flow, and instant quote-to-order conversion.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn gradient-btn-primary"
          style={{ padding: '10px 18px', borderRadius: '10px' }}
        >
          <Plus style={{ width: '18px', height: '18px' }} />
          <span>Generate New Quote</span>
        </button>
      </div>

      {/* Quotations List Table */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px' }}>Generated Quotations</h3>
        
        <div className="custom-table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Quote Reference</th>
                <th>Customer & Contact</th>
                <th>Created & Valid Until</th>
                <th>Subtotal</th>
                <th>Discount & Taxes</th>
                <th>Grand Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map(quote => (
                <tr key={quote.id}>
                  <td>
                    <code style={{ fontSize: '0.85rem', fontWeight: '800', color: '#60a5fa' }}>{quote.id}</code>
                  </td>
                  <td>
                    <div style={{ fontWeight: '700' }}>{quote.customerName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{quote.contactPerson} ({quote.contactEmail})</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.8rem' }}>Created: {quote.createdDate}</div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Valid: {quote.validUntil}</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: '600' }}>${quote.subtotal.toLocaleString()}</span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.8rem', color: '#fbbf24' }}>-{quote.discountPercent}% (${quote.discountAmount.toLocaleString()})</div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>+${quote.taxTotal.toLocaleString()} Tax</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: '800', color: '#34d399', fontSize: '0.95rem' }}>
                      ${quote.grandTotal.toLocaleString()}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${quote.status === 'Accepted' ? 'badge-emerald' : quote.status === 'Converted to Order' ? 'badge-purple' : 'badge-amber'}`}>
                      {quote.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => setPreviewQuote(quote)}
                        className="btn btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                      >
                        <Printer style={{ width: '13px', height: '13px' }} />
                        <span>PDF / View</span>
                      </button>

                      {quote.status === 'Pending Approval' && (
                        <button
                          onClick={() => approveQuote(quote.id)}
                          className="btn btn-secondary"
                          style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#34d399' }}
                        >
                          Approve
                        </button>
                      )}

                      {quote.status === 'Accepted' && (
                        <button
                          onClick={() => convertQuoteToOrder(quote.id)}
                          className="btn gradient-btn-primary"
                          style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                        >
                          <ShoppingBag style={{ width: '13px', height: '13px' }} />
                          <span>Convert to Order</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Quote Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '28px', maxWidth: '780px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '6px' }}>Dynamic Quotation & Price Calculator</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Select catalog products, adjust line-item quantities, apply volume discounts, and calculate tax automatically.
            </p>

            <form onSubmit={handleCreateQuoteSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Customer / Company</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Person</label>
                  <input
                    type="text"
                    required
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Email</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Upload Company Logo URL</label>
                  <input
                    type="text"
                    placeholder="https://example.com/logo.png"
                    value={customLogoUrl}
                    onChange={(e) => setCustomLogoUrl(e.target.value)}
                    className="form-input"
                  />
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Or leave blank to use active tenant default branding logo.
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Quotation Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="form-select"
                  >
                    <option value="USD ($)">USD ($) - US Dollar</option>
                    <option value="EUR (€)">EUR (€) - Euro</option>
                    <option value="GBP (£)">GBP (£) - British Pound</option>
                    <option value="INR (₹)">INR (₹) - Indian Rupee</option>
                    <option value="JPY (¥)">JPY (¥) - Japanese Yen</option>
                  </select>
                </div>
              </div>

              {/* Line Items Table Builder */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="form-label">Line-Item Product Selection</label>
                  <button type="button" onClick={addLineItem} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                    + Add Product Line
                  </button>
                </div>

                <div className="custom-table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Product Catalog Item</th>
                        <th style={{ width: '90px' }}>Qty</th>
                        <th style={{ width: '130px' }}>Unit Price ($)</th>
                        <th style={{ width: '90px' }}>Tax %</th>
                        <th style={{ width: '120px' }}>Total ($)</th>
                        <th style={{ width: '50px' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {lineItems.map((item, idx) => (
                        <tr key={idx}>
                          <td>
                            <select
                              value={item.productId}
                              onChange={(e) => updateLineItem(idx, 'productId', e.target.value)}
                              className="form-select"
                              style={{ width: '100%', fontSize: '0.8rem' }}
                            >
                              {products.map(p => (
                                <option key={p.id} value={p.id}>{p.name} (${p.unitPrice})</option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <input
                              type="number"
                              min="1"
                              value={item.qty}
                              onChange={(e) => updateLineItem(idx, 'qty', parseInt(e.target.value, 10) || 1)}
                              className="form-input"
                              style={{ fontSize: '0.8rem', padding: '6px' }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => updateLineItem(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                              className="form-input"
                              style={{ fontSize: '0.8rem', padding: '6px' }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={item.taxRate}
                              onChange={(e) => updateLineItem(idx, 'taxRate', parseFloat(e.target.value) || 0)}
                              className="form-input"
                              style={{ fontSize: '0.8rem', padding: '6px' }}
                            />
                          </td>
                          <td>
                            <strong style={{ fontSize: '0.85rem', color: '#34d399' }}>
                              ${(item.unitPrice * item.qty).toLocaleString()}
                            </strong>
                          </td>
                          <td>
                            <button
                              type="button"
                              onClick={() => removeLineItem(idx)}
                              style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer' }}
                            >
                              <Trash2 style={{ width: '16px', height: '16px' }} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Discount & Math Summary */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '16px', background: 'var(--bg-primary)', borderRadius: '12px', marginBottom: '20px' }}>
                <div>
                  <label className="form-label">Global Volume Discount (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                    className="form-input"
                  />
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Note: Discounts over 10% trigger mandatory Manager approval.
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Subtotal:</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fbbf24' }}>
                    <span>Discount ({discountPercent}%):</span>
                    <span>-${discountAmount.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>Estimated Tax Total:</span>
                    <span>+${taxTotal.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '1.1rem', paddingTop: '8px', borderTop: '1px solid var(--border-color)' }}>
                    <span>Grand Total:</span>
                    <span style={{ color: '#34d399' }}>${grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn gradient-btn-primary">
                  Save Quote & Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PDF / Printable Preview Modal */}
      {previewQuote && <QuotePreviewModal quote={previewQuote} onClose={() => setPreviewQuote(null)} />}

    </div>
  );
};

export default QuoteBuilder;
