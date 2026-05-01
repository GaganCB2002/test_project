import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Inbox,
  Send,
  Star,
  Trash2,
  AlertCircle,
  Search,
  Plus,
  MoreVertical,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const mockEmails = [
  {
    id: 1,
    sender: 'Sarah Chen',
    email: 'sarah.c@techlead.io',
    subject: 'Sprint Planning Update',
    preview: 'Hi team, I have updated the sprint board with the new task priorities...',
    body: 'Hi team,\n\nI have updated the sprint board with the new task priorities discussed in yesterday\'s meeting. Please review the changes and let me know if you have any questions.\n\nBest,\nSarah',
    date: '10:45 AM',
    read: false,
    starred: true,
    category: 'inbox',
    avatar: 'SC',
  },
  {
    id: 2,
    sender: 'Engineering Dept',
    email: 'eng@techlead.io',
    subject: 'System Maintenance Scheduled',
    preview: 'Please be advised that the staging environment will be down for maintenance...',
    body: 'Hello Engineers,\n\nPlease be advised that the staging environment will be down for maintenance this Saturday from 2:00 AM to 6:00 AM UTC. No action is required from your side.\n\nThanks,\nSystem Admin',
    date: 'Yesterday',
    read: true,
    starred: false,
    category: 'inbox',
    avatar: 'ED',
  },
  {
    id: 3,
    sender: 'Mike Johnson',
    email: 'mike.j@techlead.io',
    subject: 'Code Review: PR #124',
    preview: 'I have left some comments on your pull request regarding the auth flow...',
    body: 'Hey,\n\nI have left some comments on your pull request regarding the auth flow. The logic seems sound but I found a few edge cases we should handle.\n\nRegards,\nMike',
    date: 'Apr 25',
    read: true,
    starred: false,
    category: 'inbox',
    avatar: 'MJ',
  },
];

const Emails = () => {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [activeCategory, setActiveCategory] = useState('inbox');
  const [searchQuery, setSearchQuery] = useState('');

  const sidebarItems = [
    { icon: Inbox, label: 'Inbox', id: 'inbox', count: 2 },
    { icon: Star, label: 'Starred', id: 'starred', count: 0 },
    { icon: Send, label: 'Sent', id: 'sent', count: 0 },
    { icon: AlertCircle, label: 'Spam', id: 'spam', count: 0 },
    { icon: Trash2, label: 'Trash', id: 'trash', count: 0 },
  ];

  const filteredEmails = mockEmails.filter(
    (email) =>
      email.category === activeCategory &&
      (email.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.subject.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="h-[calc(100vh-140px)] flex gap-6"
    >
      {/* Email Sidebar */}
      <div className="w-64 flex-shrink-0 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6">
          <button className="btn-premium w-full flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />
            <span>Compose</span>
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveCategory(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 ${
                activeCategory === item.id
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                <span className="font-semibold text-sm">{item.label}</span>
              </div>
              {item.count > 0 && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeCategory === item.id ? 'bg-white/20' : 'bg-indigo-500/10 text-indigo-500'
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Email List or View */}
      <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-sm">
        <AnimatePresence mode="wait">
          {!selectedEmail ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              {/* List Header */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search in emails..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500/50 rounded-2xl text-sm outline-none transition-all"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Emails List */}
              <div className="flex-1 overflow-y-auto scrollbar-none">
                {filteredEmails.map((email) => (
                  <motion.div
                    key={email.id}
                    variants={itemVariants}
                    onClick={() => setSelectedEmail(email)}
                    className={`flex items-center gap-4 px-6 py-4 border-b border-slate-100 dark:border-slate-800 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                      !email.read ? 'bg-indigo-50/30 dark:bg-indigo-500/5' : ''
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                      {email.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm ${!email.read ? 'font-bold' : 'font-semibold'} text-slate-900 dark:text-white truncate`}>
                          {email.sender}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">{email.date}</span>
                      </div>
                      <h4 className={`text-sm ${!email.read ? 'font-bold' : 'font-medium'} text-slate-700 dark:text-slate-200 truncate`}>
                        {email.subject}
                      </h4>
                      <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-1">
                        {email.preview}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              {/* View Header */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setSelectedEmail(null)}
                  className="flex items-center gap-2 text-sm font-bold text-indigo-500 hover:translate-x-[-4px] transition-transform"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Inbox
                </button>
                <div className="flex items-center gap-2">
                  <button className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"><Star className="w-5 h-5" /></button>
                  <button className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"><Trash2 className="w-5 h-5" /></button>
                  <button className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"><MoreVertical className="w-5 h-5" /></button>
                </div>
              </div>

              {/* Email Content */}
              <div className="flex-1 overflow-y-auto p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                      {selectedEmail.avatar}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedEmail.sender}</h2>
                      <p className="text-sm text-slate-400">{selectedEmail.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-400">{selectedEmail.date}</span>
                    <p className="text-xs text-indigo-500 font-bold mt-1 uppercase tracking-wider">Internal</p>
                  </div>
                </div>

                <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-6">
                  {selectedEmail.subject}
                </h1>

                <div className="bg-slate-100 dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700">
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line text-base">
                    {selectedEmail.body}
                  </p>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 flex items-center gap-4">
                  <button className="btn-premium">Reply</button>
                  <button className="px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">Forward</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Emails;
