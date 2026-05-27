import React from 'react';
import './EmployeeCards.css';

const DEPT_COLORS = {
  Engineering: '#4daaff',
  Design: '#c77dff',
  Marketing: '#ff9f4d',
  HR: '#4dffb4',
  Finance: '#e8ff4d',
  Operations: '#ff4d6d',
};

export default function EmployeeCards({ employees, onEdit, onDelete }) {
  return (
    <div className="cards-grid">
      {employees.map((emp) => {
        const color = DEPT_COLORS[emp.department] || '#4daaff';
        return (
          <div className="emp-card" key={emp.id}>
            <div className="card-top" style={{ background: `${color}18`, borderBottom: `1px solid ${color}30` }}>
              <div className="card-avatar" style={{ background: color }}>
                {emp.name.charAt(0)}
              </div>
              <span className="card-id">{emp.id}</span>
            </div>
            <div className="card-body">
              <h3 className="card-name">{emp.name}</h3>
              <p className="card-designation">{emp.designation}</p>
              <span className="card-dept" style={{ borderColor: color, color }}>{emp.department}</span>

              <div className="card-details">
                <div className="detail-row">
                  <span className="detail-icon">✉</span>
                  <span className="detail-val">{emp.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-icon">📱</span>
                  <span className="detail-val">{emp.phone}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-icon">💰</span>
                  <span className="detail-val salary-val">₹{emp.salary.toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-icon">📅</span>
                  <span className="detail-val">
                    {new Date(emp.dateOfJoining).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <button className="btn-icon" onClick={() => onEdit(emp)}>✏️ Edit</button>
              <button className="btn-icon del" onClick={() => onDelete(emp)}>🗑️ Delete</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
