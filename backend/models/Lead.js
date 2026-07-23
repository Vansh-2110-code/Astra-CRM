const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Lead = sequelize.define('Lead', {
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
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  company: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Lead',
  },
  score: {
    type: DataTypes.INTEGER,
    defaultValue: 50,
  },
  potentialValue: {
    type: DataTypes.DOUBLE,
    defaultValue: 0,
    field: 'potential_value'
  }
}, {
  tableName: 'leads',
  timestamps: true,
});

module.exports = Lead;
