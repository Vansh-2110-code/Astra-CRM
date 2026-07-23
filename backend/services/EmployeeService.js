const EmployeeRepository = require('../repositories/EmployeeRepository');
const TenantRepository = require('../repositories/TenantRepository');
const AuditLogRepository = require('../repositories/AuditLogRepository');

const bcrypt = require('bcryptjs');

class EmployeeService {
  async getEmployeesByTenant(tenantId) {
    return EmployeeRepository.findByTenant(tenantId);
  }

  async createEmployee(tenant, employeeData) {
    const { name, email, designation, roleId, password } = employeeData;

    // Enforce seat limit check
    const activeCount = await EmployeeRepository.count({
      where: { clientId: tenant.id }
    });

    if (activeCount >= tenant.maxSeats) {
      throw new Error(`Seat Limit Reached: Your current plan ('${tenant.plan}') only supports up to ${tenant.maxSeats} seats. Please upgrade to add more employees.`);
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = password ? bcrypt.hashSync(password, salt) : bcrypt.hashSync('admin123', salt);

    const employee = await EmployeeRepository.create({
      id: `EMP-${Date.now()}`,
      clientId: tenant.id,
      name,
      email,
      designation: designation || 'Representative',
      roleId: roleId || 'role-exec',
      passwordHash,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
    });

    return employee;
  }

  async updateEmployee(tenantId, id, updateData, requesterRole) {
    const { designation, roleId } = updateData;

    if (requesterRole !== "Super Admin / Org Admin") {
      throw new Error("Access Denied: Only Admins can modify designations and roles.");
    }

    const employee = await EmployeeRepository.findOne({
      where: { id, clientId: tenantId }
    });

    if (!employee) {
      throw new Error("Employee profile not found.");
    }

    await employee.update({ designation, roleId });
    return employee;
  }
}

module.exports = new EmployeeService();
