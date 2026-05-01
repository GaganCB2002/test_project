import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Team = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch team');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">Team</h1>

      {loading ? (
        <div className="loading-spinner"><div className="spinner"></div></div>
      ) : (
        <div className="card">
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {users.map(user => (
                <div key={user._id} className="card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div className="avatar" style={{ width: '60px', height: '60px', fontSize: '1.25rem' }}>
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </div>
                    <div>
                      <h3 style={{ fontWeight: 600 }}>{user.firstName} {user.lastName}</h3>
                      <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>{user.email}</p>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        <span className="badge badge-primary">{user.role}</span>
                        <span className="badge badge-success">{user.department}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--gray-100)' }}>
                    <span style={{ fontSize: '0.75rem', color: user.isActive ? '#059669' : '#6B7280' }}>
                      {user.isActive ? '● Active' : '○ Inactive'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                      Last login: {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;