# Tech Lead Workflow Dashboard - Specification

## Project Overview
A production-ready MERN stack workflow management dashboard designed for tech leads to manage development teams and track project progress through a visual workflow system.

## Tech Stack
- **Frontend**: React.js with Vite, Redux Toolkit, Tailwind CSS, Framer Motion
- **Backend**: Node.js + Express.js
- **Database**: MongoDB with Mongoose ORM
- **Realtime**: Socket.io
- **Authentication**: JWT with Role-Based Access Control
- **Styling**: Glassmorphism + Soft UI with Light/Dark mode

## Ports
- Frontend: localhost:3000
- Backend: localhost:5000
- MongoDB: localhost:27017

## Database Collections
- users, roles, projects, tasks, workflows, messages, files, reports, notifications, activity_logs, time_tracking

## API Endpoints
/api/auth, /api/users, /api/projects, /api/tasks, /api/workflow, /api/messages, /api/files, /api/reports, /api/notifications

## Core Features
1. JWT Authentication with Role-Based Access Control (Tech Lead only)
2. Real-time notifications via Socket.io
3. Visual workflow flowchart
4. Task management system
5. Team progress tracking
6. Code review interface
7. Real-time chat system
8. File management with drag & drop
9. Analytics dashboard with charts
10. Time tracking
11. Calendar integration
12. AI-powered task suggestions
13. Dark/Light theme toggle

## UI Design
- Glassmorphism with blur effects and rounded cards
- Color palette: Blue (#3B82F6), Purple (#8B5CF6), Teal (#14B8A6), White (#FFFFFF), Dark Gray (#1F2937)
- Smooth Framer Motion animations
- Lucide icons throughout
- Responsive layout with collapsible sidebar
