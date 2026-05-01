import { X } from 'lucide-react'
import type { DashboardMetric } from '../../types'

interface MetricDetailModalProps {
  metric: DashboardMetric | null
  onClose: () => void
}

export function MetricDetailModal({ metric, onClose }: MetricDetailModalProps) {
  if (!metric) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-white p-6 shadow-[0_30px_120px_rgba(15,23,42,0.25)] dark:bg-slate-950">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{metric.label}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{metric.detail.title}</h2>
            <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">{metric.detail.summary}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-200 p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-900 dark:border-white/10 dark:text-slate-300 dark:hover:text-white"
            aria-label="Close metric detail"
          >
            <X size={18} />
          </button>
        </div>
        <div className="mt-6 rounded-[24px] border border-slate-200/70 bg-slate-50 p-5 dark:border-white/8 dark:bg-white/[0.03]">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Current value</p>
              <p className="mt-1 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">{metric.value}</p>
            </div>
            <div className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">
              {metric.delta} {metric.comparison}
            </div>
          </div>
        </div>
        <div className="mt-6 space-y-3">
          {metric.detail.bullets.map((bullet) => (
            <div key={bullet} className="rounded-2xl border border-slate-200/70 px-4 py-4 text-sm leading-6 text-slate-700 dark:border-white/8 dark:text-slate-300">
              {bullet}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
