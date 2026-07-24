import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';

const CRMContext = createContext();

export const DEMO_ACCOUNTS = [
  {
    id: "EMP-001",
    email: "sarah.jenkins@apexglobal.io",
    name: "Sarah Jenkins",
    role: "Super Admin / Org Admin",
    roleId: "role-admin",
    designation: "VP of Sales Operations",
    tenantId: "client-001",
    company: "Apex Global Tech",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    badge: "Super Admin",
    color: "#6366f1",
    description: "Full platform control across all modules, tenant provisioning, security audit vault & executive telemetry."
  },
  {
    id: "EMP-002",
    email: "marcus.vance@sales.apex.io",
    name: "Marcus Vance",
    role: "Sales Manager",
    roleId: "role-mgr",
    designation: "Enterprise Sales Director",
    tenantId: "client-001",
    company: "Apex Global Tech",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    badge: "Sales Manager",
    color: "#a855f7",
    description: "Sales pipeline forecasting, quotation approvals, team quota tracking & revenue telemetry."
  },
  {
    id: "EMP-003",
    email: "alex.rivera@sales.apex.io",
    name: "Alex Rivera",
    role: "Sales Executive",
    roleId: "role-exec",
    designation: "Senior Account Executive",
    tenantId: "client-001",
    company: "Apex Global Tech",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    badge: "Sales Exec",
    color: "#38bdf8",
    description: "Lead qualification, product quote builder, deal stage execution & call follow-up tasks."
  },
  {
    id: "EMP-008",
    email: "elena.rostova@hr.apex.io",
    name: "Elena Rostova",
    role: "HR / HR Manager",
    roleId: "role-hr",
    designation: "Head of Human Resources",
    tenantId: "client-001",
    company: "Apex Global Tech",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&auto=format&fit=crop&q=80",
    badge: "HR Manager",
    color: "#ec4899",
    description: "Employee roster management, salary structure, attendance tracking & HR compliance."
  },
  {
    id: "EMP-009",
    email: "vikram.patel@ops.apex.io",
    name: "Vikram Patel",
    role: "Operations Head",
    roleId: "role-ops",
    designation: "Director of Operations & Support",
    tenantId: "client-001",
    company: "Apex Global Tech",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    badge: "Operations Head",
    color: "#f59e0b",
    description: "Order fulfillment, customer support tickets, warranty verification & API integrations."
  },
  {
    id: "EMP-010",
    email: "a.thorne@biogenetics.org",
    name: "Dr. Aris Thorne",
    role: "Customer / Portal User",
    roleId: "role-customer",
    designation: "CTO, BioGenetics Lab Solutions",
    tenantId: "client-001",
    company: "BioGenetics Lab Solutions",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
    badge: "Customer Portal",
    color: "#10b981",
    description: "Self-service customer portal, support ticket submission, quote viewing & SLA status."
  }
];

export const CRMProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [theme, setTheme] = useState('dark');

  // Local fallback states for mutations populated with pre-seeded data
  const [localLeads, setLocalLeads] = useState(() => {
    const saved = localStorage.getItem('astra_leads');
    return saved ? JSON.parse(saved) : [
      { id: "lead-01", clientId: "client-001", name: "Dr. Aris Thorne", company: "BioGenetics Lab Solutions", email: "a.thorne@biogenetics.org", phone: "+1 (555) 234-5678", source: "Website Forms", assignedTo: "Alex Rivera", notes: "Requested cloud server architecture specs.", tags: ["Enterprise", "High Value"], status: "Lead Intake", score: 94, potentialValue: 280000 },
      { id: "lead-02", clientId: "client-001", name: "Eleanor Vance", company: "Apex Global Partner Ops", email: "eleanor@apex.io", phone: "+1 (555) 876-5432", source: "Referral", assignedTo: "Marcus Vance", notes: "Inbound partner referral for software rollout.", tags: ["Partner", "Urgent"], status: "Qualified", score: 85, potentialValue: 150000 },
      { id: "lead-03", clientId: "client-001", name: "Michael Chang", company: "Horizon Retail Networks", email: "m.chang@horizon.com", phone: "+1 (555) 345-6789", source: "Social Media", assignedTo: "Sarah Jenkins", notes: "Interested in POS data integration.", tags: ["Retail", "Cloud"], status: "Need Analysis", score: 78, potentialValue: 95000 }
    ];
  });

  useEffect(() => {
    localStorage.setItem('astra_leads', JSON.stringify(localLeads));
  }, [localLeads]);

  const [localDeals, setLocalDeals] = useState(() => {
    const saved = localStorage.getItem('astra_deals');
    return saved ? JSON.parse(saved) : [
      { id: "deal-501", clientId: "client-001", title: "Acme Corp Cloud Overhaul", company: "Acme Corporation", dealValue: 150000, probability: 75, stage: "Proposal Sent", pipelineId: "pipe-enterprise", owner: "Marcus Vance", expectedCloseDate: "2026-08-30" },
      { id: "deal-502", clientId: "client-001", title: "BioGenetics Lab CRM Rollout", company: "BioGenetics Lab Solutions", dealValue: 280000, probability: 90, stage: "Negotiation", pipelineId: "pipe-enterprise", owner: "Sarah Jenkins", expectedCloseDate: "2026-09-15" }
    ];
  });

  useEffect(() => {
    localStorage.setItem('astra_deals', JSON.stringify(localDeals));
  }, [localDeals]);
  const [localQuotes, setLocalQuotes] = useState(() => {
    const saved = localStorage.getItem('astra_quotes');
    return saved ? JSON.parse(saved) : [
      {
        id: "QT-2026-880",
        clientId: "client-001",
        customerName: "Acme Corporation",
        contactPerson: "Jonathan Sterling",
        contactEmail: "j.sterling@acmecorp.com",
        items: [{ productId: "p1", productName: "Astra CRM Enterprise License", quantity: 2, unitPrice: 24500, taxRate: 8.5, total: 49137 }],
        subtotal: 49000,
        discountPercent: 8,
        discountAmount: 3920,
        taxTotal: 4057,
        grandTotal: 49137,
        notes: "Includes 24-month extended hardware warranty.",
        status: "Accepted",
        createdDate: "2026-07-01",
        validUntil: "2026-08-30"
      }
    ];
  });
  const [localSalarySlips, setLocalSalarySlips] = useState(() => {
    const saved = localStorage.getItem('astra_salary_slips');
    return saved ? JSON.parse(saved) : [];
  });
  const [localClients, setLocalClients] = useState(() => {
    const saved = localStorage.getItem('astra_clients');
    return saved ? JSON.parse(saved) : [];
  });
  const [localProducts, setLocalProducts] = useState(() => {
    const saved = localStorage.getItem('astra_products');
    return saved ? JSON.parse(saved) : [
      { id: "prod-001", clientId: "client-sanna", sku: "ASTRA-ENT-01", name: "Astra Enterprise CRM Suite", category: "SaaS Licenses", unitPrice: 24500, taxRatePercent: 18, stockCount: 150, variants: ["Annual License", "Lifetime Enterprise"], description: "Full omnichannel SaaS CRM suite with automated lead scoring and pipeline management." },
      { id: "prod-002", clientId: "client-sanna", sku: "AI-BOT-V2", name: "AI Sales Automation Assistant", category: "SaaS Licenses", unitPrice: 12500, taxRatePercent: 18, stockCount: 85, variants: ["Pro Tier", "Unlimited AI"], description: "Autonomous lead nurturing bot with real-time intent analysis." },
      { id: "prod-003", clientId: "client-sanna", sku: "HW-SERVER-4K", name: "OmniHub 4K Dedicated Server", category: "Hardware Servers", unitPrice: 48000, taxRatePercent: 18, stockCount: 24, variants: ["Rack Mount 1U", "Tower Chassis"], description: "Ultra-low latency edge server hardware pre-configured with Astra CRM gateway." }
    ];
  });

  useEffect(() => {
    localStorage.setItem('astra_products', JSON.stringify(localProducts));
  }, [localProducts]);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!sessionStorage.getItem('astra_token');
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = sessionStorage.getItem('astra_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Active Tenant Context (locked to logged-in user's company context)
  const [activeTenantIdState, setActiveTenantIdState] = useState(() => {
    const savedUser = sessionStorage.getItem('astra_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed?.tenantId) return parsed.tenantId;
      } catch (e) {}
    }
    return sessionStorage.getItem('crm_active_tenant') || null;
  });

  const setActiveTenantId = (id) => {
    if (currentUser?.tenantId && id !== currentUser.tenantId) {
      console.warn(`Tenant switching disallowed for logged in user. Locked to ${currentUser.tenantId}`);
      return;
    }
    setActiveTenantIdState(id);
  };

  const activeTenantId = currentUser?.tenantId || activeTenantIdState;

  // Search & Global UI State
  const [globalSearch, setGlobalSearch] = useState('');
  const [notifications, setNotifications] = useState([]);

  // Keep activeTenantId synchronized with currentUser's tenant
  useEffect(() => {
    if (currentUser?.tenantId && activeTenantIdState !== currentUser.tenantId) {
      setActiveTenantIdState(currentUser.tenantId);
    }
  }, [currentUser]);

  // Sync active tenant id to sessionStorage
  useEffect(() => {
    if (activeTenantId) {
      sessionStorage.setItem('crm_active_tenant', activeTenantId);
    } else {
      sessionStorage.removeItem('crm_active_tenant');
    }
  }, [activeTenantId]);

  // Sync state to localStorage for offline persistence
  useEffect(() => {
    localStorage.setItem('astra_quotes', JSON.stringify(localQuotes));
  }, [localQuotes]);

  useEffect(() => {
    localStorage.setItem('astra_salary_slips', JSON.stringify(localSalarySlips));
  }, [localSalarySlips]);

  useEffect(() => {
    localStorage.setItem('astra_clients', JSON.stringify(localClients));
  }, [localClients]);

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

  const activeTenant = allClientsList.find(c => c.id === activeTenantId) || fallbackTenant;

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

  const salarySlipsQuery = useQuery({
    queryKey: ['salarySlips', activeTenantId],
    queryFn: () => api.get('/salary').then(res => res.data),
    enabled: isAuthenticated,
    retry: false
  });

  const [securityConfig, setSecurityConfig] = useState({
    twoFactorRequired: true,
    sessionTimeoutMinutes: 30,
    ipWhitelisting: { enabled: false, allowedIPs: [] }
  });

  const [tasks, setTasks] = useState([
    { id: 'tsk-101', title: 'Schedule product demo with BioGenetics CTO', type: 'Call', dueDate: '2026-07-25', priority: 'High', assignedTo: 'Sarah Jenkins', relatedEntity: 'BioGenetics Lab Solutions', status: 'Pending' },
    { id: 'tsk-102', title: 'Follow up on OmniTech hardware quote', type: 'WhatsApp', dueDate: '2026-07-24', priority: 'Medium', assignedTo: 'Marcus Vance', relatedEntity: 'OmniTech Electronics', status: 'Completed' },
    { id: 'tsk-103', title: 'Send SLA contract proposal to Heavy Machinery', type: 'Meeting', dueDate: '2026-07-26', priority: 'High', assignedTo: 'Klaus Schmidt', relatedEntity: 'Heavy Machinery Group', status: 'Pending' }
  ]);

  const [campaigns, setCampaigns] = useState([
    {
      id: 'cmp-101',
      name: 'Q3 Enterprise Cloud Expansion',
      channel: 'Email Outreach',
      status: 'Active',
      targetAudience: 'VPs & CTOs of Tech Firms',
      openRatePercent: 42.5,
      clickRatePercent: 18.3,
      convertedLeads: 14,
      estimatedROI: '320%',
      startDate: '2026-07-01',
      sentCount: 1250
    },
    {
      id: 'cmp-102',
      name: 'Hardware Warranty Renewal Blitz',
      channel: 'WhatsApp Broadcast',
      status: 'Active',
      targetAudience: 'Existing B2B Hardware Clients',
      openRatePercent: 68.2,
      clickRatePercent: 31.4,
      convertedLeads: 22,
      estimatedROI: '480%',
      startDate: '2026-07-10',
      sentCount: 840
    }
  ]);

  const [documents, setDocuments] = useState([
    {
      id: 'doc-101',
      title: 'Master Enterprise SLA Agreement 2026.pdf',
      category: 'Contract',
      fileSize: '2.4 MB',
      uploadedBy: 'Sarah Jenkins',
      accessLevel: 'Enterprise Admin',
      tags: ['SLA', 'Legal', 'Contract']
    },
    {
      id: 'doc-102',
      title: 'Astra CRM Technical Specs & Security Architecture.pdf',
      category: 'Spec Manual',
      fileSize: '5.1 MB',
      uploadedBy: 'Marcus Vance',
      accessLevel: 'Public Sales',
      tags: ['Architecture', 'SOC2', 'Security']
    }
  ]);

  const [localIntegrations, setLocalIntegrations] = useState([
    {
      id: 'int-101',
      name: 'WhatsApp Business API',
      category: 'Messaging & Outreach',
      details: 'Automated lead notifications and interactive customer support messages via official WhatsApp Cloud API.',
      connectedAccount: '+1 (555) 019-2831',
      lastSync: '10 mins ago',
      status: 'Connected',
      icon: 'MessageSquare'
    },
    {
      id: 'int-102',
      name: 'Google Workspace & Gmail Sync',
      category: 'Email & Calendar',
      details: 'Bi-directional email log sync and automatic Google Calendar meeting scheduling.',
      connectedAccount: 'admin@apexcrm.io',
      lastSync: 'Just now',
      status: 'Connected',
      icon: 'Mail'
    },
    {
      id: 'int-103',
      name: 'Razorpay & Stripe Gateway',
      category: 'Payment Gateway',
      details: 'Process instant quote deposits, recurring SaaS subscriptions, and digital invoice payments.',
      connectedAccount: 'acct_10928371928',
      lastSync: '1 hour ago',
      status: 'Configured',
      icon: 'CreditCard'
    },
    {
      id: 'int-104',
      name: 'Meta Lead Ads API Engine',
      category: 'Social Lead Generation',
      details: 'Real-time Lead Ads intake from Facebook & Instagram ad campaigns via Meta Graph API (v19.0) Webhooks.',
      connectedAccount: 'Page ID: 10049281048',
      lastSync: 'Live Webhook Active',
      status: 'Connected',
      icon: 'PhoneCall'
    }
  ]);
  const [activeRoleId, setActiveRoleId] = useState(null);
  const [roles, setRoles] = useState([
    {
      id: "role-admin",
      name: "Super Admin / Org Admin",
      permissions: ["super_admin", "view_all", "edit_all", "delete_all", "approve_quotes", "export_data", "security_admin", "manage_salary", "manage_employees", "manage_tickets", "manage_customers", "manage_leads"]
    },
    {
      id: "role-mgr",
      name: "Sales Manager",
      permissions: ["view_sales", "edit_sales", "view_leads", "view_contacts", "view_pipeline", "view_products", "view_quotes", "approve_quotes", "view_orders", "view_marketing", "view_documents", "view_reports", "export_data"]
    },
    {
      id: "role-exec",
      name: "Sales Executive",
      permissions: ["view_leads", "edit_own_leads", "view_contacts", "view_pipeline", "view_products", "create_quotes", "view_quotes", "log_activities"]
    },
    {
      id: "role-hr",
      name: "HR / HR Manager",
      permissions: ["view_hr", "manage_employees", "manage_salary", "manage_attendance", "view_documents", "export_data", "log_activities", "view_reports"]
    },
    {
      id: "role-ops",
      name: "Operations Head",
      permissions: ["view_ops", "manage_tickets", "manage_customers", "log_activities", "view_products", "view_contacts", "view_integrations", "view_reports"]
    },
    {
      id: "role-customer",
      name: "Customer / Portal User",
      permissions: ["view_tickets", "create_tickets", "view_quotes"]
    }
  ]);

  const activeRole = roles.find(r => r.id === (activeRoleId || currentUser?.roleId)) || 
                     roles.find(r => r.name === currentUser?.role) || 
                     roles[0];

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
      console.warn('Backend login API error/offline, checking local DEMO_ACCOUNTS:', error.message);
      const matchedDemo = DEMO_ACCOUNTS.find(d => d.email.toLowerCase() === (email || '').toLowerCase());
      if (matchedDemo) {
        const demoUser = {
          id: matchedDemo.id,
          name: matchedDemo.name,
          email: matchedDemo.email,
          role: matchedDemo.role,
          roleId: matchedDemo.roleId,
          designation: matchedDemo.designation,
          tenantId: matchedDemo.tenantId,
          company: matchedDemo.company,
          avatar: matchedDemo.avatar
        };
        const mockToken = `demo_token_${matchedDemo.roleId}_${Date.now()}`;
        sessionStorage.setItem('astra_token', mockToken);
        sessionStorage.setItem('astra_user', JSON.stringify(demoUser));
        sessionStorage.setItem('crm_active_tenant', matchedDemo.tenantId);

        setCurrentUser(demoUser);
        setIsAuthenticated(true);
        setActiveTenantId(matchedDemo.tenantId);
        queryClient.clear();
        return { success: true, isDemo: true };
      }
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
      if (userData.signupType === 'join') {
        const searchName = (userData.company || userData.tenantId || '').trim();
        if (!searchName) {
          throw new Error('Please enter your Company Name or Organization ID to join.');
        }

        const existingClient = (localClients || []).find(c => 
          c.name.toLowerCase() === searchName.toLowerCase() ||
          c.id.toLowerCase() === searchName.toLowerCase() ||
          (c.subdomain && c.subdomain.toLowerCase() === searchName.toLowerCase())
        );

        let targetTenantId = existingClient ? existingClient.id : `client-${searchName.toLowerCase().replace(/[^a-z0-9]/g, '') || Date.now()}`;
        
        if (!existingClient) {
          const newCompanyObj = {
            id: targetTenantId,
            name: searchName,
            subdomain: searchName.toLowerCase().replace(/[^a-z0-9]/g, ''),
            logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
            industry: 'Enterprise Services',
            plan: 'Enterprise',
            status: 'Active',
            maxSeats: 50,
            currency: 'USD ($)'
          };
          setLocalClients(prev => [...prev, newCompanyObj]);
        }

        const newEmpUser = {
          id: `EMP-${Date.now().toString().slice(-4)}`,
          name: userData.name,
          email: userData.email,
          designation: 'Sales Representative',
          role: 'Sales Executive',
          roleId: 'role-exec',
          tenantId: targetTenantId,
          baseSalary: 55000,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
        };
        const mockToken = `token_join_${Date.now()}`;
        sessionStorage.setItem('astra_token', mockToken);
        sessionStorage.setItem('astra_user', JSON.stringify(newEmpUser));
        sessionStorage.setItem('crm_active_tenant', targetTenantId);

        setLocalEmployees(prev => [newEmpUser, ...prev]);
        setCurrentUser(newEmpUser);
        setIsAuthenticated(true);
        setActiveTenantId(targetTenantId);
        queryClient.clear();
        return { success: true, isDemo: true };
      }
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
  const tenantLocalLeads = (localLeads || []).filter(l => l.clientId === activeTenantId || activeTenantId === 'all');

  let resolvedLeads = [];
  if (Array.isArray(leadsQuery.data) && leadsQuery.data.length > 0) {
    const apiLeads = leadsQuery.data.map(l => {
      const localMatch = localLeads.find(ll => ll.id === l.id || (ll.email && ll.email === l.email));
      return localMatch ? { ...l, ...localMatch } : l;
    });
    const apiIds = new Set(apiLeads.map(l => l.id));
    const extraLocals = tenantLocalLeads.filter(ll => !apiIds.has(ll.id));
    resolvedLeads = [...apiLeads, ...extraLocals];
  } else {
    resolvedLeads = tenantLocalLeads;
  }

  const rawTenantDeals = Array.isArray(dealsQuery.data)
    ? dealsQuery.data
    : (localDeals || []).filter(d => d.clientId === activeTenantId || activeTenantId === 'all');

  // Convert active leads into Kanban pipeline deals if not already present
  const existingDealIds = new Set(rawTenantDeals.map(d => d.id));
  const leadDeals = resolvedLeads
    .filter(l => l.clientId === activeTenantId || activeTenantId === 'all')
    .filter(l => !existingDealIds.has(l.id) && !existingDealIds.has(`deal-${l.id}`))
    .map(l => ({
      id: `deal-${l.id}`,
      leadId: l.id,
      clientId: l.clientId,
      title: `${l.company || l.name} Opportunity`,
      company: l.company || l.name,
      contactName: l.name,
      dealValue: parseFloat(l.potentialValue || 50000),
      probability: l.status === 'Qualified' ? 40 : l.status === 'Won' ? 100 : 25,
      stage: (l.status === 'Lead' || !l.status) ? 'Lead Intake' : l.status,
      pipelineId: 'pipe-enterprise',
      owner: l.assignedTo || currentUser?.name || 'Sanna Admin',
      expectedCloseDate: l.expectedCloseDate || '2026-08-30'
    }));

  const resolvedDeals = [...rawTenantDeals, ...leadDeals];

  const resolvedQuotes = Array.isArray(quotesQuery.data)
    ? quotesQuery.data
    : (localQuotes || []).filter(q => q.clientId === activeTenantId || activeTenantId === 'all');

  const resolvedOrders = Array.isArray(ordersQuery.data)
    ? ordersQuery.data
    : [];

  const resolvedTickets = Array.isArray(ticketsQuery.data)
    ? ticketsQuery.data
    : [];

  const tenantLocalProducts = (localProducts || []).filter(p => p.clientId === activeTenantId || activeTenantId === 'all');

  let resolvedProducts = [];
  if (Array.isArray(productsQuery.data) && productsQuery.data.length > 0) {
    const apiProds = productsQuery.data.map(p => {
      const localMatch = localProducts.find(lp => lp.id === p.id || lp.sku === p.sku);
      return localMatch ? { ...p, ...localMatch } : p;
    });
    const apiIds = new Set(apiProds.map(p => p.id));
    const extraLocals = tenantLocalProducts.filter(lp => !apiIds.has(lp.id));
    resolvedProducts = [...apiProds, ...extraLocals];
  } else {
    resolvedProducts = tenantLocalProducts;
  }

  const resolvedIntegrations = Array.isArray(integrationsQuery.data) && integrationsQuery.data.length > 0
    ? integrationsQuery.data
    : localIntegrations;

  const [localEmployees, setLocalEmployees] = useState(() => {
    const saved = localStorage.getItem('astra_local_employees');
    return saved ? JSON.parse(saved) : [
      { id: "EMP-001", clientId: "client-001", name: "Sarah Jenkins", email: "sarah.jenkins@apexglobal.io", designation: "VP of Sales Operations", roleId: "role-admin", baseSalary: 95000, avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80" },
      { id: "EMP-002", clientId: "client-001", name: "Marcus Vance", email: "marcus.vance@sales.apex.io", designation: "Enterprise Sales Director", roleId: "role-mgr", baseSalary: 75000, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" },
      { id: "EMP-003", clientId: "client-001", name: "Alex Rivera", email: "alex.rivera@sales.apex.io", designation: "Senior Account Executive", roleId: "role-exec", baseSalary: 55000, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" },
      { id: "EMP-008", clientId: "client-001", name: "Elena Rostova", email: "elena.rostova@hr.apex.io", designation: "Head of Human Resources", roleId: "role-hr", baseSalary: 68000, avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&auto=format&fit=crop&q=80" },
      { id: "EMP-009", clientId: "client-001", name: "Vikram Patel", email: "vikram.patel@ops.apex.io", designation: "Director of Operations & Support", roleId: "role-ops", baseSalary: 72000, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" },
      { id: "EMP-010", clientId: "client-001", name: "Dr. Aris Thorne", email: "a.thorne@biogenetics.org", designation: "CTO, BioGenetics Lab Solutions", roleId: "role-customer", baseSalary: 85000, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80" },
      { id: "EMP-SANNA-001", clientId: "client-sanna", name: "Sanna Admin", email: "admin@sannainnovations.com", designation: "Organization Administrator", roleId: "role-admin", baseSalary: 80000, avatar: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&auto=format&fit=crop&q=80" }
    ];
  });

  useEffect(() => {
    localStorage.setItem('astra_local_employees', JSON.stringify(localEmployees));
  }, [localEmployees]);

  const createEmployeeMutation = useMutation({
    mutationFn: (empData) => api.post('/employees', empData),
    onSuccess: (resData, newEmp) => {
      queryClient.invalidateQueries({ queryKey: ['employees', activeTenantId] });
      const serverRes = resData?.data || resData || {};
      const newEntry = {
        id: serverRes.id || `EMP-${Date.now()}`,
        clientId: activeTenantId,
        name: serverRes.name || newEmp.name,
        email: serverRes.email || newEmp.email,
        designation: serverRes.designation || newEmp.designation || 'Specialist',
        roleId: serverRes.roleId || newEmp.roleId || 'role-exec',
        baseSalary: parseInt(serverRes.baseSalary || newEmp.baseSalary || newEmp.salary || 50000, 10),
        avatar: serverRes.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
      };
      setLocalEmployees(prev => [newEntry, ...prev.filter(e => e.id !== newEntry.id && e.email !== newEntry.email)]);
    },
    onError: (err, newEmp) => {
      console.warn('API create employee failed, applying local state:', err);
      const newEntry = {
        id: `EMP-${Date.now()}`,
        clientId: activeTenantId,
        name: newEmp.name,
        email: newEmp.email,
        designation: newEmp.designation || 'Specialist',
        roleId: newEmp.roleId || 'role-exec',
        baseSalary: parseInt(newEmp.baseSalary || newEmp.salary || 50000, 10),
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
      };
      setLocalEmployees(prev => [newEntry, ...prev.filter(e => e.email !== newEntry.email)]);
    }
  });

  const updateEmployeeMutation = useMutation({
    mutationFn: ({ id, designation, roleId, baseSalary, salary }) => 
      api.put(`/employees/${id}`, { designation, roleId, baseSalary: baseSalary || salary, requesterRole: activeRole?.name }),
    onSuccess: (resData, { id, designation, roleId, baseSalary, salary }) => {
      queryClient.invalidateQueries({ queryKey: ['employees', activeTenantId] });
      setLocalEmployees(prev => prev.map(e => {
        if (e.id === id) {
          const updated = { ...e };
          if (designation !== undefined) updated.designation = designation;
          if (roleId !== undefined) updated.roleId = roleId;
          if (baseSalary !== undefined || salary !== undefined) updated.baseSalary = parseInt(baseSalary || salary, 10);
          return updated;
        }
        return e;
      }));
    },
    onError: (err, { id, designation, roleId, baseSalary, salary }) => {
      console.warn('API update employee failed, updating locally:', err);
      setLocalEmployees(prev => prev.map(e => {
        if (e.id === id) {
          const updated = { ...e };
          if (designation !== undefined) updated.designation = designation;
          if (roleId !== undefined) updated.roleId = roleId;
          if (baseSalary !== undefined || salary !== undefined) updated.baseSalary = parseInt(baseSalary || salary, 10);
          return updated;
        }
        return e;
      }));
    }
  });

  const deleteEmployeeMutation = useMutation({
    mutationFn: (id) => api.delete(`/employees/${id}`),
    onSuccess: (resData, id) => {
      queryClient.invalidateQueries({ queryKey: ['employees', activeTenantId] });
      setLocalEmployees(prev => prev.filter(e => e.id !== id && e.email !== id));
    },
    onError: (err, id) => {
      console.warn('API delete employee failed, deleting locally:', err);
      setLocalEmployees(prev => prev.filter(e => e.id !== id && e.email !== id));
    }
  });

  const tenantLocalEmployees = (localEmployees || []).filter(e => e.clientId === activeTenantId || activeTenantId === 'all');

  let resolvedEmployees = [];
  if (Array.isArray(employeesQuery.data) && employeesQuery.data.length > 0) {
    const apiEmps = employeesQuery.data.map(e => {
      const localMatch = localEmployees.find(le => le.id === e.id || le.email === e.email);
      return { ...e, baseSalary: localMatch?.baseSalary || e.baseSalary || 50000 };
    });
    const apiIds = new Set(apiEmps.map(e => e.id));
    const apiEmails = new Set(apiEmps.map(e => e.email));
    const extraLocals = tenantLocalEmployees.filter(le => !apiIds.has(le.id) && !apiEmails.has(le.email));
    resolvedEmployees = [...apiEmps, ...extraLocals];
  } else {
    resolvedEmployees = tenantLocalEmployees;
  }

  const resolvedAuditLogs = Array.isArray(auditLogsQuery.data)
    ? auditLogsQuery.data
    : [];

  const resolvedSalarySlips = Array.isArray(salarySlipsQuery.data) && salarySlipsQuery.data.length > 0
    ? [...salarySlipsQuery.data, ...localSalarySlips]
    : localSalarySlips;

  // MUTATIONS (Write Operations)
  const addLeadMutation = useMutation({
    mutationFn: (leadData) => api.post('/leads', leadData),
    onSuccess: (resData, newLead) => {
      queryClient.invalidateQueries({ queryKey: ['leads', activeTenantId] });
      queryClient.invalidateQueries({ queryKey: ['deals', activeTenantId] });
      const leadId = resData?.id || `lead-${Date.now()}`;
      const leadEntry = { id: leadId, clientId: activeTenantId, status: 'Lead Intake', ...newLead };
      setLocalLeads(prev => [leadEntry, ...prev.filter(l => l.id !== leadId)]);

      // Auto-create matching deal for Sales Pipeline Kanban
      const dealEntry = {
        id: `deal-${leadId}`,
        leadId,
        clientId: activeTenantId,
        title: `${newLead.company || newLead.name} Opportunity`,
        company: newLead.company || newLead.name,
        contactName: newLead.name,
        dealValue: parseFloat(newLead.potentialValue || 50000),
        probability: 25,
        stage: 'Lead Intake',
        pipelineId: 'pipe-enterprise',
        owner: newLead.assignedTo || currentUser?.name || 'Sanna Admin',
        productsInterested: newLead.productNeeded ? [newLead.productNeeded] : [],
        expectedCloseDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
      };
      setLocalDeals(prev => [dealEntry, ...prev.filter(d => d.id !== dealEntry.id)]);
    },
    onError: (err, newLead) => {
      const leadId = `lead-${Date.now()}`;
      const leadEntry = { id: leadId, clientId: activeTenantId, status: 'Lead Intake', ...newLead };
      setLocalLeads(prev => [leadEntry, ...prev]);

      const dealEntry = {
        id: `deal-${leadId}`,
        leadId,
        clientId: activeTenantId,
        title: `${newLead.company || newLead.name} Opportunity`,
        company: newLead.company || newLead.name,
        contactName: newLead.name,
        dealValue: parseFloat(newLead.potentialValue || 50000),
        probability: 25,
        stage: 'Lead Intake',
        pipelineId: 'pipe-enterprise',
        owner: newLead.assignedTo || currentUser?.name || 'Sanna Admin',
        productsInterested: newLead.productNeeded ? [newLead.productNeeded] : [],
        expectedCloseDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
      };
      setLocalDeals(prev => [dealEntry, ...prev]);
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

  const generateSalarySlipMutation = useMutation({
    mutationFn: (slipData) => api.post('/salary/generate', slipData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['salarySlips', activeTenantId] }),
    onError: (err, newSlip) => {
      setLocalSalarySlips(prev => [newSlip, ...prev]);
    }
  });

  const markSalaryPaidMutation = useMutation({
    mutationFn: (id) => api.put(`/salary/${id}/pay`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['salarySlips', activeTenantId] }),
    onError: (err, id) => {
      setLocalSalarySlips(prev => prev.map(s => s.id === id ? { ...s, status: 'Paid', paidDate: new Date().toISOString().split('T')[0] } : s));
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

  const handleUpdateLeadStatus = async (id, status) => {
    setLocalLeads(prev => prev.map(l => (l.id === id || `lead-${l.id}` === id) ? { ...l, status } : l));
    setLocalDeals(prev => prev.map(d => (d.id === id || d.leadId === id || d.id === `deal-${id}`) ? { ...d, stage: status } : d));

    queryClient.setQueryData(['leads', activeTenantId], old => {
      if (!Array.isArray(old)) return old;
      return old.map(l => (l.id === id || `lead-${l.id}` === id) ? { ...l, status } : l);
    });

    queryClient.setQueryData(['deals', activeTenantId], old => {
      if (!Array.isArray(old)) return old;
      return old.map(d => (d.id === id || d.leadId === id || d.id === `deal-${id}`) ? { ...d, stage: status } : d);
    });

    try {
      await api.put(`/leads/${id}`, { status });
    } catch (err) {
      console.warn('API update lead status failed:', err.message);
    }
  };

  const handleUpdateDealStage = async (id, stage) => {
    setLocalDeals(prev => prev.map(d => (d.id === id || d.leadId === id || d.id === `deal-${id}`) ? { ...d, stage } : d));
    setLocalLeads(prev => prev.map(l => (l.id === id || `lead-${l.id}` === id || `deal-${l.id}` === id) ? { ...l, status: stage } : l));

    queryClient.setQueryData(['deals', activeTenantId], old => {
      if (!Array.isArray(old)) return old;
      return old.map(d => (d.id === id || d.leadId === id || d.id === `deal-${id}`) ? { ...d, stage } : d);
    });

    queryClient.setQueryData(['leads', activeTenantId], old => {
      if (!Array.isArray(old)) return old;
      return old.map(l => (l.id === id || `lead-${l.id}` === id || `deal-${l.id}` === id) ? { ...l, status: stage } : l);
    });

    try {
      await api.put(`/deals/${id}`, { stage });
    } catch (err) {
      console.warn('API update deal stage failed:', err.message);
    }
  };

  const handleDeleteLead = async (id) => {
    setLocalLeads(prev => prev.filter(l => l.id !== id && `lead-${l.id}` !== id && l.id !== `lead-${id}`));
    setLocalDeals(prev => prev.filter(d => d.id !== id && d.leadId !== id && d.id !== `deal-${id}` && `deal-${d.leadId}` !== id));

    queryClient.setQueryData(['leads', activeTenantId], old => {
      if (!Array.isArray(old)) return old;
      return old.filter(l => l.id !== id && `lead-${l.id}` !== id && l.id !== `lead-${id}`);
    });

    queryClient.setQueryData(['deals', activeTenantId], old => {
      if (!Array.isArray(old)) return old;
      return old.filter(d => d.id !== id && d.leadId !== id && d.id !== `deal-${id}`);
    });

    try {
      await api.delete(`/leads/${id}`);
    } catch (err) {
      console.warn('API delete lead offline:', err.message);
    }
  };

  const handleUpdateLeadNotes = async (id, notes) => {
    setLocalLeads(prev => prev.map(l => (l.id === id || `lead-${l.id}` === id) ? { ...l, notes } : l));

    queryClient.setQueryData(['leads', activeTenantId], old => {
      if (!Array.isArray(old)) return old;
      return old.map(l => (l.id === id || `lead-${l.id}` === id) ? { ...l, notes } : l);
    });

    try {
      await api.put(`/leads/${id}`, { notes });
    } catch (err) {
      console.warn('API update lead notes offline:', err.message);
    }
  };

  const handleUpdateProduct = async (id, updateData) => {
    setLocalProducts(prev => prev.map(p => p.id === id ? { ...p, ...updateData } : p));
    queryClient.setQueryData(['products', activeTenantId], old => {
      if (!Array.isArray(old)) return old;
      return old.map(p => p.id === id ? { ...p, ...updateData } : p);
    });
  };

  const handleDeleteProduct = async (id) => {
    setLocalProducts(prev => prev.filter(p => p.id !== id));
    queryClient.setQueryData(['products', activeTenantId], old => {
      if (!Array.isArray(old)) return old;
      return old.filter(p => p.id !== id);
    });
  };

  return (
    <CRMContext.Provider value={{
      theme, setTheme,
      isAuthenticated, currentUser, login, signup, logout,
      allClients: allClientsList, activeTenant, setActiveTenantId, onboardNewClient: onboardNewClientMutation.mutateAsync, upgradeTenantPlan: upgradeTenantMutation.mutateAsync,
      roles, activeRole, setActiveRoleId, updateRolePermissions: (roleId, permission) => {},
      employees: resolvedEmployees, createEmployee: createEmployeeMutation.mutateAsync, updateEmployeeRoleAndDesignation: updateEmployeeMutation.mutateAsync, deleteEmployee: deleteEmployeeMutation.mutateAsync,
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
      leads: resolvedLeads, addLead: addLeadMutation.mutateAsync, updateLeadStatus: handleUpdateLeadStatus, deleteLead: handleDeleteLead, updateLeadNotes: handleUpdateLeadNotes,
      products: resolvedProducts, addProduct: (pData) => setLocalProducts(prev => [{ id: `prod-${Date.now()}`, clientId: activeTenantId, ...pData }, ...prev]), updateProduct: handleUpdateProduct, deleteProduct: handleDeleteProduct,
      deals: resolvedDeals, updateDealStage: handleUpdateDealStage, createDeal: createDealMutation.mutateAsync,
      quotes: resolvedQuotes, createQuote: createQuoteMutation.mutateAsync, approveQuote: (id) => {
        const target = resolvedQuotes.find(q => q.id === id);
        if (target) target.status = 'Accepted';
      }, convertQuoteToOrder: (quoteId) => {},
      orders: resolvedOrders,
      tickets: resolvedTickets, createTicket: (tData) => {},
      tasks, addTask: (tData) => setTasks(prev => [{ id: `tsk-${Date.now()}`, status: 'Pending', ...tData }, ...prev]), toggleTaskStatus: (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'Completed' ? 'Pending' : 'Completed' } : t)),
      campaigns, addCampaign: (cData) => setCampaigns(prev => [{ id: `cmp-${Date.now()}`, openRatePercent: 45.0, clickRatePercent: 20.0, convertedLeads: 5, estimatedROI: '250%', startDate: new Date().toISOString().split('T')[0], sentCount: 500, status: 'Active', ...cData }, ...prev]),
      documents, addDocument: (dData) => setDocuments(prev => [{ id: `doc-${Date.now()}`, ...dData }, ...prev]),
      integrations: resolvedIntegrations,
      addIntegration: (iData) => setLocalIntegrations(prev => [{ id: `int-${Date.now()}`, status: 'Connected', lastSync: 'Just now', icon: 'Boxes', ...iData }, ...prev]),
      toggleIntegration: (id) => setLocalIntegrations(prev => prev.map(i => i.id === id ? { ...i, status: i.status === 'Connected' ? 'Disconnected' : 'Connected' } : i)),
      globalSearch, setGlobalSearch,
      notifications, setNotifications,
      createRazorpayOrder, verifyRazorpayPayment,
      attendanceRecords: localAttendance, batchMarkAttendance, markAttendance: () => {},
      salarySlips: resolvedSalarySlips,
      generateSalarySlip: generateSalarySlipMutation.mutateAsync,
      markSalaryPaid: markSalaryPaidMutation.mutateAsync
    }}>
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => useContext(CRMContext);
