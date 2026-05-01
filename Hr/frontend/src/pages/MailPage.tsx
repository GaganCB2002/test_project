import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Inbox, Send, Trash2, FileEdit, Star, Search, X, Loader2, Paperclip, SendHorizontal } from 'lucide-react'
import { api } from '../api/client'
import { SectionCard } from '../components/ui/SectionCard'
import type { User, InternalEmail } from '../types'

interface MailPageProps {
  user: User
  token: string
}

export function MailPage({ user, token }: MailPageProps) {
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent' | 'favorites' | 'trash'>('inbox')
  const [mails, setMails] = useState<InternalEmail[]>([])
  const [selectedMail, setSelectedMail] = useState<InternalEmail | null>(null)
  const [isComposing, setIsComposing] = useState(false)
  const [loading, setLoading] = useState(true)
  
  const [composeForm, setComposeForm] = useState({
    receiverId: '',
    subject: '',
    body: ''
  })

  useEffect(() => {
    fetchMails()
  }, [activeTab])

  const fetchMails = async () => {
    setLoading(true)
    try {
      const data = await api.getInbox(token)
      // Filter by folder if implemented in service, otherwise filter here
      setMails(data.filter(m => {
        if (activeTab === 'sent') return m.senderId === user.id
        return m.receiverId === user.id && m.folder === activeTab
      }))
    } catch (err) {
      console.error('Failed to fetch mails', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.sendMail(composeForm, token)
      setIsComposing(false)
      setComposeForm({ receiverId: '', subject: '', body: '' })
      fetchMails()
    } catch (err) {
      alert('Failed to send mail')
    }
  }

  return (
    <div className="glass-panel flex h-[calc(100vh-12rem)] overflow-hidden dark:border-slate-800 dark:bg-slate-900/50 relative">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-950/20">
        <button 
          onClick={() => setIsComposing(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-bold text-white shadow-lg shadow-brand/20 transition hover:scale-[1.02] active:scale-95"
        >
          <FileEdit className="h-4 w-4" />
          Compose
        </button>

        <nav className="mt-8 space-y-1">
          {[
            { id: 'inbox', label: 'Inbox', icon: Inbox },
            { id: 'sent', label: 'Sent', icon: Send },
            { id: 'favorites', label: 'Starred', icon: Star },
            { id: 'trash', label: 'Trash', icon: Trash2 },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                activeTab === item.id 
                ? 'bg-slate-200/50 text-slate-900 dark:bg-slate-800 dark:text-white' 
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`h-4 w-4 ${activeTab === item.id ? 'text-brand' : 'opacity-50'}`} />
                {item.label}
              </div>
            </button>
          ))}
        </nav>
      </aside>

      {/* List */}
      <div className="flex w-96 flex-col border-r border-slate-200 dark:border-slate-800">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search mail..." 
              className="w-full rounded-xl border-none bg-slate-100 py-2 pl-10 pr-4 text-sm dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-brand"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
             <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-brand" />
             </div>
          ) : mails.length === 0 ? (
             <div className="py-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest opacity-50">
               No messages here
             </div>
          ) : mails.map(mail => (
            <button
              key={mail.id}
              onClick={() => setSelectedMail(mail)}
              className={`flex w-full border-b border-slate-50 p-4 text-left transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/30 ${
                selectedMail?.id === mail.id ? 'bg-slate-100/50 dark:bg-slate-800/50' : ''
              }`}
            >
              <div className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${mail.read ? 'bg-transparent' : 'bg-brand'}`} />
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{mail.senderName}</span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(mail.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <p className="mt-0.5 text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{mail.subject}</p>
                <p className="mt-0.5 text-xs text-slate-500 truncate">{mail.body}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col bg-white dark:bg-slate-900/20">
        <AnimatePresence mode="wait">
          {selectedMail ? (
            <motion.div
              key={selectedMail.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex h-full flex-col"
            >
              <header className="border-b border-slate-100 p-6 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{selectedMail.subject}</h3>
                  <div className="flex gap-2">
                    <button className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800"><Star className="h-5 w-5 text-slate-400" /></button>
                    <button className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800"><Trash2 className="h-5 w-5 text-slate-400" /></button>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-brand/10 text-brand font-bold text-sm">
                    {selectedMail.senderName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedMail.senderName}</p>
                    <p className="text-xs text-slate-500">{new Date(selectedMail.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              </header>
              <div className="flex-1 p-8 text-slate-600 dark:text-slate-300">
                <div className="max-w-2xl mx-auto py-10 whitespace-pre-wrap leading-relaxed font-medium">
                   {selectedMail.body}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-12 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-[32px] bg-slate-50 dark:bg-slate-800">
                <Mail className="h-10 w-10 text-slate-200 dark:text-slate-700" />
              </div>
              <p className="mt-6 text-sm font-bold text-slate-400 uppercase tracking-widest">Select a message to read</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Compose Modal */}
      <AnimatePresence>
        {isComposing && (
          <>
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="absolute inset-0 bg-slate-950/20 backdrop-blur-sm z-40"
               onClick={() => setIsComposing(false)}
            />
            <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="absolute bottom-6 right-6 w-[500px] bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden"
            >
               <header className="bg-slate-900 px-6 py-4 flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white uppercase tracking-widest">New Message</h4>
                  <button onClick={() => setIsComposing(false)} className="text-white/50 hover:text-white"><X size={18} /></button>
               </header>
               <form onSubmit={handleSend} className="p-6 space-y-4">
                  <div className="space-y-2">
                     <p className="px-1 text-[10px] font-black uppercase text-slate-400 tracking-widest">To (Employee ID)</p>
                     <input 
                        type="text" required
                        value={composeForm.receiverId}
                        onChange={e => setComposeForm({...composeForm, receiverId: e.target.value})}
                        className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-brand dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        placeholder="e.g. emp-102"
                     />
                  </div>
                  <div className="space-y-2">
                     <p className="px-1 text-[10px] font-black uppercase text-slate-400 tracking-widest">Subject</p>
                     <input 
                        type="text" required
                        value={composeForm.subject}
                        onChange={e => setComposeForm({...composeForm, subject: e.target.value})}
                        className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-brand dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        placeholder="Mail subject"
                     />
                  </div>
                  <div className="space-y-2">
                     <p className="px-1 text-[10px] font-black uppercase text-slate-400 tracking-widest">Message Content</p>
                     <textarea 
                        rows={6} required
                        value={composeForm.body}
                        onChange={e => setComposeForm({...composeForm, body: e.target.value})}
                        className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 text-sm font-bold focus:ring-2 focus:ring-brand dark:bg-slate-800 dark:border-slate-700 dark:text-white resize-none"
                     />
                  </div>
                  <div className="flex items-center justify-between pt-2">
                     <button type="button" className="text-slate-400 hover:text-brand"><Paperclip size={20} /></button>
                     <button type="submit" className="flex items-center gap-2 rounded-2xl bg-brand px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand/20 transition hover:scale-105 active:scale-95">
                        <SendHorizontal size={18} />
                        Send Now
                     </button>
                  </div>
               </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
