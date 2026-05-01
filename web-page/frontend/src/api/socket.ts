import { io } from 'socket.io-client'

// Connect via Vite proxy — avoids CORS and ensures correct backend (port 5001)
const SOCKET_URL = typeof window !== 'undefined' ? window.location.origin : 'http://127.0.0.1:3005'

export const socket = io(SOCKET_URL, {
  autoConnect: false,       // Connect manually after login
  transports: ['websocket', 'polling'],
  path: '/socket.io',
})
