import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { useAuth } from '@/contexts/AuthContext';
import { attendanceService } from '@/services/attendance.service';
import { performanceService } from '@/services/performance.service';
import { taskService } from '@/services/task.service';
import { timesheetService } from '@/services/timesheet.service';
import { Attendance, PerformanceMetrics, Task, TimeTrackingSummary, WorkSession } from '@/types';
import { formatDate, formatDuration, formatTime, getPriorityColor, getStatusColor, getRelativeTime } from '@/lib/utils';
import {
  ArrowRight,
  BarChart3,
  Bell,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Coffee,
  FileText,
  Loader2,
  LogIn,
  LogOut,
  MessageSquare,
  Timer,
  TrendingUp,
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [todayAttendance, setTodayAttendance] = useState<Attendance | null>(null);
  const [currentSession, setCurrentSession] = useState<WorkSession | null>(null);
  const [dailySummary, setDailySummary] = useState<TimeTrackingSummary | null>(null);
  const [weeklySummary, setWeeklySummary] = useState<TimeTrackingSummary | null>(null);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClockSubmitting, setIsClockSubmitting] = useState(false);
  const [isBreakSubmitting, setIsBreakSubmitting] = useState(false);

  const loadDashboard = async () => {
    setIsLoading(true);
    try {
      const [
        myTasks,
        attendance,
        session,
        daySummary,
        weekSummary,
        performance,
      ] = await Promise.all([
        taskService.getMyTasks(),
        attendanceService.getTodayAttendance(),
        timesheetService.getCurrentSession(),
        timesheetService.getSummary('daily'),
        timesheetService.getSummary('weekly'),
        performanceService.getDashboardMetrics(),
      ]);
      setTasks(myTasks);
      setTodayAttendance(attendance);
      setCurrentSession(session);
      setDailySummary(daySummary);
      setWeeklySummary(weekSummary);
      setMetrics(performance);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      // Optional: show a toast or error state
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  const isClockedIn = Boolean(currentSession && !currentSession.clock_out);
  const activeBreak = currentSession?.breaks.find((item) => !item.ended_at) ?? null;

  const taskSummary = useMemo(() => ({
    completed: tasks.filter((task) => task.status === 'COMPLETED').length,
    pendingReview: tasks.filter((task) => task.status === 'REVIEW').length,
    inProgress: tasks.filter((task) => task.status === 'IN_PROGRESS').length,
  }), [tasks]);

  const notifications = useMemo(() => {
    const items = [];

    if (taskSummary.pendingReview > 0) {
      items.push({
        id: 'review',
        title: 'Tasks waiting for review',
        message: `${taskSummary.pendingReview} task${taskSummary.pendingReview > 1 ? 's are' : ' is'} currently in review.`,
        created_at: new Date().toISOString(),
      });
    }

    if (weeklySummary?.overtime_minutes) {
      items.push({
        id: 'overtime',
        title: 'Overtime logged this week',
        message: `${formatDuration(weeklySummary.overtime_minutes)} of overtime has been tracked this week.`,
        created_at: new Date().toISOString(),
      });
    }

    if (tasks[0]) {
      items.push({
        id: tasks[0].id,
        title: 'Nearest deadline',
        message: `${tasks[0].title} is due on ${formatDate(tasks[0].deadline)}.`,
        created_at: tasks[0].updated_at,
      });
    }

    return items.slice(0, 3);
  }, [taskSummary.pendingReview, tasks, weeklySummary]);

  const handleClockToggle = async () => {
    setIsClockSubmitting(true);
    try {
      if (isClockedIn) {
        await attendanceService.logout();
      } else {
        await attendanceService.login();
      }
      await loadDashboard();
    } finally {
      setIsClockSubmitting(false);
    }
  };

  const handleBreakToggle = async () => {
    setIsBreakSubmitting(true);
    try {
      if (activeBreak) {
        await timesheetService.endBreak();
      } else {
        await timesheetService.startBreak();
      }
      await loadDashboard();
    } finally {
      setIsBreakSubmitting(false);
    }
  };

  const statCards = [
    {
      label: 'Today worked',
      value: formatDuration(dailySummary?.total_worked_minutes ?? 0),
      helper: `${formatDuration(dailySummary?.total_break_minutes ?? 0)} of break time`,
      icon: Timer,
      tone: 'bg-teal-50 text-teal-700',
    },
    {
      label: 'Tasks completed',
      value: metrics?.completed_tasks ?? taskSummary.completed,
      helper: `${taskSummary.inProgress} in progress right now`,
      icon: CheckCircle2,
      tone: 'bg-emerald-50 text-emerald-700',
    },
    {
      label: 'Pending reviews',
      value: taskSummary.pendingReview,
      helper: 'Ready for manager feedback',
      icon: FileText,
      tone: 'bg-amber-50 text-amber-700',
    },
    {
      label: 'Attendance rate',
      value: `${metrics?.attendance_percentage ?? 0}%`,
      helper: 'Current monthly consistency',
      icon: CalendarCheck,
      tone: 'bg-sky-50 text-sky-700',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-500 shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          Preparing your dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/70">
        <div className="grid gap-6 p-6 lg:grid-cols-[1fr_360px] lg:p-8">
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Employee Dashboard</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-950">
                Good day, {user?.first_name}. Your workday is organized.
              </h1>
              <p className="mt-2 max-w-2xl text-slate-500">
                Attendance, work hours, breaks, projects, and assigned tasks are all moving from one place now.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase text-slate-400">Today</p>
                <p className="mt-1 text-lg font-semibold text-slate-950">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase text-slate-400">Current session</p>
                <p className="mt-1 text-lg font-semibold text-slate-950">
                  {formatDuration(currentSession?.worked_minutes ?? 0)}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase text-slate-400">Weekly overtime</p>
                <p className="mt-1 text-lg font-semibold text-slate-950">
                  {formatDuration(weeklySummary?.overtime_minutes ?? 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50 to-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-500">Attendance status</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${isClockedIn ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  <p className="text-xl font-bold text-slate-950">{isClockedIn ? 'Clocked in' : 'Clocked out'}</p>
                </div>
              </div>
              <div className="rounded-xl bg-white p-3 text-teal-700 shadow-sm">
                <Clock className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Clock in</span>
                <span className="font-semibold text-slate-950">
                  {todayAttendance?.login_time ? formatTime(`2026-01-01T${todayAttendance.login_time}`) : 'Not marked'}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-slate-500">Clock out</span>
                <span className="font-semibold text-slate-950">
                  {todayAttendance?.logout_time
                    ? formatTime(`2026-01-01T${todayAttendance.logout_time}`)
                    : 'Active'}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-slate-500">Break status</span>
                <span className="font-semibold text-slate-950">
                  {activeBreak ? 'Break in progress' : 'Working'}
                </span>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Button
                onClick={handleClockToggle}
                className="gap-2"
                size="lg"
                variant={isClockedIn ? 'secondary' : 'primary'}
                isLoading={isClockSubmitting}
              >
                {isClockedIn ? <LogOut className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
                {isClockedIn ? 'Clock Out' : 'Clock In'}
              </Button>
              <Button
                onClick={handleBreakToggle}
                className="gap-2"
                size="lg"
                variant="ghost"
                disabled={!isClockedIn}
                isLoading={isBreakSubmitting}
              >
                <Coffee className="h-5 w-5" />
                {activeBreak ? 'End Break' : 'Start Break'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold text-slate-950">{stat.value}</p>
                  <p className="mt-2 text-sm text-slate-500">{stat.helper}</p>
                </div>
                <div className={`rounded-xl p-3 ${stat.tone}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_.65fr]">
        <Card>
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div>
              <h2 className="font-semibold text-slate-950">Task Overview</h2>
              <p className="text-sm text-slate-500">Assigned work that needs your attention</p>
            </div>
            <Link to="/tasks" className="text-sm font-semibold text-teal-700 hover:text-teal-800">
              View all
            </Link>
          </div>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {tasks.slice(0, 4).map((task) => (
                <Link key={task.id} to={`/tasks/${task.id}`} className="block px-6 py-4 transition hover:bg-slate-50">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-950">{task.title}</h3>
                        <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                        <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">{task.description}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-medium text-slate-400">
                        <span>Due {formatDate(task.deadline)}</span>
                        {task.project_name && <span>{task.project_name}</span>}
                      </div>
                    </div>
                    <div className="w-full md:w-40">
                      <div className="mb-2 flex justify-between text-xs font-medium text-slate-500">
                        <span>Progress</span>
                        <span>{task.progress_percentage}%</span>
                      </div>
                      <Progress value={task.progress_percentage} />
                    </div>
                  </div>
                </Link>
              ))}
              {tasks.length === 0 && (
                <div className="px-6 py-10 text-center text-sm text-slate-500">
                  No assigned tasks yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="font-semibold text-slate-950">Quick Actions</h2>
            </div>
            <CardContent className="grid gap-3">
              {[
                { label: 'Update task progress', icon: BarChart3, to: '/tasks' },
                { label: 'Open attendance logs', icon: CalendarCheck, to: '/attendance' },
                { label: 'Review messages', icon: MessageSquare, to: '/chat' },
              ].map((action) => (
                <Link key={action.label} to={action.to} className="flex items-center justify-between rounded-xl border border-slate-100 p-3 transition hover:border-teal-100 hover:bg-teal-50/50">
                  <span className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                    <span className="rounded-lg bg-slate-100 p-2 text-slate-600"><action.icon className="h-4 w-4" /></span>
                    {action.label}
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="font-semibold text-slate-950">Notifications</h2>
              <Link to="/notifications" className="text-sm font-semibold text-teal-700">All</Link>
            </div>
            <CardContent className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className="flex gap-3">
                  <div className="mt-1 rounded-lg bg-teal-50 p-2 text-teal-700">
                    <Bell className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-950">{notification.title}</p>
                    <p className="text-sm text-slate-500">{notification.message}</p>
                    <p className="mt-1 text-xs text-slate-400">{getRelativeTime(notification.created_at)}</p>
                  </div>
                </div>
              ))}
              {notifications.length === 0 && (
                <p className="text-sm text-slate-500">You are all caught up.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-indigo-50 p-3 text-indigo-700">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-950">Productivity insight</p>
                  <p className="text-sm text-slate-500">
                    {metrics?.on_time_delivery
                      ? `${metrics.on_time_delivery}% on-time delivery with ${metrics.productivity_score}% productivity score.`
                      : 'Keep an eye on your active tasks and break balance for a smooth day.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
