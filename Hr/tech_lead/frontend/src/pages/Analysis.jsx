import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  BarChart3, 
  Code2,
  FileText
} from 'lucide-react';

export default function Analysis() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [readme, setReadme] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    developer: '',
    status: 'In Progress',
    timeSpent: '',
    quality: 'Medium'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [recRes, readmeRes] = await Promise.all([
        fetch('/api/techlead/analysis/records', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/techlead/analysis/readme', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      const recordsData = await recRes.json();
      const readmeData = await readmeRes.json();
      
      setRecords(recordsData);
      setReadme(readmeData.content || '');
    } catch (error) {
      console.error('Failed to fetch analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/techlead/analysis/records', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setFormData({ title: '', developer: '', status: 'In Progress', timeSpent: '', quality: 'Medium' });
        await fetchData();
      }
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Terminal className="h-8 w-8 text-indigo-600" />
            Engineering Analysis Engine
          </h1>
          <p className="text-slate-500 mt-1">Generate performance reports and sync with project README.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 mb-4">New Performance Entry</h2>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700">Task Title</label>
              <input 
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="mt-1 w-full rounded-xl border border-slate-200 p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g. Core API Hardening"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">Developer</label>
              <input 
                type="text"
                required
                value={formData.developer}
                onChange={e => setFormData({...formData, developer: e.target.value})}
                className="mt-1 w-full rounded-xl border border-slate-200 p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Developer Name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700">Status</label>
                <select 
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-3 outline-none"
                >
                  <option>In Progress</option>
                  <option>Done</option>
                  <option>Blocked</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700">Quality</label>
                <select 
                  value={formData.quality}
                  onChange={e => setFormData({...formData, quality: e.target.value})}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-3 outline-none"
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">Time Spent</label>
              <input 
                type="text"
                required
                value={formData.timeSpent}
                onChange={e => setFormData({...formData, timeSpent: e.target.value})}
                className="mt-1 w-full rounded-xl border border-slate-200 p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g. 12h"
              />
            </div>

            <button 
              disabled={submitting}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-indigo-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save className="h-5 w-5" />
              {submitting ? 'Syncing...' : 'Update Analysis & README'}
            </button>
          </form>
        </div>

        {/* Data/README Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="h-6 w-6 text-indigo-600" />
                Live Analysis (README.md)
              </h2>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full border border-emerald-100">
                Synced to Cloud
              </span>
            </div>
            <pre className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm font-mono text-slate-600 overflow-x-auto h-[400px]">
              {readme || 'No analysis data found.'}
            </pre>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-indigo-50 rounded-3xl p-6 border border-indigo-100">
               <div className="flex items-center gap-3 mb-2">
                 <BarChart3 className="h-6 w-6 text-indigo-600" />
                 <span className="text-sm font-bold text-indigo-900">Total Entries</span>
               </div>
               <p className="text-3xl font-black text-indigo-950">{records.length}</p>
            </div>
            <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100">
               <div className="flex items-center gap-3 mb-2">
                 <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                 <span className="text-sm font-bold text-emerald-900">High Quality Tasks</span>
               </div>
               <p className="text-3xl font-black text-emerald-950">
                 {records.filter(r => r.quality === 'High').length}
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
