import { motion } from 'framer-motion'
import { Zap, MessageSquare, Sun, Moon } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useContact } from './ContactContext'

export function MarketingNavbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { openContact } = useContact()
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
    { name: 'Resources', path: '/resources' },
  ]

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 border-b ${
        isScrolled 
          ? 'bg-white/80 dark:bg-black/80 backdrop-blur-xl py-4 border-slate-200 dark:border-white/10 shadow-lg dark:shadow-none' 
          : 'bg-transparent py-8 border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <div className="h-10 w-10 bg-luxury-blue rounded-full flex items-center justify-center shadow-lg shadow-luxury-blue/20 group-hover:scale-110 transition-transform">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-display font-black tracking-tighter uppercase italic text-slate-900 dark:text-white transition-colors">Aura<span className="text-luxury-blue">HR</span></span>
        </motion.div>

        <div className="hidden lg:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.3em]">
          {navItems.map((item, i) => (
            <motion.button 
              key={item.name} 
              onClick={() => navigate(item.path)}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`transition-colors relative group ${location.pathname === item.path ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-[#A0AEC0] hover:text-slate-900 dark:hover:text-white'}`}
            >
              {item.name}
              <span className={`absolute -bottom-2 left-0 h-0.5 bg-luxury-blue transition-all duration-300 ${location.pathname === item.path ? 'w-full' : 'w-0 group-hover:w-full'}`} />
            </motion.button>
          ))}
          
          <motion.button 
            onClick={openContact}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-slate-500 dark:text-[#A0AEC0] hover:text-slate-900 dark:hover:text-white transition-colors relative group flex items-center gap-2"
          >
            Contact
            <span className="absolute -bottom-2 left-0 h-0.5 bg-luxury-cyan w-0 group-hover:w-full transition-all duration-300" />
          </motion.button>
        </div>

        <div className="flex items-center gap-6">
          {/* Theme Toggle */}
          <button
            onClick={() => {
              const isDark = document.documentElement.classList.contains('dark')
              if (isDark) {
                document.documentElement.classList.remove('dark')
                localStorage.setItem('theme', 'light')
              } else {
                document.documentElement.classList.add('dark')
                localStorage.setItem('theme', 'dark')
              }
              window.dispatchEvent(new Event('storage'))
            }}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm dark:shadow-none"
          >
            <Sun className="h-4 w-4 block dark:hidden" />
            <Moon className="h-4 w-4 hidden dark:block" />
          </button>

          <button 
            onClick={() => navigate('/login')}
            className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-[#A0AEC0] hover:text-slate-900 dark:hover:text-white transition"
          >
            Login
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-luxury-blue dark:hover:bg-luxury-blue hover:text-white transition-all duration-500 shadow-xl shadow-slate-200 dark:shadow-white/5"
          >
            Explore Now
          </button>
        </div>
      </div>
    </nav>
  )
}
