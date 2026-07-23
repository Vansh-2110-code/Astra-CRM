import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  Users,
  Plus,
  Building,
  Mail,
  Lock,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Search,
  Key,
  LifeBuoy,
  FileText,
  Copy,
  Check
} from 'lucide-react';

const CustomerManager = () => {
  const { employees, createEmployee, roles, tickets, activeTenant, logAudit, currentUser } = useCRM();
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [slaFilter, setSlaFilter] = useState('ALL');
  const [copiedId, setCopiedId] = useState(null);

  // Form State for creating a customer account
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'customer123',
    company: '',
    phone: '',
    slaTier: 'Gold Tier (2hr SLA)'
  });

  // Filter employees whose role is Customer / Portal User
  const customerRoleIds = ['role-customer'];
  const customerList = employees.filter(emp => 
    emp.roleId === 'role-customer' || 
    emp.designation?.toLowerCase().includes('customer') ||
    emp.role?.toLowerCase().includes('customer')
  );

  const filteredCustomers = customerList.filter(cust => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = !query || 
      cust.name?.toLowerCase().includes(query) ||
      cust.email?.toLowerCase().includes(query) ||
      cust.designation?.toLowerCase().includes(query);
    return matchesSearch;
  });

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.company) return;

    try {
      if (createEmployee) {
        await createEmployee({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          designation: `Customer (${formData.company} • ${formData.slaTier})`,
          roleId: 'role-customer'
        });
      }

      if (logAudit) {
        logAudit('CREATE_CUSTOMER_USER', formData.email, `Created Customer Portal Login for ${formData.name} (${formData.company})`, 'MEDIUM');
      }

      alert(`Customer Portal Account Created Successfully!\n\nEmail: ${formData.email}\nPassword: ${formData.password}\n\nThe customer can now log in at the portal.`);
      
      setShowModal(false);
      setFormData({
        name: '',
        email: '',
        password: 'customer123',
        company: '',
        phone: '',
        slaTier: 'Gold Tier (2hr SLA)'
      });
    } catch (err) {
      alert(`Failed to create customer account: ${err.message}`);
    }
  };

  const copyCredentials = (email, password, id) => {
    const credText = `Portal Email: ${email}\nPassword: ${password || 'customer123'}`;
    navigator.clipboard.writeText(credText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#60a5fa', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Customer Management & Self-Service Portal
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '4px 0' }}>
            Customer Portal Accounts & User Directory
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Provision customer login accounts, assign SLA contracts, and empower clients to log in and raise tickets or track complaints.
          </p>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          className="btn gradient-btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px' }}
        >
          <Plus style={{ width: '18px', height: '18px' }} />
          <span>Create Customer Account</span>
        </button>
      </div>

      {/* Overview Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div className="glass-card" style={{ padding: '20px', borderTop: '4px solid #3b82f6' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>Registered Customers</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', margin: '6px 0', color: '#60a5fa' }}>
            {customerList.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Authorized portal users</div>
        </div>

        <div className="glass-card" style={{ padding: '20px', borderTop: '4px solid #10b981' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>Active SLA Contracts</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', margin: '6px 0', color: '#34d399' }}>
            {customerList.length > 0 ? customerList.length : 1} Gold/Platinum
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Enforced support guarantee</div>
        </div>

        <div className="glass-card" style={{ padding: '20px', borderTop: '4px solid #f59e0b' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>Open Tickets & Complaints</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', margin: '6px 0', color: '#fbbf24' }}>
            {(tickets || []).filter(t => t.status !== 'Resolved').length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>In active resolution queue</div>
        </div>

        <div className="glass-card" style={{ padding: '20px', borderTop: '4px solid #a855f7' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>Portal Security Status</div>
          <div style={{ fontSize: '1.1rem', fontWeight: '800', margin: '6px 0', color: '#c084fc', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck style={{ width: '18px', height: '18px' }} />
            <span>2FA & Encrypted</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>BOLA & Isolated Tenant Context</div>
        </div>
      </div>

      {/* Customer Directory Table Section */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        
        {/* Table Search & Filter Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '16px' }}>
          <div style={{ position: 'relative', width: '320px' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search customers by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '38px', width: '100%', fontSize: '0.825rem' }}
            />
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
            Showing <strong>{filteredCustomers.length}</strong> customer portal accounts
          </div>
        </div>

        {/* Customer Accounts Table */}
        <div className="custom-table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Login Email</th>
                <th>Designation / SLA Contract</th>
                <th>Access Role</th>
                <th>Portal Status</th>
                <th>Login Credentials</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                    No customer accounts created yet. Click <strong>"Create Customer Account"</strong> above to register your first client portal user.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(cust => (
                  <tr key={cust.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img 
                          src={cust.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"} 
                          alt={cust.name} 
                          style={{ width: '34px', height: '34px', borderRadius: '50%', border: '1.5px solid #3b82f6', objectFit: 'cover' }} 
                        />
                        <div>
                          <div style={{ fontWeight: '800', color: 'var(--text-primary)' }}>{cust.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {cust.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <code style={{ background: 'var(--bg-input)', padding: '3px 8px', borderRadius: '6px', color: '#60a5fa', fontSize: '0.8rem' }}>
                        {cust.email}
                      </code>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.825rem', fontWeight: '600' }}>{cust.designation || 'Customer Portal User'}</span>
                    </td>
                    <td>
                      <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>
                        Customer / Portal User
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>
                        Active Portal Login
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => copyCredentials(cust.email, 'admin123', cust.id)}
                        className="btn btn-secondary"
                        style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        {copiedId === cust.id ? (
                          <>
                            <Check style={{ width: '13px', height: '13px', color: '#34d399' }} />
                            <span style={{ color: '#34d399' }}>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy style={{ width: '13px', height: '13px' }} />
                            <span>Copy Login Info</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE CUSTOMER MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '28px', maxWidth: '520px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
              <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', padding: '10px', borderRadius: '12px' }}>
                <Users style={{ color: '#fff', width: '22px', height: '22px' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Create Customer Portal Account</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Set up customer login credentials for portal access & ticket submission.</p>
              </div>
            </div>

            <form onSubmit={handleCreateCustomer} style={{ marginTop: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Customer Contact Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jonathan Sterling"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Company / Client Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Corporation"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">Portal Login Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    required
                    placeholder="e.g. sterling@acmecorp.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-input"
                    style={{ paddingLeft: '38px', width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Portal Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                    <input
                      type="password"
                      required
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="form-input"
                      style={{ paddingLeft: '38px', width: '100%' }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Phone</label>
                  <div style={{ position: 'relative' }}>
                    <Phone style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      placeholder="+1 (555) 019-2831"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="form-input"
                      style={{ paddingLeft: '38px', width: '100%' }}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">Support SLA Contract Tier</label>
                <select
                  value={formData.slaTier}
                  onChange={(e) => setFormData({ ...formData, slaTier: e.target.value })}
                  className="form-select"
                >
                  <option value="Gold Tier (2hr SLA)">Gold Tier (2hr SLA Resolution Guarantee)</option>
                  <option value="Platinum Tier (1hr SLA)">Platinum Tier (1hr Priority SLA)</option>
                  <option value="Silver Tier (8hr SLA)">Silver Tier (8hr SLA Resolution)</option>
                  <option value="Standard Tier">Standard Tier (Best Effort SLA)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn gradient-btn-primary">
                  Create Customer Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CustomerManager;
