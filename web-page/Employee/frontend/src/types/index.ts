// User types
export type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  department: string;
  designation: string;
  avatar: string | null;
  role: 'EMPLOYEE' | 'ADMIN' | 'MANAGER' | 'HR';
  is_active?: boolean;
};

// Task and project types
export type Project = {
  id: string;
  name: string;
  code: string;
  description: string;
  owner: User | null;
  status: 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED';
  start_date: string | null;
  end_date: string | null;
  total_tasks: number;
  completed_tasks: number;
  created_at: string;
  updated_at: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  assigned_to: User | null;
  created_by: User | null;
  project?: string | null;
  project_name?: string | null;
  project_code?: string | null;
  status: 'PENDING' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  progress_percentage: number;
  estimated_hours?: number;
  deadline: string;
  comments?: Comment[];
  comments_count?: number;
  attachments?: UploadedFile[];
  attachments_count?: number;
  created_at: string;
  updated_at: string;
};

export type Comment = {
  id: string;
  task: string;
  author: User;
  content: string;
  created_at: string;
};

// Time tracking
export type TimeSheet = {
  id: string;
  user: string;
  task: string | null;
  task_title?: string | null;
  date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  description: string;
};

export type BreakSession = {
  id: string;
  started_at: string;
  ended_at: string | null;
  duration_minutes: number;
  created_at: string;
  updated_at: string;
};

export type WorkSession = {
  id: string;
  date: string;
  clock_in: string;
  clock_out: string | null;
  total_break_minutes: number;
  worked_minutes: number;
  overtime_minutes: number;
  breaks: BreakSession[];
  created_at: string;
  updated_at: string;
};

export type TimeTrackingSummary = {
  period: 'daily' | 'weekly' | 'monthly';
  from_date: string;
  to_date: string;
  total_worked_minutes: number;
  total_break_minutes: number;
  overtime_minutes: number;
  attendance_summary: {
    present: number;
    absent: number;
    leave: number;
    half_day: number;
  };
  sessions: WorkSession[];
};

// Attendance
export type Attendance = {
  id: string;
  user: string;
  date: string;
  login_time: string | null;
  logout_time: string | null;
  status: 'PRESENT' | 'ABSENT' | 'LEAVE' | 'HALF_DAY';
};

// Leave
export type LeaveRequest = {
  id: string;
  user: string;
  leave_type: 'SICK' | 'CASUAL' | 'ANNUAL' | 'UNPAID';
  start_date: string;
  end_date: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewed_by: User | null;
  created_at: string;
};

export type AttendanceStats = {
  month: string;
  total_days: number;
  present_days: number;
  half_days: number;
  absent_days: number;
  on_leave_days: number;
  pending_leaves: number;
  attendance_percentage: number;
};

// Notifications
export type Notification = {
  id: string;
  recipient: string;
  sender: User | null;
  type: 'TASK_ASSIGNED' | 'REMINDER' | 'FEEDBACK' | 'APPROVAL' | 'MENTION';
  title: string;
  message: string;
  is_read: boolean;
  related_task: Task | null;
  created_at: string;
};

// Chat
export type ChatRoom = {
  id: string;
  name: string;
  type: 'DIRECT' | 'GROUP' | 'TASK';
  participants: User[];
  last_message: ChatMessage | null;
  unread_count: number;
};

export type ChatMessage = {
  id: string;
  room: string;
  sender: User;
  content: string;
  created_at: string;
};

// Files
export type UploadedFile = {
  id: string;
  file: string | null;
  filename: string;
  file_type: string;
  size: number;
  uploaded_by?: User;
  related_task: string | null;
  created_at: string;
};

export type File = UploadedFile;

// Issues
export type IssueReport = {
  id: string;
  category: 'HR' | 'TECHNICAL' | 'PAYROLL' | 'LEAVE' | 'GENERAL';
  task: Task | string | null;
  reporter: User;
  assigned_to?: User | null;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  resolved_at?: string | null;
  created_at: string;
  updated_at?: string;
};

// Submissions
export type WorkSubmission = {
  id: string;
  task: Task;
  submitted_by: User;
  notes: string;
  status: 'PENDING_REVIEW' | 'CHANGES_REQUESTED' | 'APPROVED';
  review_notes: string | null;
  reviewed_by: User | null;
  submitted_at: string;
};

// Performance
export type PerformanceMetrics = {
  total_tasks?: number;
  completed_tasks: number;
  total_hours: number;
  productivity_score: number;
  attendance_percentage: number;
  on_time_delivery: number;
  in_progress_tasks?: number;
  pending_tasks?: number;
  overdue_tasks?: number;
  completion_rate?: number;
  average_progress?: number;
  recent_progress_logs?: {
    id: string;
    task: string;
    task_title: string;
    user: string;
    user_name: string;
    percentage: number;
    notes: string;
    created_at: string;
  }[];
  task_breakdown?: {
    by_status: Record<string, number>;
    by_priority: Record<string, number>;
  };
  weekly_data?: { day: string; hours: number; tasks: number }[];
};

export type ApiResponse<T> = { data: T; message?: string };

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  department: string;
  designation: string;
}
