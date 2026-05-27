import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import EmployeeTable from './components/EmployeeTable';
import EmployeeCards from './components/EmployeeCards';
import EmployeeForm from './components/EmployeeForm';
import ConfirmDialog from './components/ConfirmDialog';
import Toast from './components/Toast';

const API = 'http://localhost:5000/api/employees';
const DEPARTMENTS = ['All', 'Engineering', 'Design', 'Marketing', 'HR', 'Finance', 'Operations'];

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('table'); // 'table' | 'card'
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('All');
  const [modal, setModal] = useState(null); // null | 'add' | 'edit'
  const [editData, setEditData] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [toasts, setToasts] = useState([]);

  const addToast = (msg, type = 'success') => {
    const id = Date.now();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  };

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (dept !== 'All') params.set('department', dept);
      const res = await fetch(`${API}?${params}`);
      const data = await res.json();
      setEmployees(data);
    } catch {
      addToast('Failed to fetch employees', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, dept]);

  useEffect(() => {
    const timer = setTimeout(fetchEmployees, 300);
    return () => clearTimeout(timer);
  }, [fetchEmployees]);

  const handleAdd = () => { setEditData(null); setModal('add'); };
  const handleEdit = (emp) => { setEditData(emp); setModal('edit'); };
  const handleCloseModal = () => { setModal(null); setEditData(null); };

  const handleSave = async (formData) => {
    try {
      const isEdit = modal === 'edit';
      const url = isEdit ? `${API}/${editData.id}` : API;
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      addToast(isEdit ? 'Employee updated!' : 'Employee added!');
      handleCloseModal();
      fetchEmployees();
    } catch (e) {
      addToast(e.message || 'Something went wrong', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await fetch(`${API}/${confirmDelete.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      addToast('Employee deleted');
      setConfirmDelete(null);
      fetchEmployees();
    } catch (e) {
      addToast(e.message || 'Delete failed', 'error');
    }
  };

  const stats = {
    total: employees.length,
    depts: [...new Set(employees.map((e) => e.department))].length,
    avgSalary: employees.length
      ? Math.round(employees.reduce((s, e) => s + e.salary, 0) / employees.length)
      : 0,
  };

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <span className="logo-icon">⬡</span>
          <span className="logo-text">EMS</span>
        </div>
        <nav className="nav">
          <div className="nav-item active">
            <span>👥</span> Employees
          </div>
        </nav>
        <div className="sidebar-footer">
          <div className="version">v1.0.0</div>
        </div>
      </aside>

      {/* Main */}
      <main className="main">
        {/* Header */}
        <header className="page-header">
          <div>
            <h1>Employee Directory</h1>
            <p className="subtitle">Manage your team records</p>
          </div>
          <button className="btn btn-primary" onClick={handleAdd}>+ Add Employee</button>
        </header>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Employees</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.depts}</div>
            <div className="stat-label">Departments</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">₹{stats.avgSalary.toLocaleString()}</div>
            <div className="stat-label">Avg. Salary</div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="toolbar">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              type="text"
              placeholder="Search by name, email or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="dept-filter"
            value={dept}
            onChange={(e) => setDept(e.target.value)}
          >
            {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
          </select>
          <div className="view-toggle">
            <button
              className={`toggle-btn ${view === 'table' ? 'active' : ''}`}
              onClick={() => setView('table')}
              title="Table View"
            >☰</button>
            <button
              className={`toggle-btn ${view === 'card' ? 'active' : ''}`}
              onClick={() => setView('card')}
              title="Card View"
            >⊞</button>
          </div>
        </div>

        {/* Content */}
        <div className="content-area">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading employees...</p>
            </div>
          ) : employees.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🗃️</div>
              <p>No employees found</p>
              <button className="btn btn-primary" onClick={handleAdd}>Add First Employee</button>
            </div>
          ) : view === 'table' ? (
            <EmployeeTable
              employees={employees}
              onEdit={handleEdit}
              onDelete={(emp) => setConfirmDelete(emp)}
            />
          ) : (
            <EmployeeCards
              employees={employees}
              onEdit={handleEdit}
              onDelete={(emp) => setConfirmDelete(emp)}
            />
          )}
        </div>
      </main>

      {/* Modals */}
      {modal && (
        <EmployeeForm
          mode={modal}
          initial={editData}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      )}
      {confirmDelete && (
        <ConfirmDialog
          name={confirmDelete.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {/* Toasts */}
      <div className="toast-container">
        {toasts.map((t) => <Toast key={t.id} msg={t.msg} type={t.type} />)}
      </div>
    </div>
  );
}
