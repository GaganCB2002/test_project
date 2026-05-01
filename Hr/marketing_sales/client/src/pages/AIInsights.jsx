import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  TrendingUp, 
  BrainCircuit, 
  AlertCircle,
  CheckCircle2,
  Zap,
  BarChart as BarChartIcon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const forecastData = [
  { month: 'May', predicted: 4500000, actual: 4200000 },
  { month: 'Jun', predicted: 5200000, actual: null },
  { month: 'Jul', predicted: 6100000, actual: null },
  { month: 'Aug', predicted: 5800000, actual: null },
];

const segmentData = [
  { name: 'High Prob', value: 400, color: '#0ea5e9' },
  { name: 'Medium Prob', value: 300, color: '#8b5cf6' },
  { name: 'Low Prob', value: 200, color: '#f43f5e' },
];

const InsightCard = ({ title, content, type }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className={`p-6 rounded-2xl border ${
      type === 'success' ? 'bg-emerald-50/50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900/20' : 
      type === 'warning' ? 'bg-amber-50/50 border-amber-100 dark:bg-amber-900/10 dark:border-amber-900/20' :
      'bg-primary-50/50 border-primary-100 dark:bg-primary-900/10 dark:border-primary-900/20'
    }`}
  >
    <div className="flex items-start space-x-4">
      <div className={`p-2 rounded-lg ${
        type === 'success' ? 'bg-emerald-100 text-emerald-600' : 
        type === 'warning' ? 'bg-amber-100 text-amber-600' :
        'bg-primary-100 text-primary-600'
      }`}>
        {type === 'success' ? <CheckCircle2 size={20} /> : type === 'warning' ? <AlertCircle size={20} /> : <Zap size={20} />}
      </div>
      <div>
        <h4 className="font-bold text-sm mb-1">{title}</h4>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{content}</p>
      </div>
    </div>
  </motion.div>
);

const AIInsights = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <h1 className="text-3xl font-bold">AI Intelligence</h1>
            <Sparkles className="text-primary-500 animate-pulse" size={24} />
          </div>
          <p className="text-slate-500">Predictive analytics and smart recommendations for your organization.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <TrendingUp className="text-primary-600" />
              <h3 className="font-bold">Revenue Forecasting</h3>
            </div>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-tighter">94% Accuracy</span>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip />
                <Bar dataKey="actual" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Actual Revenue" />
                <Bar dataKey="predicted" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="AI Prediction" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center space-x-3 mb-8">
            <BrainCircuit className="text-purple-600" />
            <h3 className="font-bold">Lead Probability</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={segmentData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {segmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {segmentData.map(s => (
              <div key={s.name} className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-xs text-slate-500">{s.name}</span>
                </div>
                <span className="text-xs font-bold">{s.value} leads</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InsightCard 
          title="Campaign Optimization" 
          content="Your 'Summer Sale' email campaign has a 25% higher open rate on Tuesdays between 10 AM and 11 AM. Consider rescheduling future blasts."
          type="success"
        />
        <InsightCard 
          title="Churn Alert" 
          content="3 enterprise leads in the 'Negotiation' stage haven't been contacted in over 7 days. High risk of losing momentum."
          type="warning"
        />
        <InsightCard 
          title="Strategic Recommendation" 
          content="Increasing social media spend by 15% is projected to increase lead volume by 40% based on current conversion trends."
          type="info"
        />
      </div>
    </div>
  );
};

export default AIInsights;
