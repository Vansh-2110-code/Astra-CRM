const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Quote = sequelize.define('Quote', {
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
  contactPerson: {
    type: DataTypes.STRING,
    field: 'contact_person'
  },
  contactEmail: {
    type: DataTypes.STRING,
    field: 'contact_email'
  },
  items: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  subtotal: {
    type: DataTypes.DOUBLE,
    defaultValue: 0
  },
  discountPercent: {
    type: DataTypes.DOUBLE,
    defaultValue: 0,
    field: 'discount_percent'
  },
  discountAmount: {
    type: DataTypes.DOUBLE,
    defaultValue: 0,
    field: 'discount_amount'
  },
  taxTotal: {
    type: DataTypes.DOUBLE,
    defaultValue: 0,
    field: 'tax_total'
  },
  grandTotal: {
    type: DataTypes.DOUBLE,
    defaultValue: 0,
    field: 'grand_total'
  },
  notes: {
    type: DataTypes.TEXT
  },
  customLogoUrl: {
    type: DataTypes.TEXT,
    field: 'custom_logo_url'
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'USD ($)'
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Draft'
  },
  createdDate: {
    type: DataTypes.STRING,
    field: 'created_date'
  },
  validUntil: {
    type: DataTypes.STRING,
    field: 'valid_until'
  }
}, {
  tableName: 'quotes',
  timestamps: true,
});

module.exports = Quote;
