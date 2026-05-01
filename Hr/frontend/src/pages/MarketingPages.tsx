import { motion } from 'framer-motion'
import {
  Users,
  TrendingUp,
  Target,
  Zap,
  Sparkles,
  ArrowUpRight,
  BrainCircuit,
  AlertCircle,
  CheckCircle2,
  Search,
  Mail,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
} from 'lucide-react'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { SectionCard } from '../components/ui/SectionCard'
import { MetricCard } from '../components/ui/MetricCard'

// Shared Data
const salesData = [
  { name: 'Mon', value: 4000 },
  { name: 'Tue', value: 3000 },
  { name: 'Wed', value: 5000 },
  { name: 'Thu', value: 2780 },
  { name: 'Fri', value: 1890 },
  { name: 'Sat', value: 2390 },
  { name: 'Sun', value: 3490 },
]

const forecastData = [
  { month: 'May', predicted: 4500000, actual: 4200000 },
  { month: 'Jun', predicted: 5200000, actual: null },
  { month: 'Jul', predicted: 6100000, actual: null },
  { month: 'Aug', predicted: 5800000, actual: null },
]

const segmentData = [
  { name: 'High Prob', value: 400, color: '#0ea5e9' },
  { name: 'Medium Prob', value: 300, color: '#8b5cf6' },
  { name: 'Low Prob', value: 200, color: '#f43f5e' },
]

// Components
const InsightCard = ({ title, content, type }: { title: string; content: string; type: 'success' | 'warning' | 'info' }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className={`p-6 rounded-2xl border ${
      type === 'success' ? 'bg-emerald-50/50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900/20' : 
      type === 'warning' ? 'bg-amber-50/50 border-amber-100 dark:bg-amber-900/10 dark:border-amber-900/20' :
      'bg-brand/5 border-brand/10 dark:bg-brand/10 dark:border-brand/20'
    }`}
  >
    <div className="flex items-start space-x-4">
      <div className={`p-2 rounded-lg ${
        type === 'success' ? 'bg-emerald-100 text-emerald-600' : 
        type === 'warning' ? 'bg-amber-100 text-amber-600' :
        'bg-brand/10 text-brand'
      }`}>
        {type === 'success' ? <CheckCircle2 size={20} /> : type === 'warning' ? <AlertCircle size={20} /> : <Zap size={20} />}
      </div>
      <div>
        <h4 className="font-bold text-sm mb-1">{title}</h4>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{content}</p>
      </div>
    </div>
  </motion.div>
)

export function MarketingDashboard() {
  return (
    <div className="space-y-4">
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard metric={{ id: 'leads', label: 'Total Leads', value: '1,284', delta: '+12.5%', tone: 'positive' }} />
        <MetricCard metric={{ id: 'campaigns', label: 'Active Campaigns', value: '12', delta: '+3 new', tone: 'positive' }} />
        <MetricCard metric={{ id: 'revenue', label: 'Revenue Momentum', value: '₹45.2L', delta: '+8.2%', tone: 'positive' }} />
        <MetricCard metric={{ id: 'ai-score', label: 'Avg. AI Lead Score', value: '78/100', delta: 'High precision', tone: 'neutral' }} />
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Revenue Momentum" subtitle="Weekly performance tracking and AI forecasting." className="lg:col-span-2">
           <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f766e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0f766e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#0f766e" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Live Intelligence" subtitle="Real-time marketing signals.">
          <div className="space-y-6 overflow-y-auto max-h-80 pr-2">
            {[
              { type: 'Lead', user: 'Emma', action: 'added a new lead', target: 'Acme Corp', time: '2m ago' },
              { type: 'Deal', user: 'John', action: 'moved deal to', target: 'Proposal', time: '15m ago' },
              { type: 'Campaign', user: 'AI', action: 'generated content for', target: 'Email Blast', time: '1h ago' },
              { type: 'System', user: 'System', action: 'synced', target: '248 leads', time: '2h ago' },
            ].map((activity, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className={`mt-1 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                  activity.type === 'Lead' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'Deal' ? 'bg-emerald-100 text-emerald-600' :
                  activity.type === 'Campaign' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-600'
                }`}>
                  {activity.type[0]}
                </div>
                <div>
                  <p className="text-xs">
                    <span className="font-bold text-slate-900">{activity.user}</span> {activity.action} <span className="text-brand font-bold">{activity.target}</span>
                  </p>
                  <p className="text-[10px] text-slate-400 uppercase mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="glass-panel p-6 bg-gradient-to-br from-brand/5 to-purple-500/5 border-brand/20">
          <div className="flex items-center space-x-3 mb-4">
            <Sparkles className="text-brand h-5 w-5" />
            <h3 className="font-bold text-slate-900">Strategic Recommendation</h3>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            "Based on current trends, shifting 15% of your social media budget to email remarketing could increase high-intent lead volume by 22% next month."
          </p>
          <button className="mt-6 text-xs font-bold text-brand hover:underline flex items-center space-x-1">
            <span>Execute Strategy</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

        <div className="glass-panel p-6">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="text-emerald-600 h-5 w-5" />
            <h3 className="font-bold text-slate-900">Revenue Forecast</h3>
          </div>
          <div className="flex items-baseline space-x-2 mb-4">
            <span className="text-3xl font-black tracking-tighter">₹52,40,000</span>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">+14% Predicted</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '85%' }} />
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Confidence Level: 92%</p>
        </div>
      </div>
    </div>
  )
}

export function SalesPipeline() {
  return (
    <div className="space-y-4">
      <SectionCard title="Sales Pipeline" subtitle="Manage deals and lead flow with AI scoring.">
        <div className="grid gap-4 md:grid-cols-4">
          {['Prospecting', 'Qualified', 'Proposal', 'Negotiation'].map((stage) => (
            <div key={stage} className="space-y-3">
              <div className="flex items-center justify-between px-2">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">{stage}</h4>
                <span className="text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded-full">3</span>
              </div>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="glass-panel p-4 cursor-pointer hover:border-brand/40 transition">
                    <p className="font-bold text-sm text-slate-900">Enterprise Deal #{i}</p>
                    <p className="text-xs text-slate-500 mt-1">₹{Math.floor(Math.random() * 10)}L • Acme Corp</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Zap size={12} className="text-amber-500" />
                        <span className="text-[10px] font-bold text-amber-600">{70 + Math.floor(Math.random() * 20)}</span>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

export function AIInsights() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Revenue Forecasting" subtitle="Predictive models with 94% accuracy." className="lg:col-span-2">
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip />
                <Bar dataKey="actual" fill="#0f766e" radius={[4, 4, 0, 0]} name="Actual Revenue" />
                <Bar dataKey="predicted" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="AI Prediction" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Lead Probability" subtitle="Sentiment and intent analysis.">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={segmentData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
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
              <div key={s.name} className="flex justify-between items-center text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-slate-500 font-medium">{s.name}</span>
                </div>
                <span className="font-bold">{s.value} leads</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <InsightCard 
          title="Campaign Optimization" 
          content="Your 'Summer Sale' email campaign has a 25% higher open rate on Tuesdays between 10 AM and 11 AM."
          type="success"
        />
        <InsightCard 
          title="Churn Alert" 
          content="3 enterprise leads in the 'Negotiation' stage haven't been contacted in over 7 days."
          type="warning"
        />
        <InsightCard 
          title="Strategic Recommendation" 
          content="Increasing social media spend by 15% is projected to increase lead volume by 40%."
          type="info"
        />
      </div>
    </div>
  )
}
