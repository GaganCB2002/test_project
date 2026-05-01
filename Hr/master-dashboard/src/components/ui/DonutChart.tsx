import type { StatusBreakdown } from '../../types'

interface DonutChartProps {
  items: StatusBreakdown[]
}

export function DonutChart({ items }: DonutChartProps) {
  const total = items.reduce((sum, item) => sum + item.value, 0)
  const radius = 52
  const circumference = 2 * Math.PI * radius
  let offset = 0

  return (
    <div className="grid gap-5 lg:grid-cols-[160px_1fr] lg:items-center">
      <div className="relative mx-auto h-40 w-40">
        <svg viewBox="0 0 140 140" className="h-40 w-40 -rotate-90">
          <circle cx="70" cy="70" r={radius} fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="18" />
          {items.map((item) => {
            const dash = (item.value / total) * circumference
            const circle = (
              <circle
                key={item.label}
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke={item.color}
                strokeWidth="18"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
                strokeLinecap="round"
              />
            )
            offset += dash
            return circle
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{total}</span>
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Projects</span>
        </div>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 dark:border-white/8 dark:bg-white/[0.03]">
            <div className="inline-flex items-center gap-3">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.label}</span>
            </div>
            <span className="text-sm font-semibold text-slate-950 dark:text-white">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
