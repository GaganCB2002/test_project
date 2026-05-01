import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Target, 
  BarChart3, 
  Activity, 
  Cpu, 
  Zap, 
  CheckCircle2, 
  ArrowLeft 
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { MarketingNavbar } from '../../../components/layout/MarketingNavbar'
import { MarketingFooter } from '../../../components/layout/MarketingFooter'

export function PerformanceDetails() {
  const navigate = useNavigate()

  const metrics = [
    {
      title: "Velocity Tracking",
      desc: "Millisecond-level analysis of development and operational output. Integrated directly with Git telemetry and project management tools.",
      icon: TrendingUp
    },
    {
      title: "Skill Gap Analysis",
      desc: "AI-driven talent mapping to identify organizational weaknesses and prioritize training or recruitment paths.",
      icon: Target
    },
    {
      title: "Attrition Prediction",
      desc: "Proprietary behavioral modeling to identify burnout and attrition risk before it impacts your bottom line.",
      icon: Activity
    },
    {
      title: "Executive Summaries",
      desc: "One-click, high-level reporting for leadership. Data-driven insights delivered in cinematic visual formats.",
      icon: BarChart3
    }
  ]

  return (
    <div className="min-h-screen bg-luxury-black text-white selection:bg-luxury-blue/30 font-sans overflow-x-hidden">
      <MarketingNavbar />
      
      {/* Hero Header */}
      <section className="pt-48 pb-20 px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.button 
            onClick={() => navigate(-1)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-slate-500 hover:text-luxury-blue transition-colors mb-12 uppercase text-[10px] font-black tracking-widest"
          >
            <ArrowLeft size={14} /> Back to Solutions
          </motion.button>
          
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-[10px] font-black uppercase tracking-[0.6em] text-luxury-blue mb-8">System Intelligence</p>
              <h1 className="text-6xl lg:text-8xl font-display font-black tracking-tighter uppercase italic mb-8">
                Performance <br />
                <span className="text-luxury-blue">Analytics.</span>
              </h1>
              <p className="text-xl text-slate-400 leading-relaxed font-medium mb-10">
                Data is the heartbeat of the modern enterprise. AuraHR provides the surgical tools needed to monitor, analyze, and optimize every pulse.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative"
            >
               <div className="glass-panel p-4 rounded-[56px] bg-white/5 border-white/10 overflow-hidden shadow-premium">
                 <img 
                   src="https://images.unsplash.com/photo-1551288049-bbbda5366a71?q=80&w=2070&auto=format&fit=crop" 
                   alt="Performance" 
                   className="w-full rounded-[48px] grayscale hover:grayscale-0 transition-all duration-1000"
                 />
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Metric Grid */}
      <section className="py-32 px-8 bg-white/5 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {metrics.map((m, i) => (
              <motion.div
                key={m.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-12 bg-luxury-black/60 border border-white/5 rounded-[48px] hover:border-luxury-blue/40 transition-all group"
              >
                <div className="h-16 w-16 rounded-[24px] bg-luxury-blue/10 flex items-center justify-center text-luxury-blue mb-8 group-hover:scale-110 transition-transform">
                  <m.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-6 uppercase italic tracking-tight">{m.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-40 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-display font-black uppercase italic mb-16">Strategic Advantage</h2>
          <div className="grid md:grid-cols-3 gap-8">
             {[
               { val: "24%", sub: "Higher Retention" },
               { val: "2.5x", sub: "Faster Deployment" },
               { val: "40%", sub: "Better Utilization" }
             ].map((stat, i) => (
               <div key={i} className="p-10 bg-white/5 rounded-[40px] border border-white/5">
                 <p className="text-5xl font-black italic text-luxury-blue mb-2">{stat.val}</p>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{stat.sub}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}
