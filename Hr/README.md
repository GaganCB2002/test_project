# WorkSphere Enterprise: Unified HR & Workflow Management System

![Banner](https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200)

## 📌 Project Overview

**WorkSphere Enterprise** is a production-ready, full-stack ecosystem designed to streamline enterprise operations. It integrates recruitment pipelines, technical workflow management, employee performance monitoring, and automated payroll into a single unified platform.

The system is built with a **micro-frontend architecture** mindset, allowing different departments (HR, Tech Leads, Employees) to operate within specialized modules while maintaining a shared authentication and data layer.

### Key Goals:
*   **Recruitment Excellence**: Automate candidate tracking from application to offer.
*   **Workflow Optimization**: Real-time task tracking and sprint management for Tech Leads.
*   **Employee Engagement**: Transparent monitoring, attendance, and performance analytics.
*   **Financial Integrity**: Automated payroll processing with statutory compliance.

---

## 📂 Folder Structure

```text
root/
├── backend/                # Core HR & Auth API (Node.js/TypeScript)
│   ├── src/
│   │   ├── routes/         # API Endpoints
│   │   ├── controllers/    # Business Logic
│   │   └── server.ts       # Socket.io & Express Setup
├── frontend/               # Unified HR & Recruiter Dashboard (React/Vite)
│   ├── src/
│   │   ├── pages/          # Module-specific views (Recruitment, Payroll, etc.)
│   │   ├── components/     # UI Design System
│   │   └── api/            # API Client services
├── tech_lead/              # Dedicated Tech Lead Workflow Module
│   ├── client/             # Tech Lead Frontend
│   └── server/             # Tech Lead API (Node.js/Express)
├── xyz_Model/              # Employee Monitoring & Data Analytics
│   ├── backend/            # Python/Django Service
│   └── frontend/           # Analytics Dashboard
├── docs/                   # System Documentation
└── start_all.bat           # Automation Script for full-stack launch
```

---

## 👥 Role-Based Modules

### 🔹 Recruiter & HR Module
Located in `frontend/`, this module handles the lifecycle of human capital.
*   **Pipeline Management**: Visual ATS (Applicant Tracking System) with AI-match scores.
*   **Onboarding**: Track document collection, asset provisioning (Laptops, Access), and buddy assignment.
*   **Payroll**: Automated salary calculations, TDS/PF deductions, and PDF payslip generation.
*   **Hierarchy**: Interactive organizational chart explorer.

### 🔹 Tech Lead Module
Located in `tech_lead/`, optimized for engineering management.
*   **Sprint Tracking**: Real-time task boards and progress analytics.
*   **Resource Allocation**: Monitor developer bandwidth and project deadlines.
*   **Real-time Collab**: Socket.io powered updates for task status changes.

### 🔹 Employee & Monitoring Module
Located in `xyz_Model/` and `frontend/pages/EmployeeDashboardPage`.
*   **Activity Tracking**: Productivity scores and active task monitoring.
*   **Attendance**: Geo-tagged check-ins, WFH requests, and AI-based leave risk analysis.
*   **Profile Management**: Skills tracking and performance radar charts.

---

## ⚙️ Tech Stack

### **Frontend**
*   **Framework**: React 18+ with Vite (for ultra-fast development)
*   **Language**: TypeScript (Type-safety across modules)
*   **Styling**: Tailwind CSS (Modern, utility-first design)
*   **Charts**: Recharts (Dynamic data visualization)
*   **Icons**: Lucide React

### **Backend**
*   **Primary API**: Node.js & Express (TypeScript)
*   **Monitoring Service**: Python & Django (High-performance data handling)
*   **Real-time**: Socket.io (Bi-directional communication)
*   **Validation**: Zod (Schema validation)
*   **Security**: Helmet.js & CORS configuration

### **Database & Auth**
*   **Database**: PostgreSQL / MongoDB (Module dependent)
*   **Auth**: JWT (JSON Web Tokens) with Role-Based Access Control (RBAC)
*   **Session**: Secure cookie-based or header-based tracking

---

## 🌐 Ports Configuration

| Service | Port | Description |
| :--- | :--- | :--- |
| **HR Frontend** | `5173` | Main dashboard for HR, Recruiters, and Employees |
| **HR Backend API** | `4000` | Core API for auth, payroll, and recruitment |
| **Tech Lead Server** | `5000` | Specialized API for technical workflows |
| **Monitoring API** | `8000` | Django-based monitoring and analytics service |
| **Tech Lead Client** | `3000` | Standalone UI for Engineering Leads |

---

## 🔗 API Architecture & Data Flow

1.  **Authentication**: Users login via the `auth-service`. A JWT is issued containing the user's `Role` (CEO, HR, Manager, Employee, TechLead).
2.  **Request Routing**: The Frontend intercepts the Role and dynamically mounts the appropriate module components.
3.  **Cross-Service Sync**: Real-time updates (like a candidate moving to "Hired") are broadcasted via Socket.io to all relevant dashboards.
4.  **Security**: All API routes are protected by a `verifyToken` middleware that checks both validity and role permissions.

---

## 🚀 Installation & Setup

### Prerequisites
*   Node.js (v18+)
*   Python (v3.10+) for Monitoring service
*   PostgreSQL / MongoDB instance

### Step 1: Clone and Install
```bash
git clone <repository-url>
cd Recruitment-Hiring-Enterprise
npm run install-all
```

### Step 2: Configure Environment
Create `.env` files in `backend/` and `tech_lead/server/`:
```env
PORT=4000
JWT_SECRET=your_super_secret_key
DATABASE_URL=your_db_connection_string
```

### Step 3: Launch System
You can start all services simultaneously using the root automation script:
```bash
npm run dev
```
*Alternatively, run `start_all.bat` on Windows.*

---

## 🔐 Authentication System

The system uses a robust **Role-Based Access Control (RBAC)**:
*   **CEO/Admin**: Full visibility into financials and system-wide analytics.
*   **HR**: Access to Recruitment, Payroll, and Onboarding.
*   **Tech Lead**: Access to Sprint boards and developer performance.
*   **Employee**: Personal dashboard, attendance, and task logging.

---

## 📊 Features Summary
*   ✅ **Real-time Dashboards**: Live updates without page refreshes.
*   ✅ **AI-Powered ATS**: Intelligent candidate matching.
*   ✅ **Automated Payroll**: One-click batch processing.
*   ✅ **Interactive Org Chart**: Visualize enterprise hierarchy.
*   ✅ **Activity Monitoring**: Data-driven productivity tracking.

---

## ⚠️ Common Issues & Fixes

*   **Port 5173/3000 Conflict**: Ensure no other Vite/React apps are running. Change port in `vite.config.ts` if necessary.
*   **CORS Errors**: Verify that the backend `server.ts` has the correct frontend URL in the allowed origins list.
*   **Module Not Loading**: Ensure you ran `npm install` inside each subdirectory (backend, frontend, tech_lead).

---

## 📌 Future Enhancements
*   **AI Interviewer**: Automated video screening for candidates.
*   **Mobile App**: Flutter/React Native integration for employee check-ins.
*   **Blockchain Payroll**: Transparent and immutable salary records.
*   **Predictive Attrition**: ML models to predict employee turnover risk.

---

## 🧾 License & Notes
*   **License**: Proprietary Enterprise License.
*   **Maintenance**: Ensure regular updates of `node_modules` for security patches.
*   **Scalability**: The backend is ready to be dockerized for Kubernetes deployment.

---
**Developed by [Your Company/Team Name]**
