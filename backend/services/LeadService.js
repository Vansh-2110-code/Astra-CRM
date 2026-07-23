const LeadRepository = require('../repositories/LeadRepository');

class LeadService {
  async getLeadsByTenant(tenantId) {
    return LeadRepository.findByTenant(tenantId);
  }

  async createLead(tenantId, leadData) {
    const { name, company, email, status, score, potentialValue } = leadData;

    // Check duplicate email warning within the same tenant partition
    if (email) {
      const existing = await LeadRepository.findOne({
        where: { clientId: tenantId, email }
      });
      if (existing) {
        console.warn(`[Duplicate Match Warning] Lead with email ${email} already exists for tenant ${tenantId}.`);
      }
    }

    // Auto scoring logic: Base 50
    let computedScore = score || 50;
    if (potentialValue > 100000) {
      computedScore += 25;
    }
    if (email && (email.endsWith('.org') || email.endsWith('.edu'))) {
      computedScore += 10;
    }

    const lead = await LeadRepository.create({
      id: `lead-${Date.now()}`,
      clientId: tenantId,
      name,
      company,
      email,
      status: status || 'Lead',
      score: computedScore,
      potentialValue: potentialValue || 0
    });

    return lead;
  }
}

module.exports = new LeadService();
