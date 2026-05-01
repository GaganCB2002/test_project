import { useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { formatDate } from '@/lib/utils';
import { Download, File, FileText, Image, Search, Trash2, Upload } from 'lucide-react';
import { UploadedFile } from '@/types';

const demoUser = { id: '1', email: 'employee@xyz.com', first_name: 'Demo', last_name: 'Employee', department: 'Engineering', designation: 'Software Engineer', avatar: null, role: 'EMPLOYEE' as const };

const mockFiles: UploadedFile[] = [
  { id: '1', file: '/files/doc1.pdf', filename: 'project-proposal.pdf', file_type: 'application/pdf', size: 2456000, uploaded_by: demoUser, related_task: '1', created_at: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: '2', file: '/files/img1.png', filename: 'dashboard-screenshot.png', file_type: 'image/png', size: 856000, uploaded_by: demoUser, related_task: '1', created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: '3', file: '/files/doc2.docx', filename: 'meeting-notes.docx', file_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: 124000, uploaded_by: demoUser, related_task: null, created_at: new Date(Date.now() - 3600000 * 5).toISOString() },
];

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileIcon = (fileType: string) => {
  if (fileType.startsWith('image/')) return Image;
  if (fileType.includes('pdf') || fileType.includes('document')) return FileText;
  return File;
};

export default function FilesPage() {
  const [files, setFiles] = useState<UploadedFile[]>(mockFiles);
  const [isDragging, setIsDragging] = useState(false);
  const [query, setQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredFiles = useMemo(() => files.filter((file) => file.filename.toLowerCase().includes(query.toLowerCase())), [files, query]);
  const totalSize = useMemo(() => files.reduce((sum, file) => sum + file.size, 0), [files]);
  const imageCount = files.filter((file) => file.file_type.startsWith('image/')).length;

  const handleFiles = (newFiles: globalThis.File[]) => {
    const fileObjects: UploadedFile[] = newFiles.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      file: URL.createObjectURL(file),
      filename: file.name,
      file_type: file.type || 'application/octet-stream',
      size: file.size,
      uploaded_by: demoUser,
      related_task: null,
      created_at: new Date().toISOString(),
    }));
    setFiles((prev) => [...fileObjects, ...prev]);
  };

  const handleDelete = (id: string) => setFiles((prev) => prev.filter((file) => file.id !== id));

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Files</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950">Documents and work files</h1>
          <p className="mt-2 text-slate-500">Upload, organize, and access task-related files quickly.</p>
        </div>
        <Button onClick={() => fileInputRef.current?.click()} className="gap-2">
          <Upload className="h-4 w-4" /> Upload Files
        </Button>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'Total files', value: files.length, helper: 'Available in library', icon: FileText, tone: 'bg-teal-50 text-teal-700' },
          { label: 'Storage used', value: formatFileSize(totalSize), helper: 'Local demo storage', icon: Upload, tone: 'bg-sky-50 text-sky-700' },
          { label: 'Images', value: imageCount, helper: 'Screenshots and assets', icon: Image, tone: 'bg-indigo-50 text-indigo-700' },
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

      <div
        className={`rounded-2xl border-2 border-dashed p-8 text-center transition ${
          isDragging ? 'border-teal-400 bg-teal-50' : 'border-slate-200 bg-white hover:border-teal-200'
        }`}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          handleFiles(Array.from(event.dataTransfer.files));
        }}
      >
        <input ref={fileInputRef} type="file" multiple className="hidden" onChange={(event) => event.target.files && handleFiles(Array.from(event.target.files))} />
        <div className="mx-auto flex max-w-md flex-col items-center gap-4">
          <div className="rounded-2xl bg-teal-50 p-4 text-teal-700">
            <Upload className="h-8 w-8" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-950">Drop files here or select from your device</p>
            <p className="mt-1 text-sm text-slate-500">Supports documents, screenshots, PDFs, and task evidence files.</p>
          </div>
          <Button onClick={() => fileInputRef.current?.click()} variant="secondary" className="gap-2">
            <Upload className="h-4 w-4" /> Select Files
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="grid gap-3 lg:grid-cols-[1fr_280px] lg:items-center">
            <div>
              <h2 className="font-semibold text-slate-950">File Library</h2>
              <p className="text-sm text-slate-500">All uploaded files and task attachments</p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input placeholder="Search files..." value={query} onChange={(event) => setQuery(event.target.value)} className="pl-10" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredFiles.map((file) => {
              const FileIcon = getFileIcon(file.file_type);
              return (
                <div key={file.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:border-teal-100 hover:bg-white hover:shadow-md hover:shadow-slate-200/70">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-white p-3 text-slate-600 shadow-sm">
                      <FileIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-slate-950">{file.filename}</p>
                      <p className="text-sm text-slate-500">{formatFileSize(file.size)}</p>
                      <p className="mt-1 text-xs text-slate-400">{formatDate(file.created_at)}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <Badge>{file.related_task ? 'Task file' : 'General'}</Badge>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="gap-1"><Download className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" className="text-rose-500 hover:bg-rose-50 hover:text-rose-600" onClick={() => handleDelete(file.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
