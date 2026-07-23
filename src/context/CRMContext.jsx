import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';

const CRMContext = createContext();

// Rich default datasets for offline demo & smooth display
const DEFAULT_CLIENTS = [
  { id: "client-001", name: "Apex Global Tech", subdomain: "apex", logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80", industry: "Enterprise Software & Cloud Services", plan: "Enterprise", status: "Active", maxSeats: 50, seats: 3, currency: "USD ($)", tenantAdmin: "sarah.jenkins@apexglobal.io", complianceFlags: ["GDPR", "SOC2 Type II"] },
  { id: "client-002", name: "Nexus Electronics & Retail", subdomain: "nexuselec", logo: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150&auto=format&fit=crop&q=80", industry: "Consumer Electronics & Hardware", plan: "Professional", status: "Active", maxSeats: 25, seats: 2, currency: "USD ($)", tenantAdmin: "nexus.admin@nexuselec.com", complianceFlags: ["ISO27001", "HIPAA"] },
  { id: "client-003", name: "Vanguard Industrial Dynamics", subdomain: "vanguard", logo: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&auto=format&fit=crop&q=80", industry: "Industrial Machinery & Components", plan: "Starter", status: "Active", maxSeats: 10, seats: 2, currency: "EUR (€)", tenantAdmin: "vanguard.admin@vanguard.com", complianceFlags: ["CE Marking"] }
];

const DEFAULT_LEADS = [
  { id: "lead-01", clientId: "client-001", name: "Dr. Aris Thorne", company: "BioGenetics Lab Solutions", email: "a.thorne@biogenetics.org", phone: "+1 (555) 234-5678", source: "Website Forms", assignedTo: "Alex Rivera", notes: "Requested cloud server architecture specs.", tags: ["Enterprise", "High Value"], status: "Lead", score: 94, potentialValue: 280000 },
  { id: "lead-02", clientId: "client-001", name: "Eleanor Vance", company: "Apex Global Partner Ops", email: "eleanor@apex.io", phone: "+1 (555) 876-5432", source: "Referral", assignedTo: "Marcus Vance", notes: "Inbound partner referral for software rollout.", tags: ["Partner", "Urgent"], status: "Qualified", score: 85, potentialValue: 150000 },
  { id: "lead-03", clientId: "client-001", name: "Michael Chang", company: "Horizon Retail Networks", email: "m.chang@horizon.com", phone: "+1 (555) 345-6789", source: "Social Media", assignedTo: "Sarah Jenkins", notes: "Interested in POS data integration.", tags: ["Retail", "Cloud"], status: "Need Analysis", score: 78, potentialValue: 95000 },
  { id: "lead-04", clientId: "client-002", name: "Samantha Reed", company: "OmniTech Electronics", email: "s.reed@omnitech.io", phone: "+1 (555) 901-2345", source: "Email Campaigns", assignedTo: "Jessica Wu", notes: "Bulk hardware supply requirement.", tags: ["Hardware"], status: "Proposal Sent", score: 90, potentialValue: 180000 },
  { id: "lead-05", clientId: "client-003", name: "Robert Garcia", company: "Heavy Machinery Group", email: "r.garcia@heavymach.com", phone: "+49 30 123456", source: "Manual Entry", assignedTo: "Klaus Schmidt", notes: "Fleet telemetry software.", tags: ["Industrial"], status: "Negotiation", score: 88, potentialValue: 220000 }
];

const DEFAULT_DEALS = [
  { id: "deal-501", clientId: "client-001", title: "Acme Corp Cloud Infrastructure Overhaul", company: "Acme Corporation", dealValue: 150000, probability: 75, stage: "Proposal Sent", pipelineId: "pipe-enterprise" },
  { id: "deal-502", clientId: "client-001", title: "BioGenetics Lab CRM Rollout", company: "BioGenetics Lab Solutions", dealValue: 280000, probability: 90, stage: "Negotiation", pipelineId: "pipe-enterprise" },
  { id: "deal-503", clientId: "client-002", title: "OmniTech Component Supply Contract", company: "OmniTech Electronics", dealValue: 180000, probability: 100, stage: "Won", pipelineId: "pipe-enterprise" },
  { id: "deal-505", clientId: "client-003", title: "Heavy Machinery Fleet Telemetry System", company: "Heavy Machinery Group", dealValue: 220000, probability: 75, stage: "Proposal Sent", pipelineId: "pipe-enterprise" }
];

const DEFAULT_QUOTES = [
  { id: "QT-2026-880", clientId: "client-001", customerName: "Acme Corporation", contactPerson: "Jonathan Sterling", contactEmail: "j.sterling@acmecorp.com", items: [{ productId: "p1", productName: "Astra CRM Enterprise License", quantity: 2, unitPrice: 24500, taxRate: 8.5, total: 49137 }], subtotal: 49000, discountPercent: 8, discountAmount: 3920, taxTotal: 4057, grandTotal: 49137, notes: "Includes 24-month extended hardware warranty.", status: "Accepted", createdDate: "2026-07-01", validUntil: "2026-08-30" },
  { id: "QT-2026-104", clientId: "client-002", customerName: "OmniTech Electronics", contactPerson: "Samantha Reed", contactEmail: "s.reed@omnitech.io", items: [{ productId: "p2", productName: "Hardware Component Supply Pack", quantity: 5, unitPrice: 35000, taxRate: 8, total: 189000 }], subtotal: 175000, discountPercent: 0, discountAmount: 0, taxTotal: 14000, grandTotal: 189000, notes: "Standard bulk shipping terms.", status: "Accepted", createdDate: "2026-07-10", validUntil: "2026-08-15" }
];

const DEFAULT_ORDERS = [
  { id: "ORD-2026-441", clientId: "client-001", customerName: "Acme Corporation", totalValue: 49137, status: "Processing", quoteId: "QT-2026-880", createdDate: "2026-07-05" },
  { id: "ORD-2026-552", clientId: "client-002", customerName: "OmniTech Electronics", totalValue: 189000, status: "Shipped", quoteId: "QT-2026-104", createdDate: "2026-07-12" }
];

const DEFAULT_TICKETS = [
  { id: "TCK-9401", clientId: "client-001", title: "Database connectivity timeouts", description: "Periodic latency during peak backup cycles.", priority: "High", customerName: "Dr. Aris Thorne", contactEmail: "a.thorne@biogenetics.org", productName: "Astra Cloud Database Sync", warrantyStatus: "Active Warranty", messages: [{ sender: "Dr. Aris Thorne", text: "Experiencing database latency during night sync.", time: "10:30 AM" }], status: "Open", createdDate: "2026-07-20" },
  { id: "TCK-8202", clientId: "client-002", title: "Barcode scanner sync delay", description: "Hardware scanner output takes 3 seconds to register.", priority: "Medium", customerName: "Samantha Reed", contactEmail: "s.reed@omnitech.io", productName: "OmniTech Scanner Driver", warrantyStatus: "Active Warranty", messages: [{ sender: "Samantha Reed", text: "Scanner delay on warehouse floor 2.", time: "02:15 PM" }], status: "Open", createdDate: "2026-07-21" }
];

const DEFAULT_EMPLOYEES = [
  { id: "EMP-001", clientId: "client-001", name: "Sarah Jenkins", email: "sarah.jenkins@apexglobal.io", designation: "VP of Sales Operations", roleId: "role-admin", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80" },
  { id: "EMP-002", clientId: "client-001", name: "Marcus Vance", email: "marcus.vance@sales.apex.io", designation: "Enterprise Sales Director", roleId: "role-mgr", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" },
  { id: "EMP-003", clientId: "client-001", name: "Alex Rivera", email: "alex.rivera@sales.apex.io", designation: "Senior Account Executive", roleId: "role-exec", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" },
  { id: "EMP-004", clientId: "client-002", name: "David Sterling", email: "nexus.admin@nexuselec.com", designation: "Regional Ops Lead", roleId: "role-admin", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" },
  { id: "EMP-005", clientId: "client-003", name: "Heinrich Muller", email: "vanguard.admin@vanguard.com", designation: "General Manager", roleId: "role-admin", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80" }
];

const DEFAULT_AUDIT_LOGS = [
  { id: "log-101", clientId: "client-001", userEmail: "sarah.jenkins@apexglobal.io", roleName: "Super Admin / Org Admin", action: "TENANT_SECURITY_UPDATE", resource: "Security Policy", ipAddress: "192.168.1.45", severity: "INFO", details: "Updated IP Whitelist enforcement policy." },
  { id: "log-102", clientId: "client-001", userEmail: "marcus.vance@sales.apex.io", roleName: "Sales Manager", action: "APPROVE_QUOTE", resource: "Quote #QT-2026-880", ipAddress: "192.168.1.88", severity: "MEDIUM", details: "Approved discount rate of 8% for Acme Corp." }
];

export const CRMProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [theme, setTheme] = useState('dark');

  // Local fallback states for mutations
  const [localLeads, setLocalLeads] = useState([]);
  const [localDeals, setLocalDeals] = useState([]);
  const [localQuotes, setLocalQuotes] = useState([]);
  const [localClients, setLocalClients] = useState([]);

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
    enabled: isAuthenticated,
    retry: false
  });

  const allClientsList = (tenantsQuery.data && tenantsQuery.data.length > 0) 
    ? [...tenantsQuery.data, ...localClients] 
    : [...DEFAULT_CLIENTS, ...localClients];

  const activeTenant = allClientsList.find(c => c.id === activeTenantId) || allClientsList[0];

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

  const [securityConfig, setSecurityConfig] = useState({
    twoFactorRequired: true,
    sessionTimeoutMinutes: 30,
    ipWhitelisting: { enabled: true, allowedIPs: ['192.168.1.1/24', '10.0.0.1/16'] }
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
      sessionStorage.setItem('crm_active_tenant', user.tenantId || 'client-001');

      setCurrentUser(user);
      setIsAuthenticated(true);
      setActiveTenantId(user.tenantId || 'client-001');
      queryClient.clear();
      return { success: true };
    } catch (error) {
      console.warn('Backend API connection offline or error. Operating in offline demo mode:', error.message);
      
      const demoUsers = [
        { id: 'EMP-001', email: 'sarah.jenkins@apexglobal.io', name: 'Sarah Jenkins', designation: 'VP of Sales Operations', role: 'Super Admin / Org Admin', roleId: 'role-admin', tenantId: 'client-001', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80' },
        { id: 'EMP-002', email: 'marcus.vance@sales.apex.io', name: 'Marcus Vance', designation: 'Enterprise Sales Director', role: 'Sales Manager', roleId: 'role-mgr', tenantId: 'client-001', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' },
        { id: 'EMP-003', email: 'alex.rivera@sales.apex.io', name: 'Alex Rivera', designation: 'Senior Account Executive', role: 'Sales Executive', roleId: 'role-exec', tenantId: 'client-001', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
        { id: 'EMP-004', email: 'nexus.admin@nexuselec.com', name: 'David Sterling', designation: 'Regional Ops Lead', role: 'Super Admin / Org Admin', roleId: 'role-admin', tenantId: 'client-002', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
        { id: 'EMP-005', email: 'vanguard.admin@vanguard.com', name: 'Heinrich Muller', designation: 'General Manager', role: 'Super Admin / Org Admin', roleId: 'role-admin', tenantId: 'client-003', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80' },
        { id: 'CUST-901', email: 'customer@biogenetics.org', name: 'Dr. Aris Thorne', designation: 'Managing Director & Lab Head', role: 'Customer', roleId: 'role-customer', tenantId: 'client-001', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' }
      ];

      const matchedUser = demoUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) || {
        id: `EMP-${Date.now().toString().slice(-3)}`,
        email,
        name: email.split('@')[0].toUpperCase(),
        designation: 'Sales Representative',
        role: 'Super Admin / Org Admin',
        roleId: 'role-admin',
        tenantId: 'client-001',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
      };

      const fallbackToken = 'mock_jwt_token_demo_' + Date.now();
      sessionStorage.setItem('astra_token', fallbackToken);
      sessionStorage.setItem('astra_user', JSON.stringify(matchedUser));
      sessionStorage.setItem('crm_active_tenant', matchedUser.tenantId);

      setCurrentUser(matchedUser);
      setIsAuthenticated(true);
      setActiveTenantId(matchedUser.tenantId);
      return { success: true };
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
    alert("Signup completed! Please sign in using your credentials.");
  };

  const createRazorpayOrder = async (amount, currency) => {
    try {
      const res = await api.post('/payments/razorpay/order', { amount, currency });
      return res.data;
    } catch (err) {
      console.warn('Backend API connection offline for Razorpay order creation. Generating mock order token:', err.message);
      return {
        id: `order_rzp_mock_${Date.now()}`,
        entity: 'order',
        amount: Math.round(parseFloat(amount) * 100),
        currency: currency || 'INR',
        receipt: `rcpt_${Date.now()}`,
        status: 'created'
      };
    }
  };

  const verifyRazorpayPayment = async (paymentDetails) => {
    try {
      const res = await api.post('/payments/razorpay/verify', paymentDetails);
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      return res.data;
    } catch (err) {
      console.warn('Backend API connection offline for Razorpay verification. Applying local plan upgrade:', err.message);
      const { tenantId, plan } = paymentDetails;
      const target = allClientsList.find(c => c.id === tenantId);
      if (target) {
        target.plan = plan;
        target.maxSeats = plan === 'Starter' ? 10 : plan === 'Professional' ? 25 : 50;
      }
      return { success: true, message: 'Plan upgraded (Offline Mode)' };
    }
  };

  const [localAttendance, setLocalAttendance] = useState([
    { id: 'att-1', clientId: 'client-001', employeeId: 'EMP-001', date: new Date().toISOString().split('T')[0], status: 'Present' },
    { id: 'att-2', clientId: 'client-001', employeeId: 'EMP-002', date: new Date().toISOString().split('T')[0], status: 'Present' },
    { id: 'att-3', clientId: 'client-001', employeeId: 'EMP-003', date: new Date().toISOString().split('T')[0], status: 'Half-Day' }
  ]);

  const batchMarkAttendance = async (date, records) => {
    try {
      await api.post('/attendance/batch', { date, records });
    } catch (err) {
      console.warn('Backend offline for attendance. Updating local state:', err.message);
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

  // Resolved Resource Collections (Merging API Data & Fallbacks)
  const resolvedLeads = (leadsQuery.data && leadsQuery.data.length > 0)
    ? leadsQuery.data
    : [...DEFAULT_LEADS, ...localLeads].filter(l => l.clientId === activeTenantId || activeTenantId === 'all');

  const resolvedDeals = (dealsQuery.data && dealsQuery.data.length > 0)
    ? dealsQuery.data
    : [...DEFAULT_DEALS, ...localDeals].filter(d => d.clientId === activeTenantId || activeTenantId === 'all');

  const resolvedQuotes = (quotesQuery.data && quotesQuery.data.length > 0)
    ? quotesQuery.data
    : [...DEFAULT_QUOTES, ...localQuotes].filter(q => q.clientId === activeTenantId || activeTenantId === 'all');

  const resolvedOrders = (ordersQuery.data && ordersQuery.data.length > 0)
    ? ordersQuery.data
    : DEFAULT_ORDERS.filter(o => o.clientId === activeTenantId || activeTenantId === 'all');

  const resolvedTickets = (ticketsQuery.data && ticketsQuery.data.length > 0)
    ? ticketsQuery.data
    : DEFAULT_TICKETS.filter(t => t.clientId === activeTenantId || activeTenantId === 'all');

  const [localEmployees, setLocalEmployees] = useState([]);

  const createEmployeeMutation = useMutation({
    mutationFn: (empData) => api.post('/employees', empData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['employees', activeTenantId] }),
    onError: (err, newEmp) => {
      console.warn('API create employee failed, using local fallback:', err);
      const newEntry = {
        id: `EMP-${String(localEmployees.length + DEFAULT_EMPLOYEES.length + 1).padStart(3, '0')}`,
        clientId: activeTenantId,
        name: newEmp.name,
        email: newEmp.email,
        designation: newEmp.designation || 'Specialist',
        roleId: newEmp.roleId || 'role-exec',
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80`
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
    : [...DEFAULT_EMPLOYEES, ...localEmployees].filter(e => e.clientId === activeTenantId || activeTenantId === 'all');

  const resolvedAuditLogs = (auditLogsQuery.data && auditLogsQuery.data.length > 0)
    ? auditLogsQuery.data
    : DEFAULT_AUDIT_LOGS.filter(a => a.clientId === activeTenantId || activeTenantId === 'all');

  // MUTATIONS (Write Operations with local fallback)
  const addLeadMutation = useMutation({
    mutationFn: (leadData) => api.post('/leads', leadData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leads', activeTenantId] }),
    onError: (err, newLead) => {
      console.warn('API lead save failed, applying local fallback:', err);
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
      setLocalQuotes(prev => [{ id: `QT-2026-${Math.floor(100 + Math.random() * 900)}`, clientId: activeTenantId, status: 'Draft', createdDate: new Date().toISOString().split('T')[0], validUntil: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0], ...newQuote }, ...prev]);
    }
  });

  const onboardNewClientMutation = useMutation({
    mutationFn: (clientData) => api.post('/tenants', clientData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tenants'] }),
    onError: (err, newClient) => {
      setLocalClients(prev => [{ id: `client-00${allClientsList.length + 1}`, status: 'Active', seats: 1, ...newClient }, ...prev]);
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
          userEmail: currentUser?.email || 'admin@astracrm.io',
          roleName: activeRole?.name || 'Super Admin / Org Admin',
          action,
          resource,
          ipAddress: '192.168.1.45',
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
      products: [
        { id: 'p1', clientId: 'client-001', name: 'Astra CRM Enterprise Edition', sku: 'ASTRA-ENT-001', category: 'Software Licences', unitPrice: 799, taxRatePercent: 18, stockCount: 9999, variants: ['Cloud Hosted', 'On-Premise', 'Hybrid'], description: 'SaaS Enterprise license with full support and modules.' },
        { id: 'p2', clientId: 'client-001', name: 'Dedicated Support Package 24/7', sku: 'ASTRA-SUPP-SLA', category: 'Professional Services', unitPrice: 299, taxRatePercent: 18, stockCount: 9999, variants: ['Standard SLA', 'Premium SLA'], description: '24/7 technical hotline access and dedicated response times.' },
        { id: 'p3', clientId: 'client-001', name: 'Data Migration Toolkit', sku: 'ASTRA-DMT-003', category: 'Software Tools', unitPrice: 499, taxRatePercent: 18, stockCount: 500, variants: ['Basic', 'Advanced ETL'], description: 'Automated data migration and ETL pipeline toolkit for CRM onboarding.' },
        { id: 'p4', clientId: 'client-002', name: 'OmniTech Barcode Scanner Pro', sku: 'OMNI-BSP-200', category: 'Hardware Devices', unitPrice: 1200, taxRatePercent: 12, stockCount: 340, variants: ['Wireless', 'USB Wired'], description: 'Industrial-grade barcode scanner with 2D/QR code support.' }
      ], addProduct: () => {},
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
      integrations: [
        { id: 'int-101', clientId: 'client-001', name: 'Slack Notifications', enabled: true, status: 'Connected', lastSync: '10m ago' },
        { id: 'int-102', clientId: 'client-001', name: 'Google Workspace Sync', enabled: true, status: 'Connected', lastSync: '1h ago' }
      ], toggleIntegration: () => {},
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
