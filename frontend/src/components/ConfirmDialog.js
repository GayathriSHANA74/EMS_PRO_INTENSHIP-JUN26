import React from 'react';

export default function ConfirmDialog({ name, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="confirm-modal">
        <div className="icon">⚠️</div>
        <h3>Delete Employee</h3>
        <p>Are you sure you want to delete <strong>{name}</strong>?<br />This action cannot be undone.</p>
        <div className="actions">
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>Yes, Delete</button>
        </div>
      </div>
    </div>
  );
}
