import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { formatDate, getStatusColor } from '@/lib/utils';
import { FileText, Plus, Upload, Download, Eye } from 'lucide-react';
import { WorkSubmission } from '@/types';

const mockSubmissions: WorkSubmission[] = [
  {
    id: '1',
    task: {
      id: '1',
      title: 'Update API documentation',
      description: 'Documentation update for v2 release',
      assigned_to: { id: '1', email: 'john@example.com', first_name: 'John', last_name: 'Doe', department: 'Engineering', designation: 'Senior Developer', avatar: null, role: 'EMPLOYEE' },
      created_by: { id: '2', email: 'jane@example.com', first_name: 'Jane', last_name: 'Smith', department: 'Engineering', designation: 'Tech Lead', avatar: null, role: 'EMPLOYEE' },
      status: 'REVIEW',
      priority: 'HIGH',
      progress_percentage: 100,
      deadline: new Date(Date.now() + 86400000 * 2).toISOString(),
      comments: [],
      attachments: [],
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    submitted_by: { id: '1', email: 'john@example.com', first_name: 'John', last_name: 'Doe', department: 'Engineering', designation: 'Senior Developer', avatar: null, role: 'EMPLOYEE' },
    notes: 'Completed the API documentation update with all new endpoints.',
    status: 'PENDING_REVIEW',
    review_notes: null,
    reviewed_by: null,
    submitted_at: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: '2',
    task: {
      id: '2',
      title: 'Fix login bug',
      description: 'SSO login issue',
      assigned_to: { id: '1', email: 'john@example.com', first_name: 'John', last_name: 'Doe', department: 'Engineering', designation: 'Senior Developer', avatar: null, role: 'EMPLOYEE' },
      created_by: { id: '1', email: 'john@example.com', first_name: 'John', last_name: 'Doe', department: 'Engineering', designation: 'Senior Developer', avatar: null, role: 'EMPLOYEE' },
      status: 'COMPLETED',
      priority: 'CRITICAL',
      progress_percentage: 100,
      deadline: new Date(Date.now() - 86400000).toISOString(),
      comments: [],
      attachments: [],
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString(),
    },
    submitted_by: { id: '1', email: 'john@example.com', first_name: 'John', last_name: 'Doe', department: 'Engineering', designation: 'Senior Developer', avatar: null, role: 'EMPLOYEE' },
    notes: 'Fixed the SSO login issue by updating the token refresh logic.',
    status: 'APPROVED',
    review_notes: 'Great work! The fix is working correctly.',
    reviewed_by: { id: '2', email: 'jane@example.com', first_name: 'Jane', last_name: 'Smith', department: 'Engineering', designation: 'Tech Lead', avatar: null, role: 'EMPLOYEE' },
    submitted_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<WorkSubmission[]>(mockSubmissions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSubmission, setNewSubmission] = useState({
    task_id: '',
    notes: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!newSubmission.notes) return;
    setIsLoading(true);
    const submission: WorkSubmission = {
      id: Date.now().toString(),
      task: {
        id: newSubmission.task_id || '1',
        title: 'Sample Task',
        description: 'Task description',
        assigned_to: { id: '1', email: 'john@example.com', first_name: 'John', last_name: 'Doe', department: 'Engineering', designation: 'Senior Developer', avatar: null, role: 'EMPLOYEE' },
        created_by: { id: '2', email: 'jane@example.com', first_name: 'Jane', last_name: 'Smith', department: 'Engineering', designation: 'Tech Lead', avatar: null, role: 'EMPLOYEE' },
        status: 'REVIEW',
        priority: 'MEDIUM',
        progress_percentage: 100,
        deadline: new Date().toISOString(),
        comments: [],
        attachments: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      submitted_by: { id: '1', email: 'john@example.com', first_name: 'John', last_name: 'Doe', department: 'Engineering', designation: 'Senior Developer', avatar: null, role: 'EMPLOYEE' },
      notes: newSubmission.notes,
      status: 'PENDING_REVIEW',
      review_notes: null,
      reviewed_by: null,
      submitted_at: new Date().toISOString(),
    };
    setSubmissions((prev) => [submission, ...prev]);
    setNewSubmission({ task_id: '', notes: '' });
    setIsModalOpen(false);
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Work Submissions</h1>
          <p className="text-slate-400 mt-1">Submit and track your work</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Submit Work
        </Button>
      </div>

      <div className="grid gap-4">
        {submissions.map((submission) => (
          <Card key={submission.id} className="hover:border-slate-600 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    submission.status === 'APPROVED'
                      ? 'bg-green-500/20'
                      : submission.status === 'CHANGES_REQUESTED'
                      ? 'bg-orange-500/20'
                      : 'bg-blue-500/20'
                  }`}>
                    <FileText className={`w-5 h-5 ${
                      submission.status === 'APPROVED'
                        ? 'text-green-400'
                        : submission.status === 'CHANGES_REQUESTED'
                        ? 'text-orange-400'
                        : 'text-blue-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-100">{submission.task.title}</h3>
                      <Badge className={getStatusColor(submission.status)}>{submission.status.replace('_', ' ')}</Badge>
                    </div>
                    <p className="text-slate-400 mb-2">{submission.notes}</p>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span>Submitted {formatDate(submission.submitted_at)}</span>
                      {submission.reviewed_by && (
                        <span>Reviewed by {submission.reviewed_by.first_name} {submission.reviewed_by.last_name}</span>
                      )}
                    </div>
                    {submission.review_notes && (
                      <div className="mt-3 p-3 rounded-lg bg-slate-800/50">
                        <p className="text-sm text-slate-400">Feedback:</p>
                        <p className="text-slate-300">{submission.review_notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Submit Work"
        size="lg"
      >
        <div className="space-y-4">
          <Textarea
            label="Submission Notes"
            placeholder="Describe what you've completed..."
            rows={5}
            value={newSubmission.notes}
            onChange={(e) => setNewSubmission({ ...newSubmission, notes: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} isLoading={isLoading}>
              Submit
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}