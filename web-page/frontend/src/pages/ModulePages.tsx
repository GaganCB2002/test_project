import React, { useMemo, useState, useEffect } from 'react'
import axios from 'axios'
import { socket } from '../api/socket'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PolarAngleAxis,
  PolarGrid,
} from 'recharts'
import { jsPDF } from 'jspdf'
import { api } from '../api/client'
import { HierarchyExplorer } from '../components/HierarchyExplorer'
import { MetricCard } from '../components/ui/MetricCard'
import { SectionCard } from '../components/ui/SectionCard'
import { StatusBadge } from '../components/ui/StatusBadge'
import { currency, dateLabel, dateTimeLabel } from '../lib/format'
import { Sparkles, Download, CheckCircle2, History, CreditCard, ChevronRight, Calculator, AlertTriangle, Brain, RefreshCw, User as UserIcon, Smartphone, Laptop } from 'lucide-react'
import type { PlatformData, Role, User, PayrollRecord } from '../types'

const chartColors = ['#0f766e', '#2563eb', '#f97316', '#7c3aed', '#e11d48']

function AccessNotice({ title }: { title: string }) {
  return (
    <SectionCard title={title} subtitle="This module is restricted for the signed-in role.">
      <div className="rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-500">
        Switch to an HR or CEO persona from the login screen to view sensitive financial and exit workflows.
      </div>
    </SectionCard>
  )
}

export function RecruitmentPage({
  platform,
  token,
  onRefresh,
  role,
}: {
  platform: PlatformData
  token: string
  onRefresh: () => Promise<void>
  role: Role
}) {
  const [selectedStage, setSelectedStage] = useState<string | null>(null)
  const stages = platform.recruitment.pipeline
  const canEdit = role === 'CEO' || role === 'HR' || role === 'Manager'

  const filteredCandidates = selectedStage 
    ? platform.recruitment.candidates.filter(c => c.stage === selectedStage)
    : platform.recruitment.candidates

  return (
    <div className="space-y-6">
      <SectionCard 
        title="Recruitment and hiring" 
        subtitle="ATS workflow with AI parsing, pipeline control, and offer tracking."
      >
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            {platform.recruitment.pipelineCounts.map((item) => (
              <button
                key={item.stage}
                onClick={() => setSelectedStage(selectedStage === item.stage ? null : item.stage)}
                className={`relative overflow-hidden p-6 text-left transition-all hover:scale-[1.02] active:scale-95 border-2 rounded-3xl ${
                  selectedStage === item.stage 
                    ? 'border-brand bg-brand/5 shadow-lg shadow-brand/10' 
                    : 'border-slate-100 bg-white dark:bg-slate-900/50 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${selectedStage === item.stage ? 'text-brand' : 'text-slate-400'}`}>
                      {item.stage}
                    </p>
                    <p className="mt-3 font-display text-4xl font-black text-slate-900 dark:text-white">
                      {item.count}
                    </p>
                  </div>
                  {selectedStage === item.stage && (
                    <div className="rounded-full bg-brand p-1 text-white">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <p className="mt-4 text-xs font-medium text-slate-500">Live pipeline stage</p>
              </button>
            ))}
          </div>
          <div className="h-80 rounded-3xl bg-slate-50/50 p-6 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800">
             <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6">Pipeline distribution</p>
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platform.recruitment.pipelineCounts}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f033" />
                  <XAxis dataKey="stage" hide />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar 
                    dataKey="count" 
                    radius={[12, 12, 12, 12]} 
                    fill="#0f766e"
                    background={{ fill: '#00000008', radius: 12 }}
                  >
                    {platform.recruitment.pipelineCounts.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={selectedStage === entry.stage ? '#0f766e' : '#94a3b8'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard 
        title={selectedStage ? `${selectedStage} Candidates` : "All Candidates"} 
        subtitle={selectedStage ? `Viewing only applicants currently in the ${selectedStage} stage.` : "Resume parsing outcomes, interview plans, and background verification."}
        action={selectedStage && (
          <button 
            onClick={() => setSelectedStage(null)}
            className="text-xs font-bold text-brand hover:underline"
          >
            Clear Filter
          </button>
        )}
      >
        <div className="table-shell overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500">
              <tr>
                {['Candidate', 'Applied For', 'AI Match', 'Status', 'Actions'].map((head) => (
                  <th key={head} className={`px-6 py-4 font-bold ${head === 'Actions' ? 'text-right' : ''}`}>
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredCandidates.map((candidate) => (
                <tr key={candidate.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-brand font-bold text-sm">
                        {candidate.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white leading-tight">{candidate.name}</p>
                        <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                          {candidate.source} • {candidate.location}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-700 dark:text-slate-300">{candidate.appliedFor}</p>
                    <p className="text-xs font-medium text-slate-400">{candidate.department}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-baseline gap-1">
                      <span className="font-black text-slate-900 dark:text-white">{candidate.aiMatch}%</span>
                      <span className="text-[10px] items-center font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-1 rounded">MATCH</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge label={candidate.stage} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    {canEdit ? (
                      <div className="flex items-center justify-end gap-2">
                        <select
                          value={candidate.stage}
                          onChange={async (event) => {
                            await api.updateCandidateStage(candidate.id, event.target.value, token)
                            await onRefresh()
                          }}
                          className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm focus:ring-2 focus:ring-brand dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300"
                        >
                          {stages.map((stage) => (
                            <option key={stage} value={stage}>
                              {stage}
                            </option>
                          ))}
                        </select>
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400">
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-slate-300">READ ONLY</span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredCandidates.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-50">
                      <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                         <UserIcon className="h-6 w-6 text-slate-400" />
                      </div>
                      <p className="text-sm font-bold text-slate-500">No candidates found in {selectedStage}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  )
}

export function OnboardingPage({ platform }: { platform: PlatformData }) {
  return (
    <div className="space-y-4">
      <section className="grid gap-4 lg:grid-cols-2">
        <MetricCard
          metric={{
            id: 'pending-onboarding',
            label: 'Pending onboarding',
            value: platform.onboarding.progressSummary.pending.toString(),
            delta: 'Across pre-boarding and active cohorts',
            tone: 'neutral',
          }}
        />
        <MetricCard
          metric={{
            id: 'avg-completion',
            label: 'Average completion',
            value: `${platform.onboarding.progressSummary.avgCompletion}%`,
            delta: 'KYC, assets, access, payroll, and welcome tasks',
            tone: 'positive',
          }}
        />
      </section>
      <SectionCard title="Onboarding command center" subtitle="Track document collection, e-signatures, assets, and access provisioning.">
        <div className="grid gap-4 xl:grid-cols-2">
          {platform.onboarding.records.map((record) => (
            <article key={record.id} className="rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-display text-2xl font-bold text-slate-900 dark:text-white">{record.employeeId}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Buddy: {record.buddy}</p>
                </div>
                <StatusBadge label={record.status} />
              </div>

              <div className="mt-4 h-3 rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-3 rounded-full bg-brand" style={{ width: `${record.completion}%` }} />
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Documents</p>
                  <ul className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    {record.documents.map((document, idx) => (
                      <li key={`${document}-${idx}`}>{document}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Assets and access</p>
                  <ul className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    {[...record.assets, ...record.accessProvisioned].map((item, idx) => (
                      <li key={`${item}-${idx}`}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-5 grid gap-2">
                {record.tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between rounded-2xl bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-sm">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{task.label}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{task.owner}</p>
                    </div>
                    <StatusBadge label={task.completed ? 'Completed' : 'Pending'} />
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

export function PeoplePage({ platform, token }: { platform: PlatformData; token: string }) {
  return (
    <div className="space-y-4">
      <SectionCard title="Employee management" subtitle="Profiles, role hierarchy, transfer visibility, and enterprise directory.">
        <div className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
          <div className="space-y-3">
            {platform.employees.departments.map((department) => (
              <div key={department.department} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 px-4 py-4">
                <p className="font-semibold text-slate-900 dark:text-white">{department.department}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{department.count} employees</p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="rounded-[24px] bg-slate-950 p-5 text-white">
              <p className="text-xs uppercase tracking-[0.24em] text-white/45">Interactive hierarchy</p>
              <p className="mt-2 text-2xl font-semibold">Click to expand reporting structure</p>
              <p className="mt-2 text-sm text-white/65">
                Dynamic lazy loading from CEO to managers, leads, and individual contributors.
              </p>
            </div>
            <HierarchyExplorer token={token} />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Employee directory" subtitle="Personal and job details across the active workforce.">
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {platform.employees.employees.map((employee) => (
            <article key={employee.id} className="rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{employee.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{employee.title}</p>
                </div>
                <StatusBadge label={employee.status} />
              </div>
              <div className="mt-4 grid gap-2 text-sm text-slate-600 dark:text-slate-400">
                <p>{employee.department} • {employee.location}</p>
                <p>Joined {dateLabel(employee.joinDate)}</p>
                <p>Engagement {employee.engagementScore}% • Performance {employee.performanceRating}</p>
                <p>Documents: {employee.documents.join(', ')}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {employee.skills.map((skill, idx) => (
                  <span key={`${skill}-${idx}`} className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-300">
                    {skill}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

export function AttendancePage({
  platform,
  token,
  user,
  onRefresh,
}: {
  platform: PlatformData
  token: string
  user: User
  onRefresh: () => Promise<void>
}) {
  const [form, setForm] = useState({
    employeeId: user.employeeId ?? platform.employees.employees[0]?.id ?? '',
    employeeName: user.name,
    type: 'Annual Leave',
    from: '2026-05-06',
    to: '2026-05-07',
    reason: 'Personal work',
  })
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          ['Attendance rate', `${platform.attendance.overview.attendanceRate}%`, 'positive'],
          ['Present today', `${platform.attendance.overview.presentToday}`, 'neutral'],
          ['Remote today', `${platform.attendance.overview.remoteToday}`, 'neutral'],
          ['Late markings', `${platform.attendance.overview.lateMarkings}`, 'warning'],
          ['Overtime hours', `${platform.attendance.overview.overtimeHours}`, 'warning'],
          ['Leave utilization', `${platform.attendance.overview.leaveBalanceUtilization}%`, 'positive'],
        ].map(([label, value, tone]) => (
          <MetricCard
            key={label}
            metric={{ id: label, label, value, delta: 'Workforce attendance signal', tone: tone as 'positive' | 'neutral' | 'warning' }}
          />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard title="Attendance trend" subtitle="Monthly attendance and approved leave movement.">
          <div className="h-80">
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={platform.attendance.trend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line dataKey="value" name="Attendance %" stroke="#0f766e" strokeWidth={3} />
                <Line dataKey="secondaryValue" name="Leaves" stroke="#f97316" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          </div>
        </SectionCard>

        <SectionCard 
          title="Apply for time-off" 
          subtitle="Submit a request into the approval workflow. AI will analyze team workload automatically."
        >
          <div className="mb-4 rounded-xl bg-amber-50 p-4 border border-amber-100 dark:bg-amber-900/10 dark:border-amber-900/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-brand" />
              <p className="text-xs font-bold uppercase tracking-widest text-brand">AI Copilot Prediction</p>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {aiSuggestion || "Select dates to trigger risk analysis..."}
            </p>
          </div>

          <form
            className="grid gap-3"
            onSubmit={async (event) => {
              event.preventDefault()
              await api.createLeaveRequest(form, token)
              await onRefresh()
              setForm((current) => ({ ...current, reason: '' }))
            }}
          >
            <div className="grid grid-cols-2 gap-3">
              <select
                className="rounded-2xl border border-slate-200 px-4 py-3 bg-slate-50 dark:bg-slate-800 dark:border-slate-800 dark:text-white"
                value={form.type}
                onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}
              >
                {['Annual Leave', 'Sick Leave', 'WFH', 'Comp Off'].map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <div className="flex gap-2">
                 <input
                  type="date"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 bg-slate-50 dark:bg-slate-800 dark:border-slate-800 dark:text-white"
                  value={form.from}
                  onChange={(event) => setForm((current) => ({ ...current, from: event.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
               <input
                type="date"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 bg-slate-50 dark:bg-slate-800 dark:border-slate-800 dark:text-white"
                value={form.to}
                onChange={(event) => setForm((current) => ({ ...current, to: event.target.value }))}
              />
              <button 
                type="button"
                onClick={async () => {
                  const res = await api.getAISuggestion(form.employeeId, form.from, form.to, token)
                  setAiSuggestion(res.suggestion)
                }}
                className="flex items-center justify-center gap-2 rounded-2xl border-2 border-brand/20 bg-brand/5 px-4 py-3 text-xs font-bold text-brand hover:bg-brand/10 transition"
              >
                <Sparkles className="h-4 w-4" />
                Analyze Risk
              </button>
            </div>

            <textarea
              className="min-h-24 rounded-2xl border border-slate-200 px-4 py-3 bg-slate-50 dark:bg-slate-800 dark:border-slate-800 dark:text-white"
              value={form.reason}
              onChange={(event) => setForm((current) => ({ ...current, reason: event.target.value }))}
              placeholder="Detailed reason for leave..."
            />
            <button type="submit" className="rounded-2xl bg-brand py-4 text-sm font-bold text-white shadow-lg shadow-brand/20 hover:scale-[1.01] active:scale-95 transition">
              Process Request
            </button>
          </form>
        </SectionCard>
      </section>

      <SectionCard title="Leave workflow" subtitle="Approval queue and employee time-off requests.">
        <div className="table-shell overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                {['Employee', 'Type', 'Dates', 'Status', 'Reason'].map((head) => (
                  <th key={head} className="px-4 py-3 font-semibold">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {platform.attendance.leaveRequests.map((request) => (
                <tr key={request.id} className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-4 font-semibold text-slate-900 dark:text-white">{request.employeeName}</td>
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-400">{request.type}</td>
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-400">
                    {dateLabel(request.from)} - {dateLabel(request.to)}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge label={request.status} />
                  </td>
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-400">{request.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  )
}

export function PayrollPage({ platform, token, onRefresh }: { platform: PlatformData; token: string; onRefresh: () => Promise<void> }) {
  if (!platform.payroll) {
    return <AccessNotice title="Payroll system" />
  }

  return (
    <div className="space-y-4">
      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard
          metric={{
            id: 'payroll-total',
            label: 'Total net payroll',
            value: currency(platform.payroll.summary.totalNet),
            delta: 'Monthly disbursement',
            tone: 'neutral',
          }}
        />
        <MetricCard
          metric={{
            id: 'payroll-processed',
            label: 'Processed batches',
            value: platform.payroll.summary.processed.toString(),
            delta: 'Bank API synced',
            tone: 'positive',
          }}
        />
        <MetricCard
          metric={{
            id: 'payroll-queued',
            label: 'Queued payouts',
            value: platform.payroll.summary.queued.toString(),
            delta: 'Awaiting confirmation',
            tone: 'warning',
          }}
        />
      </section>

      <SectionCard 
        title="Payroll Command Center" 
        subtitle="Manage salary structure, statutory deductions, bank sync, and payout status."
        action={
          <div className="flex gap-2">
            <button
               onClick={async () => {
                 await api.processPayroll('May 2026', token)
                 await onRefresh()
               }}
               className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-xs font-bold text-white transition hover:scale-105 shadow-lg shadow-brand/20 active:scale-95"
            >
              <CreditCard className="h-3.5 w-3.5" />
              Process May Batch
            </button>
          </div>
        }
      >
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-4">
            <div className="h-64">
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={platform.payroll.records.map((record) => ({
                      name: record.employeeName,
                      value: record.breakdown.net,
                    }))}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={3}
                  >
                    {platform.payroll.records.map((record, index) => (
                      <Cell key={record.employeeId} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => currency(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            </div>
            
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Auto-Calibration</p>
                <Calculator className="h-3.5 w-3.5 text-slate-400" />
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Statutory deductions (PF: 12%, TDS: Progressive) are automatically recalculated on structure change.
              </p>
            </div>
          </div>

          <div className="table-shell overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  {['Employee', 'Net Salary', 'Comp Breakdown', 'Bank Sync', 'Actions'].map((head) => (
                    <th key={head} className={`px-4 py-3 font-semibold ${head === 'Actions' ? 'text-right' : ''}`}>
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {platform.payroll.records.map((record) => (
                  <tr key={record.employeeId} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-900 dark:text-white">{record.employeeName}</p>
                      <p className="text-[10px] uppercase font-bold text-slate-500">{record.department}</p>
                    </td>
                    <td className="px-4 py-4 font-bold text-slate-900 dark:text-white">{currency(record.breakdown.net)}</td>
                    <td className="px-4 py-4">
                      <div className="flex gap-1 text-[10px]">
                        <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 dark:bg-slate-800 dark:text-slate-400">B: {currency(record.breakdown.basic)}</span>
                        <span className="bg-rose-50 px-1.5 py-0.5 rounded text-rose-600 dark:bg-rose-900/20">T: {currency(record.breakdown.tds)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge label={record.bankStatus} />
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            const doc = new jsPDF()
                            doc.setFontSize(22)
                            doc.text("AURAHR PAYSLIP", 10, 20)
                            doc.setFontSize(12)
                            doc.text(`Period: ${record.month}`, 10, 35)
                            doc.text(`Employee: ${record.employeeName}`, 10, 45)
                            doc.text(`Department: ${record.department}`, 10, 52)
                            doc.line(10, 60, 200, 60)
                            doc.text(`Basic Salary: ${currency(record.breakdown.basic)}`, 10, 75)
                            doc.text(`Bonus: ${currency(record.breakdown.bonus)}`, 10, 85)
                            doc.text(`TDS Deduction: ${currency(record.breakdown.tds)}`, 10, 95)
                            doc.text(`PF Contribution: ${currency(record.breakdown.pf)}`, 10, 105)
                            doc.setFontSize(16)
                            doc.text(`NET PAYABLE: ${currency(record.breakdown.net)}`, 10, 130)
                            doc.save(`AuraHR_Slip_${record.employeeId}_${record.month.replace(' ', '_')}.pdf`)
                          }}
                          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition dark:bg-slate-800 dark:hover:bg-slate-700"
                        >
                          <Download className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}

export function PerformancePage({ platform }: { platform: PlatformData }) {
  const radarData = useMemo(
    () =>
      (platform.performance?.records || []).map((record: any) => ({
        subject: record.employeeName.split(' ')[0],
        review: record.reviewScore * 20,
        feedback: record.feedback360 * 20,
        goals: record.goalCompletion,
      })),
    [platform.performance?.records],
  )

  return (
    <div className="space-y-4">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-[0.85fr_1.15fr]">
        <SectionCard title="Performance radar" subtitle="KPI, review, and 360 feedback across the spotlight cohort.">
          <div className="h-80">
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <Radar dataKey="review" stroke="#0f766e" fill="#0f766e" fillOpacity={0.24} />
                <Radar dataKey="feedback" stroke="#f97316" fill="#f97316" fillOpacity={0.18} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          </div>
        </SectionCard>

        <SectionCard title="Review outcomes" subtitle={`Average review score ${platform.performance.averageReview}/5`}>
          <div className="grid gap-4">
            {platform.performance.records.map((record) => (
              <article key={record.employeeId} className="rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{record.employeeName}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{record.coachNotes}</p>
                  </div>
                  <StatusBadge label={record.promotionReadiness} />
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-700 dark:text-slate-300">Goals {record.goalCompletion}%</div>
                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-700 dark:text-slate-300">KPI {record.kpiScore}</div>
                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-700 dark:text-slate-300">360 {record.feedback360}</div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {record.strengths.map((strength, idx) => (
                    <span key={`${strength}-${idx}`} className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                      {strength}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </SectionCard>
      </section>
    </div>
  )
}

export function ProjectsPage({ platform }: { platform: PlatformData }) {
  return (
    <div className="space-y-4">
      <SectionCard title="Project and task tracking" subtitle="Manager-assigned tasks, timesheets, and productivity visibility.">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="table-shell overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  {['Task', 'Project', 'Employee', 'Manager', 'Hours', 'Status'].map((head) => (
                    <th key={head} className="px-4 py-3 font-semibold">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {platform.projects.tasks.map((task) => (
                  <tr key={task.id} className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-900 dark:text-white">{task.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Due {dateLabel(task.dueDate)}</p>
                    </td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-400">{task.project}</td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-400">{task.employeeName}</td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-400">{task.manager}</td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-400">{task.loggedHours}</td>
                    <td className="px-4 py-4">
                      <StatusBadge label={task.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="h-80">
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platform.projects.utilization}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="employeeName" hide />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="hours" fill="#0f766e" radius={[12, 12, 0, 0]} />
                <Bar dataKey="productivityScore" fill="#f97316" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}

export function EngagementPage({ platform }: { platform: PlatformData }) {
  return (
    <div className="space-y-4">
      <section className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
        <MetricCard
          metric={{
            id: 'sentiment',
            label: 'Average sentiment',
            value: `${platform.engagement.avgSentiment}%`,
            delta: 'Announcements, rewards, surveys, and chat energy',
            tone: 'positive',
          }}
        />
        <SectionCard title="Engagement hub" subtitle="Announcements, surveys, recognition, and collaboration touchpoints.">
          <div className="grid gap-4 md:grid-cols-2">
            {platform.engagement.records.map((record) => (
              <article key={record.id} className="rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-slate-900 dark:text-white">{record.title}</p>
                  <StatusBadge label={record.type} />
                </div>
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{record.owner}</p>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-slate-700 dark:text-slate-300">{record.participation}% participation</div>
                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-slate-700 dark:text-slate-300">{record.sentimentScore}% sentiment</div>
                </div>
                <p className="mt-4 text-xs uppercase tracking-[0.14em] text-slate-400">{dateTimeLabel(record.publishedAt)}</p>
              </article>
            ))}
          </div>
        </SectionCard>
      </section>
    </div>
  )
}

export function CompliancePage({ platform }: { platform: PlatformData }) {
  return (
    <div className="space-y-4">
      <MetricCard
        metric={{
          id: 'overdue-compliance',
          label: 'Overdue compliance items',
          value: platform.compliance.overdue.toString(),
          delta: 'Tracked across policy, legal, and security workflows',
          tone: platform.compliance.overdue > 0 ? 'warning' : 'positive',
        }}
      />
      <SectionCard title="Compliance and policy tracking" subtitle="Policy renewals, legal readiness, audit evidence, and review deadlines.">
        <div className="table-shell overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                {['Policy', 'Owner', 'Due date', 'Status', 'Risk'].map((head) => (
                  <th key={head} className="px-4 py-3 font-semibold">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {platform.compliance.items.map((item) => (
                <tr key={item.id} className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-4 font-semibold text-slate-900 dark:text-white">{item.policy}</td>
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-400">{item.owner}</td>
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-400">{dateLabel(item.dueDate)}</td>
                  <td className="px-4 py-4">
                    <StatusBadge label={item.status} />
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge label={item.risk} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  )
}

export function ExitPage({ platform }: { platform: PlatformData }) {
  if (!platform.exits) {
    return <AccessNotice title="Exit management" />
  }

  return (
    <div className="space-y-4">
      <MetricCard
        metric={{
          id: 'pending-assets',
          label: 'Pending asset returns',
          value: platform.exits.pendingAssets.toString(),
          delta: 'Needs closure before final settlement',
          tone: platform.exits.pendingAssets > 0 ? 'warning' : 'positive',
        }}
      />
      <SectionCard title="Exit management" subtitle="Resignations, interviews, settlement processing, and asset recovery.">
        <div className="grid gap-4 lg:grid-cols-2">
          {platform.exits.records.map((record) => (
            <article key={record.id} className="rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{record.employeeName}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Last working day {dateLabel(record.lastWorkingDay)}</p>
                </div>
                <StatusBadge label={record.stage} />
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-700 dark:text-slate-300">Settlement: {record.settlementStatus}</div>
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-700 dark:text-slate-300">Assets: {record.assetReturn}</div>
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-700 dark:text-slate-300">Interview: {record.exitInterview ? 'Done' : 'Pending'}</div>
              </div>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

export function BudgetPage({ platform }: { platform: PlatformData }) {
  if (!platform.budget) {
    return <AccessNotice title="Budget intelligence" />
  }

  return (
    <div className="space-y-4">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          metric={{
            id: 'allocated',
            label: 'Total allocated',
            value: currency(platform.budget.totalAllocated),
            delta: 'Department budget envelope',
            tone: 'neutral',
          }}
        />
        <MetricCard
          metric={{
            id: 'spent',
            label: 'Total spent',
            value: currency(platform.budget.totalSpent),
            delta: 'Current quarter actuals',
            tone: 'warning',
          }}
        />
        <MetricCard
          metric={{
            id: 'roi',
            label: 'Average ROI',
            value: `${(
              platform.budget.records.reduce((sum, item) => sum + item.roi, 0) / platform.budget.records.length
            ).toFixed(2)}x`,
            delta: 'Productivity and cost return indicator',
            tone: 'positive',
          }}
        />
      </section>
      <SectionCard title="Budget module" subtitle="Salary expense, hiring cost, benefits, training, and workforce ROI.">
        <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="table-shell overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  {['Department', 'Allocated', 'Spent', 'Hiring cost', 'Forecast', 'ROI'].map((head) => (
                    <th key={head} className="px-4 py-3 font-semibold">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {platform.budget.records.map((record) => (
                  <tr key={record.department} className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-4 font-semibold text-slate-900 dark:text-white">{record.department}</td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-400">{currency(record.allocated)}</td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-400">{currency(record.spent)}</td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-400">{currency(record.hiringCost)}</td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-400">{currency(record.forecastNextQuarter)}</td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-400">{record.roi}x</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="h-80">
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platform.budget.records}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip formatter={(value) => currency(Number(value))} />
                  <Legend />
                  <Bar dataKey="hiringCost" fill="#0f766e" radius={[12, 12, 0, 0]} />
                  <Bar dataKey="trainingCost" fill="#2563eb" radius={[12, 12, 0, 0]} />
                  <Bar dataKey="benefitsCost" fill="#f97316" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}

export function HelpDeskPage({ platform, token }: { platform: PlatformData; token: string }) {
  const [issues, setIssues] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadIssues = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/helpdesk/tickets/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await res.json()
      setIssues(data.tickets || [])
    } catch (err) {
      console.error("Failed to load help desk issues", err)
    } finally {
      setIsLoading(false)
    }
  }

  useMemo(() => {
    loadIssues()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">IIT Help Desk Dashboard</h2>
          <p className="text-slate-500 dark:text-slate-400">Global overview of all employee tickets and system issues.</p>
        </div>
        <button 
          onClick={loadIssues}
          className="rounded-xl bg-slate-100 dark:bg-slate-800 p-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
        >
          <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''} text-slate-600 dark:text-slate-400`} />
        </button>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard
          metric={{
            id: 'total-tickets',
            label: 'Total Tickets',
            value: issues.length.toString(),
            delta: 'All time',
            tone: 'neutral',
          }}
        />
        <MetricCard
          metric={{
            id: 'open-tickets',
            label: 'Open Tickets',
            value: issues.filter(i => i.status?.toLowerCase() === 'open' || i.status?.toLowerCase() === 'in_progress').length.toString(),
            delta: 'Requires attention',
            tone: 'warning',
          }}
        />
        <MetricCard
          metric={{
            id: 'resolved-tickets',
            label: 'Resolved',
            value: issues.filter(i => i.status?.toLowerCase() === 'resolved').length.toString(),
            delta: 'Completed tickets',
            tone: 'positive',
          }}
        />
      </section>

      <SectionCard title="Global Ticket Registry" subtitle="Manage and assign tickets across the organization.">
        <div className="table-shell overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                {['ID', 'Reporter', 'Title', 'Category', 'Severity', 'Status', 'Date'].map((head) => (
                  <th key={head} className="px-4 py-3 font-semibold">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => (
                <tr key={issue.id || issue._id} className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-4 font-mono text-xs text-slate-400 dark:text-slate-500">#{(issue.id || issue._id || "").slice(0, 8)}</td>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-slate-900 dark:text-white">{issue.createdBy?.name || 'Unknown'}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">{issue.createdBy?.email || 'No email'}</p>
                  </td>
                  <td className="px-4 py-4 font-medium text-slate-700 dark:text-slate-300">{issue.title}</td>
                  <td className="px-4 py-4">
                    <StatusBadge label={issue.category?.toUpperCase()} />
                  </td>
                  <td className="px-4 py-4">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                      (issue.priority || issue.severity) === 'critical' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' : 
                      (issue.priority || issue.severity) === 'high' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                      'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {issue.priority || issue.severity}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge label={issue.status?.toUpperCase()} />
                  </td>
                  <td className="px-4 py-4 text-slate-500 dark:text-slate-400">{new Date(issue.createdAt || issue.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {issues.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={7} className="px-4 py-20 text-center text-slate-400">
                    No tickets found in the system.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  )
}

export function AnalyticsPage({ platform }: { platform: PlatformData }) {
  return (
    <div className="space-y-4">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <MetricCard metric={{ id: 'count', label: 'Employee count', value: `${platform.analytics.employeeCount}`, delta: 'Active workforce', tone: 'positive' }} />
        <MetricCard metric={{ id: 'attrition', label: 'Attrition rate', value: `${platform.analytics.attritionRate}%`, delta: 'AI attrition forecast', tone: 'warning' }} />
        <MetricCard metric={{ id: 'engagement', label: 'Engagement', value: `${platform.analytics.avgEngagement}%`, delta: 'Average employee sentiment', tone: 'positive' }} />
        <MetricCard metric={{ id: 'performance', label: 'Performance', value: `${platform.analytics.avgPerformance}/5`, delta: 'Average review score', tone: 'positive' }} />
        <MetricCard metric={{ id: 'attendance', label: 'Attendance', value: `${platform.analytics.attendanceRate}%`, delta: 'Workforce presence trend', tone: 'positive' }} />
        <MetricCard metric={{ id: 'hiring-cost', label: 'Hiring cost/employee', value: currency(platform.analytics.hiringCostPerEmployee), delta: 'Budget planning driver', tone: 'neutral' }} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <SectionCard title="Attrition and productivity analytics" subtitle="AI signals and operational trends.">
          <div className="h-80">
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={platform.analytics.trends.attrition}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Line dataKey="value" stroke="#e11d48" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="mt-5 h-80">
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platform.analytics.trends.salary}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip formatter={(value) => currency(Number(value))} />
                  <Legend />
                  <Bar dataKey="avgSalary" fill="#0f766e" radius={[12, 12, 0, 0]} />
                  <Bar dataKey="bonusPool" fill="#f97316" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="AI hotspots" subtitle="Highest risk individuals and workforce recommendations.">
          <div className="space-y-4">
            {platform.analytics.aiInsights.attritionHotspots.map((item) => (
              <div key={item.name} className="rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{item.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.department}</p>
                  </div>
                  <p className="font-display text-3xl font-bold text-rose-600">{item.risk}%</p>
                </div>
              </div>
            ))}
            {platform.analytics.aiInsights.recommendations.map((recommendation) => (
              <div key={recommendation} className="rounded-2xl bg-slate-950 px-4 py-4 text-sm text-white/75">
                {recommendation}
              </div>
            ))}
          </div>
        </SectionCard>
      </section>
    </div>
  )
}
export function LiveTrackingPage({ token }: { token: string }) {
  const [locations, setLocations] = useState<any[]>([])

  useEffect(() => {
    // Fetch initial locations
    const fetchLocations = async () => {
      try {
        const res = await axios.get('/api/location/live', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setLocations(res.data)
      } catch (err) {
        console.error('Error fetching live locations', err)
      }
    }
    fetchLocations()

    // Listen for real-time updates via Socket
    socket.on('location_update', (data) => {
      setLocations((current) => {
        const index = current.findIndex((l) => l.userId === data.userId)
        if (index !== -1) {
          const updated = [...current]
          updated[index] = data
          return updated
        }
        return [data, ...current]
      })
    })

    return () => {
      socket.off('location_update')
    }
  }, [])

  return (
    <div className="space-y-4">
      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard
          metric={{
            id: 'active-trackers',
            label: 'Active GPS nodes',
            value: locations.length.toString(),
            delta: 'Live workforce signal',
            tone: 'positive',
          }}
        />
        <MetricCard
          metric={{
            id: 'accuracy-level',
            label: 'System accuracy',
            value: '99.9%',
            delta: 'High-precision Geolocation',
            tone: 'positive',
          }}
        />
        <MetricCard
          metric={{
            id: 'update-freq',
            label: 'Update frequency',
            value: '30s',
            delta: 'Real-time moment tracking',
            tone: 'neutral',
          }}
        />
      </section>

      <SectionCard title="Live workforce movement" subtitle="Real-time geographic distribution and activity status.">
        <div className="table-shell overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                {['Employee', 'Coordinates', 'Device', 'Last Update', 'Status'].map((head) => (
                  <th key={head} className="px-4 py-3 font-semibold">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {locations.map((loc) => (
                <tr key={loc.userId} className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-slate-900 dark:text-white">{loc.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">ID: {loc.employeeId}</p>
                  </td>
                  <td className="px-4 py-4 font-mono text-xs text-slate-600 dark:text-slate-400">
                    {loc.latitude.toFixed(6)}, {loc.longitude.toFixed(6)}
                  </td>
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                       {loc.deviceType === 'Mobile' ? <Smartphone className="h-3 w-3" /> : <Laptop className="h-3 w-3" />}
                       {loc.deviceType}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-500 dark:text-slate-400">
                    {new Date(loc.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge label="Live" />
                  </td>
                </tr>
              ))}
              {locations.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                    Waiting for GPS signals...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  )
}
