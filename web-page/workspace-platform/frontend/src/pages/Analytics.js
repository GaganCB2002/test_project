import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import api from '../services/api';

const Analytics = () => {
  const [taskAnalytics, setTaskAnalytics] = useState(null);
  const [teamData, setTeamData] = useState([]);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [tasksRes, trendsRes] = await Promise.all([
        api.get('/analytics/tasks'),
        api.get('/analytics/trends?days=14')
      ]);
      setTaskAnalytics(tasksRes.data);
      setTrends(trendsRes.data);
    } catch (error) {
      console.error('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  if (loading) {
    return <div className="loading-spinner"><div className="spinner"></div></div>;
  }

  const priorityData = taskAnalytics ? Object.entries(taskAnalytics.byPriority).map(([key, value]) => ({
    name: key,
    value
  })) : [];

  const statusData = taskAnalytics ? Object.entries(taskAnalytics.byStatus).map(([key, value]) => ({
    name: key.replace(/([A-Z])/g, ' $1').trim(),
    value
  })) : [];

  return (
    <div>
      <h1 className="page-title">Analytics</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#DBEAFE' }}>📊</div>
          <div className="stat-card-value">{taskAnalytics?.total || 0}</div>
          <div className="stat-card-label">Total Tasks</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#D1FAE5' }}>✅</div>
          <div className="stat-card-value">{taskAnalytics?.completionRate || 0}%</div>
          <div className="stat-card-label">Completion Rate</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#FEF3C7' }}>🔥</div>
          <div className="stat-card-value">{taskAnalytics?.byPriority?.urgent || 0}</div>
          <div className="stat-card-label">Urgent Tasks</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#FEE2E2' }}>⚠️</div>
          <div className="stat-card-value">{taskAnalytics?.byStatus?.inProgress || 0}</div>
          <div className="stat-card-label">In Progress</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Tasks by Priority</h3>
          </div>
          <div className="card-body">
            <div style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, value}) => `${name}: ${value}`}
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Tasks by Status</h3>
          </div>
          <div className="card-body">
            <div style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <h3 className="card-title">Productivity Trends</h3>
        </div>
        <div className="card-body">
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(val) => val.slice(5)} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="hours" stroke="#3B82F6" strokeWidth={2} name="Hours" />
                <Line yAxisId="right" type="monotone" dataKey="tasksCompleted" stroke="#10B981" strokeWidth={2} name="Tasks Completed" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;