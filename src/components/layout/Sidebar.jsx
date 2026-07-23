import React from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  LayoutDashboard,
  Users,
  Building2,
  Kanban,
  Package,
  FileText,
  ShoppingBag,
  Clock,
  CheckSquare,
  Headphones,
  Megaphone,
  FolderLock,
  Boxes,
  ShieldCheck,
  Building,
  Sun,
  Moon,
  LogOut,
  ChevronRight,
  Sparkles,
  Wallet,
  BarChart3
} from 'lucide-react';

const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard & Analytics', icon: LayoutDashboard, category: 'Main' },
  { id: 'reports', label: 'Reports & Intelligence', icon: BarChart3, category: 'Main' },
  { id: 'onboarding', label: 'Client Onboarding', icon: Building, category: 'Tenant' },
  { id: 'security', label: 'Security & Audit Vault', icon: ShieldCheck, category: 'Tenant' },
  
  { id: 'leads', label: 'Lead Management', icon: Users, category: 'Sales' },
  { id: 'ai-assistant', label: 'AI Sales Assistant', icon: Sparkles, category: 'Sales' },
  { id: 'contacts', label: 'Contacts & Accounts', icon: Building2, category: 'Sales' },
  { id: 'pipeline', label: 'Sales Pipeline Kanban', icon: Kanban, category: 'Sales' },
  { id: 'products', label: 'Product Catalog', icon: Package, category: 'Sales' },
  { id: 'quotes', label: 'Quotation Engine', icon: FileText, category: 'Sales' },
  { id: 'orders', label: 'Orders & Invoices', icon: ShoppingBag, category: 'Sales' },

  { id: 'activities', label: 'Activities & Call Logs', icon: Clock, category: 'Operations' },
  { id: 'tasks', label: 'Tasks & Follow-ups', icon: CheckSquare, category: 'Operations' },
  { id: 'support', label: 'Customer Support Desk', icon: Headphones, category: 'Operations' },
  
  { id: 'marketing', label: 'Marketing Campaigns', icon: Megaphone, category: 'Growth' },
  { id: 'documents', label: 'Document Vault', icon: FolderLock, category: 'Growth' },
  { id: 'integrations', label: 'Integrations Hub', icon: Boxes, category: 'Growth' },
  { id: 'salary', label: 'Salary & Payroll', icon: Wallet, category: 'HR' },
];

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { activeTenant, activeRole, theme, setTheme, logout, currentUser } = useCRM();

  return (
    <aside style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: 'var(--sidebar-width)',
      height: '100vh',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
      transition: 'all 0.3s ease'
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(99, 102, 241, 0.5)'
        }}>
          <Sparkles style={{ color: '#fff', width: '22px', height: '22px' }} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ASTRA CRM
          </h1>
          <span style={{ fontSize: '0.68rem', color: '#a5b4fc', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Enterprise Suite
          </span>
        </div>
      </div>

      {/* Active Tenant Badge */}
      <div style={{
        margin: '14px 16px 6px 16px',
        padding: '10px 14px',
        background: 'rgba(99, 102, 241, 0.08)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <img
          src={activeTenant?.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80'}
          alt={activeTenant?.name || 'Organization'}
          style={{ width: '28px', height: '28px', borderRadius: '6px', objectFit: 'cover' }}
        />
        <div style={{ overflow: 'hidden', flex: 1 }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {activeTenant?.name || 'Organization'}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            Plan: <span style={{ color: '#34d399', fontWeight: '600' }}>{activeTenant?.plan || 'Enterprise'}</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px' }}>
        {MENU_ITEMS.filter(item => {
          const perms = activeRole?.permissions || [];
          if (perms.includes('view_all')) return true;
          
          switch(item.id) {
            case 'dashboard':
              return perms.length > 0;
            case 'onboarding':
              return perms.includes('client_onboard');
            case 'security':
              return perms.includes('security_admin') || perms.includes('view_audit_logs');
            case 'leads':
              return perms.includes('view_leads') || perms.includes('edit_own_leads');
            case 'contacts':
              return perms.includes('view_customers');
            case 'pipeline':
              return perms.includes('view_leads') || perms.includes('edit_all');
            case 'products':
              return perms.includes('view_products');
            case 'quotes':
              return perms.includes('view_quotes') || perms.includes('create_quotes');
            case 'orders':
              return perms.includes('manage_invoices') || perms.includes('view_quotes');
            case 'activities':
            case 'tasks':
              return perms.includes('log_activities') || perms.includes('view_leads');
            case 'support':
              return perms.includes('view_tickets');
            case 'marketing':
              return perms.includes('export_data');
            case 'documents':
              return perms.includes('view_quotes');
            case 'integrations':
              return perms.includes('security_admin');
            default:
              return false;
          }
        }).map((item, index, filteredArr) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const showCategoryHeader = index === 0 || filteredArr[index - 1].category !== item.category;

          return (
            <React.Fragment key={item.id}>
              {showCategoryHeader && (
                <div style={{
                  fontSize: '0.68rem',
                  fontWeight: '800',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  margin: index === 0 ? '4px 8px 8px 8px' : '16px 8px 8px 8px'
                }}>
                  {item.category}
                </div>
              )}

              <button
                onClick={() => setActiveTab(item.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '9px 12px',
                  marginBottom: '3px',
                  borderRadius: '10px',
                  background: isActive ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(168, 85, 247, 0.15) 100%)' : 'transparent',
                  border: isActive ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
                  color: isActive ? '#818cf8' : 'var(--text-secondary)',
                  fontWeight: isActive ? '700' : '500',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  textAlign: 'left'
                }}
              >
                <Icon style={{ width: '18px', height: '18px', flexShrink: 0, color: isActive ? '#818cf8' : 'var(--text-muted)' }} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {isActive && <ChevronRight style={{ width: '14px', height: '14px' }} />}
              </button>
            </React.Fragment>
          );
        })}
      </div>

      {/* Footer & User / Theme Switcher */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        background: 'rgba(0,0,0,0.15)'
      }}>
        {/* Digital Employee ID Badge */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80'}
              alt={currentUser?.name}
              style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1.5px solid #6366f1', objectFit: 'cover' }}
            />
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser?.name}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser?.designation || 'Representative'}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.65rem', borderTop: '1px solid var(--border-color)', paddingTop: '6px', marginTop: '2px', color: 'var(--text-muted)' }}>
            <span>ID: <strong style={{ color: '#6366f1' }}>{currentUser?.id || 'EMP-999'}</strong></span>
            <span style={{ textTransform: 'uppercase', fontWeight: '800', color: '#a855f7' }}>{currentUser?.role?.split(' ')[0]}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '7px',
              borderRadius: '8px',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontSize: '0.75rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >

            {theme === 'dark' ? <Sun style={{ width: '14px', height: '14px', color: '#fbbf24' }} /> : <Moon style={{ width: '14px', height: '14px', color: '#8b5cf6' }} />}
            <span>Theme</span>
          </button>

          <button
            onClick={logout}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '7px 12px',
              borderRadius: '8px',
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#f43f5e',
              fontSize: '0.75rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <LogOut style={{ width: '14px', height: '14px' }} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
