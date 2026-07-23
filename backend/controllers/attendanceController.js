const { Attendance, Employee } = require('../models');

exports.getAttendance = async (req, res) => {
  try {
    const clientId = req.user?.tenantId || req.query.clientId || 'client-001';
    const records = await Attendance.findAll({
      where: { clientId },
      order: [['date', 'DESC']]
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markAttendance = async (req, res) => {
  try {
    const { employeeId, date, status, checkInTime, checkOutTime, notes } = req.body;
    const clientId = req.user?.tenantId || 'client-001';

    const emp = await Employee.findByPk(employeeId);
    const employeeName = emp ? emp.name : 'Employee';

    const id = `ATT-${employeeId}-${date}`;
    const [record, created] = await Attendance.findOrCreate({
      where: { id },
      defaults: {
        id,
        clientId,
        employeeId,
        employeeName,
        date,
        status: status || 'Present',
        checkInTime: checkInTime || '09:00 AM',
        checkOutTime: checkOutTime || '06:00 PM',
        notes: notes || ''
      }
    });

    if (!created) {
      await record.update({ status, checkInTime, checkOutTime, notes });
    }

    res.json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.batchMarkAttendance = async (req, res) => {
  try {
    const { date, records } = req.body; // records: [{ employeeId, status }]
    const clientId = req.user?.tenantId || 'client-001';

    const results = [];
    for (const item of (records || [])) {
      const id = `ATT-${item.employeeId}-${date}`;
      const emp = await Employee.findByPk(item.employeeId);
      const employeeName = emp ? emp.name : 'Employee';

      const [record, created] = await Attendance.findOrCreate({
        where: { id },
        defaults: {
          id,
          clientId,
          employeeId: item.employeeId,
          employeeName,
          date,
          status: item.status || 'Present',
          checkInTime: '09:00 AM',
          checkOutTime: '06:00 PM'
        }
      });

      if (!created) {
        await record.update({ status: item.status });
      }
      results.push(record);
    }

    res.json({ success: true, count: results.length, records: results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
