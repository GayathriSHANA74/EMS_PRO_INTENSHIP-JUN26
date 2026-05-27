import React from 'react';
import './EmployeeTable.css';

const DEPT_COLORS = {
  Engineering: '#4daaff',
  Design: '#c77dff',
  Marketing: '#ff9f4d',
  HR: '#4dffb4',
  Finance: '#e8ff4d',
  Operations: '#ff4d6d',
};

export default function EmployeeTable({ employees, onEdit, onDelete }) {
  return (
    <div className="table-wrap">
      <table className="emp-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Employee</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Phone</th>
            <th>Salary</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td><span className="emp-id">{emp.id}</span></td>
              <td>
                <div className="emp-info">
                  <div className="emp-avatar" style={{ background: DEPT_COLORS[emp.department] || '#4daaff' }}>
                    {emp.name.charAt(0)}
                  </div>
                  <div>
                    <div className="emp-name">{emp.name}</div>
                    <div className="emp-email">{emp.email}</div>
                  </div>
                </div>
              </td>
              <td>
                <span
                  className="dept-badge"
                  style={{ borderColor: DEPT_COLORS[emp.department] || '#4daaff', color: DEPT_COLORS[emp.department] || '#4daaff' }}
                >
                  {emp.department}
                </span>
              </td>
              <td className="designation">{emp.designation}</td>
              <td className="phone">{emp.phone}</td>
              <td className="salary">₹{emp.salary.toLocaleString()}</td>
              <td className="date">{new Date(emp.dateOfJoining).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
              <td>
                <div className="action-btns">
                  <button className="btn-icon" onClick={() => onEdit(emp)} title="Edit">✏️</button>
                  <button className="btn-icon del" onClick={() => onDelete(emp)} title="Delete">🗑️</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
