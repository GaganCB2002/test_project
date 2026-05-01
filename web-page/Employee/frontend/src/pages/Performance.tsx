import { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { performanceService } from '@/services/performance.service';
import { taskService } from '@/services/task.service';
import { PerformanceMetrics, Task } from '@/types';
import { Award, Calendar, CheckCircle, Clock, Loader2, Target, TrendingUp } from 'lucide-react';

const chartTooltip = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  color: '#0f172a',
  boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)',
};

export default function PerformancePage() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [performance, myTasks] = await Promise.all([
          performanceService.getDashboardMetrics(),
          taskService.getMyTasks(),
        ]);
        setMetrics(performance);
        setTasks(myTasks);
      } finally {
        setIsLoading(false);
      }
    };
    void loadData();
  }, []);

  const weeklyData = useMemo(() => (
    metrics?.recent_progress_logs?.slice(0, 5).reverse().map((log, index) => ({
      day: `#${index + 1}`,
      hours: Number(((metrics.total_hours || 0) / 5).toFixed(1)),
      tasks: Math.max(1, Math.round(log.percentage / 20)),
    })) ?? []
  ), [metrics]);

  const productivityData = useMemo(() => (
    (metrics?.recent_progress_logs ?? []).slice(0, 4).reverse().map((log, index) => ({
      week: `Update ${index + 1}`,
      score: log.percentage,
    }))
  ), [metrics]);

  const taskDistribution = useMemo(() => ([
    { name: 'Completed', value: metrics?.task_breakdown?.by_status?.completed ?? tasks.filter((task) => task.status === 'COMPLETED').length, color: '#5eead4' },
    { name: 'In Progress', value: metrics?.task_breakdown?.by_status?.in_progress ?? tasks.filter((task) => task.status === 'IN_PROGRESS').length, color: '#93c5fd' },
    { name: 'Pending', value: metrics?.task_breakdown?.by_status?.pending ?? tasks.filter((task) => task.status === 'PENDING').length, color: '#dbeafe' },
  ]), [metrics, tasks]);

  if (isLoading || !metrics) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-500 shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading performance insights...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Performance</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">Productivity and delivery insights</h1>
        <p className="mt-2 text-slate-500">Monitor work output, attendance consistency, and task delivery quality.</p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Completed Tasks', value: metrics.completed_tasks, helper: `${metrics.completion_rate ?? 0}% completion rate`, icon: CheckCircle, tone: 'bg-emerald-50 text-emerald-700', badge: 'Strong' },
          { label: 'Total Hours', value: `${metrics.total_hours}h`, helper: 'Tracked this month', icon: Clock, tone: 'bg-sky-50 text-sky-700', badge: 'Healthy' },
          { label: 'Productivity Score', value: `${metrics.productivity_score}%`, helper: 'Average task progress', icon: TrendingUp, tone: 'bg-teal-50 text-teal-700', badge: 'Rising' },
          { label: 'On-time Delivery', value: `${metrics.on_time_delivery}%`, helper: `${metrics.overdue_tasks ?? 0} overdue tasks`, icon: Target, tone: 'bg-amber-50 text-amber-700', badge: 'Reliable' },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{item.label}</p>
                  <p className="mt-2 text-3xl font-bold text-slate-950">{item.value}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="success">{item.badge}</Badge>
                    <span className="text-sm text-slate-400">{item.helper}</span>
                  </div>
                </div>
                <div className={`rounded-xl p-3 ${item.tone}`}>
                  <item.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-slate-950">Weekly Hours & Tasks</h2>
                <p className="text-sm text-slate-500">Focused work hours compared with completed tasks</p>
              </div>
              <TrendingUp className="h-5 w-5 text-teal-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                  <Tooltip contentStyle={chartTooltip} cursor={{ fill: 'rgba(94, 234, 212, 0.16)' }} />
                  <Bar dataKey="hours" fill="#5eead4" radius={[8, 8, 0, 0]} name="Hours" />
                  <Bar dataKey="tasks" fill="#bfdbfe" radius={[8, 8, 0, 0]} name="Tasks" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-600" />
              <h2 className="font-semibold text-slate-950">Productivity Trend</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={productivityData}>
                  <XAxis dataKey="week" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={chartTooltip} cursor={{ stroke: '#ccfbf1' }} />
                  <Line type="monotone" dataKey="score" stroke="#2dd4bf" strokeWidth={3} dot={{ fill: '#ffffff', stroke: '#2dd4bf', strokeWidth: 3, r: 5 }} name="Score" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[.85fr_1.15fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-sky-700" />
              <h2 className="font-semibold text-slate-950">Task Distribution</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={taskDistribution} cx="50%" cy="50%" innerRadius={64} outerRadius={96} paddingAngle={5} dataKey="value" labelLine={false}>
                    {taskDistribution.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={chartTooltip} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {taskDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-sm text-slate-500">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-semibold text-slate-950">Key Metrics</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Completed Tasks', value: metrics.completed_tasks, helper: 'Closed this month', icon: CheckCircle, progress: metrics.completion_rate ?? 0, tone: 'bg-emerald-50 text-emerald-700' },
              { label: 'Total Hours', value: `${metrics.total_hours}h`, helper: 'Tracked this month', icon: Clock, progress: Math.min(100, (metrics.total_hours / 200) * 100), tone: 'bg-sky-50 text-sky-700' },
              { label: 'On-time Delivery', value: `${metrics.on_time_delivery}%`, helper: 'Task delivery reliability', icon: Target, progress: metrics.on_time_delivery, tone: 'bg-teal-50 text-teal-700' },
              { label: 'Attendance', value: `${metrics.attendance_percentage}%`, helper: 'Monthly attendance consistency', icon: Calendar, progress: metrics.attendance_percentage, tone: 'bg-amber-50 text-amber-700' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-100 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-xl p-3 ${item.tone}`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-950">{item.label}</p>
                      <p className="text-sm text-slate-500">{item.helper}</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-slate-950">{item.value}</span>
                </div>
                <Progress value={item.progress} className="mt-4" />
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
