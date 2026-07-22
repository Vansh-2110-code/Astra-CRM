import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  Building,
  Plus,
  Shield,
  Zap,
  CheckCircle2,
  Users,
  CreditCard,
  Sparkles
} from 'lucide-react';

const ClientOnboardingWizard = () => {
  const { allClients, activeTenant, setActiveTenantId, onboardNewClient } = useCRM();

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    subdomain: '',
    industry: 'Enterprise Software',
    plan: 'Enterprise',
    maxSeats: 25,
    currency: 'USD ($)',
    primaryColor: '#3b82f6',
    tenantAdmin: '',
    complianceFlags: ['GDPR', 'SOC2 Type II']
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.subdomain || !formData.tenantAdmin) return;

    onboardNewClient({
      name: formData.name,
      subdomain: formData.subdomain.toLowerCase().replace(/[^a-z0-9]/g, ''),
      logo: `https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80`,
      industry: formData.industry,
      plan: formData.plan,
      maxSeats: parseInt(formData.maxSeats, 10),
      currency: formData.currency,
      primaryColor: formData.primaryColor,
      tenantAdmin: formData.tenantAdmin,
      complianceFlags: formData.complianceFlags
    });

    setShowModal(false);
    setFormData({
      name: '',
      subdomain: '',
      industry: 'Enterprise Software',
      plan: 'Enterprise',
      maxSeats: 25,
      currency: 'USD ($)',
      primaryColor: '#3b82f6',
      tenantAdmin: '',
      complianceFlags: ['GDPR', 'SOC2 Type II']
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#60a5fa', fontWeight: '700', textTransform: 'uppercase' }}>
            Multi-Tenant Client Onboarding Center
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '4px 0' }}>
            Client Organizations & Workspaces
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Provision and manage tenant accounts with isolated data scopes, custom branding, and subscription seat limits.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn gradient-btn-primary"
          style={{ padding: '10px 18px', borderRadius: '10px' }}
        >
          <Plus style={{ width: '18px', height: '18px' }} />
          <span>Onboard New Client</span>
        </button>
      </div>

      {/* Subscription Tier Info Banner */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        
        <div className="glass-card" style={{ padding: '20px', borderTop: '4px solid #8b5cf6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Starter Plan</h4>
            <span className="badge badge-purple">$99/mo</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            For growing product sales teams up to 10 seats with standard pipeline tools.
          </p>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Includes: Leads, Pipeline Kanban, Quotes, Standard Security.
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', borderTop: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Professional Plan</h4>
            <span className="badge badge-emerald">$299/mo</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            For mid-size sales ops up to 25 seats with quotation PDF builder & stock sync.
          </p>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Includes: Orders, Support Desk, WhatsApp Integration, GDPR Compliance.
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', borderTop: '4px solid #3b82f6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Enterprise Plan</h4>
            <span className="badge badge-blue">$799/mo</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            Unlimited seats, custom domain, audit logs, 2FA enforcement & SOC2 compliance.
          </p>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Includes: Multi-tenant isolation, Dedicated Account Manager, 24/7 SLA.
          </div>
        </div>

      </div>

      {/* Onboarded Clients Table */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px' }}>Active Client Organizations ({allClients.length})</h3>
        
        <div className="custom-table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Organization Name</th>
                <th>Subdomain</th>
                <th>Plan & Seats</th>
                <th>Tenant Admin</th>
                <th>Compliance & Flags</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {allClients.map(client => {
                const isActive = client.id === activeTenant.id;
                return (
                  <tr key={client.id} style={{ background: isActive ? 'rgba(59, 130, 246, 0.08)' : 'transparent' }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={client.logo} alt={client.name} style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'cover' }} />
                        <div>
                          <div style={{ fontWeight: '700' }}>{client.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{client.industry}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <code style={{ background: 'var(--bg-input)', padding: '2px 8px', borderRadius: '4px', color: '#60a5fa', fontSize: '0.8rem' }}>
                        {client.subdomain}.apexcrm.io
                      </code>
                    </td>
                    <td>
                      <div style={{ fontWeight: '700', color: client.plan === 'Enterprise' ? '#60a5fa' : client.plan === 'Professional' ? '#34d399' : '#c084fc' }}>
                        {client.plan}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {client.seats} / {client.maxSeats} seats used
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.825rem' }}>{client.tenantAdmin}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {client.complianceFlags.map(f => (
                          <span key={f} className="badge badge-purple" style={{ fontSize: '0.65rem' }}>{f}</span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-emerald">{client.status}</span>
                    </td>
                    <td>
                      <button
                        onClick={() => setActiveTenantId(client.id)}
                        className={`btn ${isActive ? 'btn-secondary' : 'gradient-btn-primary'}`}
                        style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                      >
                        {isActive ? 'Current Tenant' : 'Switch Tenant'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Onboard Client Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '6px' }}>Onboard New Client Organization</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Provision an isolated workspace for your customer with custom branding, seat allocation, and security defaults.
            </p>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                
                <div className="form-group">
                  <label className="form-label">Client Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Titan Global Logistics"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Subdomain Handle</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. titanglobal"
                    value={formData.subdomain}
                    onChange={(e) => setFormData({ ...formData, subdomain: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Industry Sector</label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="form-select"
                  >
                    <option value="Enterprise Software">Enterprise Software</option>
                    <option value="Consumer Electronics">Consumer Electronics</option>
                    <option value="Industrial Machinery">Industrial Machinery</option>
                    <option value="Healthcare & Pharma">Healthcare & Pharma</option>
                    <option value="Retail & E-commerce">Retail & E-commerce</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Subscription Tier</label>
                  <select
                    value={formData.plan}
                    onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                    className="form-select"
                  >
                    <option value="Starter">Starter (10 Seats Max)</option>
                    <option value="Professional">Professional (25 Seats Max)</option>
                    <option value="Enterprise">Enterprise (50+ Seats)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Max Seat License Limit</label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={formData.maxSeats}
                    onChange={(e) => setFormData({ ...formData, maxSeats: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Primary Admin Email</label>
                  <input
                    type="email"
                    required
                    placeholder="admin@client.com"
                    value={formData.tenantAdmin}
                    onChange={(e) => setFormData({ ...formData, tenantAdmin: e.target.value })}
                    className="form-input"
                  />
                </div>

              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn gradient-btn-primary"
                >
                  Provision & Launch Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ClientOnboardingWizard;
