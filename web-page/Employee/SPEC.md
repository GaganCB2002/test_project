# Employee Dashboard System - Technical Specification

## 1. Project Overview

**Project Name:** Employee Dashboard System
**Type:** Full-stack Enterprise HR & Project Management Platform
**Core Functionality:** A comprehensive dashboard where employees can manage tasks, track time, communicate with team members, submit work for review, and monitor their performance metrics.
**Target Users:** Enterprise employees with role-based access (Employee role only)

## 2. Technology Stack

### Frontend
- **Framework:** React.js 18+ with TypeScript
- **Styling:** Tailwind CSS 3.4+
- **State Management:** React Context + React Query
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Real-time:** Socket.io-client (for Django Channels)
- **UI Components:** Custom enterprise components
- **Icons:** Lucide React
- **Charts:** Recharts

### Backend
- **Framework:** Django 5.0+ with Django REST Framework
- **Authentication:** JWT (djangorestframework-simplejwt)
- **Real-time:** Django Channels with Redis
- **Database:** PostgreSQL 15+
- **File Storage:** Django FileField with local storage
- **CORS:** django-cors-headers

### Database Schema

```
Users (Custom User Model)
├── id (UUID, PK)
├── email (unique)
├── password (hashed)
├── first_name
├── last_name
├── role (EMPLOYEE only for this system)
├── department
├── designation
├── avatar
├── is_active
├── created_at
└── updated_at

Tasks
├── id (UUID, PK)
├── title
├── description
├── assigned_to (FK -> User)
├── created_by (FK -> User)
├── status (PENDING, IN_PROGRESS, REVIEW, COMPLETED)
├── priority (LOW, MEDIUM, HIGH, CRITICAL)
├── progress_percentage (0-100)
├── deadline
├── attachments (M2M -> File)
├── comments (M2M -> Comment)
├── created_at
└── updated_at

Comments
├── id (UUID, PK)
├── task (FK -> Task)
├── author (FK -> User)
├── content
├── created_at
└── updated_at

TimeSheets
├── id (UUID, PK)
├── user (FK -> User)
├── task (FK -> Task, nullable)
├── date
├── start_time
├── end_time
├── duration_minutes
├── description
└── created_at

Attendance
├── id (UUID, PK)
├── user (FK -> User)
├── date
├── login_time
├── logout_time
├── status (PRESENT, ABSENT, LEAVE, HALF_DAY)
└── created_at

LeaveRequest
├── id (UUID, PK)
├── user (FK -> User)
├── leave_type (SICK, CASUAL, ANNUAL, UNPAID)
├── start_date
├── end_date
├── reason
├── status (PENDING, APPROVED, REJECTED)
├── reviewed_by (FK -> User, nullable)
├── reviewed_at
└── created_at

IssueReport
├── id (UUID, PK)
├── task (FK -> Task)
├── reporter (FK -> User)
├── title
├── description
├── severity (LOW, MEDIUM, HIGH, CRITICAL)
├── status (OPEN, IN_PROGRESS, RESOLVED, CLOSED)
├── resolved_at
└── created_at

WorkSubmission
├── id (UUID, PK)
├── task (FK -> Task)
├── submitted_by (FK -> User)
├── notes
├── attachments (M2M -> File)
├── status (PENDING_REVIEW, CHANGES_REQUESTED, APPROVED)
├── review_notes
├── reviewed_by (FK -> User, nullable)
├── reviewed_at
└── submitted_at

Notification
├── id (UUID, PK)
├── recipient (FK -> User)
├── sender (FK -> User, nullable)
├── type (TASK_ASSIGNED, REMINDER, FEEDBACK, APPROVAL, MENTION)
├── title
├── message
├── is_read
├── related_task (FK -> Task, nullable)
├── created_at
└── read_at

ChatRoom
├── id (UUID, PK)
├── name
├── type (DIRECT, GROUP, TASK)
├── participants (M2M -> User)
├── related_task (FK -> Task, nullable)
├── created_at
└── updated_at

ChatMessage
├── id (UUID, PK)
├── room (FK -> ChatRoom)
├── sender (FK -> User)
├── content
├── attachments (M2M -> File)
├── created_at
└── updated_at

File
├── id (UUID, PK)
├── file
├── filename
├── file_type
├── size
├── uploaded_by (FK -> User)
├── related_task (FK -> Task, nullable)
├── created_at
└── updated_at

ProgressLog
├── id (UUID, PK)
├── task (FK -> Task)
├── user (FK -> User)
├── percentage
├── notes
├── created_at
└── updated_at
```

## 3. UI/UX Specification

### Layout Structure
- **Sidebar:** Fixed left sidebar (280px width, collapsible to 72px on mobile)
- **Header:** Fixed top header (64px height) with search, notifications, user menu
- **Main Content:** Scrollable content area with breadcrumbs
- **Mobile:** Bottom navigation bar, collapsible sidebar as drawer

### Color Palette (Dark Mode Primary)
```
--bg-primary: #0f172a (slate-900)
--bg-secondary: #1e293b (slate-800)
--bg-tertiary: #334155 (slate-700)
--bg-card: #1e293b
--text-primary: #f8fafc (slate-50)
--text-secondary: #94a3b8 (slate-400)
--text-muted: #64748b (slate-500)
--accent-primary: #6366f1 (indigo-500)
--accent-secondary: #8b5cf6 (violet-500)
--success: #22c55e (green-500)
--warning: #f59e0b (amber-500)
--error: #ef4444 (red-500)
--info: #3b82f6 (blue-500)
--border: #334155 (slate-700)
```

### Light Mode
```
--bg-primary: #ffffff
--bg-secondary: #f8fafc (slate-50)
--bg-tertiary: #f1f5f9 (slate-100)
--bg-card: #ffffff
--text-primary: #0f172a (slate-900)
--text-secondary: #475569 (slate-600)
--text-muted: #64748b (slate-500)
--accent-primary: #6366f1 (indigo-500)
--border: #e2e8f0 (slate-200)
```

### Typography
- **Font Family:** Inter (primary), system-ui fallback
- **Headings:**
  - H1: 30px, font-weight 700
  - H2: 24px, font-weight 600
  - H3: 20px, font-weight 600
  - H4: 16px, font-weight 600
- **Body:** 14px, font-weight 400
- **Small:** 12px, font-weight 400
- **Mono:** JetBrains Mono (for code/timestamps)

### Spacing System
- Base unit: 4px
- Common spacings: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px

### Component Specifications

#### Sidebar Navigation
- Logo at top (company branding area)
- Navigation items with icons and labels
- Active state: indigo accent background with left border
- Hover: subtle background change
- Collapsed state: icons only with tooltips

#### Kanban Board
- Columns: Pending (gray), In Progress (blue), Review (amber), Completed (green)
- Cards show: title, priority badge, deadline, progress bar, assignee avatar
- Drag-and-drop between columns
- Card hover: slight elevation, border highlight

#### Task Card
- Border-radius: 12px
- Shadow: subtle on hover
- Priority indicators: colored left border (red=critical, orange=high, blue=medium, gray=low)
- Progress bar at bottom

#### Buttons
- Primary: indigo background, white text, rounded-lg
- Secondary: transparent with border
- Ghost: no background, text only
- Sizes: sm (32px), md (40px), lg (48px)
- Hover: slight brightness increase

#### Form Inputs
- Height: 40px (md), 48px (lg)
- Border-radius: 8px
- Focus: indigo ring
- Dark mode: slate-700 background

#### Notifications Panel
- Slide-out from right
- Unread badge on bell icon
- Grouped by date
- Mark as read on click

## 4. Module Specifications

### 4.1 My Tasks (Kanban Board)
**Features:**
- Drag-and-drop task cards between columns
- Filter by: priority, deadline, assignee
- Sort by: created date, deadline, priority
- Quick actions: view details, update progress, add comment
- Column counts displayed

**Task Detail Modal:**
- Full task information
- Edit capability for assigned user
- Progress slider (0-100%)
- Comments section with file attachments
- Activity log
- Status change dropdown

### 4.2 Time Tracking / Timesheet
**Features:**
- Start/Stop timer with current task
- Manual time entry
- Daily work log view
- Task-based hour tracking
- Weekly summary with charts
- Export to CSV

**Timer Widget:**
- Floating/mini mode option
- Shows current task name
- Elapsed time in large font
- Stop button with confirmation

### 4.3 Progress Updates
**Features:**
- Update progress percentage (slider + input)
- Add notes with rich text
- Attach files
- View history of updates
- Timeline view of all changes

### 4.4 Issue / Blocker Reporting
**Features:**
- Report form with:
  - Title (required)
  - Description (required)
  - Related task (dropdown)
  - Severity (dropdown)
  - Attachments
- Auto-notify Tech Lead/Manager
- Track status changes
- Resolution notes

### 4.5 Submit Work for Review
**Features:**
- Select task to submit
- Add submission notes
- Attach completed work files
- View review status
- Receive feedback from reviewer
- Re-submit after changes requested

### 4.6 Attendance & Leave
**Attendance:**
- Login/Logout buttons
- Today's attendance status
- Monthly calendar view
- Attendance statistics

**Leave:**
- Leave request form
- Leave balance display
- Leave history
- Status tracking

### 4.7 Notifications
**Features:**
- Real-time updates via WebSocket
- Notification types:
  - Task assigned
  - Deadline reminders
  - Feedback received
  - Leave approved/rejected
  - Work approved
  - Mentions
- Bell icon with unread count
- Notification panel with history

### 4.8 Files & Documents
**Features:**
- Upload files (drag-and-drop)
- Download files
- File preview for images/PDFs
- Task-related files section
- Company documents section
- File metadata display

### 4.9 Communication Panel
**Features:**
- Chat rooms (direct, group, task-based)
- Real-time messaging via WebSocket
- File sharing in chat
- Message reactions
- @mentions with autocomplete
- Unread message indicators

### 4.10 Performance Dashboard
**Metrics:**
- Completed tasks (count, trend)
- Total work hours
- Productivity score (calculated)
- Attendance percentage
- On-time delivery rate
- Weekly/Monthly charts

## 5. API Endpoints

### Authentication
```
POST   /api/auth/register/
POST   /api/auth/login/
POST   /api/auth/logout/
POST   /api/auth/refresh/
GET    /api/auth/me/
```

### Tasks
```
GET    /api/tasks/                 # List user's tasks
POST   /api/tasks/                 # Create task
GET    /api/tasks/{id}/            # Task detail
PUT    /api/tasks/{id}/            # Update task
PATCH  /api/tasks/{id}/            # Partial update
DELETE /api/tasks/{id}/            # Delete task
POST   /api/tasks/{id}/progress/   # Update progress
GET    /api/tasks/{id}/comments/   # Task comments
POST   /api/tasks/{id}/comments/   # Add comment
```

### Time Tracking
```
GET    /api/timesheet/            # List timesheets
POST   /api/timesheet/            # Create timesheet entry
PUT    /api/timesheet/{id}/       # Update entry
DELETE /api/timesheet/{id}/       # Delete entry
GET    /api/timesheet/summary/    # Weekly/monthly summary
```

### Attendance
```
GET    /api/attendance/           # List attendance
POST   /api/attendance/login/    # Login
POST   /api/attendance/logout/    # Logout
GET    /api/attendance/today/     # Today's status
GET    /api/attendance/stats/     # Attendance statistics
```

### Leave
```
GET    /api/leave/                # List leave requests
POST   /api/leave/               # Create leave request
PUT    /api/leave/{id}/          # Update request
GET    /api/leave/balance/       # Leave balance
```

### Issues
```
GET    /api/issues/              # List issues
POST   /api/issues/              # Create issue
PUT    /api/issues/{id}/         # Update issue
GET    /api/issues/{id}/          # Issue detail
```

### Work Submissions
```
GET    /api/submissions/         # List submissions
POST   /api/submissions/          # Create submission
GET    /api/submissions/{id}/     # Submission detail
PUT    /api/submissions/{id}/     # Update submission
```

### Notifications
```
GET    /api/notifications/        # List notifications
PATCH  /api/notifications/{id}/   # Mark as read
POST   /api/notifications/read-all/ # Mark all as read
```

### Files
```
GET    /api/files/                # List files
POST   /api/files/upload/          # Upload file
GET    /api/files/{id}/            # Download file
DELETE /api/files/{id}/            # Delete file
```

### Chat
```
GET    /api/chat/rooms/           # List chat rooms
POST   /api/chat/rooms/           # Create room
GET    /api/chat/rooms/{id}/messages/ # Room messages
POST   /api/chat/rooms/{id}/messages/ # Send message
```

### Performance
```
GET    /api/performance/dashboard/ # Dashboard metrics
GET    /api/performance/stats/     # Detailed statistics
```

## 6. Folder Structure

### Backend (Django)
```
backend/
├── config/                 # Django project settings
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── apps/
│   ├── accounts/          # User authentication
│   ├── tasks/             # Task management
│   ├── timesheet/         # Time tracking
│   ├── attendance/        # Attendance & leave
│   ├── notifications/      # Real-time notifications
│   ├── chat/              # Chat functionality
│   ├── files/             # File management
│   └── performance/        # Performance metrics
├── core/                  # Shared utilities
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
├── media/                 # Uploaded files
├── requirements.txt
└── manage.py
```

### Frontend (React)
```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── ui/           # Base UI components
│   │   ├── layout/       # Layout components
│   │   └── features/     # Feature-specific components
│   ├── pages/             # Page components
│   ├── hooks/             # Custom React hooks
│   ├── contexts/          # React contexts
│   ├── services/          # API services
│   ├── utils/             # Utility functions
│   ├── types/             # TypeScript types
│   └── styles/            # Global styles
├── public/
├── package.json
└── vite.config.ts
```

## 7. Security Requirements

- JWT tokens with short expiry (15min access, 7day refresh)
- HTTPS in production
- Input validation on all endpoints
- CORS configured for frontend origin
- SQL injection prevention (ORM)
- XSS prevention (React)
- CSRF protection for non-API endpoints
- Rate limiting on auth endpoints
- File upload validation (type, size)

## 8. Real-time Features (Django Channels)

- WebSocket connection for notifications
- Chat messaging with rooms
- Typing indicators
- Online/offline status
- Real-time task updates
- Notification bell updates

## 9. Acceptance Criteria

1. All API endpoints return proper responses
2. JWT authentication works correctly
3. Kanban board supports drag-and-drop
4. Timer starts/stops correctly and persists
5. Notifications appear in real-time
6. Chat messages send/receive instantly
7. All forms validate input correctly
8. Dark/light mode toggles smoothly
9. Mobile responsive on all pages
10. Performance dashboard shows accurate metrics
11. Files upload/download correctly
12. Leave requests workflow functions
