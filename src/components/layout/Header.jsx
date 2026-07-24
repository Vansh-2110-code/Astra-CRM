import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  Search,
  Bell,
  Building,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Menu
} from 'lucide-react';

const Header = ({ onOpenQuickCreate, onToggleSidebar }) => {
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
    <header className="app-header" style={{
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
      zIndex: 90,
      gap: '16px'
    }}>
      {/* Hamburger button — visible only on mobile via CSS */}
      <button
        className="mobile-menu-btn"
        onClick={onToggleSidebar}
        aria-label="Toggle navigation menu"
      >
        <Menu style={{ width: '24px', height: '24px' }} />
      </button>

      {/* Global Search Bar */}
      <div style={{ position: 'relative', flex: '1', maxWidth: '340px', minWidth: '120px' }}>
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>

        {/* Tenant Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'var(--bg-primary)',
          padding: '6px 10px',
          borderRadius: '10px',
          border: '1px solid var(--border-color)',
          whiteSpace: 'nowrap'
        }}>
          <Building style={{ width: '14px', height: '14px', color: '#60a5fa', flexShrink: 0 }} />
          <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)' }}>Tenant:</span>
          <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            {activeTenant?.name}
          </span>
          <Lock style={{ width: '11px', height: '11px', color: '#a5b4fc' }} title="Locked to organization" />
        </div>

        {/* Notifications */}
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
              cursor: 'pointer',
              flexShrink: 0
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

          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: '48px',
              right: 0,
              width: '300px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              padding: '16px',
              zIndex: 200
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: '700' }}>Notifications</h4>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                      {n.unread
                        ? <AlertTriangle style={{ width: '13px', height: '13px', color: '#f59e0b' }} />
                        : <CheckCircle2 style={{ width: '13px', height: '13px', color: '#10b981' }} />}
                      <span style={{ fontWeight: '700', color: n.unread ? '#60a5fa' : 'var(--text-primary)' }}>{n.title}</span>
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{n.message}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px' }}>{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Create */}
        <button
          onClick={onOpenQuickCreate}
          className="btn gradient-btn-primary"
          style={{ borderRadius: '10px', flexShrink: 0 }}
        >
          <Plus style={{ width: '16px', height: '16px' }} />
          <span>Quick Create</span>
        </button>

      </div>
    </header>
  );
};

export default Header;
