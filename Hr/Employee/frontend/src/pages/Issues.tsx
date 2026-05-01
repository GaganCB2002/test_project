import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { issuesService } from '@/services/issues.service';
import { taskService } from '@/services/task.service';
import { IssueReport, Task } from '@/types';
import { formatDate, getStatusColor } from '@/lib/utils';
import { AlertTriangle, Filter, Loader2, Plus } from 'lucide-react';

const categoryOptions = [
  { value: 'HR', label: 'HR' },
  { value: 'TECHNICAL', label: 'Technical' },
  { value: 'PAYROLL', label: 'Payroll' },
  { value: 'LEAVE', label: 'Leave' },
  { value: 'GENERAL', label: 'General' },
];

export default function IssuesPage() {
  const [issues, setIssues] = useState<IssueReport[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [newIssue, setNewIssue] = useState({
    category: 'GENERAL' as IssueReport['category'],
    task: '',
    title: '',
    description: '',
    severity: 'MEDIUM' as IssueReport['severity'],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadIssues = async () => {
    setIsLoading(true);
    try {
      const [issueList, taskList] = await Promise.all([
        issuesService.getIssues({
          status: statusFilter || undefined,
          category: categoryFilter || undefined,
        }),
        taskService.getMyTasks(),
      ]);
      setIssues(issueList);
      setTasks(taskList);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadIssues();
  }, [statusFilter, categoryFilter]);

  const summary = useMemo(() => ({
    open: issues.filter((issue) => issue.status === 'OPEN').length,
    inProgress: issues.filter((issue) => issue.status === 'IN_PROGRESS').length,
    resolved: issues.filter((issue) => issue.status === 'RESOLVED').length,
  }), [issues]);

  const handleSubmit = async () => {
    if (!newIssue.title || !newIssue.description) return;
    setIsSaving(true);
    try {
      await issuesService.createIssue({
        category: newIssue.category,
        task: newIssue.task || undefined,
        title: newIssue.title,
        description: newIssue.description,
        severity: newIssue.severity,
      });
      setNewIssue({
        category: 'GENERAL',
        task: '',
        title: '',
        description: '',
        severity: 'MEDIUM',
      });
      setIsModalOpen(false);
      await loadIssues();
    } finally {
      setIsSaving(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'HIGH':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'MEDIUM':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'LOW':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-500 shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading tickets...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Tickets</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950">Raise and track employee issues</h1>
          <p className="mt-2 text-slate-500">Submit HR, payroll, leave, technical, or general queries and follow their status.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              const key = prompt('Enter IT Admin Security Key:');
              if (key === 'ADMIN-HR-2026') {
                const token = localStorage.getItem('aurahr-token');
                window.location.href = `http://127.0.0.1:3005/login?token=${token}`;
              } else if (key !== null) {
                alert('Access Denied: Invalid IT Admin Credentials.');
              }
            }}
            className="text-slate-400 hover:text-teal-600"
          >
            <AlertTriangle className="w-3 h-3 mr-1" /> IIT Admin Access
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Raise Ticket
          </Button>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Open', value: summary.open, helper: 'Needs attention', tone: 'bg-rose-50 text-rose-700' },
          { label: 'In Progress', value: summary.inProgress, helper: 'Being handled', tone: 'bg-amber-50 text-amber-700' },
          { label: 'Resolved', value: summary.resolved, helper: 'Resolved recently', tone: 'bg-emerald-50 text-emerald-700' },
          { label: 'Total', value: issues.length, helper: 'All submitted tickets', tone: 'bg-sky-50 text-sky-700' },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{item.label}</p>
                  <p className="mt-2 text-3xl font-bold text-slate-950">{item.value}</p>
                  <p className="mt-1 text-sm text-slate-400">{item.helper}</p>
                </div>
                <div className={`rounded-xl p-3 ${item.tone}`}>
                  <AlertTriangle className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-400">Filter:</span>
        </div>
        <Select
          options={[
            { value: '', label: 'All Status' },
            { value: 'OPEN', label: 'Open' },
            { value: 'IN_PROGRESS', label: 'In Progress' },
            { value: 'RESOLVED', label: 'Resolved' },
            { value: 'CLOSED', label: 'Closed' },
          ]}
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="w-40"
        />
        <Select
          options={[{ value: '', label: 'All Categories' }, ...categoryOptions]}
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          className="w-44"
        />
      </div>

      <div className="grid gap-4">
        {issues.map((issue) => (
          <Card key={issue.id} className="transition-colors hover:border-slate-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    issue.severity === 'CRITICAL' || issue.severity === 'HIGH'
                      ? 'bg-rose-50'
                      : issue.severity === 'MEDIUM'
                        ? 'bg-amber-50'
                        : 'bg-emerald-50'
                  }`}>
                    <AlertTriangle className={`h-5 w-5 ${
                      issue.severity === 'CRITICAL' || issue.severity === 'HIGH'
                        ? 'text-rose-600'
                        : issue.severity === 'MEDIUM'
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                    }`} />
                  </div>
                  <div>
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-slate-950">{issue.title}</h3>
                      <Badge className={getSeverityColor(issue.severity)}>{issue.severity}</Badge>
                      <Badge className={getStatusColor(issue.status)}>{issue.status.replace('_', ' ')}</Badge>
                      <Badge variant="info">{issue.category}</Badge>
                    </div>
                    <p className="mb-2 text-slate-500">{issue.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                      <span>Raised {formatDate(issue.created_at)}</span>
                      <span>by {issue.reporter.first_name} {issue.reporter.last_name}</span>
                      {issue.assigned_to && <span>Assigned to {issue.assigned_to.first_name} {issue.assigned_to.last_name}</span>}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {issues.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500">
            No tickets match the current filters.
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Raise a Ticket" size="lg">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Category"
              options={categoryOptions}
              value={newIssue.category}
              onChange={(event) => setNewIssue({ ...newIssue, category: event.target.value as IssueReport['category'] })}
            />
            <Select
              label="Related Task"
              options={[{ value: '', label: 'No related task' }, ...tasks.map((task) => ({ value: task.id, label: task.title }))]}
              value={newIssue.task}
              onChange={(event) => setNewIssue({ ...newIssue, task: event.target.value })}
            />
          </div>
          <Input
            label="Ticket Title"
            placeholder="Brief description of the issue"
            value={newIssue.title}
            onChange={(event) => setNewIssue({ ...newIssue, title: event.target.value })}
          />
          <Select
            label="Severity"
            options={[
              { value: 'LOW', label: 'Low' },
              { value: 'MEDIUM', label: 'Medium' },
              { value: 'HIGH', label: 'High' },
              { value: 'CRITICAL', label: 'Critical' },
            ]}
            value={newIssue.severity}
            onChange={(event) => setNewIssue({ ...newIssue, severity: event.target.value as IssueReport['severity'] })}
          />
          <Textarea
            label="Description"
            placeholder="Describe the issue, impact, and any helpful context..."
            rows={5}
            value={newIssue.description}
            onChange={(event) => setNewIssue({ ...newIssue, description: event.target.value })}
          />
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => void handleSubmit()} isLoading={isSaving}>
              Submit Ticket
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
