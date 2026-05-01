import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { SectionCard } from '../components/ui/SectionCard'
import { MetricCard } from '../components/ui/MetricCard'
import { StatusBadge } from '../components/ui/StatusBadge'
import { dateLabel, dateTimeLabel } from '../lib/format'
import { 
  FileText, 
  Upload, 
  Download, 
  ChevronLeft, 
  UserPlus, 
  Trash2, 
  Calendar, 
  Activity,
  Image as ImageIcon,
  Video,
  FileArchive
} from 'lucide-react'
import type { User } from '../types'

export default function ProjectDetails({ token, user }: { token: string; user: User }) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const [project, setProject] = useState<any>(null)
  const [members, setMembers] = useState<any[]>([])
  const [files, setFiles] = useState<any[]>([])
  const [allEmployees, setAllEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  const fetchData = async () => {
    if (!id) return
    setLoading(true)
    try {
      const [proj, mems, filz, emps] = await Promise.all([
        api.getProjectById(id, token),
        api.getProjectEmployees(id, token),
        api.getProjectFiles(id, token),
        api.getAllEmployees(token)
      ])
      setProject(proj)
      setMembers(mems)
      setFiles(filz)
      setAllEmployees(emps.filter(e => !mems.some(m => m.id === e.id)))
    } catch (err) {
      console.error("Failed to fetch project details", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [id])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !id) return
    setUploading(true)
    try {
      const file = e.target.files[0]
      const type = file.type.startsWith('image/') ? 'images' : 
                   file.type.startsWith('video/') ? 'videos' : 
                   file.name.endsWith('.zip') ? 'zip' : 'documents'
      
      await api.uploadProjectFile(id, file, type, user.id, token)
      await fetchData()
    } catch (err) {
      console.error("Upload failed", err)
    } finally {
      setUploading(false)
    }
  }

  const handleAssign = async (employeeId: string) => {
    if (!id) return
    try {
      await api.assignEmployeeToProject(id, employeeId, token)
      await fetchData()
    } catch (err) {
      console.error("Assignment failed", err)
    }
  }

  if (loading) return <div className="p-12 text-center text-slate-500 animate-pulse font-bold">Loading Project Intelligence...</div>
  if (!project) return <div className="p-12 text-center text-rose-500 font-bold">Project Protocol Not Found.</div>

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{project.name}</h1>
          <p className="text-sm text-slate-500 font-medium">Project Command Center • ID: {project.id.split('-')[0]}</p>
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          metric={{
            id: 'proj-progress',
            label: 'Current Progress',
            value: `${project.progress}%`,
            delta: 'Project Velocity',
            tone: project.progress > 70 ? 'positive' : 'neutral',
          }}
        />
        <MetricCard
          metric={{
            id: 'proj-members',
            label: 'Members Assigned',
            value: members.length.toString(),
            delta: 'Active Workforce',
            tone: 'neutral',
          }}
        />
        <MetricCard
          metric={{
            id: 'proj-files',
            label: 'Files Secured',
            value: files.length.toString(),
            delta: 'Digital Assets',
            tone: 'neutral',
          }}
        />
        <MetricCard
          metric={{
            id: 'proj-status',
            label: 'Workflow Status',
            value: project.status,
            delta: 'Execution State',
            tone: project.status === 'Completed' ? 'positive' : 'warning',
          }}
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <SectionCard title="Project Intel" subtitle="Detailed objectives and timeline for this operation.">
            <div className="space-y-4">
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-3xl border border-slate-100">
                {project.description || "No tactical description provided."}
              </p>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-100">
                  <Calendar className="h-5 w-5 text-brand" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Start Date</p>
                    <p className="text-sm font-bold text-slate-900">{dateLabel(project.start_date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-100">
                  <Activity className="h-5 w-5 text-brand" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Est. Completion</p>
                    <p className="text-sm font-bold text-slate-900">{project.end_date ? dateLabel(project.end_date) : 'TBD'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                  <span>Project Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand transition-all duration-1000" 
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard 
            title="Secure Assets" 
            subtitle="Project documents, images, and technical specifications."
            action={
              <label className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-xl text-xs font-bold cursor-pointer hover:scale-105 transition shadow-lg shadow-brand/20">
                <Upload className="h-3.5 w-3.5" />
                {uploading ? 'Securing...' : 'Upload Asset'}
                <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
              </label>
            }
          >
            <div className="table-shell overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-bold">Asset</th>
                    <th className="px-6 py-4 font-bold">Category</th>
                    <th className="px-6 py-4 font-bold">Timestamp</th>
                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {files.map((file) => (
                    <tr key={file.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                            {file.file_type === 'images' ? <ImageIcon className="h-4 w-4" /> : 
                             file.file_type === 'videos' ? <Video className="h-4 w-4" /> :
                             file.file_type === 'zip' ? <FileArchive className="h-4 w-4" /> :
                             <FileText className="h-4 w-4" />}
                          </div>
                          <span className="font-bold text-slate-900">{file.file_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge label={file.file_type || 'Unknown'} />
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-medium">
                        {dateTimeLabel(file.uploaded_at)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition">
                          <Download className="h-4 w-4 text-brand" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {files.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium">No assets secured for this project.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard 
            title="Team Assignment" 
            subtitle={`${members.length} members working on this project.`}
          >
            <div className="space-y-4">
              <div className="grid gap-3">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 hover:border-brand/30 transition group">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-brand font-black text-xs">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 leading-tight">{member.name}</p>
                        <p className="text-[11px] font-bold text-slate-400 uppercase mt-0.5">{member.role}</p>
                      </div>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Assign New Member</p>
                <div className="grid gap-2">
                  {allEmployees.slice(0, 5).map((emp) => (
                    <button
                      key={emp.id}
                      onClick={() => handleAssign(emp.id)}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-brand/5 text-left transition group"
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 font-bold text-[10px]">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-700">{emp.name}</p>
                          <p className="text-[9px] text-slate-400 font-medium">{emp.role}</p>
                        </div>
                      </div>
                      <UserPlus className="h-4 w-4 text-slate-300 group-hover:text-brand" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  )
}
