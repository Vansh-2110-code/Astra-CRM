import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';

const CRMContext = createContext();

export const CRMProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [theme, setTheme] = useState('dark');

  // Local fallback states for mutations
  const [localLeads, setLocalLeads] = useState([]);
  const [localDeals, setLocalDeals] = useState([]);
  const [localQuotes, setLocalQuotes] = useState([]);
  const [localClients, setLocalClients] = useState([]);
  const [localProducts, setLocalProducts] = useState([]);

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
    return sessionStorage.getItem('crm_active_tenant') || null;
  });

  // Search & Global UI State
  const [globalSearch, setGlobalSearch] = useState('');
  const [notifications, setNotifications] = useState([]);

  // Sync active tenant id to sessionStorage
  useEffect(() => {
    if (activeTenantId) {
      sessionStorage.setItem('crm_active_tenant', activeTenantId);
    } else {
      sessionStorage.removeItem('crm_active_tenant');
    }
  }, [activeTenantId]);

  // Apply HTML attribute for dark/light mode
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Fetch Tenants (Enterprise level feature / Admin dashboard list)
  const tenantsQuery = useQuery({
    queryKey: ['tenants'],
    queryFn: () => api.get('/tenants').then(res => res.data),
    enabled: isAuthenticated,
    retry: false
  });

  const allClientsList = (tenantsQuery.data && tenantsQuery.data.length > 0) 
    ? [...tenantsQuery.data, ...localClients] 
    : localClients;

  const fallbackTenant = {
    id: currentUser?.tenantId || activeTenantId || 'client-primary',
    name: currentUser?.company || currentUser?.name || 'My Organization',
    subdomain: 'app',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    industry: 'Enterprise Operations',
    plan: 'Enterprise',
    status: 'Active',
    maxSeats: 50,
    seats: 1,
    currency: 'USD ($)'
  };

  const activeTenant = allClientsList.find(c => c.id === activeTenantId) || allClientsList[0] || fallbackTenant;

  // Queries for Core Resources
  const leadsQuery = useQuery({
    queryKey: ['leads', activeTenantId],
    queryFn: () => api.get('/leads').then(res => res.data),
    enabled: isAuthenticated,
    retry: false
  });

  const dealsQuery = useQuery({
    queryKey: ['deals', activeTenantId],
    queryFn: () => api.get('/deals').then(res => res.data),
    enabled: isAuthenticated,
    retry: false
  });

  const quotesQuery = useQuery({
    queryKey: ['quotes', activeTenantId],
    queryFn: () => api.get('/quotes').then(res => res.data),
    enabled: isAuthenticated,
    retry: false
  });

  const ordersQuery = useQuery({
    queryKey: ['orders', activeTenantId],
    queryFn: () => api.get('/orders').then(res => res.data),
    enabled: isAuthenticated && activeTenant?.plan !== 'Starter',
    retry: false
  });

  const ticketsQuery = useQuery({
    queryKey: ['tickets', activeTenantId],
    queryFn: () => api.get('/support').then(res => res.data),
    enabled: isAuthenticated && activeTenant?.plan !== 'Starter',
    retry: false
  });

  const integrationsQuery = useQuery({
    queryKey: ['integrations', activeTenantId],
    queryFn: () => api.get('/integrations').then(res => res.data),
    enabled: isAuthenticated && activeTenant?.plan !== 'Starter',
    retry: false
  });

  const employeesQuery = useQuery({
    queryKey: ['employees', activeTenantId],
    queryFn: () => api.get('/employees').then(res => res.data),
    enabled: isAuthenticated,
    retry: false
  });

  const auditLogsQuery = useQuery({
    queryKey: ['auditLogs', activeTenantId],
    queryFn: () => api.get('/audit-logs').then(res => res.data),
    enabled: isAuthenticated && activeTenant?.plan === 'Enterprise',
    retry: false
  });

  const productsQuery = useQuery({
    queryKey: ['products', activeTenantId],
    queryFn: () => api.get('/products').then(res => res.data),
    enabled: isAuthenticated,
    retry: false
  });

  const [securityConfig, setSecurityConfig] = useState({
    twoFactorRequired: true,
    sessionTimeoutMinutes: 30,
    ipWhitelisting: { enabled: false, allowedIPs: [] }
  });
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
      if (user.tenantId) {
        sessionStorage.setItem('crm_active_tenant', user.tenantId);
      }

      setCurrentUser(user);
      setIsAuthenticated(true);
      setActiveTenantId(user.tenantId || null);
      queryClient.clear();
      return { success: true };
    } catch (error) {
      console.error('Login error:', error.message);
      throw error;
    }
  };

  const logout = () => {
    sessionStorage.removeItem('astra_token');
    sessionStorage.removeItem('astra_user');
    sessionStorage.removeItem('crm_active_tenant');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setActiveTenantId(null);
    queryClient.clear();
  };

  const signup = async (userData) => {
    try {
      const response = await api.post('/auth/signup', userData);
      const { token, user } = response.data;

      sessionStorage.setItem('astra_token', token);
      sessionStorage.setItem('astra_user', JSON.stringify(user));
      if (user.tenantId) {
        sessionStorage.setItem('crm_active_tenant', user.tenantId);
      }

      setCurrentUser(user);
      setIsAuthenticated(true);
      setActiveTenantId(user.tenantId || null);
      queryClient.clear();
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || error.message || 'Signup failed';
      throw new Error(message);
    }
  };

  const createRazorpayOrder = async (amount, currency) => {
    const res = await api.post('/payments/razorpay/order', { amount, currency });
    return res.data;
  };

  const verifyRazorpayPayment = async (paymentDetails) => {
    const res = await api.post('/payments/razorpay/verify', paymentDetails);
    queryClient.invalidateQueries({ queryKey: ['tenants'] });
    return res.data;
  };

  const [localAttendance, setLocalAttendance] = useState([]);

  const batchMarkAttendance = async (date, records) => {
    try {
      await api.post('/attendance/batch', { date, records });
    } catch (err) {
      console.warn('Backend offline for attendance:', err.message);
    }
    setLocalAttendance(prev => {
      const filtered = prev.filter(r => r.date !== date);
      const newItems = records.map(rec => ({
        id: `ATT-${rec.employeeId}-${date}`,
        clientId: activeTenantId,
        employeeId: rec.employeeId,
        date,
        status: rec.status
      }));
      return [...newItems, ...filtered];
    });
  };

  // Resolved Resource Collections (Merging API Data & Local User Input)
  const resolvedLeads = (leadsQuery.data && leadsQuery.data.length > 0)
    ? leadsQuery.data
    : localLeads.filter(l => l.clientId === activeTenantId || activeTenantId === 'all');

  const resolvedDeals = (dealsQuery.data && dealsQuery.data.length > 0)
    ? dealsQuery.data
    : localDeals.filter(d => d.clientId === activeTenantId || activeTenantId === 'all');

  const resolvedQuotes = (quotesQuery.data && quotesQuery.data.length > 0)
    ? quotesQuery.data
    : localQuotes.filter(q => q.clientId === activeTenantId || activeTenantId === 'all');

  const resolvedOrders = (ordersQuery.data && ordersQuery.data.length > 0)
    ? ordersQuery.data
    : [];

  const resolvedTickets = (ticketsQuery.data && ticketsQuery.data.length > 0)
    ? ticketsQuery.data
    : [];

  const resolvedProducts = (productsQuery.data && productsQuery.data.length > 0)
    ? productsQuery.data
    : localProducts.filter(p => p.clientId === activeTenantId || activeTenantId === 'all');

  const resolvedIntegrations = (integrationsQuery.data && integrationsQuery.data.length > 0)
    ? integrationsQuery.data
    : [];

  const [localEmployees, setLocalEmployees] = useState([]);

  const createEmployeeMutation = useMutation({
    mutationFn: (empData) => api.post('/employees', empData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['employees', activeTenantId] }),
    onError: (err, newEmp) => {
      console.warn('API create employee failed, applying local state:', err);
      const newEntry = {
        id: `EMP-${Date.now()}`,
        clientId: activeTenantId,
        name: newEmp.name,
        email: newEmp.email,
        designation: newEmp.designation || 'Specialist',
        roleId: newEmp.roleId || 'role-exec'
      };
      setLocalEmployees(prev => [newEntry, ...prev]);
    }
  });

  const updateEmployeeMutation = useMutation({
    mutationFn: ({ id, designation, roleId }) => api.put(`/employees/${id}`, { designation, roleId, requesterRole: activeRole?.name }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['employees', activeTenantId] }),
    onError: (err, { id, designation, roleId }) => {
      console.warn('API update employee failed, updating locally:', err);
      setLocalEmployees(prev => prev.map(e => e.id === id ? { ...e, designation, roleId } : e));
    }
  });

  const resolvedEmployees = (employeesQuery.data && employeesQuery.data.length > 0)
    ? [...employeesQuery.data, ...localEmployees]
    : localEmployees.filter(e => e.clientId === activeTenantId || activeTenantId === 'all');

  const resolvedAuditLogs = (auditLogsQuery.data && auditLogsQuery.data.length > 0)
    ? auditLogsQuery.data
    : [];

  // MUTATIONS (Write Operations)
  const addLeadMutation = useMutation({
    mutationFn: (leadData) => api.post('/leads', leadData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leads', activeTenantId] }),
    onError: (err, newLead) => {
      setLocalLeads(prev => [{ id: `lead-${Date.now()}`, clientId: activeTenantId, ...newLead }, ...prev]);
    }
  });

  const createDealMutation = useMutation({
    mutationFn: (dealData) => api.post('/deals', dealData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['deals', activeTenantId] }),
    onError: (err, newDeal) => {
      setLocalDeals(prev => [{ id: `deal-${Date.now()}`, clientId: activeTenantId, stage: 'Qualified', probability: 40, ...newDeal }, ...prev]);
    }
  });

  const createQuoteMutation = useMutation({
    mutationFn: (quoteData) => api.post('/quotes', quoteData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['quotes', activeTenantId] }),
    onError: (err, newQuote) => {
      setLocalQuotes(prev => [{ id: `QT-${Date.now()}`, clientId: activeTenantId, status: 'Draft', createdDate: new Date().toISOString().split('T')[0], validUntil: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0], ...newQuote }, ...prev]);
    }
  });

  const onboardNewClientMutation = useMutation({
    mutationFn: (clientData) => api.post('/tenants', clientData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tenants'] }),
    onError: (err, newClient) => {
      setLocalClients(prev => [{ id: `client-${Date.now()}`, status: 'Active', seats: 1, ...newClient }, ...prev]);
    }
  });

  const upgradeTenantMutation = useMutation({
    mutationFn: ({ id, plan }) => api.put(`/tenants/${id}/upgrade`, { plan }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tenants'] }),
    onError: (err, { id, plan }) => {
      const target = allClientsList.find(c => c.id === id);
      if (target) {
        target.plan = plan;
        target.maxSeats = plan === 'Starter' ? 10 : plan === 'Professional' ? 25 : 50;
      }
    }
  });

  return (
    <CRMContext.Provider value={{
      theme, setTheme,
      isAuthenticated, currentUser, login, signup, logout,
      allClients: allClientsList, activeTenant, setActiveTenantId, onboardNewClient: onboardNewClientMutation.mutateAsync, upgradeTenantPlan: upgradeTenantMutation.mutateAsync,
      roles, activeRole, setActiveRoleId: () => {}, updateRolePermissions: (roleId, permission) => {},
      employees: resolvedEmployees, createEmployee: createEmployeeMutation.mutateAsync, updateEmployeeRoleAndDesignation: updateEmployeeMutation.mutateAsync,
      securityConfig, setSecurityConfig,
      auditLogs: resolvedAuditLogs, logAudit: (action, resource, details, severity = 'INFO') => {
        const newLog = {
          id: `log-${Date.now()}`,
          clientId: activeTenantId,
          userEmail: currentUser?.email || '',
          roleName: activeRole?.name || 'Org Admin',
          action,
          resource,
          ipAddress: '',
          severity,
          details,
          timestamp: new Date().toISOString()
        };
        queryClient.setQueryData(['auditLogs', activeTenantId], old => [newLog, ...(old || [])]);
      },
      leads: resolvedLeads, addLead: addLeadMutation.mutateAsync, updateLeadStatus: (id, status) => {
        const target = resolvedLeads.find(l => l.id === id);
        if (target) target.status = status;
      },
      products: resolvedProducts, addProduct: (pData) => setLocalProducts(prev => [{ id: `prod-${Date.now()}`, clientId: activeTenantId, ...pData }, ...prev]),
      deals: resolvedDeals, updateDealStage: (id, stage) => {
        const target = resolvedDeals.find(d => d.id === id);
        if (target) target.stage = stage;
      }, createDeal: createDealMutation.mutateAsync,
      quotes: resolvedQuotes, createQuote: createQuoteMutation.mutateAsync, approveQuote: (id) => {
        const target = resolvedQuotes.find(q => q.id === id);
        if (target) target.status = 'Accepted';
      }, convertQuoteToOrder: (quoteId) => {},
      orders: resolvedOrders,
      tickets: resolvedTickets, createTicket: (tData) => {},
      tasks, addTask: (tData) => setTasks(prev => [...prev, { id: `tsk-${Date.now()}`, ...tData }]), toggleTaskStatus: (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'Completed' ? 'Pending' : 'Completed' } : t)),
      campaigns,
      documents,
      integrations: resolvedIntegrations, toggleIntegration: () => {},
      globalSearch, setGlobalSearch,
      notifications, setNotifications,
      createRazorpayOrder, verifyRazorpayPayment,
      attendanceRecords: localAttendance, batchMarkAttendance, markAttendance: () => {}
    }}>
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => useContext(CRMContext);
