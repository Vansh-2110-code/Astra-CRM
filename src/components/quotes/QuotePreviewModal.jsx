import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { Printer, Download, X, CheckCircle2, ShieldCheck } from 'lucide-react';

const QuotePreviewModal = ({ quote, onClose }) => {
  const { activeTenant } = useCRM();

  const currencySymbol = quote.currency ? quote.currency.split('(')[1]?.replace(')', '') : '$';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ padding: '36px', maxWidth: '800px', background: '#ffffff', color: '#0f172a' }}>
        
        {/* Actions bar (Hidden in print) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: '800', fontSize: '1.1rem', color: '#3b82f6' }}>QUOTATION DOCUMENT PREVIEW</span>
            <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700' }}>{quote.id}</span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handlePrint} className="btn gradient-btn-primary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
              <Printer style={{ width: '15px', height: '15px' }} />
              <span>Print / Download PDF</span>
            </button>
            <button onClick={onClose} className="btn btn-secondary" style={{ padding: '6px 12px', background: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1' }}>
              <X style={{ width: '16px', height: '16px' }} />
            </button>
          </div>
        </div>

        {/* Official Invoice / Printable Layout Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img 
              src={quote.customLogoUrl || activeTenant?.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80'} 
              alt="Logo" 
              style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} 
            />
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#1e3a8a', letterSpacing: '-0.02em' }}>
                {activeTenant?.name || 'Company Workspace'}
              </h1>
              <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '2px' }}>
                {activeTenant?.industry || 'Enterprise'} • Enterprise Sales Division
              </p>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Subdomain: {activeTenant?.subdomain || 'app'}.apexcrm.io • Admin: {activeTenant?.tenantAdmin || 'Admin'}
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>OFFICIAL QUOTATION</h2>
            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#3b82f6', marginTop: '4px' }}>Quote #: {quote.id}</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>Date: {quote.createdDate}</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Valid Until: {quote.validUntil}</div>
          </div>
        </div>

        {/* Bill To & Details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '16px', background: '#f8fafc', borderRadius: '10px', marginBottom: '24px', border: '1px solid #e2e8f0' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>PREPARED FOR:</div>
            <div style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', marginTop: '4px' }}>{quote.customerName}</div>
            <div style={{ fontSize: '0.85rem', color: '#334155' }}>Attn: {quote.contactPerson}</div>
            <div style={{ fontSize: '0.85rem', color: '#334155' }}>Email: {quote.contactEmail}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>APPROVAL & PAYMENT TERMS:</div>
            <div style={{ fontSize: '0.85rem', color: '#334155', marginTop: '4px' }}>Status: <strong>{quote.status}</strong></div>
            <div style={{ fontSize: '0.85rem', color: '#334155' }}>Approved By: <strong>{quote.approvedBy || 'Pending Manager Review'}</strong></div>
            <div style={{ fontSize: '0.85rem', color: '#334155' }}>Currency: <strong>{quote.currency || 'USD ($)'}</strong></div>
          </div>
        </div>

        {/* Line Items Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#1e293b', color: '#ffffff' }}>
              <th style={{ padding: '10px 14px', textAlign: 'left' }}>Item Description</th>
              <th style={{ padding: '10px 14px', textAlign: 'center', width: '80px' }}>Qty</th>
              <th style={{ padding: '10px 14px', textAlign: 'right', width: '120px' }}>Unit Price</th>
              <th style={{ padding: '10px 14px', textAlign: 'right', width: '90px' }}>VAT %</th>
              <th style={{ padding: '10px 14px', textAlign: 'right', width: '140px' }}>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {quote.items.map((item, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '12px 14px', fontWeight: '600' }}>{item.productName}</td>
                <td style={{ padding: '12px 14px', textAlign: 'center' }}>{item.qty}</td>
                <td style={{ padding: '12px 14px', textAlign: 'right' }}>{currencySymbol}{item.unitPrice.toLocaleString()}</td>
                <td style={{ padding: '12px 14px', textAlign: 'right' }}>{item.taxRate}%</td>
                <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: '700' }}>
                  {currencySymbol}{(item.unitPrice * item.qty).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total Calculations */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '32px' }}>
          <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
              <span>Subtotal:</span>
              <span>{currencySymbol}{quote.subtotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d97706' }}>
              <span>Volume Discount ({quote.discountPercent}%):</span>
              <span>-{currencySymbol}{quote.discountAmount.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
              <span>Estimated Tax (VAT/GST):</span>
              <span>+{currencySymbol}{quote.taxTotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '1.25rem', paddingTop: '10px', borderTop: '2px solid #0f172a', color: '#0f172a' }}>
              <span>Grand Total:</span>
              <span style={{ color: '#059669' }}>{currencySymbol}{quote.grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Terms & Footer */}
        <div style={{ paddingTop: '16px', borderTop: '1px solid #cbd5e1', fontSize: '0.8rem', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: '700', color: '#334155' }}>Terms & Conditions:</div>
            <div>{quote.notes}</div>
          </div>
          <div style={{ textAlign: 'right', fontWeight: '600' }}>
            <div>Authorized Enterprise Signature</div>
            <div style={{ marginTop: '20px', color: '#3b82f6' }}>Apex CRM Verified Security Seal</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default QuotePreviewModal;
