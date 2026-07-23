import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Boxes, MessageSquare, Mail, CreditCard, Database, PhoneCall, CheckCircle2, RefreshCw, Plus } from 'lucide-react';

const ICON_MAP = {
  MessageSquare: MessageSquare,
  Mail: Mail,
  CreditCard: CreditCard,
  Database: Database,
  PhoneCall: PhoneCall
};

const IntegrationHub = () => {
  const { integrations, toggleIntegration, addIntegration, logAudit } = useCRM();
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Messaging & Outreach',
    details: '',
    connectedAccount: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.connectedAccount) return;

    if (addIntegration) {
      addIntegration({
        name: formData.name,
        category: formData.category,
        details: formData.details || `Custom ${formData.category} connector API integration.`,
        connectedAccount: formData.connectedAccount,
        status: 'Connected',
        lastSync: 'Just now',
        icon: formData.category.includes('Email') ? 'Mail' : formData.category.includes('Payment') ? 'CreditCard' : 'MessageSquare'
      });
    }

    if (logAudit) {
      logAudit('CREATE_INTEGRATION', formData.name, `Configured new integration: ${formData.name} (${formData.category})`, 'MEDIUM');
    }

    setShowModal(false);
    setFormData({
      name: '',
      category: 'Messaging & Outreach',
      details: '',
      connectedAccount: ''
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Enterprise API & Gateway Connector Hub
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '4px 0' }}>
            Integrations & Webhooks ({integrations.length})
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Manage active connectors for WhatsApp Business API, Gmail/Outlook sync, Stripe Payment Gateways, SAP ERP inventory, and Cloud Telephony.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn gradient-btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px' }}
        >
          <Plus style={{ width: '18px', height: '18px' }} />
          <span>Add Custom Integration</span>
        </button>
      </div>

      {/* Integrations Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        {integrations.length === 0 ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>
            <Boxes style={{ width: '48px', height: '48px', margin: '0 auto 12px auto', opacity: 0.4 }} />
            <p>No active integrations configured. Click <strong>"Add Custom Integration"</strong> above to connect an API endpoint.</p>
          </div>
        ) : (
          integrations.map(item => {
            const IconComponent = ICON_MAP[item.icon] || Boxes;
            const isConnected = item.status === 'Connected' || item.status === 'Configured';

            return (
              <div key={item.id} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ background: isConnected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px' }}>
                      <IconComponent style={{ width: '22px', height: '22px', color: isConnected ? '#34d399' : 'var(--text-muted)' }} />
                    </div>
                    <span className={`badge ${isConnected ? 'badge-emerald' : 'badge-amber'}`}>
                      {item.status}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '4px' }}>{item.name}</h3>
                  <div style={{ fontSize: '0.75rem', color: '#60a5fa', fontWeight: '600', marginBottom: '8px' }}>{item.category}</div>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                    {item.details}
                  </p>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--bg-primary)', padding: '8px 10px', borderRadius: '6px', marginBottom: '14px' }}>
                    Account / Webhook: <strong style={{ color: 'var(--text-primary)' }}>{item.connectedAccount}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Last Sync: {item.lastSync || 'Just now'}</span>
                  
                  <button
                    onClick={() => toggleIntegration(item.id)}
                    className={`btn ${isConnected ? 'btn-secondary' : 'gradient-btn-primary'}`}
                    style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                  >
                    {isConnected ? 'Disconnect' : 'Connect API'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ADD INTEGRATION MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '28px', maxWidth: '500px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)', padding: '10px', borderRadius: '12px' }}>
                <Boxes style={{ color: '#fff', width: '22px', height: '22px' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Add API Integration / Webhook</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Connect an external CRM gateway or web service.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">Integration / Service Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Slack Webhook Notifications"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">Service Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="form-select"
                >
                  <option value="Messaging & Outreach">Messaging & Outreach (WhatsApp, Slack)</option>
                  <option value="Email & Calendar">Email & Calendar (Gmail, Outlook)</option>
                  <option value="Payment Gateway">Payment Gateway (Stripe, Razorpay)</option>
                  <option value="ERP & Telephony">ERP & Telephony (SAP, Twilio)</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">Connected Account / API Webhook URL</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. https://hooks.slack.com/services/..."
                  value={formData.connectedAccount}
                  onChange={(e) => setFormData({ ...formData, connectedAccount: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">Integration Description</label>
                <textarea
                  rows="3"
                  placeholder="Briefly describe what data this API integration synchronizes..."
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn gradient-btn-primary">
                  Connect Integration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default IntegrationHub;
