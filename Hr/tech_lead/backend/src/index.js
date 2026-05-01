import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import projectRoutes from './routes/projects.js';
import taskRoutes from './routes/tasks.js';
import workflowRoutes from './routes/workflows.js';
import messageRoutes from './routes/messages.js';
import fileRoutes from './routes/files.js';
import reportRoutes from './routes/reports.js';
import notificationRoutes from './routes/notifications.js';
import activityRoutes from './routes/activities.js';
import timeTrackingRoutes from './routes/timeTracking.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.FRONTEND_URL].filter(Boolean)
  : [
      'http://localhost:3003',
      'http://127.0.0.1:3003',
      'http://localhost:3005',
      'http://127.0.0.1:3005',
      'http://localhost:3001',
      'http://127.0.0.1:3001',
    ];
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

connectDB();

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/workflow', workflowRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/time-tracking', timeTrackingRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

let connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('user_online', (userId) => {
    connectedUsers.set(userId, socket.id);
    io.emit('user_status_change', { userId, status: 'online' });
  });

  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on('leave_room', (room) => {
    socket.leave(room);
    console.log(`User left room: ${room}`);
  });

  socket.on('send_message', (data) => {
    io.to(data.room).emit('receive_message', data);
  });

  socket.on('typing', (data) => {
    socket.to(data.room).emit('user_typing', { userId: data.userId, username: data.username });
  });

  socket.on('stop_typing', (data) => {
    socket.to(data.room).emit('user_stop_typing', { userId: data.userId });
  });

  socket.on('task_updated', (data) => {
    io.emit('task_update', data);
  });

  socket.on('file_uploaded', (data) => {
    io.emit('file_update', data);
  });

  socket.on('notification', (data) => {
    const targetSocket = connectedUsers.get(data.userId);
    if (targetSocket) {
      io.to(targetSocket).emit('new_notification', data);
    }
    io.emit('notification_update', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    connectedUsers.forEach((socketId, userId) => {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        io.emit('user_status_change', { userId, status: 'offline' });
      }
    });
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { io };
