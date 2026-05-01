import { useState } from 'react'
import { Folder, Upload, FileText, Search } from 'lucide-react'
import { SectionCard } from '../components/ui/SectionCard'
import type { PlatformData } from '../types'

export function DocumentationPage({ platform }: { platform: PlatformData }) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [uploadForm, setUploadForm] = useState({ documentName: '' })
  
  // Create a local state to hold documents so we can "upload" new ones
  const [employeeDocs, setEmployeeDocs] = useState<Record<string, string[]>>(() => {
    const docs: Record<string, string[]> = {}
    platform.employees.employees.forEach(emp => {
      docs[emp.id] = [...(emp.documents || [])]
    })
    return docs
  })

  const filteredEmployees = platform.employees.employees.filter(
    (e) => e.name.toLowerCase().includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase())
  )

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEmployeeId || !uploadForm.documentName.trim()) return
    
    setEmployeeDocs(prev => ({
      ...prev,
      [selectedEmployeeId]: [...(prev[selectedEmployeeId] || []), uploadForm.documentName]
    }))
    
    setUploadForm({ documentName: '' })
    // Optional: add a small alert/toast
    alert(`Document "${uploadForm.documentName}" uploaded successfully.`)
  }

  const selectedEmployee = platform.employees.employees.find(e => e.id === selectedEmployeeId)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">Employee Documentation</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Manage compliance documents, ID proofs, and contracts.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <SectionCard title="Employee Folders" subtitle="Select an employee to view or upload documents.">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or ID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 p-3 rounded-xl border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
          </div>
          <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
            {filteredEmployees.map((emp) => (
              <button
                key={emp.id}
                onClick={() => setSelectedEmployeeId(emp.id)}
                className={`flex items-center gap-3 p-3 rounded-xl transition ${selectedEmployeeId === emp.id ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
              >
                <Folder className={`h-5 w-5 ${selectedEmployeeId === emp.id ? 'text-white' : 'text-brand'}`} />
                <div className="text-left">
                  <p className="text-sm font-bold">{emp.name}</p>
                  <p className={`text-[10px] font-medium ${selectedEmployeeId === emp.id ? 'text-white/80' : 'text-slate-500'}`}>{emp.id} • {employeeDocs[emp.id]?.length || 0} files</p>
                </div>
              </button>
            ))}
          </div>
        </SectionCard>

        {selectedEmployee ? (
          <SectionCard title={`${selectedEmployee.name}'s Documents`} subtitle={`Department: ${selectedEmployee.department} | Role: ${selectedEmployee.title}`}>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 mb-6">
              {(employeeDocs[selectedEmployee.id] || []).map((doc, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-slate-200 bg-slate-50 dark:bg-slate-800 dark:border-slate-700">
                  <FileText className="h-8 w-8 text-brand" />
                  <p className="text-sm font-bold text-center text-slate-800 dark:text-white truncate w-full" title={doc}>{doc}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">PDF Document</p>
                </div>
              ))}
              {(employeeDocs[selectedEmployee.id]?.length === 0) && (
                <div className="col-span-full py-8 text-center text-slate-500 dark:text-slate-400">
                  No documents found for this employee.
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Upload New Document</h4>
              <form onSubmit={handleUpload} className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text" 
                  required
                  placeholder="Document Name (e.g. Identity Proof)" 
                  value={uploadForm.documentName}
                  onChange={(e) => setUploadForm({ documentName: e.target.value })}
                  className="flex-1 p-3 rounded-xl border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-brand"
                />
                <button type="submit" className="flex items-center justify-center gap-2 bg-brand text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition hover:scale-105 active:scale-95">
                  <Upload className="h-4 w-4" />
                  Submit Document
                </button>
              </form>
            </div>
          </SectionCard>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/50">
            <Folder className="h-12 w-12 text-slate-400 dark:text-slate-500 mb-4" />
            <p className="text-slate-600 dark:text-slate-400 font-medium">Select an employee folder to view details</p>
          </div>
        )}
      </div>
    </div>
  )
}
