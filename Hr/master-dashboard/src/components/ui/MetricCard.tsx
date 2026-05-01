import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import type { DashboardMetric } from '../../types'

interface MetricCardProps {
  metric: DashboardMetric
  onOpen: (metric: DashboardMetric) => void
}

export function MetricCard({ metric, onOpen }: MetricCardProps) {
  const isUp = metric.direction === 'up'

  return (
    <button
      type="button"
      onClick={() => onOpen(metric)}
      className="group relative overflow-hidden rounded-[28px] border border-slate-200/70 bg-white/88 p-5 text-left shadow-[0_20px_80px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_28px_90px_rgba(15,23,42,0.12)] dark:border-white/8 dark:bg-slate-950/72 dark:shadow-none"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${metric.accent} opacity-80`} />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{metric.label}</p>
          <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{metric.value}</p>
        </div>
        <div className={`rounded-2xl border px-3 py-2 text-xs font-semibold ${isUp ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300'}`}>
          <span className="inline-flex items-center gap-1">
            {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {metric.delta}
          </span>
        </div>
      </div>
      <div className="relative mt-5 flex items-center justify-between">
        <p className="text-sm text-slate-600 dark:text-slate-300">{metric.comparison}</p>
        <span className="text-xs font-semibold text-slate-500 transition group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-white">
          Open detail
        </span>
      </div>
    </button>
  )
}
