import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  Search,
  Bell,
  Building,
  UserCheck,
  Shield,
  Plus,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

const Header = ({ onOpenQuickCreate }) => {
  const {
    allClients,
    activeTenant,
    setActiveTenantId,
    roles,
    activeRole,
    setActiveRoleId,
    globalSearch,
    setGlobalSearch,
    notifications,
    setNotifications
  } = useCRM();

  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 'var(--sidebar-width)',
      right: 0,
      height: 'var(--header-height)',
      background: 'var(--bg-secondary)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      zIndex: 90
    }}>
      {/* Global Search Bar */}
      <div style={{ position: 'relative', width: '340px' }}>
        <Search style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '16px',
          height: '16px',
          color: 'var(--text-muted)'
        }} />
        <input
          type="text"
          placeholder="Search leads, quotes, products, clients..."
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          className="form-input"
          style={{
            width: '100%',
            paddingLeft: '36px',
            paddingRight: '12px',
            fontSize: '0.825rem',
            background: 'var(--bg-primary)',
            borderRadius: '10px'
          }}
        />
      </div>

      {/* Right Header Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

        {/* Client Tenant Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-primary)', padding: '6px 12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <Building style={{ width: '15px', height: '15px', color: '#60a5fa' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>Tenant:</span>
          <select
            value={activeTenant?.id || ''}
            onChange={(e) => setActiveTenantId(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontWeight: '700',
              fontSize: '0.8rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {allClients.map(c => (
              <option key={c.id} value={c.id} style={{ background: '#1e293b', color: '#fff' }}>
                {c.name} ({c.plan})
              </option>
            ))}
          </select>
        </div>


        {/* Notifications Dropdown Toggle */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              position: 'relative',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Bell style={{ width: '18px', height: '18px', color: 'var(--text-primary)' }} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#f43f5e',
                color: '#fff',
                fontSize: '0.65rem',
                fontWeight: '800',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(244, 63, 94, 0.5)'
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Panel */}
          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: '48px',
              right: 0,
              width: '320px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              padding: '16px',
              zIndex: 100
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: '700' }}>System Notifications</h4>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: '#60a5fa', fontSize: '0.75rem', cursor: 'pointer' }}>
                    Mark read
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '250px', overflowY: 'auto' }}>
                {notifications.map(n => (
                  <div key={n.id} style={{
                    padding: '10px',
                    borderRadius: '8px',
                    background: n.unread ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.8rem'
                  }}>
                    <div style={{ fontWeight: '700', color: n.unread ? '#60a5fa' : 'var(--text-primary)' }}>{n.title}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '2px' }}>{n.message}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px' }}>{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Action Button */}
        <button
          onClick={onOpenQuickCreate}
          className="btn gradient-btn-primary"
          style={{ borderRadius: '10px' }}
        >
          <Plus style={{ width: '16px', height: '16px' }} />
          <span>Quick Create</span>
        </button>

      </div>
    </header>
  );
};

export default Header;
