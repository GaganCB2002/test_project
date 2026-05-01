import { motion } from 'framer-motion'
import { 
  ShieldCheck, 
  Briefcase, 
  Users, 
  Scale, 
  FileCheck, 
  Lock, 
  CheckCircle2, 
  ArrowLeft 
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { MarketingNavbar } from '../../../components/layout/MarketingNavbar'
import { MarketingFooter } from '../../../components/layout/MarketingFooter'

export function EnterpriseHRDetails() {
  const navigate = useNavigate()

  const pillars = [
    {
      title: "Autonomous Recruitment",
      desc: "AI-assisted pipeline that identifies high-intent candidates and automates the initial screening phases with surgical accuracy.",
      icon: Briefcase
    },
    {
      title: "Biometric Onboarding",
      desc: "Secure, zero-friction employee verification and system activation using state-of-the-art biometric protocols.",
      icon: Lock
    },
    {
      title: "Compliance Automation",
      desc: "Real-time auditing and automated regulatory reporting for GDPR, ISO 27001, and local labor laws.",
      icon: Scale
    },
    {
      title: "Personnel Intelligence",
      desc: "A 360-degree view of your workforce, from payroll telemetry to professional development mapping.",
      icon: Users
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
              <p className="text-[10px] font-black uppercase tracking-[0.6em] text-luxury-blue mb-8">Industrial Infrastructure</p>
              <h1 className="text-6xl lg:text-8xl font-display font-black tracking-tighter uppercase italic mb-8">
                Enterprise <br />
                <span className="text-luxury-blue">HR Lifecycle.</span>
              </h1>
              <p className="text-xl text-slate-400 leading-relaxed font-medium mb-10">
                Architected for the world's most complex organizations. We provide the infrastructure needed to manage the entire talent journey with total sovereignty.
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
                   src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" 
                   alt="Enterprise HR" 
                   className="w-full rounded-[48px] grayscale hover:grayscale-0 transition-all duration-1000"
                 />
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pillar Grid */}
      <section className="py-32 px-8 bg-white/5 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-12 bg-luxury-black/60 border border-white/5 rounded-[48px] hover:border-luxury-blue/40 transition-all group"
              >
                <div className="h-16 w-16 rounded-[24px] bg-luxury-blue/10 flex items-center justify-center text-luxury-blue mb-8 group-hover:scale-110 transition-transform">
                  <p.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-6 uppercase italic tracking-tight">{p.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Focus */}
      <section className="py-40 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-luxury-blue/10 border border-luxury-blue/20 text-[10px] font-black uppercase tracking-[0.4em] text-luxury-blue mb-10">
            <ShieldCheck className="h-3 w-3 fill-luxury-blue" />
            Security Sovereignty
          </div>
          <h2 className="text-5xl font-display font-black uppercase italic mb-8">Military-Grade Governance</h2>
          <p className="text-xl text-slate-400 mb-16 leading-relaxed font-medium">Your data is your most valuable intellectual property. AuraHR ensures it remains entirely within your control through advanced encryption and distributed architecture.</p>
          <button onClick={() => navigate('/login')} className="px-12 py-5 bg-white text-luxury-black rounded-full font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:bg-luxury-blue hover:text-white transition-all duration-500">
            Initialize Setup
          </button>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}
