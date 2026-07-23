const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  clientId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'client_id',
    references: {
      model: 'tenants',
      key: 'id'
    }
  },
  userEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'user_email'
  },
  roleName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'role_name'
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  resource: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ipAddress: {
    type: DataTypes.STRING,
    field: 'ip_address'
  },
  severity: {
    type: DataTypes.STRING,
    defaultValue: 'INFO'
  },
  details: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'audit_logs',
  timestamps: true,
});

module.exports = AuditLog;
