import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspaceStore } from '../store/workspaceStore';
import api from '../services/api';

const Workspaces = () => {
  const navigate = useNavigate();
  const { workspaces, fetchWorkspaces, createWorkspace, loading } = useWorkspaceStore();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', type: 'public' });

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const result = await createWorkspace(formData);
    if (result) {
      setShowModal(false);
      setFormData({ name: '', description: '', type: 'public' });
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="page-title">Workspaces</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          ➕ Create Workspace
        </button>
      </div>

      <div className="stats-grid">
        {workspaces.map(workspace => (
          <div key={workspace._id} className="card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/workspaces/${workspace._id}`)}>
            <div className="card-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div className="avatar" style={{ background: workspace.color || '#3B82F6' }}>
                  {workspace.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <h3 style={{ fontWeight: 600 }}>{workspace.name}</h3>
                  <span className={`badge ${workspace.type === 'public' ? 'badge-success' : 'badge-warning'}`}>
                    {workspace.type}
                  </span>
                </div>
              </div>
              <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>{workspace.description || 'No description'}</p>
              <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                  {workspace.members?.length || 0} members
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Create Workspace</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                <div className="input-group">
                  <label>Name</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div className="input-group">
                  <label>Description</label>
                  <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} />
                </div>
                <div className="input-group">
                  <label>Type</label>
                  <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workspaces;