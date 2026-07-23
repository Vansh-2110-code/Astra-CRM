const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  clientId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'client_id'
  },
  employeeId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'employee_id'
  },
  employeeName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'employee_name'
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Present', 'Absent', 'Half-Day', 'Paid Leave'),
    defaultValue: 'Present'
  },
  checkInTime: {
    type: DataTypes.STRING,
    field: 'check_in_time'
  },
  checkOutTime: {
    type: DataTypes.STRING,
    field: 'check_out_time'
  },
  notes: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'attendance_records',
  timestamps: true,
});

module.exports = Attendance;
