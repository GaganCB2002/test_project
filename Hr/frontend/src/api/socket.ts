import { io } from 'socket.io-client'

const SOCKET_URL = 'http://127.0.0.1:8081'

export const socket = io(SOCKET_URL, {
  autoConnect: false, // Connect manually after login
})
