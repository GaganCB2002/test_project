# # AI-Powered Real-Time Location Tracking System

A production-ready, enterprise-grade location tracking system built with the MERN stack and Socket.io.

## 🚀 Features

- **Real-Time Tracking**: Live location updates every 120-180 seconds.
- **Interactive Dashboard**: Multi-user view with Leaflet maps.
- **AI Anomaly Detection**: Detects suspicious movement (speed anomalies) and inactivity.
- **Cross-Platform**: Works on Mobile, Laptop, and Web via Geolocation API.
- **Authentication**: Secure JWT-based login/signup with role-based access.
- **History Playback**: (In development) View past movement patterns.

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite), Leaflet, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express, Socket.io, MongoDB, JWT.
- **AI**: Node.js implementation of movement anomaly detection.

## 📦 Getting Started

### Prerequisites
- Node.js installed
- MongoDB running locally or a MongoDB Atlas URI

### Installation

1. **Clone the repository**
2. **Setup Server**
   ```bash
   cd server
   npm install
   # Create a .env file with your credentials
   npm run start
   ```
3. **Setup Client**
   ```bash
   cd client
   npm install
   npm run dev
   ```

## 🔐 Security
- Password hashing with Bcrypt.
- JWT Authentication for API endpoints.
- Rate limiting and input validation recommended for production.

## 📄 License
MIT License - Free to use for personal and commercial projects.
