import React, { useState, useMemo } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  DollarSign, Calendar, Download, Eye, CheckCircle2,
  Users, TrendingUp, FileText, Wallet, BadgeIndianRupee,
  Clock, PlusCircle, Printer
} from 'lucide-react';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const SalaryModule = () => {
  const { employees, activeTenant } = useCRM();
  const [activeView, setActiveView] = useState('accumulation');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showSlipModal, setShowSlipModal] = useState(null);
  const [salarySlips, setSalarySlips] = useState([]);

  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = MONTHS[today.getMonth()];
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, today.getMonth() + 1, 0).getDate();

  const [formData, setFormData] = useState({
    employeeId: '', basicSalary: 50000, hra: 20000,
    transportAllowance: 3000, medicalAllowance: 2500,
    specialAllowance: 5000, bonus: 0,
    workingDays: 22, daysWorked: 22,
    month: currentMonth, year: currentYear
  });

  // Employee salary configurations with per-day computation
  const employeeSalaryData = useMemo(() => {
    return (employees || []).map((emp, i) => {
      const base = [65000, 55000, 42000, 60000, 48000][i % 5];
      const hra = Math.round(base * 0.40);
      const transport = 3000;
      const medical = 2500;
      const special = Math.round(base * 0.10);
      const gross = base + hra + transport + medical + special;
      const pf = Math.round(base * 0.12);
      const esi = gross <= 21000 ? Math.round(gross * 0.0075) : 0;
      const profTax = 200;
      const incomeTax = Math.round(gross * 0.10);
      const totalDeductions = pf + esi + profTax + incomeTax;
      const net = gross - totalDeductions;
      const perDay = Math.round(net / 22);
      const accumulated = perDay * Math.min(currentDay, 22);
      const progress = Math.min((currentDay / daysInMonth) * 100, 100);

      return {
        ...emp,
        basicSalary: base, hra, transport, medical, special,
        grossSalary: gross, pf, esi, profTax, incomeTax,
        totalDeductions, netSalary: net, perDay,
        accumulated, progress, daysWorked: Math.min(currentDay, 22)
      };
    });
  }, [employees, currentDay, daysInMonth]);

  const totalMonthlyPayroll = employeeSalaryData.reduce((s, e) => s + e.netSalary, 0);
  const totalAccumulated = employeeSalaryData.reduce((s, e) => s + e.accumulated, 0);
  const avgSalary = employeeSalaryData.length > 0 ? Math.round(totalMonthlyPayroll / employeeSalaryData.length) : 0;

  const handleGenerateSlip = (e) => {
    e.preventDefault();
    const emp = (employees || []).find(e => e.id === formData.employeeId);
    if (!emp) return;

    const gross = formData.basicSalary + formData.hra + formData.transportAllowance
      + formData.medicalAllowance + formData.specialAllowance + formData.bonus;
    const pf = Math.round(formData.basicSalary * 0.12);
    const esi = gross <= 21000 ? Math.round(gross * 0.0075) : 0;
    const profTax = 200;
    const incomeTax = Math.round(gross * 0.10);
    const totalDeductions = pf + esi + profTax + incomeTax;
    const net = gross - totalDeductions;
    const perDay = Math.round(net / formData.workingDays);

    const newSlip = {
      id: `SAL-${formData.year}-${String(salarySlips.length + 1).padStart(4, '0')}`,
      clientId: activeTenant?.id || 'client-001',
      employeeId: emp.id,
      employeeName: emp.name,
      designation: emp.designation,
      month: formData.month, year: formData.year,
      basicSalary: formData.basicSalary, hra: formData.hra,
      transportAllowance: formData.transportAllowance,
      medicalAllowance: formData.medicalAllowance,
      specialAllowance: formData.specialAllowance,
      bonus: formData.bonus,
      grossSalary: gross, pf, esi, professionalTax: profTax, incomeTax,
      totalDeductions, netSalary: net, perDayRate: perDay,
      workingDays: formData.workingDays,
      daysWorked: formData.daysWorked,
      status: 'Generated',
      createdAt: new Date().toISOString()
    };

    setSalarySlips(prev => [newSlip, ...prev]);
    setShowGenerateModal(false);
  };

  const markPaid = (slipId) => {
    setSalarySlips(prev => prev.map(s =>
      s.id === slipId ? { ...s, status: 'Paid', paidDate: new Date().toISOString().split('T')[0] } : s
    ));
  };

  const formatCurrency = (val) => `₹${(val || 0).toLocaleString('en-IN')}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: '700', textTransform: 'uppercase' }}>
            Payroll & Compensation Management
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '4px 0' }}>
            Salary Module
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Track per-day salary accumulation, generate payslips, and manage payroll disbursements.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setActiveView('accumulation')}
            className={`btn ${activeView === 'accumulation' ? 'gradient-btn-primary' : 'btn-secondary'}`}
            style={{ padding: '10px 16px', fontSize: '0.8rem' }}
          >
            <TrendingUp style={{ width: '16px', height: '16px' }} /> Per Day Tracker
          </button>
          <button
            onClick={() => setActiveView('slips')}
            className={`btn ${activeView === 'slips' ? 'gradient-btn-primary' : 'btn-secondary'}`}
            style={{ padding: '10px 16px', fontSize: '0.8rem' }}
          >
            <FileText style={{ width: '16px', height: '16px' }} /> Salary Slips
          </button>
          <button
            onClick={() => setShowGenerateModal(true)}
            className="btn gradient-btn-primary"
            style={{ padding: '10px 16px', fontSize: '0.8rem' }}
          >
            <PlusCircle style={{ width: '16px', height: '16px' }} /> Generate Slip
          </button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div className="glass-card" style={{ padding: '20px', borderTop: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Payroll</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f59e0b' }}>{formatCurrency(totalMonthlyPayroll)}</div>
            </div>
            <Wallet style={{ color: '#f59e0b', width: '28px', height: '28px' }} />
          </div>
        </div>
        <div className="glass-card" style={{ padding: '20px', borderTop: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Accumulated (MTD)</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10b981' }}>{formatCurrency(totalAccumulated)}</div>
            </div>
            <TrendingUp style={{ color: '#10b981', width: '28px', height: '28px' }} />
          </div>
        </div>
        <div className="glass-card" style={{ padding: '20px', borderTop: '4px solid #3b82f6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Avg. Salary</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#3b82f6' }}>{formatCurrency(avgSalary)}</div>
            </div>
            <BadgeIndianRupee style={{ color: '#3b82f6', width: '28px', height: '28px' }} />
          </div>
        </div>
        <div className="glass-card" style={{ padding: '20px', borderTop: '4px solid #8b5cf6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Employees</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#8b5cf6' }}>{employeeSalaryData.length}</div>
            </div>
            <Users style={{ color: '#8b5cf6', width: '28px', height: '28px' }} />
          </div>
        </div>
      </div>

      {/* Salary Per Day Accumulation View */}
      {activeView === 'accumulation' && (
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>
              Per Day Salary Accumulation — {currentMonth} {currentYear} (Day {currentDay}/{daysInMonth})
            </h3>
            <span className="badge badge-emerald">
              <Clock style={{ width: '12px', height: '12px' }} /> Live Tracking
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {employeeSalaryData.map(emp => (
              <div key={emp.id} className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img src={emp.avatar} alt={emp.name} style={{ width: '44px', height: '44px', borderRadius: '12px', objectFit: 'cover' }} />
                <div style={{ flex: '0 0 180px' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{emp.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{emp.designation}</div>
                </div>

                <div style={{ flex: '0 0 100px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Per Day</div>
                  <div style={{ fontWeight: '800', color: '#3b82f6' }}>{formatCurrency(emp.perDay)}</div>
                </div>

                <div style={{ flex: 1, padding: '0 12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {emp.daysWorked} of 22 working days
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: '700' }}>
                      {Math.round(emp.progress)}%
                    </span>
                  </div>
                  <div style={{
                    width: '100%', height: '8px', borderRadius: '4px',
                    background: 'var(--bg-input)', overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${emp.progress}%`, height: '100%', borderRadius: '4px',
                      background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)',
                      transition: 'width 0.6s ease'
                    }} />
                  </div>
                </div>

                <div style={{ flex: '0 0 120px', textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Accumulated</div>
                  <div style={{ fontWeight: '800', fontSize: '1.1rem', color: '#10b981' }}>
                    {formatCurrency(emp.accumulated)}
                  </div>
                </div>

                <div style={{ flex: '0 0 110px', textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Net Monthly</div>
                  <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                    {formatCurrency(emp.netSalary)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Salary Slips View */}
      {activeView === 'slips' && (
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px' }}>
            Generated Salary Slips ({salarySlips.length})
          </h3>

          {salarySlips.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              <FileText style={{ width: '48px', height: '48px', marginBottom: '12px', opacity: 0.4 }} />
              <p>No salary slips generated yet. Click "Generate Slip" to create one.</p>
            </div>
          ) : (
            <div className="custom-table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Slip ID</th>
                    <th>Employee</th>
                    <th>Period</th>
                    <th>Gross</th>
                    <th>Deductions</th>
                    <th>Net Pay</th>
                    <th>Per Day</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {salarySlips.map(slip => (
                    <tr key={slip.id}>
                      <td><code style={{ background: 'var(--bg-input)', padding: '2px 8px', borderRadius: '4px', color: '#f59e0b', fontSize: '0.8rem' }}>{slip.id}</code></td>
                      <td>
                        <div style={{ fontWeight: '700' }}>{slip.employeeName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{slip.designation}</div>
                      </td>
                      <td>{slip.month} {slip.year}</td>
                      <td style={{ fontWeight: '600' }}>{formatCurrency(slip.grossSalary)}</td>
                      <td style={{ color: '#ef4444' }}>-{formatCurrency(slip.totalDeductions)}</td>
                      <td style={{ fontWeight: '800', color: '#10b981' }}>{formatCurrency(slip.netSalary)}</td>
                      <td style={{ color: '#3b82f6', fontWeight: '700' }}>{formatCurrency(slip.perDayRate)}</td>
                      <td>
                        <span className={`badge ${slip.status === 'Paid' ? 'badge-emerald' : 'badge-purple'}`}>
                          {slip.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => setShowSlipModal(slip)}
                            className="btn btn-secondary"
                            style={{ padding: '4px 10px', fontSize: '0.7rem' }}
                          >
                            <Eye style={{ width: '12px', height: '12px' }} /> View
                          </button>
                          {slip.status !== 'Paid' && (
                            <button
                              onClick={() => markPaid(slip.id)}
                              className="btn gradient-btn-primary"
                              style={{ padding: '4px 10px', fontSize: '0.7rem' }}
                            >
                              <CheckCircle2 style={{ width: '12px', height: '12px' }} /> Pay
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Generate Salary Slip Modal */}
      {showGenerateModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '28px', maxWidth: '560px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <DollarSign style={{ color: '#f59e0b', width: '24px', height: '24px' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Generate Salary Slip</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Enter salary components to automatically compute deductions and generate the payslip.
            </p>

            <form onSubmit={handleGenerateSlip}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Select Employee</label>
                  <select
                    required
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    className="form-select"
                  >
                    <option value="">-- Choose Employee --</option>
                    {(employees || []).map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name} ({emp.designation})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Month</label>
                  <select value={formData.month} onChange={(e) => setFormData({ ...formData, month: e.target.value })} className="form-select">
                    {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Year</label>
                  <input type="number" value={formData.year} onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })} className="form-input" />
                </div>

                <div className="form-group">
                  <label className="form-label">Basic Salary (₹)</label>
                  <input type="number" value={formData.basicSalary} onChange={(e) => setFormData({ ...formData, basicSalary: parseInt(e.target.value) || 0 })} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">HRA (₹)</label>
                  <input type="number" value={formData.hra} onChange={(e) => setFormData({ ...formData, hra: parseInt(e.target.value) || 0 })} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Transport Allowance (₹)</label>
                  <input type="number" value={formData.transportAllowance} onChange={(e) => setFormData({ ...formData, transportAllowance: parseInt(e.target.value) || 0 })} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Medical Allowance (₹)</label>
                  <input type="number" value={formData.medicalAllowance} onChange={(e) => setFormData({ ...formData, medicalAllowance: parseInt(e.target.value) || 0 })} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Special Allowance (₹)</label>
                  <input type="number" value={formData.specialAllowance} onChange={(e) => setFormData({ ...formData, specialAllowance: parseInt(e.target.value) || 0 })} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Bonus (₹)</label>
                  <input type="number" value={formData.bonus} onChange={(e) => setFormData({ ...formData, bonus: parseInt(e.target.value) || 0 })} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Working Days</label>
                  <input type="number" value={formData.workingDays} onChange={(e) => setFormData({ ...formData, workingDays: parseInt(e.target.value) || 22 })} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Days Worked</label>
                  <input type="number" value={formData.daysWorked} onChange={(e) => setFormData({ ...formData, daysWorked: parseInt(e.target.value) || 22 })} className="form-input" />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowGenerateModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn gradient-btn-primary">Generate Salary Slip</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Salary Slip Detail Modal */}
      {showSlipModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '28px', maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Salary Slip</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {showSlipModal.id} • {showSlipModal.month} {showSlipModal.year}
                </div>
              </div>
              <span className={`badge ${showSlipModal.status === 'Paid' ? 'badge-emerald' : 'badge-purple'}`}>
                {showSlipModal.status}
              </span>
            </div>

            <div className="glass-card" style={{ padding: '16px', marginBottom: '16px' }}>
              <div style={{ fontWeight: '700', fontSize: '1.05rem' }}>{showSlipModal.employeeName}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{showSlipModal.designation}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Working Days: {showSlipModal.daysWorked} / {showSlipModal.workingDays} &nbsp;|&nbsp; Per Day Rate: {formatCurrency(showSlipModal.perDayRate)}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#10b981', marginBottom: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>Earnings</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Basic Salary</span><span>{formatCurrency(showSlipModal.basicSalary)}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>HRA</span><span>{formatCurrency(showSlipModal.hra)}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Transport Allowance</span><span>{formatCurrency(showSlipModal.transportAllowance)}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Medical Allowance</span><span>{formatCurrency(showSlipModal.medicalAllowance)}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Special Allowance</span><span>{formatCurrency(showSlipModal.specialAllowance)}</span></div>
                  {showSlipModal.bonus > 0 && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Bonus</span><span>{formatCurrency(showSlipModal.bonus)}</span></div>}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', borderTop: '1px solid var(--border-color)', paddingTop: '6px', color: '#10b981' }}>
                    <span>Gross Salary</span><span>{formatCurrency(showSlipModal.grossSalary)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ef4444', marginBottom: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>Deductions</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Provident Fund (PF)</span><span>{formatCurrency(showSlipModal.pf)}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>ESI</span><span>{formatCurrency(showSlipModal.esi)}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Professional Tax</span><span>{formatCurrency(showSlipModal.professionalTax)}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Income Tax (TDS)</span><span>{formatCurrency(showSlipModal.incomeTax)}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', borderTop: '1px solid var(--border-color)', paddingTop: '6px', color: '#ef4444' }}>
                    <span>Total Deductions</span><span>{formatCurrency(showSlipModal.totalDeductions)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card" style={{
              padding: '16px', textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Net Payable Salary</div>
              <div style={{ fontSize: '2rem', fontWeight: '900', color: '#10b981' }}>{formatCurrency(showSlipModal.netSalary)}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
              <button onClick={() => setShowSlipModal(null)} className="btn btn-secondary">Close</button>
              <button onClick={() => window.print()} className="btn gradient-btn-primary">
                <Printer style={{ width: '14px', height: '14px' }} /> Print Slip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryModule;
