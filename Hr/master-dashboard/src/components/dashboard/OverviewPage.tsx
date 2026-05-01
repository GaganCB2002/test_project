import { ArrowRight, BrainCircuit, Sparkles } from 'lucide-react'
import { Panel } from '../ui/Panel'
import { MetricCard } from '../ui/MetricCard'
import { LineChart } from '../ui/LineChart'
import { DonutChart } from '../ui/DonutChart'
import type {
  AiInsight,
  DashboardMetric,
  EmployeeSnapshot,
  HeatmapCell,
  ProjectCardData,
  ProjectIntelligenceItem,
  RoiProject,
  TimelineEvent,
  WorkspaceCardData,
  DashboardDataset,
} from '../../types'

interface OverviewPageProps {
  data: DashboardDataset
  onOpenMetric: (metric: DashboardMetric) => void
  onSelectSection: (section: DashboardMetric['targetSection']) => void
}

function ProjectIntelligencePanel({ items }: { items: ProjectIntelligenceItem[] }) {
  const riskStyle: Record<ProjectIntelligenceItem['risk'], string> = {
    Low: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    Moderate: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    High: 'bg-rose-500/10 text-rose-700 dark:text-rose-300',
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.name} className="rounded-[24px] border border-slate-200/70 bg-white/75 p-4 dark:border-white/8 dark:bg-white/[0.03]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-base font-semibold text-slate-950 dark:text-white">{item.name}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Owner: {item.owner}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${riskStyle[item.risk]}`}>{item.risk} risk</span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Current cost</p>
              <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{item.currentCost}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Estimated cost</p>
              <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{item.estimatedCost}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Budget vs actual</p>
              <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{item.budgetDelta}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
              <span>Completion</span>
              <span>{item.completion}%</span>
            </div>
            <div className="h-3 rounded-full bg-slate-100 dark:bg-white/[0.06]">
              <div className="h-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" style={{ width: `${item.completion}%` }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function AiInsightsPanel({ items, onSelectSection }: { items: AiInsight[]; onSelectSection: (section: DashboardMetric['targetSection']) => void }) {
  const severityStyle: Record<AiInsight['severity'], string> = {
    Info: 'border-cyan-500/20 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300',
    Warning: 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300',
    Critical: 'border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300',
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelectSection(item.targetSection)}
          className="w-full rounded-[24px] border border-slate-200/70 bg-white/70 p-4 text-left transition hover:-translate-y-0.5 hover:border-slate-300 dark:border-white/8 dark:bg-white/[0.03]"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                <BrainCircuit size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-950 dark:text-white">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{item.detail}</p>
              </div>
            </div>
            <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${severityStyle[item.severity]}`}>{item.severity}</span>
          </div>
          <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            {item.actionLabel}
            <ArrowRight size={15} />
          </div>
        </button>
      ))}
    </div>
  )
}

function ActivityTimeline({ items }: { items: TimelineEvent[] }) {
  const badgeStyle: Record<TimelineEvent['type'], string> = {
    Project: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300',
    Finance: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    People: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    System: 'bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300',
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <article key={item.id} className="timeline-item rounded-[24px] border border-slate-200/70 bg-white/75 p-4 dark:border-white/8 dark:bg-white/[0.03]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${badgeStyle[item.type]}`}>{item.type}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{item.timestamp}</span>
          </div>
          <p className="mt-3 text-base font-semibold text-slate-950 dark:text-white">{item.title}</p>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{item.detail}</p>
          <p className="mt-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Actor: {item.actor}</p>
        </article>
      ))}
    </div>
  )
}

function WorkspaceGrid({ items }: { items: WorkspaceCardData[] }) {
  const statusStyle: Record<WorkspaceCardData['status'], string> = {
    Live: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    Pending: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300',
    Review: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <div key={item.name} className="rounded-[24px] border border-slate-200/70 bg-white/75 p-4 dark:border-white/8 dark:bg-white/[0.03]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-base font-semibold text-slate-950 dark:text-white">{item.name}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manager: {item.manager}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[item.status]}`}>{item.status}</span>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-slate-100/80 px-3 py-3 dark:bg-white/[0.04]">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Projects</p>
              <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">{item.openProjects}</p>
            </div>
            <div className="rounded-2xl bg-slate-100/80 px-3 py-3 dark:bg-white/[0.04]">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Employees</p>
              <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">{item.employees}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ProjectGrid({ items }: { items: ProjectCardData[] }) {
  const riskStyle: Record<ProjectCardData['risk'], string> = {
    Low: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    Moderate: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    High: 'bg-rose-500/10 text-rose-700 dark:text-rose-300',
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {items.map((item) => (
        <div key={item.name} className="rounded-[24px] border border-slate-200/70 bg-white/75 p-4 dark:border-white/8 dark:bg-white/[0.03]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-base font-semibold text-slate-950 dark:text-white">{item.name}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.client}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${riskStyle[item.risk]}`}>{item.risk}</span>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Budget</p>
              <p className="mt-1 font-semibold text-slate-950 dark:text-white">{item.budget}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Due</p>
              <p className="mt-1 font-semibold text-slate-950 dark:text-white">{item.dueDate}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Team</p>
              <p className="mt-1 font-semibold text-slate-950 dark:text-white">{item.team} members</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Progress</p>
              <p className="mt-1 font-semibold text-slate-950 dark:text-white">{item.progress}%</p>
            </div>
          </div>
          <div className="mt-4 h-3 rounded-full bg-slate-100 dark:bg-white/[0.06]">
            <div className="h-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" style={{ width: `${item.progress}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmployeeTable({ items, heatmap }: { items: EmployeeSnapshot[]; heatmap: HeatmapCell[] }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="overflow-hidden rounded-[24px] border border-slate-200/70 dark:border-white/8">
        <div className="grid grid-cols-[1.6fr_repeat(4,1fr)] gap-3 bg-slate-100/80 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:bg-white/[0.04]">
          <span>Employee</span>
          <span>Attendance</span>
          <span>Performance</span>
          <span>Hours</span>
          <span>Location</span>
        </div>
        {items.map((item) => (
          <div key={item.name} className="grid grid-cols-[1.6fr_repeat(4,1fr)] gap-3 border-t border-slate-200/70 px-4 py-4 text-sm dark:border-white/8">
            <div>
              <p className="font-semibold text-slate-950 dark:text-white">{item.name}</p>
              <p className="mt-1 text-slate-500 dark:text-slate-400">{item.role}</p>
            </div>
            <span className="font-medium text-slate-700 dark:text-slate-200">{item.attendance}%</span>
            <span className="font-medium text-slate-700 dark:text-slate-200">{item.performance}%</span>
            <span className="font-medium text-slate-700 dark:text-slate-200">{item.workHours}h</span>
            <span className="font-medium text-slate-700 dark:text-slate-200">{item.location}</span>
          </div>
        ))}
      </div>

      <div className="rounded-[24px] border border-slate-200/70 bg-white/75 p-4 dark:border-white/8 dark:bg-white/[0.03]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-base font-semibold text-slate-950 dark:text-white">Productivity heatmap</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Last 7 days of output intensity</p>
          </div>
          <Sparkles size={18} className="text-cyan-500" />
        </div>
        <div className="mt-6 grid grid-cols-7 gap-3">
          {heatmap.map((cell) => (
            <div key={cell.label} className="text-center">
              <div
                className="h-20 rounded-2xl transition"
                style={{
                  background: `rgba(6, 182, 212, ${0.15 + cell.intensity * 0.13})`,
                  boxShadow: cell.intensity > 3 ? '0 18px 40px rgba(6, 182, 212, 0.16)' : 'none',
                }}
              />
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{cell.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function RoiBreakdown({ items }: { items: RoiProject[] }) {
  const statusStyle: Record<RoiProject['status'], string> = {
    Strong: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    Scaling: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300',
    Watch: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.name} className="rounded-[24px] border border-slate-200/70 bg-white/75 p-4 dark:border-white/8 dark:bg-white/[0.03]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-slate-950 dark:text-white">{item.name}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Budget {item.budget}</p>
            </div>
            <div className="text-right">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[item.status]}`}>{item.status}</span>
              <p className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">{item.roi}%</p>
            </div>
          </div>
          <div className="mt-4 h-3 rounded-full bg-slate-100 dark:bg-white/[0.06]">
            <div className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500" style={{ width: `${item.roi}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export function OverviewPage({ data, onOpenMetric, onSelectSection }: OverviewPageProps) {
  return (
    <div className="space-y-6">
      <section className="hero-grid">
        <div className="panel-surface relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(6,182,212,0.16),transparent_34%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_28%)]" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/15 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-700 dark:text-cyan-300">
              <Sparkles size={14} />
              Company OS
            </span>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl dark:text-white">
              Centralized executive visibility, system control, and AI-guided decision making.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
              This dashboard is structured as the company operating system for CEO and administrator workflows. It centralizes
              workspaces, projects, people, finance, communication, automation, and system governance in one premium command surface.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onSelectSection('projects')}
                className="rounded-[18px] bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950"
              >
                Open Portfolio
              </button>
              <button
                type="button"
                onClick={() => onSelectSection('ai-assistant')}
                className="rounded-[18px] border border-slate-200 bg-white/90 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300 dark:border-white/8 dark:bg-white/[0.03] dark:text-white"
              >
                Launch AI Assistant
              </button>
            </div>
          </div>
        </div>

        <div className="panel-surface">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Service integration map</p>
          <div className="mt-6 space-y-3">
            {data.services.map((service) => (
              <div key={service.name} className="flex items-center justify-between rounded-[22px] border border-slate-200/70 bg-white/75 px-4 py-4 dark:border-white/8 dark:bg-white/[0.03]">
                <div>
                  <p className="font-semibold text-slate-950 dark:text-white">{service.name}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Port {service.port}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${service.status === 'Connected' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'bg-amber-500/10 text-amber-700 dark:text-amber-300'}`}>
                  {service.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {data.metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} onOpen={onOpenMetric} />
        ))}
      </section>

      <section className="grid gap-6 2xl:grid-cols-[1.45fr_0.9fr]">
        <Panel
          title="Revenue vs Investment"
          subtitle="Monthly financial trajectory with room for real-time API and forecasting overlays."
          action={<span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:bg-white/[0.04] dark:text-slate-400">Monthly view</span>}
        >
          <LineChart data={data.revenueSeries} />
        </Panel>

        <Panel title="Project status" subtitle="Delivery mix across the portfolio.">
          <DonutChart items={data.projectStatus} />
        </Panel>
      </section>

      <section className="grid gap-6 2xl:grid-cols-[1.2fr_0.8fr]">
        <Panel title="ROI breakdown" subtitle="Per-project return visibility for leadership prioritization.">
          <RoiBreakdown items={data.roiProjects} />
        </Panel>

        <Panel title="Project intelligence panel" subtitle="Budget risk, cost, and completion signals powered by AI scoring later.">
          <ProjectIntelligencePanel items={data.intelligence} />
        </Panel>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel title="AI insights" subtitle="Action-ready recommendations with direct navigation into the appropriate control surface.">
          <AiInsightsPanel items={data.aiInsights} onSelectSection={onSelectSection} />
        </Panel>

        <Panel title="Recent activity and timeline" subtitle="Live feed area reserved for aggregated cross-service telemetry.">
          <ActivityTimeline items={data.activity} />
        </Panel>
      </section>

      <section className="grid gap-6">
        <Panel title="Workspace and project control" subtitle="Fast-glance cards for operating structure, approvals, and delivery pressure.">
          <div className="space-y-4">
            <WorkspaceGrid items={data.workspaceCards} />
            <ProjectGrid items={data.projectCards} />
          </div>
        </Panel>

        <Panel title="Employee management pulse" subtitle="Performance, attendance, work logs, and productivity heatmap scaffold.">
          <EmployeeTable items={data.employees} heatmap={data.heatmap} />
        </Panel>
      </section>
    </div>
  )
}
