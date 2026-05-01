import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="page-title">Projects</h1>
        <button className="btn btn-primary" onClick={() => navigate('/projects/new')}>
          ➕ Create Project
        </button>
      </div>

      {loading ? (
        <div className="loading-spinner"><div className="spinner"></div></div>
      ) : (
        <div className="stats-grid">
          {projects.map(project => (
            <div key={project._id} className="card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/projects/${project._id}`)}>
              <div className="card-body">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: project.color || '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>
                    📁
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 600 }}>{project.name}</h3>
                    <span className={`badge badge-${project.status === 'active' ? 'success' : 'warning'}`}>
                      {project.status}
                    </span>
                  </div>
                </div>
                <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '12px' }}>
                  {project.description || 'No description'}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="avatar-group">
                    {project.members?.slice(0, 3).map((member, idx) => (
                      <div key={idx} className="avatar" style={{ background: '#3B82F6' }}>
                        {member?.firstName?.[0]}
                      </div>
                    ))}
                  </div>
                  <span className={`badge badge-${project.priority === 'high' ? 'danger' : project.priority === 'medium' ? 'warning' : 'primary'}`}>
                    {project.priority}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;