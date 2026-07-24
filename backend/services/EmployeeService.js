const EmployeeRepository = require('../repositories/EmployeeRepository');
const TenantRepository = require('../repositories/TenantRepository');
const AuditLogRepository = require('../repositories/AuditLogRepository');

const bcrypt = require('bcryptjs');

class EmployeeService {
  async getEmployeesByTenant(tenantId) {
    return EmployeeRepository.findByTenant(tenantId);
  }

  async createEmployee(tenant, employeeData) {
    const { name, email, designation, roleId, password, baseSalary, salary } = employeeData;

    // Check duplicate email across system
    const existing = await EmployeeRepository.findOne({ where: { email } });
    if (existing) {
      throw new Error(`An employee profile with email '${email}' already exists in the system.`);
    }

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
      baseSalary: parseInt(baseSalary || salary || 50000, 10),
      passwordHash,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
    });

    return employee;
  }

  async updateEmployee(tenantId, id, updateData, requesterRole) {
    const { designation, roleId, baseSalary, salary } = updateData;

    if (requesterRole && requesterRole !== "Super Admin / Org Admin" && !requesterRole.includes("Admin") && !requesterRole.includes("HR")) {
      throw new Error("Access Denied: Only Admins or HR Managers can modify designations, roles, and salaries.");
    }

    const employee = await EmployeeRepository.findOne({
      where: { id, clientId: tenantId }
    });

    if (!employee) {
      throw new Error("Employee profile not found.");
    }

    const updates = {};
    if (designation !== undefined) updates.designation = designation;
    if (roleId !== undefined) updates.roleId = roleId;
    if (baseSalary !== undefined || salary !== undefined) {
      updates.baseSalary = parseInt(baseSalary || salary, 10);
    }

    await employee.update(updates);
    return employee;
  }
}

module.exports = new EmployeeService();
