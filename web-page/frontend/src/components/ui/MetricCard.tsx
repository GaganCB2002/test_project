import clsx from 'clsx'
import type { DashboardMetric } from '../../types'

const toneStyles: Record<DashboardMetric['tone'], string> = {
  positive: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-800/50 dark:text-emerald-400',
  neutral: 'border-slate-200 bg-slate-50 text-slate-700 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-300',
  warning: 'border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:border-amber-800/50 dark:text-amber-400',
}

export function MetricCard({ metric }: { metric: DashboardMetric }) {
  return (
    <article className="glass-panel p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
            {metric.label}
          </p>
          <p className="mt-3 font-display text-3xl font-bold text-slate-900 dark:text-white">{metric.value}</p>
        </div>
        <span
          className={clsx(
            'rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]',
            toneStyles[metric.tone],
          )}
        >
          {metric.tone}
        </span>
      </div>
      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{metric.delta}</p>
    </article>
  )
}
