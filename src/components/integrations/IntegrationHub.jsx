import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { Boxes, MessageSquare, Mail, CreditCard, Database, PhoneCall, CheckCircle2, RefreshCw } from 'lucide-react';

const ICON_MAP = {
  MessageSquare: MessageSquare,
  Mail: Mail,
  CreditCard: CreditCard,
  Database: Database,
  PhoneCall: PhoneCall
};

const IntegrationHub = () => {
  const { integrations, toggleIntegration } = useCRM();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: '700', textTransform: 'uppercase' }}>
            Enterprise API & Gateway Connector Hub
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '4px 0' }}>
            Integrations & Webhooks ({integrations.length})
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Manage active connectors for WhatsApp Business API, Gmail/Outlook sync, Stripe Payment Gateways, SAP ERP inventory, and Cloud Telephony.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        {integrations.map(item => {
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
                  Account: <strong style={{ color: 'var(--text-primary)' }}>{item.connectedAccount}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Last Sync: {item.lastSync}</span>
                
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
        })}
      </div>

    </div>
  );
};

export default IntegrationHub;
