const TenantRepository = require('../repositories/TenantRepository');

class TenantService {
  async getTenants() {
    return TenantRepository.findAll();
  }

  async getTenantById(id) {
    return TenantRepository.findById(id);
  }

  async createTenant(tenantData) {
    const { name, subdomain, logo, industry, plan, maxSeats, currency } = tenantData;

    const count = await TenantRepository.count();
    const nextId = `client-${(count + 1).toString().padStart(3, '0')}`;

    const tenant = await TenantRepository.create({
      id: nextId,
      name,
      subdomain,
      logo: logo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
      industry: industry || "General Business",
      plan: plan || "Starter",
      status: "Active",
      maxSeats: maxSeats || 10,
      currency: currency || "USD ($)"
    });

    return tenant;
  }

  async upgradeTenant(id, plan) {
    const tenant = await TenantRepository.findOne({ where: { id } });
    if (!tenant) {
      throw new Error("Tenant not found.");
    }
    let maxSeats = 15;
    let normalizedPlan = 'Business Starter (15 Seats)';

    const planStr = (typeof plan === 'string' ? plan : plan?.plan || '').toLowerCase();
    if (planStr.includes('25') || planStr.includes('enterprise') || planStr.includes('pro')) {
      maxSeats = 25;
      normalizedPlan = 'Business Enterprise (25 Seats)';
    } else if (planStr.includes('15') || planStr.includes('starter')) {
      maxSeats = 15;
      normalizedPlan = 'Business Starter (15 Seats)';
    } else if (typeof plan === 'object' && plan.maxSeats) {
      maxSeats = plan.maxSeats;
      normalizedPlan = plan.plan || 'Custom Plan';
    }

    await tenant.update({ plan: normalizedPlan, maxSeats });
    return tenant;
  }
}

module.exports = new TenantService();
