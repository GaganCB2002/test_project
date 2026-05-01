import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import './Layout.css';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { unreadCount } = useNotificationStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', icon: '📊', label: 'Dashboard' },
    { path: '/workspaces', icon: '🏢', label: 'Workspaces' },
    { path: '/projects', icon: '📁', label: 'Projects' },
    { path: '/tasks', icon: '✅', label: 'Tasks' },
    { path: '/chat', icon: '💬', label: 'Chat' },
    { path: '/calendar', icon: '📅', label: 'Calendar' },
    { path: '/analytics', icon: '📈', label: 'Analytics' },
    { path: '/leave', icon: '🏖️', label: 'Leave' },
    { path: '/team', icon: '👥', label: 'Team' },
    { path: '/settings', icon: '⚙️', label: 'Settings' }
  ];

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">WorkSpace</div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">Main Menu</div>
            {navItems.slice(0, 5).map(item => (
              <div
                key={item.path}
                className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          <div className="nav-section">
            <div className="nav-section-title">Tools</div>
            {navItems.slice(5).map(item => (
              <div
                key={item.path}
                className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </nav>
        <div className="sidebar-footer">
          <div className="user-info" onClick={handleLogout}>
            <div className="avatar">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="user-details">
              <div className="user-name">{user?.firstName} {user?.lastName}</div>
              <div className="user-role">{user?.role}</div>
            </div>
          </div>
        </div>
      </aside>
      <main className="main-content">
        <header className="header">
          <div className="header-search">
            <span>🔍</span>
            <input type="text" placeholder="Search..." />
          </div>
          <div className="header-actions">
            <div className="header-icon" onClick={() => navigate('/chat')}>
              <span>💬</span>
              <span className="notification-badge"></span>
            </div>
            <div className="header-icon" onClick={() => navigate('/calendar')}>
              <span>📅</span>
            </div>
            <div className="header-icon" onClick={() => navigate('/')}>
              <span>🔔</span>
              {unreadCount > 0 && <span className="notification-badge"></span>}
            </div>
          </div>
        </header>
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;