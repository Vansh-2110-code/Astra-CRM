const sequelize = require('./database');
const bcrypt = require('bcryptjs');
const { Tenant, Role, Employee, Lead, Deal, Quote, AuditLog, Order, Ticket, Integration } = require('../models');

async function seedDatabase() {
  try {
    // 1. Sync all schemas
    console.log('🔄 Syncing database tables...');
    try {
      await sequelize.sync({ alter: true });
    } catch (alterErr) {
      // alter:true can fail on SQLite with FK constraints — fall back to safe mode (create only)
      console.warn('⚠️  alter sync failed, using safe create-only sync:', alterErr.message);
      await sequelize.sync({ force: false });
    }
    console.log('✅ Database schema synced successfully.');

    const defaultPasswordHash = bcrypt.hashSync('admin123', 10);

    // 2. Check if Tenant exists
    const tenantCount = await Tenant.count();
    if (tenantCount === 0) {
      console.log('🌱 Seeding default tenants...');
      await Tenant.bulkCreate([
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
      ]);
    }

    // 3. Check if Roles exist
    const roleCount = await Role.count();
    if (roleCount === 0) {
      console.log('🌱 Seeding roles...');
      await Role.bulkCreate([
        { id: "role-admin", name: "Super Admin / Org Admin", permissions: ["super_admin", "view_all", "edit_all", "delete_all", "approve_quotes", "export_data", "security_admin", "manage_salary", "manage_employees", "manage_tickets", "manage_customers", "manage_leads"] },
        { id: "role-mgr", name: "Sales Manager", permissions: ["view_sales", "edit_sales", "view_leads", "view_contacts", "view_pipeline", "view_products", "view_quotes", "approve_quotes", "view_orders", "view_marketing", "view_documents", "view_reports", "export_data"] },
        { id: "role-exec", name: "Sales Executive", permissions: ["view_leads", "edit_own_leads", "view_contacts", "view_pipeline", "view_products", "create_quotes", "view_quotes", "log_activities"] },
        { id: "role-hr", name: "HR / HR Manager", permissions: ["view_hr", "manage_employees", "manage_salary", "manage_attendance", "view_documents", "export_data", "log_activities", "view_reports"] },
        { id: "role-ops", name: "Operations Head", permissions: ["view_ops", "manage_tickets", "manage_customers", "log_activities", "view_products", "view_contacts", "view_integrations", "view_reports"] },
        { id: "role-customer", name: "Customer / Portal User", permissions: ["view_tickets", "create_tickets", "view_quotes"] }
      ]);
    }

    // 4. Check if Employees exist
    const employeeCount = await Employee.count();
    if (employeeCount === 0 || employeeCount <= 3) {
      console.log('🌱 Seeding employees across all predefined client accounts...');
      await Employee.bulkCreate([
        // Tenant 1 (Apex Global Tech)
        { id: "EMP-001", clientId: "client-001", name: "Sarah Jenkins", email: "sarah.jenkins@apexglobal.io", designation: "VP of Sales Operations", roleId: "role-admin", passwordHash: defaultPasswordHash, avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80" },
        { id: "EMP-002", clientId: "client-001", name: "Marcus Vance", email: "marcus.vance@sales.apex.io", designation: "Enterprise Sales Director", roleId: "role-mgr", passwordHash: defaultPasswordHash, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" },
        { id: "EMP-003", clientId: "client-001", name: "Alex Rivera", email: "alex.rivera@sales.apex.io", designation: "Senior Account Executive", roleId: "role-exec", passwordHash: defaultPasswordHash, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" },

        // Tenant 2 (Nexus Electronics)
        { id: "EMP-004", clientId: "client-002", name: "David Sterling", email: "nexus.admin@nexuselec.com", designation: "Regional Ops Lead", roleId: "role-admin", passwordHash: defaultPasswordHash, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" },
        { id: "EMP-005", clientId: "client-002", name: "Jessica Wu", email: "retail.mgr@nexuselec.com", designation: "Retail Sales Lead", roleId: "role-mgr", passwordHash: defaultPasswordHash, avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80" },

        // Tenant 3 (Vanguard Industrial)
        { id: "EMP-006", clientId: "client-003", name: "Heinrich Muller", email: "vanguard.admin@vanguard.com", designation: "General Manager", roleId: "role-admin", passwordHash: defaultPasswordHash, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80" },
        { id: "EMP-007", clientId: "client-003", name: "Klaus Schmidt", email: "industrial.exec@vanguard.com", designation: "Industrial Machinery AE", roleId: "role-exec", passwordHash: defaultPasswordHash, avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80" }
      ], { ignoreDuplicates: true });
    }

    // 5. Seed Leads across all client accounts
    const leadCount = await Lead.count();
    if (leadCount <= 1) {
      console.log('🌱 Seeding rich leads for all client organizations...');
      await Lead.bulkCreate([
        // Client 1 (Apex Global Tech)
        { id: "lead-01", clientId: "client-001", name: "Dr. Aris Thorne", company: "BioGenetics Lab Solutions", email: "a.thorne@biogenetics.org", phone: "+1 (555) 234-5678", source: "Website Forms", assignedTo: "Alex Rivera", notes: "Requested cloud server architecture specs.", tags: ["Enterprise", "High Value"], status: "Lead", score: 94, potentialValue: 280000 },
        { id: "lead-02", clientId: "client-001", name: "Eleanor Vance", company: "Apex Global Partner Ops", email: "eleanor@apex.io", phone: "+1 (555) 876-5432", source: "Referral", assignedTo: "Marcus Vance", notes: "Inbound partner referral for software rollout.", tags: ["Partner", "Urgent"], status: "Qualified", score: 85, potentialValue: 150000 },
        { id: "lead-03", clientId: "client-001", name: "Michael Chang", company: "Horizon Retail Networks", email: "m.chang@horizon.com", phone: "+1 (555) 345-6789", source: "Social Media", assignedTo: "Sarah Jenkins", notes: "Interested in POS data integration.", tags: ["Retail", "Cloud"], status: "Need Analysis", score: 78, potentialValue: 95000 },

        // Client 2 (Nexus Electronics)
        { id: "lead-04", clientId: "client-002", name: "Samantha Reed", company: "OmniTech Electronics", email: "s.reed@omnitech.io", phone: "+1 (555) 901-2345", source: "Email Campaigns", assignedTo: "Jessica Wu", notes: "Bulk hardware supply requirement.", tags: ["Hardware", "Bulk Order"], status: "Proposal Sent", score: 90, potentialValue: 180000 },
        { id: "lead-05", clientId: "client-002", name: "David Miller", company: "Circuit Dynamics", email: "d.miller@circuitdyn.com", phone: "+1 (555) 432-1098", source: "Website Forms", assignedTo: "David Sterling", notes: "Component warranty management tools requested.", tags: ["Components"], status: "Qualified", score: 72, potentialValue: 65000 },

        // Client 3 (Vanguard Industrial)
        { id: "lead-06", clientId: "client-003", name: "Robert Garcia", company: "Heavy Machinery Group", email: "r.garcia@heavymach.com", phone: "+49 30 123456", source: "Manual Entry", assignedTo: "Klaus Schmidt", notes: "Industrial fleet telemetry software integration.", tags: ["Heavy Machinery", "Industrial"], status: "Negotiation", score: 88, potentialValue: 220000 },
        { id: "lead-07", clientId: "client-003", name: "Linda Taylor", company: "Precision Tools Inc", email: "l.taylor@precisiontools.de", phone: "+49 89 654321", source: "Referral", assignedTo: "Heinrich Muller", notes: "Supply line software tracking system.", tags: ["Tools", "Machinery"], status: "Lead", score: 68, potentialValue: 45000 }
      ], { ignoreDuplicates: true });
    }

    // 6. Seed Deals across all client accounts
    const dealCount = await Deal.count();
    if (dealCount === 0) {
      console.log('🌱 Seeding deals pipeline for all client organizations...');
      await Deal.bulkCreate([
        // Client 1
        { id: "deal-501", clientId: "client-001", title: "Acme Corp Cloud Overhaul", company: "Acme Corporation", dealValue: 150000, probability: 75, stage: "Proposal Sent", pipelineId: "pipe-enterprise" },
        { id: "deal-502", clientId: "client-001", title: "BioGenetics Lab CRM Rollout", company: "BioGenetics Lab Solutions", dealValue: 280000, probability: 90, stage: "Negotiation", pipelineId: "pipe-enterprise" },

        // Client 2
        { id: "deal-503", clientId: "client-002", title: "OmniTech Hardware Supply", company: "OmniTech Electronics", dealValue: 180000, probability: 100, stage: "Won", pipelineId: "pipe-enterprise" },
        { id: "deal-504", clientId: "client-002", title: "Circuit Dynamics POS Integration", company: "Circuit Dynamics", dealValue: 65000, probability: 60, stage: "Need Analysis", pipelineId: "pipe-enterprise" },

        // Client 3
        { id: "deal-505", clientId: "client-003", title: "Heavy Machinery Telemetry System", company: "Heavy Machinery Group", dealValue: 220000, probability: 75, stage: "Proposal Sent", pipelineId: "pipe-enterprise" }
      ], { ignoreDuplicates: true });
    }

    // 7. Seed Quotes across all client accounts
    const quoteCount = await Quote.count();
    if (quoteCount === 0) {
      console.log('🌱 Seeding quotation records...');
      await Quote.bulkCreate([
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
        },
        {
          id: "QT-2026-104",
          clientId: "client-002",
          customerName: "OmniTech Electronics",
          contactPerson: "Samantha Reed",
          contactEmail: "s.reed@omnitech.io",
          items: [{ productId: "p2", productName: "Hardware Component Supply Pack", quantity: 5, unitPrice: 35000, taxRate: 8, total: 189000 }],
          subtotal: 175000,
          discountPercent: 0,
          discountAmount: 0,
          taxTotal: 14000,
          grandTotal: 189000,
          notes: "Standard bulk shipping terms.",
          status: "Accepted",
          createdDate: "2026-07-10",
          validUntil: "2026-08-15"
        }
      ], { ignoreDuplicates: true });
    }

    // 8. Seed Orders across all client accounts
    const orderCount = await Order.count();
    if (orderCount === 0) {
      console.log('🌱 Seeding order records...');
      await Order.bulkCreate([
        { id: "ORD-2026-441", clientId: "client-001", customerName: "Acme Corporation", totalValue: 49137, status: "Processing", quoteId: "QT-2026-880", createdDate: "2026-07-05" },
        { id: "ORD-2026-552", clientId: "client-002", customerName: "OmniTech Electronics", totalValue: 189000, status: "Shipped", quoteId: "QT-2026-104", createdDate: "2026-07-12" }
      ], { ignoreDuplicates: true });
    }

    // 9. Seed Support Tickets across all client accounts
    const ticketCount = await Ticket.count();
    if (ticketCount === 0) {
      console.log('🌱 Seeding support tickets...');
      await Ticket.bulkCreate([
        {
          id: "TCK-9401",
          clientId: "client-001",
          title: "Database connectivity timeouts",
          description: "Noticing periodic latency during peak backup cycles.",
          priority: "High",
          customerName: "Dr. Aris Thorne",
          contactEmail: "a.thorne@biogenetics.org",
          productName: "Astra Cloud Database Sync",
          warrantyStatus: "Active Warranty",
          messages: [{ sender: "Dr. Aris Thorne", text: "Experiencing database latency during night sync.", time: "10:30 AM" }],
          status: "Open",
          createdDate: "2026-07-20"
        },
        {
          id: "TCK-8202",
          clientId: "client-002",
          title: "Barcode scanner sync delay",
          description: "Hardware scanner output takes 3 seconds to register.",
          priority: "Medium",
          customerName: "Samantha Reed",
          contactEmail: "s.reed@omnitech.io",
          productName: "OmniTech Scanner Driver",
          warrantyStatus: "Active Warranty",
          messages: [{ sender: "Samantha Reed", text: "Scanner delay on warehouse floor 2.", time: "02:15 PM" }],
          status: "Open",
          createdDate: "2026-07-21"
        }
      ], { ignoreDuplicates: true });
    }

    // 10. Seed Integrations across all client accounts
    const integrationCount = await Integration.count();
    if (integrationCount === 0) {
      console.log('🌱 Seeding integrations across client organizations...');
      await Integration.bulkCreate([
        { id: "int-101", clientId: "client-001", name: "Slack Notifications", enabled: true, config: { webhookUrl: "https://hooks.slack.com/services/test" } },
        { id: "int-102", clientId: "client-001", name: "Google Workspace Sync", enabled: true, config: { syncEmails: true } },
        { id: "int-103", clientId: "client-002", name: "WhatsApp Business API", enabled: true, config: { phoneNumber: "+15559012345" } },
        { id: "int-104", clientId: "client-003", name: "Zapier Automations", enabled: true, config: { apiKey: "zap_key_vanguard_2026" } }
      ], { ignoreDuplicates: true });
    }

    console.log('🎉 Full multi-tenant database seeding completed successfully.');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

module.exports = {
  seedDatabase
};
