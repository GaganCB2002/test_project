import { motion } from 'framer-motion'
import { 
  Cpu, 
  ShieldCheck, 
  Globe, 
  Zap, 
  BarChart3, 
  Users, 
  CheckCircle2, 
  ArrowRight,
  Play,
  Activity
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { MarketingNavbar } from '../../components/layout/MarketingNavbar'
import { MarketingFooter } from '../../components/layout/MarketingFooter'

export function ProductPage() {
  const navigate = useNavigate()
  
  const benefits = [
    {
      title: "Workforce Intelligence",
      text: "Transform raw behavioral data into actionable strategic insights. Predict attrition before it happens.",
      metric: "35%",
      sub: "Retention Increase"
    },
    {
      title: "Operational Velocity",
      text: "Eliminate administrative bottlenecks with automated workflows for payroll, recruitment, and onboarding.",
      metric: "2.4x",
      sub: "Efficiency Multiplier"
    },
    {
      title: "Security Sovereignty",
      text: "Full control over your data with enterprise-grade encryption and bespoke role-based access control.",
      metric: "99.9%",
      sub: "Security Rating"
    }
  ]

  return (
    <div className="min-h-screen bg-luxury-black text-white selection:bg-luxury-blue/30 overflow-x-hidden font-sans scroll-smooth">
      <MarketingNavbar />
      
      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-luxury-blue/10 border border-luxury-blue/20 text-[10px] font-black uppercase tracking-[0.4em] text-luxury-blue mb-10"
            >
              System Engineering v2.0
            </motion.div>
            <h1 className="text-7xl lg:text-9xl font-display font-black tracking-tighter leading-[0.9] uppercase mb-12 italic">
              Industrial <br />
              <span className="text-luxury-blue">Integrity.</span>
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed mb-12 font-medium">
              AuraHR is a high-performance operating system designed for the complexities of the modern global enterprise. We've replaced legacy friction with precision-engineered automation.
            </p>
            <div className="flex flex-wrap gap-8">
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="px-12 py-5 bg-luxury-blue rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all"
              >
                Launch Instance
              </motion.button>
              <motion.button 
                whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                className="px-12 py-5 bg-white/5 border border-white/10 rounded-full font-black text-xs uppercase tracking-[0.2em] transition flex items-center gap-3"
              >
                <Play size={14} fill="white" /> Technical Specs
              </motion.button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            <div className="glass-panel p-4 rounded-[60px] border-white/10 bg-white/5 shadow-premium group relative overflow-hidden">
              <motion.img 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 1.5 }}
                src="https://images.unsplash.com/photo-1551288049-bbbda5366a71?auto=format&fit=crop&q=80&w=2000" 
                alt="System Analysis" 
                className="rounded-[48px] w-full grayscale group-hover:grayscale-0 transition-all duration-[2000ms]" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/60 to-transparent rounded-[48px]" />
            </div>
            
            {/* Floating Telemetry Card */}
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute -bottom-10 -left-10 glass-panel p-8 rounded-[40px] bg-luxury-black/80 backdrop-blur-2xl border-white/10 shadow-2xl"
            >
               <div className="flex items-center gap-6">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                    <Activity className="text-emerald-500 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Status</p>
                    <p className="text-xl font-black italic">OPTIMIZED</p>
                  </div>
               </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Benefits / Impact Section */}
      <section className="py-40 px-8">
        <div className="max-w-7xl mx-auto space-y-60">
           {benefits.map((b, i) => (
             <motion.div 
               key={i} 
               initial={{ opacity: 0, y: 50 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 0.8 }}
               className={`flex flex-col ${i % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-24 items-center`}
             >
                <div className="lg:w-1/2">
                   <motion.h3 
                     initial={{ opacity: 0, x: i % 2 === 1 ? 30 : -30 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     transition={{ duration: 0.8, delay: 0.2 }}
                     className="text-5xl font-display font-black uppercase italic mb-8"
                   >
                     {b.title}
                   </motion.h3>
                   <p className="text-xl text-slate-400 mb-12 leading-relaxed font-medium">{b.text}</p>
                   <ul className="space-y-6">
                      {['Automated Decision Support', 'Predictive Modeling', 'Unified Governance'].map((item, idx) => (
                        <motion.li 
                          key={item} 
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + idx * 0.1 }}
                          className="flex items-center gap-4 group cursor-default"
                        >
                           <div className="h-8 w-8 rounded-full bg-luxury-blue/10 flex items-center justify-center group-hover:bg-luxury-blue/20 transition-colors">
                             <CheckCircle2 className="text-luxury-blue h-4 w-4" />
                           </div>
                           <span className="text-sm font-bold uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">{item}</span>
                        </motion.li>
                      ))}
                   </ul>
                </div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1 }}
                  className="lg:w-1/2 relative"
                >
                   <div className="aspect-square bg-luxury-blue/5 rounded-full blur-3xl absolute inset-0 -z-10 animate-pulse" />
                   <motion.div 
                     whileHover={{ y: -10, rotate: 1 }}
                     className="glass-panel p-20 rounded-[80px] bg-white/5 border-white/5 text-center group hover:bg-white/10 transition-all duration-700 shadow-premium"
                   >
                      <motion.p 
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
                        className="text-[120px] lg:text-[160px] font-display font-black tracking-tighter italic leading-none mb-4 group-hover:text-luxury-blue transition-colors duration-700"
                      >
                        {b.metric}
                      </motion.p>
                      <p className="text-xl font-bold uppercase tracking-[0.4em] text-luxury-blue/60 group-hover:text-luxury-blue transition-colors duration-700">{b.sub}</p>
                   </motion.div>
                </motion.div>
             </motion.div>
           ))}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-40 px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-luxury-blue -z-10" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
           <h2 className="text-6xl lg:text-8xl font-display font-black uppercase italic mb-12">Upgrade Your Infrastructure.</h2>
           <p className="text-xl text-white/80 mb-16 font-medium">Deploy the world's most advanced workforce operating system today.</p>
           <motion.button 
             whileHover={{ scale: 1.05, backgroundColor: "#000000", color: "#ffffff" }}
             whileTap={{ scale: 0.95 }}
             onClick={() => navigate('/login')}
             className="px-16 py-6 bg-white text-luxury-blue rounded-full font-black text-xs uppercase tracking-[0.4em] shadow-2xl transition-all duration-500"
           >
             Initialize Deployment
           </motion.button>
        </motion.div>
        
        {/* Decorative Background Elements */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-0 p-20 opacity-10 -z-0"
        >
          <Cpu size={400} />
        </motion.div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-[100px]" />
      </section>
      <MarketingFooter />
    </div>
  )
}
