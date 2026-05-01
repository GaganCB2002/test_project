import { useState, useEffect, useRef } from 'react'
import { Send, Clock, CheckCircle2, FileText, CalendarCheck, Sparkles, Hash } from 'lucide-react'
import { SectionCard } from '../components/ui/SectionCard'
import { StatusBadge } from '../components/ui/StatusBadge'
import { dateLabel } from '../lib/format'
import { api } from '../api/client'
import { socket } from '../api/socket'
import type { PlatformData, User } from '../types'

export function EmployeeDashboardPage({ platform, user, token }: { platform: PlatformData, user: User, token: string }) {
  // Leave Form
  const [form, setForm] = useState({
    employeeId: user.employeeId ?? user.id ?? 'emp-1',
    employeeName: user.name,
    type: 'Annual Leave',
    from: '',
    to: '',
    reason: '',
  })

  const [myLeaves, setMyLeaves] = useState(platform.attendance?.leaveRequests?.filter(r => r.employeeName === user.name) || [])
  const [messages, setMessages] = useState<any[]>([])
  const [chatInput, setChatInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  // HR Direct channel
  const hrChannel = 'hr-confidential'

  useEffect(() => {
    socket.emit('join_room', hrChannel)

    // Initial fetch
    api.getChatMessages(token, undefined, hrChannel).then(setMessages).catch(() => { })

    const handleNewMessage = (msg: any) => {
      if (msg.groupId === hrChannel) {
        setMessages(prev => [...prev, msg])
      }
    }

    socket.on('new_message', handleNewMessage)
    return () => {
      socket.off('new_message', handleNewMessage)
    }
  }, [token])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.from || !form.to || !form.reason) return

    // We mock the update locally since there is no persistent backend for leave creation in this mockup
    const newLeave = {
      id: `leave-${Date.now()}`,
      employeeId: form.employeeId,
      employeeName: form.employeeName,
      type: form.type,
      from: form.from,
      to: form.to,
      status: 'Pending',
      reason: form.reason
    }

    setMyLeaves(prev => [newLeave, ...prev])
    setForm({ ...form, from: '', to: '', reason: '' })
    alert("Leave request submitted successfully!")
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    await api.sendMessage({
      groupId: hrChannel,
      content: chatInput,
      type: 'text',
    }, token)

    setChatInput('')
  }

  const statCards = [
    { label: 'Pending Reviews', value: 2, icon: FileText, tone: 'bg-amber-50 text-amber-700' },
    { label: 'Tasks Completed', value: 15, icon: CheckCircle2, tone: 'bg-emerald-50 text-emerald-700' },
    { label: 'Leave Balance', value: '18 Days', icon: CalendarCheck, tone: 'bg-sky-50 text-sky-700' },
    { label: 'Hours Tracked', value: '38h 45m', icon: Clock, tone: 'bg-brand/10 text-brand' },
  ]

  return (
    <div className="space-y-6">
      {/* Banner */}
      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
        <div className="p-6 lg:p-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand">Employee Dashboard</p>
          <h1 className="mt-2 text-3xl font-display font-bold text-slate-950 dark:text-white">
            Welcome back, {user.name}
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            {user.role} • {user.department || 'General'}
          </p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="rounded-[22px] bg-white p-5 border border-slate-200 dark:bg-slate-900/50 dark:border-slate-800">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">{stat.value}</p>
              </div>
              <div className={`rounded-xl p-3 ${stat.tone} dark:bg-opacity-10 dark:text-current`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <SectionCard title="Apply for Leave" subtitle="Submit a time-off request.">
            <form onSubmit={handleApplyLeave} className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <select
                  className="rounded-xl border border-slate-200 px-4 py-3 bg-slate-50 dark:bg-slate-800 dark:border-slate-800 dark:text-white"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  {['Annual Leave', 'Sick Leave', 'WFH', 'Comp Off'].map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
                <input
                  type="date"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-slate-50 dark:bg-slate-800 dark:border-slate-800 dark:text-white"
                  value={form.from}
                  onChange={(e) => setForm({ ...form, from: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-slate-50 dark:bg-slate-800 dark:border-slate-800 dark:text-white"
                  value={form.to}
                  onChange={(e) => setForm({ ...form, to: e.target.value })}
                />
                <button type="button" className="flex items-center justify-center gap-2 rounded-xl border border-brand/20 bg-brand/5 px-4 py-3 text-xs font-bold text-brand hover:bg-brand/10 transition">
                  <Sparkles className="h-4 w-4" />
                  Check Team Workload
                </button>
              </div>

              <textarea
                required
                className="min-h-[100px] rounded-xl border border-slate-200 px-4 py-3 bg-slate-50 dark:bg-slate-800 dark:border-slate-800 dark:text-white"
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                placeholder="Reason for leave..."
              />
              <button type="submit" className="rounded-xl bg-brand py-3.5 text-sm font-bold text-white shadow-lg shadow-brand/20 hover:scale-[1.01] transition">
                Submit Request
              </button>
            </form>
          </SectionCard>

          <SectionCard title="My Leave History" subtitle="Status of your recent applications.">
            <div className="table-shell overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Type</th>
                    <th className="px-4 py-3 font-semibold">Dates</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {myLeaves.map(leave => (
                    <tr key={leave.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="px-4 py-4 font-semibold text-slate-900 dark:text-white">{leave.type}</td>
                      <td className="px-4 py-4 text-slate-600 dark:text-slate-400">
                        {dateLabel(leave.from)} - {dateLabel(leave.to)}
                        <p className="text-[10px] italic mt-0.5 max-w-[200px] truncate">"{leave.reason}"</p>
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge label={leave.status} />
                        {(leave as any).hrReason && (
                          <p className="text-[10px] text-rose-500 mt-1 font-bold">Note: {(leave as any).hrReason}</p>
                        )}
                      </td>
                    </tr>
                  ))}
                  {myLeaves.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-slate-500">No leave requests found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>

        <div>
          <SectionCard title="Direct Message: HR" subtitle="Instant communication with HR.">
            <div className="flex flex-col h-[500px] bg-slate-50 dark:bg-slate-800/50 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800">
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.map((msg, i) => {
                  const isMe = msg.senderId === user.id
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] ${isMe ? 'text-right' : 'text-left'}`}>
                        <div className="mb-1 flex items-center gap-2 px-1 text-[10px] font-bold text-slate-400">
                          <span>{isMe ? 'You' : msg.senderName}</span>
                          <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className={`rounded-2xl px-4 py-2.5 text-sm ${isMe ? 'bg-brand text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'}`}>
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={scrollRef} />
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                <form onSubmit={handleSendMessage} className="relative">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Message HR..."
                    className="w-full rounded-xl border-none bg-slate-100 py-3 pl-4 pr-12 text-sm focus:ring-2 focus:ring-brand dark:bg-slate-800 dark:text-white"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim()}
                    className="absolute right-1 top-1 bottom-1 aspect-square rounded-lg bg-brand text-white flex items-center justify-center transition disabled:opacity-50 hover:bg-brand/90"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  )
}
