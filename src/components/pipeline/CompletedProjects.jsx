import React, { useState, useMemo } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  CheckCircle2,
  DollarSign,
  Calendar,
  User,
  Building2,
  Search,
  Filter,
  TrendingUp,
  Clock,
  ChevronRight,
  Award,
  Layers,
  Trash2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

const getProjectStatus = (deal) => {
  if (deal.projectStatus) return deal.projectStatus;
  return 'In Progress';
};

const getProgressValue = (deal) => {
  if (deal.projectProgress !== undefined && deal.projectProgress !== null) {
    return parseInt(deal.projectProgress, 10);
  }
  return 100;
};

const CompletedProjects = () => {
  const { deals = [], orders = [], updateDeal, deleteDeal } = useCRM();

  const [search, setSearch] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [deletingDealId, setDeletingDealId] = useState(null);

  // Completed projects are Won deals with status 'Delivered' or 'Completed'
  const completedDeals = useMemo(() => {
    return deals.filter(d => {
      const isWon = d.stage === 'Won' || d.stage === 'Closed Won';
      const status = getProjectStatus(d);
      return isWon && (status === 'Delivered' || status === 'Completed');
    });
  }, [deals]);

  // Compute revenue stats for a deal
  const getProjectRevenueStats = (deal) => {
    const projectOrders = (orders || []).filter(o =>
      (o.dealId && o.dealId === deal.id) ||
      (o.customerName && deal.company && o.customerName.toLowerCase().trim() === deal.company.toLowerCase().trim())
    );

    const revenueReceived = projectOrders.reduce((sum, o) => {
      const totalVal = parseFloat(o.grandTotal || o.totalValue || o.totalAmount || 0);
      const paidAmt = parseFloat(o.paidAmount);
      const statusStr = (o.status || '').toLowerCase();
      const payStatusStr = (o.paymentStatus || '').toLowerCase();

      if (statusStr === 'paid' || statusStr === 'completed' || statusStr === 'shipped' || payStatusStr === 'paid') {
        return sum + ((!isNaN(paidAmt) && paidAmt > 0) ? paidAmt : totalVal);
      }
      if (!isNaN(paidAmt) && paidAmt > 0) {
        return sum + paidAmt;
      }
      if (statusStr.includes('partial') || payStatusStr.includes('partial')) {
        const remaining = parseFloat(o.remainingAmount);
        if (!isNaN(remaining) && remaining < totalVal) {
          return sum + Math.max(0, totalVal - remaining);
        }
      }
      return sum;
    }, 0);

    const totalCost = deal.dealValue || 0;
    const remainingRevenue = Math.max(0, totalCost - revenueReceived);

    return {
      revenueReceived,
      remainingRevenue,
      totalCost,
      invoicesCount: projectOrders.length
    };
  };

  const filteredProjects = useMemo(() => {
    return completedDeals.filter(deal => {
      const matchesSearch =
        !search ||
        deal.title?.toLowerCase().includes(search.toLowerCase()) ||
        deal.company?.toLowerCase().includes(search.toLowerCase()) ||
        deal.owner?.toLowerCase().includes(search.toLowerCase());

      return matchesSearch;
    });
  }, [completedDeals, search]);

  const handleDeleteProject = async (dealId, e) => {
    if (e) e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this completed project? This action cannot be undone.")) {
      try {
        setDeletingDealId(dealId);
        await deleteDeal(dealId);
        if (selectedProject && (selectedProject.id === dealId || `deal-${selectedProject.id}` === dealId)) {
          setSelectedProject(null);
        }
      } catch (err) {
        console.error("Error deleting project:", err);
        alert("Failed to delete project: " + (err.response?.data?.error || err.message));
      } finally {
        setDeletingDealId(null);
      }
    }
  };

  const handleReopenProject = async (dealId, e) => {
    if (e) e.stopPropagation();
    try {
      if (updateDeal) {
        const target = deals.find(d => d.id === dealId || `deal-${d.id}` === dealId) || selectedProject;
        await updateDeal(dealId, {
          company: target?.company,
          title: target?.title,
          dealValue: target?.dealValue,
          projectStatus: 'In Progress'
        });
        if (selectedProject && (selectedProject.id === dealId || `deal-${selectedProject.id}` === dealId)) {
          setSelectedProject(null);
        }
      }
    } catch (err) {
      console.error("Error re-opening project:", err);
      alert("Failed to update status: " + (err.response?.data?.error || err.message));
    }
  };

  // Metrics
  const totalValue = completedDeals.reduce((sum, d) => sum + (d.dealValue || 0), 0);
  const totalCollected = completedDeals.reduce((sum, d) => sum + getProjectRevenueStats(d).revenueReceived, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Award style={{ width: '15px', height: '15px' }} />
            Operations · Delivered & Completed Projects
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '900', margin: '6px 0 4px', background: 'linear-gradient(135deg, #fff 0%, #34d399 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Completed Projects
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
            Archive of successfully delivered client projects, realized revenue, and contract completions.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '12px', padding: '12px 18px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#34d399' }}>{completedDeals.length}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Delivered Projects</div>
          </div>
          <div style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: '12px', padding: '12px 18px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#60a5fa' }}>${totalValue.toLocaleString()}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Total Contract Value</div>
          </div>
          <div style={{ background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.25)', borderRadius: '12px', padding: '12px 18px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#c084fc' }}>${totalCollected.toLocaleString()}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Revenue Collected</div>
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '240px' }}>
          <Search style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search completed projects by title, company, owner..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="form-input"
            style={{ width: '100%', fontSize: '0.85rem' }}
          />
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
          Showing <strong style={{ color: '#34d399' }}>{filteredProjects.length}</strong> completed projects
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <CheckCircle2 style={{ width: '48px', height: '48px', opacity: 0.4, marginBottom: '12px', color: '#34d399' }} />
          <h4 style={{ fontSize: '1.1rem', fontWeight: '800', margin: '0 0 6px', color: 'var(--text-primary)' }}>No Completed Projects</h4>
          <p style={{ fontSize: '0.85rem', margin: 0 }}>
            {completedDeals.length === 0
              ? 'When an ongoing project status is changed to "Delivered", it will automatically appear here.'
              : 'No completed projects match your search query.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filteredProjects.map(deal => {
            const revStats = getProjectRevenueStats(deal);

            return (
              <div
                key={deal.id}
                className="glass-card"
                onClick={() => setSelectedProject(deal)}
                style={{
                  padding: '20px',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  border: '1px solid var(--border-color)',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.border = '1px solid rgba(52,211,153,0.4)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(16,185,129,0.12)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.border = '1px solid var(--border-color)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Top green accent bar */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #10b981, #34d399)' }} />

                {/* Delivered Badge */}
                <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)', color: '#34d399', fontSize: '0.65rem', fontWeight: '800', padding: '3px 10px', borderRadius: '20px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 style={{ width: '11px', height: '11px' }} /> Delivered
                  </span>
                </div>

                {/* Company */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', marginTop: '4px' }}>
                  <div style={{ background: 'rgba(16,185,129,0.15)', borderRadius: '8px', padding: '6px' }}>
                    <Building2 style={{ width: '14px', height: '14px', color: '#34d399' }} />
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: '700' }}>{deal.company}</span>
                </div>

                {/* Title */}
                <h3 style={{ fontSize: '0.98rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '14px', lineHeight: 1.3, paddingRight: '80px' }}>
                  {deal.title}
                </h3>

                {/* Meta info & Revenue Summary */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    <User style={{ width: '12px', height: '12px', color: 'var(--text-muted)' }} />
                    <span>Owner: <strong style={{ color: 'var(--text-primary)' }}>{deal.owner || 'Unassigned'}</strong></span>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '10px 12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.75rem' }}>
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>Total Contract</div>
                      <div style={{ fontWeight: '800', color: '#38bdf8' }}>${(revStats.totalCost).toLocaleString()}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>Rev Collected</div>
                      <div style={{ fontWeight: '800', color: '#34d399' }}>${(revStats.revenueReceived).toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar (100%) */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Completion Status</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: '900', color: '#34d399' }}>100% Completed</span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--bg-input)', borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '100%', background: 'linear-gradient(90deg, #10b981, #34d399)', borderRadius: '99px' }} />
                  </div>
                </div>

                {/* Footer buttons: Re-open & Delete */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
                  <button
                    type="button"
                    onClick={(e) => handleReopenProject(deal.id, e)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '5px 10px',
                      borderRadius: '8px',
                      background: 'rgba(59, 130, 246, 0.12)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      color: '#60a5fa',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                    title="Move back to Ongoing Projects"
                  >
                    <RotateCcw style={{ width: '12px', height: '12px' }} /> Re-open
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleDeleteProject(deal.id, e)}
                    disabled={deletingDealId === deal.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '5px 10px',
                      borderRadius: '8px',
                      background: 'rgba(244, 63, 94, 0.12)',
                      border: '1px solid rgba(244, 63, 94, 0.3)',
                      color: '#f43f5e',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                    title="Delete Project"
                  >
                    <Trash2 style={{ width: '12px', height: '12px' }} /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal for Completed Project */}
      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="modal-content" style={{ padding: '0', maxWidth: '600px', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '24px 28px', background: 'linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(99,102,241,0.1) 100%)', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 style={{ width: '14px', height: '14px' }} />
                    Completed Project · {selectedProject.company}
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '900', margin: '0 0 4px', color: 'var(--text-primary)' }}>
                    {selectedProject.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.8rem' }}
                >
                  ✕ Close
                </button>
              </div>
            </div>

            <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ background: 'var(--bg-input)', borderRadius: '10px', padding: '12px', border: '1px solid var(--border-color)' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase' }}>Contract Value</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#34d399', marginTop: '2px' }}>${(selectedProject.dealValue || 0).toLocaleString()}</div>
                </div>
                <div style={{ background: 'var(--bg-input)', borderRadius: '10px', padding: '12px', border: '1px solid var(--border-color)' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase' }}>Owner</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px' }}>{selectedProject.owner || 'Unassigned'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                <button
                  onClick={() => handleReopenProject(selectedProject.id)}
                  className="btn btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <RotateCcw style={{ width: '14px', height: '14px' }} /> Move Back to Ongoing
                </button>
                <button
                  onClick={() => handleDeleteProject(selectedProject.id)}
                  className="btn"
                  style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e', border: '1px solid rgba(244, 63, 94, 0.3)', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Trash2 style={{ width: '14px', height: '14px' }} /> Delete Completed Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompletedProjects;
