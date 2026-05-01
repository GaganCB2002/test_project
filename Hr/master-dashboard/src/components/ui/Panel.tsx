import type { PropsWithChildren, ReactNode } from 'react'

interface PanelProps extends PropsWithChildren {
  title?: string
  subtitle?: string
  action?: ReactNode
  className?: string
}

export function Panel({ title, subtitle, action, className = '', children }: PanelProps) {
  return (
    <section className={`panel-surface ${className}`.trim()}>
      {(title || subtitle || action) && (
        <div className="flex flex-col gap-3 border-b border-white/8 pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {title && <h3 className="text-lg font-semibold tracking-tight text-slate-950 dark:text-white">{title}</h3>}
            {subtitle && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={title || subtitle || action ? 'pt-5' : ''}>{children}</div>
    </section>
  )
}
