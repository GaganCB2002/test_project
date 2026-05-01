import { motion } from 'framer-motion'
import { Mail, Clock, User, CheckCircle2, MessageSquare, Reply, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Message {
  _id: string
  username: string
  email: string
  subject: string
  message: string
  status: 'new' | 'read' | 'replied'
  createdAt: string
}

export function MessageCenter() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMessages = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/contact/all')
      const data = await response.json()
      setMessages(data)
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`http://localhost:5000/api/contact/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      fetchMessages()
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-luxury-blue border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold">Inbound Transmissions</h3>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global Communication Nexus</p>
        </div>
        <button onClick={fetchMessages} className="p-2 hover:bg-white/5 rounded-lg transition">
          <Clock size={16} className="text-slate-500" />
        </button>
      </div>

      <div className="grid gap-4">
        {messages.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-[32px] border border-dashed border-white/10">
            <Mail className="h-10 w-10 text-slate-700 mx-auto mb-4" />
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">No transmissions detected</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <motion.div
              key={msg._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-[32px] border transition-all ${
                msg.status === 'new' 
                  ? 'bg-luxury-blue/5 border-luxury-blue/20 shadow-lg shadow-luxury-blue/5' 
                  : 'bg-white/5 border-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${
                    msg.status === 'new' ? 'bg-luxury-blue text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    <User size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">{msg.username}</h4>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{msg.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {msg.status === 'new' && (
                    <span className="px-3 py-1 bg-luxury-blue/20 text-luxury-blue text-[8px] font-black uppercase tracking-widest rounded-full">New</span>
                  )}
                  <span className="text-[10px] font-bold text-slate-600">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <h5 className="text-xs font-black uppercase tracking-widest text-luxury-blue mb-2">{msg.subject}</h5>
                <p className="text-sm text-slate-400 leading-relaxed">{msg.message}</p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex gap-4">
                  <button 
                    onClick={() => updateStatus(msg._id, 'read')}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition"
                  >
                    <CheckCircle2 size={14} /> Mark Read
                  </button>
                  <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition">
                    <Reply size={14} /> Reply
                  </button>
                </div>
                <button className="p-2 text-slate-600 hover:text-rose-500 transition">
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
