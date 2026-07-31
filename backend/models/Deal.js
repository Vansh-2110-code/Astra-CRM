const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Deal = sequelize.define('Deal', {
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
  company: {
    type: DataTypes.STRING,
  },
  dealValue: {
    type: DataTypes.DOUBLE,
    defaultValue: 0,
    field: 'deal_value'
  },
  probability: {
    type: DataTypes.INTEGER,
    defaultValue: 50,
  },
  stage: {
    type: DataTypes.STRING,
    defaultValue: 'Lead',
  },
  pipelineId: {
    type: DataTypes.STRING,
    defaultValue: 'pipe-enterprise',
    field: 'pipeline_id'
  },
  projectStatus: {
    type: DataTypes.STRING,
    field: 'project_status',
    defaultValue: 'In Progress'
  },
  projectProgress: {
    type: DataTypes.INTEGER,
    field: 'project_progress',
    defaultValue: 0
  },
  projectDeadline: {
    type: DataTypes.STRING,
    field: 'project_deadline',
    allowNull: true
  }
}, {
  tableName: 'deals',
  timestamps: true,
});

module.exports = Deal;
