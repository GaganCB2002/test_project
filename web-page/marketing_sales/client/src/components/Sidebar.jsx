import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Target, 
  BarChart3, 
  Mail, 
  MessageSquare, 
  Settings, 
  LogOut,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { logout, user } = useAuth();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
    { icon: <Users size={20} />, label: 'Leads', path: '/leads' },
    { icon: <Target size={20} />, label: 'Campaigns', path: '/campaigns' },
    { icon: <BarChart3 size={20} />, label: 'Sales Pipeline', path: '/sales' },
    { icon: <Mail size={20} />, label: 'Email Automation', path: '/email' },
    { icon: <MessageSquare size={20} />, label: 'Team Chat', path: '/chat' },
    { icon: <Sparkles size={20} />, label: 'AI Insights', path: '/ai-insights' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
  ];

  return (
    <motion.div 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 h-screen glass-card rounded-none border-r border-slate-200 dark:border-slate-800 flex flex-col p-4 fixed left-0 top-0 z-50"
    >
      <div className="flex items-center space-x-3 px-4 py-6">
        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-200 dark:shadow-primary-900/20">
          <Sparkles size={24} />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
          Vortex AI
        </span>
      </div>

      <nav className="flex-1 space-y-2 mt-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `sidebar-item ${isActive ? 'sidebar-item-active' : ''}`
            }
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2">
        <button 
          onClick={() => window.location.href = 'http://127.0.0.1:3000/dashboard'}
          className="sidebar-item w-full text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/10 mb-2"
        >
          <LayoutDashboard size={20} />
          <span className="font-bold text-xs uppercase tracking-wider">HR Portal</span>
        </button>

        <div className="px-4 py-3 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-500">
                {user?.name?.charAt(0) || 'U'}
              </div>
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold truncate">{user?.name || 'Guest User'}</p>
            <p className="text-xs text-slate-500 truncate">{user?.role || 'Viewer'}</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="sidebar-item w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
