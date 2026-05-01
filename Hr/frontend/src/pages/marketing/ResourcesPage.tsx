import { motion } from 'framer-motion'
import { 
  Terminal, 
  FileText, 
  Play, 
  Globe, 
  MessageSquare, 
  HelpCircle, 
  ChevronRight,
  Search,
  Book,
  Code,
  Shield
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { MarketingNavbar } from '../../components/layout/MarketingNavbar'

export function ResourcesPage() {
  const navigate = useNavigate()
  
  const resourceCategories = [
    { title: "Documentation", icon: Book, items: ["Quick Start Guide", "API Reference", "Deployment Manual", "Security Protocol"] },
    { title: "Developers", icon: Code, items: ["SDK Libraries", "Webhook Setup", "Integration Patterns", "Custom Modules"] },
    { title: "Compliance", icon: Shield, items: ["GDPR Readiness", "ISO 27001 Specs", "Data Sovereignty", "Privacy Policy"] },
    { title: "Community", icon: MessageSquare, items: ["User Forums", "Change Logs", "Case Studies", "Release Notes"] },
  ]

  return (
    <div className="min-h-screen bg-luxury-black text-white selection:bg-luxury-blue/30 font-sans">
      <MarketingNavbar />
      
      <section className="pt-40 pb-20 px-8">
        <div className="max-w-7xl mx-auto text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-luxury-blue mb-8">Ecosystem Hub</p>
            <h1 className="text-6xl lg:text-8xl font-display font-black tracking-tighter uppercase italic mb-10">Knowledge <span className="text-luxury-blue">Base.</span></h1>
            <div className="relative max-w-2xl mx-auto">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 h-5 w-5" />
               <input 
                 type="text" 
                 placeholder="Search the AuraHR ecosystem..." 
                 className="w-full bg-white/5 border border-white/10 rounded-full py-6 pl-16 pr-8 text-sm font-bold focus:ring-2 focus:ring-luxury-blue outline-none transition-all"
               />
            </div>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {resourceCategories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-10 bg-white/5 border border-white/5 rounded-[48px] hover:bg-white/10 transition-all group"
            >
              <div className="h-14 w-14 rounded-2xl bg-luxury-blue/10 flex items-center justify-center text-luxury-blue mb-8 group-hover:scale-110 transition-transform">
                <cat.icon size={28} />
              </div>
              <h3 className="text-xl font-bold mb-6 uppercase italic">{cat.title}</h3>
              <ul className="space-y-4">
                {cat.items.map(item => (
                  <li key={item}>
                    <button className="text-sm font-bold text-slate-500 hover:text-white transition flex items-center justify-between w-full group/item">
                      {item}
                      <ChevronRight size={14} className="opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
          <div className="glass-panel p-12 rounded-[56px] bg-gradient-to-br from-luxury-blue/20 to-transparent border-white/5">
            <h3 className="text-3xl font-bold mb-6 uppercase italic">Need Direct Support?</h3>
            <p className="text-slate-400 mb-10 leading-relaxed font-medium">Our engineering team is available 24/7 for Enterprise license holders. Get surgical assistance with your deployment.</p>
            <button className="px-10 py-4 bg-white text-luxury-black rounded-full font-black text-xs uppercase tracking-widest hover:bg-luxury-blue hover:text-white transition-all">
              Contact Engineering
            </button>
          </div>
          
          <div className="glass-panel p-12 rounded-[56px] bg-white/5 border-white/5">
             <h3 className="text-3xl font-bold mb-6 uppercase italic">Frequently Asked</h3>
             <div className="space-y-6">
                {[
                  "How secure is my data?",
                  "Can I self-host AuraHR?",
                  "What are the API limits?",
                ].map(q => (
                  <button key={q} className="w-full flex items-center justify-between py-4 border-b border-white/5 text-left text-sm font-bold text-slate-400 hover:text-white transition">
                    {q} <ChevronRight size={14} />
                  </button>
                ))}
             </div>
          </div>
        </div>
      </section>

      <footer className="py-20 px-8 bg-luxury-black text-center border-t border-white/5">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700">© 2026 AuraHR Global • Engineered for Perfection</p>
      </footer>
    </div>
  )
}
