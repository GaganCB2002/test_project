import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, User, Mail, MessageSquare, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  })
  const [isSending, setIsSending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)
    
    try {
      const response = await fetch('http://localhost:8081/api/contact/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        setIsSuccess(true)
        setTimeout(() => {
          setIsSuccess(false)
          onClose()
          setFormData({ username: '', email: '', subject: 'General Inquiry', message: '' })
        }, 3000)
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8">
          {/* Backdrop with smooth fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[-1]"
          />

          {/* Centered Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-xl bg-white dark:bg-gradient-to-br dark:from-[#0a0a0a] dark:to-[#111111] border border-slate-200 dark:border-white/10 p-8 md:p-10 rounded-[40px] shadow-2xl dark:shadow-[0_0_80px_rgba(59,130,246,0.12)] relative overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            {/* Animated background glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-luxury-blue/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-luxury-cyan/10 rounded-full blur-[80px] pointer-events-none" />

            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-white transition-all hover:rotate-90 duration-300 z-10"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>

            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="h-20 w-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/10">
                  <CheckCircle2 size={40} className="text-emerald-500" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black uppercase italic mb-4 text-slate-900 dark:text-white tracking-tighter">Message <span className="text-emerald-500">Sent Successfully.</span></h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">Your transmission has been received by our core systems.</p>
              </motion.div>
            ) : (
              <div className="relative z-10">
                <div className="mb-8">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h2 className="text-4xl md:text-5xl font-black uppercase italic mb-3 text-slate-900 dark:text-white tracking-tighter">
                      Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-luxury-blue to-luxury-cyan">Nexus.</span>
                    </h2>
                    <p className="text-slate-800 dark:text-white font-bold text-lg lg:text-xl leading-relaxed">
                      Initiate a secure communication protocol.
                    </p>
                  </motion.div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white ml-2 flex items-center gap-2">
                        <User size={16} className="text-luxury-blue" /> Identity
                      </label>
                      <input 
                        required
                        type="text"
                        placeholder="Your display name"
                        className="w-full bg-slate-50 dark:bg-white/5 border-2 border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-luxury-blue focus:bg-white dark:focus:bg-white/10 text-slate-900 dark:text-white text-lg font-bold transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        value={formData.username}
                        onChange={e => setFormData({ ...formData, username: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white ml-2 flex items-center gap-2">
                        <Mail size={16} className="text-luxury-blue" /> Signal Origin
                      </label>
                      <input 
                        required
                        type="email"
                        placeholder="email@nexus.io"
                        className="w-full bg-slate-50 dark:bg-white/5 border-2 border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-luxury-blue focus:bg-white dark:focus:bg-white/10 text-slate-900 dark:text-white text-lg font-bold transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white ml-2 flex items-center gap-2">
                      <MessageSquare size={16} className="text-luxury-blue" /> Transmission Data
                    </label>
                    <textarea 
                      required
                      rows={4}
                      placeholder="Compose your message..."
                      className="w-full bg-slate-50 dark:bg-white/5 border-2 border-slate-200 dark:border-white/10 rounded-[32px] px-6 py-5 focus:outline-none focus:border-luxury-blue focus:bg-white dark:focus:bg-white/10 text-slate-900 dark:text-white text-lg font-bold transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSending}
                    className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black text-sm uppercase tracking-[0.3em] shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-3 mt-2 hover:bg-luxury-blue dark:hover:bg-luxury-blue hover:text-white transition-colors group"
                  >
                    {isSending ? (
                      <div className="flex items-center gap-3">
                        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Transmitting...
                      </div>
                    ) : (
                      <>
                        Send Transmission <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
