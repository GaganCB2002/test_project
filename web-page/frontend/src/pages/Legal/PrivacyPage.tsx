import { motion } from 'framer-motion'
import { Shield, Lock, Eye, FileText, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { MarketingNavbar } from '../../components/layout/MarketingNavbar'
import { MarketingFooter } from '../../components/layout/MarketingFooter'

export function PrivacyPage() {
  const navigate = useNavigate()

  const sections = [
    {
      title: "Data Collection",
      icon: Eye,
      content: "We collect information that you provide directly to us when you create an account, such as your name, email address, and company details. We also collect technical data including your IP address and browser type to ensure secure access."
    },
    {
      title: "Data Usage",
      icon: FileText,
      content: "Your data is used solely to provide and improve AuraHR services. This includes authentication, personalized dashboard telemetry, and critical system notifications. We never sell your personal information to third parties."
    },
    {
      title: "Data Protection",
      icon: Lock,
      content: "We implement military-grade AES-256 encryption for all data at rest and TLS 1.3 for data in transit. Our infrastructure is hosted in SOC 2 Type II compliant data centers with 24/7 monitoring."
    },
    {
      title: "Cookies & Tracking",
      icon: Shield,
      content: "We use essential cookies to maintain your session and security. Performance cookies help us understand how users interact with our platform to optimize the high-velocity experience."
    }
  ]

  return (
    <div className="min-h-screen bg-luxury-black text-white selection:bg-luxury-blue/30 font-sans overflow-x-hidden">
      <MarketingNavbar />
      
      <section className="pt-48 pb-20 px-8 relative">
        <div className="max-w-4xl mx-auto">
          <motion.button 
            onClick={() => navigate(-1)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-slate-500 hover:text-luxury-blue transition-colors mb-12 uppercase text-[10px] font-black tracking-widest"
          >
            <ArrowLeft size={14} /> Back
          </motion.button>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-20"
          >
            <h1 className="text-6xl lg:text-8xl font-display font-black tracking-tighter uppercase italic mb-8">
              Privacy <br />
              <span className="text-luxury-blue">Policy.</span>
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed font-medium">
              Last Updated: April 2026. Your privacy is the cornerstone of our trust-based enterprise infrastructure.
            </p>
          </motion.div>

          <div className="space-y-16">
            {sections.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-12 bg-white/5 border border-white/5 rounded-[48px] hover:border-luxury-blue/40 transition-all group"
              >
                <div className="flex items-center gap-6 mb-8">
                  <div className="h-14 w-14 rounded-2xl bg-luxury-blue/10 flex items-center justify-center text-luxury-blue">
                    <s.icon size={28} />
                  </div>
                  <h3 className="text-3xl font-bold uppercase italic tracking-tight">{s.title}</h3>
                </div>
                <p className="text-xl text-slate-500 leading-relaxed font-medium group-hover:text-slate-300 transition-colors">
                  {s.content}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}
