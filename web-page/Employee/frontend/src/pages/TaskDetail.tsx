import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Progress } from '@/components/ui/Progress';
import { Textarea } from '@/components/ui/Textarea';
import { useAuth } from '@/contexts/AuthContext';
import { fileService } from '@/services/file.service';
import { taskService } from '@/services/task.service';
import { Task, UploadedFile } from '@/types';
import { cn, formatDate, getPriorityColor, getRelativeTime, getStatusColor } from '@/lib/utils';
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Edit2,
  Loader2,
  MessageSquare,
  Paperclip,
  Send,
  User,
} from 'lucide-react';

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');
  const [progress, setProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<globalThis.File[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadTask = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const taskData = await taskService.getTask(id);
      setTask(taskData);
      setEditedDescription(taskData.description);
      setProgress(taskData.progress_percentage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadTask();
  }, [id]);

  const handleAddComment = async () => {
    if (!task || !newComment.trim()) return;
    setIsSaving(true);
    try {
      await taskService.addComment(task.id, newComment.trim());
      setNewComment('');
      await loadTask();
    } finally {
      setIsSaving(false);
    }
  };

  const handleProgressChange = async (newProgress: number) => {
    if (!task) return;
    setProgress(newProgress);
    await taskService.updateTask(task.id, {
      progress_percentage: newProgress,
      status: newProgress === 100 ? 'COMPLETED' : task.status === 'PENDING' ? 'IN_PROGRESS' : task.status,
    });
    await taskService.updateProgress(task.id, newProgress);
    await loadTask();
  };

  const handleStatusChange = async (newStatus: Task['status']) => {
    if (!task) return;
    setIsSaving(true);
    try {
      await taskService.updateTask(task.id, { status: newStatus });
      await loadTask();
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!task) return;
    const files = event.target.files ? Array.from(event.target.files) : [];
    setSelectedFiles(files);
    if (files.length === 0) return;

    setIsSaving(true);
    try {
      await Promise.all(files.map((file) => fileService.uploadFile(file, task.id)));
      await loadTask();
    } finally {
      setIsSaving(false);
    }
  };

  const submitForReview = async () => {
    if (!task) return;
    setIsSaving(true);
    try {
      const nextProgress = Math.max(progress, 90);
      await taskService.updateTask(task.id, {
        status: 'REVIEW',
        progress_percentage: nextProgress,
      });
      await taskService.updateProgress(task.id, nextProgress);
      await loadTask();
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDescription = async () => {
    if (!task) return;
    setIsSaving(true);
    try {
      await taskService.updateTask(task.id, { description: editedDescription });
      setIsEditing(false);
      await loadTask();
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !task) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-500 shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading task details...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" onClick={() => navigate('/tasks')} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <Button onClick={() => void submitForReview()} className="gap-2" isLoading={isSaving}>
          <CheckCircle className="w-4 h-4" /> Submit for Review
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                    <Badge className={getStatusColor(task.status)}>{task.status.replace('_', ' ')}</Badge>
                    {task.project_name && <Badge variant="info">{task.project_name}</Badge>}
                  </div>
                  <h1 className="text-2xl font-bold text-slate-950">{task.title}</h1>
                </div>
                <Button variant="ghost" onClick={() => setIsEditing(true)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="mb-6">
                <h3 className="mb-2 text-sm font-medium text-slate-500">Description</h3>
                <p className="text-slate-600">{task.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="mb-2 text-sm font-medium text-slate-500">Progress</h3>
                <div className="flex items-center gap-4">
                  <Progress value={progress} size="lg" className="flex-1" />
                  <span className="w-16 text-lg font-semibold text-slate-950">{progress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(event) => void handleProgressChange(parseInt(event.target.value, 10))}
                  className="mt-2 w-full accent-teal-600"
                />
              </div>

              <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-slate-50 p-4">
                  <div className="mb-1 flex items-center gap-2 text-slate-500">
                    <User className="w-4 h-4" /> Assigned To
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <Avatar
                      src={task.assigned_to?.avatar ?? null}
                      firstName={task.assigned_to?.first_name ?? 'N'}
                      lastName={task.assigned_to?.last_name ?? 'A'}
                      size="md"
                    />
                    <div>
                      <p className="font-medium text-slate-950">
                        {task.assigned_to?.first_name} {task.assigned_to?.last_name}
                      </p>
                      <p className="text-sm text-slate-500">{task.assigned_to?.designation}</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <div className="mb-1 flex items-center gap-2 text-slate-500">
                    <Calendar className="w-4 h-4" /> Deadline
                  </div>
                  <p className="mt-2 text-lg font-medium text-slate-950">{formatDate(task.deadline)}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-slate-500">Status:</span>
                {(['PENDING', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => void handleStatusChange(status)}
                    className={cn(
                      'rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
                      task.status === status
                        ? 'border-teal-200 bg-teal-50 text-teal-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-teal-200 hover:bg-teal-50'
                    )}
                  >
                    {status.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-slate-400" />
                <h2 className="font-semibold text-slate-950">Comments ({task.comments?.length ?? 0})</h2>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 space-y-4">
                {(task.comments ?? []).map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar
                      src={comment.author.avatar}
                      firstName={comment.author.first_name}
                      lastName={comment.author.last_name}
                      size="md"
                    />
                    <div className="flex-1 rounded-lg bg-slate-50 p-4">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="font-medium text-slate-950">
                          {comment.author.first_name} {comment.author.last_name}
                        </span>
                        <span className="text-xs text-slate-500">
                          {getRelativeTime(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-slate-600">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Avatar
                  src={user?.avatar ?? null}
                  firstName={user?.first_name ?? 'Y'}
                  lastName={user?.last_name ?? 'U'}
                  size="md"
                />
                <div className="flex flex-1 gap-2">
                  <Input
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(event) => setNewComment(event.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={() => void handleAddComment()} className="gap-2" isLoading={isSaving}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-slate-950">Activity</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-slate-950">Last updated</p>
                  <p className="text-xs text-slate-500">{getRelativeTime(task.updated_at)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-950">Created</p>
                  <p className="text-xs text-slate-500">{formatDate(task.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-950">Created by</p>
                  <p className="text-xs text-slate-500">
                    {task.created_by?.first_name} {task.created_by?.last_name}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Paperclip className="w-5 h-5 text-slate-400" />
                <h3 className="font-semibold text-slate-950">Attachments</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center transition hover:border-teal-200 hover:bg-teal-50/50">
                <Paperclip className="h-6 w-6 text-teal-700" />
                <span className="mt-2 text-sm font-semibold text-slate-700">Upload task files</span>
                <span className="mt-1 text-xs text-slate-400">{selectedFiles.length ? `${selectedFiles.length} file(s) selected` : 'Attach work evidence or final files'}</span>
                <input type="file" multiple className="hidden" onChange={(event) => void handleFileChange(event)} />
              </label>
              <div className="space-y-2">
                {(task.attachments ?? []).length === 0 ? (
                  <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-500">No attachments yet</p>
                ) : (
                  (task.attachments as UploadedFile[]).map((file) => (
                    <a
                      key={file.id}
                      href={file.file ?? '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-xl bg-slate-50 p-3 text-sm font-medium text-slate-700 hover:bg-teal-50"
                    >
                      {file.filename}
                    </a>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Edit Task">
        <div className="space-y-4">
          <Textarea
            label="Description"
            rows={6}
            value={editedDescription}
            onChange={(event) => setEditedDescription(event.target.value)}
          />
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <Button variant="ghost" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={() => void handleSaveDescription()} isLoading={isSaving}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
