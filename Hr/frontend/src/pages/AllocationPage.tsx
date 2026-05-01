import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Layers, Plus, Calendar, Clock, User, Briefcase, 
  Monitor, CreditCard, HardDrive, Download, XCircle, 
  ClipboardList, Search 
} from 'lucide-react'
import { api } from '../api/client'
import { socket } from '../api/socket'
import { SectionCard } from '../components/ui/SectionCard'
import { StatusBadge } from '../components/ui/StatusBadge'
import type { PlatformData } from '../types'

interface AllocationPageProps {
  platform: PlatformData
  token: string
  onRefresh: () => void
}

export function AllocationPage({ platform, token, onRefresh }: AllocationPageProps) {
  const [activeTab, setActiveTab] = useState<'projects' | 'assets'>('projects')
  const [allocations, setAllocations] = useState<any[]>([])
  const [assets, setAssets] = useState<any[]>([])
  const [assetAllocations, setAssetAllocations] = useState<any[]>([])
  const [isAddingProject, setIsAddingProject] = useState(false)
  const [isAddingAsset, setIsAddingAsset] = useState(false)
  const [isAllocatingAsset, setIsAllocatingAsset] = useState(false)
  const [loading, setLoading] = useState(true)
  const [employeeSearch, setEmployeeSearch] = useState('')
  
  const [projectForm, setProjectForm] = useState({
    employeeId: '',
    projectId: 'proj-001',
    projectName: 'Aura Core Upgrade',
    hoursPerWeek: 40,
    role: 'Engineer',
    startDate: new Date().toISOString().split('T')[0],
  })

  const [assetForm, setAssetForm] = useState({
    name: '',
    type: 'Hardware',
    condition: 'New',
    status: 'Available'
  })

  const [assignForm, setAssignForm] = useState({
    assetId: '',
    employeeId: '',
    expectedDuration: '12 Months'
  })

  useEffect(() => {
    fetchData()

    const refresh = () => fetchData()
    socket.on('allocation_updated', refresh)
    socket.on('allocation_deleted', refresh)
    socket.on('asset_allocation_updated', refresh)
    socket.on('asset_allocation_revoked', refresh)

    return () => {
      socket.off('allocation_updated', refresh)
      socket.off('allocation_deleted', refresh)
      socket.off('asset_allocation_updated', refresh)
      socket.off('asset_allocation_revoked', refresh)
    }
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [proj, inv, alloc] = await Promise.all([
        api.getAllocations(token),
        api.getAssets(token),
        api.getAssetAllocations(token)
      ])
      setAllocations(proj)
      setAssets(inv)
      setAssetAllocations(alloc)
    } finally {
      setLoading(false)
    }
  }

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault()
    const employee = platform.employees.employees.find(emp => emp.id === projectForm.employeeId)
    if (!employee) return
    await api.createAllocation({ ...projectForm, employeeName: employee.name }, token)
    setIsAddingProject(false)
    onRefresh()
  }

  const handleAddAsset = async (e: React.FormEvent) => {
    e.preventDefault()
    await api.addAsset(assetForm, token)
    setIsAddingAsset(false)
    fetchData()
  }

  const handleAssignAsset = async (e: React.FormEvent) => {
    e.preventDefault()
    const employee = platform.employees.employees.find(emp => emp.id === assignForm.employeeId)
    const asset = assets.find(as => as.id === assignForm.assetId)
    if (!employee || !asset) return
    
    await api.allocateAsset({
      ...assignForm,
      assetName: asset.name,
      employeeName: employee.name
    }, token)
    setIsAllocatingAsset(false)
    fetchData()
  }

  const downloadReport = () => {
    const headers = ['ID', 'Asset', 'Employee', 'Allocated At', 'Duration', 'Status']
    const rows = assetAllocations.map(a => [
      a.id, a.assetName, a.employeeName, a.allocatedAt, a.expectedDuration, a.status
    ])
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n")
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `AuraHR_Asset_Report_${new Date().toLocaleDateString()}.csv`)
    document.body.appendChild(link)
    link.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">Resource Allocation</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Unified control for project assignments and physical company assets.</p>
        </div>
        <div className="flex gap-2">
          {activeTab === 'assets' && (
            <button
              onClick={downloadReport}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          )}
          <button
            onClick={() => activeTab === 'projects' ? setIsAddingProject(true) : setIsAddingAsset(true)}
            className="flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand/20 transition hover:scale-105 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            {activeTab === 'projects' ? 'Assign Talent' : 'Add Inventory'}
          </button>
        </div>
      </div>

      <div className="flex gap-1 rounded-2xl bg-slate-100 p-1 dark:bg-slate-800/50 w-fit">
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-6 py-2 text-sm font-bold rounded-xl transition ${activeTab === 'projects' ? 'bg-white text-brand shadow-sm dark:bg-slate-800 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
        >
          Project Assignments
        </button>
        <button
          onClick={() => setActiveTab('assets')}
          className={`px-6 py-2 text-sm font-bold rounded-xl transition ${activeTab === 'assets' ? 'bg-white text-brand shadow-sm dark:bg-slate-800 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
        >
          Asset Management
        </button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand border-t-transparent shadow-lg shadow-brand/20"></div>
        </div>
      ) : activeTab === 'projects' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {allocations.map((item) => (
              <motion.div
                key={item.id}
                layout
                className="glass-panel group relative overflow-hidden p-6 dark:border-slate-800 dark:bg-slate-900/50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                    <User className="h-6 w-6 text-slate-500" />
                  </div>
                  <StatusBadge label="Active" />
                </div>
                <div className="mt-4">
                  <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">{item.employeeName}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{item.role}</p>
                </div>
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <Briefcase className="h-4 w-4 text-slate-400" />
                    <span className="font-medium">{item.projectName}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span className="font-bold">{item.hoursPerWeek}h / week</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="space-y-6">
          <SectionCard title="Inventory Pipeline" subtitle="All company-owned hardware and identification assets.">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {assets.map(asset => (
                <div key={asset.id} className="p-4 border border-slate-100 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/50">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      {asset.type === 'Hardware' ? <Monitor className="h-4 w-4 text-slate-500" /> : <CreditCard className="h-4 w-4 text-slate-500" />}
                    </div>
                    <StatusBadge label={asset.status} />
                  </div>
                  <h4 className="mt-3 font-bold text-slate-900 dark:text-white text-sm">{asset.name}</h4>
                  <p className="text-[10px] uppercase font-bold text-slate-500 mt-1">{asset.type} • {asset.condition}</p>
                  {asset.status === 'Available' && (
                    <button 
                      onClick={() => {
                        setAssignForm(prev => ({ ...prev, assetId: asset.id }))
                        setIsAllocatingAsset(true)
                      }}
                      className="mt-4 w-full py-1.5 bg-slate-50 hover:bg-brand hover:text-white transition rounded-lg text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    >
                      Allocate
                    </button>
                  )}
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Active Asset Allocations" subtitle="Current hardware and tool distribution tracking.">
            <div className="table-shell overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-bold">Asset</th>
                    <th className="px-6 py-4 font-bold">Employee</th>
                    <th className="px-6 py-4 font-bold">Duration</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="px-6 py-4 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assetAllocations.map(alloc => (
                    <tr key={alloc.id} className="border-t border-slate-100 dark:border-slate-800">
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{alloc.assetName}</td>
                      <td className="px-6 py-4">{alloc.employeeName}</td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-500">{alloc.expectedDuration}</td>
                      <td className="px-6 py-4">
                        <StatusBadge label={alloc.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        {alloc.status === 'Active' && (
                          <button 
                            onClick={() => api.revokeAsset(alloc.id, token)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                            title="Revoke Resource"
                          >
                            <XCircle className="h-5 w-5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>
      )}

      {/* Add Project Allocation */}
      <AnimatePresence>
        {isAddingProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddingProject(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative z-50 w-full max-w-lg bg-white p-8 rounded-3xl shadow-2xl dark:bg-slate-900">
              <h3 className="text-xl font-bold flex items-center gap-2 dark:text-white">
                <ClipboardList className="h-5 w-5 text-brand" />
                New Project Assignment
              </h3>
              <form onSubmit={handleAddProject} className="mt-6 space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">Search Employee</label>
                  <div className="relative mt-2 mb-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search name, ID, or department..." 
                      value={employeeSearch}
                      onChange={e => setEmployeeSearch(e.target.value)}
                      className="w-full pl-10 p-3 rounded-xl border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-brand"
                    />
                  </div>
                  <select required value={projectForm.employeeId} onChange={e => setProjectForm({...projectForm, employeeId: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-white">
                    <option value="">Choose Employee</option>
                    {platform.employees.employees
                      .filter(e => e.name.toLowerCase().includes(employeeSearch.toLowerCase()) || e.id.toLowerCase().includes(employeeSearch.toLowerCase()) || e.department.toLowerCase().includes(employeeSearch.toLowerCase()))
                      .map(e => <option key={e.id} value={e.id}>{e.name} ({e.id}) - {e.department}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-500">Utilization (H/W)</label>
                    <input type="number" required value={projectForm.hoursPerWeek} onChange={e => setProjectForm({...projectForm, hoursPerWeek: Number(e.target.value)})} className="mt-2 w-full p-3 rounded-xl border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-500">Start Date</label>
                    <input type="date" required value={projectForm.startDate} onChange={e => setProjectForm({...projectForm, startDate: e.target.value})} className="mt-2 w-full p-3 rounded-xl border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="submit" className="flex-1 bg-brand text-white py-3 rounded-xl font-bold hover:shadow-lg transition">Create Allocation</button>
                  <button type="button" onClick={() => setIsAddingProject(false)} className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-200 transition dark:bg-slate-800 dark:text-slate-400">Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Add Asset Modal */}
        {isAddingAsset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddingAsset(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative z-50 w-full max-w-lg bg-white p-8 rounded-3xl shadow-2xl dark:bg-slate-900">
              <h3 className="text-xl font-bold flex items-center gap-2 dark:text-white">
                <HardDrive className="h-5 w-5 text-brand" />
                New Inventory Item
              </h3>
              <form onSubmit={handleAddAsset} className="mt-6 space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">Item Name</label>
                  <input type="text" required value={assetForm.name} onChange={e => setAssetForm({...assetForm, name: e.target.value})} className="mt-2 w-full p-3 rounded-xl border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-white" placeholder="Laptop Model / ID Serial" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-500">Asset Type</label>
                    <select value={assetForm.type} onChange={e => setAssetForm({...assetForm, type: e.target.value as any})} className="mt-2 w-full p-3 rounded-xl border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-white">
                      <option value="Hardware">Hardware</option>
                      <option value="Identification">Identification</option>
                      <option value="Peripheral">Peripheral</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-500">Condition</label>
                    <select value={assetForm.condition} onChange={e => setAssetForm({...assetForm, condition: e.target.value as any})} className="mt-2 w-full p-3 rounded-xl border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-white">
                      <option value="New">New</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Poor">Poor</option>
                    </select>
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="submit" className="flex-1 bg-brand text-white py-3 rounded-xl font-bold hover:shadow-lg transition">Add to System</button>
                  <button type="button" onClick={() => setIsAddingAsset(false)} className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-200 transition dark:bg-slate-800 dark:text-slate-400">Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Allocate Asset Modal */}
        {isAllocatingAsset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAllocatingAsset(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative z-50 w-full max-w-lg bg-white p-8 rounded-3xl shadow-2xl dark:bg-slate-900">
              <h3 className="text-xl font-bold flex items-center gap-2 dark:text-white">
                <User className="h-5 w-5 text-brand" />
                Assign Resource to Employee
              </h3>
              <form onSubmit={handleAssignAsset} className="mt-6 space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">Search Employee</label>
                  <div className="relative mt-2 mb-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search name, ID, or department..." 
                      value={employeeSearch}
                      onChange={e => setEmployeeSearch(e.target.value)}
                      className="w-full pl-10 p-3 rounded-xl border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-brand"
                    />
                  </div>
                  <select required value={assignForm.employeeId} onChange={e => setAssignForm({...assignForm, employeeId: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-white">
                    <option value="">Choose Employee</option>
                    {platform.employees.employees
                      .filter(e => e.name.toLowerCase().includes(employeeSearch.toLowerCase()) || e.id.toLowerCase().includes(employeeSearch.toLowerCase()) || e.department.toLowerCase().includes(employeeSearch.toLowerCase()))
                      .map(e => <option key={e.id} value={e.id}>{e.name} ({e.id}) - {e.department}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">Tenure / Expected Duration</label>
                  <input type="text" value={assignForm.expectedDuration} onChange={e => setAssignForm({...assignForm, expectedDuration: e.target.value})} className="mt-2 w-full p-3 rounded-xl border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-white" placeholder="e.g. 24 Months, Project Duration" />
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="submit" className="flex-1 bg-brand text-white py-3 rounded-xl font-bold hover:shadow-lg transition">Handover Asset</button>
                  <button type="button" onClick={() => setIsAllocatingAsset(false)} className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-200 transition dark:bg-slate-800 dark:text-slate-400">Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
