import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorkspaceStore } from '../store/workspaceStore';
import api from '../services/api';

const WorkspaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentWorkspace, fetchWorkspace } = useWorkspaceStore();
  const [channels, setChannels] = useState([]);
  const [activeTab, setActiveTab] = useState('channels');

  useEffect(() => {
    fetchWorkspace(id);
    fetchChannels();
  }, [id]);

  const fetchChannels = async () => {
    try {
      const response = await api.get(`/channels/workspace/${id}`);
      setChannels(response.data);
    } catch (error) {
      console.error('Failed to fetch channels');
    }
  };

  if (!currentWorkspace) {
    return <div className="loading-spinner"><div className="spinner"></div></div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 className="page-title">{currentWorkspace.name}</h1>
          <p style={{ color: '#6B7280' }}>{currentWorkspace.description}</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-primary" onClick={() => navigate('/chat')}>💬 Open Chat</button>
          <button className="btn btn-secondary" onClick={() => navigate('/projects')}>📁 Projects</button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className={`btn ${activeTab === 'channels' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('channels')}>
              Channels
            </button>
            <button className={`btn ${activeTab === 'members' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('members')}>
              Members
            </button>
            <button className={`btn ${activeTab === 'settings' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('settings')}>
              Settings
            </button>
          </div>
        </div>
        <div className="card-body">
          {activeTab === 'channels' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
              {channels.map(channel => (
                <div key={channel._id} className="card" style={{ padding: '16px', cursor: 'pointer' }} onClick={() => navigate(`/chat/${channel._id}`)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '1.5rem' }}>#</span>
                    <div>
                      <h4 style={{ fontWeight: 600 }}>{channel.name}</h4>
                      <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>{channel.type}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'members' && (
            <div>
              {currentWorkspace.members?.map(member => (
                <div key={member.user?._id} className="employee-row">
                  <div className="employee-info">
                    <div className="avatar">
                      {member.user?.firstName?.[0]}{member.user?.lastName?.[0]}
                    </div>
                    <div>
                      <div className="employee-name">{member.user?.firstName} {member.user?.lastName}</div>
                      <div className="employee-role">{member.user?.email}</div>
                    </div>
                  </div>
                  <span className="badge badge-primary">{member.role}</span>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'settings' && (
            <div>
              <h3 style={{ marginBottom: '16px' }}>Workspace Settings</h3>
              <p style={{ color: '#6B7280' }}>Settings panel coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkspaceDetail;