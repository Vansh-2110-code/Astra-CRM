const RoleRepository = require('../repositories/RoleRepository');

class RoleService {
  async updateRolePermissions(id, permissions, requesterRole) {
    if (requesterRole !== "Super Admin / Org Admin") {
      throw new Error("Access Denied: Only Security Administrators can update RBAC permissions.");
    }

    const role = await RoleRepository.findById(id);
    if (!role) {
      throw new Error("Role not found.");
    }

    await role.update({ permissions });
    return role;
  }
}

module.exports = new RoleService();
