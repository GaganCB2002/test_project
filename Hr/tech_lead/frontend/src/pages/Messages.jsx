import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Send,
  Paperclip,
  Image,
  MoreVertical,
  Users,
  Hash,
  MessageSquare,
  Clock,
  CheckCircle,
  CheckCheck,
  X,
  User,
  Edit,
  Trash2,
  Phone,
  Video,
  Bell,
  Smile,
  AtSign,
} from 'lucide-react';
import {
  setCurrentRoom,
  clearCurrentRoom,
  addMessage,
  setMessages,
  setTypingUser,
  removeTypingUser,
  clearTypingUsers,
} from '../store/slices/messageSlice';

// Mock user
const currentUser = {
  id: 'current',
  name: 'Alex Kim',
  avatar: 'AK',
  status: 'online',
};

// Mock rooms
const mockRooms = [
  {
    _id: 'room-1',
    name: 'Engineering Team',
    type: 'channel',
    members: [
      { id: '1', name: 'Alex Kim', avatar: 'AK' },
      { id: '2', name: 'Sarah Chen', avatar: 'SC' },
      { id: '3', name: 'Mike Johnson', avatar: 'MJ' },
    ],
    lastMessage: {
      content: 'The API integration is working now',
      sender: 'Sarah Chen',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
    },
    unreadCount: 3,
  },
  {
    _id: 'room-2',
    name: 'Frontend Dev',
    type: 'channel',
    members: [
      { id: '1', name: 'Alex Kim', avatar: 'AK' },
      { id: '3', name: 'Mike Johnson', avatar: 'MJ' },
      { id: '6', name: 'Lisa Park', avatar: 'LP' },
    ],
    lastMessage: {
      content: 'Component library is ready for review',
      sender: 'Mike Johnson',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
    },
    unreadCount: 0,
  },
  {
    _id: 'room-3',
    name: 'QA Team',
    type: 'channel',
    members: [
      { id: '4', name: 'Emma Davis', avatar: 'ED' },
      { id: '7', name: 'David Brown', avatar: 'DB' },
    ],
    lastMessage: {
      content: 'Test cases updated in the wiki',
      sender: 'Emma Davis',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    unreadCount: 1,
  },
  {
    _id: 'dm-1',
    name: 'Sarah Chen',
    type: 'dm',
    members: [{ id: '2', name: 'Sarah Chen', avatar: 'SC' }],
    lastMessage: {
      content: 'Can you review my PR when you get a chance?',
      sender: 'Sarah Chen',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
    },
    unreadCount: 2,
  },
  {
    _id: 'dm-2',
    name: 'Mike Johnson',
    type: 'dm',
    members: [{ id: '3', name: 'Mike Johnson', avatar: 'MJ' }],
    lastMessage: {
      content: 'Thanks for the help with the bug fix!',
      sender: 'Alex Kim',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
    unreadCount: 0,
  },
  {
    _id: 'room-4',
    name: 'Project Planning',
    type: 'channel',
    members: [
      { id: '1', name: 'Alex Kim', avatar: 'AK' },
      { id: '2', name: 'Sarah Chen', avatar: 'SC' },
      { id: '3', name: 'Mike Johnson', avatar: 'MJ' },
      { id: '4', name: 'Emma Davis', avatar: 'ED' },
    ],
    lastMessage: {
      content: 'Sprint planning moved to Friday',
      sender: 'Alex Kim',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    unreadCount: 0,
  },
];

// Mock messages per room
const mockMessages = {
  'room-1': [
    {
      _id: 'msg-1',
      sender: { id: '2', name: 'Sarah Chen', avatar: 'SC' },
      content: 'Hey team, the new deployment is ready for testing',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'read',
    },
    {
      _id: 'msg-2',
      sender: { id: '3', name: 'Mike Johnson', avatar: 'MJ' },
      content: 'Great! I will run the E2E tests on it',
      timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
      status: 'read',
    },
    {
      _id: 'msg-3',
      sender: { id: '2', name: 'Sarah Chen', avatar: 'SC' },
      content: 'The authentication flow needs testing too',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      status: 'read',
    },
    {
      _id: 'msg-4',
      sender: { id: '1', name: 'Alex Kim', avatar: 'AK' },
      content: 'I will handle the auth testing',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      status: 'read',
    },
    {
      _id: 'msg-5',
      sender: { id: '2', name: 'Sarah Chen', avatar: 'SC' },
      content: 'The API integration is working now',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      status: 'delivered',
    },
  ],
  'room-2': [
    {
      _id: 'msg-6',
      sender: { id: '3', name: 'Mike Johnson', avatar: 'MJ' },
      content: 'Component library is ready for review',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      status: 'read',
    },
    {
      _id: 'msg-7',
      sender: { id: '6', name: 'Lisa Park', avatar: 'LP' },
      content: 'Awesome work! I will check it out',
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      status: 'read',
    },
  ],
  'dm-1': [
    {
      _id: 'msg-8',
      sender: { id: '2', name: 'Sarah Chen', avatar: 'SC' },
      content: 'Hey Alex, do you have a few minutes for a code review?',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      status: 'read',
    },
    {
      _id: 'msg-9',
      sender: { id: '1', name: 'Alex Kim', avatar: 'AK' },
      content: 'Sure, send me the PR link',
      timestamp: new Date(Date.now() - 40 * 60 * 1000),
      status: 'read',
    },
    {
      _id: 'msg-10',
      sender: { id: '2', name: 'Sarah Chen', avatar: 'SC' },
      content: 'Can you review my PR when you get a chance?',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      status: 'delivered',
    },
  ],
};

// Date separator helper
const formatDateSeparator = (date) => {
  const now = new Date();
  const msgDate = new Date(date);
  const diffDays = Math.floor((now - msgDate) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return msgDate.toLocaleDateString('en-US', { weekday: 'long' });
  return msgDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
};

// Mention autocomplete
const findMentions = (text) => {
  const mentionRegex = /@(\w*)$/g;
  const matches = [];
  let match;
  while ((match = mentionRegex.exec(text)) !== null) {
    matches.push(match[1]);
  }
  return matches;
};

const Messages = () => {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.theme);
  const { currentRoom, items: messages, typingUsers } = useSelector((state) => state.messages);
  const { user } = useSelector((state) => state.auth);

  const [rooms, setRooms] = useState(mockRooms);
  const [roomMessages, setRoomMessages] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [showNewRoomModal, setShowNewRoomModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomType, setNewRoomType] = useState('channel');
  const [mentionedUsers, setMentionedUsers] = useState([]);
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Load messages when room changes
  useEffect(() => {
    if (currentRoom) {
      const msgs = mockMessages[currentRoom] || [];
      setRoomMessages((prev) => ({ ...prev, [currentRoom]: msgs }));
      dispatch(setMessages(msgs));
      dispatch(clearTypingUsers());
    }
  }, [currentRoom, dispatch]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Filter rooms
  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get current room data
  const currentRoomData = rooms.find((r) => r._id === currentRoom);

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups = {};
    messages.forEach((msg) => {
      const dateKey = new Date(msg.timestamp).toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(msg);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate();

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentRoom) return;

    const message = {
      _id: `msg-${Date.now()}`,
      sender: currentUser,
      content: newMessage,
      timestamp: new Date(),
      status: 'sent',
    };

    dispatch(addMessage(message));
    setRoomMessages((prev) => ({
      ...prev,
      [currentRoom]: [...(prev[currentRoom] || []), message],
    }));
    setNewMessage('');

    // Simulate response after delay
    setTimeout(() => {
      const responseMsg = {
        _id: `msg-${Date.now() + 1}`,
        sender: { id: '2', name: 'Sarah Chen', avatar: 'SC' },
        content: 'Got it, thanks for the update!',
        timestamp: new Date(),
        status: 'delivered',
      };
      dispatch(addMessage(responseMsg));
      setRoomMessages((prev) => ({
        ...prev,
        [currentRoom]: [...(prev[currentRoom] || []), responseMsg],
      }));
    }, 2000);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNewMessage(value);

    const mentions = findMentions(value);
    if (mentions.length > 0) {
      setMentionedUsers(mentions);
      setShowMentionDropdown(true);
    } else {
      setShowMentionDropdown(false);
    }
  };

  const selectMention = (username) => {
    const mentionRegex = /@(\w*)$/;
    const newValue = newMessage.replace(mentionRegex, `@${username} `);
    setNewMessage(newValue);
    setShowMentionDropdown(false);
    inputRef.current?.focus();
  };

  const handleCreateRoom = () => {
    if (!newRoomName.trim()) return;
    const newRoom = {
      _id: `room-${Date.now()}`,
      name: newRoomName,
      type: newRoomType,
      members: [currentUser],
      lastMessage: null,
      unreadCount: 0,
    };
    setRooms([newRoom, ...rooms]);
    setShowNewRoomModal(false);
    setNewRoomName('');
  };

  const selectRoom = (roomId) => {
    dispatch(setCurrentRoom(roomId));
    setRooms((prev) =>
      prev.map((r) => (r._id === roomId ? { ...r, unreadCount: 0 } : r))
    );
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="h-[calc(100vh-120px)] flex gap-6 max-w-[1600px] mx-auto p-6"
    >
      {/* Room List - Left Sidebar */}
      <motion.div
        variants={itemVariants}
        className="w-80 flex-shrink-0 flex flex-col backdrop-blur-xl bg-white/10 dark:bg-gray-800/30 rounded-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 dark:border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Messages</h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNewRoomModal(true)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-primary-500 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/10 dark:bg-gray-700/30 border border-white/20 dark:border-gray-600/50 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            />
          </div>
        </div>

        {/* Room List */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="popLayout">
            {filteredRooms.map((room) => (
              <motion.div
                key={room._id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onClick={() => selectRoom(room._id)}
                className={`p-4 border-b border-white/5 dark:border-gray-700/30 cursor-pointer transition-colors ${
                  currentRoom === room._id
                    ? 'bg-primary-500/10 dark:bg-primary-500/20 border-l-2 border-l-primary-500'
                    : 'hover:bg-white/5 dark:hover:bg-gray-700/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Room Icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    room.type === 'dm'
                      ? 'bg-gradient-to-br from-primary-400 to-secondary-400'
                      : 'bg-gray-500/20'
                  }`}>
                    {room.type === 'dm' ? (
                      <span className="text-sm font-medium text-white">
                        {room.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    ) : (
                      <Hash className="w-5 h-5 text-gray-400" />
                    )}
                  </div>

                  {/* Room Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-gray-900 dark:text-white truncate">{room.name}</span>
                      {room.lastMessage && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                          {formatTime(room.lastMessage.timestamp)}
                        </span>
                      )}
                    </div>
                    {room.lastMessage && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">
                        {room.lastMessage.sender}: {room.lastMessage.content}
                      </p>
                    )}
                  </div>

                  {/* Unread Badge */}
                  {room.unreadCount > 0 && (
                    <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-medium text-white">{room.unreadCount}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Chat Area - Right Side */}
      <motion.div
        variants={itemVariants}
        className="flex-1 flex flex-col backdrop-blur-xl bg-white/10 dark:bg-gray-800/30 rounded-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden"
      >
        {currentRoom && currentRoomData ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-white/10 dark:border-gray-700/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center">
                  {currentRoomData.type === 'dm' ? (
                    <span className="text-sm font-medium text-white">
                      {currentRoomData.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  ) : (
                    <Hash className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{currentRoomData.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {currentRoomData.members.length} {currentRoomData.type === 'dm' ? 'contact' : 'members'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-primary-500 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-primary-500 transition-colors"
                >
                  <Video className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-primary-500 transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {Object.entries(messageGroups).map(([dateKey, msgs]) => (
                <div key={dateKey}>
                  {/* Date Separator */}
                  <div className="flex items-center justify-center my-4">
                    <div className="px-4 py-1 bg-white/10 dark:bg-gray-700/50 rounded-full">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDateSeparator(msgs[0].timestamp)}
                      </span>
                    </div>
                  </div>

                  {/* Messages */}
                  <AnimatePresence mode="popLayout">
                    {msgs.map((msg) => {
                      const isOwnMessage = msg.sender.id === currentUser.id;
                      return (
                        <motion.div
                          key={msg._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className={`flex items-start gap-3 mb-4 ${isOwnMessage ? 'flex-row-reverse' : ''}`}
                        >
                          {/* Avatar */}
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-medium text-white">{msg.sender.avatar}</span>
                          </div>

                          {/* Message Bubble */}
                          <div className={`max-w-[70%] ${isOwnMessage ? 'items-end' : ''}`}>
                            <div className={`flex items-center gap-2 mb-1 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">{msg.sender.name}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">{formatTime(msg.timestamp)}</span>
                            </div>
                            <div
                              className={`px-4 py-2.5 rounded-2xl ${
                                isOwnMessage
                                  ? 'bg-primary-500 text-white rounded-br-md'
                                  : 'bg-white/10 dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-bl-md'
                              }`}
                            >
                              <p className="text-sm">{msg.content}</p>
                            </div>
                            {/* Message Status */}
                            {isOwnMessage && (
                              <div className="flex items-center justify-end gap-1 mt-1">
                                {msg.status === 'sent' && <CheckCircle className="w-3 h-3 text-gray-400" />}
                                {msg.status === 'delivered' && <CheckCheck className="w-3 h-3 text-gray-400" />}
                                {msg.status === 'read' && <CheckCheck className="w-3 h-3 text-primary-500" />}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              ))}

              {/* Typing Indicator */}
              {typingUsers.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
                >
                  <div className="flex gap-1">
                    <motion.span
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                      className="w-1.5 h-1.5 rounded-full bg-gray-400"
                    />
                    <motion.span
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                      className="w-1.5 h-1.5 rounded-full bg-gray-400"
                    />
                    <motion.span
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                      className="w-1.5 h-1.5 rounded-full bg-gray-400"
                    />
                  </div>
                  <span>{typingUsers[0].username} is typing...</span>
                </motion.div>
              )}

              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-white/10 dark:border-gray-700/50">
              <form onSubmit={handleSendMessage} className="flex items-end gap-3">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={newMessage}
                    onChange={handleInputChange}
                    placeholder="Type a message..."
                    rows={1}
                    className="w-full px-4 py-3 bg-white/10 dark:bg-gray-700/30 border border-white/20 dark:border-gray-600/50 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                  />

                  {/* Mention Dropdown */}
                  {showMentionDropdown && (
                    <div className="absolute bottom-full left-0 mb-2 w-64 bg-white/10 dark:bg-gray-800/90 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-xl shadow-xl overflow-hidden">
                      <div className="p-2 text-xs text-gray-500 dark:text-gray-400 border-b border-white/10 dark:border-gray-700/50">
                        Select a member to mention
                      </div>
                      {currentRoomData?.members
                        .filter((m) => m.name.toLowerCase().includes(mentionedUsers[0]?.toLowerCase() || ''))
                        .map((member) => (
                          <button
                            key={member.id}
                            type="button"
                            onClick={() => selectMention(member.name.split(' ')[0])}
                            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/10 dark:hover:bg-gray-700/50 text-gray-900 dark:text-white transition-colors"
                          >
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-[10px] font-medium text-white">
                              {member.avatar}
                            </div>
                            <span className="text-sm">{member.name}</span>
                          </button>
                        ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-primary-500 transition-colors"
                  >
                    <Paperclip className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-primary-500 transition-colors"
                  >
                    <Smile className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="p-3 bg-primary-500 hover:bg-primary-600 rounded-xl text-white transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
              </form>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center">
            <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Select a conversation</h3>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Choose a room from the list or start a new conversation
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowNewRoomModal(true)}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-xl text-white text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Conversation
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Create Room Modal */}
      <AnimatePresence>
        {showNewRoomModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setShowNewRoomModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md backdrop-blur-xl bg-white/10 dark:bg-gray-800/80 rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 dark:border-gray-700/50">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create New Room</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNewRoomModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5">
                {/* Room Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Room Type</label>
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setNewRoomType('channel')}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                        newRoomType === 'channel'
                          ? 'bg-primary-500/10 border-primary-500 text-primary-500'
                          : 'bg-white/10 border-white/20 dark:border-gray-700/50 text-gray-600 dark:text-gray-400 hover:bg-white/20'
                      }`}
                    >
                      <Hash className="w-5 h-5" />
                      <span className="font-medium">Channel</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setNewRoomType('dm')}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                        newRoomType === 'dm'
                          ? 'bg-primary-500/10 border-primary-500 text-primary-500'
                          : 'bg-white/10 border-white/20 dark:border-gray-700/50 text-gray-600 dark:text-gray-400 hover:bg-white/20'
                      }`}
                    >
                      <Users className="w-5 h-5" />
                      <span className="font-medium">Direct Message</span>
                    </motion.button>
                  </div>
                </div>

                {/* Room Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {newRoomType === 'dm' ? 'Contact Name' : 'Channel Name'}
                  </label>
                  <input
                    type="text"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    placeholder={newRoomType === 'dm' ? 'Enter contact name' : 'e.g. engineering-team'}
                    className="w-full px-4 py-2.5 bg-white/10 dark:bg-gray-700/30 border border-white/20 dark:border-gray-600/50 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowNewRoomModal(false)}
                    className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreateRoom}
                    className="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-white font-medium"
                  >
                    Create Room
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Messages;
