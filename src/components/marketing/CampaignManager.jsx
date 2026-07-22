import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { Megaphone, Plus, TrendingUp, Users, Mail, MessageSquare, Percent } from 'lucide-react';

const CampaignManager = () => {
  const { campaigns } = useCRM();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#8b5cf6', fontWeight: '700', textTransform: 'uppercase' }}>
            Omnichannel Marketing Hub & ROI Metrics
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '4px 0' }}>
            Marketing Campaigns ({campaigns.length})
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Email and SMS outreach campaigns with open rate telemetry, click tracking, converted lead metrics, and campaign ROI.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {campaigns.map(cmp => (
          <div key={cmp.id} className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="badge badge-purple">{cmp.channel}</span>
              <span className="badge badge-emerald">{cmp.status}</span>
            </div>

            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '6px' }}>{cmp.name}</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Target: <strong>{cmp.targetAudience}</strong>
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: 'var(--bg-primary)', padding: '12px', borderRadius: '10px', marginBottom: '14px' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>OPEN RATE</div>
                <div style={{ fontWeight: '800', color: '#60a5fa', fontSize: '1.1rem' }}>{cmp.openRatePercent}%</div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CLICK RATE</div>
                <div style={{ fontWeight: '800', color: '#c084fc', fontSize: '1.1rem' }}>{cmp.clickRatePercent}%</div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CONVERTED LEADS</div>
                <div style={{ fontWeight: '800', color: '#34d399', fontSize: '1.1rem' }}>{cmp.convertedLeads} Leads</div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ESTIMATED ROI</div>
                <div style={{ fontWeight: '800', color: '#fbbf24', fontSize: '1.1rem' }}>{cmp.estimatedROI}</div>
              </div>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>
              Launched: {cmp.startDate} • {cmp.sentCount} Recipient Messages
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default CampaignManager;
