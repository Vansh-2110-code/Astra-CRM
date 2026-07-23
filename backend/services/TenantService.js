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
}

module.exports = new TenantService();
