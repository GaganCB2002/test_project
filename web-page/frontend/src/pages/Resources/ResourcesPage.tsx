import { motion } from 'framer-motion'
import { 
  Search, 
  Terminal, 
  BookOpen, 
  MessageSquare, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  Globe,
  Lock,
  Activity,
  ChevronDown
} from 'lucide-react'
import { useState } from 'react'
import { MarketingNavbar } from '../../components/layout/MarketingNavbar'
import { MarketingFooter } from '../../components/layout/MarketingFooter'

export function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const knowledgeCategories = [
    { title: 'Technical Docs', icon: Terminal, count: '124 Articles' },
    { title: 'System Status', icon: Activity, count: 'Live Telemetry' },
    { title: 'Security Labs', icon: Lock, count: 'Compliance' },
    { title: 'API Reference', icon: Globe, count: 'v4.0 Spec' }
  ]

  const faqs = [
    { 
      q: "How does AuraHR handle global data residency?", 
      a: "Our distributed architecture allows for localized data storage in SOC 2 Type II compliant centers across 12 regions, ensuring 100% compliance with local labor and privacy laws." 
    },
    { 
      q: "Can we integrate legacy HRIS systems?", 
      a: "Yes. Our Aura Bridge API supports bidirectional synchronization with legacy systems including SAP SuccessFactors, Workday, and Oracle HCM." 
    },
    { 
      q: "What is the typical deployment velocity?", 
      a: "Cloud-native instances are provisioned instantly. Full enterprise customization and SSO integration typically achieve production readiness within 72 hours." 
    }
  ]

  return (
    <div className="min-h-screen bg-luxury-black text-white selection:bg-luxury-blue/30 font-sans overflow-x-hidden scroll-smooth">
      <MarketingNavbar />
      
      {/* Hero Search */}
      <section className="pt-48 pb-32 px-8 relative">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.6em] text-luxury-blue mb-10">Developer Knowledge Hub</p>
            <h1 className="text-6xl lg:text-8xl font-display font-black tracking-tighter uppercase italic mb-12 text-white">
              The Insight <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-luxury-blue to-luxury-cyan">Repository.</span>
            </h1>
            
            <div className="relative group max-w-2xl mx-auto">
              <div className="absolute -inset-1 bg-luxury-blue/20 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-1000 group-focus-within:opacity-100" />
              <div className="relative flex items-center">
                <Search className="absolute left-8 text-slate-500" size={20} />
                <input 
                  type="text" 
                  placeholder="Search technical specifications..."
                  className="w-full pl-16 pr-8 py-6 bg-white/5 border border-white/10 rounded-full focus:outline-none focus:border-luxury-blue/40 text-white text-lg font-medium transition-all placeholder:text-slate-600"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 px-8 border-y border-white/5 bg-white/5">
        <div className="max-w-7xl mx-auto">
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
             {knowledgeCategories.map((c, i) => (
               <motion.div
                 key={c.title}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.1 }}
                 className="p-10 bg-luxury-black/60 border border-white/5 rounded-[40px] hover:border-luxury-blue/30 transition-all group cursor-pointer"
               >
                 <c.icon size={24} className="text-luxury-blue mb-6 group-hover:scale-110 transition-transform" />
                 <h4 className="text-sm font-bold uppercase tracking-widest mb-2 text-white">{c.title}</h4>
                 <p className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-widest">{c.count}</p>
               </motion.div>
             ))}
           </div>
        </div>
      </section>

      {/* FAQ / Technical Deep Dive */}
      <section className="py-40 px-8">
        <div className="max-w-4xl mx-auto">
           <h2 className="text-4xl md:text-5xl font-display font-black uppercase italic mb-16 text-center text-white">Operational FAQ</h2>
           <div className="space-y-6">
              {faqs.map((faq, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group border-b border-white/5 pb-8"
                >
                  <button className="w-full flex items-center justify-between text-left">
                    <span className="text-2xl font-bold uppercase italic tracking-tight group-hover:text-luxury-blue transition-colors text-white">{faq.q}</span>
                    <ChevronDown className="text-slate-500 group-hover:rotate-180 transition-transform" />
                  </button>
                  <p className="mt-6 text-[#A0AEC0] font-medium text-lg leading-relaxed max-h-0 overflow-hidden group-hover:max-h-40 transition-all duration-700">
                    {faq.a}
                  </p>
                </motion.div>
              ))}
           </div>
        </div>
      </section>

      {/* Community / Support CTA */}
      <section className="py-40 px-8 text-center bg-white/5">
        <div className="max-w-3xl mx-auto">
          <Zap className="h-12 w-12 text-luxury-blue mx-auto mb-10" />
          <h2 className="text-5xl md:text-6xl font-display font-black uppercase italic mb-8 text-white">Need Industrial Support?</h2>
          <p className="text-2xl text-[#A0AEC0] mb-12 font-medium leading-relaxed">Our global engineering team is available 24/7 for mission-critical deployment assistance.</p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-5 bg-white text-black rounded-full font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:bg-luxury-blue hover:text-white transition-all"
          >
            Connect to Engineering
          </motion.button>
        </div>
      </section>
      <MarketingFooter />
    </div>
  )
}
