import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  Target,
  Zap,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const salesData = [
  { name: 'Mon', value: 4000 },
  { name: 'Tue', value: 3000 },
  { name: 'Wed', value: 5000 },
  { name: 'Thu', value: 2780 },
  { name: 'Fri', value: 1890 },
  { name: 'Sat', value: 2390 },
  { name: 'Sun', value: 3490 },
];

const KPICard = ({ title, value, change, icon, color }) => {
  const colorMap = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500'
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-card p-6"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${colorMap[color]} text-white shadow-lg`}>
          {icon}
        </div>
        <div className="flex items-center space-x-1 text-emerald-500 text-xs font-bold bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">
          <span>{change}</span>
          <ArrowUpRight size={14} />
        </div>
      </div>
      <div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-black mt-1 tracking-tight">{value}</h3>
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Vortex Intelligence Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Strategic intelligence and real-time performance tracking.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Total Leads" value="1,284" change="+12.5%" icon={<Users size={24} />} color="blue" />
        <KPICard title="Active Campaigns" value="12" change="+3" icon={<Target size={24} />} color="purple" />
        <KPICard title="Revenue" value="₹45,20,000" change="+8.2%" icon={<TrendingUp size={24} />} color="emerald" />
        <KPICard title="Avg. AI Score" value="78/100" change="+4" icon={<Zap size={24} />} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 glass-card p-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Revenue Momentum</h3>
              <p className="text-sm text-slate-500 font-medium">Weekly performance tracking</p>
            </div>
            <select className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold px-4 py-2 focus:ring-2 focus:ring-primary-500/20 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dx={-10} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px', 
                    border: '1px solid rgba(226, 232, 240, 0.5)', 
                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' 
                  }}
                  itemStyle={{ fontWeight: 700, color: '#1e40af' }}
                />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real-time Activity Feed */}
        <div className="glass-card p-8 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Live Intelligence</h3>
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-500/20" />
          </div>
          <div className="flex-1 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
            {[
              { type: 'Lead', user: 'Emma', action: 'added a new lead', target: 'Acme Corp', time: '2m ago' },
              { type: 'Deal', user: 'John', action: 'moved deal to', target: 'Proposal', time: '15m ago' },
              { type: 'Campaign', user: 'AI', action: 'generated content for', target: 'Email Blast', time: '1h ago' },
              { type: 'System', user: 'System', action: 'synced', target: '248 leads', time: '2h ago' },
            ].map((activity, i) => (
              <div key={i} className="flex items-start space-x-4 group cursor-pointer">
                <div className={`mt-1 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shadow-sm group-hover:scale-110 transition-transform ${
                  activity.type === 'Lead' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'Deal' ? 'bg-emerald-100 text-emerald-600' :
                  activity.type === 'Campaign' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-600'
                }`}>
                  {activity.type[0]}
                </div>
                <div>
                  <p className="text-sm font-medium leading-tight">
                    <span className="text-slate-900 dark:text-white font-black">{activity.user}</span> {activity.action} <span className="text-primary-600 dark:text-primary-400 font-black">{activity.target}</span>
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-2">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full py-4 mt-8 text-xs font-black text-slate-500 hover:text-primary-600 transition-colors border-t border-slate-100 dark:border-slate-800 uppercase tracking-widest">
            View All Insights
          </button>
        </div>
      </div>

      {/* AI Strategy & Forecasting Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-8 bg-gradient-to-br from-primary-500/5 to-purple-500/5 border-primary-500/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Sparkles size={80} />
          </div>
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg text-primary-600">
              <Sparkles size={20} />
            </div>
            <h3 className="text-lg font-bold">Strategic Recommendation</h3>
          </div>
          <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            "Based on current trends, shifting 15% of your social media budget to email remarketing could increase high-intent lead volume by 22% next month."
          </p>
          <div className="mt-8 flex items-center justify-between">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => <div key={i} className="w-9 h-9 rounded-full border-4 border-white dark:border-slate-800 bg-slate-200 shadow-sm" />)}
            </div>
            <button className="text-sm font-black text-primary-600 hover:underline flex items-center space-x-2">
              <span>Execute Strategy</span>
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>

        <div className="glass-card p-8 relative group">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600">
              <TrendingUp size={20} />
            </div>
            <h3 className="text-lg font-bold">Revenue Forecast</h3>
          </div>
          <div className="flex items-baseline space-x-3 mb-6">
            <span className="text-5xl font-black tracking-tighter">₹52,40,000</span>
            <span className="text-sm font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg">+14% Predicted</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 mb-2">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '85%' }}
              className="bg-emerald-500 h-3 rounded-full shadow-lg shadow-emerald-500/20" 
            />
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-500 font-black uppercase tracking-[0.2em]">Confidence Level: 92%</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
