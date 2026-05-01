import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Copy, RefreshCw, Mail, Layout } from 'lucide-react';
import api from '../../utils/api';

const EmailGenerator = () => {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Professional');
  const [loading, setLoading] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState('');

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      // For demo, we'll use a timeout if no real API
      setTimeout(() => {
        setGeneratedEmail(`Subject: Boost your efficiency with AI Nexus!\n\nHi [Customer Name],\n\nI noticed your interest in optimizing your sales workflow. At AI Nexus, we specialize in helping organizations like yours leverage intelligence to drive results.\n\nOur platform offers:\n- Real-time lead scoring\n- Automated pipeline management\n- AI-driven campaign insights\n\nWould you be open to a 10-minute discovery call next Tuesday?\n\nBest regards,\n[Your Name]`);
        setLoading(false);
      }, 1500);
      
      // Real API Call:
      // const res = await api.post('/campaigns/generate-email', { topic, tone });
      // setGeneratedEmail(res.data.data);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedEmail);
    alert('Copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">AI Email Generator</h1>
          <p className="text-slate-500">Create high-converting marketing emails in seconds.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <div className="glass-card p-6 h-fit space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold">What is the email about?</label>
            <textarea 
              className="w-full h-32 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 text-sm"
              placeholder="E.g., A follow-up email for a summer sale campaign targeting tech startups..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Tone of Voice</label>
            <div className="grid grid-cols-2 gap-2">
              {['Professional', 'Friendly', 'Urgent', 'Casual'].map(t => (
                <button 
                  key={t}
                  onClick={() => setTone(t)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${tone === t ? 'bg-primary-600 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 hover:bg-slate-100'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={loading || !topic}
            className="w-full btn-primary py-3 flex items-center justify-center space-x-2"
          >
            {loading ? <RefreshCw className="animate-spin" size={20} /> : <Sparkles size={20} />}
            <span>Generate Content</span>
          </button>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="wait">
            {generatedEmail ? (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card h-full flex flex-col overflow-hidden"
              >
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white/50">
                  <div className="flex items-center space-x-2">
                    <Layout size={18} className="text-primary-600" />
                    <span className="font-bold text-sm">Generated Preview</span>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={copyToClipboard}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500"
                    >
                      <Copy size={18} />
                    </button>
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500">
                      <Send size={18} />
                    </button>
                  </div>
                </div>
                <div className="flex-1 p-8 bg-white dark:bg-slate-900/50 overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-sans text-slate-700 dark:text-slate-300 leading-relaxed">
                    {generatedEmail}
                  </pre>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card h-full flex flex-col items-center justify-center p-12 text-center border-dashed"
              >
                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                  <Mail size={40} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-bold mb-2">No Content Yet</h3>
                <p className="text-slate-500 max-w-xs">Configure your campaign details on the left and click generate to see the magic happen.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default EmailGenerator;
