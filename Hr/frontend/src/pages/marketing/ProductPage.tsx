import { motion } from 'framer-motion'
import { 
  Cpu, 
  ShieldCheck, 
  Globe, 
  Zap, 
  ZapOff, 
  BarChart3, 
  Users, 
  Clock, 
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Play
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { MarketingNavbar } from '../../components/layout/MarketingNavbar'

export function ProductPage() {
  const navigate = useNavigate()
  
  return (
    <div className="min-h-screen bg-luxury-black text-white selection:bg-luxury-blue/30 overflow-x-hidden font-sans">
      <MarketingNavbar />
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-luxury-blue/10 border border-luxury-blue/20 text-[10px] font-black uppercase tracking-[0.4em] text-luxury-blue mb-8">
              Technical Specification
            </div>
            <h1 className="text-6xl lg:text-8xl font-display font-black tracking-tighter leading-[0.9] uppercase mb-8 italic">
              The OS for <br />
              <span className="text-luxury-blue">Enterprise.</span>
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed mb-10 font-medium">
              AuraHR is not just a platform; it's a precision-engineered operating system for your workforce. Built on a foundation of real-time telemetry and AI-driven behavioral science.
            </p>
            <div className="flex gap-6">
              <button onClick={() => navigate('/login')} className="px-10 py-4 bg-luxury-blue rounded-full font-black text-xs uppercase tracking-widest shadow-xl shadow-luxury-blue/20 hover:scale-105 transition-transform">
                Get Started
              </button>
              <button className="px-10 py-4 bg-white/5 border border-white/10 rounded-full font-black text-xs uppercase tracking-widest hover:bg-white/10 transition flex items-center gap-2">
                <Play size={14} fill="white" /> View Specs
              </button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="glass-panel p-4 rounded-[40px] border-white/10 bg-white/5 shadow-premium">
              <img src="/hero-product.png" alt="Dashboard" className="rounded-[32px] w-full" />
            </div>
            {/* Floating Stats */}
            <div className="absolute -top-10 -right-10 glass-panel p-6 rounded-3xl bg-luxury-blue/80 backdrop-blur-xl border-white/20 shadow-2xl">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">System Uptime</p>
              <p className="text-2xl font-black italic">99.999%</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="py-32 px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
             <h2 className="text-5xl font-display font-black uppercase italic mb-6">Modular Architecture</h2>
             <p className="text-slate-400 max-w-2xl mx-auto">Scalable components designed to integrate seamlessly into your existing infrastructure.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Core Telemetry', icon: Cpu, desc: 'Real-time monitoring of system load, employee activity, and productivity metrics.' },
              { title: 'Neural Insights', icon: Zap, desc: 'AI-driven predictive modeling for attrition risk and performance optimization.' },
              { title: 'Global Sync', icon: Globe, desc: 'Seamless synchronization across distributed teams and time zones.' },
              { title: 'Military-Grade Security', icon: ShieldCheck, desc: 'Advanced RBAC and encryption protocols for total data sovereignty.' },
              { title: 'Live Collaboration', icon: Users, desc: 'Integrated chat, mail, and video conferencing in a single unified interface.' },
              { title: 'Agile Projects', icon: BarChart3, desc: 'Dynamic task management with real-time progress tracking and velocity analytics.' },
            ].map((m, i) => (
              <motion.div 
                key={m.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-10 bg-white/5 border border-white/5 rounded-[40px] hover:bg-white/10 transition-all group"
              >
                <div className="h-14 w-14 rounded-2xl bg-luxury-blue/10 flex items-center justify-center mb-8 text-luxury-blue group-hover:scale-110 transition-transform">
                  <m.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-4 uppercase italic tracking-tight">{m.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed group-hover:text-slate-400 transition-colors">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-8 border-t border-white/5 bg-luxury-black text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700">© 2026 AuraHR Global • Engineered for Perfection</p>
      </footer>
    </div>
  )
}
