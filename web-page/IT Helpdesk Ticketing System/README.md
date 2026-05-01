# IT Department Management Dashboard

A production-grade IT Helpdesk Ticketing System built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring a premium SaaS-like UI/UX.

## Features

### Core Modules
- **Ticket Management System** - Create, update, assign, and resolve IT tickets
- **Asset Management System** - Track devices, assign to employees, warranty management
- **Role-Based Access Control** - Employee, IT Staff, and Admin roles
- **Real-time Notifications** - Socket.io powered instant notifications
- **Admin Dashboard** - KPIs, charts, and analytics

### UI/UX Features
- **Dark/Light Mode** - Premium glassmorphic design with smooth theme toggle
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Framer Motion Animations** - Smooth page transitions and micro-interactions
- **Modern Dashboard** - KPI cards, charts, and activity feeds

## Tech Stack

**Frontend:**
- React 18 with Vite
- Tailwind CSS
- Framer Motion
- Redux Toolkit
- Recharts
- Socket.io Client
- Lucide React Icons

**Backend:**
- Node.js + Express.js
- MongoDB with Mongoose
- JWT Authentication
- Socket.io
- bcryptjs
- Helmet and Rate Limiting

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone and install server dependencies:**
```bash
cd server
npm install
```

2. **Install client dependencies:**
```bash
cd client
npm install
```

3. **Configure environment:**
```bash
cd server
cp .env.example .env
```

4. **Seed the database:**
```bash
npm run seed
```

5. **Start the servers:**
In one terminal:
```bash
cd server
npm run dev
```
In another terminal:
```bash
cd client
npm run dev
```

6. **Open the app:**
Navigate to http://localhost:5173

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@company.com | password123 |
| IT Staff | sarah@company.com | password123 |
| Employee | john@company.com | password123 |

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route-level components
│   │   ├── redux/         # Redux store and slices
│   │   ├── services/      # API and socket services
│   │   └── styles/        # Global styles
│
├── server/                 # Express backend
│   ├── config/            # Database and JWT config
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Auth and error handling
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   └── seed.js            # Database seeder
```

## Security Features
- JWT access tokens
- Password hashing with bcrypt
- Rate limiting (100 req/15min)
- Helmet security headers
- Input validation
- Role-based access control

## License

MIT
