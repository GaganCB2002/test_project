import clsx from 'clsx'

const palette: Record<string, string> = {
  Applied: 'bg-slate-100 text-slate-700',
  Shortlisted: 'bg-sky-100 text-sky-700',
  Interview: 'bg-amber-100 text-amber-700',
  Selected: 'bg-violet-100 text-violet-700',
  Offered: 'bg-emerald-100 text-emerald-700',
  'Background Check': 'bg-orange-100 text-orange-700',
  Approved: 'bg-emerald-100 text-emerald-700',
  Pending: 'bg-amber-100 text-amber-700',
  Rejected: 'bg-rose-100 text-rose-700',
  Done: 'bg-emerald-100 text-emerald-700',
  Completed: 'bg-emerald-100 text-emerald-700',
  'In Progress': 'bg-sky-100 text-sky-700',
  Blocked: 'bg-rose-100 text-rose-700',
  Active: 'bg-emerald-100 text-emerald-700',
  'Notice Period': 'bg-amber-100 text-amber-700',
  Initiated: 'bg-slate-100 text-slate-700',
  Settlement: 'bg-sky-100 text-sky-700',
  Attention: 'bg-amber-100 text-amber-700',
  Overdue: 'bg-rose-100 text-rose-700',
  Compliant: 'bg-emerald-100 text-emerald-700',
  Queued: 'bg-amber-100 text-amber-700',
  Processed: 'bg-emerald-100 text-emerald-700',
  High: 'bg-rose-100 text-rose-700',
  Medium: 'bg-amber-100 text-amber-700',
  Low: 'bg-emerald-100 text-emerald-700',
}

export function StatusBadge({ label }: { label: string }) {
  return (
    <span
      className={clsx(
        'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
        palette[label] ?? 'bg-slate-100 text-slate-700',
      )}
    >
      {label}
    </span>
  )
}
