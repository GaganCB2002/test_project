import clsx from 'clsx'
import type { DashboardMetric } from '../../types'

const toneStyles: Record<DashboardMetric['tone'], string> = {
  positive: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  neutral: 'border-slate-200 bg-slate-50 text-slate-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-700',
}

export function MetricCard({ metric }: { metric: DashboardMetric }) {
  return (
    <article className="glass-panel p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
            {metric.label}
          </p>
          <p className="mt-3 font-display text-3xl font-bold text-slate-900">{metric.value}</p>
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
      <p className="mt-3 text-sm text-slate-500">{metric.delta}</p>
    </article>
  )
}
