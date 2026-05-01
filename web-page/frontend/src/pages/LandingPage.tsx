import React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  Monitor, 
  Camera, 
  Timer, 
  Bell,
  Play,
  CheckCircle2,
  Users,
  Star,
  Globe,
  Cpu,
  Lock,
  ChevronDown,
  Mail,
  MessageSquare,
  Terminal,
  Activity
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { MarketingNavbar } from '../components/layout/MarketingNavbar'
import { MarketingFooter } from '../components/layout/MarketingFooter'

export function LandingPage() {
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)
  const heroRef = useRef(null)
  
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 400], [1, 0])
  const scale = useTransform(scrollY, [0, 400], [1, 0.95])
  const y = useTransform(scrollY, [0, 400], [0, 100])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const luxuryFeatures = [
    {
      title: "Precision Analytics",
      description: "Engineered for high-performance teams. Gain millisecond-level insights into your workflow velocity.",
      icon: Cpu,
      color: "text-luxury-blue",
      path: "/features/performance"
    },
    {
      title: "Secure Infrastructure",
      description: "Enterprise-grade encryption protecting your most sensitive intellectual property with military-grade protocols.",
      icon: ShieldCheck,
      color: "text-luxury-accent",
      path: "/features/enterprise-hr"
    },
    {
      title: "Global Connectivity",
      description: "Seamlessly synchronize your global workforce across time zones with our unified command center.",
      icon: Globe,
      color: "text-slate-400",
      path: "/features/collaboration"
    },
    {
      title: "AI-Driven Insights",
      description: "Predictive modeling and behavioral analysis to stay ahead of performance bottlenecks.",
      icon: Zap,
      color: "text-amber-400",
      path: "/features/performance"
    }
  ]


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-luxury-black text-slate-900 dark:text-white selection:bg-luxury-blue/30 overflow-x-hidden font-sans scroll-smooth transition-colors duration-500">
      <MarketingNavbar />

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ opacity, scale, y }} className="relative z-10 text-center px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-luxury-blue/10 border border-luxury-blue/20 text-[10px] font-black uppercase tracking-[0.4em] text-luxury-blue mb-10">
              <Star className="h-3 w-3 fill-luxury-blue" />
              The Pinnacle of Workforce Engineering
            </div>
            <h1 className="text-7xl lg:text-9xl font-display font-black tracking-tighter leading-[0.9] uppercase mb-10 italic">
              Performance <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-luxury-blue to-luxury-cyan border-t border-b border-white/20 px-4 py-2 my-4 inline-block italic">Redefined.</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-16 font-medium leading-relaxed">
              Precision-engineered tools for the modern enterprise. Monitor, analyze, and optimize your global talent with surgical accuracy.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="px-12 py-5 bg-luxury-blue rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-luxury-blue/30 hover:bg-luxury-cyan transition-all group"
              >
                Start Your Journey
                <ArrowRight className="inline-block ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                className="px-12 py-5 bg-transparent border border-white/20 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-white/5 transition flex items-center gap-3 text-white"
              >
                <Play className="h-4 w-4 fill-white" />
                Experience Demo
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white to-white dark:from-luxury-black/60 dark:via-luxury-black/80 dark:to-luxury-black z-10" />
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-40 dark:opacity-40" 
          />
          {/* Animated Glows */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-luxury-blue/10 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-luxury-accent/10 rounded-full blur-[150px] animate-pulse delay-1000" />
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-10">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 dark:text-slate-500 animate-pulse">Scroll</span>
        </div>
      </section>

      {/* Product Showcase */}
      <section id="product" className="py-32 bg-white dark:bg-luxury-black">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative"
          >
            <div className="text-center mb-20">
              <h2 className="text-5xl font-display font-black tracking-tight uppercase mb-6 italic">The Interface of Tomorrow</h2>
              <p className="text-slate-400 max-w-xl mx-auto text-lg">A visual masterpiece designed for maximum cognitive efficiency and aesthetic pleasure.</p>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative glass-panel border-white/5 bg-white/5 p-4 rounded-[40px] shadow-premium overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-transparent opacity-60 z-10" />
              <motion.img 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 2 }}
                src="/hero-product.png" 
                alt="Product Preview" 
                className="w-full rounded-[32px] transition-transform duration-[2000ms]"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1551288049-bbbda5366a71?auto=format&fit=crop&q=80&w=2000"
                }}
              />
              
              {/* Feature Tags */}
              <div className="absolute top-12 left-12 z-20 space-y-4">
                {['Real-time Telemetry', 'AI Behavioral Analysis', 'Predictive Attrition'].map((tag, i) => (
                  <motion.div 
                    key={tag}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="px-6 py-3 bg-luxury-black/40 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center gap-3"
                  >
                    <div className="h-2 w-2 rounded-full bg-luxury-blue" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{tag}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-end mb-32">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-luxury-blue mb-6">Engineering Specs</p>
              <h2 className="text-6xl font-display font-black tracking-tighter uppercase italic">Built for <br />Precision.</h2>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-xl text-slate-400 leading-relaxed font-medium"
            >
              Every pixel, every data point, and every interaction has been meticulously engineered to provide the ultimate management experience.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {luxuryFeatures.map((f, i) => (
              <motion.div 
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                onClick={() => navigate(f.path)}
                className="group relative p-10 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-[40px] hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-500 overflow-hidden cursor-pointer shadow-xl shadow-slate-200/50 dark:shadow-none"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <f.icon size={120} />
                </div>
                <div className={`h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 ${f.color} group-hover:scale-110 transition-transform duration-500 shadow-xl shadow-black/50`}>
                  <f.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-6 italic uppercase tracking-tight text-white">{f.title}</h3>
                <p className="text-[#A0AEC0] leading-relaxed font-medium group-hover:text-white transition-colors">{f.description}</p>
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="mt-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-luxury-cyan opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Learn More <ArrowRight className="h-3 w-3" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Modules Section */}
      <section id="solutions" className="py-32 bg-slate-50 dark:bg-white/5 border-y border-slate-200 dark:border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="text-5xl font-display font-black tracking-tight uppercase mb-8 italic">Unified Command Center</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium">One system. Every module. Total control over your enterprise communication and operations.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
             {[
               { title: 'Collaboration', icon: MessageSquare, text: 'Real-time chat and internal mail system integrated directly into your workflow.', color: 'bg-blue-500/20', path: '/features/collaboration' },
               { title: 'Conferencing', icon: Monitor, text: 'Ultra-low latency video meetings with automated transcription and action items.', color: 'bg-purple-500/20', path: '/features/collaboration' },
               { title: 'Security', icon: Lock, text: 'Advanced role-based access control with biometric and multi-factor authentication.', color: 'bg-emerald-500/20', path: '/features/enterprise-hr' },
             ].map((item, i) => (
               <motion.div 
                 key={i} 
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.1 }}
                 whileHover={{ y: -10 }}
                 onClick={() => navigate(item.path)}
                 className="glass-panel border-slate-200 dark:border-white/5 bg-white dark:bg-luxury-black/40 p-10 rounded-[48px] transition-all duration-500 group cursor-pointer shadow-xl shadow-slate-200/20 dark:shadow-none"
               >
                  <div className={`h-16 w-16 rounded-[24px] ${item.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                    <item.icon className="h-8 w-8 text-slate-900 dark:text-white" />
                  </div>
                  <h4 className="text-2xl font-bold mb-4 uppercase italic text-slate-900 dark:text-white">{item.title}</h4>
                  <p className="text-slate-600 dark:text-[#A0AEC0] leading-relaxed">{item.text}</p>
               </motion.div>
             ))}
          </div>
        </div>
      </section>


      {/* Resources & FAQ */}
      <section id="resources" className="py-32 bg-white dark:bg-white/5 border-y border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-32">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl font-display font-black tracking-tight uppercase mb-12 italic">Knowledge <br />Base.</h2>
              <div className="space-y-6">
                {[
                  { title: 'How does live monitoring impact privacy?', answer: 'We employ advanced anonymization protocols and behavioral focus to ensure compliance with global privacy regulations while maintaining transparency.' },
                  { title: 'Can I integrate with existing SSO?', answer: 'Yes, our enterprise grade allows for seamless SAML 2.0 and OIDC integration with Okta, Azure AD, and more.' },
                  { title: 'What is the deployment timeframe?', answer: 'Our cloud-native infrastructure allows for instant activation. On-premise deployments typically take 2-4 business days.' },
                ].map((faq, i) => (
                  <div key={i} className="group border-b border-white/5 pb-6">
                    <button className="w-full flex items-center justify-between text-left">
                      <span className="text-lg font-bold group-hover:text-luxury-blue transition-colors uppercase italic">{faq.title}</span>
                      <ChevronDown className="h-5 w-5 text-slate-500 group-hover:rotate-180 transition-transform" />
                    </button>
                    <p className="mt-4 text-slate-500 font-medium leading-relaxed max-h-0 overflow-hidden group-hover:max-h-40 transition-all duration-500">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-6">
               {[
                 { title: 'Documentation', icon: Terminal, text: 'Technical specifications for developers.' },
                 { title: 'API Reference', icon: Globe, text: 'Custom endpoint integration guides.' },
                 { title: 'Security Whitepaper', icon: Lock, text: 'Deep dive into our encryption standards.' },
                 { title: 'System Status', icon: Activity, text: 'Live infrastructure performance tracking.' },
               ].map((res, i) => (
                 <motion.div 
                   key={i} 
                   initial={{ opacity: 0, scale: 0.9 }}
                   whileInView={{ opacity: 1, scale: 1 }}
                   viewport={{ once: true }}
                   transition={{ delay: i * 0.1 }}
                   whileHover={{ scale: 1.05 }}
                   className="p-8 bg-white dark:bg-luxury-black/60 border border-slate-200 dark:border-white/5 rounded-[40px] hover:border-luxury-blue/40 transition-colors group cursor-pointer shadow-lg shadow-slate-100 dark:shadow-none"
                 >
                    <res.icon className="h-6 w-6 text-luxury-blue mb-6 group-hover:scale-110 transition-transform" />
                    <h4 className="text-sm font-bold uppercase tracking-widest mb-3 text-slate-900 dark:text-white">{res.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-500 font-medium leading-relaxed">{res.text}</p>
                 </motion.div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 px-8 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-7xl lg:text-9xl font-display font-black tracking-tighter uppercase italic mb-12">
              Join the <br />
              <span className="text-luxury-blue">Elite.</span>
            </h2>
            <p className="text-xl text-slate-400 mb-16 font-medium max-w-2xl mx-auto">
              Experience the pinnacle of workforce intelligence. Engineered for leaders who demand perfection.
            </p>
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: '#3b82f6', color: '#ffffff' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="px-16 py-6 bg-slate-900 dark:bg-white text-white dark:text-luxury-black rounded-full font-black text-xs uppercase tracking-[0.4em] shadow-2xl shadow-luxury-blue/20 transition-all duration-500 active:scale-95"
            >
              Start Free Trial
            </motion.button>
          </motion.div>
        </div>
        
        {/* Decorative BG */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-luxury-blue/5 rounded-full blur-[200px] -z-10" />
      </section>

      <MarketingFooter />
    </div>
  )
}
