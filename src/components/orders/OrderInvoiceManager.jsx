import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { ShoppingBag, Truck, FileCheck, Printer, Plus, Trash2, X, Eye, ChevronDown, ChevronUp } from 'lucide-react';

// Indian Number System Converter (Lakhs/Crores)
const numberToWords = (num) => {
  if (num === 0) return 'Zero';
  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  const firstWord = (n) => {
    if (n < 20) return a[n];
    let ten = Math.floor(n / 10);
    let unit = n % 10;
    return b[ten] + (unit > 0 ? ' ' + a[unit] : '');
  };

  const convert = (n) => {
    let str = '';
    
    let crore = Math.floor(n / 10000000);
    n %= 10000000;
    if (crore > 0) {
      str += convert(crore) + ' Crore ';
    }
    
    let lakh = Math.floor(n / 100000);
    n %= 100000;
    if (lakh > 0) {
      str += firstWord(lakh) + ' Lakh ';
    }
    
    let thousand = Math.floor(n / 1000);
    n %= 1000;
    if (thousand > 0) {
      str += firstWord(thousand) + ' Thousand ';
    }
    
    let hundred = Math.floor(n / 100);
    n %= 100;
    if (hundred > 0) {
      str += a[hundred] + ' Hundred ';
    }
    
    if (n > 0) {
      if (str !== '') str += 'and ';
      str += firstWord(n);
    }
    
    return str.trim();
  };

  let intNum = Math.floor(num);
  return convert(intNum) + ' Only';
};

const OrderInvoiceManager = () => {
  const { orders, createOrder } = useCRM();
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSellerDetails, setShowSellerDetails] = useState(false); // Collapsible section control

  // Form State
  const [invoiceType, setInvoiceType] = useState('Tax Invoice');
  const [invoiceNumber, setInvoiceNumber] = useState(() => {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentMonth = monthNames[new Date().getMonth()];
    const currentYear = new Date().getFullYear();
    const randomNum = Math.floor(100 + Math.random() * 900);
    return `SI/${currentYear}/${currentMonth}/${randomNum}`;
  });
  const [invoiceDate, setInvoiceDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerState, setCustomerState] = useState('Karnataka');
  const [customerGstin, setCustomerGstin] = useState('');
  const [reverseCharge, setReverseCharge] = useState('N');
  const [shipping, setShipping] = useState(0);
  const [items, setItems] = useState([
    { description: '', hsnCode: '99831', unitPrice: 0, qty: 1 }
  ]);

  // Seller & Bank Account Custom Details
  const [sellerName, setSellerName] = useState('Sanna Innovations');
  const [sellerLogo, setSellerLogo] = useState('');
  const [sellerAddress, setSellerAddress] = useState('#1230, 1st Main, M.C. Layout, Vijayanagar, Bangalore - 560040');
  const [sellerWebsite, setSellerWebsite] = useState('www.sannainnovations.com');
  const [sellerGstin, setSellerGstin] = useState('29BNJPS7776J1ZW / BNJPS7776J');
  const [bankName, setBankName] = useState('Kotak Bank');
  const [bankAccountName, setBankAccountName] = useState('Sanna Innovations');
  const [bankAccountType, setBankAccountType] = useState('Current Account');
  const [bankAccountNumber, setBankAccountNumber] = useState('6450725722');
  const [bankIfscCode, setBankIfscCode] = useState('KKBK0008035');
  const [bankBranch, setBankBranch] = useState('Basaveshwaranagar, Bangalore');

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSellerLogo(reader.result); // Base64 encoding
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddItem = () => {
    setItems([...items, { description: '', hsnCode: '99831', unitPrice: 0, qty: 1 }]);
  };

  const handleRemoveItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index, field, value) => {
    const updated = items.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setItems(updated);
  };

  // Live total calculations
  const calculateTotals = () => {
    let subtotal = 0;
    let totalCgst = 0;
    let totalSgst = 0;
    
    const calculatedItems = items.map(item => {
      const netAmount = (parseFloat(item.unitPrice) || 0) * (parseInt(item.qty) || 0);
      const cgstRate = invoiceType === 'Tax Invoice' ? 9 : 0;
      const sgstRate = invoiceType === 'Tax Invoice' ? 9 : 0;
      const cgstAmount = netAmount * cgstRate / 100;
      const sgstAmount = netAmount * sgstRate / 100;
      const taxTotal = cgstAmount + sgstAmount;
      const totalAmount = netAmount + taxTotal;

      subtotal += netAmount;
      totalCgst += cgstAmount;
      totalSgst += sgstAmount;

      return {
        ...item,
        netAmount,
        cgstRate,
        sgstRate,
        cgstAmount,
        sgstAmount,
        taxTotal,
        totalAmount
      };
    });

    const taxTotal = totalCgst + totalSgst;
    const grandTotal = subtotal + taxTotal + (parseFloat(shipping) || 0);

    return {
      items: calculatedItems,
      subtotal,
      cgstAmount: totalCgst,
      sgstAmount: totalSgst,
      taxTotal,
      grandTotal
    };
  };

  const totals = calculateTotals();

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    if (!customerName.trim()) {
      alert("Please enter Customer Name.");
      return;
    }
    if (items.some(item => !item.description.trim())) {
      alert("Please fill in descriptions for all line items.");
      return;
    }

    const payload = {
      customerName,
      totalValue: totals.grandTotal,
      status: 'Paid',
      invoiceNumber,
      invoiceType,
      invoiceDate,
      customerAddress,
      customerState,
      customerGstin: invoiceType === 'Tax Invoice' ? customerGstin : '',
      reverseCharge,
      items: totals.items,
      subtotal: totals.subtotal,
      cgstAmount: totals.cgstAmount,
      sgstAmount: totals.sgstAmount,
      taxTotal: totals.taxTotal,
      shipping: parseFloat(shipping) || 0,
      grandTotal: totals.grandTotal,
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
    };

    try {
      await createOrder(payload);
      setShowCreateModal(false);
      // Reset customer specific form fields only
      setCustomerName('');
      setCustomerAddress('');
      setCustomerGstin('');
      setReverseCharge('N');
      setShipping(0);
      setItems([{ description: '', hsnCode: '99831', unitPrice: 0, qty: 1 }]);
      // Generate new invoice number
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const currentMonth = monthNames[new Date().getMonth()];
      const currentYear = new Date().getFullYear();
      const randomNum = Math.floor(100 + Math.random() * 900);
      setInvoiceNumber(`SI/${currentYear}/${currentMonth}/${randomNum}`);
    } catch (err) {
      console.error("Error generating invoice:", err);
      alert("Error saving invoice: " + err.message);
    }
  };

  const normalizeOrderToInvoice = (order) => {
    const isTax = order.invoiceType ? order.invoiceType === 'Tax Invoice' : true;
    const totalVal = order.totalValue || order.totalAmount || order.grandTotal || 0;
    const subtotal = order.subtotal !== undefined ? order.subtotal : (isTax ? totalVal / 1.18 : totalVal);
    const taxTotal = order.taxTotal !== undefined ? order.taxTotal : (isTax ? totalVal - subtotal : 0);
    const cgstAmount = order.cgstAmount !== undefined ? order.cgstAmount : (isTax ? taxTotal / 2 : 0);
    const sgstAmount = order.sgstAmount !== undefined ? order.sgstAmount : (isTax ? taxTotal / 2 : 0);

    return {
      id: order.id || 'N/A',
      invoiceNumber: order.invoiceNumber || `SI/2026/June/00${order.id?.split('-')[2] || '3'}`,
      invoiceType: order.invoiceType || 'Tax Invoice',
      invoiceDate: order.invoiceDate || order.createdDate || '2026-06-26',
      customerName: order.customerName,
      customerAddress: order.customerAddress || 'Basavanapura Main Rd, opposite Krishna Theatre, Nisarga Layout, Krishnarajapuram, Bengaluru, Karnataka 560036',
      customerState: order.customerState || 'Karnataka',
      customerGstin: order.customerGstin || (isTax ? '29AAZFG6023C1Z6' : ''),
      reverseCharge: order.reverseCharge || 'N',
      items: (order.items && order.items.length > 0) ? order.items : [
        {
          description: 'Astra CRM Enterprise SaaS Software License Suite',
          hsnCode: '99831',
          unitPrice: subtotal,
          qty: 1,
          netAmount: subtotal,
          cgstRate: isTax ? 9 : 0,
          cgstAmount: cgstAmount,
          sgstRate: isTax ? 9 : 0,
          sgstAmount: sgstAmount,
          taxTotal: taxTotal,
          totalAmount: totalVal
        }
      ],
      subtotal: subtotal,
      cgstAmount: cgstAmount,
      sgstAmount: sgstAmount,
      taxTotal: taxTotal,
      shipping: order.shipping || 0,
      grandTotal: totalVal,
      sellerName: order.sellerName || 'Sanna Innovations',
      sellerLogo: order.sellerLogo || null,
      sellerAddress: order.sellerAddress || '#1230, 1st Main, M.C. Layout, Vijayanagar, Bangalore - 560040',
      sellerWebsite: order.sellerWebsite || 'www.sannainnovations.com',
      sellerGstin: order.sellerGstin || '29BNJPS7776J1ZW / BNJPS7776J',
      bankName: order.bankName || 'Kotak Bank',
      bankAccountName: order.bankAccountName || 'Sanna Innovations',
      bankAccountType: order.bankAccountType || 'Current Account',
      bankAccountNumber: order.bankAccountNumber || '6450725722',
      bankIfscCode: order.bankIfscCode || 'KKBK0008035',
      bankBranch: order.bankBranch || 'Basaveshwaranagar, Bangalore'
    };
  };

  const formatCurrency = (val) => `₹${(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const activeInvoice = selectedInvoice ? normalizeOrderToInvoice(selectedInvoice) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* CSS style injected to support print layouts cleanly */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden !important;
          }
          .print-area, .print-area * {
            visibility: visible !important;
          }
          .print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            background: white !important;
            color: black !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            transform: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}} />

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
            Track order status, generate customizable Cash or Tax invoices with custom logos & accounts, and print compliant bills.
          </p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)} 
          className="btn gradient-btn-primary"
          style={{ gap: '8px' }}
        >
          <Plus style={{ width: '16px', height: '16px' }} />
          <span>Generate New Invoice</span>
        </button>
      </div>

      {/* Orders Table */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        {(!orders || orders.length === 0) ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <ShoppingBag style={{ width: '48px', height: '48px', marginBottom: '12px', opacity: 0.4 }} />
            <p>No orders registered yet. Generate a quotation and convert it to an order, or create a new invoice directly.</p>
          </div>
        ) : (
          <div className="custom-table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Order Reference</th>
                  <th>Customer Name</th>
                  <th>Order Date</th>
                  <th>Invoice No</th>
                  <th>Type</th>
                  <th>Total Value</th>
                  <th>Status</th>
                  <th>Fulfillment</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {(orders || []).map(order => {
                  const orderId = order.id || 'N/A';
                  const customer = order.customerName || 'N/A';
                  const date = order.createdDate || order.orderDate || '';
                  const total = order.totalValue || order.totalAmount || order.grandTotal || 0;
                  const status = order.status || 'Pending';
                  const invoiceNum = order.invoiceNumber || `SI/2026/June/00${order.id?.split('-')[2] || '3'}`;
                  const type = order.invoiceType || 'Tax Invoice';

                  return (
                    <tr key={orderId}>
                      <td>
                        <code style={{ fontSize: '0.85rem', fontWeight: '800', color: '#34d399' }}>{orderId}</code>
                      </td>
                      <td>
                        <span style={{ fontWeight: '700' }}>{customer}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8rem' }}>{date}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem', color: '#60a5fa', fontWeight: '600' }}>{invoiceNum}</span>
                      </td>
                      <td>
                        <span className={`badge ${type === 'Tax Invoice' ? 'badge-blue' : 'badge-purple'}`} style={{ fontSize: '0.7rem' }}>
                          {type}
                        </span>
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
                          onClick={() => setSelectedInvoice(order)}
                          className="btn btn-secondary"
                          style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Eye style={{ width: '12px', height: '12px' }} />
                          <span>View Bill</span>
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

      {/* Invoice Creator Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '24px', maxWidth: '780px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Generate New Invoice & Order</h3>
              <button onClick={() => setShowCreateModal(false)} className="btn-close" style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                           {/* Seller & Bank Details (Fully visible by default) */}
              <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(255, 255, 255, 0.02)' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#c084fc', margin: '0 0 4px 0' }}>🏢 Seller Company Details</h4>
                
                {/* Company info row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Company Name (Seller)</label>
                    <input 
                      type="text" 
                      value={sellerName} 
                      onChange={(e) => setSellerName(e.target.value)}
                      className="form-input" 
                      required 
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Company GSTIN/PAN</label>
                    <input 
                      type="text" 
                      value={sellerGstin} 
                      onChange={(e) => setSellerGstin(e.target.value)}
                      className="form-input" 
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Website URL</label>
                    <input 
                      type="text" 
                      value={sellerWebsite} 
                      onChange={(e) => setSellerWebsite(e.target.value)}
                      className="form-input" 
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Company Logo</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleLogoUpload} 
                        style={{ fontSize: '0.7rem', color: 'var(--text-primary)', width: '150px' }} 
                      />
                      {sellerLogo && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <img src={sellerLogo} style={{ height: '24px', maxWidth: '40px', objectFit: 'contain', border: '1px solid var(--border-color)', borderRadius: '3px' }} alt="Preview" />
                          <button type="button" onClick={() => setSellerLogo('')} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.65rem', cursor: 'pointer' }}>Clear</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Company Full Address</label>
                  <input 
                    type="text" 
                    value={sellerAddress} 
                    onChange={(e) => setSellerAddress(e.target.value)}
                    className="form-input" 
                  />
                </div>

                {/* Bank Details block */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '4px' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: '800', marginBottom: '8px', color: '#c084fc' }}>🏦 Bank Account Details</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Bank Name</label>
                      <input 
                        type="text" 
                        value={bankName} 
                        onChange={(e) => setBankName(e.target.value)}
                        className="form-input" 
                        style={{ padding: '6px', fontSize: '0.8rem' }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Account Holder Name</label>
                      <input 
                        type="text" 
                        value={bankAccountName} 
                        onChange={(e) => setBankAccountName(e.target.value)}
                        className="form-input" 
                        style={{ padding: '6px', fontSize: '0.8rem' }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Account Type</label>
                      <input 
                        type="text" 
                        value={bankAccountType} 
                        onChange={(e) => setBankAccountType(e.target.value)}
                        className="form-input" 
                        style={{ padding: '6px', fontSize: '0.8rem' }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Account Number</label>
                      <input 
                        type="text" 
                        value={bankAccountNumber} 
                        onChange={(e) => setBankAccountNumber(e.target.value)}
                        className="form-input" 
                        style={{ padding: '6px', fontSize: '0.8rem' }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--text-secondary)' }}>IFSC Code</label>
                      <input 
                        type="text" 
                        value={bankIfscCode} 
                        onChange={(e) => setBankIfscCode(e.target.value)}
                        className="form-input" 
                        style={{ padding: '6px', fontSize: '0.8rem' }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Branch Name</label>
                      <input 
                        type="text" 
                        value={bankBranch} 
                        onChange={(e) => setBankBranch(e.target.value)}
                        className="form-input" 
                        style={{ padding: '6px', fontSize: '0.8rem' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Invoice Type</label>
                  <select 
                    value={invoiceType} 
                    onChange={(e) => setInvoiceType(e.target.value)}
                    className="form-input"
                    style={{ background: 'var(--card-bg-light)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', padding: '8px' }}
                  >
                    <option value="Tax Invoice">Tax Invoice</option>
                    <option value="Cash Bill">Cash Bill</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Invoice Number</label>
                  <input 
                    type="text" 
                    value={invoiceNumber} 
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="form-input" 
                    required 
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Invoice Date</label>
                  <input 
                    type="date" 
                    value={invoiceDate} 
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="form-input" 
                    required 
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Customer Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Thanu Tools Solutions"
                    value={customerName} 
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="form-input" 
                    required 
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Customer State</label>
                  <input 
                    type="text" 
                    value={customerState} 
                    onChange={(e) => setCustomerState(e.target.value)}
                    className="form-input" 
                    required 
                  />
                </div>

                {invoiceType === 'Tax Invoice' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Customer GSTIN</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 29AAZFG6023C1Z6"
                      value={customerGstin} 
                      onChange={(e) => setCustomerGstin(e.target.value)}
                      className="form-input" 
                    />
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Reverse Charge (Y/N)</label>
                  <select 
                    value={reverseCharge} 
                    onChange={(e) => setReverseCharge(e.target.value)}
                    className="form-input"
                    style={{ background: 'var(--card-bg-light)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', padding: '8px' }}
                  >
                    <option value="N">N</option>
                    <option value="Y">Y</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Shipping Charge (₹)</label>
                  <input 
                    type="number" 
                    min="0"
                    value={shipping} 
                    onChange={(e) => setShipping(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="form-input" 
                  />
                </div>

              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Customer Full Address</label>
                <textarea 
                  placeholder="Street address, block, building details..."
                  value={customerAddress} 
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="form-input"
                  style={{ height: '50px', resize: 'none', padding: '8px' }}
                />
              </div>

              {/* Line Items Builder */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700' }}>Line Items</h4>
                  <button 
                    type="button" 
                    onClick={handleAddItem}
                    className="btn btn-secondary"
                    style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Plus style={{ width: '12px', height: '12px' }} /> Add Item
                  </button>
                </div>

                <div style={{ overflowX: 'auto', maxHeight: '180px' }}>
                  <table className="custom-table" style={{ fontSize: '0.8rem' }}>
                    <thead>
                      <tr>
                        <th style={{ width: '40%' }}>Description</th>
                        <th style={{ width: '15%' }}>HSN/SAC</th>
                        <th style={{ width: '20%' }}>Unit Price (₹)</th>
                        <th style={{ width: '15%' }}>Qty</th>
                        <th style={{ width: '10%' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, idx) => (
                        <tr key={idx}>
                          <td>
                            <input 
                              type="text" 
                              required 
                              placeholder="e.g. Brochure Design Balance"
                              value={item.description}
                              onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                              className="form-input"
                              style={{ padding: '6px', fontSize: '0.8rem' }}
                            />
                          </td>
                          <td>
                            <input 
                              type="text" 
                              required
                              value={item.hsnCode}
                              onChange={(e) => handleItemChange(idx, 'hsnCode', e.target.value)}
                              className="form-input"
                              style={{ padding: '6px', fontSize: '0.8rem' }}
                            />
                          </td>
                          <td>
                            <input 
                              type="number" 
                              min="0"
                              required
                              value={item.unitPrice}
                              onChange={(e) => handleItemChange(idx, 'unitPrice', Math.max(0, parseFloat(e.target.value) || 0))}
                              className="form-input"
                              style={{ padding: '6px', fontSize: '0.8rem' }}
                            />
                          </td>
                          <td>
                            <input 
                              type="number" 
                              min="1"
                              required
                              value={item.qty}
                              onChange={(e) => handleItemChange(idx, 'qty', Math.max(1, parseInt(e.target.value) || 1))}
                              className="form-input"
                              style={{ padding: '6px', fontSize: '0.8rem' }}
                            />
                          </td>
                          <td>
                            <button 
                              type="button" 
                              onClick={() => handleRemoveItem(idx)}
                              disabled={items.length <= 1}
                              className="btn btn-secondary"
                              style={{ padding: '6px', color: '#ef4444', opacity: items.length <= 1 ? 0.4 : 1 }}
                            >
                              <Trash2 style={{ width: '14px', height: '14px' }} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary calculations */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--card-bg-light)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  CGST: 9% | SGST: 9% (Only applicable to Tax Invoices)
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem' }}>Subtotal: <strong>{formatCurrency(totals.subtotal)}</strong></div>
                  {invoiceType === 'Tax Invoice' && (
                    <div style={{ fontSize: '0.85rem', color: '#60a5fa' }}>CGST (9%) + SGST (9%): <strong>{formatCurrency(totals.taxTotal)}</strong></div>
                  )}
                  {shipping > 0 && <div style={{ fontSize: '0.85rem' }}>Shipping: <strong>{formatCurrency(shipping)}</strong></div>}
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#34d399', borderTop: '1px solid var(--border-color)', paddingTop: '4px', marginTop: '4px' }}>
                    Grand Total: {formatCurrency(totals.grandTotal)}
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn gradient-btn-primary">Save Order & Generate Bill</button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Invoice Viewer Modal */}
      {selectedInvoice && activeInvoice && (
        <div className="modal-overlay">
          <div className="modal-content print-area" style={{ 
            padding: '40px', 
            maxWidth: '920px', 
            width: '100%', 
            background: '#ffffff', 
            color: '#1f2937', 
            fontFamily: 'sans-serif',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
            borderRadius: '8px'
          }}>
            
            {/* Close & Print Buttons for UI only */}
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' }}>
              <span style={{ fontWeight: '700', fontSize: '1rem', color: '#374151' }}>Invoice Preview Panel</span>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => window.print()} className="btn gradient-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Printer style={{ width: '16px', height: '16px' }} /> Print Invoice
                </button>
                <button onClick={() => setSelectedInvoice(null)} className="btn btn-secondary" style={{ color: '#ef4444' }}>
                  Close
                </button>
              </div>
            </div>

            {/* Print Area Contents */}
            <div style={{ border: '1px solid #9ca3af', padding: '16px' }}>
              
              {/* Header Top Section (Logo and Title table) */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                {/* Logo & Company details */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  
                  {/* Dynamic Logo Rendering */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '140px', border: '1px solid #e5e7eb', padding: '8px', borderRadius: '4px', background: '#fafafa' }}>
                    {activeInvoice.sellerLogo ? (
                      <img src={activeInvoice.sellerLogo} style={{ maxHeight: '55px', maxWidth: '120px', objectFit: 'contain', marginBottom: '4px' }} alt="Logo" />
                    ) : (
                      <>
                        <div style={{ background: 'linear-gradient(135deg, #ef4444, #b91c1c)', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', border: '2px solid #eab308', alignSelf: 'center' }}>
                          <span style={{ color: '#eab308', fontSize: '1.5rem', fontWeight: '800', fontFamily: 'sans-serif', lineHeight: '44px', textAlign: 'center' }}>
                            {activeInvoice.sellerName?.charAt(0) || 'S'}
                          </span>
                        </div>
                        <div style={{ color: '#b91c1c', fontWeight: '900', fontSize: '1.1rem', letterSpacing: '1px', marginTop: '4px', fontFamily: 'sans-serif', lineHeight: 1, textTransform: 'uppercase', textAlign: 'center' }}>
                          {activeInvoice.sellerName?.split(' ')[0] || 'SANNA'}
                        </div>
                        <div style={{ color: '#22c55e', fontWeight: '700', fontSize: '0.5rem', letterSpacing: '2px', fontFamily: 'sans-serif', lineHeight: 1, marginTop: '2px', textTransform: 'uppercase', textAlign: 'center' }}>
                          {activeInvoice.sellerName?.split(' ').slice(1).join(' ') || 'INNOVATIONS'}
                        </div>
                      </>
                    )}
                    <div style={{ color: '#6b7280', fontStyle: 'italic', fontSize: '0.45rem', marginTop: '2px' }}>Delivering Reality...</div>
                  </div>

                </div>

                {/* Billing Metadata Grid */}
                <div style={{ width: '320px', border: '1px solid #9ca3af', borderCollapse: 'collapse' }}>
                  <div style={{ background: '#b91c1c', color: 'white', fontWeight: '800', textAlign: 'center', padding: '6px', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {activeInvoice.invoiceType}
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                    <tbody>
                      <tr style={{ borderTop: '1px solid #9ca3af' }}>
                        <td style={{ padding: '6px', fontWeight: '700', borderRight: '1px solid #9ca3af', width: '40%' }}>Invoice Date</td>
                        <td style={{ padding: '6px' }}>{activeInvoice.invoiceDate}</td>
                      </tr>
                      <tr style={{ borderTop: '1px solid #9ca3af' }}>
                        <td style={{ padding: '6px', fontWeight: '700', borderRight: '1px solid #9ca3af' }}>Invoice No</td>
                        <td style={{ padding: '6px', fontWeight: '700' }}>{activeInvoice.invoiceNumber}</td>
                      </tr>
                      <tr style={{ borderTop: '1px solid #9ca3af' }}>
                        <td style={{ padding: '6px', fontWeight: '700', borderRight: '1px solid #9ca3af' }}>GSTIN/PAN</td>
                        <td style={{ padding: '6px', fontSize: '0.7rem' }}>{activeInvoice.sellerGstin}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Customer Details Block */}
              <div style={{ border: '1px solid #9ca3af', marginBottom: '20px' }}>
                <div style={{ background: '#b91c1c', color: 'white', fontWeight: '700', padding: '6px', fontSize: '0.8rem' }}>
                  Customer:
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '6px', fontWeight: '700', borderRight: '1px solid #9ca3af', width: '150px' }}>Name:</td>
                      <td style={{ padding: '6px', fontWeight: '700' }}>{activeInvoice.customerName}</td>
                    </tr>
                    <tr style={{ borderTop: '1px solid #9ca3af' }}>
                      <td style={{ padding: '6px', fontWeight: '700', borderRight: '1px solid #9ca3af' }}>Address:</td>
                      <td style={{ padding: '6px', fontSize: '0.75rem', whiteSpace: 'pre-wrap' }}>{activeInvoice.customerAddress}</td>
                    </tr>
                    <tr style={{ borderTop: '1px solid #9ca3af' }}>
                      <td style={{ padding: '6px', fontWeight: '700', borderRight: '1px solid #9ca3af' }}>State :</td>
                      <td style={{ padding: '6px', color: '#1d4ed8', fontWeight: '700' }}>{activeInvoice.customerState}</td>
                    </tr>
                    <tr style={{ borderTop: '1px solid #9ca3af' }}>
                      <td style={{ padding: '6px', fontWeight: '700', borderRight: '1px solid #9ca3af' }}>GSTIN:</td>
                      <td style={{ padding: '6px', fontWeight: '700' }}>{activeInvoice.customerGstin || 'N/A'}</td>
                    </tr>
                    <tr style={{ borderTop: '1px solid #9ca3af' }}>
                      <td style={{ padding: '6px', fontWeight: '700', borderRight: '1px solid #9ca3af' }}>Reverse Charge (Y/N):</td>
                      <td style={{ padding: '6px', fontWeight: '700' }}>{activeInvoice.reverseCharge}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Line Items Main Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #9ca3af', fontSize: '0.75rem', marginBottom: '20px' }}>
                <thead>
                  <tr style={{ background: '#b91c1c', color: 'white', fontWeight: '700' }}>
                    <th style={{ padding: '8px', border: '1px solid #9ca3af', width: '5%', textAlign: 'center' }}>SL No.</th>
                    <th style={{ padding: '8px', border: '1px solid #9ca3af', width: '30%', textAlign: 'left' }}>Description</th>
                    <th style={{ padding: '8px', border: '1px solid #9ca3af', width: '10%', textAlign: 'center' }}>HSN/SAC Code</th>
                    <th style={{ padding: '8px', border: '1px solid #9ca3af', width: '10%', textAlign: 'right' }}>Unite price</th>
                    <th style={{ padding: '8px', border: '1px solid #9ca3af', width: '5%', textAlign: 'center' }}>Qty</th>
                    <th style={{ padding: '8px', border: '1px solid #9ca3af', width: '10%', textAlign: 'right' }}>Net Amount</th>
                    <th style={{ padding: '8px', border: '1px solid #9ca3af', width: '10%', textAlign: 'center' }} colSpan="2">CGST</th>
                    <th style={{ padding: '8px', border: '1px solid #9ca3af', width: '10%', textAlign: 'center' }} colSpan="2">SGST</th>
                    <th style={{ padding: '8px', border: '1px solid #9ca3af', width: '10%', textAlign: 'right' }}>Total Tax Amount</th>
                    <th style={{ padding: '8px', border: '1px solid #9ca3af', width: '10%', textAlign: 'right' }}>Total Amount</th>
                  </tr>
                  <tr style={{ background: '#f3f4f6', color: '#374151' }}>
                    <th colSpan="6" style={{ border: '1px solid #9ca3af' }}></th>
                    <th style={{ padding: '4px', border: '1px solid #9ca3af', textAlign: 'center', width: '4%' }}>%</th>
                    <th style={{ padding: '4px', border: '1px solid #9ca3af', textAlign: 'right', width: '6%' }}>Amount</th>
                    <th style={{ padding: '4px', border: '1px solid #9ca3af', textAlign: 'center', width: '4%' }}>%</th>
                    <th style={{ padding: '4px', border: '1px solid #9ca3af', textAlign: 'right', width: '6%' }}>Amount</th>
                    <th colSpan="2" style={{ border: '1px solid #9ca3af' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {activeInvoice.items.map((item, index) => {
                    const netAmount = item.netAmount || (item.unitPrice * item.qty);
                    const isTax = activeInvoice.invoiceType === 'Tax Invoice';
                    const cgstPercent = isTax ? (item.cgstRate !== undefined ? item.cgstRate : 9) : 0;
                    const sgstPercent = isTax ? (item.sgstRate !== undefined ? item.sgstRate : 9) : 0;
                    const cgstAmt = item.cgstAmount || (isTax ? netAmount * 0.09 : 0);
                    const sgstAmt = item.sgstAmount || (isTax ? netAmount * 0.09 : 0);
                    const totalTax = item.taxTotal || (cgstAmt + sgstAmt);
                    const totalAmount = item.totalAmount || (netAmount + totalTax);

                    return (
                      <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '8px', border: '1px solid #9ca3af', textAlign: 'center' }}>{index + 1}</td>
                        <td style={{ padding: '8px', border: '1px solid #9ca3af', textAlign: 'left', fontWeight: '600' }}>{item.description || item.productName}</td>
                        <td style={{ padding: '8px', border: '1px solid #9ca3af', textAlign: 'center' }}>{item.hsnCode || '99831'}</td>
                        <td style={{ padding: '8px', border: '1px solid #9ca3af', textAlign: 'right' }}>{item.unitPrice?.toFixed(2)}</td>
                        <td style={{ padding: '8px', border: '1px solid #9ca3af', textAlign: 'center' }}>{item.qty}</td>
                        <td style={{ padding: '8px', border: '1px solid #9ca3af', textAlign: 'right' }}>{netAmount.toFixed(2)}</td>
                        <td style={{ padding: '8px', border: '1px solid #9ca3af', textAlign: 'center' }}>{cgstPercent}%</td>
                        <td style={{ padding: '8px', border: '1px solid #9ca3af', textAlign: 'right' }}>{cgstAmt.toFixed(2)}</td>
                        <td style={{ padding: '8px', border: '1px solid #9ca3af', textAlign: 'center' }}>{sgstPercent}%</td>
                        <td style={{ padding: '8px', border: '1px solid #9ca3af', textAlign: 'right' }}>{sgstAmt.toFixed(2)}</td>
                        <td style={{ padding: '8px', border: '1px solid #9ca3af', textAlign: 'right' }}>{totalTax.toFixed(2)}</td>
                        <td style={{ padding: '8px', border: '1px solid #9ca3af', textAlign: 'right', fontWeight: '700' }}>{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      </tr>
                    );
                  })}
                  {/* Totals Row */}
                  <tr style={{ background: '#f3f4f6', fontWeight: '700' }}>
                    <td colSpan="5" style={{ padding: '8px', border: '1px solid #9ca3af', textAlign: 'right' }}>Total:</td>
                    <td style={{ padding: '8px', border: '1px solid #9ca3af', textAlign: 'right' }}>{activeInvoice.subtotal?.toFixed(2)}</td>
                    <td style={{ border: '1px solid #9ca3af' }}></td>
                    <td style={{ padding: '8px', border: '1px solid #9ca3af', textAlign: 'right' }}>{activeInvoice.cgstAmount?.toFixed(2)}</td>
                    <td style={{ border: '1px solid #9ca3af' }}></td>
                    <td style={{ padding: '8px', border: '1px solid #9ca3af', textAlign: 'right' }}>{activeInvoice.sgstAmount?.toFixed(2)}</td>
                    <td style={{ padding: '8px', border: '1px solid #9ca3af', textAlign: 'right' }}>{activeInvoice.taxTotal?.toFixed(2)}</td>
                    <td style={{ padding: '8px', border: '1px solid #9ca3af', textAlign: 'right', background: '#e5e7eb', color: '#1f2937' }}>
                      {formatCurrency(activeInvoice.grandTotal - activeInvoice.shipping)}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Amount In Words & Final Calculations */}
              <div style={{ display: 'flex', border: '1px solid #9ca3af', marginBottom: '20px' }}>
                <div style={{ flex: 1, padding: '8px', borderRight: '1px solid #9ca3af' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#b91c1c' }}>Amount In words :</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '800', marginTop: '4px' }}>
                    {numberToWords(activeInvoice.grandTotal)}
                  </div>
                </div>
                <div style={{ width: '320px', fontSize: '0.8rem' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      <tr>
                        <td style={{ padding: '6px', fontWeight: '700', borderRight: '1px solid #9ca3af', width: '50%' }}>Subtotal</td>
                        <td style={{ padding: '6px', textAlign: 'right', fontWeight: '700' }}>{formatCurrency(activeInvoice.subtotal)}</td>
                      </tr>
                      <tr style={{ borderTop: '1px solid #9ca3af' }}>
                        <td style={{ padding: '6px', fontWeight: '700', borderRight: '1px solid #9ca3af' }}>Shipping</td>
                        <td style={{ padding: '6px', textAlign: 'right' }}>{formatCurrency(activeInvoice.shipping)}</td>
                      </tr>
                      <tr style={{ borderTop: '1px solid #9ca3af', background: '#f3f4f6' }}>
                        <td style={{ padding: '6px', fontWeight: '800', borderRight: '1px solid #9ca3af' }}>Total</td>
                        <td style={{ padding: '6px', textAlign: 'right', fontWeight: '900', color: '#b91c1c', fontSize: '0.95rem' }}>{formatCurrency(activeInvoice.grandTotal)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Terms and Conditions & Account Sign off */}
              <div style={{ borderTop: '1px solid #9ca3af', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#4b5563' }}>
                <div style={{ width: '60%' }}>
                  <div style={{ fontWeight: '700', textDecoration: 'underline', marginBottom: '4px', color: '#1f2937' }}>Terms & Conditions:</div>
                  <div style={{ display: 'flex', gap: '24px' }}>
                    <div>
                      <div><strong>Invoice</strong>: Invoice will be submitted as per actuals.</div>
                      <div><strong>Prices</strong>: FOR India Only</div>
                    </div>
                  </div>
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ fontWeight: '700', color: '#1f2937' }}>Account Details</div>
                    <div>{activeInvoice.bankName}</div>
                    <div>Account Name- {activeInvoice.bankAccountName}</div>
                    <div>Account Type- {activeInvoice.bankAccountType}</div>
                    <div>Account Number : {activeInvoice.bankAccountNumber}</div>
                    <div>IFSC Code: {activeInvoice.bankIfscCode}</div>
                    <div>Branch : {activeInvoice.bankBranch}</div>
                  </div>
                </div>

                <div style={{ width: '35%', display: 'flex', flexDirection: 'column', alignSelf: 'stretch', justifyContent: 'space-between', alignItems: 'flex-end', textAlign: 'right' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#1f2937' }}>
                      For <span style={{ color: '#b91c1c', textTransform: 'uppercase' }}>{activeInvoice.sellerName}</span>
                    </div>
                    {/* Simulated Signature Line */}
                    <div style={{ height: '36px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', width: '120px', borderBottom: '1px dashed #9ca3af', marginBottom: '2px', position: 'relative' }}>
                      <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', color: '#1d4ed8', fontSize: '1rem', fontWeight: 'bold', transform: 'rotate(-4deg)', display: 'block', position: 'absolute', bottom: '2px' }}>
                        {activeInvoice.sellerName?.charAt(0) || 'S'}
                        {activeInvoice.sellerName?.split(' ')[1]?.charAt(0) || 'A'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.6rem', fontWeight: '700' }}>Authorised Signatory</div>
                  </div>
                </div>
              </div>

              {/* Bottom red address footer banner */}
              <div style={{ background: '#b91c1c', color: 'white', padding: '8px', textAlign: 'center', fontSize: '0.7rem', fontWeight: '700', marginTop: '20px', borderRadius: '2px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <span>{activeInvoice.sellerAddress}</span>
                <span>|</span>
                <a href={`https://${activeInvoice.sellerWebsite}`} target="_blank" rel="noreferrer" style={{ color: 'white', textDecoration: 'none' }}>{activeInvoice.sellerWebsite}</a>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default OrderInvoiceManager;
