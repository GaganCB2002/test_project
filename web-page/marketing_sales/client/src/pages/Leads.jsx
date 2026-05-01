import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Mail, 
  Phone, 
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  Download
} from 'lucide-react';
import { exportToCSV } from '../utils/export';

const leadsData = [
  { id: 1, name: 'John Cooper', email: 'john@techflow.com', company: 'TechFlow Inc.', status: 'Qualified', score: 92, source: 'Website' },
  { id: 2, name: 'Sarah Miller', email: 'sarah@brightlink.io', company: 'BrightLink', status: 'New', score: 45, source: 'Referral' },
  { id: 3, name: 'Michael Chen', email: 'mchen@global.com', company: 'Global Logistics', status: 'Contacted', score: 78, source: 'Social Media' },
  { id: 4, name: 'Emma Wilson', email: 'emma@creative.co', company: 'Creative Co.', status: 'Converted', score: 98, source: 'Email Campaign' },
  { id: 5, name: 'David Brown', email: 'dbrown@nexus.com', company: 'Nexus Soft', status: 'Lost', score: 12, source: 'Advertisement' },
  { id: 6, name: 'Lisa Ray', email: 'lisa@future.ai', company: 'Future AI', status: 'Qualified', score: 85, source: 'Website' },
];

const StatusBadge = ({ status }) => {
  const styles = {
    New: 'bg-blue-50 text-blue-600 dark:bg-blue-900/10 dark:text-blue-400',
    Contacted: 'bg-amber-50 text-amber-600 dark:bg-amber-900/10 dark:text-amber-400',
    Qualified: 'bg-purple-50 text-purple-600 dark:bg-purple-900/10 dark:text-purple-400',
    Converted: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/10 dark:text-emerald-400',
    Lost: 'bg-rose-50 text-rose-600 dark:bg-rose-900/10 dark:text-rose-400',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
};

const ScoreBadge = ({ score }) => {
  const color = score > 80 ? 'text-emerald-500' : score > 50 ? 'text-amber-500' : 'text-rose-500';
  return (
    <div className="flex items-center space-x-1">
      <Sparkles size={14} className={color} />
      <span className={`font-bold ${color}`}>{score}</span>
    </div>
  );
};

const Leads = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLead, setNewLead] = useState({ name: '', email: '', company: '', status: 'New', source: 'Website' });

  const handleAddLead = async (e) => {
    e.preventDefault();
    try {
      // In a real app: await api.post('/leads', newLead);
      console.log('Lead added:', newLead);
      setIsModalOpen(false);
      alert('Lead added successfully (Mock Mode)');
    } catch (err) {
      alert('Failed to add lead');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Lead Management</h1>
          <p className="text-slate-500">Track and manage your sales prospects with AI insights.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add New Lead</span>
        </button>
      </div>

      {/* ... table content remains same ... */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white/50 dark:bg-slate-800/50">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search leads..." 
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => exportToCSV(leadsData, 'leads_report')}
              className="flex items-center space-x-2 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              <Download size={16} className="text-slate-500" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Lead Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">AI Score</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {leadsData.map((lead) => (
                <motion.tr key={lead.id} whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
                  <td className="px-6 py-4">
                    <p className="font-semibold">{lead.name}</p>
                    <p className="text-xs text-slate-500">{lead.company}</p>
                  </td>
                  <td className="px-6 py-4"><StatusBadge status={lead.status} /></td>
                  <td className="px-6 py-4"><ScoreBadge score={lead.score} /></td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-600"><MoreHorizontal size={18} /></button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Lead Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card w-full max-w-md p-8 relative z-[101]"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Add New Lead</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddLead} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                    value={newLead.name}
                    onChange={(e) => setNewLead({...newLead, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                  <input 
                    required
                    type="email" 
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                    value={newLead.email}
                    onChange={(e) => setNewLead({...newLead, email: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Company</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                    value={newLead.company}
                    onChange={(e) => setNewLead({...newLead, company: e.target.value})}
                  />
                </div>
                <button type="submit" className="w-full btn-primary py-3 mt-4">
                  Create Lead
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Leads;
