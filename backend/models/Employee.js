const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Employee = sequelize.define('Employee', {
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
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  designation: {
    type: DataTypes.STRING,
  },
  roleId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'role_id',
    references: {
      model: 'roles',
      key: 'id'
    }
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'password_hash'
  },
  avatar: {
    type: DataTypes.TEXT,
  },
  baseSalary: {
    type: DataTypes.INTEGER,
    defaultValue: 50000,
    field: 'base_salary'
  }
}, {
  tableName: 'employees',
  timestamps: true,
});

module.exports = Employee;
