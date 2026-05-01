import { motion } from 'framer-motion'
import { 
  Briefcase, 
  Users, 
  TrendingUp, 
  Zap, 
  Target, 
  BarChart3,
  Network,
  Rocket,
  ShieldCheck,
  Globe,
  ArrowRight
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { MarketingNavbar } from '../../components/layout/MarketingNavbar'

export function SolutionsPage() {
  const navigate = useNavigate()
  
  const solutions = [
    {
      title: "Enterprise HR Management",
      icon: ShieldCheck,
      desc: "Comprehensive lifecycle management for large-scale organizations. Automate recruitment, leave management, and compliance with high-performance precision.",
      useCase: "Scale your workforce from 100 to 10,000+ with zero administrative friction."
    },
    {
      title: "Technical Workforce Optimization",
      icon: Rocket,
      desc: "Specialized tools for engineering-heavy teams. Integrate Git telemetry and velocity metrics directly into your performance reviews.",
      useCase: "Bridge the gap between engineering output and HR performance signals."
    },
    {
      title: "Global Team Collaboration",
      icon: Globe,
      desc: "Unified communication for distributed workforces. Break down siloes with real-time sync across borders and time zones.",
      useCase: "Ensure consistent culture and communication for 24/7 global operations."
    },
    {
      title: "Strategic Talent Acquisition",
      icon: Target,
      desc: "AI-assisted recruitment pipeline that identifies high-intent candidates and optimizes the interview-to-hire ratio.",
      useCase: "Reduce time-to-hire by 40% using predictive candidate matching."
    }
  ]

  return (
    <div className="min-h-screen bg-luxury-black text-white selection:bg-luxury-blue/30 font-sans">
      <MarketingNavbar />
      
      <section className="pt-40 pb-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-luxury-blue mb-8">Strategic Impact</p>
              <h1 className="text-6xl lg:text-8xl font-display font-black tracking-tighter uppercase italic mb-10">Modern <br /> <span className="text-luxury-blue">Solutions.</span></h1>
              <p className="text-xl text-slate-400 font-medium leading-relaxed">Tailored ecosystems designed to solve the most complex organizational challenges in the digital age.</p>
            </motion.div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="h-40 bg-white/5 border border-white/5 rounded-[40px] flex items-center justify-center">
                  <Network className="text-luxury-blue h-10 w-10 opacity-50" />
                </div>
                <div className="h-64 bg-luxury-blue rounded-[40px] p-8 flex flex-col justify-end">
                   <p className="text-4xl font-black italic">45%</p>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">Efficiency Gain</p>
                </div>
              </div>
              <div className="space-y-4 pt-12">
                <div className="h-64 bg-white/10 rounded-[40px] p-8 flex flex-col justify-end">
                   <p className="text-4xl font-black italic">12k+</p>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Users Synced</p>
                </div>
                <div className="h-40 bg-white/5 border border-white/5 rounded-[40px] flex items-center justify-center">
                  <TrendingUp className="text-luxury-accent h-10 w-10 opacity-50" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {solutions.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-12 bg-white/5 border border-white/5 rounded-[64px] hover:bg-white/10 transition-all group"
              >
                <div className="flex items-start justify-between mb-10">
                  <div className="h-16 w-16 rounded-[24px] bg-luxury-blue/10 flex items-center justify-center text-luxury-blue group-hover:scale-110 transition-transform">
                    <s.icon size={32} />
                  </div>
                  <ArrowRight size={24} className="text-slate-700 group-hover:text-luxury-blue transition-colors" />
                </div>
                <h3 className="text-3xl font-bold mb-6 uppercase italic tracking-tight">{s.title}</h3>
                <p className="text-slate-400 mb-10 text-lg leading-relaxed">{s.desc}</p>
                
                <div className="p-6 bg-luxury-black/40 rounded-[32px] border border-white/5">
                   <p className="text-[10px] font-black uppercase tracking-widest text-luxury-blue mb-2">Primary Use Case</p>
                   <p className="text-sm font-bold text-slate-300 italic">"{s.useCase}"</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h2 className="text-4xl font-display font-black uppercase italic mb-16">Trusted by Industry Leaders</h2>
          <div className="flex flex-wrap justify-center gap-20 opacity-30">
            {['Vortex', 'Apex', 'Nova', 'Quantum', 'Elysium'].map(brand => (
              <span key={brand} className="text-3xl font-display font-black tracking-tighter uppercase italic">{brand}</span>
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
