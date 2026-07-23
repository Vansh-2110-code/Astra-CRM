const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_FILE = path.join(__dirname, 'db.json');

// Initialize database with structure and mock data if it does not exist
async function initDb() {
  if (fs.existsSync(DB_FILE)) {
    return;
  }

  // Pre-hash mock employee passwords for security
  const defaultPasswordHash = bcrypt.hashSync('admin123', 10);

  const initialData = {
    tenants: [
      {
        id: "client-001",
        name: "Apex Global Tech",
        subdomain: "apex",
        logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
        industry: "Enterprise Software & Cloud Services",
        plan: "Enterprise",
        status: "Active",
        maxSeats: 50,
        currency: "USD ($)"
      },
      {
        id: "client-002",
        name: "Nexus Electronics & Retail",
        subdomain: "nexuselec",
        logo: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150&auto=format&fit=crop&q=80",
        industry: "Consumer Electronics & Hardware",
        plan: "Professional",
        status: "Active",
        maxSeats: 25,
        currency: "USD ($)"
      },
      {
        id: "client-003",
        name: "Vanguard Industrial Dynamics",
        subdomain: "vanguard",
        logo: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&auto=format&fit=crop&q=80",
        industry: "Industrial Machinery & Components",
        plan: "Starter",
        status: "Active",
        maxSeats: 10,
        currency: "EUR (€)"
      }
    ],
    employees: [
      {
        id: "EMP-001",
        clientId: "client-001",
        name: "Sarah Jenkins",
        email: "sarah.jenkins@apexglobal.io",
        designation: "VP of Sales Operations",
        roleId: "role-admin",
        passwordHash: defaultPasswordHash,
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
      },
      {
        id: "EMP-002",
        clientId: "client-001",
        name: "Marcus Vance",
        email: "marcus.vance@sales.apex.io",
        designation: "Enterprise Sales Director",
        roleId: "role-mgr",
        passwordHash: defaultPasswordHash,
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
      },
      {
        id: "EMP-003",
        clientId: "client-001",
        name: "Alex Rivera",
        email: "alex.rivera@sales.apex.io",
        designation: "Senior Account Executive",
        roleId: "role-exec",
        passwordHash: defaultPasswordHash,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
      }
    ],
    roles: [
      { id: "role-admin", name: "Super Admin / Org Admin", permissions: ["view_all", "edit_all", "delete_all", "approve_quotes", "export_data", "security_admin"] },
      { id: "role-mgr", name: "Sales Manager", permissions: ["view_all", "edit_all", "approve_quotes", "export_data"] },
      { id: "role-exec", name: "Sales Executive", permissions: ["view_leads", "edit_own_leads", "create_quotes"] }
    ],
    leads: [
      {
        id: "lead-01",
        clientId: "client-001",
        name: "Dr. Aris Thorne",
        company: "BioGenetics Lab Solutions",
        email: "a.thorne@biogenetics.org",
        status: "Lead",
        score: 94,
        potentialValue: 280000
      }
    ],
    deals: [
      {
        id: "deal-501",
        clientId: "client-001",
        title: "Acme Corp Cloud Infrastructure Overhaul",
        company: "Acme Corporation",
        dealValue: 150000,
        probability: 70,
        stage: "Proposal Sent",
        pipelineId: "pipe-enterprise"
      }
    ],
    quotes: [],
    orders: [],
    tickets: [],
    integrations: [],
    auditLogs: []
  };

  await fs.promises.writeFile(DB_FILE, JSON.stringify(initialData, null, 2), 'utf8');
}

async function readData() {
  await initDb();
  const data = await fs.promises.readFile(DB_FILE, 'utf8');
  return JSON.parse(data);
}

async function writeData(data) {
  await fs.promises.writeFile(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = {
  readData,
  writeData
};
