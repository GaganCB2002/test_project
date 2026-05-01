import { io } from 'socket.io-client';

const SOCKET_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5005' 
  : window.location.origin;

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ['websocket', 'polling'],
});

export const connectSocket = (userId) => {
  if (!socket.connected) {
    socket.connect();
    socket.emit('join', userId);
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export default socket;
