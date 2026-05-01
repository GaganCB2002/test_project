import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Search,
  Plus,
  MoreVertical,
  Hash,
  AtSign,
  Smile,
  Paperclip,
  Phone,
  Video,
} from 'lucide-react';

const mockChannels = [
  { id: 1, name: 'engineering-general', unread: 3 },
  { id: 2, name: 'sprint-planning', unread: 0 },
  { id: 3, name: 'backend-devs', unread: 12 },
  { id: 4, name: 'frontend-ux', unread: 0 },
];

const mockDMs = [
  { id: 101, name: 'Sarah Chen', status: 'online', avatar: 'SC' },
  { id: 102, name: 'Mike Johnson', status: 'away', avatar: 'MJ' },
  { id: 103, name: 'Alex Kim', status: 'offline', avatar: 'AK' },
];

const Chat = () => {
  const [activeTab, setActiveTab] = useState('engineering-general');
  const [message, setMessage] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeTab]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-[calc(100vh-140px)] flex gap-6"
    >
      {/* Sidebar */}
      <div className="w-72 flex-shrink-0 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Workspace</h2>
            <button className="p-2 rounded-xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/20">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Jump to..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border border-transparent rounded-xl text-sm outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-none">
          {/* Channels */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-4 mb-3">Channels</h3>
            <div className="space-y-1">
              {mockChannels.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setActiveTab(ch.name)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all ${
                    activeTab === ch.name
                      ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Hash className={`w-4 h-4 ${activeTab === ch.name ? 'text-white' : 'text-slate-400'}`} />
                    <span className="text-sm font-semibold">{ch.name}</span>
                  </div>
                  {ch.unread > 0 && activeTab !== ch.name && (
                    <span className="bg-indigo-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {ch.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Direct Messages */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-4 mb-3">Direct Messages</h3>
            <div className="space-y-1">
              {mockDMs.map((dm) => (
                <button
                  key={dm.id}
                  onClick={() => setActiveTab(dm.name)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                    activeTab === dm.name
                      ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="relative">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                      {dm.avatar}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${
                      dm.status === 'online' ? 'bg-emerald-500' : dm.status === 'away' ? 'bg-yellow-500' : 'bg-slate-400'
                    }`} />
                  </div>
                  <span className="text-sm font-semibold">{dm.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chat View */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm relative">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
              <Hash className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">#{activeTab}</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Engineering Department</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400"><Phone className="w-5 h-5" /></button>
            <button className="p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400"><Video className="w-5 h-5" /></button>
            <button className="p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400"><MoreVertical className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-none">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">SC</div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-bold text-slate-900 dark:text-white">Sarah Chen</span>
                <span className="text-[10px] text-slate-400 font-bold">10:45 AM</span>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-600 dark:text-slate-300">Has everyone reviewed the new API documentation? We need to finalize it by EOD.</p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4 flex-row-reverse">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-white font-bold">YOU</div>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-[10px] text-slate-400 font-bold">10:47 AM</span>
                <span className="font-bold text-slate-900 dark:text-white">You</span>
              </div>
              <div className="bg-indigo-500 p-4 rounded-2xl rounded-tr-none shadow-lg shadow-indigo-500/20">
                <p className="text-sm text-white">Working on it now! Should be ready in about an hour.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="p-6">
          <div className="bg-slate-100 dark:bg-slate-950 p-2 rounded-[24px] border border-slate-200 dark:border-slate-800 focus-within:border-indigo-500/50 transition-all flex items-end gap-2 shadow-inner">
            <button className="p-3 text-slate-400 hover:text-indigo-500 transition-colors"><Paperclip className="w-5 h-5" /></button>
            <textarea
              rows={1}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Message #${activeTab}`}
              className="flex-1 bg-transparent border-none outline-none py-3 px-2 text-sm text-slate-900 dark:text-white resize-none"
            />
            <div className="flex items-center gap-1">
              <button className="p-3 text-slate-400 hover:text-indigo-500 transition-colors"><Smile className="w-5 h-5" /></button>
              <button className="p-3 text-slate-400 hover:text-indigo-500 transition-colors"><AtSign className="w-5 h-5" /></button>
              <button className="p-3 bg-indigo-500 text-white rounded-2xl shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all"><Send className="w-5 h-5" /></button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Chat;
