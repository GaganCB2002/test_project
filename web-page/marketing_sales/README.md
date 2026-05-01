# AI-Powered Marketing & Sales Dashboard

An enterprise-grade MERN stack application with advanced AI features, real-time communication, and a modern glassmorphism UI.

## 🚀 Features

- **Lead Management**: Full CRUD with AI-based lead scoring.
- **Campaign Management**: Track performance, budgets, and conversions.
- **Sales Pipeline**: Kanban-style deal tracking and forecasting.
- **AI Integration**: Lead scoring, email generation, and chatbot assistant (OpenAI).
- **Real-time**: Live chat and notifications (Socket.io).
- **Analytics**: Dynamic charts and KPI visualizations (Recharts).
- **Modern UI**: Dark/Light mode, animated transitions (Framer Motion, Tailwind CSS).

## 🛠 Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Framer Motion, Recharts.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), Socket.io.
- **AI**: OpenAI API.
- **Auth**: JWT with Role-Based Access Control (RBAC).

## 🏁 Getting Started

### Prerequisites
- Node.js installed.
- MongoDB installed (or use a cloud URI).
- OpenAI API Key (optional for mock features).

### Installation

1. Install root dependencies:
   ```bash
   npm install
   ```

2. Install server dependencies:
   ```bash
   cd server
   npm install
   ```

3. Install client dependencies:
   ```bash
   cd ../client
   npm install
   ```

4. Configure environment variables in `server/.env`:
   ```env
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret
   OPENAI_API_KEY=your_key
   ```

### Running the Project

From the root directory, run:
```bash
npm run dev
```
This will start both the backend server (port 5000) and the frontend client (port 5173) concurrently.

## 👥 User Roles
- **Admin**: Full access to all modules and settings.
- **Marketing Manager**: Campaign and Lead management.
- **Sales Manager**: Pipeline and Team management.
- **Sales Executive**: Personal leads and deals.
- **Viewer**: Read-only access to analytics.
