import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { ShoppingBag, Truck, FileCheck, DollarSign, Printer, CheckCircle2, Eye } from 'lucide-react';

const OrderInvoiceManager = () => {
  const { orders } = useCRM();
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const formatCurrency = (val) => `$${(val || 0).toLocaleString()}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#c084fc', fontWeight: '700', textTransform: 'uppercase' }}>
            Quote-to-Order Fulfillment & Billing
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '4px 0' }}>
            Orders & Invoice Management ({(orders || []).length})
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Track order status, warehouse fulfillment, payment collections, and automated enterprise invoices.
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        {(!orders || orders.length === 0) ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <ShoppingBag style={{ width: '48px', height: '48px', marginBottom: '12px', opacity: 0.4 }} />
            <p>No orders registered yet. Generate a quotation and convert it to an order.</p>
          </div>
        ) : (
          <div className="custom-table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Order Reference</th>
                  <th>Quote Ref</th>
                  <th>Customer Name</th>
                  <th>Order Date</th>
                  <th>Total Value</th>
                  <th>Order Status</th>
                  <th>Fulfillment</th>
                  <th>Invoice</th>
                </tr>
              </thead>
              <tbody>
                {(orders || []).map(order => {
                  const orderId = order.id || order._id || 'N/A';
                  const quoteId = order.quoteId || 'N/A';
                  const customer = order.customerName || 'N/A';
                  const date = order.createdDate || order.orderDate || '';
                  const total = order.totalValue || order.totalAmount || order.grandTotal || 0;
                  const status = order.status || order.paymentStatus || 'Pending';
                  const invoiceNum = order.invoiceNumber || (order.id ? `INV-${order.id}` : 'N/A');

                  return (
                    <tr key={orderId}>
                      <td>
                        <code style={{ fontSize: '0.85rem', fontWeight: '800', color: '#34d399' }}>{orderId}</code>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8rem', color: '#60a5fa' }}>{quoteId}</span>
                      </td>
                      <td>
                        <span style={{ fontWeight: '700' }}>{customer}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8rem' }}>{date}</span>
                      </td>
                      <td>
                        <span style={{ fontWeight: '800', color: '#34d399', fontSize: '0.95rem' }}>
                          {formatCurrency(total)}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${status === 'Shipped' || status === 'Completed' || status === 'Paid' ? 'badge-emerald' : 'badge-amber'}`}>
                          {status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: '600' }}>
                          <Truck style={{ width: '14px', height: '14px', color: '#60a5fa' }} />
                          <span>{status === 'Shipped' ? 'In Transit' : 'Warehouse Processing'}</span>
                        </div>
                      </td>
                      <td>
                        <button
                          onClick={() => setSelectedInvoice({ id: invoiceNum, orderId, customer, date, total, status })}
                          className="btn btn-secondary"
                          style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#c084fc' }}
                        >
                          <FileCheck style={{ width: '13px', height: '13px' }} />
                          <span>{invoiceNum}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoice Viewer Modal */}
      {selectedInvoice && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '28px', maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Tax Invoice</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {selectedInvoice.id} • Order {selectedInvoice.orderId}
                </div>
              </div>
              <span className="badge badge-emerald">Verified Tax Invoice</span>
            </div>

            <div className="glass-card" style={{ padding: '16px', marginBottom: '16px' }}>
              <div style={{ fontWeight: '700', fontSize: '1.05rem' }}>{selectedInvoice.customer}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Invoice Date: {selectedInvoice.date} &nbsp;|&nbsp; Payment Method: Wire / Credit Card
              </div>
            </div>

            <div className="glass-card" style={{
              padding: '20px', textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
              borderRadius: '12px', marginBottom: '16px'
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Total Amount Invoiced</div>
              <div style={{ fontSize: '2rem', fontWeight: '900', color: '#34d399' }}>{formatCurrency(selectedInvoice.total)}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
              <button onClick={() => setSelectedInvoice(null)} className="btn btn-secondary">Close</button>
              <button onClick={() => window.print()} className="btn gradient-btn-primary">
                <Printer style={{ width: '14px', height: '14px' }} /> Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default OrderInvoiceManager;
