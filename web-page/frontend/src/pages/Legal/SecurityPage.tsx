import { motion } from 'framer-motion'
import { ShieldAlert, Cpu, Database, Activity, ArrowLeft, Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { MarketingNavbar } from '../../components/layout/MarketingNavbar'
import { MarketingFooter } from '../../components/layout/MarketingFooter'

export function SecurityPage() {
  const navigate = useNavigate()

  const sections = [
    {
      title: "Encryption Standards",
      icon: Lock,
      content: "All data is protected with military-grade AES-256 encryption at rest and TLS 1.3 for all data in transit. We use hardware security modules (HSMs) to manage encryption keys with the highest tier of protection."
    },
    {
      title: "Infrastructure Security",
      icon: Cpu,
      content: "Our infrastructure is hosted on isolated virtual private clouds (VPCs) with zero-trust networking principles. We employ automated intrusion detection systems and regular 3rd-party penetration testing."
    },
    {
      title: "Data Sovereignty",
      icon: Database,
      content: "Enterprise clients have the option for on-premise or private cloud deployment, ensuring total control over data residency and compliance with local regulatory requirements."
    },
    {
      title: "Continuous Monitoring",
      icon: Activity,
      content: "We provide 24/7 security telemetry monitoring. Any anomaly is immediately flagged by our AI-driven security core, ensuring sub-second response times to potential threats."
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
              Security <br />
              <span className="text-luxury-blue">Framework.</span>
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed font-medium">
              Last Updated: April 2026. Engineered for absolute data integrity and protection.
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
