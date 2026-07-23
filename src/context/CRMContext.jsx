import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';

const CRMContext = createContext();

export const CRMProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [theme, setTheme] = useState('dark');

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!sessionStorage.getItem('astra_token');
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = sessionStorage.getItem('astra_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Active Tenant Context
  const [activeTenantId, setActiveTenantId] = useState(() => {
    return sessionStorage.getItem('crm_active_tenant') || 'client-001';
  });

  // Search & Global UI State
  const [globalSearch, setGlobalSearch] = useState('');
  const [notifications, setNotifications] = useState([
    { id: 'n1', title: 'New High Score Lead', message: 'Dr. Aris Thorne (Score: 94) requested server spec sheet.', time: '10m ago', unread: true },
    { id: 'n2', title: 'Quote Approved', message: 'Marcus Vance approved QT-2026-880 for Horizon Retail.', time: '1h ago', unread: true },
    { id: 'n3', title: 'Security Alert', message: 'IP Whitelist policy updated by Org Admin.', time: '2h ago', unread: false }
  ]);

  // Sync active tenant id to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('crm_active_tenant', activeTenantId);
  }, [activeTenantId]);

  // Apply HTML attribute for dark/light mode
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Fetch Tenants (Enterprise level feature / Admin dashboard list)
  const tenantsQuery = useQuery({
    queryKey: ['tenants'],
    queryFn: () => api.get('/tenants').then(res => res.data),
    enabled: isAuthenticated
  });

  const activeTenant = (tenantsQuery.data || []).find(c => c.id === activeTenantId) || {
    id: activeTenantId,
    name: "Loading...",
    logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
    plan: "Enterprise",
    seats: 1,
    maxSeats: 50
  };

  // Queries for Core Resources
  const leadsQuery = useQuery({
    queryKey: ['leads', activeTenantId],
    queryFn: () => api.get('/leads').then(res => res.data),
    enabled: isAuthenticated
  });

  const dealsQuery = useQuery({
    queryKey: ['deals', activeTenantId],
    queryFn: () => api.get('/deals').then(res => res.data),
    enabled: isAuthenticated
  });

  const quotesQuery = useQuery({
    queryKey: ['quotes', activeTenantId],
    queryFn: () => api.get('/quotes').then(res => res.data),
    enabled: isAuthenticated
  });

  const ordersQuery = useQuery({
    queryKey: ['orders', activeTenantId],
    queryFn: () => api.get('/orders').then(res => res.data),
    enabled: isAuthenticated && activeTenant?.plan !== 'Starter'
  });

  const ticketsQuery = useQuery({
    queryKey: ['tickets', activeTenantId],
    queryFn: () => api.get('/support').then(res => res.data),
    enabled: isAuthenticated && activeTenant?.plan !== 'Starter'
  });

  const integrationsQuery = useQuery({
    queryKey: ['integrations', activeTenantId],
    queryFn: () => api.get('/integrations').then(res => res.data),
    enabled: isAuthenticated && activeTenant?.plan !== 'Starter'
  });

  const employeesQuery = useQuery({
    queryKey: ['employees', activeTenantId],
    queryFn: () => api.get('/employees').then(res => res.data),
    enabled: isAuthenticated
  });

  const auditLogsQuery = useQuery({
    queryKey: ['auditLogs', activeTenantId],
    queryFn: () => api.get('/audit-logs').then(res => res.data),
    enabled: isAuthenticated && activeTenant?.plan === 'Enterprise'
  });

  // Stubs for offline features not implemented in API
  const [tasks, setTasks] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [roles, setRoles] = useState([
    { id: "role-admin", name: "Super Admin / Org Admin", permissions: ["view_all", "edit_all", "delete_all", "approve_quotes", "export_data", "security_admin"] },
    { id: "role-mgr", name: "Sales Manager", permissions: ["view_all", "edit_all", "approve_quotes", "export_data"] },
    { id: "role-exec", name: "Sales Executive", permissions: ["view_leads", "edit_own_leads", "create_quotes"] }
  ]);
  const activeRole = roles.find(r => r.id === (currentUser?.roleId || 'role-admin')) || roles[0];

  // AUTH ACTIONS
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      sessionStorage.setItem('astra_token', token);
      sessionStorage.setItem('astra_user', JSON.stringify(user));
      sessionStorage.setItem('crm_active_tenant', user.tenantId || 'client-001');

      setCurrentUser(user);
      setIsAuthenticated(true);
      setActiveTenantId(user.tenantId || 'client-001');

      // Clear query cache to fetch fresh tenant data
      queryClient.clear();
      
      return { success: true };
    } catch (error) {
      console.error('Login Error:', error);
      throw new Error(error.response?.data?.error || 'Invalid credentials or login failure.');
    }
  };

  const logout = () => {
    sessionStorage.removeItem('astra_token');
    sessionStorage.removeItem('astra_user');
    setIsAuthenticated(false);
    setCurrentUser(null);
    queryClient.clear();
  };

  const signup = async (userData) => {
    // Signup self-service helper triggers public endpoint simulation
    alert("Signup completed! Please sign in using your credentials.");
  };

  // MUTATIONS (Write Operations)
  const addLeadMutation = useMutation({
    mutationFn: (leadData) => api.post('/leads', leadData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leads', activeTenantId] })
  });

  const createDealMutation = useMutation({
    mutationFn: (dealData) => api.post('/deals', dealData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['deals', activeTenantId] })
  });

  const createQuoteMutation = useMutation({
    mutationFn: (quoteData) => api.post('/quotes', quoteData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['quotes', activeTenantId] })
  });

  const createOrderMutation = useMutation({
    mutationFn: (orderData) => api.post('/orders', orderData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders', activeTenantId] })
  });

  const createTicketMutation = useMutation({
    mutationFn: (ticketData) => api.post('/support', ticketData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tickets', activeTenantId] })
  });

  const toggleIntegrationMutation = useMutation({
    mutationFn: (intData) => api.post('/integrations', intData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['integrations', activeTenantId] })
  });

  const onboardNewClientMutation = useMutation({
    mutationFn: (clientData) => api.post('/tenants', clientData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tenants'] })
  });

  const createEmployeeMutation = useMutation({
    mutationFn: (employeeData) => api.post('/employees', employeeData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['employees', activeTenantId] })
  });

  const updateEmployeeMutation = useMutation({
    mutationFn: ({ id, updateData }) => api.put(`/employees/${id}`, updateData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['employees', activeTenantId] })
  });

  const updateRolePermissionsMutation = useMutation({
    mutationFn: ({ id, permissions, requesterRole }) => api.put(`/roles/${id}`, { permissions, requesterRole }),
    onSuccess: () => {
      // Stub update locally
      alert("Role permissions updated successfully!");
    }
  });

  const upgradeTenantMutation = useMutation({
    mutationFn: ({ id, plan }) => api.put(`/tenants/${id}/upgrade`, { plan }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tenants'] })
  });

  return (
    <CRMContext.Provider value={{
      theme, setTheme,
      isAuthenticated, currentUser, login, signup, logout,
      allClients: tenantsQuery.data || [], activeTenant, setActiveTenantId, onboardNewClient: onboardNewClientMutation.mutateAsync, upgradeTenantPlan: upgradeTenantMutation.mutateAsync,
      roles, activeRole, setActiveRoleId: () => {}, updateRolePermissions: (roleId, permission) => {},
      employees: employeesQuery.data || [], createEmployee: createEmployeeMutation.mutateAsync, updateEmployeeRoleAndDesignation: (id, roleId, designation) => updateEmployeeMutation.mutateAsync({ id, updateData: { roleId, designation, requesterRole: currentUser?.role } }),
      securityConfig: { twoFactorRequired: true, sessionTimeoutMinutes: 30 }, setSecurityConfig: () => {},
      auditLogs: auditLogsQuery.data || [], logAudit: () => {},
      leads: leadsQuery.data || [], addLead: addLeadMutation.mutateAsync, updateLeadStatus: () => {},
      products: [
        { id: 'p1', clientId: 'client-001', name: 'Astra CRM Enterprise Edition', sku: 'ASTRA-ENT-001', category: 'Software Licences', unitPrice: 799, taxRatePercent: 18, stockCount: 9999, description: 'SaaS Enterprise license with full support and modules.' },
        { id: 'p2', clientId: 'client-001', name: 'Dedicated Support Package 24/7', sku: 'ASTRA-SUPP-SLA', category: 'Professional Services', unitPrice: 299, taxRatePercent: 18, stockCount: 9999, description: '24/7 technical hotline access and dedicated response times.' }
      ], addProduct: () => {},
      deals: dealsQuery.data || [], updateDealStage: () => {}, createDeal: createDealMutation.mutateAsync,
      quotes: quotesQuery.data || [], createQuote: createQuoteMutation.mutateAsync, approveQuote: () => {}, convertQuoteToOrder: (quoteId) => {
        const quoteObj = (quotesQuery.data || []).find(q => q.id === quoteId);
        if (quoteObj) {
          createOrderMutation.mutateAsync({
            customerName: quoteObj.customerName,
            totalValue: quoteObj.grandTotal,
            quoteId: quoteObj.id,
            status: 'Processing'
          });
        }
      },
      orders: ordersQuery.data || [],
      tickets: ticketsQuery.data || [], createTicket: createTicketMutation.mutateAsync,
      tasks, addTask: (taskData) => setTasks(prev => [...prev, { id: `tsk-${Date.now()}`, ...taskData }]), toggleTaskStatus: (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'Completed' ? 'Pending' : 'Completed' } : t)),
      campaigns,
      documents,
      integrations: integrationsQuery.data || [], toggleIntegration: (name, enabled) => toggleIntegrationMutation.mutateAsync({ name, enabled }),
      globalSearch, setGlobalSearch,
      notifications, setNotifications
    }}>
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => useContext(CRMContext);
