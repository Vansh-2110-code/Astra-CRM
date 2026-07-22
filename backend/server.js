const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { readData, writeData } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable Helmet to secure Express headers (XSS protection, referrer policy, framing guards)
app.use(helmet());

// Configure strict CORS origin limits
const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by Security CORS Policy'));
    }
  },
  credentials: true
}));

app.use(express.json());

// API Request Rate Limiter (Prevent DDoS / Brute Force attacks)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 150, // Limit each IP to 150 requests per window
  message: { error: "Too many requests. Cyber-Security block triggered. Please retry in 15 minutes." }
});
app.use('/api/', apiLimiter);

// Auth login-specific rate limiter (Prevent credential stuffing)
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes window
  max: 10, // Limit each IP to 10 login requests per window
  message: { error: "Too many login attempts. Gateway locked. Try again in 5 minutes." }
});
app.use('/api/auth/login', loginLimiter);

// 🛡️ Middleware: Token Authentication & Tenant Injection
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Access Denied: Missing Authentication Bearer Token" });
  }

  if (token !== 'mock-jwt-token-xyz') {
    return res.status(403).json({ error: "Access Forbidden: Invalid Cryptographic Token Signature" });
  }

  // Inject user details in request context
  req.userEmail = "admin@astracrm.io";
  next();
}

// Global API Route Protection Guard
app.use((req, res, next) => {
  if (req.path === '/api/auth/login') {
    return next();
  }
  if (req.path.startsWith('/api/')) {
    return authenticateToken(req, res, next);
  }
  next();
});


// Helper: Log Security Audit Action

function logAudit(data, tenantId, userEmail, roleName, action, resource, details, severity = 'INFO') {
  const newLog = {
    id: `log-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toISOString(),
    userEmail,
    roleName,
    action,
    resource,
    ipAddress: '192.168.1.99',
    severity,
    details,
    clientId: tenantId
  };
  data.auditLogs.push(newLog);
}

// 🔐 Authentication Endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const dbData = readData();
  
  const matchedEmployee = dbData.employees.find(emp => emp.email.toLowerCase() === email.toLowerCase());
  
  if (!matchedEmployee) {
    return res.status(401).json({ error: "Invalid credentials or employee profile not found." });
  }

  const role = dbData.roles.find(r => r.id === matchedEmployee.roleId) || dbData.roles[0];
  
  logAudit(dbData, "client-001", matchedEmployee.email, role.name, "USER_LOGIN", "Auth Gateway", `Employee ${matchedEmployee.name} logged in successfully.`, "INFO");
  writeData(dbData);

  res.json({
    user: {
      id: matchedEmployee.id,
      name: matchedEmployee.name,
      email: matchedEmployee.email,
      designation: matchedEmployee.designation,
      avatar: matchedEmployee.avatar,
      role: role.name,
      roleId: matchedEmployee.roleId,
      tenantId: "client-001" // Scoped for multi-tenant simulation
    },
    token: "mock-jwt-token-xyz"
  });
});

// 📁 Leads APIs
app.get('/api/leads', (req, res) => {
  const tenantId = req.query.tenantId || "client-001";
  const dbData = readData();
  const filtered = dbData.leads.filter(l => l.clientId === tenantId);
  res.json(filtered);
});

app.post('/api/leads', (req, res) => {
  const { name, company, email, status, score, potentialValue, tenantId } = req.body;
  const dbData = readData();

  const newLead = {
    id: `lead-${Date.now()}`,
    clientId: tenantId || "client-001",
    name,
    company,
    email,
    status: status || "Lead",
    score: score || 50,
    potentialValue: potentialValue || 0
  };

  dbData.leads.push(newLead);
  writeData(dbData);
  res.status(201).json(newLead);
});

// 💼 Deals / Pipeline APIs
app.get('/api/deals', (req, res) => {
  const tenantId = req.query.tenantId || "client-001";
  const dbData = readData();
  const filtered = dbData.deals.filter(d => d.clientId === tenantId);
  res.json(filtered);
});

app.post('/api/deals', (req, res) => {
  const { title, company, dealValue, stage, pipelineId, tenantId } = req.body;
  const dbData = readData();

  const newDeal = {
    id: `deal-${Date.now()}`,
    clientId: tenantId || "client-001",
    title,
    company,
    dealValue: parseFloat(dealValue) || 0,
    probability: stage === "Negotiation" ? 90 : 50,
    stage: stage || "Lead",
    pipelineId: pipelineId || "pipe-enterprise"
  };

  dbData.deals.push(newDeal);
  writeData(dbData);
  res.status(201).json(newDeal);
});

// 📄 Quotes APIs
app.get('/api/quotes', (req, res) => {
  const tenantId = req.query.tenantId || "client-001";
  const dbData = readData();
  const filtered = dbData.quotes.filter(q => q.clientId === tenantId);
  res.json(filtered);
});

app.post('/api/quotes', (req, res) => {
  const { customerName, contactPerson, contactEmail, subtotal, discountPercent, discountAmount, taxTotal, grandTotal, notes, customLogoUrl, currency, tenantId } = req.body;
  const dbData = readData();

  const newQuote = {
    id: `QT-2026-${Math.floor(100 + Math.random() * 900)}`,
    clientId: tenantId || "client-001",
    customerName,
    contactPerson,
    contactEmail,
    items: req.body.items || [],
    subtotal,
    discountPercent,
    discountAmount,
    taxTotal,
    grandTotal,
    notes,
    customLogoUrl,
    currency: currency || "USD ($)",
    status: "Draft",
    createdDate: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  };

  dbData.quotes.push(newQuote);
  writeData(dbData);
  res.status(201).json(newQuote);
});

// 👥 Employees Management (Admin Only check simulated)
app.get('/api/employees', (req, res) => {
  const dbData = readData();
  res.json(dbData.employees);
});

app.put('/api/employees/:id', (req, res) => {
  const { id } = req.params;
  const { designation, roleId, requesterRole } = req.body;
  const dbData = readData();

  // Enforce administrative lockdown check
  if (requesterRole !== "Super Admin / Org Admin") {
    return res.status(403).json({ error: "Access Denied: Only Admins can modify designations and roles." });
  }

  const empIndex = dbData.employees.findIndex(emp => emp.id === id);
  if (empIndex === -1) {
    return res.status(404).json({ error: "Employee profile not found." });
  }

  dbData.employees[empIndex].designation = designation;
  dbData.employees[empIndex].roleId = roleId;

  logAudit(dbData, "client-001", "admin@astracrm.io", requesterRole, "UPDATE_EMPLOYEE_PROFILE", `Employee ID: ${id}`, `Changed designation to "${designation}" and role to "${roleId}".`, "HIGH");
  
  writeData(dbData);
  res.json(dbData.employees[empIndex]);
});

// 🛡️ Security RBAC Permissions Modifier
app.put('/api/roles/:id', (req, res) => {
  const { id } = req.params;
  const { permissions, requesterRole } = req.body;
  const dbData = readData();

  if (requesterRole !== "Super Admin / Org Admin") {
    return res.status(403).json({ error: "Access Denied: Only Security Administrators can update RBAC permissions." });
  }

  const roleIndex = dbData.roles.findIndex(r => r.id === id);
  if (roleIndex === -1) {
    return res.status(404).json({ error: "Role not found." });
  }

  dbData.roles[roleIndex].permissions = permissions;

  logAudit(dbData, "client-001", "admin@astracrm.io", requesterRole, "UPDATE_ROLE_PERMISSIONS", `Role ID: ${id}`, `Permissions modified to [${permissions.join(', ')}]`, "HIGH");

  writeData(dbData);
  res.json(dbData.roles[roleIndex]);
});

// 📝 Audit Logs API
app.get('/api/audit-logs', (req, res) => {
  const dbData = readData();
  res.json(dbData.auditLogs);
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Astra CRM Enterprise SaaS Backend running at http://localhost:${PORT}`);
});
