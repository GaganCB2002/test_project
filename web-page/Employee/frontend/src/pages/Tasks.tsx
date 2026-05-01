import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Progress } from '@/components/ui/Progress';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { useAuth } from '@/contexts/AuthContext';
import { fileService } from '@/services/file.service';
import { taskService } from '@/services/task.service';
import { Comment, Project, Task, UploadedFile } from '@/types';
import { formatDate, getPriorityColor, getRelativeTime, getStatusColor } from '@/lib/utils';
import {
  Calendar,
  CheckCircle2,
  Clock,
  FileUp,
  Loader2,
  MessageSquare,
  Plus,
  Search,
  Send,
  SlidersHorizontal,
} from 'lucide-react';

type TaskStatus = Task['status'];
type TaskPriority = Task['priority'];

type UpdateDraft = {
  status: TaskStatus;
  progress: number;
  note: string;
  files: globalThis.File[];
};

const statusOptions = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'REVIEW', label: 'In Review' },
  { value: 'COMPLETED', label: 'Completed' },
];

const priorityOptions = [
  { value: '', label: 'All priorities' },
  { value: 'CRITICAL', label: 'Critical' },
  { value: 'HIGH', label: 'High' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LOW', label: 'Low' },
];

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [draft, setDraft] = useState<UpdateDraft>({ status: 'PENDING', progress: 0, note: '', files: [] });
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM' as TaskPriority,
    deadline: '',
    project: '',
    estimated_hours: '8',
    assigned_to: user?.id ?? '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const [myTasks, projectList] = await Promise.all([
        taskService.getMyTasks({
          status: statusFilter || undefined,
          priority: priorityFilter || undefined,
        }),
        taskService.getProjects(),
      ]);
      setTasks(myTasks);
      setProjects(projectList);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadTasks();
  }, [statusFilter, priorityFilter]);

  const filteredTasks = useMemo(() => tasks.filter((task) => {
    const query = searchQuery.toLowerCase();
    return (
      task.title.toLowerCase().includes(query)
      || task.description.toLowerCase().includes(query)
      || (task.project_name?.toLowerCase().includes(query) ?? false)
    );
  }), [tasks, searchQuery]);

  const summary = useMemo(() => ({
    active: tasks.filter((task) => task.status === 'IN_PROGRESS').length,
    review: tasks.filter((task) => task.status === 'REVIEW').length,
    completed: tasks.filter((task) => task.status === 'COMPLETED').length,
    avgProgress: tasks.length ? Math.round(tasks.reduce((sum, task) => sum + task.progress_percentage, 0) / tasks.length) : 0,
  }), [tasks]);

  const openUpdateModal = (task: Task) => {
    setSelectedTask(task);
    setDraft({ status: task.status, progress: task.progress_percentage, note: '', files: [] });
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDraft((current) => ({
      ...current,
      files: event.target.files ? Array.from(event.target.files) : [],
    }));
  };

  const refreshSingleTask = async (taskId: string) => {
    const updated = await taskService.getTask(taskId);
    setTasks((currentTasks) => currentTasks.map((item) => (item.id === taskId ? updated : item)));
    setSelectedTask(updated);
  };

  const saveTaskUpdate = async (submitForReview = false) => {
    if (!selectedTask) return;

    setIsSaving(true);
    try {
      const nextStatus = submitForReview ? 'REVIEW' : draft.status;
      const nextProgress = submitForReview ? Math.max(draft.progress, 90) : draft.progress;

      await taskService.updateTask(selectedTask.id, {
        status: nextStatus,
        progress_percentage: nextProgress,
      });
      await taskService.updateProgress(selectedTask.id, nextProgress);

      if (draft.note.trim()) {
        await taskService.addComment(selectedTask.id, draft.note.trim());
      }

      if (draft.files.length > 0) {
        await Promise.all(draft.files.map((file) => fileService.uploadFile(file, selectedTask.id)));
      }

      await refreshSingleTask(selectedTask.id);
      await loadTasks();
      setSelectedTask(null);
      setDraft({ status: 'PENDING', progress: 0, note: '', files: [] });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.title || !newTask.deadline || !newTask.assigned_to) {
      return;
    }

    setIsSaving(true);
    try {
      await taskService.createTask({
        title: newTask.title,
        description: newTask.description,
        assigned_to: newTask.assigned_to,
        deadline: new Date(newTask.deadline).toISOString(),
        priority: newTask.priority,
        project: newTask.project || undefined,
        estimated_hours: Number(newTask.estimated_hours),
      });
      setNewTask({
        title: '',
        description: '',
        priority: 'MEDIUM',
        deadline: '',
        project: '',
        estimated_hours: '8',
        assigned_to: user?.id ?? '',
      });
      setIsCreateModalOpen(false);
      await loadTasks();
    } finally {
      setIsSaving(false);
    }
  };

  const latestComment = (task: Task): Comment | null => task.comments?.[task.comments.length - 1] ?? null;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-500 shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading assigned tasks...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">My Tasks</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950">Assigned work and project delivery</h1>
          <p className="mt-2 text-slate-500">Update progress, add notes, attach files, and submit finished work for review.</p>
        </div>
        {user?.role !== 'EMPLOYEE' && (
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Create Task
          </Button>
        )}
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Active', value: summary.active, helper: 'In progress now', tone: 'bg-teal-50 text-teal-700', icon: SlidersHorizontal },
          { label: 'In review', value: summary.review, helper: 'Awaiting feedback', tone: 'bg-indigo-50 text-indigo-700', icon: Send },
          { label: 'Completed', value: summary.completed, helper: 'Closed tasks', tone: 'bg-emerald-50 text-emerald-700', icon: CheckCircle2 },
          { label: 'Avg progress', value: `${summary.avgProgress}%`, helper: 'Across assignments', tone: 'bg-amber-50 text-amber-700', icon: Clock },
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
                  <item.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Card>
          <CardContent className="p-4">
            <div className="grid gap-3 lg:grid-cols-[1fr_190px_190px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search assigned tasks..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="pl-10"
                />
              </div>
              <Select options={priorityOptions} value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)} />
              <Select options={[{ value: '', label: 'All statuses' }, ...statusOptions]} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Projects</p>
                <p className="mt-2 text-3xl font-bold text-slate-950">{projects.length}</p>
                <p className="mt-1 text-sm text-slate-400">Assigned project spaces</p>
              </div>
              <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardContent className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-4">
          {projects.slice(0, 4).map((project) => {
            const progress = project.total_tasks ? Math.round((project.completed_tasks / project.total_tasks) * 100) : 0;
            return (
              <div key={project.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{project.code}</p>
                    <p className="mt-1 font-semibold text-slate-950">{project.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{project.status.replace('_', ' ')}</p>
                  </div>
                  <Badge variant="info">{project.completed_tasks}/{project.total_tasks}</Badge>
                </div>
                <Progress value={progress} className="mt-4" />
              </div>
            );
          })}
          {projects.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500 md:col-span-2 xl:col-span-4">
              No active projects assigned yet.
            </div>
          )}
        </CardContent>
      </Card>

      <section className="grid gap-4">
        {filteredTasks.map((task) => (
          <Card key={task.id} className="transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/80">
            <CardContent className="p-5">
              <div className="grid gap-5 xl:grid-cols-[1fr_260px]">
                <div className="space-y-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Link to={`/tasks/${task.id}`} className="text-lg font-bold text-slate-950 hover:text-teal-700">
                          {task.title}
                        </Link>
                        <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(task.status)}`}>
                          {task.status.replace('_', ' ')}
                        </span>
                        {task.project_name && <Badge variant="info">{task.project_name}</Badge>}
                      </div>
                      <p className="mt-2 max-w-3xl text-sm text-slate-500">{task.description}</p>
                    </div>
                    <Button variant="secondary" onClick={() => openUpdateModal(task)} className="gap-2">
                      <SlidersHorizontal className="h-4 w-4" /> Update
                    </Button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs font-medium uppercase text-slate-400">Deadline</p>
                      <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-700"><Calendar className="h-4 w-4" />{formatDate(task.deadline)}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs font-medium uppercase text-slate-400">Comments</p>
                      <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-700"><MessageSquare className="h-4 w-4" />{task.comments?.length ?? task.comments_count ?? 0} notes</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs font-medium uppercase text-slate-400">Files</p>
                      <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-700"><FileUp className="h-4 w-4" />{task.attachments?.length ?? task.attachments_count ?? 0} attached</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar
                        src={task.assigned_to?.avatar ?? null}
                        firstName={task.assigned_to?.first_name ?? 'N'}
                        lastName={task.assigned_to?.last_name ?? 'A'}
                        size="sm"
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-950">Assigned</p>
                        <p className="text-xs text-slate-400">Updated {getRelativeTime(task.updated_at)}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-slate-950">{task.progress_percentage}%</span>
                  </div>
                  <Progress value={task.progress_percentage} size="lg" />
                  {latestComment(task) && (
                    <p className="mt-4 rounded-xl bg-white p-3 text-sm text-slate-600">
                      "{latestComment(task)?.content}"
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredTasks.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500">
            No tasks match the current filters.
          </div>
        )}
      </section>

      <Modal isOpen={!!selectedTask} onClose={() => setSelectedTask(null)} title="Update Assigned Task" size="lg">
        {selectedTask && (
          <div className="space-y-5">
            <div className="rounded-xl bg-slate-50 p-4">
              <h3 className="font-semibold text-slate-950">{selectedTask.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{selectedTask.description}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Status"
                options={statusOptions}
                value={draft.status}
                onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value as TaskStatus }))}
              />
              <Input
                label="Progress %"
                type="number"
                min={0}
                max={100}
                value={draft.progress}
                onChange={(event) => setDraft((current) => ({ ...current, progress: Math.min(100, Math.max(0, Number(event.target.value))) }))}
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-600">
                <span>Progress slider</span>
                <span>{draft.progress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={draft.progress}
                onChange={(event) => setDraft((current) => ({ ...current, progress: Number(event.target.value) }))}
                className="w-full accent-teal-600"
              />
            </div>

            <Textarea
              label="Notes / comment"
              rows={4}
              placeholder="Add progress notes, blockers, handoff details, or review context..."
              value={draft.note}
              onChange={(event) => setDraft((current) => ({ ...current, note: event.target.value }))}
            />

            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 text-center">
                <FileUp className="h-6 w-6 text-teal-700" />
                <span className="text-sm font-semibold text-slate-700">Upload supporting files</span>
                <span className="text-xs text-slate-400">{draft.files.length ? `${draft.files.length} file(s) selected` : 'Attach screenshots, documents, or final work files'}</span>
                <input type="file" multiple className="hidden" onChange={handleFileChange} />
              </label>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
              <Button variant="ghost" onClick={() => setSelectedTask(null)}>Cancel</Button>
              <Button variant="secondary" onClick={() => void saveTaskUpdate(false)} isLoading={isSaving}>Save Update</Button>
              <Button onClick={() => void saveTaskUpdate(true)} className="gap-2" isLoading={isSaving}><Send className="h-4 w-4" /> Submit for Review</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Task" size="lg">
        <div className="space-y-4">
          <Input label="Task Title" placeholder="Enter task title" value={newTask.title} onChange={(event) => setNewTask({ ...newTask, title: event.target.value })} />
          <Textarea label="Description" placeholder="Describe the task..." rows={4} value={newTask.description} onChange={(event) => setNewTask({ ...newTask, description: event.target.value })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Priority" options={priorityOptions.slice(1)} value={newTask.priority} onChange={(event) => setNewTask({ ...newTask, priority: event.target.value as TaskPriority })} />
            <Input label="Deadline" type="date" value={newTask.deadline} onChange={(event) => setNewTask({ ...newTask, deadline: event.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Project"
              options={[{ value: '', label: 'No project' }, ...projects.map((project) => ({ value: project.id, label: `${project.code} - ${project.name}` }))]}
              value={newTask.project}
              onChange={(event) => setNewTask({ ...newTask, project: event.target.value })}
            />
            <Input
              label="Estimated hours"
              type="number"
              min={1}
              value={newTask.estimated_hours}
              onChange={(event) => setNewTask({ ...newTask, estimated_hours: event.target.value })}
            />
          </div>
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button onClick={() => void handleCreateTask()} isLoading={isSaving}>Create Task</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
