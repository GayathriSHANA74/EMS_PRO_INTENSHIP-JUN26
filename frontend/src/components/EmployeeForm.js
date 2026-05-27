import React, { useState, useEffect } from 'react';

const DEPARTMENTS = ['Engineering', 'Design', 'Marketing', 'HR', 'Finance', 'Operations'];

const EMPTY = {
  name: '', email: '', phone: '', department: '',
  designation: '', salary: '', dateOfJoining: '',
};

function validate(fields) {
  const errors = {};
  if (!fields.name.trim()) errors.name = 'Name is required';
  if (!fields.email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) errors.email = 'Invalid email format';
  if (!fields.phone.trim()) errors.phone = 'Phone is required';
  else if (!/^\d{10}$/.test(fields.phone)) errors.phone = 'Must be 10 digits';
  if (!fields.department) errors.department = 'Select a department';
  if (!fields.designation.trim()) errors.designation = 'Designation is required';
  if (!fields.salary) errors.salary = 'Salary is required';
  else if (isNaN(Number(fields.salary)) || Number(fields.salary) <= 0) errors.salary = 'Must be a positive number';
  if (!fields.dateOfJoining) errors.dateOfJoining = 'Date of joining is required';
  return errors;
}

export default function EmployeeForm({ mode, initial, onSave, onClose }) {
  const [fields, setFields] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initial) {
      setFields({ ...initial, salary: String(initial.salary) });
    } else {
      setFields(EMPTY);
    }
    setErrors({});
  }, [initial]);

  const handle = (key) => (e) => {
    setFields((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: '' }));
  };

  const handleSubmit = async () => {
    const errs = validate(fields);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitting(true);
    await onSave({ ...fields, salary: Number(fields.salary) });
    setSubmitting(false);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h2>{mode === 'add' ? '+ New Employee' : '✏️ Update Employee'}</h2>
        <div className="form-grid">
          <Field label="Full Name *" error={errors.name} className="full">
            <input type="text" value={fields.name} onChange={handle('name')} className={errors.name ? 'error' : ''} placeholder="e.g. John Smith" />
          </Field>
          <Field label="Email Address *" error={errors.email}>
            <input type="email" value={fields.email} onChange={handle('email')} className={errors.email ? 'error' : ''} placeholder="john@company.com" />
          </Field>
          <Field label="Phone Number *" error={errors.phone}>
            <input type="tel" value={fields.phone} onChange={handle('phone')} className={errors.phone ? 'error' : ''} placeholder="10-digit number" />
          </Field>
          <Field label="Department *" error={errors.department}>
            <select value={fields.department} onChange={handle('department')} className={errors.department ? 'error' : ''}>
              <option value="">Select department</option>
              {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </Field>
          <Field label="Designation *" error={errors.designation}>
            <input type="text" value={fields.designation} onChange={handle('designation')} className={errors.designation ? 'error' : ''} placeholder="e.g. Senior Developer" />
          </Field>
          <Field label="Salary (₹) *" error={errors.salary}>
            <input type="number" value={fields.salary} onChange={handle('salary')} className={errors.salary ? 'error' : ''} placeholder="e.g. 75000" min="0" />
          </Field>
          <Field label="Date of Joining *" error={errors.dateOfJoining}>
            <input type="date" value={fields.dateOfJoining} onChange={handle('dateOfJoining')} className={errors.dateOfJoining ? 'error' : ''} />
          </Field>
        </div>
        <div className="form-actions">
          <button className="btn btn-secondary" onClick={onClose} disabled={submitting}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Saving...' : mode === 'add' ? 'Add Employee' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children, className }) {
  return (
    <div className={`form-group${className ? ' ' + className : ''}`}>
      <label>{label}</label>
      {children}
      {error && <span className="err-msg">{error}</span>}
    </div>
  );
}
