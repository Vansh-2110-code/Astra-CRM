import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';

const LeadFormModal = ({ onClose }) => {
  const { addLead } = useCRM();

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    source: 'Website Forms',
    potentialValue: 0,
    assignedTo: '',
    notes: '',
    tagsStr: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.company) return;

    addLead({
      name: formData.name,
      company: formData.company,
      email: formData.email,
      phone: formData.phone || '',
      source: formData.source,
      potentialValue: parseFloat(formData.potentialValue) || 0,
      assignedTo: formData.assignedTo,
      notes: formData.notes || '',
      tags: formData.tagsStr ? formData.tagsStr.split(',').map(t => t.trim()).filter(Boolean) : []
    });

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '6px' }}>Capture / Add New Product Lead</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Lead scoring algorithm automatically calculates engagement rank based on source and potential value.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            
            <div className="form-group">
              <label className="form-label">Contact Person Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Eleanor Vance"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Apex Global Tech"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Business Email</label>
              <input
                type="email"
                required
                placeholder="eleanor@apex.io"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                placeholder="+1 (555) 345-6789"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Lead Capture Source</label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="form-select"
              >
                <option value="Website Forms">Website Forms</option>
                <option value="Social Media">Social Media</option>
                <option value="Email Campaigns">Email Campaigns</option>
                <option value="Referral">Referrals</option>
                <option value="Manual Entry">Manual Entry</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Estimated Deal Value ($)</label>
              <input
                type="number"
                value={formData.potentialValue}
                onChange={(e) => setFormData({ ...formData, potentialValue: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Assigned Sales Executive</label>
              <select
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                className="form-select"
              >
                <option value="Alex Rivera">Alex Rivera</option>
                <option value="Jessica Wu">Jessica Wu</option>
                <option value="Marcus Vance">Marcus Vance</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Tags (comma separated)</label>
              <input
                type="text"
                value={formData.tagsStr}
                onChange={(e) => setFormData({ ...formData, tagsStr: e.target.value })}
                className="form-input"
              />
            </div>

          </div>

          <div className="form-group">
            <label className="form-label">Requirement & Activity Notes</label>
            <textarea
              rows="3"
              placeholder="Detail products interested in, urgency, cloud requirements..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="form-textarea"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn gradient-btn-primary"
            >
              Save Lead & Auto Score
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadFormModal;
