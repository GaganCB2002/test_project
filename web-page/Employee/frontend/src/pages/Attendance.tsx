import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { attendanceService } from '@/services/attendance.service';
import { timesheetService } from '@/services/timesheet.service';
import { Attendance, AttendanceStats, WorkSession } from '@/types';
import { formatDate, formatDuration, formatTime } from '@/lib/utils';
import { CalendarCheck, CalendarX, Clock, Loader2, LogIn, LogOut, Timer, TrendingUp } from 'lucide-react';

type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LEAVE' | 'HALF_DAY';

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [todayAttendance, setTodayAttendance] = useState<Attendance | null>(null);
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [currentSession, setCurrentSession] = useState<WorkSession | null>(null);
  const [monthlySummaryMinutes, setMonthlySummaryMinutes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [attendanceList, today, monthlyStats, session, monthlyTimeSummary] = await Promise.all([
        attendanceService.getAttendanceList(),
        attendanceService.getTodayAttendance(),
        attendanceService.getAttendanceStats(month, year),
        timesheetService.getCurrentSession(),
        timesheetService.getSummary('monthly'),
      ]);
      setAttendance(attendanceList);
      setTodayAttendance(today);
      setStats(monthlyStats);
      setCurrentSession(session);
      setMonthlySummaryMinutes(monthlyTimeSummary.total_worked_minutes);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const handleClockToggle = async () => {
    setIsSubmitting(true);
    try {
      if (todayAttendance?.login_time && !todayAttendance.logout_time) {
        await attendanceService.logout();
      } else {
        await attendanceService.login();
      }
      await loadData();
    } finally {
      setIsSubmitting(false);
    }
  };

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
  const recordsByDate = useMemo(() => {
    const map = new Map<number, AttendanceStatus>();
    attendance.forEach((entry) => {
      const day = new Date(entry.date).getDate();
      map.set(day, entry.status);
    });
    return map;
  }, [attendance]);

  const statusStyles: Record<AttendanceStatus, string> = {
    PRESENT: 'bg-emerald-500',
    ABSENT: 'bg-rose-500',
    LEAVE: 'bg-amber-500',
    HALF_DAY: 'bg-orange-500',
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-500 shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading attendance...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Attendance</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950">Daily attendance and work hours</h1>
          <p className="mt-2 text-slate-500">Clock in, review logs, and keep monthly attendance transparent.</p>
        </div>
        <Button
          onClick={handleClockToggle}
          size="lg"
          variant={todayAttendance?.login_time && !todayAttendance.logout_time ? 'secondary' : 'primary'}
          className="gap-2"
          isLoading={isSubmitting}
        >
          {todayAttendance?.login_time && !todayAttendance.logout_time ? <LogOut className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
          {todayAttendance?.login_time && !todayAttendance.logout_time ? 'Clock Out' : 'Clock In'}
        </Button>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Badge variant={todayAttendance?.login_time && !todayAttendance.logout_time ? 'success' : 'default'}>
                  {todayAttendance?.login_time && !todayAttendance.logout_time ? 'Active session' : 'Session ended'}
                </Badge>
                <h2 className="mt-3 text-2xl font-bold text-slate-950">
                  {todayAttendance?.login_time && !todayAttendance.logout_time ? 'You are clocked in' : 'You are clocked out'}
                </h2>
                <p className="mt-1 text-slate-500">
                  {todayAttendance?.login_time
                    ? `Started at ${formatTime(`2026-01-01T${todayAttendance.login_time}`)}`
                    : 'No attendance marked yet today.'}
                  {todayAttendance?.logout_time ? `, ended at ${formatTime(`2026-01-01T${todayAttendance.logout_time}`)}` : ''}
                </p>
              </div>
              <div className="rounded-2xl bg-teal-50 p-5 text-center">
                <p className="text-sm font-medium text-teal-700">Today worked</p>
                <p className="mt-1 text-3xl font-bold text-slate-950">
                  {formatDuration(currentSession?.worked_minutes ?? 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {[
          { label: 'Present', value: stats?.present_days ?? 0, icon: CalendarCheck, tone: 'text-emerald-700 bg-emerald-50' },
          { label: 'Absent', value: stats?.absent_days ?? 0, icon: CalendarX, tone: 'text-rose-700 bg-rose-50' },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{item.label}</p>
                  <p className="mt-2 text-3xl font-bold text-slate-950">{item.value}</p>
                </div>
                <div className={`rounded-xl p-3 ${item.tone}`}>
                  <item.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-semibold text-slate-950">
                {new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex flex-wrap gap-3 text-xs font-medium text-slate-500">
                {[
                  ['Present', 'bg-emerald-500'],
                  ['Absent', 'bg-rose-500'],
                  ['Leave', 'bg-amber-500'],
                  ['Half day', 'bg-orange-500'],
                ].map(([label, dot]) => (
                  <span key={label} className="flex items-center gap-2"><span className={`h-2.5 w-2.5 rounded-full ${dot}`} />{label}</span>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="py-2 text-center text-xs font-semibold uppercase text-slate-400">{day}</div>
              ))}
              {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const date = index + 1;
                const status = recordsByDate.get(date) ?? null;
                const isToday = date === new Date().getDate();
                return (
                  <div
                    key={date}
                    className={`relative flex aspect-square items-center justify-center rounded-xl border text-sm font-semibold transition ${
                      isToday ? 'border-teal-300 bg-teal-50 text-teal-800' : 'border-slate-100 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {date}
                    {status && <span className={`absolute bottom-2 h-1.5 w-1.5 rounded-full ${statusStyles[status]}`} />}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Timer className="h-5 w-5 text-teal-700" />
                <h2 className="font-semibold text-slate-950">Work-hour summary</h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                ['This month', formatDuration(monthlySummaryMinutes), stats?.month ?? 'Current month'],
                ['Attendance rate', `${stats?.attendance_percentage ?? 0}%`, `${stats?.present_days ?? 0} present days`],
                ['Overtime today', formatDuration(currentSession?.overtime_minutes ?? 0), 'Based on active work session'],
              ].map(([label, value, helper]) => (
                <div key={label} className="rounded-xl border border-slate-100 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-500">{label}</p>
                    <p className="font-bold text-slate-950">{value}</p>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">{helper}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-sky-700" />
                <h2 className="font-semibold text-slate-950">Attendance logs</h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {attendance.slice(0, 5).map((log) => (
                <div key={log.id} className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-950">{formatDate(log.date)}</p>
                      <p className="text-xs text-slate-400">{log.status.replace('_', ' ')}</p>
                    </div>
                    <Badge variant={log.logout_time ? 'default' : 'success'}>
                      {log.logout_time ? 'Completed' : 'Active'}
                    </Badge>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                    <span><span className="block text-slate-400">In</span><span className="font-semibold text-slate-700">{log.login_time ? formatTime(`2026-01-01T${log.login_time}`) : '-'}</span></span>
                    <span><span className="block text-slate-400">Out</span><span className="font-semibold text-slate-700">{log.logout_time ? formatTime(`2026-01-01T${log.logout_time}`) : 'Active'}</span></span>
                    <span><span className="block text-slate-400">Hours</span><span className="font-semibold text-slate-700">{log.date === currentSession?.date ? formatDuration(currentSession?.worked_minutes ?? 0) : '-'}</span></span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
