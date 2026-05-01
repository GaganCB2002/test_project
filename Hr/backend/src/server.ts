import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { createServer } from 'http'
import { Server } from 'socket.io'
import authRoutes from './routes/auth.routes'
import hrRoutes from './routes/hr.routes'
import analysisRoutes from './routes/analysis.routes'
import locationRoutes from './routes/location.routes'
import { leaveScheduler } from './services/leaveScheduler'

leaveScheduler.start()

const app = express()
const httpServer = createServer(app)
export const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
app.set('io', io)

const port = Number(process.env.PORT ?? 8081)

app.use(
  cors({
    origin: [
      process.env.HR_URL || 'http://127.0.0.1:3005',
      process.env.HR_DASHBOARD_URL || 'http://127.0.0.1:3001',
      process.env.EMPLOYEE_HUB_URL || 'http://127.0.0.1:5173',
      process.env.TECH_LEAD_HUB_URL || 'http://127.0.0.1:3003',
      process.env.HELP_DESK_URL || 'http://127.0.0.1:3004',
      'http://localhost:3005',
      'http://localhost:3001',
      'http://localhost:5173',
      'http://localhost:3003',
      'http://localhost:3004',
      'http://127.0.0.1:3006',
      'http://127.0.0.1:3007',
      'http://localhost:3006',
      'http://localhost:3007'
    ],
    credentials: true,
    optionsSuccessStatus: 200
  }),
)
app.use(helmet({
  crossOriginResourcePolicy: false,
}))
app.use(express.json())
app.use(morgan('dev'))

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'AuraHR API',
    timestamp: new Date().toISOString(),
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/techlead/analysis', analysisRoutes)
app.use('/api/location', locationRoutes)
app.use('/api/tracking', locationRoutes)
app.use('/api', hrRoutes)

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)
  
  socket.on('join_room', (roomId) => {
    socket.join(roomId)
    console.log(`User ${socket.id} joined room ${roomId}`)
  })

  socket.on('send_message', (message) => {
    io.to(message.groupId).emit('new_message', message)
  })
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

httpServer.listen(port, '0.0.0.0', () => {
  console.log(`AuraHR API (Real-time) listening on http://0.0.0.0:${port}`)
})
