# Employee Dashboard System

A modern, production-ready Employee Dashboard System for Enterprise HR & Project Management built with React.js, TypeScript, Django, and PostgreSQL.

## Features

### Core Modules
- **My Tasks (Kanban Board)** - Drag-and-drop task management with status columns (Pending, In Progress, Review, Completed)
- **Time Tracking / Timesheet** - Start-stop timer, daily work log, task-based hour tracking, weekly summary
- **Progress Updates** - Percentage updates, notes, comments, file uploads
- **Issue / Blocker Reporting** - Report problems with severity levels, notify Tech Lead/Manager
- **Submit Work for Review** - Submit completed work with notes, attachments, and review status
- **Attendance & Leave** - Login/logout tracking, leave request form, leave balance
- **Notifications** - Real-time task assigned, reminders, feedback, approvals via WebSocket
- **Files & Documents** - Upload/download task files and company documents
- **Communication Panel** - Chat and task comments similar to Slack
- **Performance Dashboard** - Completed tasks, work hours, productivity score, attendance %, on-time delivery %

### Technical Stack
- **Frontend:** React.js 18, TypeScript, Tailwind CSS, React Query, Socket.io-client, Recharts
- **Backend:** Django 5.0, Django REST Framework, Django Channels, PostgreSQL
- **Authentication:** JWT (djangorestframework-simplejwt)
- **Real-time:** Django Channels with Redis

## Project Structure

```
xyz_Model/
├── backend/                 # Django Backend
│   ├── config/              # Django project settings
│   ├── apps/                # Django apps
│   │   ├── accounts/        # User authentication
│   │   ├── tasks/           # Task management
│   │   ├── timesheet/       # Time tracking
│   │   ├── attendance/       # Attendance & leave
│   │   ├── notifications/    # Real-time notifications
│   │   ├── chat/            # Chat functionality
│   │   ├── files/           # File management
│   │   ├── issues/          # Issue reporting
│   │   ├── submissions/      # Work submissions
│   │   └── performance/      # Performance metrics
│   ├── core/                # Shared utilities
│   ├── media/               # Uploaded files
│   ├── requirements.txt
│   └── manage.py
├── frontend/                # React Frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── contexts/          # React contexts
│   │   ├── services/          # API services
│   │   ├── types/             # TypeScript types
│   │   └── lib/                # Utility functions
│   ├── package.json
│   └── vite.config.ts
└── SPEC.md                   # Technical specification
```

## Setup Instructions

### Prerequisites

- Node.js 18+
- Python 3.10+
- PostgreSQL 15+
- Redis 6+ (for real-time features)
- Git

### Database Setup

1. Install PostgreSQL
2. Create a database:
```sql
CREATE DATABASE employeedashboard;
CREATE USER postgres WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE employeedashboard TO postgres;
```

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

5. Update `.env` with your database credentials

6. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

7. Create superuser (optional):
```bash
python manage.py createsuperuser
```

8. Run development server:
```bash
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Running with Docker (Optional)

For Redis and other services:
```bash
docker run -d -p 6379:6379 redis:alpine
```

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login (returns JWT tokens)
- `POST /api/auth/logout/` - Logout
- `POST /api/auth/refresh/` - Refresh access token
- `GET /api/auth/me/` - Get current user profile

### Tasks
- `GET /api/tasks/` - List user's tasks
- `POST /api/tasks/` - Create task
- `GET /api/tasks/{id}/` - Task detail
- `PUT /api/tasks/{id}/` - Update task
- `PATCH /api/tasks/{id}/progress/` - Update progress
- `GET /api/tasks/{id}/comments/` - Task comments
- `POST /api/tasks/{id}/comments/` - Add comment

### Time Tracking
- `GET /api/timesheet/` - List timesheets
- `POST /api/timesheet/` - Create timesheet entry
- `GET /api/timesheet/summary/` - Weekly summary

### Attendance & Leave
- `POST /api/attendance/login/` - Login
- `POST /api/attendance/logout/` - Logout
- `GET /api/attendance/today/` - Today's attendance
- `GET /api/leave/` - List leave requests
- `POST /api/leave/` - Create leave request
- `GET /api/leave/balance/` - Leave balance

### Notifications
- `GET /api/notifications/` - List notifications
- `PATCH /api/notifications/{id}/` - Mark as read
- `POST /api/notifications/read-all/` - Mark all as read

### Chat
- `GET /api/chat/rooms/` - List chat rooms
- `POST /api/chat/rooms/` - Create room
- `GET /api/chat/rooms/{id}/messages/` - Room messages
- `POST /api/chat/rooms/{id}/messages/` - Send message

### Files
- `GET /api/files/` - List files
- `POST /api/files/upload/` - Upload file
- `GET /api/files/{id}/` - Download file
- `DELETE /api/files/{id}/` - Delete file

### Performance
- `GET /api/performance/dashboard/` - Dashboard metrics

## WebSocket Endpoints

Real-time features available at:
- `ws://localhost:8000/ws/notifications/` - Notifications
- `ws://localhost:8000/ws/chat/{room_id}/` - Chat rooms
- `ws://localhost:8000/ws/tasks/` - Task updates

## Design System

### Colors (Dark Mode - Primary)
- Background Primary: `#0f172a` (slate-900)
- Background Secondary: `#1e293b` (slate-800)
- Background Tertiary: `#334155` (slate-700)
- Text Primary: `#f8fafc` (slate-50)
- Text Secondary: `#94a3b8` (slate-400)
- Accent Primary: `#6366f1` (indigo-500)
- Accent Secondary: `#8b5cf6` (violet-500)
- Success: `#22c55e` (green-500)
- Warning: `#f59e0b` (amber-500)
- Error: `#ef4444` (red-500)

### Typography
- Font Family: Inter (primary)
- H1: 30px / 700
- H2: 24px / 600
- H3: 20px / 600
- H4: 16px / 600
- Body: 14px / 400
- Small: 12px / 400

## Environment Variables

### Backend (.env)
```
DJANGO_SECRET_KEY=your-secret-key
DEBUG=True
DB_NAME=employeedashboard
DB_USER=postgres
DB_PASSWORD=password
REDIS_URL=redis://localhost:6379/1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

## Security

- JWT authentication with 15-minute access tokens and 7-day refresh tokens
- HTTPS in production
- Input validation on all endpoints
- CORS configured for frontend origin
- SQL injection prevention via Django ORM
- XSS prevention via React

## License

MIT License
