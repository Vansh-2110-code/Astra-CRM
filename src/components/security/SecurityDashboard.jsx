import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  ShieldCheck,
  Lock,
  Eye,
  Key,
  Database,
  FileText,
  AlertTriangle,
  Users,
  CheckCircle2,
  Server,
  Terminal,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';

const SecurityDashboard = () => {
  const { securityConfig, setSecurityConfig, auditLogs, logAudit, roles, activeRole, updateRolePermissions, employees, createEmployee, updateEmployeeRoleAndDesignation } = useCRM();
  const [activeSubTab, setActiveSubTab] = useState('audit'); // 'audit' | 'policies' | 'rbac' | 'employees'
  const [logFilterSeverity, setLogFilterSeverity] = useState('ALL');
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [showAddEmpModal, setShowAddEmpModal] = useState(false);
  const [newEmp, setNewEmp] = useState({ name: '', email: '', designation: '', roleId: 'role-exec' });

  const handleCreateEmployeeSubmit = async (e) => {
    e.preventDefault();
    if (!newEmp.name || !newEmp.email) return;

    try {
      if (createEmployee) {
        await createEmployee(newEmp);
      }
      if (logAudit) {
        logAudit('CREATE_EMPLOYEE', newEmp.email, `Created new employee profile: ${newEmp.name} (${newEmp.designation}).`, 'MEDIUM');
      }
      setShowAddEmpModal(false);
      setNewEmp({ name: '', email: '', designation: '', roleId: 'role-exec' });
    } catch (err) {
      alert(err.message || 'Failed to create employee');
    }
  };

  // Check if active user has security admin permission to toggle permissions
  const isSecurityAdmin = (activeRole?.permissions || []).includes('security_admin') || activeRole?.id === 'role-admin';

  // Toggle Security Policy Flags
  const toggle2FA = () => {
    const nextVal = !(securityConfig?.twoFactorRequired || false);
    setSecurityConfig(prev => ({ ...prev, twoFactorRequired: nextVal }));
    if (logAudit) logAudit('UPDATE_SECURITY_POLICY', '2FA Requirement', `Toggled global 2FA requirement to ${nextVal ? 'ENFORCED' : 'OPTIONAL'}.`, 'HIGH');
  };

  const toggleIPWhitelist = () => {
    const nextVal = !(securityConfig?.ipWhitelisting?.enabled || false);
    setSecurityConfig(prev => ({
      ...prev,
      ipWhitelisting: { ...(prev?.ipWhitelisting || {}), enabled: nextVal }
    }));
    if (logAudit) logAudit('UPDATE_SECURITY_POLICY', 'IP Whitelisting', `Toggled IP Whitelisting protection to ${nextVal ? 'ENABLED' : 'DISABLED'}.`, 'HIGH');
  };

  // Filtered Audit Logs with defensive null checks
  const filteredLogs = (auditLogs || []).filter(log => {
    if (!log) return false;
    const matchesSev = logFilterSeverity === 'ALL' || log.severity === logFilterSeverity;
    const userStr = (log.userEmail || log.user || 'system@astracrm.io').toLowerCase();
    const actionStr = (log.action || '').toLowerCase();
    const detailsStr = (log.details || '').toLowerCase();
    const resourceStr = (log.resource || '').toLowerCase();
    const query = (logSearchQuery || '').toLowerCase();

    const matchesSearch = !query ||
                          userStr.includes(query) ||
                          actionStr.includes(query) ||
                          detailsStr.includes(query) ||
                          resourceStr.includes(query);
    return matchesSev && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#c084fc', fontWeight: '700', textTransform: 'uppercase' }}>
            Enterprise Zero-Trust Security Suite
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '4px 0' }}>
            Security Control Center & Audit Vault
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Real-time compliance monitoring, immutable activity audit logging, role-based access matrix, and data encryption safeguards.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', background: 'var(--bg-primary)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <button
            onClick={() => setActiveSubTab('audit')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.8rem',
              fontWeight: '700',
              cursor: 'pointer',
              background: activeSubTab === 'audit' ? 'var(--accent-blue)' : 'transparent',
              color: activeSubTab === 'audit' ? '#fff' : 'var(--text-muted)'
            }}
          >
            Audit Log Vault
          </button>
          <button
            onClick={() => setActiveSubTab('policies')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.8rem',
              fontWeight: '700',
              cursor: 'pointer',
              background: activeSubTab === 'policies' ? 'var(--accent-blue)' : 'transparent',
              color: activeSubTab === 'policies' ? '#fff' : 'var(--text-muted)'
            }}
          >
            Security Policies
          </button>
          <button
            onClick={() => setActiveSubTab('rbac')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.8rem',
              fontWeight: '700',
              cursor: 'pointer',
              background: activeSubTab === 'rbac' ? 'var(--accent-blue)' : 'transparent',
              color: activeSubTab === 'rbac' ? '#fff' : 'var(--text-muted)'
            }}
          >
            RBAC Permissions
          </button>
          <button
            onClick={() => setActiveSubTab('employees')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.8rem',
              fontWeight: '700',
              cursor: 'pointer',
              background: activeSubTab === 'employees' ? 'var(--accent-blue)' : 'transparent',
              color: activeSubTab === 'employees' ? '#fff' : 'var(--text-muted)'
            }}
          >
            Employee Directory
          </button>
        </div>
      </div>


      {/* Overview Security Badges */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        
        <div className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '12px', borderRadius: '12px' }}>
            <Lock style={{ width: '22px', height: '22px', color: '#34d399' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>ENCRYPTION AT REST</div>
            <div style={{ fontWeight: '800', fontSize: '0.95rem' }}>AES-256 (KMS)</div>
            <div style={{ fontSize: '0.68rem', color: '#34d399' }}>TLS 1.3 in transit</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '12px', borderRadius: '12px' }}>
            <Key style={{ width: '22px', height: '22px', color: '#60a5fa' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>2FA REQUIREMENT</div>
            <div style={{ fontWeight: '800', fontSize: '0.95rem' }}>
              {securityConfig.twoFactorRequired ? 'Enforced (Mandatory)' : 'Optional'}
            </div>
            <div style={{ fontSize: '0.68rem', color: '#60a5fa' }}>TOTP / YubiKey Hardware</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ background: 'rgba(139, 92, 246, 0.15)', padding: '12px', borderRadius: '12px' }}>
            <ShieldCheck style={{ width: '22px', height: '22px', color: '#c084fc' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>SOC2 TYPE II</div>
            <div style={{ fontWeight: '800', fontSize: '0.95rem' }}>Compliant</div>
            <div style={{ fontSize: '0.68rem', color: '#c084fc' }}>Audited Jun 2026</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '12px', borderRadius: '12px' }}>
            <Server style={{ width: '22px', height: '22px', color: '#fbbf24' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>SESSION TIMEOUT</div>
            <div style={{ fontWeight: '800', fontSize: '0.95rem' }}>{securityConfig.sessionTimeoutMinutes} Mins</div>
            <div style={{ fontSize: '0.68rem', color: '#fbbf24' }}>Auto logout on idle</div>
          </div>
        </div>

      </div>

      {/* SUB-TAB 1: AUDIT LOG VAULT */}
      {activeSubTab === 'audit' && (
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Immutable System Audit Log</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Recorded timestamp, user, role, IP address, resource target, and action payload for all administrative events.
              </p>
            </div>

            {/* Filter controls */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ position: 'relative', width: '220px' }}>
                <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Filter logs..."
                  value={logSearchQuery}
                  onChange={(e) => setLogSearchQuery(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '32px', fontSize: '0.8rem', width: '100%' }}
                />
              </div>

              <select
                value={logFilterSeverity}
                onChange={(e) => setLogFilterSeverity(e.target.value)}
                className="form-select"
                style={{ fontSize: '0.8rem' }}
              >
                <option value="ALL">All Severities</option>
                <option value="HIGH">HIGH Severity</option>
                <option value="MEDIUM">MEDIUM Severity</option>
                <option value="INFO">INFO Only</option>
              </select>
            </div>
          </div>

          <div className="custom-table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Timestamp (UTC)</th>
                  <th>User & Role</th>
                  <th>Action Event</th>
                  <th>Resource Target</th>
                  <th>IP Address</th>
                  <th>Severity</th>
                  <th>Event Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map(log => (
                  <tr key={log.id}>
                    <td>
                      <code style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {new Date(log.timestamp || Date.now()).toLocaleString()}
                      </code>
                    </td>
                    <td>
                      <div style={{ fontWeight: '700' }}>{log.userEmail || log.user || 'system@astracrm.io'}</div>
                      <div style={{ fontSize: '0.725rem', color: '#c084fc' }}>{log.roleName || log.role || 'Super Admin / Org Admin'}</div>
                    </td>
                    <td>
                      <span style={{ fontWeight: '800', fontSize: '0.78rem', color: '#60a5fa' }}>
                        {log.action}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: '600' }}>{log.resource}</span>
                    </td>
                    <td>
                      <code style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{log.ipAddress}</code>
                    </td>
                    <td>
                      <span className={`badge ${log.severity === 'HIGH' ? 'badge-rose' : log.severity === 'MEDIUM' ? 'badge-amber' : 'badge-blue'}`}>
                        {log.severity}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{log.details}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: SECURITY POLICIES */}
      {activeSubTab === 'policies' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '20px' }}>Global Security & Authentication Policies</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            
            {/* Policy 1: 2FA & Session */}
            <div className="glass-card" style={{ padding: '20px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key style={{ width: '18px', height: '18px', color: '#60a5fa' }} />
                Authentication Safeguards
              </h4>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>Enforce 2FA for All Users</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Require TOTP authenticator app verification on login</div>
                </div>
                <input
                  type="checkbox"
                  checked={securityConfig.twoFactorRequired}
                  onChange={toggle2FA}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>IP Whitelisting Perimeter</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Restrict login access strictly to authorized IP subnet blocks</div>
                </div>
                <input
                  type="checkbox"
                  checked={securityConfig.ipWhitelisting.enabled}
                  onChange={toggleIPWhitelist}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
              </div>
            </div>

            {/* Policy 2: Allowed Subnets */}
            <div className="glass-card" style={{ padding: '20px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Terminal style={{ width: '18px', height: '18px', color: '#34d399' }} />
                Whitelisted Subnet Blocks
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {securityConfig.ipWhitelisting.allowedIPs.map(ip => (
                  <div key={ip} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-input)', borderRadius: '6px' }}>
                    <code style={{ color: '#34d399', fontSize: '0.85rem' }}>{ip}</code>
                    <span className="badge badge-emerald">ALLOWED</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  const newIp = prompt('Enter new trusted IP address or CIDR block:');
                  if (newIp) {
                    setSecurityConfig(prev => ({
                      ...prev,
                      ipWhitelisting: {
                        ...prev.ipWhitelisting,
                        allowedIPs: [...prev.ipWhitelisting.allowedIPs, newIp]
                      }
                    }));
                    logAudit('UPDATE_SECURITY_POLICY', 'IP Whitelist', `Added IP ${newIp} to whitelisted subnet list.`, 'HIGH');
                  }
                }}
                className="btn btn-secondary"
                style={{ width: '100%', fontSize: '0.8rem' }}
              >
                + Add Trusted IP / Subnet Block
              </button>
            </div>

          </div>
        </div>
      )}

      {/* SUB-TAB 3: RBAC PERMISSIONS */}
      {activeSubTab === 'rbac' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px' }}>Zero-Trust Role-Based Access Control (RBAC) Matrix</h3>
          
          <div className="custom-table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Role Name & Description</th>
                  <th>Assigned Users</th>
                  <th>View All</th>
                  <th>Edit / Create</th>
                  <th>Delete Data</th>
                  <th>Approve Quotes</th>
                  <th>Export Data</th>
                  <th>Security Admin</th>
                </tr>
              </thead>
              <tbody>
                {roles.map(r => (
                  <tr key={r.id}>
                    <td>
                      <div style={{ fontWeight: '800', color: '#c084fc' }}>{r.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.description}</div>
                    </td>
                    <td>
                      <span className="badge badge-blue">{r.usersCount} Active Users</span>
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={r.permissions.includes('view_all') || r.permissions.includes('view_leads') || r.permissions.includes('view_tickets')}
                        disabled={!isSecurityAdmin}
                        onChange={() => updateRolePermissions(r.id, 'view_all')}
                        style={{ width: '18px', height: '18px', cursor: isSecurityAdmin ? 'pointer' : 'not-allowed' }}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={r.permissions.includes('edit_all') || r.permissions.includes('edit_own_leads') || r.permissions.includes('create_quotes')}
                        disabled={!isSecurityAdmin}
                        onChange={() => updateRolePermissions(r.id, 'edit_all')}
                        style={{ width: '18px', height: '18px', cursor: isSecurityAdmin ? 'pointer' : 'not-allowed' }}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={r.permissions.includes('delete_all')}
                        disabled={!isSecurityAdmin}
                        onChange={() => updateRolePermissions(r.id, 'delete_all')}
                        style={{ width: '18px', height: '18px', cursor: isSecurityAdmin ? 'pointer' : 'not-allowed' }}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={r.permissions.includes('approve_quotes') || r.permissions.includes('approve_discounts')}
                        disabled={!isSecurityAdmin}
                        onChange={() => updateRolePermissions(r.id, 'approve_quotes')}
                        style={{ width: '18px', height: '18px', cursor: isSecurityAdmin ? 'pointer' : 'not-allowed' }}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={r.permissions.includes('export_data') || r.permissions.includes('export_financials')}
                        disabled={!isSecurityAdmin}
                        onChange={() => updateRolePermissions(r.id, 'export_data')}
                        style={{ width: '18px', height: '18px', cursor: isSecurityAdmin ? 'pointer' : 'not-allowed' }}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={r.permissions.includes('security_admin') || r.permissions.includes('client_onboard')}
                        disabled={!isSecurityAdmin}
                        onChange={() => updateRolePermissions(r.id, 'security_admin')}
                        style={{ width: '18px', height: '18px', cursor: isSecurityAdmin ? 'pointer' : 'not-allowed' }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: EMPLOYEE DIRECTORY */}
      {activeSubTab === 'employees' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Corporate Designation & Role Directory</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {!isSecurityAdmin
                  ? "Read-only View: Only Super Admins can re-designate employees or alter access roles."
                  : "Change employee designations and roles dynamically. Changes take effect on next login."
                }
              </p>
            </div>
            {isSecurityAdmin && (
              <button
                onClick={() => setShowAddEmpModal(true)}
                className="btn gradient-btn-primary"
                style={{ padding: '10px 18px', fontSize: '0.8rem' }}
              >
                + Add New Employee
              </button>
            )}
          </div>

          <div className="custom-table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Employee Profile</th>
                  <th>Mock ID Code</th>
                  <th>Designation / Corporate Title</th>
                  <th>System Access Role</th>
                  {isSecurityAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => (
                  <EmployeeRow
                    key={emp.id}
                    emp={emp}
                    roles={roles}
                    isSecurityAdmin={isSecurityAdmin}
                    updateEmployeeRoleAndDesignation={updateEmployeeRoleAndDesignation}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add New Employee Modal */}
      {showAddEmpModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '28px', maxWidth: '480px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '6px' }}>Add New Corporate Employee</h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Create an employee profile and assign organizational system access permissions.
            </p>

            <form onSubmit={handleCreateEmployeeSubmit}>
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Rivera"
                  value={newEmp.name}
                  onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">Corporate Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. alex.rivera@company.com"
                  value={newEmp.email}
                  onChange={(e) => setNewEmp({ ...newEmp, email: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">Designation / Corporate Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Account Executive"
                  value={newEmp.designation}
                  onChange={(e) => setNewEmp({ ...newEmp, designation: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">System Access Role</label>
                <select
                  value={newEmp.roleId}
                  onChange={(e) => setNewEmp({ ...newEmp, roleId: e.target.value })}
                  className="form-select"
                >
                  {(roles || []).map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setShowAddEmpModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn gradient-btn-primary">Create Employee Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

const EmployeeRow = ({ emp, roles, isSecurityAdmin, updateEmployeeRoleAndDesignation }) => {
  const [designation, setDesignation] = useState(emp.designation);
  const [roleId, setRoleId] = useState(emp.roleId);

  const matchedRole = roles.find(r => r.id === roleId);

  return (
    <tr>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={emp.avatar} alt={emp.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
          <div>
            <div style={{ fontWeight: '800' }}>{emp.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{emp.email}</div>
          </div>
        </div>
      </td>
      <td>
        <code style={{ background: 'var(--bg-input)', padding: '2px 8px', borderRadius: '4px', color: '#6366f1', fontSize: '0.8rem', fontWeight: '800' }}>
          {emp.id}
        </code>
      </td>
      <td>
        {isSecurityAdmin ? (
          <input
            type="text"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            className="form-input"
            style={{ fontSize: '0.8rem', padding: '6px 10px', width: '220px' }}
          />
        ) : (
          <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{emp.designation}</span>
        )}
      </td>
      <td>
        {isSecurityAdmin ? (
          <select
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            className="form-select"
            style={{ fontSize: '0.8rem', padding: '6px' }}
          >
            {roles.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        ) : (
          <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>{matchedRole?.name || 'Representative'}</span>
        )}
      </td>
      {isSecurityAdmin && (
        <td>
          <button
            onClick={() => {
              updateEmployeeRoleAndDesignation(emp.id, roleId, designation);
              alert(`Profile updated successfully for ${emp.name}.`);
            }}
            className="btn gradient-btn-primary"
            style={{ padding: '6px 12px', fontSize: '0.75rem' }}
          >
            Save Profile
          </button>
        </td>
      )}
    </tr>
  );
};

export default SecurityDashboard;

