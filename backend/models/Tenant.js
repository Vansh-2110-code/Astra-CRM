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
  },
  logo: {
    type: DataTypes.TEXT,
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
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'USD ($)',
  }
}, {
  tableName: 'tenants',
  timestamps: true,
});

module.exports = Tenant;
