import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Monitor, 
  PhoneOff, 
  Users, 
  Settings, 
  MessageSquare,
  Grid,
  MoreHorizontal,
  Hand,
  Share
} from 'lucide-react';

export function MeetingRoom({ user }: { user: any }) {
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participants] = useState([
    { id: 1, name: 'Sophia (HR)', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia', active: true },
    { id: 2, name: 'David (Dev)', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', active: false },
    { id: 3, name: 'Sarah (Lead)', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', active: false },
  ]);

  return (
    <div className="flex h-[calc(100vh-100px)] bg-[#0f172a] rounded-[40px] overflow-hidden border border-white/5 shadow-2xl relative">
      {/* Main Grid */}
      <div className="flex-1 p-6 relative flex flex-col">
        <div className="flex-1 grid grid-cols-2 gap-4">
          {/* Main User View */}
          <motion.div 
            layout
            className="relative rounded-3xl overflow-hidden bg-slate-900 border border-white/10 group shadow-2xl"
          >
            {isCameraOn ? (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                 <div className="text-center">
                   <div className="h-24 w-24 rounded-full bg-brand/20 flex items-center justify-center mx-auto border border-brand/50 animate-pulse">
                      <span className="text-4xl font-bold text-brand">{user.name[0]}</span>
                   </div>
                   <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">Self View Active</p>
                 </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
                <div className="h-20 w-20 rounded-full bg-slate-900 flex items-center justify-center border border-white/5">
                  <VideoOff className="text-slate-600" />
                </div>
              </div>
            )}
            
            <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-white uppercase tracking-wider">{user.name} (You)</span>
            </div>
          </motion.div>

          {/* Participant 1 */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-white/10">
             <img src={participants[0].img} className="absolute inset-0 w-full h-full object-cover opacity-20 blur-xl" alt="" />
             <div className="absolute inset-0 flex items-center justify-center">
                <img src={participants[0].img} className="h-24 w-24 rounded-full border-2 border-brand/30 shadow-2xl" alt="" />
             </div>
             <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-bold text-white uppercase tracking-wider">{participants[0].name}</span>
            </div>
          </div>
        </div>

        {/* Floating Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 px-8 py-4 bg-slate-900/80 backdrop-blur-2xl rounded-full border border-white/10 shadow-2xl">
          <button 
            onClick={() => setIsMicOn(!isMicOn)}
            className={`p-4 rounded-2xl transition-all ${isMicOn ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'}`}
          >
            {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
          </button>
          
          <button 
            onClick={() => setIsCameraOn(!isCameraOn)}
            className={`p-4 rounded-2xl transition-all ${isCameraOn ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'}`}
          >
            {isCameraOn ? <Video size={20} /> : <VideoOff size={20} />}
          </button>

          <button 
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            className={`p-4 rounded-2xl transition-all ${isScreenSharing ? 'bg-emerald-500 text-white' : 'bg-white/5 text-white hover:bg-white/10'}`}
          >
            <Monitor size={20} />
          </button>

          <div className="w-[1px] h-8 bg-white/10 mx-2" />

          <button className="p-4 rounded-2xl bg-white/5 text-white hover:bg-white/10">
            <Hand size={20} />
          </button>
          
          <button className="p-4 rounded-2xl bg-white/5 text-white hover:bg-white/10">
            <Grid size={20} />
          </button>

          <button className="p-4 rounded-2xl bg-rose-600 text-white shadow-xl shadow-rose-600/30 hover:scale-110 active:scale-95 transition-all">
            <PhoneOff size={20} />
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 border-l border-white/5 bg-slate-950/40 p-6 flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-bold text-white flex items-center gap-2">
            <Users size={18} className="text-brand" />
            Participants
          </h3>
          <span className="px-2 py-0.5 rounded-lg bg-brand/10 text-brand text-[10px] font-bold">4 LIVE</span>
        </div>

        <div className="space-y-4 flex-1">
          {participants.map(p => (
            <div key={p.id} className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
              <img src={p.img} className="h-10 w-10 rounded-xl bg-slate-800" alt="" />
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-200">{p.name}</p>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Connected</p>
              </div>
              {p.active && <div className="h-2 w-2 rounded-full bg-brand animate-ping" />}
            </div>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-white/5">
          <button className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-brand text-white text-sm font-bold shadow-lg shadow-brand/20 hover:scale-[1.02] transition">
            <Share size={18} />
            Invite Others
          </button>
        </div>
      </div>
    </div>
  );
}
