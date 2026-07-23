import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  Kanban,
  Plus,
  DollarSign,
  Calendar,
  User,
  Shield,
  Layers,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

const STAGES = [
  { id: 'Lead', label: 'Lead Intake', color: '#60a5fa' },
  { id: 'Qualified', label: 'Qualified Opportunity', color: '#06b6d4' },
  { id: 'Need Analysis', label: 'Need Analysis', color: '#8b5cf6' },
  { id: 'Proposal Sent', label: 'Proposal Sent', color: '#f59e0b' },
  { id: 'Negotiation', label: 'Negotiation', color: '#ec4899' },
  { id: 'Won', label: 'Closed Won', color: '#10b981' },
  { id: 'Lost', label: 'Closed Lost', color: '#f43f5e' },
];

const KanbanBoard = () => {
  const { deals, updateDealStage, createDeal } = useCRM();
  const [activePipeline, setActivePipeline] = useState('pipe-enterprise');
  const [showAddDealModal, setShowAddDealModal] = useState(false);
  const [newDealForm, setNewDealForm] = useState({
    title: '',
    company: '',
    contactName: '',
    dealValue: 0,
    expectedCloseDate: '',
    owner: '',
    competitors: '',
    productsInterested: ''
  });

  // Calculate total weighted forecast revenue
  const totalWeightedForecast = deals.reduce((sum, d) => sum + (d.dealValue * (d.probability / 100)), 0);

  const handleAddDealSubmit = (e) => {
    e.preventDefault();
    if (!newDealForm.title || !newDealForm.company) return;

    createDeal({
      title: newDealForm.title,
      company: newDealForm.company,
      contactName: newDealForm.contactName || 'Lead Executive',
      pipelineId: activePipeline,
      dealValue: parseFloat(newDealForm.dealValue) || 100000,
      expectedCloseDate: newDealForm.expectedCloseDate,
      owner: newDealForm.owner,
      competitors: newDealForm.competitors.split(',').map(c => c.trim()),
      productsInterested: newDealForm.productsInterested.split(',').map(p => p.trim()),
      lastActivity: 'Opportunity created on Kanban pipeline.'
    });

    setShowAddDealModal(false);
    setNewDealForm({
      title: '',
      company: '',
      contactName: '',
      dealValue: 120000,
      expectedCloseDate: '2026-08-30',
      owner: 'Alex Rivera',
      competitors: 'Dell, Cisco',
      productsInterested: 'OmniHub 4K Server'
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#c084fc', fontWeight: '700', textTransform: 'uppercase' }}>
            Multi-Pipeline Visual Sales Management
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '4px 0' }}>
            Interactive Sales Pipeline Kanban
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Drag and drop deals across lifecycle stages to dynamically update win probability & expected revenue forecasts.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* Pipeline Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-primary)', padding: '6px 12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <Layers style={{ width: '16px', height: '16px', color: '#60a5fa' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>Pipeline:</span>
            <select
              value={activePipeline}
              onChange={(e) => setActivePipeline(e.target.value)}
              className="form-select"
              style={{ fontSize: '0.8rem', border: 'none', background: 'transparent' }}
            >
              <option value="pipe-enterprise">Enterprise Hardware & Cloud Pipeline</option>
              <option value="pipe-smb">SMB Retail POS Direct Pipeline</option>
              <option value="pipe-renewal">Annual Renewal & Upsell Pipeline</option>
            </select>
          </div>

          <button
            onClick={() => setShowAddDealModal(true)}
            className="btn gradient-btn-primary"
            style={{ borderRadius: '10px' }}
          >
            <Plus style={{ width: '18px', height: '18px' }} />
            <span>New Opportunity</span>
          </button>
        </div>
      </div>

      {/* Weighted Revenue Forecast Banner */}
      <div className="glass-card" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '10px', borderRadius: '12px' }}>
            <TrendingUp style={{ color: '#60a5fa', width: '22px', height: '22px' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#60a5fa', textTransform: 'uppercase' }}>
              WEIGHTED SALES FORECAST
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)' }}>
              ${Math.round(totalWeightedForecast).toLocaleString()} USD
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '24px', fontSize: '0.825rem' }}>
          <div>
            <div style={{ color: 'var(--text-muted)' }}>Total Pipeline Value:</div>
            <div style={{ fontWeight: '800', color: 'var(--text-primary)' }}>
              ${deals.reduce((sum, d) => sum + d.dealValue, 0).toLocaleString()}
            </div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)' }}>Active Opportunities:</div>
            <div style={{ fontWeight: '800', color: '#34d399' }}>
              {deals.filter(d => d.stage !== 'Won' && d.stage !== 'Lost').length} Active
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board Columns Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${STAGES.length}, minmax(280px, 1fr))`,
        gap: '16px',
        overflowX: 'auto',
        paddingBottom: '16px'
      }}>
        {STAGES.map(stage => {
          const stageDeals = deals.filter(d => d.stage === stage.id && d.pipelineId === activePipeline);
          const stageTotalValue = stageDeals.reduce((sum, d) => sum + d.dealValue, 0);

          return (
            <div
              key={stage.id}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '14px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                minHeight: '520px'
              }}
            >
              {/* Column Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: stage.color }} />
                  <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-primary)' }}>{stage.label}</h4>
                </div>
                <span className="badge" style={{ background: 'var(--bg-input)', color: 'var(--text-secondary)' }}>
                  {stageDeals.length}
                </span>
              </div>

              {/* Column Total Value */}
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>
                Total: <span style={{ color: '#34d399' }}>${stageTotalValue.toLocaleString()}</span>
              </div>

              {/* Deal Cards Container */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                {stageDeals.map(deal => (
                  <div
                    key={deal.id}
                    className="glass-card"
                    style={{ padding: '14px', cursor: 'grab', background: 'var(--bg-primary)', borderRadius: '12px' }}
                  >
                    <div style={{ fontSize: '0.75rem', color: '#60a5fa', fontWeight: '700', marginBottom: '4px' }}>
                      {deal.company}
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-primary)' }}>
                      {deal.title}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '1.05rem', fontWeight: '800', color: '#34d399' }}>
                        ${deal.dealValue.toLocaleString()}
                      </span>
                      <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>
                        {deal.probability}% Win Prob
                      </span>
                    </div>

                    <div style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar style={{ width: '12px', height: '12px', color: 'var(--text-muted)' }} />
                        <span>Close: {deal.expectedCloseDate}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <User style={{ width: '12px', height: '12px', color: 'var(--text-muted)' }} />
                        <span>Owner: {deal.owner}</span>
                      </div>
                    </div>

                    {/* Stage Mover Selector */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Move Stage:</span>
                      <select
                        value={deal.stage}
                        onChange={(e) => updateDealStage(deal.id, e.target.value)}
                        style={{
                          background: 'var(--bg-input)',
                          border: '1px solid var(--border-color)',
                          color: '#60a5fa',
                          fontSize: '0.7rem',
                          fontWeight: '700',
                          borderRadius: '6px',
                          padding: '2px 6px',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        {STAGES.map(s => (
                          <option key={s.id} value={s.id}>{s.label}</option>
                        ))}
                      </select>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          );
        })}
      </div>

      {/* Add Deal Modal */}
      {showAddDealModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '6px' }}>Create New Sales Opportunity</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Add a product deal to your pipeline with close date targets and expected value math.
            </p>

            <form onSubmit={handleAddDealSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Deal Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Cloud Cluster Upgrade"
                    value={newDealForm.title}
                    onChange={(e) => setNewDealForm({ ...newDealForm, title: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Corp"
                    value={newDealForm.company}
                    onChange={(e) => setNewDealForm({ ...newDealForm, company: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Deal Value ($)</label>
                  <input
                    type="number"
                    required
                    value={newDealForm.dealValue}
                    onChange={(e) => setNewDealForm({ ...newDealForm, dealValue: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Target Close Date</label>
                  <input
                    type="date"
                    required
                    value={newDealForm.expectedCloseDate}
                    onChange={(e) => setNewDealForm({ ...newDealForm, expectedCloseDate: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Deal Owner</label>
                  <select
                    value={newDealForm.owner}
                    onChange={(e) => setNewDealForm({ ...newDealForm, owner: e.target.value })}
                    className="form-select"
                  >
                    <option value="Alex Rivera">Alex Rivera</option>
                    <option value="Jessica Wu">Jessica Wu</option>
                    <option value="Marcus Vance">Marcus Vance</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Competitors</label>
                  <input
                    type="text"
                    placeholder="Dell, Cisco, HPE"
                    value={newDealForm.competitors}
                    onChange={(e) => setNewDealForm({ ...newDealForm, competitors: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowAddDealModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn gradient-btn-primary">
                  Create Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default KanbanBoard;
