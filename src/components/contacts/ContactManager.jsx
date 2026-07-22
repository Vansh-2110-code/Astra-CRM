import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { Building2, Mail, Phone, MapPin, Tag, FileText, ShoppingBag } from 'lucide-react';

const ContactManager = () => {
  const { leads, quotes, orders } = useCRM();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#60a5fa', fontWeight: '700', textTransform: 'uppercase' }}>
            Customer 360° Account Intelligence
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '4px 0' }}>
            Contacts & Account Profiles
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Centralized profile repository for company accounts, decision-maker contacts, interaction history, and linked transactions.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        {leads.map(contact => (
          <div key={contact.id} className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '1.1rem' }}>
                {contact.name.charAt(0)}
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)' }}>{contact.name}</h3>
                <div style={{ fontSize: '0.8rem', color: '#60a5fa', fontWeight: '600' }}>{contact.company}</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail style={{ width: '14px', height: '14px', color: 'var(--text-muted)' }} />
                <span>{contact.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone style={{ width: '14px', height: '14px', color: 'var(--text-muted)' }} />
                <span>{contact.phone}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem' }}>
              <span className="badge badge-emerald">Active Account</span>
              <span style={{ color: 'var(--text-muted)' }}>Assigned: {contact.assignedTo}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ContactManager;
