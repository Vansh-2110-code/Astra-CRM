const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
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
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'customer_name'
  },
  totalValue: {
    type: DataTypes.DOUBLE,
    defaultValue: 0,
    field: 'total_value'
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Pending',
  },
  quoteId: {
    type: DataTypes.STRING,
    field: 'quote_id'
  },
  createdDate: {
    type: DataTypes.STRING,
    field: 'created_date'
  }
}, {
  tableName: 'orders',
  timestamps: true,
});

module.exports = Order;
