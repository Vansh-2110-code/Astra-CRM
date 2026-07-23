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
  contactEmail: {
    type: DataTypes.STRING,
    field: 'contact_email'
  },
  productName: {
    type: DataTypes.STRING,
    field: 'product_name'
  },
  warrantyStatus: {
    type: DataTypes.STRING,
    field: 'warranty_status',
    defaultValue: 'Active Warranty'
  },
  messages: {
    type: DataTypes.JSON,
    defaultValue: []
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
