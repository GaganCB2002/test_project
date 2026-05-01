import React from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Mail, 
  Share2, 
  MousePointer2, 
  BarChart3, 
  Calendar,
  MoreVertical,
  ArrowUpRight
} from 'lucide-react';

const campaigns = [
  { 
    id: 1, 
    name: 'Summer Sale 2024', 
    type: 'Email', 
    status: 'Active', 
    budget: '₹5,00,000', 
    spent: '₹2,45,000', 
    reach: '12.5k', 
    conversions: 450,
    progress: 49,
    color: 'primary'
  },
  { 
    id: 2, 
    name: 'Social Media Blast', 
    type: 'Social', 
    status: 'Planned', 
    budget: '₹2,00,000', 
    spent: '₹0', 
    reach: '0', 
    conversions: 0,
    progress: 0,
    color: 'purple'
  },
  { 
    id: 3, 
    name: 'Retargeting Ads', 
    type: 'Ads', 
    status: 'Active', 
    budget: '₹10,00,000', 
    spent: '₹8,20,000', 
    reach: '45k', 
    conversions: 1200,
    progress: 82,
    color: 'emerald'
  },
  { 
    id: 4, 
    name: 'Product Launch v2', 
    type: 'Email', 
    status: 'Paused', 
    budget: '₹15,00,000', 
    spent: '₹5,00,000', 
    reach: '20k', 
    conversions: 300,
    progress: 33,
    color: 'amber'
  },
];

const CampaignCard = ({ campaign }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass-card p-6 flex flex-col h-full"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl bg-${campaign.color}-50 dark:bg-${campaign.color}-900/10 text-${campaign.color}-600`}>
        {campaign.type === 'Email' ? <Mail size={20} /> : campaign.type === 'Social' ? <Share2 size={20} /> : <MousePointer2 size={20} />}
      </div>
      <div className="flex items-center space-x-2">
        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
          campaign.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 
          campaign.status === 'Planned' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-600'
        }`}>
          {campaign.status}
        </span>
        <button className="p-1 text-slate-400 hover:text-slate-600">
          <MoreVertical size={16} />
        </button>
      </div>
    </div>

    <h3 className="text-lg font-bold mb-1">{campaign.name}</h3>
    <p className="text-xs text-slate-500 mb-6 flex items-center">
      <Calendar size={12} className="mr-1" /> Starts May 15, 2024
    </p>

    <div className="grid grid-cols-2 gap-4 mb-6">
      <div>
        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Reach</p>
        <p className="font-bold text-sm">{campaign.reach}</p>
      </div>
      <div>
        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Conversions</p>
        <p className="font-bold text-sm">{campaign.conversions}</p>
      </div>
    </div>

    <div className="mt-auto">
      <div className="flex justify-between items-end mb-2">
        <div>
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Budget Utilization</p>
          <p className="text-sm font-bold">{campaign.spent} <span className="text-slate-400 font-normal">of {campaign.budget}</span></p>
        </div>
        <p className="text-sm font-bold text-primary-600">{campaign.progress}%</p>
      </div>
      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${campaign.progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full bg-primary-600 rounded-full shadow-sm shadow-primary-200`}
        />
      </div>
    </div>
  </motion.div>
);

const Campaigns = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Campaign Management</h1>
          <p className="text-slate-500">Create, monitor, and optimize your marketing efforts.</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>New Campaign</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {campaigns.map((c) => (
          <CampaignCard key={c.id} campaign={c} />
        ))}
      </div>

      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold">Performance Analytics</h3>
          <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1 text-sm">
            <option>Last 30 Days</option>
            <option>Last 3 Months</option>
          </select>
        </div>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
           <div className="text-center">
             <BarChart3 size={40} className="mx-auto text-slate-300 mb-2" />
             <p className="text-slate-400 text-sm">Interactive analytics chart will be rendered here.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Campaigns;
