# AuraHR: Enterprise Platform Documentation

## 🚀 Executive Summary
AuraHR is a next-generation, microservice-based Enterprise Resource Planning (ERP) and Human Resources Management System (HRMS). It unifies diverse corporate functions—from high-level CEO analytics to individual employee lifecycle management—into a single, high-performance ecosystem. The platform is designed with a "Single Pane of Glass" philosophy, ensuring that every role (HR, Tech Lead, Employee, Marketing) has a tailored, high-contrast interface optimized for their specific workflows.

---

## 🛠 Technology Stack

### **Frontend Infrastructure**
- **Core Framework**: React 19 (Strict Mode)
- **Build Tool**: Vite 8.0+
- **Styling**: Vanilla CSS + Tailwind CSS 3.4 (Theme-aware variants)
- **Animations**: Framer Motion (for luxury glassmorphism transitions)
- **Data Visualization**: Recharts (Interactive SVG charts)
- **Iconography**: Lucide React
- **State Management**: React Context + Hooks (useMemo, useEffect optimization)

### **Backend & Data**
- **Primary API**: Node.js / Express (CommonJS & ESM support)
- **Secondary API**: Python / Django (Dedicated Employee Management logic)
- **Database**: MongoDB (Mongoose ODM) with fallback failover support
- **Real-time**: Socket.io (Bi-directional telemetry and notifications)
- **Security**: JWT (JsonWebToken) with custom RBAC (Role-Based Access Control) bypass logic for demo environments

---

## 🏗 System Architecture (Microservices)

The platform operates on a multi-port architecture orchestrated by a central PowerShell-driven master script.

| Service Name | Port | Description |
| :--- | :--- | :--- |
| **Main Platform Hub** | 3005 | The entry point, landing page, and unified login portal. |
| **HR Backend Gateway** | 8081 | The central authentication and data orchestration API. |
| **CEO Command Center** | 3001 | High-level executive dashboard for budget and strategic planning. |
| **Employee Hub (UI)** | 5173 | Personal dashboard for leaves, profile, and internal tasks. |
| **Employee API** | 8000 | Django-based backend for robust employee record management. |
| **Tech Lead Hub** | 3003 | Engineering-specific dashboard for velocity and code signals. |
| **IT Helpdesk** | 3004 | Ticketing system for hardware and access requests. |
| **Marketing & Sales** | 3006 | AI-driven insights for campaign and recruitment marketing. |
| **Location Server** | 3007 | Real-time tracking and field force management. |

---

## 🌟 Key Features

### **1. Dynamic Theme Engine**
AuraHR features a platform-wide **Light/Dark mode system**. 
- **Dark Mode**: Uses `luxury-black` (#020617) and `slate-900` for a high-end, futuristic feel.
- **Light Mode**: Uses `slate-50` and high-contrast text to ensure accessibility and professional aesthetics in bright environments.
- Persistence is handled via `localStorage` and synchronized across all active tabs.

### **2. Role-Based Navigation**
The `AppShell` dynamically filters navigation items based on the authenticated user's role:
- **CEO/ADMIN**: Full access to all 20+ modules.
- **HR**: Focus on Recruitment, Payroll, and Performance.
- **TECH LEAD**: Engineering Sync, Analysis, and Project Velocity.
- **EMPLOYEE**: Profile, Attendance, and Document Management.

### **3. AI Copilot Integration**
- **Recruitment**: Automatic AI match-scoring for candidates.
- **HR**: Attrition risk prediction and budget forecasting.
- **Employee**: AI-suggested time-off risk analysis based on team workload.

---

## 📂 Project Directory Structure

```text
Recruitment & Hiring_1/
├── Hr/                         # Master Project Core
│   ├── backend/                # Primary Node.js API
│   ├── startup_master.js       # PowerShell-based Service Orchestrator
│   ├── Employee/               # Django-based Employee Service
│   ├── tech_lead/              # Engineering Management Module
│   └── IT Helpdesk/            # Support Ticketing System
├── web-page/                   # Unified Hub & Landing Page
│   ├── frontend/               # React/Vite Main Application
│   │   ├── src/
│   │   │   ├── components/     # UI/UX Library (MetricCards, SectionCards)
│   │   │   ├── pages/          # Core views (Landing, Login, Dashboard)
│   │   │   └── api/            # Centralized Axios/Fetch client
│   └── backend/                # Main Hub API (Mirroring core backend)
├── Location/                   # Real-time Asset Tracking Service
├── marketing_sales/            # AI Marketing Intelligence Module
└── startup_web.js              # Root entry point script
```

---

## ⚙️ Infrastructure & Deployment

### **Launch Orchestrator**
The project uses a sophisticated `startup_master.js` script that utilizes **PowerShell** to handle Windows path complexities (specifically the ampersand `&` in the project directory). It spawns each microservice in an independent terminal window with pre-configured environment variables.

### **Security Protocol**
- **Authentication**: Multi-tier login supporting both local MongoDB credentials and Django session tokens.
- **API Protection**: All private routes are wrapped in a `ProtectedRoute` component that verifies JWT validity before rendering.

---
*Document Version: 2.1.0*
*Status: Production-Stabilized*
