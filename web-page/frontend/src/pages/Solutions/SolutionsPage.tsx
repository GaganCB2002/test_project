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
  ArrowRight,
  Shield,
  Activity,
  Cpu,
  Monitor
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { MarketingNavbar } from '../../components/layout/MarketingNavbar'
import { MarketingFooter } from '../../components/layout/MarketingFooter'

export function SolutionsPage() {
  const navigate = useNavigate()
  
  const detailedSolutions = [
    {
      title: "Enterprise HR Lifecycle",
      icon: ShieldCheck,
      path: "/features/enterprise-hr",
      desc: "Architected for high-scale organizations. From autonomous recruitment pipelines to biometric onboarding, we manage the entire employee journey with industrial precision.",
      features: ["AI-Assisted ATS", "One-Click Compliance", "Automated Payroll Sync", "Executive Reporting"],
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000"
    },
    {
      title: "Team Collaboration Hub",
      icon: Users,
      path: "/features/collaboration",
      desc: "Synchronize your global workforce in a unified command center. Integrated real-time chat, internal mail, and HD video conferencing engineered for zero friction.",
      features: ["Persistent Chat Channels", "Encrypted Mail Protocol", "Aura Meet (WebRTC)", "Cross-Team Presence"],
      image: "https://images.unsplash.com/photo-1522071823991-b99c223a7097?auto=format&fit=crop&q=80&w=2000"
    },
    {
      title: "Performance & Productivity",
      icon: TrendingUp,
      path: "/features/performance",
      desc: "Gain surgical insights into your team's velocity. Our telemetry engine tracks development activity and operational output to predict attrition and optimize growth.",
      features: ["Skill Gap Analysis", "Velocity Tracking", "Behavioral Insights", "Predictive Analytics"],
      image: "https://images.unsplash.com/photo-1551288049-bbbda5366a71?auto=format&fit=crop&q=80&w=2000"
    }
  ]

  const useCases = [
    { 
      sector: "FinTech & Banking", 
      icon: Shield, 
      text: "Securing highly sensitive workforce data with military-grade encryption and strict regulatory compliance automations." 
    },
    { 
      sector: "Global Tech Scales", 
      icon: Rocket, 
      text: "Synchronizing distributed engineering teams across 12+ time zones with real-time telemetry and unified presence." 
    },
    { 
      sector: "Creative Agencies", 
      icon: Monitor, 
      text: "Optimizing project velocity and creative output through integrated collaboration and cognitive-aware notifications." 
    }
  ]

  return (
    <div className="min-h-screen bg-luxury-black text-white selection:bg-luxury-blue/30 font-sans overflow-x-hidden scroll-smooth">
      <MarketingNavbar />
      
      {/* Hero Header */}
      <section className="pt-48 pb-32 px-8 relative">
        <div className="max-w-7xl mx-auto">
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
             className="text-center"
           >
             <p className="text-[10px] font-black uppercase tracking-[0.6em] text-luxury-blue mb-10">Strategic Frameworks</p>
             <h1 className="text-7xl lg:text-9xl font-display font-black tracking-tighter uppercase italic mb-12">
               Precision <br />
               <span className="text-luxury-blue">Solutions.</span>
             </h1>
             <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium">
               Tailored ecosystems engineered to solve the most complex organizational challenges for the world's most demanding enterprises.
             </p>
           </motion.div>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-luxury-blue/5 to-transparent -z-10" />
      </section>

      {/* Main Solutions Grid */}
      <section className="py-40 px-8 bg-white/5 border-y border-white/5">
        <div className="max-w-7xl mx-auto space-y-40">
           {detailedSolutions.map((s, i) => (
             <motion.div
               key={s.title}
               initial={{ opacity: 0, y: 50 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 0.8, delay: i * 0.1 }}
               className={`flex flex-col ${i % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-24 items-center`}
             >
                <div className="lg:w-1/2">
                   <motion.div 
                     whileHover={{ scale: 1.05 }}
                     className="h-16 w-16 rounded-[24px] bg-luxury-blue/10 flex items-center justify-center text-luxury-blue mb-10 transition-transform"
                   >
                      <s.icon size={32} />
                   </motion.div>
                   <h3 className="text-5xl font-display font-black uppercase italic mb-8 tracking-tight">{s.title}</h3>
                   <p className="text-xl text-slate-400 mb-12 leading-relaxed font-medium">{s.desc}</p>
                   <div className="grid grid-cols-2 gap-8 mb-12">
                      {s.features.map((f, fi) => (
                        <motion.div 
                          key={f} 
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + fi * 0.1 }}
                          className="flex items-center gap-3"
                        >
                           <div className="h-2 w-2 rounded-full bg-luxury-blue" />
                           <span className="text-sm font-bold uppercase tracking-widest text-slate-300">{f}</span>
                        </motion.div>
                      ))}
                   </div>
                   <motion.button 
                     whileHover={{ scale: 1.05, backgroundColor: '#ffffff', color: '#000000' }}
                     whileTap={{ scale: 0.95 }}
                     onClick={() => navigate(s.path)}
                     className="px-10 py-4 bg-luxury-blue rounded-full font-black text-xs uppercase tracking-widest shadow-2xl shadow-luxury-blue/20 transition-all"
                   >
                     Learn More
                   </motion.button>
                </div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="lg:w-1/2 relative group"
                >
                   <div className="absolute -inset-4 bg-luxury-blue/10 rounded-[64px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                   <div className="relative glass-panel border-white/5 bg-white/5 p-4 rounded-[64px] overflow-hidden">
                      <motion.img 
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 1.5 }}
                        src={s.image} 
                        alt={s.title} 
                        className="w-full aspect-[4/3] object-cover rounded-[48px] grayscale group-hover:grayscale-0 transition-all duration-1000" 
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2000"
                        }}
                      />
                   </div>
                </motion.div>
             </motion.div>
           ))}
        </div>
      </section>

      {/* Use Cases / Sectors */}
      <section className="py-40 px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="text-5xl font-display font-black uppercase italic mb-8 italic">Sector Focus</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium">Industry-specific configurations designed for specialized operational requirements.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((u, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="p-12 bg-white/5 border border-white/5 rounded-[56px] hover:bg-white/10 transition-all group relative overflow-hidden"
              >
                <div className="h-16 w-16 rounded-[24px] bg-luxury-blue/10 flex items-center justify-center text-luxury-blue mb-10 group-hover:scale-110 transition-transform">
                  <u.icon size={32} />
                </div>
                <h4 className="text-2xl font-bold mb-6 uppercase italic">{u.sector}</h4>
                <p className="text-slate-400 font-medium leading-relaxed mb-10">{u.text}</p>
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-luxury-blue opacity-0 group-hover:opacity-100 transition-opacity">
                   Explore Solution <ArrowRight size={14} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <MarketingFooter />
    </div>
  )
}
