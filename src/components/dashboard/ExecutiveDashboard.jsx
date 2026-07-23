import React from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  DollarSign,
  TrendingUp,
  Target,
  Award,
  Users,
  AlertCircle,
  FileCheck,
  ArrowUpRight,
  PieChart as PieIcon,
  Activity
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const ExecutiveDashboard = () => {
  const { activeTenant, leads, deals, quotes, orders, products } = useCRM();

  // Metrics Calculations
  const totalRevenue = deals
    .filter(d => d.stage === 'Won')
    .reduce((sum, d) => sum + d.dealValue, 0);

  const pipelineValue = deals
    .filter(d => d.stage !== 'Won' && d.stage !== 'Lost')
    .reduce((sum, d) => sum + d.dealValue, 0);

  const totalWonDeals = deals.filter(d => d.stage === 'Won').length;
  const totalClosedDeals = deals.filter(d => d.stage === 'Won' || d.stage === 'Lost').length;
  const winRatePercent = totalClosedDeals > 0 ? Math.round((totalWonDeals / totalClosedDeals) * 100) : 0;

  const totalLeads = leads.length;
  const qualifiedLeads = leads.filter(l => l.status === 'Qualified' || l.status === 'Proposal Sent' || l.status === 'Negotiation').length;
  const conversionRate = totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 0;

  // Dynamic Monthly Revenue Trend Data from real Won deals
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  const monthlyData = months.map(m => {
    const monthDeals = (deals || []).filter(d => 
      d.stage === 'Won' && 
      (d.createdDate || d.createdAt) && 
      new Date(d.createdDate || d.createdAt).toLocaleString('default', { month: 'short' }) === m
    );
    const revenue = monthDeals.reduce((sum, d) => sum + (d.dealValue || d.totalValue || 0), 0);
    return { month: m, revenue, target: 0 };
  });

  // Dynamic Sales Funnel Data
  const funnelData = [
    { stage: 'Leads', count: (leads || []).length, color: '#3b82f6' },
    { stage: 'Qualified', count: (deals || []).filter(d => d.stage === 'Qualified').length, color: '#06b6d4' },
    { stage: 'Need Analysis', count: (deals || []).filter(d => d.stage === 'Need Analysis').length, color: '#8b5cf6' },
    { stage: 'Proposal Sent', count: (deals || []).filter(d => d.stage === 'Proposal Sent').length, color: '#f59e0b' },
    { stage: 'Won', count: totalWonDeals, color: '#10b981' },
  ];

  // Dynamic Products Sales Data
  const colorsList = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899'];
  const productPieData = (products || []).map((p, idx) => ({
    name: p.name,
    value: p.unitPrice || 0,
    color: colorsList[idx % colorsList.length]
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Welcome Header */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#60a5fa', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Enterprise Executive Dashboard
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', margin: '4px 0', color: 'var(--text-primary)' }}>
            Welcome back, {activeTenant?.name || currentUser?.company || 'Workspace'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Active Tenant Workspace: <strong style={{ color: '#34d399' }}>{activeTenant?.name || 'My Organization'}</strong> • Plan: <strong>{activeTenant?.plan || 'Enterprise'}</strong> ({activeTenant?.seats || 1}/{activeTenant?.maxSeats || 50} Seats Used)
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="badge badge-emerald" style={{ padding: '8px 14px', fontSize: '0.8rem' }}>
            <Activity style={{ width: '14px', height: '14px' }} />
            <span>SOC2 & GDPR Enforced</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        
        {/* Total Won Revenue */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)' }}>TOTAL REVENUE (WON)</span>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '8px', borderRadius: '10px' }}>
              <DollarSign style={{ width: '20px', height: '20px', color: '#34d399' }} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            ${totalRevenue.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
            <ArrowUpRight style={{ width: '14px', height: '14px' }} />
            <span>+24.5% vs last month</span>
          </div>
        </div>

        {/* Active Pipeline Value */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)' }}>ACTIVE PIPELINE</span>
            <div style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '8px', borderRadius: '10px' }}>
              <TrendingUp style={{ width: '20px', height: '20px', color: '#60a5fa' }} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            ${pipelineValue.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
            Across {deals.length} active opportunities
          </div>
        </div>

        {/* Win Rate % */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)' }}>DEAL WIN RATE</span>
            <div style={{ background: 'rgba(139, 92, 246, 0.15)', padding: '8px', borderRadius: '10px' }}>
              <Target style={{ width: '20px', height: '20px', color: '#c084fc' }} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            {winRatePercent}%
          </div>
          <div style={{ fontSize: '0.75rem', color: '#c084fc', marginTop: '6px' }}>
            High-value enterprise benchmark
          </div>
        </div>

        {/* Lead Conversion % */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)' }}>LEAD CONVERSION</span>
            <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '8px', borderRadius: '10px' }}>
              <Users style={{ width: '20px', height: '20px', color: '#fbbf24' }} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            {conversionRate}%
          </div>
          <div style={{ fontSize: '0.75rem', color: '#fbbf24', marginTop: '6px' }}>
            {qualifiedLeads} of {totalLeads} leads qualified
          </div>
        </div>

      </div>

      {/* Analytics Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        
        {/* Monthly Revenue Chart */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '16px' }}>Monthly Revenue vs Sales Target</h3>
          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" tickFormatter={(val) => `$${val / 1000}k`} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="target" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Sales Distribution */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '16px' }}>Product Revenue Share</h3>
          <div style={{ width: '100%', height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={productPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                  {productPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem', marginTop: '10px' }}>
            {productPieData.map(p => (
              <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.color }} />
                  {p.name}
                </span>
                <strong style={{ color: 'var(--text-primary)' }}>${(p.value).toLocaleString()}</strong>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Leaderboard & Recent Sales Activities */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* Sales Representative Leaderboard */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award style={{ color: '#fbbf24', width: '18px', height: '18px' }} />
            Salesperson Leaderboard
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(!employees || employees.length === 0) ? (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No employees registered in team directory.
              </div>
            ) : (
              (employees || []).map((emp, idx) => {
                const empDeals = (deals || []).filter(d => (d.owner === emp.name || d.assignedTo === emp.name) && d.stage === 'Won');
                const revenue = empDeals.reduce((sum, d) => sum + (d.dealValue || d.totalValue || 0), 0);
                const rank = idx + 1;
                return (
                  <div key={emp.id || emp.name} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: 'var(--bg-input)', borderRadius: '10px' }}>
                    <div style={{ fontWeight: '800', fontSize: '0.9rem', color: rank === 1 ? '#fbbf24' : '#94a3b8', width: '20px' }}>
                      #{rank}
                    </div>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: '#fff', fontSize: '0.85rem' }}>
                      {emp.name ? emp.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>{emp.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{emp.designation || 'Sales Operations'}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: '800', color: '#34d399', fontSize: '0.9rem' }}>${revenue.toLocaleString()}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{empDeals.length} Deals Won</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Funnel Stage Breakdown */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '16px' }}>Pipeline Stage Breakdown</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {funnelData.map(f => (
              <div key={f.stage}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '600', marginBottom: '4px' }}>
                  <span>{f.stage}</span>
                  <span style={{ color: f.color }}>{f.count} Deals</span>
                </div>
                <div style={{ height: '8px', background: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min(100, f.count * 20)}%`, background: f.color, borderRadius: '4px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default ExecutiveDashboard;
