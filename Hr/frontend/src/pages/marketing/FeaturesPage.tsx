import { motion } from 'framer-motion'
import { 
  MessageSquare, 
  Mail, 
  Monitor, 
  Bell, 
  ShieldCheck, 
  LayoutDashboard, 
  Zap, 
  Cpu, 
  Target,
  Search,
  Lock,
  ArrowRight
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { MarketingNavbar } from '../../components/layout/MarketingNavbar'

export function FeaturesPage() {
  const navigate = useNavigate()
  
  const features = [
    {
      title: "Real-time Communication",
      icon: MessageSquare,
      desc: "Instant one-to-one and group messaging powered by Socket.io for zero-latency collaboration.",
      details: ["Typing indicators", "Read receipts", "Media sharing", "Encrypted history"]
    },
    {
      title: "Internal Mail System",
      icon: Mail,
      desc: "A secure, isolated email ecosystem for formal corporate communication without external noise.",
      details: ["Threaded conversations", "Attachment support", "Departmental filters", "Auto-archiving"]
    },
    {
      title: "High-Def Meetings",
      icon: Monitor,
      desc: "WebRTC-powered video conferencing with screen sharing and automated session intelligence.",
      details: ["Low-latency streaming", "Virtual backgrounds", "Meeting recording", "Live transcription"]
    },
    {
      title: "Intelligent Notifications",
      icon: Bell,
      desc: "Context-aware alert system that filters noise and prioritizes critical business events.",
      details: ["Priority levels", "Desktop push", "Custom triggers", "Notification history"]
    },
    {
      title: "Role-Based Hubs",
      icon: ShieldCheck,
      desc: "Dedicated, purpose-built interfaces for HR, Managers, Tech Leads, and Employees.",
      details: ["Custom permissions", "Departmental views", "Executive summaries", "Self-service portals"]
    },
    {
      title: "Analysis Engine",
      icon: Cpu,
      desc: "Deep-dive performance analytics with real-time telemetry from engineering and operations.",
      details: ["Velocity tracking", "Attrition prediction", "Skill mapping", "Gap analysis"]
    }
  ]

  return (
    <div className="min-h-screen bg-luxury-black text-white selection:bg-luxury-blue/30 font-sans">
      <MarketingNavbar />
      
      <section className="pt-40 pb-20 px-8">
        <div className="max-w-7xl mx-auto text-center mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-luxury-blue mb-8">Capabilities</p>
            <h1 className="text-6xl lg:text-8xl font-display font-black tracking-tighter uppercase italic mb-10">Feature <span className="text-luxury-blue">Stack.</span></h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">A comprehensive suite of tools engineered for the highest tier of organizational performance.</p>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-10 bg-white/5 border border-white/5 rounded-[48px] hover:bg-white/10 transition-all group relative overflow-hidden"
            >
              <div className="h-16 w-16 rounded-[24px] bg-luxury-blue/10 flex items-center justify-center mb-8 text-luxury-blue group-hover:scale-110 transition-transform">
                <f.icon size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 uppercase italic">{f.title}</h3>
              <p className="text-slate-500 mb-8 leading-relaxed font-medium">{f.desc}</p>
              
              <ul className="space-y-3 mb-8">
                {f.details.map(d => (
                  <li key={d} className="flex items-center gap-3 text-xs font-bold text-slate-400">
                    <CheckCircle2 size={14} className="text-luxury-blue" />
                    {d}
                  </li>
                ))}
              </ul>
              
              <div className="h-[2px] w-full bg-gradient-to-r from-luxury-blue/50 to-transparent absolute bottom-0 left-0 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-40 bg-white/5 border-y border-white/5 px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2">
             <h2 className="text-5xl font-display font-black uppercase italic mb-8">Role-Based Intelligence</h2>
             <p className="text-xl text-slate-400 mb-12 leading-relaxed">AuraHR automatically adapts its interface based on the authenticated role, ensuring every team member has the exact tools they need, with zero clutter.</p>
             <button onClick={() => navigate('/login')} className="px-12 py-5 bg-luxury-blue rounded-full font-black text-xs uppercase tracking-widest shadow-2xl shadow-luxury-blue/30 hover:scale-105 transition-transform">
               Experience Role Hubs
             </button>
          </div>
          <div className="lg:w-1/2 grid grid-cols-2 gap-6">
             {[
               { role: 'HR Admin', icon: ShieldCheck, color: 'text-rose-500' },
               { role: 'Tech Lead', icon: Cpu, color: 'text-indigo-500' },
               { role: 'Manager', icon: Target, color: 'text-emerald-500' },
               { role: 'Employee', icon: Users, color: 'text-blue-500' },
             ].map(r => (
               <div key={r.role} className="p-8 bg-luxury-black rounded-[40px] border border-white/5 flex flex-col items-center text-center">
                  <r.icon className={`h-8 w-8 mb-4 ${r.color}`} />
                  <span className="text-sm font-black uppercase tracking-widest">{r.role}</span>
               </div>
             ))}
          </div>
        </div>
      </section>

      <footer className="py-20 px-8 bg-luxury-black text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700">© 2026 AuraHR Global • Engineered for Perfection</p>
      </footer>
    </div>
  )
}
