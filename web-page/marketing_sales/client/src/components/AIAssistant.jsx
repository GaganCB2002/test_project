import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Bot, User } from 'lucide-react';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I am Vortex AI, your strategic intelligence partner. How can I help you optimize your sales today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');

    // Mock AI response
    setTimeout(() => {
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: "I've analyzed your current campaigns. 'Summer Sale 2024' is performing 15% better than average. I recommend increasing the budget by 20% to maximize ROI." 
      }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="glass-card w-96 h-[500px] mb-4 flex flex-col overflow-hidden shadow-2xl border-primary-500/20"
          >
            <div className="p-4 bg-primary-600 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Sparkles size={20} />
                <span className="font-bold">AI Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start space-x-2 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      msg.role === 'assistant' ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                    </div>
                    <div className={`p-3 rounded-2xl text-sm ${
                      msg.role === 'assistant' 
                        ? 'bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700' 
                        : 'bg-primary-600 text-white'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  placeholder="Ask anything..." 
                  className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary-500/20 transition-all"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button 
                  onClick={handleSend}
                  className="p-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-primary-300 dark:shadow-primary-900/40 relative group"
      >
        <Sparkles size={28} />
        <span className="absolute right-full mr-4 px-3 py-1 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          How can I help?
        </span>
      </motion.button>
    </div>
  );
};

export default AIAssistant;
