# File Connection & Port Documentation

## Overview
This document describes how the Tech Lead Dashboard system connects, including ports, file relationships, and role-based routing between HR and Tech Lead dashboards.

---

## Port Connections

| Service | Port | Connection URL | Purpose |
|---------|------|----------------|---------|
| **Frontend (React)** | `3000` | `http://localhost:3000` | User interface - HR & Tech Lead dashboards |
| **Backend (Express)** | `5000` | `http://localhost:5000` | API server, authentication, business logic |
| **MongoDB** | `27017` | `mongodb://localhost:27017` | Database for all data storage |
| **API Gateway** | `5001` | `http://localhost:5001` | External module integration |

---

## File Connection Architecture

### Frontend → Backend Connection
```
Frontend (Port 3000)  →  API Calls  →  Backend (Port 5000)
       ↓                                        ↓
   React Components                    Express Routes
   ├── pages/                          ├── routes/
   ├── services/api.js                 ├── controllers/
   └── store/slices/                   └── models/
```

**Connection Flow:**
1. Frontend `src/services/api.js` → Base URL: `http://localhost:5000`
2. API calls include JWT token in `Authorization: Bearer <token>` header
3. Backend `auth.js` middleware validates token and extracts role
4. Role determines which dashboard to display

### Backend → Database Connection
```
Backend (Port 5000)  →  Mongoose  →  MongoDB (Port 27017)
       ↓                                        ↓
   models/                                   techlead_dashboard
   └── index.js                              ├── users
                                             ├── projects
                                             ├── tasks
                                             └── ...
```

---

## Role-Based Dashboard Routing

### Available Roles
| Role | Dashboard Access | Login Credentials |
|------|------------------|-------------------|
| **HR** | HR Dashboard | `hr@example.com` / `password123` |
| **TechLead** | Tech Lead Dashboard | `techlead@example.com` / `password123` |
| **Manager** | Manager Dashboard | `manager@example.com` / `password123` |
| **CEO** | CEO Dashboard | `ceo@example.com` / `password123` |
| **Developer** | Developer Dashboard | `dev@example.com` / `password123` |

### Cross-Role Access (HR → Tech Lead)
When an HR user enters **Tech Lead credentials** in the HR dashboard login form:
1. Login request sent to `POST /api/auth/login` with tech lead email
2. Backend validates credentials and returns JWT with `TechLead` role
3. Frontend receives token, stores it, and routes to `/dashboard`
4. Dashboard component reads role from token and displays Tech Lead interface

---

## How HR Dashboard Routes to Tech Lead Dashboard

### Login Flow (src/pages/Login.jsx)
```javascript
// User enters credentials in HR login form
const handleLogin = async (email, password) => {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  const { token, user } = data.data;

  // Store token
  localStorage.setItem('token', token);

  // Role-based redirect
  switch (user.role) {
    case 'TechLead':
      window.location.href = '/dashboard'; // Tech Lead Dashboard
      break;
    case 'HR':
      window.location.href = '/hr-dashboard'; // HR Dashboard
      break;
    default:
      window.location.href = '/dashboard';
  }
};
```

### Dashboard Routing (src/pages/Dashboard.jsx)
```javascript
const Dashboard = () => {
  const userRole = getUserRoleFromToken(); // Extracts role from JWT

  return (
    <>
      {userRole === 'TechLead' && <TechLeadDashboard />}
      {userRole === 'HR' && <HRDashboard />}
      {userRole === 'Manager' && <ManagerDashboard />}
    </>
  );
};
```

---

## Key Files for Connection

### Authentication Files
| File Path | Port | Purpose |
|----------|------|---------|
| `backend/src/middleware/auth.js` | 5000 | JWT validation middleware |
| `backend/src/controllers/authController.js` | 5000 | Login/logout logic, token generation |
| `backend/src/models/User.js` | 27017 | User schema with role enum |
| `frontend/src/services/api.js` | 3000→5000 | API client configuration |

### Dashboard Files
| File Path | Role | Purpose |
|----------|------|---------|
| `frontend/src/pages/Dashboard.jsx` | TechLead | Main dashboard for tech leads |
| `frontend/src/pages/HRDashboard.jsx` | HR | HR-specific dashboard |
| `frontend/src/store/slices/authSlice.js` | All | Redux state for authentication |

---

## Environment Configuration

### Backend (.env)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/techlead_dashboard
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=30d
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_WS_URL=http://localhost:5000
```

---

## Connection Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         HR Dashboard (Port 3000)                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Login Form: hr@example.com                              │   │
│  │            techlead@example.com  ← Enter Tech Lead creds│   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                    │
│              POST /api/auth/login (Port 5000)                   │
│                              │                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Backend: Validates credentials                          │   │
│  │  - If email = techlead@example.com → role = TechLead    │   │
│  │  - Returns JWT with { userId, role: "TechLead" }        │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                    │
│         Frontend receives token, redirects to /dashboard         │
│                              │                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Dashboard.jsx reads role from token                     │   │
│  │  - role === "TechLead" → Show Tech Lead Dashboard       │   │
│  │  - role === "HR" → Show HR Dashboard (if HR creds used)  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Database Collections & Connections

| Collection | Connected Via | Port |
|------------|---------------|------|
| `users` | `backend/src/models/User.js` | 27017 |
| `projects` | `backend/src/models/Project.js` | 27017 |
| `tasks` | `backend/src/models/Task.js` | 27017 |
| `workflows` | `backend/src/models/Workflow.js` | 27017 |
| `messages` | `backend/src/models/Message.js` | 27017 |
| `notifications` | `backend/src/models/Notification.js` | 27017 |
| `activity_logs` | `backend/src/models/ActivityLog.js` | 27017 |

---

## API Endpoint Connections

| Endpoint | Method | Port | Purpose |
|----------|--------|------|---------|
| `/api/auth/login` | POST | 5000 | User login, returns JWT with role |
| `/api/auth/me` | GET | 5000 | Get current user with role |
| `/api/users` | GET | 5000 | Get all users by role |
| `/api/dashboard/role/:role` | GET | 5000 | Get dashboard data by role |
| `/api/hr/*` | ALL | 5000 | HR-specific endpoints |
| `/api/techlead/*` | ALL | 5000 | Tech Lead-specific endpoints |

---

## Summary

- **Ports**: Frontend (3000) connects to Backend (5000), which connects to MongoDB (27017)
- **HR to Tech Lead**: Enter `techlead@example.com` in any login form to access Tech Lead dashboard
- **Token contains role**: JWT payload `{ userId, role }` determines dashboard access
- **Role check**: Frontend reads role from token and renders appropriate dashboard component