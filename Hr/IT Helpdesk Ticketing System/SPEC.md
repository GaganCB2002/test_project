# IT Department Management Dashboard - SPEC.md

## 1. Concept & Vision

A premium, enterprise-grade IT Helpdesk Ticketing System built with the MERN stack. The system feels like a polished SaaS product with a sophisticated glassmorphic dark/light theme, smooth Framer Motion animations, and a dashboard experience comparable to ServiceNow or Freshservice. The interface prioritizes clarity, efficiency, and a sense of control for IT professionals managing complex workflows.

---

## 2. Design Language

### Aesthetic Direction
Premium SaaS dashboard with glassmorphism effects, soft shadows, and subtle gradients. Think Linear meets ServiceNow - professional yet modern with careful attention to micro-interactions.

### Color Palette

**Dark Mode (Primary):**
- Background Primary: `#0a0a0f` (deep space black)
- Background Secondary: `#12121a` (card surfaces)
- Background Tertiary: `#1a1a24` (elevated elements)
- Border: `rgba(255, 255, 255, 0.08)`
- Glass: `rgba(255, 255, 255, 0.05)`

**Light Mode:**
- Background Primary: `#f8fafc` (slate-50)
- Background Secondary: `#ffffff`
- Background Tertiary: `#f1f5f9` (slate-100)
- Border: `rgba(0, 0, 0, 0.08)`

**Accent Colors:**
- Primary: `#6366f1` (Indigo-500)
- Primary Hover: `#4f46e5` (Indigo-600)
- Success: `#10b981` (Emerald-500)
- Warning: `#f59e0b` (Amber-500)
- Danger: `#ef4444` (Red-500)
- Info: `#3b82f6` (Blue-500)

**Priority Colors:**
- Critical: `#ef4444` (Red)
- High: `#f97316` (Orange)
- Medium: `#eab308` (Yellow)
- Low: `#22c55e` (Green)

### Typography
- Primary Font: `Inter` (Google Fonts) - clean, modern sans-serif
- Monospace: `JetBrains Mono` - for code/IDs
- Scale: 12px (xs), 14px (sm), 16px (base), 18px (lg), 24px (xl), 32px (2xl), 48px (3xl)
- Weights: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Spatial System
- Base unit: 4px
- Spacing scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px
- Border radius: 6px (sm), 8px (md), 12px (lg), 16px (xl), 24px (2xl)
- Card padding: 24px
- Section gaps: 24px

### Motion Philosophy
- Page transitions: 300ms ease-out with staggered children (50ms delay)
- Hover effects: 150ms ease-out (scale 1.02, shadow lift)
- Modal/Drawer: 400ms spring (damping: 25, stiffness: 300)
- List items: fade-in-up with 30ms stagger
- Toast notifications: slide-in from right with spring physics

### Visual Assets
- Icons: Lucide React (consistent stroke width, 24px default)
- Charts: Recharts with custom styling
- Status indicators: Animated pulse dots
- Avatars: Gradient backgrounds with initials

---

## 3. Layout & Structure

### Overall Architecture
```
┌─────────────────────────────────────────────────────────────┐
│  Sidebar (240px)  │  Main Content Area                      │
│  ┌─────────────┐  │  ┌─────────────────────────────────────┐│
│  │ Logo        │  │  │ Top Navbar (64px)                   ││
│  │ Navigation  │  │  │ Search | Notifications | Profile    ││
│  │ - Dashboard │  │  ├─────────────────────────────────────┤│
│  │ - Tickets   │  │  │                                     ││
│  │ - Assets    │  │  │ Page Content                        ││
│  │ - Users     │  │  │ (Cards, Tables, Charts)             ││
│  │ - Knowledge │  │  │                                     ││
│  │ - Settings  │  │  │                                     ││
│  │             │  │  │                                     ││
│  │ User Info   │  │  │                                     ││
│  └─────────────┘  │  └─────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Responsive Breakpoints
- Mobile: < 640px (sidebar hidden, bottom nav)
- Tablet: 640px - 1024px (sidebar collapsed to icons)
- Desktop: > 1024px (full sidebar)

### Page Rhythm
- Dashboard: KPI cards (grid) → Charts (full width) → Recent activity (split)
- List pages: Filters bar → Data table with pagination
- Detail pages: Header with actions → Two-column layout (main + sidebar)
- Forms: Single column with clear sections

---

## 4. Features & Interactions

### Authentication
- **Login**: Email/password with JWT tokens stored in httpOnly cookies
- **Signup**: Name, email, password, role selection (Employee default)
- **Logout**: Clear tokens, redirect to login
- **Protected routes**: Redirect to login if unauthenticated
- **Role-based access**: Different navigation items per role

### Ticket Management
- **Create ticket**: Multi-step form with category, priority, description, attachments
- **View ticket**: Full details with timeline/comments, status update dropdown
- **Assign ticket**: Searchable dropdown of IT staff
- **Filter tickets**: By status, priority, category, date range, assignee
- **Search**: Real-time search across ticket titles and descriptions
- **SLA tracking**: Visual indicator when approaching deadline

### Asset Management
- **Add asset**: Form with serial number, category, purchase date, warranty expiry
- **Assign asset**: Link to employee record
- **Track history**: Every assignment change logged
- **QR codes**: Generate printable QR codes for physical assets
- **Warranty alerts**: Visual indicator for expiring warranties

### Admin Dashboard
- **KPI cards**: Animated counters with trend indicators
- **Charts**: Line chart (tickets over time), Donut chart (by category), Bar chart (by priority)
- **User management**: CRUD operations with role assignment
- **Activity log**: Real-time feed of system events

### Notifications
- **Real-time**: Socket.io push notifications
- **Bell icon**: Badge count, dropdown with notification list
- **Mark as read**: Individual and bulk actions
- **Types**: New ticket, assignment, status change, comment

### AI Assistant
- **Chat interface**: Floating button → Drawer with chat
- **Suggestions**: Pre-built quick answers for common issues
- **Ticket classification**: Analyze description → suggest category/priority

### Knowledge Base
- **Article list**: Searchable, categorized articles
- **Article view**: Markdown rendered, related articles
- **Admin authoring**: Rich text editor for creating articles

### System Monitoring
- **Server status**: Green/yellow/red indicators per server
- **Metrics**: CPU, Memory, Disk (mock data with realistic patterns)
- **Alerts**: Toast notifications for critical issues

---

## 5. Component Inventory

### Sidebar
- States: Expanded (240px), Collapsed (64px), Hidden (mobile)
- Nav items: Icon + label, active indicator (left border + background)
- User section: Avatar, name, role, logout button
- Collapse toggle: Chevron button at bottom

### Top Navbar
- Search: Expandable input with Cmd+K shortcut hint
- Notifications: Bell icon with unread badge, dropdown panel
- Profile: Avatar dropdown with settings, theme toggle, logout
- Theme toggle: Sun/Moon icon with smooth rotation

### KPI Card
- States: Default, loading (skeleton), error
- Elements: Icon (colored background), title, value (large), trend indicator
- Hover: Subtle shadow lift and scale

### Data Table
- Features: Sortable columns, row selection, pagination
- Row states: Default, hover, selected
- Empty state: Illustration with "No data" message
- Loading: Skeleton rows

### Ticket Card
- Elements: ID badge, title, priority dot, status badge, assignee avatar, time
- Hover: Border highlight, slight elevation
- Click: Navigate to detail page

### Modal/Dialog
- Overlay: Dark semi-transparent with blur
- Animation: Scale from 0.95 + fade
- Sizes: sm (400px), md (500px), lg (700px), xl (900px)
- Close: X button, click outside, Escape key

### Toast Notification
- Types: Success (green), Error (red), Warning (yellow), Info (blue)
- Position: Top-right
- Auto-dismiss: 5 seconds
- Animation: Slide in from right, slide out

### Form Elements
- Input: Border on focus (primary color), error state (red border + message)
- Select: Custom dropdown with search
- Textarea: Auto-resize, character count
- File upload: Drag-and-drop zone with preview
- Button: Primary, Secondary, Ghost, Danger variants

---

## 6. Technical Approach

### Frontend Architecture
```
client/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Base components (Button, Input, Card)
│   │   ├── layout/         # Sidebar, Navbar, Layout
│   │   └── common/         # Shared components (DataTable, Modal)
│   ├── pages/              # Route-level components
│   ├── modules/            # Feature modules
│   │   ├── auth/
│   │   ├── tickets/
│   │   ├── assets/
│   │   ├── dashboard/
│   │   └── notifications/
│   ├── redux/              # Redux Toolkit store
│   │   ├── slices/         # Feature slices
│   │   └── store.js
│   ├── services/           # API service functions
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Helper functions
│   └── styles/             # Global styles, Tailwind config
```

### Backend Architecture
```
server/
├── config/
│   ├── db.js               # MongoDB connection
│   └── jwt.js              # JWT configuration
├── controllers/
│   ├── authController.js
│   ├── ticketController.js
│   ├── assetController.js
│   └── userController.js
├── middleware/
│   ├── auth.js             # JWT verification
│   ├── roleCheck.js        # Role-based access
│   └── errorHandler.js
├── models/
│   ├── User.js
│   ├── Ticket.js
│   ├── Asset.js
│   └── Notification.js
├── routes/
│   ├── auth.js
│   ├── tickets.js
│   ├── assets.js
│   └── users.js
├── services/
│   └── socketService.js
└── server.js
```

### API Endpoints

**Auth:**
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

**Tickets:**
- `GET /api/tickets` - List tickets (filtered, paginated)
- `POST /api/tickets` - Create ticket
- `GET /api/tickets/:id` - Get ticket details
- `PUT /api/tickets/:id` - Update ticket
- `DELETE /api/tickets/:id` - Delete ticket
- `POST /api/tickets/:id/comments` - Add comment
- `PUT /api/tickets/:id/assign` - Assign ticket

**Assets:**
- `GET /api/assets` - List assets
- `POST /api/assets` - Create asset
- `GET /api/assets/:id` - Get asset details
- `PUT /api/assets/:id` - Update asset
- `DELETE /api/assets/:id` - Delete asset
- `POST /api/assets/:id/assign` - Assign to employee

**Users:**
- `GET /api/users` - List users (admin only)
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

**Notifications:**
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read

### Data Models

**User:**
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: Enum ['employee', 'it_staff', 'admin'],
  department: String,
  avatar: String,
  createdAt: Date
}
```

**Ticket:**
```javascript
{
  title: String,
  description: String,
  category: Enum ['hardware', 'software', 'network', 'access'],
  priority: Enum ['low', 'medium', 'high', 'critical'],
  status: Enum ['open', 'in_progress', 'resolved', 'closed'],
  createdBy: ObjectId (User),
  assignedTo: ObjectId (User),
  comments: [{
    text: String,
    author: ObjectId (User),
    createdAt: Date
  }],
  attachments: [String],
  slaDeadline: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Asset:**
```javascript
{
  name: String,
  type: String,
  serialNumber: String (unique),
  category: Enum ['laptop', 'monitor', 'keyboard', 'mouse', 'headset', 'other'],
  status: Enum ['available', 'assigned', 'maintenance', 'retired'],
  assignedTo: ObjectId (User),
  purchaseDate: Date,
  warrantyExpiry: Date,
  location: String,
  notes: String,
  history: [{
    action: String,
    from: ObjectId,
    to: ObjectId,
    date: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

**Notification:**
```javascript
{
  user: ObjectId (User),
  type: String,
  title: String,
  message: String,
  read: Boolean,
  link: String,
  createdAt: Date
}
```

### Real-time (Socket.io)
- Connection: JWT authentication on connect
- Events: `notification`, `ticket_update`, `asset_update`
- Rooms: Per-user room for personal notifications

### Security
- Password hashing: bcrypt (12 rounds)
- JWT: Access token (15min) + Refresh token (7 days)
- Rate limiting: 100 requests per 15 minutes
- Input validation: express-validator
- Security headers: Helmet.js
- CORS: Configured for frontend origin
