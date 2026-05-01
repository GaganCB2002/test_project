import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneOff, 
  Users, 
  MessageSquare, 
  Settings, 
  Share2, 
  MoreHorizontal,
  LayoutGrid,
  ShieldCheck,
  Zap,
  Maximize2,
  Send
} from 'lucide-react'
import React, { useState, useEffect } from 'react'

export function MeetingRoom() {
  const [isMuted, setIsMuted] = useState(false)
  const [isCameraOff, setIsCameraOff] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [activeSpeaker, setActiveSpeaker] = useState('Sarah Jenkins')
  const [showChat, setShowChat] = useState(false)

  const participants = [
    { name: 'You (Command)', status: 'active', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop' },
    { name: 'Sarah Jenkins', status: 'speaking', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
    { name: 'Marcus Chen', status: 'muted', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop' },
    { name: 'Elena Rodriguez', status: 'active', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' }
  ]

  return (
    <div className="flex h-[calc(100vh-14rem)] bg-slate-900 dark:bg-black rounded-[48px] overflow-hidden border border-white/5 relative shadow-2xl animate-in zoom-in duration-700">
      {/* Main Video Grid */}
      <div className="flex-1 p-8 relative flex flex-col">
        <header className="absolute top-8 left-8 right-8 z-10 flex items-center justify-between pointer-events-none">
           <div className="flex items-center gap-4 p-4 glass-panel bg-black/40 backdrop-blur-xl border-white/10 rounded-2xl pointer-events-auto">
              <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Board Meeting: Quarter 2 Strategic Sync</p>
              <div className="h-4 w-px bg-white/10 mx-2" />
              <div className="flex items-center gap-2 text-slate-400">
                 <Users size={12} />
                 <span className="text-[10px] font-bold">12</span>
              </div>
           </div>

           <div className="p-4 glass-panel bg-black/40 backdrop-blur-xl border-white/10 rounded-2xl flex items-center gap-4 pointer-events-auto">
              <ShieldCheck size={16} className="text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">Encrypted Signal</span>
           </div>
        </header>

        <div className="flex-1 grid grid-cols-2 gap-6 items-center justify-center">
           {participants.slice(0, 4).map((p, i) => (
             <motion.div 
               key={p.name}
               layoutId={p.name}
               className={`relative h-full w-full rounded-[40px] overflow-hidden bg-slate-800 border-2 transition-all duration-500 ${
                 p.status === 'speaking' ? 'border-luxury-blue shadow-2xl shadow-luxury-blue/20 scale-[1.02] z-10' : 'border-white/5'
               }`}
             >
                {/* Simulated Video Placeholder */}
                <img 
                  src={`https://images.unsplash.com/photo-${1500000000000 + i}?auto=format&fit=crop&q=80&w=800`} 
                  className="w-full h-full object-cover opacity-60 mix-blend-luminosity"
                  alt="Video"
                />
                
                {/* Watermark/UI Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                <div className="absolute bottom-6 left-6 flex items-center gap-3">
                   <div className="h-10 w-10 rounded-xl overflow-hidden border border-white/20">
                      <img src={p.avatar} className="w-full h-full object-cover" alt="Avatar" />
                   </div>
                   <div>
                      <p className="text-xs font-black uppercase tracking-widest text-white">{p.name}</p>
                      {p.status === 'speaking' && (
                        <div className="flex gap-1 mt-1">
                           {[1, 2, 3].map(j => (
                             <motion.div 
                               key={j}
                               animate={{ height: [4, 12, 4] }}
                               transition={{ repeat: Infinity, duration: 0.5, delay: j * 0.1 }}
                               className="w-1 bg-luxury-blue rounded-full"
                             />
                           ))}
                        </div>
                      )}
                   </div>
                </div>

                {p.status === 'muted' && (
                  <div className="absolute top-6 right-6 h-8 w-8 rounded-lg bg-rose-500/20 text-rose-500 flex items-center justify-center backdrop-blur-md border border-rose-500/20">
                     <MicOff size={14} />
                  </div>
                )}
             </motion.div>
           ))}
        </div>

        {/* Floating Controls */}
        <footer className="mt-8 flex justify-center">
           <div className="flex items-center gap-4 p-6 glass-panel bg-black/40 backdrop-blur-2xl border-white/10 rounded-[32px] shadow-2xl shadow-black/50">
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all ${
                  isMuted ? 'bg-rose-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
              </button>

              <button 
                onClick={() => setIsCameraOff(!isCameraOff)}
                className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all ${
                  isCameraOff ? 'bg-rose-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {isCameraOff ? <VideoOff size={24} /> : <Video size={24} />}
              </button>

              <div className="h-8 w-px bg-white/10 mx-2" />

              <button className="h-14 w-14 rounded-2xl bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-all">
                <Share2 size={24} />
              </button>

              <button 
                onClick={() => setShowChat(!showChat)}
                className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all ${
                  showChat ? 'bg-luxury-blue text-white' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <MessageSquare size={24} />
              </button>

              <button className="h-14 w-14 rounded-2xl bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-all">
                <LayoutGrid size={24} />
              </button>

              <div className="h-8 w-px bg-white/10 mx-2" />

              <button className="h-14 w-28 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-rose-600/20 group">
                <PhoneOff size={20} className="group-hover:rotate-[135deg] transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">End</span>
              </button>
           </div>
        </footer>
      </div>

      {/* Side Panel (Chat) */}
      <AnimatePresence>
        {showChat && (
          <motion.aside 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 400, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-l border-white/5 bg-black/40 backdrop-blur-3xl overflow-hidden flex flex-col"
          >
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Tactical Comms</h3>
               <button onClick={() => setShowChat(false)} className="text-slate-500 hover:text-white">
                  <MoreHorizontal size={20} />
               </button>
            </div>
            
            <div className="flex-1 p-8 space-y-6 overflow-y-auto custom-scrollbar">
               {[
                 { from: 'Sarah Jenkins', text: 'Have we finalized the infrastructure paths for the Alpha release?', time: '10:02 AM' },
                 { from: 'Marcus Chen', text: 'Confirmed. All service ports are aligned with the Master Hub spec.', time: '10:04 AM' },
                 { from: 'Elena Rodriguez', text: 'I am seeing some latency in the Mumbai region login service. Investigating.', time: '10:05 AM' }
               ].map((msg, i) => (
                 <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                       <p className="text-[10px] font-black uppercase text-luxury-blue">{msg.from}</p>
                       <span className="text-[8px] text-slate-500 font-bold">{msg.time}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium bg-white/5 p-4 rounded-2xl border border-white/5">{msg.text}</p>
                 </div>
               ))}
            </div>

            <div className="p-8 border-t border-white/5">
               <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Broadcast message..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-xs font-bold text-white outline-none focus:border-luxury-blue transition-all"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 bg-luxury-blue rounded-xl flex items-center justify-center text-white">
                     <Send size={16} />
                  </button>
               </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Decorative corner light */}
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-luxury-blue/20 rounded-full blur-[100px] pointer-events-none" />
    </div>
  )
}
