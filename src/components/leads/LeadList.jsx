import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  Users,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Flame,
  UserCheck,
  Mail,
  Phone,
  Building,
  CheckCircle2,
  DollarSign,
  Tag,
  Package
} from 'lucide-react';
import LeadFormModal from './LeadFormModal';

const LeadList = () => {
  const { leads, updateLeadStatus, globalSearch } = useCRM();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSource, setSelectedSource] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const filteredLeads = leads.filter(l => {
    const normStatus = (!l.status || l.status === 'Lead') ? 'Lead Intake' : l.status;
    const matchesSource = selectedSource === 'ALL' || l.source === selectedSource;
    const matchesStatus = selectedStatus === 'ALL' || normStatus === selectedStatus;
    const matchesSearch = l.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
                          l.company.toLowerCase().includes(globalSearch.toLowerCase()) ||
                          l.email.toLowerCase().includes(globalSearch.toLowerCase());
    return matchesSource && matchesStatus && matchesSearch;
  });

  const duplicateCount = leads.filter(l => l.duplicateFlag).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#60a5fa', fontWeight: '700', textTransform: 'uppercase' }}>
            Omnichannel Lead Generation & Scoring
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '4px 0' }}>
            Lead Management Database ({leads.length})
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Capture leads from Web Forms, Social Media, Email Campaigns, Referrals & Manual Entry with automated scoring matrix.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn gradient-btn-primary"
          style={{ padding: '10px 18px', borderRadius: '10px' }}
        >
          <Plus style={{ width: '18px', height: '18px' }} />
          <span>Capture New Lead</span>
        </button>
      </div>

      {/* Duplicate Alert Banner if duplicate exists */}
      {duplicateCount > 0 && (
        <div style={{
          padding: '14px 20px',
          borderRadius: '12px',
          background: 'rgba(245, 158, 11, 0.12)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <AlertTriangle style={{ color: '#fbbf24', width: '22px', height: '22px' }} />
          <div>
            <div style={{ fontWeight: '700', color: '#fbbf24', fontSize: '0.9rem' }}>
              Duplicate Leads Alert ({duplicateCount} Flagged)
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Duplicate email matches detected in your pipeline. Review flagged leads below to merge or clean contact touchpoints.
            </div>
          </div>
        </div>
      )}

      {/* Filters Bar */}
      <div className="glass-card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Filter style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>Filter Source:</span>
          
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="form-select"
            style={{ fontSize: '0.8rem' }}
          >
            <option value="ALL">All Capture Sources</option>
            <option value="Website Forms">Website Forms</option>
            <option value="Social Media">Social Media</option>
            <option value="Email Campaigns">Email Campaigns</option>
            <option value="Referral">Referrals</option>
            <option value="Manual Entry">Manual Entry</option>
          </select>

          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginLeft: '12px' }}>Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="form-select"
            style={{ fontSize: '0.8rem' }}
          >
            <option value="ALL">All Lifecycle Stages</option>
            <option value="Lead Intake">Lead Intake</option>
            <option value="Qualified">Qualified</option>
            <option value="Need Analysis">Need Analysis</option>
            <option value="Proposal Sent">Proposal Sent</option>
            <option value="Negotiation">Negotiation</option>
            <option value="Won">Won</option>
            <option value="Lost">Lost</option>
          </select>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Showing <strong>{filteredLeads.length}</strong> matching records
        </div>
      </div>

      {/* Leads Table */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div className="custom-table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Lead & Company</th>
                <th>Score</th>
                <th>Source</th>
                <th>Potential Value</th>
                <th>Assigned Rep</th>
                <th>Stage Status</th>
                <th>Tags</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map(lead => (
                <tr key={lead.id}>
                  <td>
                    <div style={{ fontWeight: '700' }}>
                      {lead.name}
                      {lead.duplicateFlag && (
                        <span className="badge badge-amber" style={{ marginLeft: '8px', fontSize: '0.65rem' }}>
                          DUP MATCH
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                      <span><Building style={{ width: '12px', height: '12px', display: 'inline' }} /> {lead.company}</span>
                      <span>•</span>
                      <span><Mail style={{ width: '12px', height: '12px', display: 'inline' }} /> {lead.email}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#c084fc', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontWeight: '700' }}>
                      <Package style={{ width: '12px', height: '12px' }} />
                      <span>Product: {lead.productNeeded || 'Astra CRM Enterprise Suite'}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Flame style={{ width: '16px', height: '16px', color: lead.score >= 80 ? '#f43f5e' : lead.score >= 60 ? '#fbbf24' : '#60a5fa' }} />
                      <span style={{ fontWeight: '800', fontSize: '0.9rem', color: lead.score >= 80 ? '#f43f5e' : lead.score >= 60 ? '#fbbf24' : '#60a5fa' }}>
                        {lead.score}/100
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>
                      {lead.source}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: '700', color: '#34d399', fontSize: '0.9rem' }}>
                      ${lead.potentialValue.toLocaleString()}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem' }}>{lead.assignedTo}</span>
                  </td>
                  <td>
                    <select
                      value={(!lead.status || lead.status === 'Lead') ? 'Lead Intake' : lead.status}
                      onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                      className="form-select"
                      style={{ fontSize: '0.75rem', padding: '4px 8px', fontWeight: '700' }}
                    >
                      <option value="Lead Intake">Lead Intake</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Need Analysis">Need Analysis</option>
                      <option value="Proposal Sent">Proposal Sent</option>
                      <option value="Negotiation">Negotiation</option>
                      <option value="Won">Won</option>
                      <option value="Lost">Lost</option>
                    </select>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {lead.tags.map(t => (
                        <span key={t} className="badge badge-purple" style={{ fontSize: '0.65rem' }}>{t}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <button
                      onClick={() => alert(`Notes for ${lead.name}:\n\n"${lead.notes}"`)}
                      className="btn btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                    >
                      View Notes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Intake Modal */}
      {showAddModal && <LeadFormModal onClose={() => setShowAddModal(false)} />}

    </div>
  );
};

export default LeadList;
