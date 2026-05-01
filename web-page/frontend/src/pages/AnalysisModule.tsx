import React, { useState, useEffect } from 'react';
import { Terminal, FileText, Code2, BarChart3, Clock, AlertCircle } from 'lucide-react';

interface AnalysisRecord {
  id: string;
  title: string;
  developer: string;
  timeSpent: string;
  quality: string;
}

export default function AnalysisModule() {
  const [readme, setReadme] = useState('');
  const [records, setRecords] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('aurahr-token');
        const [readmeRes, recordsRes] = await Promise.all([
          fetch('/api/techlead/analysis/readme', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/techlead/analysis/records', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);
        
        const readmeData = await readmeRes.json();
        const recordsData = await recordsRes.json();
        
        setReadme(readmeData.content || '');
        setRecords(recordsData);
      } catch (error) {
        console.error('Failed to fetch Tech Lead data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-slate-500 dark:text-slate-400">Loading Tech Lead Analysis...</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Terminal className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            Engineering Command Sync
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time performance signals from the Tech Lead Analysis Engine.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* README Viewer */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              Latest Tech Lead Analysis (README.md)
            </h2>
          </div>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <pre className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 text-sm font-mono text-slate-600 dark:text-slate-400 overflow-x-auto h-[500px]">
              {readme || 'No analysis data available from the Tech Lead.'}
            </pre>
          </div>
        </div>

        {/* Stats & Activity */}
        <div className="space-y-6">
          <div className="bg-indigo-600 dark:bg-indigo-700 rounded-[32px] p-8 text-white shadow-lg shadow-indigo-200 dark:shadow-none">
            <BarChart3 className="h-8 w-8 mb-4 opacity-80" />
            <h3 className="text-lg font-semibold opacity-90">Analysis Signal</h3>
            <p className="text-4xl font-black mt-2">{records.length} Tasks Tracked</p>
            <div className="mt-6 flex items-center gap-2 text-sm font-medium bg-white/10 w-fit px-3 py-1 rounded-full">
               <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
               Live Connection to techlead-analysis/
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              Recent High Quality Tasks
            </h3>
            <div className="space-y-4">
              {records.filter(r => r.quality === 'High').slice(0, 4).map(record => (
                <div key={record.id} className="flex items-start gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Code2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{record.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{record.developer} • {record.timeSpent}</p>
                  </div>
                </div>
              ))}
              {records.filter(r => r.quality === 'High').length === 0 && (
                <p className="text-sm text-slate-400 italic">No high-quality signals recorded yet.</p>
              )}
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/20 rounded-[32px] border border-amber-100 dark:border-amber-900/30 p-8">
            <h3 className="text-lg font-bold text-amber-900 dark:text-amber-400 mb-2 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              HR Recommendation
            </h3>
            <p className="text-sm text-amber-800/80 dark:text-amber-300/80 leading-relaxed">
              Based on the latest Tech Lead analysis, the engineering velocity is stable. 
              Review the attrition risk mentioned in the README for potential intervention.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
