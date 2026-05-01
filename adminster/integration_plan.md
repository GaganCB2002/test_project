# 🏗️ Unified MERN Platform Integration Plan

## 📁 Step 1: MERN Folder Structure
The project has been unified into a cleaner structure for better scalability and maintenance.

```text
manager/
├── backend/                # Unified Node.js/Express API
│   ├── src/
│   │   ├── config/         # DB & Socket configurations
│   │   ├── models/         # Mongoose Schemas (Users, Projects, etc.)
│   │   ├── controllers/    # Business logic
│   │   ├── routes/         # API endpoints
│   │   └── server.ts       # Main entry point (Port 5001)
│   └── package.json
└── frontend/               # Unified React/Vite UI
    ├── src/
    │   ├── components/     # UI Components & Layouts
    │   ├── pages/          # Dashboards (Manager, HR, Employee)
    │   ├── hooks/          # Real-time tracking & state
    │   └── App.tsx         # Routing & Auth logic
    └── package.json
```

## 🛠️ Step 2: Backend APIs (Node + MongoDB)
Implemented core models and integrated existing HR/Employee backends as auth gateways.

- **Models Created**: `User`, `Project`, `Task`, `TrackingLog`, `Attendance`, `ChatMessage`.
- **Auth Gateway**: Points to existing HR (8081) and Django (8000) for legacy support.
- **Socket.io**: Real-time communication for chat and activity signals.

## 🎨 Step 3: Frontend & Dashboards
Updated the UI to provide a premium, role-based experience.

- **Manager Dashboard**: New dedicated command hub for managers.
- **Login Autofill**: One-click login for all roles including the new Manager profile.
- **Role Routing**: JWT-based redirection to specific dashboards.

## 📍 Step 4: Tracking System
- **Real-time GPS**: Data sent every 3 seconds using `watchPosition`.
- **Work Hours**: Automatic login/logout time tracking in the `Attendance` collection.

## 🚀 Step 5: Master Startup Fix
Updated `startup_master.js` to orchestrate the entire fleet of services including the new Unified Backend.

---

### ✅ Checklist Status
- [x] MERN folder structure defined
- [x] Backend APIs (Node + MongoDB) implemented
- [x] Manager Login with autofill added
- [x] Role-based routing fixed
- [x] Socket.io Chat storage integrated
- [x] Real-time tracking (3s interval) fixed
- [x] `startup_master.js` optimized
