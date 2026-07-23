import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  BarChart3, Download, FileSpreadsheet, FileText,
  TrendingUp, DollarSign, Users, Wallet, CheckCircle2
} from 'lucide-react';

const ReportsEngine = () => {
  const { leads, deals, orders, employees, attendanceRecords } = useCRM();
  const [exported, setExported] = useState('');

  const today = new Date();
  const currentMonth = today.toLocaleString('default', { month: 'long' });
  const currentYear = today.getFullYear();

  // ── Revenue & Pipeline Summary ───────────────────────────────────────────
  const totalPipelineValue = (deals || []).reduce((s, d) => s + (d.value || d.amount || 0), 0);
  const wonDeals = (deals || []).filter(d => d.stage === 'Won');
  const totalRevenue = wonDeals.reduce((s, d) => s + (d.value || d.amount || 0), 0);
  const conversionRate = (deals || []).length > 0
    ? Math.round((wonDeals.length / (deals || []).length) * 100) : 0;

  // ── Lead Attribution Summary ─────────────────────────────────────────────
  const leadsBySource = (leads || []).reduce((acc, l) => {
    const src = l.source || 'Direct';
    acc[src] = (acc[src] || 0) + 1;
    return acc;
  }, {});

  // ── Payroll Summary ──────────────────────────────────────────────────────
  const empPayroll = (employees || []).map((emp) => {
    const base = emp.salary || 0;
    const gross = Math.round(base * 1.60);
    const deductions = Math.round(gross * 0.22);
    const net = gross - deductions;
    const empAtt = (attendanceRecords || []).filter(r => r.employeeId === emp.id);
    let daysWorked = 22;
    if (empAtt.length > 0) {
      daysWorked = empAtt.reduce((s, r) => {
        if (r.status === 'Present' || r.status === 'Paid Leave') return s + 1;
        if (r.status === 'Half-Day') return s + 0.5;
        return s;
      }, 0);
    }
    const actualNet = Math.round((net / 22) * daysWorked);
    return { ...emp, gross, deductions, net: actualNet, daysWorked };
  });
  const totalPayroll = empPayroll.reduce((s, e) => s + e.net, 0);

  // ── CSV Generator ────────────────────────────────────────────────────────
  const downloadCSV = (rows, headers, filename) => {
    const csvRows = [headers.join(','), ...rows.map(r => headers.map(h => `"${r[h] ?? ''}"`).join(','))];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setExported(filename);
    setTimeout(() => setExported(''), 3000);
  };

  const handleExportRevenue = () => {
    const rows = (deals || []).map(d => ({
      'Deal ID': d.id,
      'Contact': d.contactName || d.company || '',
      'Stage': d.stage,
      'Value ($)': d.value || d.amount || 0,
      'Probability (%)': d.probability || 0,
      'Date': d.expectedClose || d.createdAt || ''
    }));
    downloadCSV(rows, ['Deal ID', 'Contact', 'Stage', 'Value ($)', 'Probability (%)', 'Date'], `AstraCRM_Revenue_Report_${currentYear}.csv`);
  };

  const handleExportLeads = () => {
    const rows = (leads || []).map(l => ({
      'Lead ID': l.id,
      'Name': l.name,
      'Company': l.company || '',
      'Status': l.status,
      'Source': l.source || 'Direct',
      'Score': l.score || 0
    }));
    downloadCSV(rows, ['Lead ID', 'Name', 'Company', 'Status', 'Source', 'Score'], `AstraCRM_Lead_Report_${currentYear}.csv`);
  };

  const handleExportPayroll = () => {
    const rows = empPayroll.map(e => ({
      'Employee': e.name,
      'Designation': e.designation || '',
      'Days Worked': e.daysWorked,
      'Gross (₹)': e.gross,
      'Deductions (₹)': e.deductions,
      'Net Payable (₹)': e.net
    }));
    downloadCSV(rows, ['Employee', 'Designation', 'Days Worked', 'Gross (₹)', 'Deductions (₹)', 'Net Payable (₹)'], `AstraCRM_Payroll_${currentMonth}_${currentYear}.csv`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: '700', textTransform: 'uppercase' }}>
          Executive Intelligence Suite
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '4px 0' }}>
          Global Reports & Exporter Engine
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          One-click CSV export for Revenue, Pipeline, Lead Attribution, and Monthly Payroll Audit Summaries.
        </p>
      </div>

      {/* Export success banner */}
      {exported && (
        <div className="glass-card" style={{ padding: '12px 16px', borderLeft: '4px solid #10b981', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle2 style={{ color: '#10b981', width: '18px', height: '18px' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#10b981' }}>
            ✅ Report downloaded: <code>{exported}</code>
          </span>
        </div>
      )}

      {/* KPI Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div className="glass-card" style={{ padding: '20px', borderTop: '4px solid #10b981' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Total Revenue Won</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#10b981' }}>
            ${totalRevenue.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>{wonDeals.length} deals closed</div>
        </div>
        <div className="glass-card" style={{ padding: '20px', borderTop: '4px solid #3b82f6' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Pipeline Value</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#3b82f6' }}>
            ${totalPipelineValue.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>{(deals || []).length} active deals</div>
        </div>
        <div className="glass-card" style={{ padding: '20px', borderTop: '4px solid #a855f7' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Lead Conversion</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#a855f7' }}>{conversionRate}%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>{(leads || []).length} total leads</div>
        </div>
        <div className="glass-card" style={{ padding: '20px', borderTop: '4px solid #f59e0b' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Monthly Payroll</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#f59e0b' }}>
            ₹{totalPayroll.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>{empPayroll.length} employees</div>
        </div>
      </div>

      {/* Report Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>

        {/* Revenue Report */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)' }}>
              <TrendingUp style={{ color: '#10b981', width: '24px', height: '24px' }} />
            </div>
            <div>
              <div style={{ fontWeight: '800', fontSize: '1rem' }}>Revenue & Pipeline</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CSV — {(deals || []).length} records</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <div>• Deal ID, Contact, Stage</div>
            <div>• Value & Probability</div>
            <div>• Expected Close Date</div>
            <div>• Won / Lost breakdown</div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.78rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Won Revenue:</span>
              <strong style={{ color: '#10b981' }}>${totalRevenue.toLocaleString()}</strong>
            </div>
            <button onClick={handleExportRevenue} className="btn gradient-btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '10px' }}>
              <Download style={{ width: '16px', height: '16px' }} /> Export Revenue CSV
            </button>
          </div>
        </div>

        {/* Lead Attribution Report */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.15)' }}>
              <Users style={{ color: '#a855f7', width: '24px', height: '24px' }} />
            </div>
            <div>
              <div style={{ fontWeight: '800', fontSize: '1rem' }}>Lead Attribution</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CSV — {(leads || []).length} records</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '18px' }}>
            {Object.entries(leadsBySource).map(([src, count]) => (
              <div key={src} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{src}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '80px', height: '6px', background: 'var(--bg-input)', borderRadius: '3px' }}>
                    <div style={{ width: `${Math.round((count / (leads || []).length) * 100)}%`, height: '100%', background: '#a855f7', borderRadius: '3px' }} />
                  </div>
                  <span style={{ color: '#a855f7', fontWeight: '700', width: '20px' }}>{count}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
            <button onClick={handleExportLeads} className="btn gradient-btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '10px', background: 'linear-gradient(135deg, #6d28d9 0%, #a855f7 100%)' }}>
              <Download style={{ width: '16px', height: '16px' }} /> Export Lead Report CSV
            </button>
          </div>
        </div>

        {/* Payroll Report */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)' }}>
              <Wallet style={{ color: '#f59e0b', width: '24px', height: '24px' }} />
            </div>
            <div>
              <div style={{ fontWeight: '800', fontSize: '1rem' }}>Monthly Payroll Audit</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CSV — {currentMonth} {currentYear}</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '18px', maxHeight: '130px', overflowY: 'auto' }}>
            {empPayroll.map(e => (
              <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', padding: '4px 0', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ fontWeight: '700' }}>{e.name}</span>
                <span style={{ color: '#10b981' }}>₹{e.net.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.78rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Total Net Payroll:</span>
              <strong style={{ color: '#f59e0b' }}>₹{totalPayroll.toLocaleString('en-IN')}</strong>
            </div>
            <button onClick={handleExportPayroll} className="btn gradient-btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '10px', background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)' }}>
              <Download style={{ width: '16px', height: '16px' }} /> Export Payroll CSV
            </button>
          </div>
        </div>

      </div>

      {/* Pipeline Breakdown Table */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '14px' }}>
          Sales Pipeline Stage Breakdown
        </h3>
        <div className="custom-table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Deal</th>
                <th>Stage</th>
                <th>Value</th>
                <th>Probability</th>
                <th>Expected Close</th>
              </tr>
            </thead>
            <tbody>
              {(deals || []).map(deal => (
                <tr key={deal.id}>
                  <td><span style={{ fontWeight: '700' }}>{deal.title || deal.name || deal.id}</span></td>
                  <td><span className="badge badge-blue">{deal.stage}</span></td>
                  <td><strong style={{ color: '#10b981' }}>${(deal.value || deal.amount || 0).toLocaleString()}</strong></td>
                  <td>{deal.probability || 0}%</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{deal.expectedClose || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default ReportsEngine;
