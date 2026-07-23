const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Integration = sequelize.define('Integration', {
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
  enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  config: {
    type: DataTypes.JSON,
    defaultValue: {}
  }
}, {
  tableName: 'integrations',
  timestamps: true,
});

module.exports = Integration;
