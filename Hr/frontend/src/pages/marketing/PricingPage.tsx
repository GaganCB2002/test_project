import { motion } from 'framer-motion'
import { CheckCircle2, Star, Zap, ShieldCheck, Globe, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { MarketingNavbar } from '../../components/layout/MarketingNavbar'

export function PricingPage() {
  const navigate = useNavigate()
  
  const plans = [
    {
      name: "Professional",
      price: "₹1,499",
      period: "/user/mo",
      description: "Essential workforce tools for growing high-performance teams.",
      features: ["Live Monitoring", "Basic Analytics", "Departmental Chat", "5GB Storage", "Mobile App Access"],
      icon: Zap,
      recommended: false
    },
    {
      name: "Enterprise",
      price: "₹3,999",
      period: "/user/mo",
      description: "The complete OS for large-scale organizational excellence.",
      features: ["AI Insights & Forecasting", "SSO & SAML Integration", "24/7 Priority Support", "Unlimited Storage", "Dedicated Account Manager", "White-labeling"],
      icon: Star,
      recommended: true
    },
    {
      name: "Bespoke",
      price: "Custom",
      period: "",
      description: "Tailored infrastructure for unique corporate requirements.",
      features: ["On-Premise Deployment", "Custom API Endpoints", "Direct Database Access", "Custom Security Audits", "Bespoke Module Development"],
      icon: ShieldCheck,
      recommended: false
    }
  ]

  return (
    <div className="min-h-screen bg-luxury-black text-white selection:bg-luxury-blue/30 font-sans">
      <MarketingNavbar />
      
      <section className="pt-40 pb-20 px-8">
        <div className="max-w-7xl mx-auto text-center mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-luxury-blue mb-8">Investment Grades</p>
            <h1 className="text-6xl lg:text-8xl font-display font-black tracking-tighter uppercase italic mb-10">Select Your <span className="text-luxury-blue">Tier.</span></h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">Transparent, scalable pricing designed to align with your organizational maturity.</p>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8 items-start">
          {plans.map((plan, i) => (
            <motion.div 
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`relative p-12 rounded-[64px] border transition-all duration-500 ${
                plan.recommended 
                  ? 'bg-luxury-blue border-luxury-blue shadow-2xl shadow-luxury-blue/30 lg:scale-105 z-10' 
                  : 'bg-white/5 border-white/5 hover:bg-white/10'
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-white text-luxury-blue rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                  Most Popular
                </div>
              )}
              
              <div className="mb-10">
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-8 ${plan.recommended ? 'bg-white/20' : 'bg-luxury-blue/10 text-luxury-blue'}`}>
                  <plan.icon size={28} />
                </div>
                <h3 className={`text-2xl font-black uppercase italic mb-4 ${plan.recommended ? 'text-white' : 'text-slate-400'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-8 font-medium ${plan.recommended ? 'text-white/80' : 'text-slate-500'}`}>
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black tracking-tighter">{plan.price}</span>
                  <span className={`text-xs font-bold uppercase tracking-widest ${plan.recommended ? 'text-white/60' : 'text-slate-600'}`}>
                    {plan.period}
                  </span>
                </div>
              </div>

              <div className="space-y-6 mb-12">
                {plan.features.map(feat => (
                  <div key={feat} className="flex items-center gap-4">
                    <CheckCircle2 size={18} className={plan.recommended ? 'text-white' : 'text-luxury-blue'} />
                    <span className={`text-sm font-bold ${plan.recommended ? 'text-white' : 'text-slate-400'}`}>{feat}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => navigate('/login')}
                className={`w-full py-6 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 ${
                  plan.recommended 
                    ? 'bg-white text-luxury-blue hover:bg-luxury-black hover:text-white' 
                    : 'bg-luxury-blue text-white hover:bg-white hover:text-luxury-black shadow-xl shadow-luxury-blue/20'
                }`}
              >
                Acquire License
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Comparison Table Link */}
      <section className="py-20 text-center">
         <button className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white transition flex items-center gap-3 mx-auto">
           View full comparison table <ArrowRight size={14} />
         </button>
      </section>

      <footer className="py-20 px-8 bg-luxury-black text-center border-t border-white/5">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700">© 2026 AuraHR Global • Engineered for Perfection</p>
      </footer>
    </div>
  )
}
