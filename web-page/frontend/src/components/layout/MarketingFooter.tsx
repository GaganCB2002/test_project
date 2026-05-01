import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Mail, Phone, MapPin, Zap } from 'lucide-react'
import { useContact } from './ContactContext'

export function MarketingFooter() {
  const navigate = useNavigate()
  const { openContact } = useContact()

  const links = {
    product: [
      { name: 'Capabilities', path: '/product' },
      { name: 'Analytics', path: '/features/performance' },
      { name: 'Security', path: '/security' }
    ],
    company: [
      { name: 'Features', path: '/features' },
      { name: 'Solutions', path: '/solutions' },
      { name: 'Resources', path: '/resources' }
    ],
    legal: [
      { name: 'Privacy', path: '/privacy' },
      { name: 'Terms', path: '/terms' },
      { name: 'Security', path: '/security' }
    ]
  }

  return (
    <footer className="bg-luxury-black border-t border-white/5 pt-20 pb-10 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand & Contact */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-luxury-blue rounded-full flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-display font-black tracking-tighter uppercase italic">Aura<span className="text-luxury-blue">HR</span></span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[#A0AEC0] hover:text-white transition-colors cursor-pointer group">
                <Mail size={16} className="group-hover:text-luxury-blue" />
                <span className="text-[11px] font-black uppercase tracking-widest">nexus@aurahr.io</span>
              </div>
              <div className="flex items-center gap-3 text-[#A0AEC0] hover:text-white transition-colors cursor-pointer group">
                <Phone size={16} className="group-hover:text-luxury-blue" />
                <span className="text-[11px] font-black uppercase tracking-widest">+1 (888) AURA-OPS</span>
              </div>
              <div className="flex items-center gap-3 text-[#A0AEC0] hover:text-white transition-colors cursor-pointer group">
                <MapPin size={16} className="group-hover:text-luxury-blue" />
                <span className="text-[11px] font-black uppercase tracking-widest">Global HQ • Silicon Valley</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 mb-8">Ecosystem</h4>
            <ul className="space-y-4">
              {links.product.map(link => (
                <li key={link.name}>
                  <button 
                    onClick={() => navigate(link.path)}
                    className="text-[11px] font-black uppercase tracking-widest text-[#A0AEC0] hover:text-luxury-blue transition-colors"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 mb-8">Platform</h4>
            <ul className="space-y-4">
              {links.company.map(link => (
                <li key={link.name}>
                  <button 
                    onClick={() => navigate(link.path)}
                    className="text-[11px] font-black uppercase tracking-widest text-[#A0AEC0] hover:text-luxury-blue transition-colors"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
              <li>
                <button 
                  onClick={openContact}
                  className="text-[11px] font-black uppercase tracking-widest text-luxury-cyan hover:text-white transition-colors"
                >
                  Contact Nexus
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 mb-8">Governance</h4>
            <ul className="space-y-4">
              {links.legal.map(link => (
                <li key={link.name}>
                  <button 
                    onClick={() => navigate(link.path)}
                    className="text-[11px] font-black uppercase tracking-widest text-[#A0AEC0] hover:text-luxury-blue transition-colors"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-white/5 gap-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-600">
            © 2026 AuraHR Global Infrastructure • All Rights Reserved
          </p>
          <div className="flex gap-8">
            <motion.div whileHover={{ y: -2 }} className="h-2 w-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-600">All Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
