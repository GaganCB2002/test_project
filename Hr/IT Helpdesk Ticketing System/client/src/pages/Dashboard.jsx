import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Ticket, Clock, CheckCircle, XCircle, AlertTriangle,
  Monitor, Users, TrendingUp, ArrowUpRight, ArrowDownRight,
  Plus, ChevronRight
} from 'lucide-react';
import { fetchTicketStats } from '../redux/slices/ticketSlice';
import { fetchAssetStats } from '../redux/slices/assetSlice';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { stats: ticketStats } = useSelector((state) => state.tickets);
  const { stats: assetStats } = useSelector((state) => state.assets);
  const { mode } = useSelector((state) => state.theme);

  useEffect(() => {
    dispatch(fetchTicketStats());
    dispatch(fetchAssetStats());
  }, [dispatch]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const kpiCards = [
    { title: 'Total Tickets', value: ticketStats?.total || 0, icon: Ticket, color: 'from-primary-500 to-primary-600', trend: '+12%' },
    { title: 'Open Tickets', value: ticketStats?.open || 0, icon: Clock, color: 'from-amber-500 to-amber-600', trend: '-5%' },
    { title: 'Resolved', value: ticketStats?.resolved || 0, icon: CheckCircle, color: 'from-emerald-500 to-emerald-600', trend: '+23%' },
    { title: 'Avg Resolution', value: `${ticketStats?.avgResolutionTime || 0}h`, icon: TrendingUp, color: 'from-blue-500 to-blue-600', trend: '-15%' },
  ];

  const priorityData = ticketStats?.byPriority?.map(p => ({
    name: p._id.charAt(0).toUpperCase() + p._id.slice(1),
    value: p.count,
    color: p._id === 'critical' ? '#ef4444' : p._id === 'high' ? '#f97316' : p._id === 'medium' ? '#eab308' : '#22c55e'
  })) || [];

  const categoryData = ticketStats?.byCategory?.map(c => ({
    name: c._id.charAt(0).toUpperCase() + c._id.slice(1),
    value: c.count
  })) || [];

  const ticketTrends = [
    { name: 'Mon', tickets: 12, resolved: 8 },
    { name: 'Tue', tickets: 19, resolved: 15 },
    { name: 'Wed', tickets: 15, resolved: 12 },
    { name: 'Thu', tickets: 22, resolved: 18 },
    { name: 'Fri', tickets: 18, resolved: 20 },
    { name: 'Sat', tickets: 8, resolved: 6 },
    { name: 'Sun', tickets: 5, resolved: 4 },
  ];

  const recentTickets = [
    { id: 'TKT-001', title: 'Laptop screen flickering', status: 'open', priority: 'high', createdAt: '2h ago' },
    { id: 'TKT-002', title: 'VPN connection issues', status: 'in_progress', priority: 'medium', createdAt: '4h ago' },
    { id: 'TKT-003', title: 'Software installation request', status: 'resolved', priority: 'low', createdAt: '6h ago' },
    { id: 'TKT-004', title: 'Keyboard not working', status: 'open', priority: 'critical', createdAt: '1d ago' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back, {user?.name}</p>
        </div>
        <button
          onClick={() => navigate('/tickets')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20"
        >
          <Plus className="w-5 h-5" />
          New Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpiCards.map((card, index) => (
          <motion.div
            key={card.title}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.1 }}
            className={`p-5 rounded-2xl ${mode === 'dark' ? 'bg-dark-100/80 glass glass-border' : 'bg-white shadow-sm'}`}
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} shadow-lg`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <span className={`flex items-center gap-1 text-xs font-medium ${card.trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                {card.trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {card.trend}
              </span>
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">{card.value}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{card.title}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`lg:col-span-2 p-6 rounded-2xl ${mode === 'dark' ? 'bg-dark-100/80 glass glass-border' : 'bg-white shadow-sm'}`}
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Ticket Trends</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ticketTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke={mode === 'dark' ? '#1a1a24' : '#f1f5f9'} />
                <XAxis dataKey="name" stroke={mode === 'dark' ? '#64748b' : '#94a3b8'} fontSize={12} />
                <YAxis stroke={mode === 'dark' ? '#64748b' : '#94a3b8'} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: mode === 'dark' ? '#12121a' : '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }}
                />
                <Line type="monotone" dataKey="tickets" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary-500" />
              <span className="text-sm text-slate-500 dark:text-slate-400">Created</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-sm text-slate-500 dark:text-slate-400">Resolved</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`p-6 rounded-2xl ${mode === 'dark' ? 'bg-dark-100/80 glass glass-border' : 'bg-white shadow-sm'}`}
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">By Priority</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={priorityData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                  {priorityData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: mode === 'dark' ? '#12121a' : '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {priorityData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-slate-500 dark:text-slate-400">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`p-6 rounded-2xl ${mode === 'dark' ? 'bg-dark-100/80 glass glass-border' : 'bg-white shadow-sm'}`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Tickets</h3>
            <button onClick={() => navigate('/tickets')} className="text-sm text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1">
              View all <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {recentTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/tickets/${ticket.id}`)}
              >
                <div className={`w-2 h-2 rounded-full ${
                  ticket.priority === 'critical' ? 'bg-red-500' :
                  ticket.priority === 'high' ? 'bg-orange-500' :
                  ticket.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{ticket.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{ticket.id} · {ticket.createdAt}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                  ticket.status === 'open' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                  ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' :
                  ticket.status === 'resolved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                  'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}>
                  {ticket.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className={`p-6 rounded-2xl ${mode === 'dark' ? 'bg-dark-100/80 glass glass-border' : 'bg-white shadow-sm'}`}
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Asset Overview</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className={`p-4 rounded-xl ${mode === 'dark' ? 'bg-dark-50' : 'bg-slate-50'}`}>
              <div className="flex items-center gap-3 mb-2">
                <Monitor className="w-5 h-5 text-primary-500" />
                <span className="text-sm text-slate-500 dark:text-slate-400">Total Assets</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{assetStats?.total || 0}</p>
            </div>
            <div className={`p-4 rounded-xl ${mode === 'dark' ? 'bg-dark-50' : 'bg-slate-50'}`}>
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-emerald-500" />
                <span className="text-sm text-slate-500 dark:text-slate-400">Assigned</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{assetStats?.assigned || 0}</p>
            </div>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
                <XAxis dataKey="name" stroke={mode === 'dark' ? '#64748b' : '#94a3b8'} fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: mode === 'dark' ? '#12121a' : '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
