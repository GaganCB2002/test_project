import { motion } from 'framer-motion'
import { 
  Users, 
  MessageSquare, 
  Video, 
  Mail, 
  Globe, 
  Zap, 
  CheckCircle2, 
  ArrowLeft 
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { MarketingNavbar } from '../../../components/layout/MarketingNavbar'
import { MarketingFooter } from '../../../components/layout/MarketingFooter'

export function CollaborationDetails() {
  const navigate = useNavigate()

  const features = [
    {
      title: "Real-time Messaging",
      desc: "Enterprise-grade chat with sub-50ms latency. Supports direct messaging, departmental channels, and project-based threads.",
      icon: MessageSquare
    },
    {
      title: "Aura Meet (HD Video)",
      desc: "Secure, low-latency video conferencing integrated directly into your workflow. Automated transcription and action item tracking.",
      icon: Video
    },
    {
      title: "Isolated Mail Protocol",
      desc: "A closed-loop internal mailing system designed for sensitive corporate communication, eliminating external phishing risks.",
      icon: Mail
    },
    {
      title: "Global Presence Sync",
      desc: "Synchronize distributed teams across time zones with real-time availability tracking and localized work hours.",
      icon: Globe
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
              <p className="text-[10px] font-black uppercase tracking-[0.6em] text-luxury-blue mb-8">Detailed Specification</p>
              <h1 className="text-6xl lg:text-8xl font-display font-black tracking-tighter uppercase italic mb-8">
                Team <br />
                <span className="text-luxury-blue">Collaboration.</span>
              </h1>
              <p className="text-xl text-slate-400 leading-relaxed font-medium mb-10">
                AuraHR's collaboration engine is engineered for the high-velocity enterprise. We've eliminated the friction between communication and execution.
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
                   src="https://images.unsplash.com/photo-1522071823991-b99c223a7097?q=80&w=2070&auto=format&fit=crop" 
                   alt="Collaboration" 
                   className="w-full rounded-[48px] grayscale hover:grayscale-0 transition-all duration-1000"
                 />
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-32 px-8 bg-white/5 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-12 bg-luxury-black/60 border border-white/5 rounded-[48px] hover:border-luxury-blue/40 transition-all group"
              >
                <div className="h-16 w-16 rounded-[24px] bg-luxury-blue/10 flex items-center justify-center text-luxury-blue mb-8 group-hover:scale-110 transition-transform">
                  <f.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-6 uppercase italic tracking-tight">{f.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-40 px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-display font-black uppercase italic mb-16 text-center">Operational Impact</h2>
          <div className="space-y-8">
            {[
              "Distributed Engineering Sync: Reduced meeting overhead by 40% using asynchronous presence.",
              "Global Crisis Management: Instant, encrypted departmental broadcasting for rapid response.",
              "Cross-Functional Sprints: Real-time project-linked chat ensuring context is never lost."
            ].map((useCase, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-6 p-8 bg-white/5 rounded-[32px] border border-white/5"
              >
                <CheckCircle2 className="text-luxury-blue h-6 w-6 mt-1 flex-shrink-0" />
                <p className="text-lg text-slate-300 font-medium">{useCase}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}
