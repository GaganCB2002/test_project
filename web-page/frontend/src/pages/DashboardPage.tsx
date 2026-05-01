import React from 'react'
import { AlertTriangle, Brain, RefreshCw, User as UserIcon } from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { MetricCard } from '../components/ui/MetricCard'
import { SectionCard } from '../components/ui/SectionCard'
import { StatusBadge } from '../components/ui/StatusBadge'
import { currency, dateTimeLabel } from '../lib/format'
import type { ActivityItem, DashboardData } from '../types'

interface DashboardPageProps {
  data: DashboardData
  feed: ActivityItem[]
  onRefresh: () => Promise<void>
}

const chartPalette = ['#0f766e', '#1d4ed8', '#f97316', '#7c3aed']

export function DashboardPage({ data, feed, onRefresh }: DashboardPageProps) {
  return (
    <div className="space-y-4">
      <section className="glass-panel overflow-hidden p-7">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">Command center</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-slate-900 dark:text-white">{data?.hero?.title || 'Dashboard'}</h2>
            <p className="mt-4 max-w-3xl text-base text-slate-600 dark:text-slate-400">{data?.hero?.subtitle}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {data?.hero?.modules?.map((module) => (
                <span key={module} className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-300">
                  {module}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] bg-slate-950 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-white/45">AI recommendations</p>
                <h3 className="mt-2 text-2xl font-semibold">Workforce pulse</h3>
              </div>
              <Brain className="h-7 w-7 text-amber-300" />
            </div>
            <div className="mt-6 space-y-4">
              {data?.aiInsights?.recommendations?.map((recommendation) => (
                <div key={recommendation} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75">
                  {recommendation}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* ... rest of components with optional chaining ... */}

      <section className="grid gap-4 xl:grid-cols-3">
        {data?.metrics?.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard
          title="Attendance and productivity"
          subtitle="Month-wise workforce health indicators."
          action={
            <button
              type="button"
              onClick={() => void onRefresh()}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:border-brand hover:text-brand"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh snapshot
            </button>
          }
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.attendanceTrend || []}>
                  <defs>
                    <linearGradient id="attendanceFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="#0f766e" stopOpacity={0.42} />
                      <stop offset="95%" stopColor="#0f766e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Area dataKey="value" stroke="#0f766e" fill="url(#attendanceFill)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.productivityTrend || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                    {(data?.productivityTrend || []).map((entry, index) => (
                      <Cell key={entry.label} fill={chartPalette[index % chartPalette.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Active alerts" subtitle="Operational items that need attention this week.">
          <div className="space-y-3">
            {data?.alerts?.map((alert) => (
              <div key={alert} className="flex gap-3 rounded-2xl bg-amber-50 dark:bg-amber-950/20 px-4 py-4 text-sm text-amber-800 dark:text-amber-400">
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>{alert}</span>
              </div>
            ))}
            {data?.aiInsights?.attritionHotspots?.map((item) => (
              <div key={item.name} className="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-slate-800 px-4 py-4">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{item.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{item.department}</p>
                </div>
                <StatusBadge label={`${item.risk >= 30 ? 'High' : item.risk >= 15 ? 'Medium' : 'Low'}`} />
              </div>
            ))}
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionCard title="Budget utilization" subtitle="Department spending against approved plan.">
          <div className="space-y-4">
            {data?.budgetUtilization?.map((item) => (
              <div key={item.department}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-900 dark:text-white">{item.department}</span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {item.utilization}% used • forecast {currency(item.forecast)}
                  </span>
                </div>
                <div className="mt-2 h-3 rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className="h-3 rounded-full bg-brand" style={{ width: `${Math.min(item.utilization, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Live activity feed" subtitle="Streaming HR actions, AI alerts, and operational updates.">
          <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar -mr-2 space-y-3">
            {feed?.map((item) => (
              <article key={`${item.id}-${item.timestamp}`} className="rounded-[22px] border border-slate-200 bg-white px-4 py-4 dark:bg-slate-900 border-slate-100 dark:border-slate-800 transition-all hover:border-brand/30">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white leading-tight">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.detail}</p>
                  </div>
                  <StatusBadge label={item.category} />
                </div>
                <div className="mt-3 flex items-center justify-between text-[10px] items-center font-bold uppercase tracking-[0.14em] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <div className="h-4 w-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                       <UserIcon size={10} />
                    </div>
                    <span>{item.actor}</span>
                  </div>
                  <span>{dateTimeLabel(item.timestamp)}</span>
                </div>
              </article>
            ))}
            {(feed?.length === 0) && (
              <div className="py-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest opacity-50">
                Awaiting telemetry...
              </div>
            )}
          </div>
        </SectionCard>
      </section>
    </div>
  )
}
