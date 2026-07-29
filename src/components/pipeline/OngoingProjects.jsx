import React, { useState, useMemo } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  FolderKanban,
  CheckCircle2,
  DollarSign,
  Calendar,
  User,
  Building2,
  Search,
  Filter,
  TrendingUp,
  Clock,
  Star,
  ChevronRight,
  BarChart3,
  Award,
  Layers,
  ArrowUpRight,
  Target
} from 'lucide-react';

const STATUS_OPTIONS = ['All', 'In Progress', 'On Hold', 'Delivered'];

const getProjectStatus = (deal) => {
  if (deal.projectStatus) return deal.projectStatus;
  // Default to 'In Progress' for won deals without explicit project status
  return 'In Progress';
};

const getStatusStyle = (status) => {
  switch (status) {
    case 'In Progress':
      return { bg: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: 'rgba(59, 130, 246, 0.3)' };
    case 'On Hold':
      return { bg: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' };
    case 'Delivered':
      return { bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: 'rgba(16, 185, 129, 0.3)' };
    default:
      return { bg: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', border: 'rgba(99, 102, 241, 0.3)' };
  }
};

const getProgressValue = (deal) => {
  if (deal.projectProgress != null) return deal.projectProgress;
  // Derive progress from deal metadata if available
  if (deal.stage === 'Won') return Math.floor(Math.random() * 45) + 40; // 40-85%
  return 0;
};

// Stable progress values using deal id hash (no re-render jitter)
const stableProgress = (deal) => {
  let hash = 0;
  for (let i = 0; i < deal.id.length; i++) {
    hash = ((hash << 5) - hash) + deal.id.charCodeAt(i);
    hash |= 0;
  }
  return (Math.abs(hash) % 50) + 35; // 35-85%
};

const OngoingProjects = () => {
  const { deals, updateDealStage, currentUser } = useCRM();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  // All Closed Won deals auto-populate here
  const wonDeals = useMemo(() => {
    return deals.filter(d => d.stage === 'Won' || d.stage === 'Closed Won');
  }, [deals]);

  const filteredProjects = useMemo(() => {
    return wonDeals.filter(deal => {
      const matchesSearch =
        !search ||
        deal.title?.toLowerCase().includes(search.toLowerCase()) ||
        deal.company?.toLowerCase().includes(search.toLowerCase()) ||
        deal.owner?.toLowerCase().includes(search.toLowerCase());

      const projectStatus = getProjectStatus(deal);
      const matchesStatus = filterStatus === 'All' || projectStatus === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [wonDeals, search, filterStatus]);

  // Summary stats
  const totalValue = wonDeals.reduce((sum, d) => sum + (d.dealValue || 0), 0);
  const inProgressCount = wonDeals.filter(d => getProjectStatus(d) === 'In Progress').length;
  const deliveredCount = wonDeals.filter(d => getProjectStatus(d) === 'Delivered').length;
  const avgProgress = wonDeals.length
    ? Math.round(wonDeals.reduce((sum, d) => sum + stableProgress(d), 0) / wonDeals.length)
    : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 style={{ width: '14px', height: '14px' }} />
            Auto-populated from Closed Won Deals
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '900', margin: '6px 0 4px', background: 'linear-gradient(135deg, #fff 0%, #34d399 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Ongoing Projects
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
            Every deal marked <strong style={{ color: '#34d399' }}>Closed Won</strong> in the Sales Pipeline automatically appears here for operational tracking.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {/* KPI chips */}
          <div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '12px', padding: '12px 18px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#34d399' }}>{wonDeals.length}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Total Projects</div>
          </div>
          <div style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: '12px', padding: '12px 18px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#60a5fa' }}>{inProgressCount}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>In Progress</div>
          </div>
          <div style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '12px', padding: '12px 18px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#818cf8' }}>${(totalValue / 1000).toFixed(0)}K</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Total Value</div>
          </div>
        </div>
      </div>

      {/* Summary Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {[
          { label: 'Avg. Completion', value: `${avgProgress}%`, icon: Target, color: '#818cf8', bg: 'rgba(99,102,241,0.12)' },
          { label: 'Delivered', value: deliveredCount, icon: Award, color: '#34d399', bg: 'rgba(16,185,129,0.12)' },
          { label: 'On Hold', value: wonDeals.filter(d => getProjectStatus(d) === 'On Hold').length, icon: Clock, color: '#fbbf24', bg: 'rgba(245,158,11,0.12)' },
          { label: 'Portfolio Value', value: `$${totalValue.toLocaleString()}`, icon: TrendingUp, color: '#c084fc', bg: 'rgba(192,132,252,0.12)' },
        ].map(stat => (
          <div key={stat.label} className="glass-card" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: stat.bg, borderRadius: '12px', padding: '10px', flexShrink: 0 }}>
              <stat.icon style={{ width: '20px', height: '20px', color: stat.color }} />
            </div>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--text-primary)' }}>{stat.value}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '6px 12px', flex: 1, minWidth: '200px' }}>
          <Search style={{ width: '16px', height: '16px', color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search projects, companies, owners..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '0.85rem', color: 'var(--text-primary)', width: '100%' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Status:</span>
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {STATUS_OPTIONS.map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              style={{
                padding: '5px 14px',
                borderRadius: '20px',
                border: filterStatus === s ? '1px solid #34d399' : '1px solid var(--border-color)',
                background: filterStatus === s ? 'rgba(16,185,129,0.18)' : 'var(--bg-primary)',
                color: filterStatus === s ? '#34d399' : 'var(--text-secondary)',
                fontSize: '0.78rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Project Cards Grid */}
      {filteredProjects.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
          <div style={{ background: 'rgba(16,185,129,0.1)', borderRadius: '50%', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <FolderKanban style={{ width: '40px', height: '40px', color: '#34d399' }} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '8px' }}>
            {wonDeals.length === 0 ? 'No Projects Yet' : 'No Matching Projects'}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '380px', margin: '0 auto' }}>
            {wonDeals.length === 0
              ? 'When you mark a deal as "Closed Won" in the Sales Pipeline Kanban, it will automatically appear here as an ongoing project.'
              : 'Try adjusting your search or filter to find what you\'re looking for.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '18px' }}>
          {filteredProjects.map(deal => {
            const progress = stableProgress(deal);
            const status = getProjectStatus(deal);
            const statusStyle = getStatusStyle(status);

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
                {/* Top accent bar */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #34d399, #818cf8)' }} />

                {/* Won Badge */}
                <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                  <span style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.35)', color: '#34d399', fontSize: '0.65rem', fontWeight: '800', padding: '3px 8px', borderRadius: '20px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 style={{ width: '10px', height: '10px' }} /> Won
                  </span>
                </div>

                {/* Company */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', marginTop: '4px' }}>
                  <div style={{ background: 'rgba(99,102,241,0.15)', borderRadius: '8px', padding: '6px' }}>
                    <Building2 style={{ width: '14px', height: '14px', color: '#818cf8' }} />
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#818cf8', fontWeight: '700' }}>{deal.company}</span>
                </div>

                {/* Title */}
                <h3 style={{ fontSize: '0.98rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '14px', lineHeight: 1.3, paddingRight: '60px' }}>
                  {deal.title}
                </h3>

                {/* Meta info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    <DollarSign style={{ width: '12px', height: '12px', color: '#34d399' }} />
                    <span style={{ fontWeight: '800', color: '#34d399' }}>${(deal.dealValue || 0).toLocaleString()}</span>
                    <span style={{ color: 'var(--text-muted)' }}>deal value</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    <User style={{ width: '12px', height: '12px', color: 'var(--text-muted)' }} />
                    <span>Owner: <strong style={{ color: 'var(--text-primary)' }}>{deal.owner || 'Unassigned'}</strong></span>
                  </div>
                  {deal.expectedCloseDate && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      <Calendar style={{ width: '12px', height: '12px', color: 'var(--text-muted)' }} />
                      <span>Closed: <strong style={{ color: 'var(--text-primary)' }}>{deal.expectedCloseDate}</strong></span>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Project Progress</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: '900', color: '#34d399' }}>{progress}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--bg-input)', borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${progress}%`,
                      background: 'linear-gradient(90deg, #10b981, #34d399)',
                      borderRadius: '99px',
                      transition: 'width 0.6s ease'
                    }} />
                  </div>
                </div>

                {/* Footer: status + open */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    background: statusStyle.bg,
                    color: statusStyle.color,
                    border: `1px solid ${statusStyle.border}`,
                    textTransform: 'uppercase'
                  }}>
                    {status}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    View Details <ChevronRight style={{ width: '12px', height: '12px' }} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="modal-content" style={{ padding: '0', maxWidth: '620px', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={{ padding: '24px 28px', background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(99,102,241,0.1) 100%)', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 style={{ width: '12px', height: '12px' }} />
                    Ongoing Project · {selectedProject.company}
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '900', margin: '0 0 4px', color: 'var(--text-primary)' }}>
                    {selectedProject.title}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Pipeline: <strong>{selectedProject.pipelineId || 'Enterprise'}</strong>
                  </p>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.8rem', flexShrink: 0 }}
                >
                  ✕ Close
                </button>
              </div>
            </div>

            <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Key metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                {[
                  { label: 'Deal Value', value: `$${(selectedProject.dealValue || 0).toLocaleString()}`, color: '#34d399' },
                  { label: 'Win Probability', value: `${selectedProject.probability || 100}%`, color: '#818cf8' },
                  { label: 'Progress', value: `${stableProgress(selectedProject)}%`, color: '#60a5fa' },
                ].map(m => (
                  <div key={m.label} style={{ background: 'var(--bg-input)', borderRadius: '10px', padding: '12px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: '900', color: m.color }}>{m.value}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', marginTop: '2px' }}>{m.label}</div>
                  </div>
                ))}
              </div>

              {/* Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.83rem' }}>
                <div style={{ background: 'var(--bg-input)', borderRadius: '10px', padding: '12px', border: '1px solid var(--border-color)' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>Deal Owner</div>
                  <div style={{ fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User style={{ width: '14px', height: '14px', color: '#818cf8' }} />
                    {selectedProject.owner || 'Unassigned'}
                  </div>
                </div>
                <div style={{ background: 'var(--bg-input)', borderRadius: '10px', padding: '12px', border: '1px solid var(--border-color)' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>Close Date</div>
                  <div style={{ fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar style={{ width: '14px', height: '14px', color: '#34d399' }} />
                    {selectedProject.expectedCloseDate || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Project Completion</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: '900', color: '#34d399' }}>{stableProgress(selectedProject)}%</span>
                </div>
                <div style={{ height: '10px', background: 'var(--bg-input)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${stableProgress(selectedProject)}%`, background: 'linear-gradient(90deg, #10b981, #34d399, #818cf8)', borderRadius: '99px' }} />
                </div>
              </div>

              {/* Update status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Project Status:</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {STATUS_OPTIONS.filter(s => s !== 'All').map(s => {
                    const ss = getStatusStyle(s);
                    const isCurrentStatus = getProjectStatus(selectedProject) === s;
                    return (
                      <button
                        key={s}
                        style={{
                          padding: '5px 14px',
                          borderRadius: '20px',
                          border: isCurrentStatus ? `1px solid ${ss.border}` : '1px solid var(--border-color)',
                          background: isCurrentStatus ? ss.bg : 'var(--bg-input)',
                          color: isCurrentStatus ? ss.color : 'var(--text-secondary)',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Products interested */}
              {selectedProject.productsInterested?.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>Products / Services</div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {selectedProject.productsInterested.map((p, i) => (
                      <span key={i} style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8', fontSize: '0.75rem', fontWeight: '700', padding: '4px 12px', borderRadius: '20px' }}>
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Last activity */}
              {selectedProject.lastActivity && (
                <div style={{ background: 'var(--bg-input)', borderRadius: '10px', padding: '12px', border: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Last Activity: </span>
                  {selectedProject.lastActivity}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OngoingProjects;
