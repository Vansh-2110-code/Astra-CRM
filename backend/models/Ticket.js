const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ticket = sequelize.define('Ticket', {
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
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  priority: {
    type: DataTypes.STRING,
    defaultValue: 'Medium',
  },
  customerName: {
    type: DataTypes.STRING,
    field: 'customer_name'
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Open',
  },
  createdDate: {
    type: DataTypes.STRING,
    field: 'created_date'
  }
}, {
  tableName: 'tickets',
  timestamps: true,
});

module.exports = Ticket;
