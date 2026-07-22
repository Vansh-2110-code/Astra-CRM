import React, { useState } from 'react';
import { CRMProvider, useCRM } from './context/CRMContext';
import AuthPage from './components/auth/AuthPage';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import ExecutiveDashboard from './components/dashboard/ExecutiveDashboard';
import ClientOnboardingWizard from './components/onboarding/ClientOnboardingWizard';
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

const MainLayout = () => {
  const { isAuthenticated, currentUser } = useCRM();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showQuickCreate, setShowQuickCreate] = useState(false);

  // Show Login/Signup auth screen if not authenticated
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // Render customer portal if logged in user is client customer
  if (currentUser?.role === 'Customer') {
    return <CustomerDashboard />;
  }


  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ExecutiveDashboard />;
      case 'onboarding':
        return <ClientOnboardingWizard />;
      case 'security':
        return <SecurityDashboard />;
      case 'leads':
        return <LeadList />;
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
      case 'marketing':
        return <CampaignManager />;
      case 'documents':
        return <DocumentVault />;
      case 'integrations':
        return <IntegrationHub />;
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
              Rapidly navigate to create a new lead, quotation, product, or onboard a new client organization.
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
              <button
                onClick={() => { setActiveTab('onboarding'); setShowQuickCreate(false); }}
                className="btn btn-secondary"
                style={{ justifyContent: 'flex-start', padding: '12px' }}
              >
                + Onboard Client Organization
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

function App() {
  return (
    <CRMProvider>
      <MainLayout />
    </CRMProvider>
  );
}

export default App;
