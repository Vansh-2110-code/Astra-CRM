import React, { useState } from 'react';
import { CRMProvider, useCRM } from './context/CRMContext';
import AuthPage from './components/auth/AuthPage';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import ExecutiveDashboard from './components/dashboard/ExecutiveDashboard';
import SecurityDashboard from './components/security/SecurityDashboard';
import LeadList from './components/leads/LeadList';
import ContactManager from './components/contacts/ContactManager';
import KanbanBoard from './components/pipeline/KanbanBoard';
import ProductCatalog from './components/products/ProductCatalog';
import QuoteBuilder from './components/quotes/QuoteBuilder';
import OrderInvoiceManager from './components/orders/OrderInvoiceManager';
import TaskBoard from './components/activities/TaskBoard';
import TicketManager from './components/support/TicketManager';
import CampaignManager from './components/marketing/CampaignManager';
import DocumentVault from './components/documents/DocumentVault';
import IntegrationHub from './components/integrations/IntegrationHub';
import CustomerDashboard from './components/customer/CustomerDashboard';
import CustomerManager from './components/customers/CustomerManager';
import SalaryModule from './components/salary/SalaryModule';
import AISalesAssistant from './components/leads/AISalesAssistant';
import ReportsEngine from './components/reports/ReportsEngine';

const MainLayout = () => {
  const { isAuthenticated, currentUser } = useCRM();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showQuickCreate, setShowQuickCreate] = useState(false);

  // Show Login/Signup auth screen if not authenticated
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // Render customer portal if logged in user is client customer
  if (
    currentUser?.role === 'Customer' ||
    currentUser?.role === 'Customer / Portal User' ||
    currentUser?.roleId === 'role-customer' ||
    currentUser?.designation?.toLowerCase().includes('customer')
  ) {
    return <CustomerDashboard />;
  }


  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ExecutiveDashboard />;
      case 'reports':
        return <ReportsEngine />;
      case 'security':
        return <SecurityDashboard />;
      case 'leads':
        return <LeadList />;
      case 'ai-assistant':
        return <AISalesAssistant />;
      case 'contacts':
        return <ContactManager />;
      case 'pipeline':
        return <KanbanBoard />;
      case 'products':
        return <ProductCatalog />;
      case 'quotes':
        return <QuoteBuilder />;
      case 'orders':
        return <OrderInvoiceManager />;
      case 'activities':
      case 'tasks':
        return <TaskBoard />;
      case 'support':
        return <TicketManager />;
      case 'customers':
        return <CustomerManager />;
      case 'marketing':
        return <CampaignManager />;
      case 'documents':
        return <DocumentVault />;
      case 'integrations':
        return <IntegrationHub />;
      case 'salary':
        return <SalaryModule />;
      default:
        return <ExecutiveDashboard />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <Header onOpenQuickCreate={() => setShowQuickCreate(true)} />
      
      <main className="main-content">
        {renderContent()}
      </main>

      {/* Quick Create Modal Popup */}
      {showQuickCreate && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '24px', maxWidth: '480px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '12px' }}>Quick Create Action</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Rapidly navigate to create a new lead, quotation, or product.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => { setActiveTab('leads'); setShowQuickCreate(false); }}
                className="btn gradient-btn-primary"
                style={{ justifyContent: 'flex-start', padding: '12px' }}
              >
                + Capture New Lead
              </button>
              <button
                onClick={() => { setActiveTab('quotes'); setShowQuickCreate(false); }}
                className="btn btn-secondary"
                style={{ justifyContent: 'flex-start', padding: '12px' }}
              >
                + Generate Product Quotation
              </button>
            </div>
            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button onClick={() => setShowQuickCreate(false)} className="btn btn-secondary">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false
    }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CRMProvider>
        <MainLayout />
      </CRMProvider>
    </QueryClientProvider>
  );
}

export default App;
