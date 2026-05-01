import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MoreHorizontal, 
  Plus, 
  Clock, 
  IndianRupee, 
  User,
  LayoutGrid,
  List
} from 'lucide-react';

const columns = [
  { id: 'prospecting', title: 'Prospecting', color: 'blue' },
  { id: 'qualification', title: 'Qualification', color: 'purple' },
  { id: 'proposal', title: 'Proposal', color: 'amber' },
  { id: 'negotiation', title: 'Negotiation', color: 'orange' },
  { id: 'closed', title: 'Closed Won', color: 'emerald' },
];

const deals = [
  { id: 1, title: 'Enterprise Cloud Migration', company: 'Global Tech', amount: '₹45,00,000', column: 'proposal', owner: 'John C.', daysLeft: 5 },
  { id: 2, title: 'AI Integration Service', company: 'BrightLink', amount: '₹12,00,000', column: 'prospecting', owner: 'Sarah M.', daysLeft: 12 },
  { id: 3, title: 'Security Audit', company: 'Nexus Soft', amount: '₹8,50,000', column: 'qualification', owner: 'Michael C.', daysLeft: 3 },
  { id: 4, title: 'Mobile App Development', company: 'Creative Co.', amount: '₹25,00,000', column: 'negotiation', owner: 'Emma W.', daysLeft: 2 },
  { id: 5, title: 'Data Analytics Platform', company: 'Future AI', amount: '₹60,00,000', column: 'closed', owner: 'Lisa R.', daysLeft: 0 },
];

const DealCard = ({ deal }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ y: -2 }}
    className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mb-3 cursor-grab active:cursor-grabbing"
  >
    <div className="flex justify-between items-start mb-2">
      <h4 className="font-bold text-sm leading-tight">{deal.title}</h4>
      <button className="text-slate-400 hover:text-slate-600">
        <MoreHorizontal size={14} />
      </button>
    </div>
    <p className="text-xs text-slate-500 mb-4">{deal.company}</p>
    
    <div className="flex justify-between items-center mt-4">
      <div className="flex items-center space-x-1 text-primary-600">
        <IndianRupee size={12} />
        <span className="text-sm font-bold">{deal.amount}</span>
      </div>
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1 text-slate-400">
          <Clock size={12} />
          <span className="text-[10px] font-medium">{deal.daysLeft}d</span>
        </div>
        <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-500">
          {deal.owner.split(' ').map(n => n[0]).join('')}
        </div>
      </div>
    </div>
  </motion.div>
);

const SalesPipeline = () => {
  const [pipelineDeals, setPipelineDeals] = useState(deals);

  const moveDeal = (dealId, newStage) => {
    setPipelineDeals(prev => prev.map(d => 
      d.id === dealId ? { ...d, column: newStage } : d
    ));
    // In real app: await api.put(`/deals/${dealId}/stage`, { stage: newStage });
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Sales Pipeline</h1>
          <p className="text-slate-500">Track and forecast your revenue through the sales funnel.</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="btn-primary flex items-center space-x-2">
            <Plus size={20} />
            <span>New Deal</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex space-x-6 min-h-[600px] inline-flex pr-6">
          {columns.map((column) => (
            <div key={column.id} className="w-72 flex flex-col">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full bg-${column.color}-500 shadow-sm shadow-${column.color}-200`} />
                  <h3 className="font-bold text-sm uppercase tracking-wider">{column.title}</h3>
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-500 font-bold">
                    {pipelineDeals.filter(d => d.column === column.id).length}
                  </span>
                </div>
              </div>
              
              <div className="flex-1 bg-slate-100/50 dark:bg-slate-900/30 rounded-2xl p-3 border border-slate-200/50 dark:border-slate-800/50">
                {pipelineDeals.filter(d => d.column === column.id).map((deal) => (
                  <motion.div 
                    layout
                    key={deal.id}
                    className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mb-3"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-sm leading-tight">{deal.title}</h4>
                      <select 
                        value={deal.column}
                        onChange={(e) => moveDeal(deal.id, e.target.value)}
                        className="text-[10px] bg-slate-50 dark:bg-slate-900 border-none rounded p-0.5"
                      >
                        {columns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                      </select>
                    </div>
                    <p className="text-xs text-slate-500 mb-4">{deal.company}</p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm font-bold text-primary-600">{deal.amount}</span>
                      <div className="text-[10px] text-slate-400">{deal.owner}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesPipeline;
