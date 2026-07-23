const EmployeeService = require('../services/EmployeeService');

exports.getEmployees = async (req, res) => {
  try {
    const tenantId = req.tenant.id;
    const employees = await EmployeeService.getEmployeesByTenant(tenantId);
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createEmployee = async (req, res) => {
  try {
    const tenant = req.tenant;
    const employee = await EmployeeService.createEmployee(tenant, req.body);
    res.status(201).json(employee);
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const tenantId = req.tenant.id;
    const { id } = req.params;
    const { designation, roleId, requesterRole } = req.body;
    const employee = await EmployeeService.updateEmployee(tenantId, id, { designation, roleId }, requesterRole);
    res.json(employee);
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};
