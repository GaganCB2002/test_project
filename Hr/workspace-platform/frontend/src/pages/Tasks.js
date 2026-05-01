import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Tasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="page-title">Tasks</h1>
        <button className="btn btn-primary" onClick={() => navigate('/tasks/new')}>
          ➕ Create Task
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', gap: '8px' }}>
            {['all', 'todo', 'in-progress', 'review', 'done'].map(f => (
              <button
                key={f}
                className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilter(f)}
                style={{ textTransform: 'capitalize' }}
              >
                {f === 'all' ? 'All' : f.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="loading-spinner"><div className="spinner"></div></div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Project</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th>Assigned</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map(task => (
                  <tr key={task._id} onClick={() => navigate(`/tasks/${task._id}`)} style={{ cursor: 'pointer' }}>
                    <td><strong>{task.title}</strong></td>
                    <td>{task.project?.name || '-'}</td>
                    <td>
                      <span className={`badge badge-${task.priority === 'urgent' ? 'danger' : task.priority === 'high' ? 'warning' : 'primary'}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${task.status === 'done' ? 'success' : 'warning'}`}>
                        {task.status}
                      </span>
                    </td>
                    <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</td>
                    <td>
                      <div className="avatar-group">
                        {task.assignedTo?.slice(0, 2).map((user, idx) => (
                          <div key={idx} className="avatar" style={{ width: '28px', height: '28px', fontSize: '0.75rem' }}>
                            {user?.firstName?.[0]}
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;