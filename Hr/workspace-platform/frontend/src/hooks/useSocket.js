import { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';

let socket = null;

export const useSocket = (token) => {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;

    socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
      setConnected(true);
      setError(null);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('connect_error', (err) => {
      setError(err.message);
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [token]);

  const emit = useCallback((event, data) => {
    if (socket) {
      socket.emit(event, data);
    }
  }, []);

  const on = useCallback((event, callback) => {
    if (socket) {
      socket.on(event, callback);
      return () => socket.off(event, callback);
    }
    return () => {};
  }, []);

  return { connected, error, emit, on };
};

export const getSocket = () => socket;