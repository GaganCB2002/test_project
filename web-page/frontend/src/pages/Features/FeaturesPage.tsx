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
  Users,
  CheckCircle2,
  ArrowRight,
  Video,
  Database,
  Lock,
  Layers,
  Search,
  Activity
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { MarketingNavbar } from '../../components/layout/MarketingNavbar'
import { MarketingFooter } from '../../components/layout/MarketingFooter'

export function FeaturesPage() {
  const navigate = useNavigate()
  
  const mainFeatures = [
    {
      title: "Real-time Chat Engine",
      icon: MessageSquare,
      path: "/features/collaboration",
      desc: "Ultra-low latency communication for the high-velocity enterprise. Our Socket.io implementation ensures sub-50ms message delivery across the globe.",
      details: ["Persistent channel history", "Direct & Group threads", "Rich media embedding", "Biometric-locked conversations"],
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=2000",
      color: "from-blue-600/20 to-transparent"
    },
    {
      title: "Isolated Mail System",
      icon: Mail,
      path: "/features/collaboration",
      desc: "A proprietary internal mailing protocol designed for sensitive corporate communication. Eliminate phishing risks with a 100% closed-loop ecosystem.",
      details: ["Threaded intelligence", "Automatic compliance tagging", "Zero-attachment latency", "Departmental filtering"],
      image: "https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&q=80&w=2000",
      color: "from-indigo-600/20 to-transparent"
    },
    {
      title: "Aura Meet (Video)",
      icon: Video,
      path: "/features/collaboration",
      desc: "High-definition WebRTC conferencing with integrated session intelligence. Automated minutes, transcription, and action item extraction.",
      details: ["4K low-latency streaming", "Live AI transcription", "Virtual boardrooms", "One-click screen sharing"],
      image: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&q=80&w=2000",
      color: "from-purple-600/20 to-transparent"
    },
    {
      title: "Precision Alerts",
      icon: Bell,
      path: "/features/collaboration",
      desc: "A cognitive-aware notification system that prioritizes signal over noise. Intelligent grouping and critical path highlighting.",
      details: ["Cross-platform push", "Custom event triggers", "Priority-based filtering", "Historical audit logs"],
      image: "https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?auto=format&fit=crop&q=80&w=2000",
      color: "from-amber-600/20 to-transparent"
    }
  ]

  const enterpriseSpecs = [
    { title: "Role-Based Hubs", icon: LayoutDashboard, text: "Bespoke dashboards for HR, Tech, and Execs." },
    { title: "Data Sovereignty", icon: Database, text: "On-premise or private cloud deployment options." },
    { title: "Military Security", icon: Lock, text: "AES-256 at rest, TLS 1.3 in transit." },
    { title: "Infinite Scaling", icon: Layers, text: "Microservices architecture for zero-downtime scaling." }
  ]

  return (
    <div className="min-h-screen bg-luxury-black text-white selection:bg-luxury-blue/30 font-sans overflow-x-hidden scroll-smooth">
      <MarketingNavbar />
      
      {/* Hero Header */}
      <section className="pt-48 pb-32 px-8 relative">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.6em] text-luxury-blue mb-10">Core Capabilities</p>
            <h1 className="text-7xl lg:text-9xl font-display font-black tracking-tighter uppercase italic mb-12">
              The Feature <br />
              <span className="text-luxury-blue">Manifesto.</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium">
              We didn't just build features. We engineered a seamless interface between human potential and enterprise efficiency.
            </p>
          </motion.div>
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-luxury-blue/10 via-transparent to-transparent -z-10" />
      </section>

      {/* Main Features Detail */}
      <section className="pb-40 px-8">
        <div className="max-w-7xl mx-auto space-y-32">
          {mainFeatures.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className={`flex flex-col ${i % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-20 items-center`}
            >
              <div className="lg:w-1/2">
                <motion.div 
                  whileHover={{ x: 10 }}
                  className="inline-flex items-center gap-4 mb-8"
                >
                  <div className="h-14 w-14 rounded-2xl bg-luxury-blue/10 flex items-center justify-center text-luxury-blue">
                    <f.icon size={28} />
                  </div>
                  <h3 className="text-3xl font-black uppercase italic tracking-tight">{f.title}</h3>
                </motion.div>
                <p className="text-xl text-slate-400 mb-10 leading-relaxed font-medium">{f.desc}</p>
                <div className="grid grid-cols-2 gap-6 mb-12">
                  {f.details.map((detail, di) => (
                    <motion.div 
                      key={detail} 
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + di * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle2 size={16} className="text-luxury-blue" />
                      <span className="text-sm font-bold text-slate-300">{detail}</span>
                    </motion.div>
                  ))}
                </div>
                <motion.button 
                  whileHover={{ x: 10, color: '#ffffff' }}
                  onClick={() => navigate(f.path)}
                  className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-luxury-blue hover:text-white transition-colors"
                >
                  Learn More <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                </motion.button>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="lg:w-1/2 relative group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${f.color} rounded-[56px] blur-2xl group-hover:blur-3xl transition-all duration-700`} />
                <div className="relative glass-panel border-white/5 bg-white/5 p-4 rounded-[60px] overflow-hidden shadow-premium">
                  <motion.img 
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 1.5 }}
                    src={f.image} 
                    alt={f.title} 
                    className="w-full aspect-video object-cover rounded-[48px] grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" 
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

      {/* Enterprise Specs Section */}
      <section className="py-40 bg-white/5 border-y border-white/5 px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="text-5xl font-display font-black uppercase italic mb-8">Enterprise Specifications</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium">Underneath the aesthetic surface lies a foundation of industrial-grade engineering.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {enterpriseSpecs.map((s, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, borderColor: 'rgba(59, 130, 246, 0.4)' }}
                className="p-10 bg-luxury-black/60 border border-white/5 rounded-[48px] transition-all group"
              >
                <s.icon className="h-10 w-10 text-luxury-blue mb-8 group-hover:scale-110 transition-transform" />
                <h4 className="text-xl font-bold mb-4 uppercase italic">{s.title}</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{s.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Animated Background Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] border border-white/5 rounded-full -z-10 animate-[spin_60s_linear_infinite]" />
      </section>

      {/* UI Call to Action */}
      <section className="py-40 px-8 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
           <h2 className="text-6xl font-display font-black uppercase italic mb-12">Engineered for <span className="text-luxury-blue">Scale.</span></h2>
           <p className="text-xl text-slate-400 mb-16 font-medium">Ready to transition your organization to the high-performance tier?</p>
           <motion.button 
             whileHover={{ scale: 1.05, backgroundColor: '#3b82f6', color: '#ffffff' }}
             whileTap={{ scale: 0.95 }}
             onClick={() => navigate('/login')}
             className="px-16 py-6 bg-white text-luxury-black rounded-full font-black text-xs uppercase tracking-[0.4em] shadow-2xl transition-all"
           >
             Initialize Setup
           </motion.button>
        </motion.div>
      </section>
      <MarketingFooter />
    </div>
  )
}
