import { motion } from 'framer-motion'
import { Scale, ShieldCheck, Zap, Users, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { MarketingNavbar } from '../../components/layout/MarketingNavbar'
import { MarketingFooter } from '../../components/layout/MarketingFooter'

export function TermsPage() {
  const navigate = useNavigate()

  const sections = [
    {
      title: "Acceptance of Terms",
      icon: Scale,
      content: "By accessing or using AuraHR, you agree to be bound by these Terms of Service. If you are using our services on behalf of an organization, you agree to these terms for that organization and represent that you have the authority to bind that entity."
    },
    {
      title: "User Responsibilities",
      icon: Users,
      content: "Users are responsible for maintaining the confidentiality of their credentials and for all activities that occur under their account. You must notify us immediately of any unauthorized use of your account or any other breach of security."
    },
    {
      title: "Service Usage Rules",
      icon: Zap,
      content: "AuraHR is designed for professional enterprise management. You agree not to misuse our services, interfere with our networks, or attempt to circumvent our security protocols. High-velocity telemetry must not be used for illegal monitoring."
    },
    {
      title: "Intellectual Property",
      icon: ShieldCheck,
      content: "All content, features, and functionality of AuraHR are the exclusive property of AuraHR Global. Our trademarks and brand identity may not be used in connection with any product or service without prior written consent."
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
              Terms & <br />
              <span className="text-luxury-blue">Conditions.</span>
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed font-medium">
              Last Updated: April 2026. Defining the framework for enterprise-grade excellence.
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
