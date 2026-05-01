import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Hash, Search, MoreVertical, Paperclip, Smile, ShieldCheck, User, Zap, Terminal } from 'lucide-react'
import { api } from '../api/client'
import { socket } from '../api/socket'
import type { User as UserType } from '../types'

interface ChatPageProps {
  user: UserType
  token: string
}

export function ChatPage({ user, token }: ChatPageProps) {
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [channels] = useState([
    { id: 'gen', name: 'general-command', type: 'channel' },
    { id: 'tech', name: 'engineering-ops', type: 'channel' },
    { id: 'hr-confidential', name: 'executive-leads', type: 'channel' }
  ])
  const [activeChannel, setActiveChannel] = useState(channels[0])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    socket.emit('join_room', activeChannel.id)
    fetchMessages()

    const handleNewMessage = (msg: any) => {
      if (msg.groupId === activeChannel.id) {
        setMessages(prev => [...prev, msg])
      }
    }

    socket.on('new_message', handleNewMessage)
    return () => { socket.off('new_message', handleNewMessage) }
  }, [activeChannel])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchMessages = async () => {
    const data = await api.getChatMessages(token, undefined, activeChannel.id)
    setMessages(data)
  }

  const handleSend = async (e: React.FormEvent, fileData?: { name: string; url: string }) => {
    e.preventDefault()
    if (!input.trim() && !fileData) return

    await api.sendMessage({
      groupId: activeChannel.id,
      content: fileData ? `shared an encrypted file: ${fileData.name}` : input,
      type: fileData ? 'file' : 'text',
      fileUrl: fileData?.url
    }, token)
    
    setInput('')
  }

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    handleSend(e as any, { name: file.name, url: URL.createObjectURL(file) })
  }

  return (
    <div className="glass-panel flex h-[calc(100vh-14rem)] overflow-hidden border-slate-200 dark:border-white/5 bg-white/50 dark:bg-white/5 rounded-[48px] animate-in fade-in duration-700">
      {/* Sidebar */}
      <aside className="w-80 border-r border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-luxury-black/40 backdrop-blur-xl">
        <div className="p-8">
           <div className="flex items-center gap-3 mb-8">
              <div className="h-8 w-8 rounded-xl bg-luxury-blue/10 flex items-center justify-center text-luxury-blue">
                 <Zap size={18} />
              </div>
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Workspace Hub</h2>
           </div>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-luxury-blue transition-colors" />
            <input 
              type="text" 
              placeholder="Search frequencies..." 
              className="w-full rounded-2xl border border-slate-200 dark:border-white/5 bg-white/50 dark:bg-white/5 py-3 pl-12 pr-4 text-xs font-bold outline-none focus:border-luxury-blue/50 transition-all dark:text-white"
            />
          </div>
        </div>

        <nav className="px-6 space-y-8">
          <div>
            <p className="px-2 text-[8px] font-black uppercase tracking-[0.4em] text-slate-500 mb-4">Operations Channels</p>
            <div className="space-y-2">
              {channels.map(chan => (
                <button
                  key={chan.id}
                  onClick={() => setActiveChannel(chan)}
                  className={`flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 text-xs font-black uppercase tracking-widest transition-all ${
                    activeChannel.id === chan.id 
                    ? 'bg-luxury-blue text-white shadow-xl shadow-luxury-blue/20 italic' 
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 dark:hover:text-white'
                  }`}
                >
                  <Hash size={16} className={activeChannel.id === chan.id ? 'opacity-100' : 'opacity-30'} />
                  {chan.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="p-6 rounded-[32px] bg-luxury-blue/5 border border-luxury-blue/10">
             <div className="flex items-center gap-3 mb-3">
                <ShieldCheck size={16} className="text-luxury-blue" />
                <span className="text-[8px] font-black uppercase tracking-widest text-luxury-blue">Secure Protocol</span>
             </div>
             <p className="text-[10px] font-bold text-slate-500 leading-relaxed italic">All transmissions are encrypted using military-grade RSA algorithms.</p>
          </div>
        </nav>
      </aside>

      {/* Chat Area */}
      <div className="flex flex-1 flex-col bg-transparent">
        <header className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 p-8 bg-white/30 dark:bg-white/5 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-luxury-blue/10 text-luxury-blue">
              <Terminal size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase italic tracking-tight text-slate-900 dark:text-white">#{activeChannel.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                 <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Active Transmission</p>
              </div>
            </div>
          </div>
          <button className="h-10 w-10 rounded-xl hover:bg-slate-50 dark:hover:bg-white/10 flex items-center justify-center text-slate-400 transition-colors">
            <MoreVertical size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="space-y-8 max-w-5xl mx-auto">
            {messages.map((msg, i) => {
              const isMe = msg.senderId === user.id
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[75%] ${isMe ? 'text-right' : 'text-left'}`}>
                    <div className={`mb-2 flex items-center gap-3 px-1 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className="h-6 w-6 rounded-lg bg-slate-100 dark:bg-white/10 flex items-center justify-center text-[10px] font-black text-slate-400">
                         {msg.senderName?.charAt(0) || 'U'}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {isMe ? 'Command' : msg.senderName}
                      </span>
                      <span className="text-[8px] font-bold text-slate-300 opacity-50">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className={`rounded-[24px] px-6 py-4 text-sm font-medium leading-relaxed ${
                      isMe 
                      ? 'bg-luxury-blue text-white shadow-xl shadow-luxury-blue/20' 
                      : 'bg-white dark:bg-luxury-black/60 text-slate-900 dark:text-slate-200 border border-slate-100 dark:border-white/5'
                    }`}>
                      {msg.type === 'file' && (
                         <div className={`flex items-center gap-3 mb-3 p-3 rounded-xl border ${isMe ? 'bg-white/10 border-white/10' : 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5'}`}>
                            <Paperclip size={16} className={isMe ? 'text-white' : 'text-luxury-blue'} />
                            <a href={msg.fileUrl} target="_blank" rel="noreferrer" className="text-xs font-bold underline truncate max-w-[200px]">{msg.content}</a>
                         </div>
                      )}
                      {msg.type !== 'file' ? msg.content : ''}
                    </div>
                  </div>
                </motion.div>
              )
            })}
            <div ref={scrollRef} />
          </div>
        </div>

        <footer className="p-8 border-t border-slate-100 dark:border-white/5 bg-white/30 dark:bg-white/5 backdrop-blur-md">
          <form onSubmit={handleSend} className="relative max-w-5xl mx-auto">
            <input type="file" id="file-upload" className="hidden" onChange={onFileSelect} />
            <div className="absolute left-6 top-1/2 -translate-y-1/2 flex gap-4">
              <button 
                 type="button" 
                 onClick={() => document.getElementById('file-upload')?.click()}
                 className="text-slate-400 hover:text-luxury-blue transition-colors"
              >
                 <Paperclip size={20} />
              </button>
              <button type="button" className="text-slate-400 hover:text-luxury-blue transition-colors"><Smile size={20} /></button>
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Communicate via #${activeChannel.name}...`}
              className="w-full rounded-[32px] border-none bg-slate-100/50 dark:bg-white/5 py-6 pl-24 pr-20 text-sm font-bold placeholder:text-slate-500 outline-none focus:ring-4 focus:ring-luxury-blue/5 transition-all dark:text-white"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-12 w-12 rounded-2xl bg-luxury-blue text-white shadow-xl shadow-luxury-blue/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center"
            >
              <Send size={20} />
            </button>
          </form>
        </footer>
      </div>
    </div>
  )
}
