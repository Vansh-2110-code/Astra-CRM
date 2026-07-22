import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { ShoppingBag, Truck, CreditCard, FileCheck, CheckCircle2, DollarSign, Package } from 'lucide-react';

const OrderInvoiceManager = () => {
  const { orders } = useCRM();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#c084fc', fontWeight: '700', textTransform: 'uppercase' }}>
            Quote-to-Order Fulfillment & Billing
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '4px 0' }}>
            Orders & Invoice Management ({orders.length})
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Track order status, warehouse fulfillment, payment collections, and automated enterprise invoices.
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div className="custom-table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Order Reference</th>
                <th>Quote Ref</th>
                <th>Customer Name</th>
                <th>Order Date</th>
                <th>Total Value ($)</th>
                <th>Payment Status</th>
                <th>Fulfillment Status</th>
                <th>Invoice Number</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>
                    <code style={{ fontSize: '0.85rem', fontWeight: '800', color: '#34d399' }}>{order.id}</code>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: '#60a5fa' }}>{order.quoteId}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: '700' }}>{order.customerName}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem' }}>{order.orderDate}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: '800', color: '#34d399', fontSize: '0.95rem' }}>
                      ${order.totalAmount.toLocaleString()}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${order.paymentStatus.includes('Paid in Full') ? 'badge-emerald' : 'badge-amber'}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: '600' }}>
                      <Truck style={{ width: '14px', height: '14px', color: '#60a5fa' }} />
                      <span>{order.deliveryStatus}</span>
                    </div>
                  </td>
                  <td>
                    <button
                      onClick={() => alert(`Viewing Official Invoice ${order.invoiceNumber} for ${order.customerName} ($${order.totalAmount.toLocaleString()})`)}
                      className="btn btn-secondary"
                      style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#c084fc' }}
                    >
                      <FileCheck style={{ width: '13px', height: '13px' }} />
                      <span>{order.invoiceNumber}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default OrderInvoiceManager;
