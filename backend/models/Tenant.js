const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tenant = sequelize.define('Tenant', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subdomain: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  logo: {
    type: DataTypes.STRING,
  },
  industry: {
    type: DataTypes.STRING,
  },
  plan: {
    type: DataTypes.STRING,
    defaultValue: 'Starter',
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Active',
  },
  maxSeats: {
    type: DataTypes.INTEGER,
    defaultValue: 10,
    field: 'max_seats'
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'USD ($)',
  },
  // Isolated SMTP configurations per tenant
  smtpHost: {
    type: DataTypes.STRING,
    field: 'smtp_host'
  },
  smtpPort: {
    type: DataTypes.INTEGER,
    field: 'smtp_port'
  },
  smtpUser: {
    type: DataTypes.STRING,
    field: 'smtp_user'
  },
  smtpPass: {
    type: DataTypes.STRING,
    field: 'smtp_pass'
  },
  smtpFrom: {
    type: DataTypes.STRING,
    field: 'smtp_from'
  }
}, {
  tableName: 'tenants',
  timestamps: true,
});

module.exports = Tenant;
