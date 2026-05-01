import { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { timesheetService } from '@/services/timesheet.service';
import { TimeSheet, TimeTrackingSummary, WorkSession } from '@/types';
import { formatDate, formatDuration, formatTime } from '@/lib/utils';
import { Clock, Coffee, Loader2, Play, Square, Timer, TrendingUp } from 'lucide-react';

const tooltipStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  color: '#0f172a',
  boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)',
};

export default function TimeTracking() {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [summary, setSummary] = useState<TimeTrackingSummary | null>(null);
  const [todayEntries, setTodayEntries] = useState<TimeSheet[]>([]);
  const [currentSession, setCurrentSession] = useState<WorkSession | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isBreakSubmitting, setIsBreakSubmitting] = useState(false);
  const [newEntry, setNewEntry] = useState({
    description: '',
    start_time: '',
    end_time: '',
  });

  const loadData = async (targetPeriod = period) => {
    setIsLoading(true);
    try {
      const [summaryData, todayData, sessionData] = await Promise.all([
        timesheetService.getSummary(targetPeriod),
        timesheetService.getTodayTimeSheet(),
        timesheetService.getCurrentSession(),
      ]);
      setSummary(summaryData);
      setTodayEntries(todayData.entries);
      setCurrentSession(todayData.work_session ?? sessionData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData(period);
  }, [period]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (currentSession?.clock_in && !currentSession.clock_out) {
      timer = setInterval(() => {
        const start = new Date(currentSession.clock_in).getTime();
        setElapsedSeconds(Math.max(0, Math.floor((Date.now() - start) / 1000)));
      }, 1000);
    } else {
      setElapsedSeconds(0);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [currentSession]);

  const chartData = useMemo(() => (
    summary?.sessions
      .slice()
      .reverse()
      .map((session) => ({
        day: new Date(session.date).toLocaleDateString('en-US', { weekday: 'short' }),
        hours: Number((session.worked_minutes / 60).toFixed(1)),
        breakHours: Number((session.total_break_minutes / 60).toFixed(1)),
      })) ?? []
  ), [summary]);

  const formatElapsedTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddEntry = async () => {
    if (!newEntry.description || !newEntry.start_time || !newEntry.end_time) {
      return;
    }

    await timesheetService.createTimeSheet({
      date: new Date().toISOString().split('T')[0],
      start_time: newEntry.start_time,
      end_time: newEntry.end_time,
      description: newEntry.description,
    });
    setNewEntry({ description: '', start_time: '', end_time: '' });
    await loadData(period);
  };

  const handleBreakToggle = async () => {
    if (!currentSession || currentSession.clock_out) {
      return;
    }

    setIsBreakSubmitting(true);
    try {
      const activeBreak = currentSession.breaks.find((item) => !item.ended_at);
      if (activeBreak) {
        await timesheetService.endBreak();
      } else {
        await timesheetService.startBreak();
      }
      await loadData(period);
    } finally {
      setIsBreakSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-500 shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading time insights...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Time Tracking</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950">Work hours, breaks, and attendance rhythm</h1>
          <p className="mt-2 text-slate-500">
            Review daily, weekly, and monthly work hours with break totals, overtime, and attendance coverage.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
          {(['daily', 'weekly', 'monthly'] as const).map((item) => (
            <button
              key={item}
              onClick={() => setPeriod(item)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                period === item ? 'bg-teal-600 text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-950'
              }`}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Worked time', value: formatDuration(summary?.total_worked_minutes ?? 0), helper: `${period} total`, icon: Clock, tone: 'bg-teal-50 text-teal-700' },
          { label: 'Break time', value: formatDuration(summary?.total_break_minutes ?? 0), helper: 'Tracked break duration', icon: Coffee, tone: 'bg-amber-50 text-amber-700' },
          { label: 'Overtime', value: formatDuration(summary?.overtime_minutes ?? 0), helper: 'Beyond standard 8h/day', icon: TrendingUp, tone: 'bg-sky-50 text-sky-700' },
          { label: 'Attendance', value: `${summary?.attendance_summary.present ?? 0} present`, helper: `${summary?.attendance_summary.leave ?? 0} leave / ${summary?.attendance_summary.absent ?? 0} absent`, icon: Timer, tone: 'bg-emerald-50 text-emerald-700' },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{item.label}</p>
                  <p className="mt-2 text-3xl font-bold text-slate-950">{item.value}</p>
                  <p className="mt-1 text-sm text-slate-400">{item.helper}</p>
                </div>
                <div className={`rounded-xl p-3 ${item.tone}`}>
                  <item.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_380px]">
        <Card className="min-w-0">
          <CardHeader>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-slate-950">Current work session</h2>
                <p className="text-sm text-slate-500">Automatically tracked from login until clock-out.</p>
              </div>
              <Badge variant={currentSession && !currentSession.clock_out ? 'success' : 'default'}>
                {currentSession && !currentSession.clock_out ? 'Live' : 'Inactive'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-2xl bg-gradient-to-br from-teal-50 via-white to-sky-50 p-6 text-center">
              <p className="text-sm font-medium uppercase tracking-wide text-teal-700">Live timer</p>
              <p className="mt-4 text-5xl font-bold tracking-tight text-slate-950 sm:text-6xl">
                {currentSession && !currentSession.clock_out
                  ? formatElapsedTime(elapsedSeconds)
                  : formatDuration(currentSession?.worked_minutes ?? 0)}
              </p>
              <p className="mt-3 text-sm text-slate-500">
                {currentSession?.clock_in
                  ? `Clocked in at ${formatTime(currentSession.clock_in)}`
                  : 'Login to start automatic attendance and time tracking.'}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase text-slate-400">Clock in</p>
                <p className="mt-1 text-lg font-semibold text-slate-950">
                  {currentSession?.clock_in ? formatTime(currentSession.clock_in) : 'Not started'}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase text-slate-400">Worked</p>
                <p className="mt-1 text-lg font-semibold text-slate-950">
                  {formatDuration(currentSession?.worked_minutes ?? 0)}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase text-slate-400">Break total</p>
                <p className="mt-1 text-lg font-semibold text-slate-950">
                  {formatDuration(currentSession?.total_break_minutes ?? 0)}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={handleBreakToggle}
                className="gap-2"
                size="lg"
                variant="secondary"
                disabled={!currentSession || Boolean(currentSession.clock_out)}
                isLoading={isBreakSubmitting}
              >
                {currentSession?.breaks.find((item) => !item.ended_at)
                  ? <Square className="h-5 w-5" />
                  : <Play className="h-5 w-5" />}
                {currentSession?.breaks.find((item) => !item.ended_at) ? 'End Break' : 'Start Break'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader>
            <h2 className="font-semibold text-slate-950">
              {period.charAt(0).toUpperCase() + period.slice(1)} summary
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(20, 184, 166, 0.08)' }} />
                  <Bar dataKey="hours" fill="#7dd3fc" radius={[8, 8, 0, 0]} name="Worked hours" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">From</p>
                <p className="mt-1 text-lg font-bold text-slate-950">
                  {summary ? formatDate(summary.from_date) : '-'}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">To</p>
                <p className="mt-1 text-lg font-bold text-slate-950">
                  {summary ? formatDate(summary.to_date) : '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_420px]">
        <Card className="min-w-0">
          <CardHeader>
            <h2 className="font-semibold text-slate-950">Tracked work sessions</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {summary?.sessions.map((session) => (
                <div key={session.id} className="rounded-2xl border border-slate-100 p-4 transition hover:bg-slate-50">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-slate-950">{formatDate(session.date)}</p>
                        {session.clock_out ? (
                          <Badge>Closed</Badge>
                        ) : (
                          <Badge variant="success">Active</Badge>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-slate-500">
                        {formatTime(session.clock_in)} - {session.clock_out ? formatTime(session.clock_out) : 'Active'}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                      <Badge variant="info">{formatDuration(session.worked_minutes)}</Badge>
                      <span>Break {formatDuration(session.total_break_minutes)}</span>
                      <span>Overtime {formatDuration(session.overtime_minutes)}</span>
                    </div>
                  </div>
                </div>
              ))}
              {summary?.sessions.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
                  No work sessions found for this period yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="min-w-0 self-start">
          <CardHeader>
            <h2 className="font-semibold text-slate-950">Add manual entry</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Description"
              placeholder="What did you work on?"
              value={newEntry.description}
              onChange={(event) => setNewEntry({ ...newEntry, description: event.target.value })}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                type="time"
                label="Start Time"
                value={newEntry.start_time}
                onChange={(event) => setNewEntry({ ...newEntry, start_time: event.target.value })}
              />
              <Input
                type="time"
                label="End Time"
                value={newEntry.end_time}
                onChange={(event) => setNewEntry({ ...newEntry, end_time: event.target.value })}
              />
            </div>
            <Button onClick={handleAddEntry} className="w-full gap-2">
              <Clock className="h-4 w-4" /> Add Entry
            </Button>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-950">Today&apos;s manual entries</p>
              <div className="mt-3 space-y-3">
                {todayEntries.length === 0 && (
                  <p className="text-sm text-slate-500">No manual entries added today.</p>
                )}
                {todayEntries.map((entry) => (
                  <div key={entry.id} className="rounded-xl bg-white p-3">
                    <p className="font-medium text-slate-950">{entry.description}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {entry.start_time} - {entry.end_time} • {formatDuration(entry.duration_minutes)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
