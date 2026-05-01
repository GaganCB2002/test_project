import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

export function MarketingNavbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Product', path: '/product' },
    { name: 'Features', path: '/features' },
    { name: 'Solutions', path: '/solutions' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Resources', path: '/resources' },
  ]

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 border-b ${
        isScrolled 
          ? 'bg-luxury-black/80 backdrop-blur-xl py-4 border-white/10' 
          : 'bg-transparent py-8 border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="h-10 w-10 bg-luxury-blue rounded-full flex items-center justify-center shadow-lg shadow-luxury-blue/20">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-display font-black tracking-tighter uppercase italic">Aura<span className="text-luxury-blue">HR</span></span>
        </motion.div>

        <div className="hidden lg:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
          {navItems.map((item, i) => (
            <motion.button 
              key={item.name} 
              onClick={() => navigate(item.path)}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`hover:text-white transition-colors relative group ${location.pathname === item.path ? 'text-white' : ''}`}
            >
              {item.name}
              <span className={`absolute -bottom-2 left-0 h-0.5 bg-luxury-blue transition-all duration-300 ${location.pathname === item.path ? 'w-full' : 'w-0 group-hover:w-full'}`} />
            </motion.button>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/login')}
            className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition"
          >
            Login
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="px-8 py-3 bg-white text-luxury-black rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-luxury-blue hover:text-white transition-all duration-500 shadow-xl shadow-white/5"
          >
            Explore Now
          </button>
        </div>
      </div>
    </nav>
  )
}
