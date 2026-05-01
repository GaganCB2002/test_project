const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const workspaceRoutes = require('./routes/workspaces');
const channelRoutes = require('./routes/channels');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');
const calendarRoutes = require('./routes/calendar');
const notificationRoutes = require('./routes/notifications');
const workLogRoutes = require('./routes/worklogs');
const leaveRoutes = require('./routes/leaves');
const analyticsRoutes = require('./routes/analytics');
const organizationRoutes = require('./routes/organizations');
const userRoutes = require('./routes/users');
const { authenticateSocket } = require('./socket/auth');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/worklogs', workLogRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/users', userRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

io.use(authenticateSocket);

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.user?.email}`);

  socket.on('join-workspace', (workspaceId) => {
    socket.join(`workspace:${workspaceId}`);
    console.log(`User ${socket.user?.email} joined workspace ${workspaceId}`);
  });

  socket.on('leave-workspace', (workspaceId) => {
    socket.leave(`workspace:${workspaceId}`);
  });

  socket.on('join-channel', (channelId) => {
    socket.join(`channel:${channelId}`);
  });

  socket.on('leave-channel', (channelId) => {
    socket.leave(`channel:${channelId}`);
  });

  socket.on('send-message', async (data) => {
    const { channelId, content, mentions } = data;

    socket.to(`channel:${channelId}`).emit('new-message', {
      channelId,
      content,
      sender: {
        _id: socket.user._id,
        firstName: socket.user.firstName,
        lastName: socket.user.lastName,
        avatar: socket.user.avatar
      },
      mentions,
      timestamp: new Date()
    });
  });

  socket.on('typing', (data) => {
    const { channelId, user } = data;
    socket.to(`channel:${channelId}`).emit('user-typing', { channelId, user });
  });

  socket.on('stop-typing', (data) => {
    const { channelId, user } = data;
    socket.to(`channel:${channelId}`).emit('user-stop-typing', { channelId, user });
  });

  socket.on('task-updated', (data) => {
    const { workspaceId, task } = data;
    socket.to(`workspace:${workspaceId}`).emit('task-changed', task);
  });

  socket.on('project-updated', (data) => {
    const { workspaceId, project } = data;
    socket.to(`workspace:${workspaceId}`).emit('project-changed', project);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.user?.email}`);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io };