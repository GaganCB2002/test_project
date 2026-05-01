import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.connectionPromise = null;
  }

  connect(url = 'http://localhost:5000') {
    if (this.socket?.connected) {
      return Promise.resolve(this.socket);
    }

    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      this.socket = io(url, {
        auth: {
          token: localStorage.getItem('token'),
        },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        transports: ['websocket', 'polling'],
      });

      this.socket.on('connect', () => {
        console.log('Socket connected:', this.socket.id);
        resolve(this.socket);
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error.message);
        if (this.socket) {
          this.connectionPromise = null;
        }
        reject(error);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
      });

      this.socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    });

    return this.connectionPromise;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connectionPromise = null;
      this.listeners.clear();
    }
  }

  emit(event, data) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected. Cannot emit event:', event);
    }
  }

  joinRoom(roomId) {
    this.emit('joinRoom', { roomId });
  }

  leaveRoom(roomId) {
    this.emit('leaveRoom', { roomId });
    if (this.listeners.has(`leaveRoom:${roomId}`)) {
      this.listeners.delete(`leaveRoom:${roomId}`);
    }
  }

  sendMessage(roomId, message) {
    this.emit('sendMessage', { roomId, message });
  }

  typing(roomId) {
    this.emit('typing', { roomId });
  }

  stopTyping(roomId) {
    this.emit('stopTyping', { roomId });
  }

  onMessage(callback) {
    this.on('receiveMessage', callback);
  }

  onTyping(callback) {
    this.on('userTyping', callback);
  }

  onNotification(callback) {
    this.on('notification', callback);
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
      if (this.socket) {
        this.socket.on(event, (...args) => {
          const callbacks = this.listeners.get(event);
          if (callbacks) {
            callbacks.forEach((cb) => cb(...args));
          }
        });
      }
    }
    this.listeners.get(event).add(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      if (callback) {
        callbacks.delete(callback);
      } else {
        callbacks.clear();
      }
      if (callbacks.size === 0) {
        this.listeners.delete(event);
        if (this.socket) {
          this.socket.off(event);
        }
      }
    }
  }

  offAll() {
    this.listeners.clear();
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }

  getConnectionStatus() {
    return this.socket?.connected || false;
  }

  getSocketId() {
    return this.socket?.id || null;
  }
}

const socketService = new SocketService();

export default socketService;
