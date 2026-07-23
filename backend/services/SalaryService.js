const SalarySlip = require('../models/SalarySlip');

class SalaryService {
  async getSlipsByTenant(clientId) {
    return SalarySlip.findAll({ where: { clientId }, order: [['year', 'DESC'], ['month', 'DESC']] });
  }

  async getSlipsByEmployee(employeeId) {
    return SalarySlip.findAll({ where: { employeeId }, order: [['year', 'DESC'], ['month', 'DESC']] });
  }

  async generateSlip(data) {
    const {
      clientId, employeeId, employeeName, designation,
      month, year, basicSalary, hra, transportAllowance,
      medicalAllowance, specialAllowance, bonus, workingDays, daysWorked
    } = data;

    const grossSalary = (basicSalary || 0) + (hra || 0) + (transportAllowance || 0)
      + (medicalAllowance || 0) + (specialAllowance || 0) + (bonus || 0);

    // Standard Indian payroll deductions
    const pf = Math.round(basicSalary * 0.12);
    const esi = grossSalary <= 21000 ? Math.round(grossSalary * 0.0075) : 0;
    const professionalTax = grossSalary > 15000 ? 200 : 0;
    const incomeTax = Math.round(grossSalary * 0.10);

    const totalDeductions = pf + esi + professionalTax + incomeTax;
    const netSalary = grossSalary - totalDeductions;
    const days = workingDays || 22;
    const perDayRate = Math.round(netSalary / days);
    const actualDaysWorked = daysWorked || days;

    const count = await SalarySlip.count();
    const id = `SAL-${year}-${String(count + 1).padStart(4, '0')}`;

    return SalarySlip.create({
      id, clientId, employeeId, employeeName, designation,
      month, year,
      basicSalary, hra, transportAllowance, medicalAllowance, specialAllowance, bonus,
      grossSalary, pf, esi, professionalTax, incomeTax, totalDeductions,
      netSalary, perDayRate,
      workingDays: days,
      daysWorked: actualDaysWorked,
      status: 'Generated'
    });
  }

  async markAsPaid(id) {
    const slip = await SalarySlip.findByPk(id);
    if (!slip) throw new Error('Salary slip not found');
    await slip.update({ status: 'Paid', paidDate: new Date().toISOString().split('T')[0] });
    return slip;
  }
}

module.exports = new SalaryService();
