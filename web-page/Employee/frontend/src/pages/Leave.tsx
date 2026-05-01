import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { formatDate, getStatusColor } from '@/lib/utils';
import { Calendar, CalendarCheck, CalendarOff, Clock, Plus } from 'lucide-react';
import { LeaveRequest } from '@/types';

const mockLeaveRequests: LeaveRequest[] = [
  { id: '1', user: '1', leave_type: 'SICK', start_date: '2026-04-15', end_date: '2026-04-16', reason: 'Medical appointment', status: 'APPROVED', reviewed_by: null, created_at: '2026-04-10T10:00:00Z' },
  { id: '2', user: '1', leave_type: 'CASUAL', start_date: '2026-04-28', end_date: '2026-04-29', reason: 'Personal work', status: 'PENDING', reviewed_by: null, created_at: '2026-04-20T14:30:00Z' },
  { id: '3', user: '1', leave_type: 'ANNUAL', start_date: '2026-05-06', end_date: '2026-05-10', reason: 'Family vacation', status: 'APPROVED', reviewed_by: null, created_at: '2026-04-18T09:00:00Z' },
];

const leaveBalance = [
  { label: 'Annual Leave', value: 15, helper: 'Planned time off', icon: Calendar, tone: 'bg-emerald-50 text-emerald-700' },
  { label: 'Sick Leave', value: 10, helper: 'Health allowance', icon: CalendarOff, tone: 'bg-sky-50 text-sky-700' },
  { label: 'Casual Leave', value: 5, helper: 'Personal needs', icon: CalendarCheck, tone: 'bg-teal-50 text-teal-700' },
  { label: 'Unpaid Leave', value: 0, helper: 'Special cases', icon: Clock, tone: 'bg-slate-100 text-slate-700' },
];

export default function LeavePage() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    leave_type: 'CASUAL',
    start_date: '',
    end_date: '',
    reason: '',
  });

  const pendingCount = useMemo(() => leaveRequests.filter((request) => request.status === 'PENDING').length, [leaveRequests]);

  const handleSubmit = () => {
    if (!newRequest.start_date || !newRequest.end_date || !newRequest.reason) return;
    const request: LeaveRequest = {
      id: Date.now().toString(),
      user: '1',
      leave_type: newRequest.leave_type as LeaveRequest['leave_type'],
      start_date: newRequest.start_date,
      end_date: newRequest.end_date,
      reason: newRequest.reason,
      status: 'PENDING',
      reviewed_by: null,
      created_at: new Date().toISOString(),
    };
    setLeaveRequests((prev) => [request, ...prev]);
    setNewRequest({ leave_type: 'CASUAL', start_date: '', end_date: '', reason: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Leave</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950">Leave planning and requests</h1>
          <p className="mt-2 text-slate-500">Review balances, submit leave, and track approvals in one place.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Request Leave
        </Button>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {leaveBalance.map((item) => (
          <Card key={item.label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{item.label}</p>
                  <p className="mt-2 text-3xl font-bold text-slate-950">{item.value} days</p>
                  <p className="mt-1 text-sm text-slate-400">{item.helper}</p>
                </div>
                <div className={`rounded-xl p-3 ${item.tone}`}>
                  <item.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="min-w-0">
          <CardHeader>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-slate-950">Leave History</h2>
                <p className="text-sm text-slate-500">Recent leave requests and approval status</p>
              </div>
              <Badge variant={pendingCount ? 'warning' : 'success'}>{pendingCount} pending</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-slate-100">
                    {['Type', 'Duration', 'Reason', 'Status', 'Applied'].map((heading) => (
                      <th key={heading} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests.map((request) => (
                    <tr key={request.id} className="border-b border-slate-100 transition hover:bg-slate-50">
                      <td className="px-4 py-4"><Badge>{request.leave_type}</Badge></td>
                      <td className="px-4 py-4 text-sm font-medium text-slate-700">{formatDate(request.start_date)} - {formatDate(request.end_date)}</td>
                      <td className="max-w-xs truncate px-4 py-4 text-sm text-slate-500">{request.reason}</td>
                      <td className="px-4 py-4"><Badge className={getStatusColor(request.status)}>{request.status}</Badge></td>
                      <td className="px-4 py-4 text-sm text-slate-400">{formatDate(request.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="min-w-0 self-start">
          <CardHeader>
            <h2 className="font-semibold text-slate-950">Leave Insights</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl bg-teal-50 p-4">
              <p className="text-sm font-medium text-teal-700">Next approved leave</p>
              <p className="mt-1 text-lg font-bold text-slate-950">May 6 to May 10</p>
              <p className="mt-1 text-sm leading-6 text-slate-500">Annual leave planned for family vacation and travel.</p>
            </div>
            <div className="grid gap-3">
              <div className="rounded-xl border border-slate-100 p-4">
                <p className="text-sm font-medium text-slate-500">Balance health</p>
                <p className="mt-1 text-2xl font-bold text-slate-950">30 days</p>
                <p className="text-sm leading-6 text-slate-400">Available across all leave categories.</p>
              </div>
              <div className="rounded-xl border border-slate-100 p-4">
                <p className="text-sm font-medium text-slate-500">Approval average</p>
                <p className="mt-1 text-2xl font-bold text-slate-950">1.3 days</p>
                <p className="text-sm leading-6 text-slate-400">Based on recent team approvals and manager review cycles.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Request Leave" size="md">
        <div className="space-y-4">
          <Select
            label="Leave Type"
            options={[
              { value: 'SICK', label: 'Sick Leave' },
              { value: 'CASUAL', label: 'Casual Leave' },
              { value: 'ANNUAL', label: 'Annual Leave' },
              { value: 'UNPAID', label: 'Unpaid Leave' },
            ]}
            value={newRequest.leave_type}
            onChange={(event) => setNewRequest({ ...newRequest, leave_type: event.target.value })}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Start Date" type="date" value={newRequest.start_date} onChange={(event) => setNewRequest({ ...newRequest, start_date: event.target.value })} />
            <Input label="End Date" type="date" value={newRequest.end_date} onChange={(event) => setNewRequest({ ...newRequest, end_date: event.target.value })} />
          </div>
          <Textarea label="Reason" placeholder="Enter reason for leave..." rows={4} value={newRequest.reason} onChange={(event) => setNewRequest({ ...newRequest, reason: event.target.value })} />
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Submit Request</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
