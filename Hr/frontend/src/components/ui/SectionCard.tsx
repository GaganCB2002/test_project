import type { ReactNode } from 'react'

interface SectionCardProps {
  title: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function SectionCard({ title, subtitle, action, children, className }: SectionCardProps) {
  return (
    <section className={`glass-panel p-6 ${className || ''}`}>
      <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="section-title">{title}</h2>
          {subtitle ? <p className="section-subtitle mt-1">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  )
}
