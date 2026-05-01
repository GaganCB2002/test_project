# Tech Lead Workflow Dashboard

A production-ready, scalable, high-performance MERN stack web application for managing development teams and workflow visualization.

## Project Overview

Tech Lead Workflow Dashboard is a comprehensive SaaS-level project management platform designed for tech leads to manage their development teams, track project progress, and visualize workflow through an intuitive interface inspired by Jira, Notion, and Monday.com.

### Core Features

- **Role-Based Authentication**: JWT-based auth with access control for Tech Lead role only
- **Visual Workflow**: Interactive flowchart showing CEO → Manager → Tech Lead → Developers hierarchy
- **Real-time Updates**: Socket.io powered live activity panel and notifications
- **Task Management**: Kanban board with drag-and-drop, task assignment, and status tracking
- **Team Progress**: Visual progress bars and performance analytics
- **Real-time Chat**: 1-to-1 and group messaging with typing indicators
- **File Management**: Drag-and-drop uploads with version control
- **Analytics Dashboard**: Charts and graphs using Recharts
- **Dark/Light Mode**: Fully functional theme toggle with system preference support
- **AI Features**: Smart task suggestions, workload distribution, risk prediction

## Tech Stack

### Frontend
- **React.js 18** - UI framework
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Recharts** - Charts and graphs
- **Socket.io Client** - Real-time communication
- **Lucide React** - Icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.io** - WebSocket server
- **JWT** - Authentication
- **Bcryptjs** - Password hashing
- **Multer** - File uploads

### Ports
| Service | Port |
|---------|------|
| Frontend | localhost:3000 |
| Backend API | localhost:5000 |
| MongoDB | localhost:27017 |
| API Gateway | localhost:5001 |

## Folder Structure

```
tech_lead/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                 # Database connection
│   │   │   └── gateway/
│   │   │       └── gateway.js        # API Gateway
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── projectController.js
│   │   │   ├── taskController.js
│   │   │   ├── workflowController.js
│   │   │   ├── messageController.js
│   │   │   ├── fileController.js
│   │   │   ├── reportController.js
│   │   │   ├── notificationController.js
│   │   │   ├── activityController.js
│   │   │   └── timeTrackingController.js
│   │   ├── middleware/
│   │   │   ├── auth.js               # JWT authentication
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Project.js
│   │   │   ├── Task.js
│   │   │   ├── Workflow.js
│   │   │   ├── Message.js
│   │   │   ├── File.js
│   │   │   ├── Report.js
│   │   │   ├── Notification.js
│   │   │   ├── ActivityLog.js
│   │   │   ├── TimeTracking.js
│   │   │   └── Role.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── users.js
│   │   │   ├── projects.js
│   │   │   ├── tasks.js
│   │   │   ├── workflows.js
│   │   │   ├── messages.js
│   │   │   ├── files.js
│   │   │   ├── reports.js
│   │   │   ├── notifications.js
│   │   │   ├── activities.js
│   │   │   └── timeTracking.js
│   │   └── index.js                  # Main server file
│   ├── uploads/                      # File uploads directory
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── layouts/
│   │   │       ├── Layout.jsx
│   │   │       ├── Sidebar.jsx
│   │   │       ├── Navbar.jsx
│   │   │       └── ActivityPanel.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Overview.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── Tasks.jsx
│   │   │   ├── Workflow.jsx
│   │   │   ├── Team.jsx
│   │   │   ├── Messages.jsx
│   │   │   ├── Files.jsx
│   │   │   ├── Reports.jsx
│   │   │   ├── Calendar.jsx
│   │   │   ├── Settings.jsx
│   │   │   ├── Notifications.jsx
│   │   │   └── TimeTracking.jsx
│   │   ├── store/
│   │   │   ├── index.js
│   │   │   └── slices/
│   │   │       ├── authSlice.js
│   │   │       ├── themeSlice.js
│   │   │       ├── uiSlice.js
│   │   │       ├── projectSlice.js
│   │   │       ├── taskSlice.js
│   │   │       ├── notificationSlice.js
│   │   │       └── messageSlice.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── userService.js
│   │   │   ├── projectService.js
│   │   │   ├── taskService.js
│   │   │   ├── notificationService.js
│   │   │   └── socketService.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
├── SPEC.md
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- MongoDB running locally or connection string for MongoDB Atlas
- npm or yarn package manager

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

**Backend (.env)**:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/techlead_dashboard
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
NODE_ENV=development
```

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Tech Lead | techlead@example.com | password123 |
| Developer | dev@example.com | password123 |
| Manager | manager@example.com | password123 |
| CEO | ceo@example.com | password123 |

## API Documentation

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| POST | /api/auth/logout | Logout user |
| GET | /api/auth/me | Get current user |
| POST | /api/auth/change-password | Change password |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/users | Get all users |
| GET | /api/users/:id | Get user by ID |
| PUT | /api/users/:id | Update user |
| DELETE | /api/users/:id | Delete user |
| GET | /api/users/:id/tasks | Get user's tasks |
| GET | /api/users/:id/projects | Get user's projects |

### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/projects | Get all projects |
| POST | /api/projects | Create project |
| GET | /api/projects/:id | Get project |
| PUT | /api/projects/:id | Update project |
| DELETE | /api/projects/:id | Delete project |
| POST | /api/projects/:id/members | Add member |
| PUT | /api/projects/:id/progress | Update progress |

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tasks | Get all tasks |
| POST | /api/tasks | Create task |
| GET | /api/tasks/:id | Get task |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |
| PUT | /api/tasks/:id/status | Update status |
| PUT | /api/tasks/:id/assign | Assign task |

### Workflow

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/workflow | Get all workflows |
| POST | /api/workflow | Create workflow |
| GET | /api/workflow/:id | Get workflow |
| PUT | /api/workflow/:id | Update workflow |
| PUT | /api/workflow/:id/steps/:stepId/status | Update step status |

### Messages

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/messages/:room | Get room messages |
| POST | /api/messages | Send message |
| PUT | /api/messages/:id/read | Mark as read |
| GET | /api/messages/:room/unread-count | Get unread count |

### Files

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/files | Get all files |
| POST | /api/files/upload | Upload file |
| GET | /api/files/:id | Get file |
| DELETE | /api/files/:id | Delete file |
| GET | /api/files/project/:projectId | Project files |
| GET | /api/files/task/:taskId | Task files |

### Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/reports | Get all reports |
| POST | /api/reports | Create report |
| GET | /api/reports/:id | Get report |
| PUT | /api/reports/:id | Update report |
| DELETE | /api/reports/:id | Delete report |
| GET | /api/reports/user/:userId | User reports |
| GET | /api/reports/project/:projectId | Project reports |

### Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/notifications | Get notifications |
| PUT | /api/notifications/:id/read | Mark as read |
| PUT | /api/notifications/read-all | Mark all read |
| DELETE | /api/notifications/:id | Delete notification |
| GET | /api/notifications/unread-count | Unread count |

### Activities

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/activities | Get all activities |
| GET | /api/activities/user/:userId | User activities |
| GET | /api/activities/entity/:entityType/:entityId | Entity activities |

### Time Tracking

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/time-tracking | Get all entries |
| POST | /api/time-tracking | Create entry |
| GET | /api/time-tracking/:id | Get entry |
| PUT | /api/time-tracking/:id | Update entry |
| DELETE | /api/time-tracking/:id | Delete entry |
| GET | /api/time-tracking/user/:userId | User entries |
| GET | /api/time-tracking/task/:taskId | Task entries |
| GET | /api/time-tracking/project/:projectId | Project entries |

## Integration Guide

### Connecting External Modules

The API Gateway allows connecting external modules via standardized endpoints:

```
http://localhost:5001/api/model1
http://localhost:5001/api/model2
```

Each model should have its own `.env` file with:
```
PORT=5002
MODEL_NAME=model2
MODEL_API_URL=http://localhost:5002/api
```

### Socket.io Events

**Client to Server:**
- `user_online` - User connection
- `join_room` - Join chat room
- `leave_room` - Leave chat room
- `send_message` - Send chat message
- `typing` / `stop_typing` - Typing indicators
- `task_updated` - Task updates
- `file_uploaded` - File uploads
- `notification` - Notifications

**Server to Client:**
- `user_status_change` - Online/offline status
- `receive_message` - New message
- `user_typing` / `user_stop_typing` - Typing status
- `task_update` - Task updates
- `file_update` - File updates
- `new_notification` - New notification
- `notification_update` - Notification updates

## UI Design

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Blue | #3B82F6 | Primary actions, links |
| Secondary Purple | #8B5CF6 | Secondary actions, accents |
| Teal | #14B8A6 | Success states, highlights |
| White | #FFFFFF | Light mode backgrounds |
| Dark Gray | #1F2937 | Dark mode backgrounds |

### Typography

- **Font Family**: Inter
- **Weights**: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semi-bold), 700 (Bold)

### Glassmorphism Effects

```css
background: rgba(255, 255, 255, 0.25);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.18);
```

## Features Overview

### Dashboard
- Visual workflow flowchart
- Tech lead workflow steps with status badges
- Key modules overview (Task Assignment, Team Progress, Code Review, etc.)
- Analytics charts

### Projects
- Project creation and management
- Progress tracking
- Team member assignment
- Technology tags

### Tasks
- Kanban board view
- List view option
- Priority levels
- Due date tracking
- Task assignment

### Messages
- 1-to-1 chat
- Group channels
- Real-time messaging
- Typing indicators
- File sharing

### Files
- Drag and drop upload
- File preview
- Version history
- Download support

### Calendar
- Month/Week/Day views
- Color-coded events
- Meeting scheduling
- Deadline tracking

## License

MIT License - See LICENSE file for details.
