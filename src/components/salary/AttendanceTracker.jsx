import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  Calendar, CheckCircle2, XCircle, Clock, AlertCircle,
  Users, CheckSquare, Save, Filter, UserCheck
} from 'lucide-react';

const AttendanceTracker = () => {
  const { employees, attendanceRecords, markAttendance, batchMarkAttendance } = useCRM();
  
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);

  // Local state for attendance status map: { [employeeId]: 'Present' | 'Absent' | 'Half-Day' | 'Paid Leave' }
  const [attendanceMap, setAttendanceMap] = useState(() => {
    const initialMap = {};
    (employees || []).forEach(emp => {
      // Find existing record for today if any
      const existing = (attendanceRecords || []).find(r => r.employeeId === emp.id && r.date === todayStr);
      initialMap[emp.id] = existing ? existing.status : 'Present';
    });
    return initialMap;
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleStatusChange = (empId, status) => {
    setAttendanceMap(prev => ({ ...prev, [empId]: status }));
  };

  const handleMarkAll = (status) => {
    const updated = {};
    (employees || []).forEach(emp => {
      updated[emp.id] = status;
    });
    setAttendanceMap(updated);
  };

  const handleSaveAttendance = () => {
    const records = Object.keys(attendanceMap).map(empId => ({
      employeeId: empId,
      status: attendanceMap[empId]
    }));

    batchMarkAttendance(selectedDate, records);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Stats calculation
  const totalEmployees = (employees || []).length;
  const presentCount = Object.values(attendanceMap).filter(s => s === 'Present').length;
  const halfDayCount = Object.values(attendanceMap).filter(s => s === 'Half-Day').length;
  const absentCount = Object.values(attendanceMap).filter(s => s === 'Absent').length;
  const leaveCount = Object.values(attendanceMap).filter(s => s === 'Paid Leave').length;
  const attendanceRate = totalEmployees > 0 ? Math.round(((presentCount + (halfDayCount * 0.5) + leaveCount) / totalEmployees) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Date Header & Quick Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Calendar style={{ color: '#3b82f6', width: '20px', height: '20px' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0 }}>Daily Attendance Marking</h3>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="form-input"
            style={{ width: '160px', padding: '6px 12px', fontSize: '0.8rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => handleMarkAll('Present')}
            className="btn btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.75rem', borderColor: '#10b981', color: '#10b981' }}
          >
            <CheckCircle2 style={{ width: '14px', height: '14px' }} /> Mark All Present
          </button>
          <button
            onClick={handleSaveAttendance}
            className="btn gradient-btn-primary"
            style={{ padding: '6px 16px', fontSize: '0.8rem' }}
          >
            <Save style={{ width: '14px', height: '14px' }} /> Save Attendance Batch
          </button>
        </div>
      </div>

      {/* Success Alert Banner */}
      {savedSuccess && (
        <div className="glass-card" style={{ padding: '12px 16px', borderLeft: '4px solid #10b981', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle2 style={{ color: '#10b981', width: '18px', height: '18px' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#10b981' }}>
            Attendance saved successfully for {selectedDate}! Per-day salary accumulation updated.
          </span>
        </div>
      )}

      {/* Attendance KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
        <div className="glass-card" style={{ padding: '14px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Staff</div>
          <div style={{ fontSize: '1.3rem', fontWeight: '800' }}>{totalEmployees}</div>
        </div>
        <div className="glass-card" style={{ padding: '14px', textAlign: 'center', borderTop: '3px solid #10b981' }}>
          <div style={{ fontSize: '0.7rem', color: '#10b981', textTransform: 'uppercase' }}>Present</div>
          <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#10b981' }}>{presentCount}</div>
        </div>
        <div className="glass-card" style={{ padding: '14px', textAlign: 'center', borderTop: '3px solid #f59e0b' }}>
          <div style={{ fontSize: '0.7rem', color: '#f59e0b', textTransform: 'uppercase' }}>Half Day</div>
          <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#f59e0b' }}>{halfDayCount}</div>
        </div>
        <div className="glass-card" style={{ padding: '14px', textAlign: 'center', borderTop: '3px solid #ef4444' }}>
          <div style={{ fontSize: '0.7rem', color: '#ef4444', textTransform: 'uppercase' }}>Absent</div>
          <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#ef4444' }}>{absentCount}</div>
        </div>
        <div className="glass-card" style={{ padding: '14px', textAlign: 'center', borderTop: '3px solid #8b5cf6' }}>
          <div style={{ fontSize: '0.7rem', color: '#8b5cf6', textTransform: 'uppercase' }}>Rate %</div>
          <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#8b5cf6' }}>{attendanceRate}%</div>
        </div>
      </div>

      {/* Employee Attendance Table */}
      <div className="custom-table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Designation</th>
              <th>Status Marker</th>
              <th>Check-In</th>
              <th>Check-Out</th>
            </tr>
          </thead>
          <tbody>
            {(employees || []).map(emp => {
              const status = attendanceMap[emp.id] || 'Present';

              return (
                <tr key={emp.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={emp.avatar} alt={emp.name} style={{ width: '36px', height: '36px', borderRadius: '10px', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{emp.name}</div>
                        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{emp.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: '#60a5fa' }}>{emp.designation}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {['Present', 'Half-Day', 'Absent', 'Paid Leave'].map(st => {
                        const isSelected = status === st;
                        let btnColor = '#10b981';
                        if (st === 'Half-Day') btnColor = '#f59e0b';
                        if (st === 'Absent') btnColor = '#ef4444';
                        if (st === 'Paid Leave') btnColor = '#8b5cf6';

                        return (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleStatusChange(emp.id, st)}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '6px',
                              border: `1px solid ${isSelected ? btnColor : 'var(--border-color)'}`,
                              background: isSelected ? btnColor : 'transparent',
                              color: isSelected ? '#fff' : 'var(--text-muted)',
                              fontSize: '0.725rem',
                              fontWeight: '700',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {st}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {status === 'Absent' ? '—' : '09:00 AM'}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {status === 'Absent' ? '—' : status === 'Half-Day' ? '01:30 PM' : '06:00 PM'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTracker;
