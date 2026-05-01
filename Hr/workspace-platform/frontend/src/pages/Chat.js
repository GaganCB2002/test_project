import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '../hooks/useSocket';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';

const Chat = () => {
  const { channelId } = useParams();
  const { user } = useAuthStore();
  const token = localStorage.getItem('accessToken');
  const { connected, emit, on } = useSocket(token);
  const [channels, setChannels] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentChannel, setCurrentChannel] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchChannels();
    if (channelId) {
      fetchChannel(channelId);
      fetchMessages(channelId);
    }
  }, [channelId]);

  useEffect(() => {
    if (connected && channelId) {
      emit('join-channel', channelId);
    }
  }, [connected, channelId]);

  useEffect(() => {
    const unsubNewMessage = on('new-message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    const unsubTyping = on('user-typing', ({ user: typingUser }) => {
      setTypingUsers(prev => [...prev, typingUser]);
      setTimeout(() => {
        setTypingUsers(prev => prev.filter(u => u._id !== typingUser._id));
      }, 3000);
    });

    const unsubStopTyping = on('user-stop-typing', ({ user: typingUser }) => {
      setTypingUsers(prev => prev.filter(u => u._id !== typingUser._id));
    });

    return () => {
      unsubNewMessage();
      unsubTyping();
      unsubStopTyping();
    };
  }, [on]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchChannels = async () => {
    try {
      const response = await api.get('/channels');
      setChannels(response.data);
    } catch (error) {
      console.error('Failed to fetch channels');
    }
  };

  const fetchChannel = async (id) => {
    try {
      const response = await api.get(`/channels/${id}`);
      setCurrentChannel(response.data);
    } catch (error) {
      console.error('Failed to fetch channel');
    }
  };

  const fetchMessages = async (channelId) => {
    try {
      const response = await api.get(`/channels/${channelId}/messages`);
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Failed to fetch messages');
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !currentChannel) return;

    emit('send-message', {
      channelId: currentChannel._id,
      content: messageInput,
      mentions: []
    });

    setMessageInput('');
  };

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
    emit('typing', { channelId: currentChannel?._id, user: { _id: user._id, firstName: user.firstName } });
  };

  const handleInputBlur = () => {
    emit('stop-typing', { channelId: currentChannel?._id, user: { _id: user._id, firstName: user.firstName } });
  };

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <div style={{ padding: '16px', borderBottom: '1px solid var(--gray-200)' }}>
          <h3 style={{ fontWeight: 600 }}>Channels</h3>
        </div>
        {channels.map(channel => (
          <div
            key={channel._id}
            className={`chat-list-item ${currentChannel?._id === channel._id ? 'active' : ''}`}
            onClick={() => window.location.href = `/chat/${channel._id}`}
          >
            <span>#</span>
            <div>
              <div style={{ fontWeight: 500 }}>{channel.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{channel.type}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-main">
        {currentChannel ? (
          <>
            <div className="chat-header">
              <h3 style={{ fontWeight: 600 }}># {currentChannel.name}</h3>
              <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>{currentChannel.description || 'No description'}</p>
            </div>
            <div className="chat-messages">
              {messages.map((msg, idx) => (
                <div key={msg._id || idx} className="message">
                  <div className="avatar">{msg.sender?.firstName?.[0]}</div>
                  <div className="message-content">
                    <div className="message-header">
                      <span className="message-sender">{msg.sender?.firstName} {msg.sender?.lastName}</span>
                      <span className="message-time">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <div className="message-text">{msg.content}</div>
                  </div>
                </div>
              ))}
              {typingUsers.length > 0 && (
                <div style={{ fontSize: '0.75rem', color: '#6B7280', fontStyle: 'italic' }}>
                  {typingUsers.map(u => u.firstName).join(', ')} is typing...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <form className="chat-input" onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder="Type a message..."
                value={messageInput}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
              />
              <button type="submit" className="btn btn-primary">Send</button>
            </form>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
            Select a channel to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;