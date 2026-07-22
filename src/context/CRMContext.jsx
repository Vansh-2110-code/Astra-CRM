import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_CLIENTS,
  INITIAL_SECURITY_CONFIG,
  INITIAL_ROLES,
  INITIAL_AUDIT_LOGS,
  INITIAL_LEADS,
  INITIAL_PRODUCTS,
  INITIAL_DEALS,
  INITIAL_QUOTES,
  INITIAL_ORDERS,
  INITIAL_TICKETS,
  INITIAL_TASKS,
  INITIAL_CAMPAIGNS,
  INITIAL_DOCUMENTS,
  INITIAL_INTEGRATIONS,
  INITIAL_EMPLOYEES
} from '../data/mockData';

const CRMContext = createContext();

export const CRMProvider = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState('dark');

  // Employees directory state
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('crm_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem('astra_auth');
    return saved ? JSON.parse(saved) : true; // Default logged in for demo ease
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('astra_user');
    return saved ? JSON.parse(saved) : {
      id: 'EMP-001',
      email: 'sarah.jenkins@apexglobal.io',
      name: 'Sarah Jenkins',
      designation: 'VP of Sales Operations',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
      role: 'Super Admin / Org Admin',
      roleId: 'role-admin'
    };
  });


  // Multi-tenant Client state
  const [allClients, setAllClients] = useState(() => {
    const saved = localStorage.getItem('crm_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [activeTenantId, setActiveTenantId] = useState(() => {
    const saved = localStorage.getItem('crm_active_tenant');
    return saved || 'client-001';
  });

  const activeTenant = allClients.find(c => c.id === activeTenantId) || allClients[0];

  // RBAC & Role Switcher state
  const [roles, setRoles] = useState(INITIAL_ROLES);
  const [activeRoleId, setActiveRoleId] = useState('role-admin');
  const activeRole = roles.find(r => r.id === activeRoleId) || roles[0];

  // Security Configuration state
  const [securityConfig, setSecurityConfig] = useState(() => {
    const saved = localStorage.getItem('crm_security');
    return saved ? JSON.parse(saved) : INITIAL_SECURITY_CONFIG;
  });

  // Audit Logs state
  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('crm_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Core CRM Data state
  const [leads, setLeads] = useState(() => {
    const saved = localStorage.getItem('crm_leads');
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('crm_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [deals, setDeals] = useState(() => {
    const saved = localStorage.getItem('crm_deals');
    return saved ? JSON.parse(saved) : INITIAL_DEALS;
  });

  const [quotes, setQuotes] = useState(() => {
    const saved = localStorage.getItem('crm_quotes');
    return saved ? JSON.parse(saved) : INITIAL_QUOTES;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('crm_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem('crm_tickets');
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('crm_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [campaigns, setCampaigns] = useState(() => {
    const saved = localStorage.getItem('crm_campaigns');
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  });

  const [documents, setDocuments] = useState(() => {
    const saved = localStorage.getItem('crm_documents');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [integrations, setIntegrations] = useState(() => {
    const saved = localStorage.getItem('crm_integrations');
    return saved ? JSON.parse(saved) : INITIAL_INTEGRATIONS;
  });

  // Search & Global UI State
  const [globalSearch, setGlobalSearch] = useState('');
  const [notifications, setNotifications] = useState([
    { id: 'n1', title: 'New High Score Lead', message: 'Dr. Aris Thorne (Score: 94) requested server spec sheet.', time: '10m ago', unread: true },
    { id: 'n2', title: 'Quote Approved', message: 'Marcus Vance approved QT-2026-880 for Horizon Retail.', time: '1h ago', unread: true },
    { id: 'n3', title: 'Security Alert', message: 'IP Whitelist policy updated by Org Admin.', time: '2h ago', unread: false }
  ]);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('astra_auth', JSON.stringify(isAuthenticated));
    localStorage.setItem('astra_user', JSON.stringify(currentUser));
    localStorage.setItem('crm_clients', JSON.stringify(allClients));
    localStorage.setItem('crm_active_tenant', activeTenantId);
    localStorage.setItem('crm_security', JSON.stringify(securityConfig));
    localStorage.setItem('crm_audit_logs', JSON.stringify(auditLogs));
    localStorage.setItem('crm_leads', JSON.stringify(leads));
    localStorage.setItem('crm_products', JSON.stringify(products));
    localStorage.setItem('crm_deals', JSON.stringify(deals));
    localStorage.setItem('crm_quotes', JSON.stringify(quotes));
    localStorage.setItem('crm_orders', JSON.stringify(orders));
    localStorage.setItem('crm_tickets', JSON.stringify(tickets));
    localStorage.setItem('crm_tasks', JSON.stringify(tasks));
    localStorage.setItem('crm_campaigns', JSON.stringify(campaigns));
    localStorage.setItem('crm_documents', JSON.stringify(documents));
    localStorage.setItem('crm_integrations', JSON.stringify(integrations));
    localStorage.setItem('crm_employees', JSON.stringify(employees));
  }, [isAuthenticated, currentUser, allClients, activeTenantId, securityConfig, auditLogs, leads, products, deals, quotes, orders, tickets, tasks, campaigns, documents, integrations, employees]);

  // Apply HTML attribute for dark/light mode
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Helper: Log Security Audit Action
  const logAudit = (action, resource, details, severity = 'INFO') => {
    const newLog = {
      id: `log-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      user: currentUser ? currentUser.email : 'admin@astracrm.io',
      role: activeRole.name,
      action,
      resource,
      ipAddress: '192.168.1.' + Math.floor(Math.random() * 200 + 10),
      severity,
      details,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // AUTH ACTIONS
  const login = (userEmail, password) => {
    setIsAuthenticated(true);
    if (userEmail.toLowerCase() === 'customer@biogenetics.org') {
      const customerUser = {
        id: 'CUST-901',
        email: 'customer@biogenetics.org',
        name: 'Dr. Aris Thorne',
        designation: 'Managing Director & Lab Head',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        role: 'Customer',
        roleId: 'role-customer'
      };
      setCurrentUser(customerUser);
      return;
    }

    const matchedEmployee = employees.find(emp => emp.email.toLowerCase() === userEmail.toLowerCase()) || {
      id: `EMP-${Math.floor(100 + Math.random() * 900)}`,
      name: userEmail.split('@')[0].replace('.', ' ').toUpperCase(),
      email: userEmail,
      designation: 'Staff Representative',
      roleId: 'role-exec',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80'
    };

    setActiveRoleId(matchedEmployee.roleId);
    
    const matchedRole = roles.find(r => r.id === matchedEmployee.roleId) || roles[0];

    const loggedInUserObj = {
      id: matchedEmployee.id,
      email: matchedEmployee.email,
      name: matchedEmployee.name,
      designation: matchedEmployee.designation,
      avatar: matchedEmployee.avatar,
      role: matchedRole.name,
      roleId: matchedEmployee.roleId
    };

    setCurrentUser(loggedInUserObj);
    logAudit('USER_LOGIN', 'Auth Gateway', `Employee ${matchedEmployee.name} logged in with designation "${matchedEmployee.designation}" and role ${matchedRole.name}.`, 'INFO');
  };


  const signup = (userData) => {
    setIsAuthenticated(true);
    setCurrentUser({
      email: userData.email,
      name: userData.name,
      role: 'Super Admin / Org Admin'
    });
    onboardNewClient({
      name: userData.company,
      subdomain: userData.company.toLowerCase().replace(/[^a-z0-9]/g, ''),
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      industry: 'Enterprise Technology',
      plan: 'Enterprise',
      maxSeats: 50,
      currency: 'USD ($)',
      primaryColor: '#6366f1',
      tenantAdmin: userData.email,
      complianceFlags: ['GDPR', 'SOC2 Type II']
    });
    logAudit('USER_SIGNUP', 'Client Provisioning', `New organization "${userData.company}" registered by ${userData.email}.`, 'HIGH');
  };

  const logout = () => {
    logAudit('USER_LOGOUT', 'Auth Gateway', `User ${currentUser.email} logged out.`, 'INFO');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  // Onboard New Client Tenant
  const onboardNewClient = (clientData) => {
    const newClient = {
      id: `client-${(allClients.length + 1).toString().padStart(3, '0')}`,
      createdDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      seats: 1,
      ...clientData,
    };
    setAllClients(prev => [...prev, newClient]);
    setActiveTenantId(newClient.id);
    logAudit('ONBOARD_CLIENT', `Tenant ID: ${newClient.id}`, `Onboarded new client tenant "${newClient.name}" with plan ${newClient.plan}.`, 'HIGH');
    return newClient;
  };

  // Lead Operations
  const addLead = (leadData) => {
    const isDuplicate = leads.some(l => l.email.toLowerCase() === leadData.email.toLowerCase());
    let calculatedScore = 50;
    if (leadData.potentialValue > 100000) calculatedScore += 25;
    if (leadData.source === 'Website Forms' || leadData.source === 'Referral') calculatedScore += 15;
    if (leadData.email.endsWith('.com') || leadData.email.endsWith('.org')) calculatedScore += 10;

    const newLead = {
      id: `lead-${Date.now().toString().slice(-4)}`,
      clientId: activeTenantId,
      createdDate: new Date().toISOString().split('T')[0],
      score: Math.min(100, calculatedScore),
      duplicateFlag: isDuplicate,
      status: 'Lead',
      ...leadData,
    };

    setLeads(prev => [newLead, ...prev]);
    logAudit('CREATE_LEAD', `Lead #${newLead.id}`, `Captured lead ${newLead.name} (${newLead.company}) - Score: ${newLead.score}.`);
    
    if (isDuplicate) {
      logAudit('DUPLICATE_LEAD_DETECTED', `Lead #${newLead.id}`, `Potential duplicate flagged for email ${newLead.email}.`, 'MEDIUM');
    }
  };

  const updateLeadStatus = (leadId, newStatus) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    logAudit('UPDATE_LEAD_STATUS', `Lead #${leadId}`, `Lead status updated to ${newStatus}.`);
  };

  // Deal Pipeline Operations
  const updateDealStage = (dealId, newStage) => {
    setDeals(prev => prev.map(d => {
      if (d.id === dealId) {
        let prob = d.probability;
        if (newStage === 'Lead') prob = 20;
        if (newStage === 'Qualified') prob = 40;
        if (newStage === 'Need Analysis') prob = 60;
        if (newStage === 'Proposal Sent') prob = 75;
        if (newStage === 'Negotiation') prob = 90;
        if (newStage === 'Won') prob = 100;
        if (newStage === 'Lost') prob = 0;
        return { ...d, stage: newStage, probability: prob };
      }
      return d;
    }));
    logAudit('PIPELINE_STAGE_UPDATE', `Deal #${dealId}`, `Moved deal stage to ${newStage}.`);
  };

  const createDeal = (dealData) => {
    const newDeal = {
      id: `deal-${Date.now().toString().slice(-4)}`,
      clientId: activeTenantId,
      stage: 'Qualified',
      probability: 40,
      ...dealData
    };
    setDeals(prev => [newDeal, ...prev]);
    logAudit('CREATE_DEAL', `Deal #${newDeal.id}`, `Created opportunity "${newDeal.title}" value $${newDeal.dealValue}.`);
  };

  // Product Catalog Operations
  const addProduct = (prodData) => {
    const newProd = {
      id: `prod-${Date.now().toString().slice(-4)}`,
      clientId: activeTenantId,
      ...prodData
    };
    setProducts(prev => [newProd, ...prev]);
    logAudit('CREATE_PRODUCT', `SKU ${newProd.sku}`, `Added product ${newProd.name} to catalog.`);
  };

  // Quotation & Calculation Engine
  const createQuote = (quotePayload) => {
    const quoteId = `QT-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newQuote = {
      id: quoteId,
      clientId: activeTenantId,
      createdDate: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      status: 'Pending Approval',
      approvedBy: null,
      ...quotePayload
    };
    setQuotes(prev => [newQuote, ...prev]);
    logAudit('CREATE_QUOTE', `Quote #${quoteId}`, `Generated quote for ${newQuote.customerName} ($${newQuote.grandTotal.toLocaleString()} total).`);
    return newQuote;
  };

  const approveQuote = (quoteId) => {
    setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, status: 'Accepted', approvedBy: activeRole.name } : q));
    logAudit('APPROVE_QUOTE', `Quote #${quoteId}`, `Quote discount and terms approved by ${activeRole.name}.`, 'MEDIUM');
  };

  // Convert Quote to Order
  const convertQuoteToOrder = (quoteId) => {
    const targetQuote = quotes.find(q => q.id === quoteId);
    if (!targetQuote) return;

    const newOrder = {
      id: `ORD-2026-${Math.floor(400 + Math.random() * 500)}`,
      quoteId: targetQuote.id,
      clientId: activeTenantId,
      customerName: targetQuote.customerName,
      orderDate: new Date().toISOString().split('T')[0],
      totalAmount: targetQuote.grandTotal,
      orderStatus: 'Processing',
      paymentStatus: 'Unpaid',
      deliveryStatus: 'Warehouse Queue',
      invoiceNumber: `INV-2026-${Math.floor(500 + Math.random() * 500)}`
    };

    setOrders(prev => [newOrder, ...prev]);
    setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, status: 'Converted to Order' } : q));
    logAudit('CONVERT_QUOTE_TO_ORDER', `Order #${newOrder.id}`, `Converted Quote ${quoteId} to active order & generated Invoice ${newOrder.invoiceNumber}.`, 'HIGH');
  };

  // Ticket Operations
  const createTicket = (ticketData) => {
    const newTicket = {
      id: `TCK-${Math.floor(9000 + Math.random() * 900)}`,
      clientId: activeTenantId,
      createdDate: new Date().toISOString(),
      status: 'Open',
      messages: [{ sender: ticketData.contactName || 'Customer', text: ticketData.subject, time: 'Just now' }],
      ...ticketData
    };
    setTickets(prev => [newTicket, ...prev]);
    logAudit('CREATE_TICKET', `Ticket #${newTicket.id}`, `Created support ticket for ${newTicket.customerName}.`);
  };

  // Task Operations
  const addTask = (taskData) => {
    const newTask = {
      id: `tsk-${Date.now().toString().slice(-4)}`,
      clientId: activeTenantId,
      status: 'Pending',
      ...taskData
    };
    setTasks(prev => [newTask, ...prev]);
    logAudit('CREATE_TASK', `Task #${newTask.id}`, `Assigned task: ${newTask.title}`);
  };

  const toggleTaskStatus = (taskId) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: t.status === 'Completed' ? 'Pending' : 'Completed' } : t));
  };

  // Integration Operations
  const toggleIntegration = (intId) => {
    setIntegrations(prev => prev.map(i => {
      if (i.id === intId) {
        const nextStatus = i.status === 'Connected' ? 'Disconnected' : 'Connected';
        logAudit('TOGGLE_INTEGRATION', i.name, `Integration status toggled to ${nextStatus}.`);
        return { ...i, status: nextStatus, lastSync: 'Just now' };
      }
      return i;
    }));
  };

  // Dynamic Role Permissions Operator
  const updateRolePermissions = (roleId, permission) => {
    setRoles(prev => prev.map(role => {
      if (role.id === roleId) {
        const hasPermission = role.permissions.includes(permission);
        const updatedPermissions = hasPermission
          ? role.permissions.filter(p => p !== permission)
          : [...role.permissions, permission];
        
        logAudit('UPDATE_ROLE_PERMISSIONS', `Role: ${role.name}`, `Toggled permission "${permission}" for role.`, 'HIGH');
        return { ...role, permissions: updatedPermissions };
      }
      return role;
    }));
  };

  // Dynamic Employee Profile Operator (Only Admins allowed)
  const updateEmployeeRoleAndDesignation = (empId, roleId, designation) => {
    const isAdmin = activeRole.permissions.includes('security_admin') || activeRoleId === 'role-admin';
    if (!isAdmin) {
      alert("Security Violation: Only ASTRA CRM Admins can alter employee roles or designations.");
      return;
    }

    setEmployees(prev => prev.map(emp => {
      if (emp.id === empId) {
        logAudit('UPDATE_EMPLOYEE_PROFILE', `Employee ID: ${empId}`, `Modified Designation to "${designation}" and Role to "${roleId}".`, 'HIGH');
        return { ...emp, roleId, designation };
      }
      return emp;
    }));
  };

  // Filtered dataset helpers by active tenant
  const tenantLeads = leads.filter(l => l.clientId === activeTenantId || activeTenantId === 'all');
  const tenantProducts = products.filter(p => p.clientId === activeTenantId || activeTenantId === 'all');
  const tenantDeals = deals.filter(d => d.clientId === activeTenantId || activeTenantId === 'all');
  const tenantQuotes = quotes.filter(q => q.clientId === activeTenantId || activeTenantId === 'all');
  const tenantOrders = orders.filter(o => o.clientId === activeTenantId || activeTenantId === 'all');
  const tenantTickets = tickets.filter(t => t.clientId === activeTenantId || activeTenantId === 'all');
  const tenantTasks = tasks.filter(t => t.clientId === activeTenantId || activeTenantId === 'all');
  const tenantCampaigns = campaigns.filter(c => c.clientId === activeTenantId || activeTenantId === 'all');
  const tenantDocuments = documents.filter(d => d.clientId === activeTenantId || activeTenantId === 'all');

  return (
    <CRMContext.Provider value={{
      theme, setTheme,
      isAuthenticated, currentUser, login, signup, logout,
      allClients, activeTenant, setActiveTenantId, onboardNewClient,
      roles, activeRole, setActiveRoleId, updateRolePermissions,
      employees, updateEmployeeRoleAndDesignation,
      securityConfig, setSecurityConfig,
      auditLogs, logAudit,
      leads: tenantLeads, addLead, updateLeadStatus,
      products: tenantProducts, addProduct,
      deals: tenantDeals, updateDealStage, createDeal,
      quotes: tenantQuotes, createQuote, approveQuote, convertQuoteToOrder,
      orders: tenantOrders,
      tickets: tenantTickets, createTicket,
      tasks: tenantTasks, addTask, toggleTaskStatus,
      campaigns: tenantCampaigns,
      documents: tenantDocuments,
      integrations, toggleIntegration,
      globalSearch, setGlobalSearch,
      notifications, setNotifications
    }}>
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => useContext(CRMContext);

