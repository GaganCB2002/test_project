import type { RevenuePoint } from '../../types'

interface LineChartProps {
  data: RevenuePoint[]
}

function createLinePath(values: number[], width: number, height: number, padding: number) {
  if (!values.length) return ''

  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = Math.max(max - min, 1)

  return values
    .map((value, index) => {
      const x = padding + (index * (width - padding * 2)) / Math.max(values.length - 1, 1)
      const normalized = (value - min) / range
      const y = height - padding - normalized * (height - padding * 2)
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')
}

function createAreaPath(linePath: string, width: number, height: number, padding: number) {
  if (!linePath) return ''
  const startX = padding
  const endX = width - padding
  const baseY = height - padding
  return `${linePath} L ${endX} ${baseY} L ${startX} ${baseY} Z`
}

export function LineChart({ data }: LineChartProps) {
  const width = 760
  const height = 280
  const padding = 24
  const revenue = data.map((point) => point.revenue)
  const investment = data.map((point) => point.investment)
  const revenuePath = createLinePath(revenue, width, height, padding)
  const investmentPath = createLinePath(investment, width, height, padding)
  const revenueArea = createAreaPath(revenuePath, width, height, padding)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-cyan-500" />
          Revenue
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          Investment
        </span>
      </div>
      <div className="overflow-hidden rounded-[26px] border border-slate-200/70 bg-slate-950/[0.03] p-4 dark:border-white/8 dark:bg-white/[0.03]">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-[280px] w-full" role="img" aria-label="Revenue versus investment chart">
          <defs>
            <linearGradient id="revenueFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.03" />
            </linearGradient>
          </defs>
          {[0.2, 0.4, 0.6, 0.8].map((ratio) => (
            <line
              key={ratio}
              x1={padding}
              x2={width - padding}
              y1={padding + (height - padding * 2) * ratio}
              y2={padding + (height - padding * 2) * ratio}
              stroke="currentColor"
              strokeOpacity="0.08"
              strokeDasharray="6 8"
            />
          ))}
          <path d={revenueArea} fill="url(#revenueFill)" />
          <path d={revenuePath} fill="none" stroke="#06b6d4" strokeWidth="4" strokeLinecap="round" />
          <path d={investmentPath} fill="none" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" strokeDasharray="10 10" />
          {data.map((point, index) => {
            const x = padding + (index * (width - padding * 2)) / Math.max(data.length - 1, 1)
            return (
              <text key={point.label} x={x} y={height - 4} textAnchor="middle" className="fill-slate-500 text-[12px] dark:fill-slate-400">
                {point.label}
              </text>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
