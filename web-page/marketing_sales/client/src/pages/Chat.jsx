import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';
import { Send, User, Hash, Search, Plus, MoreVertical } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState(null);
  const scrollRef = useRef();

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.emit('join_room', user?.companyId || 'general');

    newSocket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => newSocket.close();
  }, [user]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !socket) return;

    const messageData = {
      room: user?.companyId || 'general',
      sender: user?.name || 'Anonymous',
      content: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    socket.emit('send_message', messageData);
    setInput('');
  };

  const channels = ['marketing-team', 'sales-deals', 'announcements', 'general'];
  const teamMembers = [
    { name: 'Sarah Miller', status: 'online', role: 'Manager' },
    { name: 'John Cooper', status: 'offline', role: 'Executive' },
    { name: 'Emma Wilson', status: 'online', role: 'Admin' },
  ];

  return (
    <div className="h-[calc(100vh-12rem)] flex glass-card overflow-hidden">
      {/* Channels Sidebar */}
      <div className="w-64 border-r border-slate-200 dark:border-slate-800 flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="Search chat..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border-none rounded-lg text-xs"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          <div className="mb-6">
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Channels</span>
              <Plus size={14} className="text-slate-400 cursor-pointer hover:text-primary-600" />
            </div>
            {channels.map(channel => (
              <div key={channel} className={`flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${channel === 'general' ? 'bg-primary-50 dark:bg-primary-900/10 text-primary-600' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                <Hash size={16} className={channel === 'general' ? 'text-primary-600' : 'text-slate-400'} />
                <span className="text-sm font-medium">{channel}</span>
              </div>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Direct Messages</span>
            </div>
            {teamMembers.map(member => (
              <div key={member.name} className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold">
                      {member.name[0]}
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 border-2 border-white dark:border-slate-800 rounded-full ${member.status === 'online' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium truncate">{member.name}</p>
                    <p className="text-[10px] text-slate-500">{member.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900/50">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Hash size={20} className="text-slate-400" />
            <h3 className="font-bold">general</h3>
            <span className="text-xs text-slate-400 font-normal ml-2">Internal team discussions</span>
          </div>
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
            <MoreVertical size={18} className="text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              key={i} 
              className="flex items-start space-x-3"
            >
              <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/20 text-primary-600 flex items-center justify-center font-bold">
                {msg.sender[0]}
              </div>
              <div>
                <div className="flex items-baseline space-x-2">
                  <span className="font-bold text-sm">{msg.sender}</span>
                  <span className="text-[10px] text-slate-400">{msg.time}</span>
                </div>
                <div className="mt-1 text-sm bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-700 max-w-md">
                  {msg.content}
                </div>
              </div>
            </motion.div>
          ))}
          <div ref={scrollRef} />
        </div>

        <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
            <input 
              type="text" 
              placeholder="Type your message..." 
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-2"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-md shadow-primary-200"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
