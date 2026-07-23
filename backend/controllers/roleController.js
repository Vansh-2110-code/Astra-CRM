const RoleService = require('../services/RoleService');

exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { permissions, requesterRole } = req.body;
    const role = await RoleService.updateRolePermissions(id, permissions, requesterRole);
    res.json(role);
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};
