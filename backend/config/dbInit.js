const sequelize = require('./database');
const bcrypt = require('bcryptjs');
const { Tenant, Role, Employee, Lead, Deal, Quote, AuditLog } = require('../models');

async function seedDatabase() {
  try {
    // 1. Sync all schemas
    console.log('🔄 Syncing database tables...');
    await sequelize.sync({ alter: true });
    console.log('✅ Database schema synced successfully.');

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
        { id: "role-admin", name: "Super Admin / Org Admin", permissions: ["view_all", "edit_all", "delete_all", "approve_quotes", "export_data", "security_admin"] },
        { id: "role-mgr", name: "Sales Manager", permissions: ["view_all", "edit_all", "approve_quotes", "export_data"] },
        { id: "role-exec", name: "Sales Executive", permissions: ["view_leads", "edit_own_leads", "create_quotes"] }
      ]);
    }

    // 4. Check if Employees exist
    const employeeCount = await Employee.count();
    if (employeeCount === 0) {
      console.log('🌱 Seeding employees...');
      const defaultPasswordHash = bcrypt.hashSync('admin123', 10);
      await Employee.bulkCreate([
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
      ]);
    }

    // 5. Check if Leads exist
    const leadCount = await Lead.count();
    if (leadCount === 0) {
      console.log('🌱 Seeding leads...');
      await Lead.bulkCreate([
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
      ]);
    }

    console.log('🎉 Seeding completed successfully.');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

module.exports = {
  seedDatabase
};
