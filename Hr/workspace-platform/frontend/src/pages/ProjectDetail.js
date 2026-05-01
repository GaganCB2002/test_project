import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await api.get(`/projects/${id}`);
      setProject(response.data.project);
      setTasks(response.data.tasks);
    } catch (error) {
      console.error('Failed to fetch project');
    } finally {
      setLoading(false);
    }
  };

  const columns = ['To Do', 'In Progress', 'Review', 'Done'];
  const getColumnTasks = (column) => tasks.filter(t => t.column === column);

  if (loading) {
    return <div className="loading-spinner"><div className="spinner"></div></div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 className="page-title">{project?.name}</h1>
          <p style={{ color: '#6B7280' }}>{project?.description}</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate(`/projects/${id}/task/new`)}>
          ➕ Add Task
        </button>
      </div>

      <div className="kanban-board">
        {columns.map(column => (
          <div key={column} className="kanban-column">
            <div className="kanban-column-header">
              <div className="kanban-column-title">
                <span>{column}</span>
                <span className="kanban-column-count">{getColumnTasks(column).length}</span>
              </div>
            </div>
            {getColumnTasks(column).map(task => (
              <div key={task._id} className="kanban-card" onClick={() => navigate(`/tasks/${task._id}`)}>
                <div className="kanban-card-title">{task.title}</div>
                <div className="kanban-card-meta">
                  <span>{task.priority}</span>
                  {task.dueDate && <span>📅 {new Date(task.dueDate).toLocaleDateString()}</span>}
                </div>
                <div className="kanban-card-meta" style={{ marginTop: '8px' }}>
                  <div className="avatar-group">
                    {task.assignedTo?.slice(0, 2).map((user, idx) => (
                      <div key={idx} className="avatar" style={{ width: '24px', height: '24px', fontSize: '0.625rem' }}>
                        {user?.firstName?.[0]}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectDetail;