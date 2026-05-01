require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const authRoutes = require('./routes/auth');
const locationRoutes = require('./routes/location');

const app = express();
const server = http.createServer(app);
const allowedOrigins = [
    process.env.CLIENT_URL || 'http://127.0.0.1:3007',
    'http://localhost:3007',
    'http://127.0.0.1:3005',
    'http://localhost:3005',
    'http://127.0.0.1:5173',
    'http://localhost:5173',
];
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/location-tracker')
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/location', locationRoutes);
app.get('/health', (_req, res) => {
    res.json({ status: 'OK', service: 'Location Tracker', timestamp: new Date().toISOString() });
});

// Socket.io Connection
io.on('connection', (socket) => {
    console.log('🔌 New client connected:', socket.id);

    socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`👤 User ${userId} joined their room`);
    });

    socket.on('disconnect', () => {
        console.log('🔌 Client disconnected:', socket.id);
    });
});

// Make io accessible to routes
app.set('io', io);

const PORT = process.env.PORT || 3017;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
