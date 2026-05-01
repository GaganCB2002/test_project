import { ArrowRight, Bell, BrainCircuit, ShieldCheck } from 'lucide-react'
import { Panel } from '../ui/Panel'
import type { DashboardDataset, NavSectionId, SectionBlueprint } from '../../types'

interface SectionPageProps {
  section: SectionBlueprint
  data: DashboardDataset
  onOpenAiAssistant: () => void
  onOpenNotifications: () => void
  onSelectSection: (section: NavSectionId) => void
}

function renderContextRibbon(sectionId: NavSectionId, data: DashboardDataset) {
  if (sectionId === 'messages' || sectionId === 'channels' || sectionId === 'notifications') {
    return (
      <div className="grid gap-3">
        {data.communications.map((thread) => (
          <div key={thread.title} className="rounded-[22px] border border-slate-200/70 bg-white/75 px-4 py-4 dark:border-white/8 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-950 dark:text-white">{thread.title}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{thread.channel}</p>
              </div>
              {thread.unread && <span className="rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-700 dark:text-rose-300">Unread</span>}
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{thread.excerpt}</p>
          </div>
        ))}
      </div>
    )
  }

  if (sectionId === 'settings' || sectionId === 'user-roles' || sectionId === 'logs' || sectionId === 'security') {
    const stateStyle = {
      Healthy: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
      Degraded: 'bg-rose-500/10 text-rose-700 dark:text-rose-300',
      Syncing: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    } as const

    return (
      <div className="grid gap-3">
        {data.systemHealth.map((item) => (
          <div key={item.label} className="rounded-[22px] border border-slate-200/70 bg-white/75 px-4 py-4 dark:border-white/8 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-950 dark:text-white">{item.label}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${stateStyle[item.state]}`}>{item.state}</span>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-3">
      {data.aiInsights.slice(0, 3).map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelectSection(item.targetSection)}
          className="rounded-[22px] border border-slate-200/70 bg-white/75 px-4 py-4 text-left transition hover:border-slate-300 dark:border-white/8 dark:bg-white/[0.03]"
        >
          <p className="font-semibold text-slate-950 dark:text-white">{item.title}</p>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{item.detail}</p>
        </button>
      ))}
    </div>
  )
}

export function SectionPage({ section, data, onOpenAiAssistant, onOpenNotifications, onSelectSection }: SectionPageProps) {
  return (
    <div className="space-y-6">
      <section className="panel-surface relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(6,182,212,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.10),transparent_26%)]" />
        <div className="relative">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-700 dark:text-cyan-300">{section.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">{section.title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">{section.description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onOpenAiAssistant}
              className="inline-flex items-center gap-2 rounded-[18px] bg-slate-950 px-5 py-3 text-sm font-semibold text-white dark:bg-white dark:text-slate-950"
            >
              <BrainCircuit size={16} />
              Ask AI assistant
            </button>
            <button
              type="button"
              onClick={onOpenNotifications}
              className="inline-flex items-center gap-2 rounded-[18px] border border-slate-200 bg-white/90 px-5 py-3 text-sm font-semibold text-slate-900 dark:border-white/8 dark:bg-white/[0.03] dark:text-white"
            >
              <Bell size={16} />
              Review notifications
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {section.metrics.map((metric) => (
          <div key={metric.label} className="rounded-[26px] border border-slate-200/70 bg-white/85 p-5 shadow-[0_20px_70px_rgba(15,23,42,0.06)] dark:border-white/8 dark:bg-slate-950/72 dark:shadow-none">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{metric.label}</p>
            <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{metric.value}</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{metric.helper}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Panel title={section.boardTitle} subtitle={section.boardDescription}>
          <div className="space-y-3">
            {section.boardItems.map((item) => (
              <div key={item.title} className="rounded-[22px] border border-slate-200/70 bg-white/75 px-4 py-4 dark:border-white/8 dark:bg-white/[0.03]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-950 dark:text-white">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.meta}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:bg-white/[0.04] dark:text-slate-400">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title={section.sideTitle}
          subtitle={section.sideDescription}
          action={
            <button
              type="button"
              onClick={() => onSelectSection('security')}
              className="inline-flex items-center gap-2 rounded-[16px] border border-slate-200 bg-white/85 px-3 py-2 text-sm font-semibold text-slate-800 dark:border-white/8 dark:bg-white/[0.03] dark:text-white"
            >
              <ShieldCheck size={14} />
              System view
            </button>
          }
        >
          <div className="space-y-3">
            {section.sideItems.map((item) => (
              <div key={item} className="inline-flex w-full items-start gap-3 rounded-[22px] border border-slate-200/70 bg-white/75 px-4 py-4 text-sm leading-6 text-slate-600 dark:border-white/8 dark:bg-white/[0.03] dark:text-slate-300">
                <ArrowRight size={16} className="mt-1 text-cyan-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <Panel title="Connected context" subtitle="Module-specific context blocks to show how the shell adapts to each domain.">
        {renderContextRibbon(section.id, data)}
      </Panel>
    </div>
  )
}
