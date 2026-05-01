import { Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { NavSectionId, NavigationItem } from '../../types'

interface CommandPaletteProps {
  open: boolean
  items: NavigationItem[]
  onClose: () => void
  onSelect: (section: NavSectionId) => void
}

export function CommandPalette({ open, items, onClose, onSelect }: CommandPaletteProps) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase()
    if (!value) return items
    return items.filter((item) => `${item.label} ${item.group} ${item.description}`.toLowerCase().includes(value))
  }, [items, query])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/50 px-4 pt-20 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-[30px] border border-white/10 bg-white shadow-[0_30px_120px_rgba(15,23,42,0.25)] dark:bg-slate-950">
        <div className="flex items-center gap-3 border-b border-slate-200/70 px-5 py-4 dark:border-white/8">
          <Search size={18} className="text-slate-500" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Jump to a section or search actions"
            autoFocus
            className="flex-1 bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-400 dark:text-white"
          />
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-200 p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-950 dark:border-white/8 dark:text-slate-300 dark:hover:text-white"
            aria-label="Close command palette"
          >
            <X size={16} />
          </button>
        </div>
        <div className="max-h-[420px] overflow-y-auto p-3 custom-scrollbar">
          {filtered.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelect(item.id)
                onClose()
                setQuery('')
              }}
              className="flex w-full items-start justify-between rounded-[22px] px-4 py-4 text-left transition hover:bg-slate-100 dark:hover:bg-white/[0.04]"
            >
              <span>
                <span className="block text-sm font-semibold text-slate-950 dark:text-white">{item.label}</span>
                <span className="mt-1 block text-sm text-slate-500 dark:text-slate-400">{item.description}</span>
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:bg-white/[0.04] dark:text-slate-400">
                {item.group}
              </span>
            </button>
          ))}
          {!filtered.length && (
            <div className="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
              No matching sections yet. Try searching for projects, payroll, security, or AI.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
