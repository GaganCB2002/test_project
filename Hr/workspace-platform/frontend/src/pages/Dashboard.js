import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/analytics/dashboard');
      setStats(response.data);

      const trendsResponse = await api.get('/analytics/trends?days=7');
      setTrends(trendsResponse.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-spinner"><div className="spinner"></div></div>;
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div>
      <h1 className="page-title">{getGreeting()}, {user?.firstName}!</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#DBEAFE' }}>👥</div>
          <div className="stat-card-value">{stats?.activeUsers || 0}</div>
          <div className="stat-card-label">Active Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#D1FAE5' }}>📊</div>
          <div className="stat-card-value">{stats?.totalHoursWorked || 0}h</div>
          <div className="stat-card-label">Hours Worked Today</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#FEF3C7' }}>✅</div>
          <div className="stat-card-value">{stats?.tasks?.completed || 0}</div>
          <div className="stat-card-label">Tasks Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#FEE2E2' }}>📋</div>
          <div className="stat-card-value">{stats?.tasks?.inProgress || 0}</div>
          <div className="stat-card-label">In Progress</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Productivity Trends</h3>
          </div>
          <div className="card-body">
            <div className="analytics-chart">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(val) => val.slice(5)} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="hours" fill="#3B82F6" name="Hours" />
                  <Bar dataKey="tasksCompleted" fill="#10B981" name="Tasks" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button className="btn btn-primary" onClick={() => navigate('/tasks')}>
                ➕ Create New Task
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/chat')}>
                💬 Open Chat
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/calendar')}>
                📅 Schedule Meeting
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/projects')}>
                📁 View Projects
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <h3 className="card-title">Task Overview</h3>
          <button className="btn btn-secondary" onClick={() => navigate('/tasks')}>View All</button>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            <div className="metric">
              <div className="metric-value">{stats?.tasks?.total || 0}</div>
              <div className="metric-label">Total Tasks</div>
            </div>
            <div className="metric">
              <div className="metric-value">{stats?.tasks?.pending || 0}</div>
              <div className="metric-label">To Do</div>
            </div>
            <div className="metric">
              <div className="metric-value">{stats?.tasks?.inProgress || 0}</div>
              <div className="metric-label">In Progress</div>
            </div>
            <div className="metric">
              <div className="metric-value">{stats?.tasks?.completed || 0}</div>
              <div className="metric-label">Done</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;