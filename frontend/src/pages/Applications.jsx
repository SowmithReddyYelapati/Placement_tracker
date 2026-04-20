import React, { useState, useEffect } from 'react';
import {
  Search, Plus, ExternalLink, Trash2, Edit2,
  LayoutGrid, Table2, Briefcase, Clock, AlertCircle,
  CheckCircle2, Circle, ChevronRight, Filter, Download
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { applicationAPI } from '../services/api';
import ApplicationModal from '../components/ApplicationModal';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const STATUS_PIPELINE = ['Applied', 'OA', 'Interview', 'Selected'];

const STATUS_STYLE = {
  Applied:  { bg: 'bg-blue-500/15',    text: 'text-blue-400',    border: 'border-blue-500/25',    dot: 'bg-blue-500' },
  OA:       { bg: 'bg-purple-500/15',  text: 'text-purple-400',  border: 'border-purple-500/25',  dot: 'bg-purple-500' },
  Interview:{ bg: 'bg-amber-500/15',   text: 'text-amber-400',   border: 'border-amber-500/25',   dot: 'bg-amber-500' },
  Rejected: { bg: 'bg-red-500/15',     text: 'text-red-400',     border: 'border-red-500/25',     dot: 'bg-red-500' },
  Selected: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/25', dot: 'bg-emerald-500' },
  Missed:   { bg: 'bg-slate-500/15',   text: 'text-slate-400',   border: 'border-slate-500/25',   dot: 'bg-slate-500' },
};

const PRIORITY_STYLE = {
  Dream:  { bg: 'bg-purple-500/10', text: 'text-purple-300', border: 'border-purple-500/20' },
  Medium: { bg: 'bg-white/5',       text: 'text-slate-400',  border: 'border-white/5' },
  Safe:   { bg: 'bg-emerald-500/10',text: 'text-emerald-300',border: 'border-emerald-500/20' },
};

const StatusBadge = ({ status }) => {
  const s = STATUS_STYLE[status] || STATUS_STYLE.Applied;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${s.bg} ${s.text} ${s.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${status === 'Applied' ? 'animate-pulse' : ''}`} />
      {status}
    </span>
  );
};

const StatusTimeline = ({ status }) => {
  const idx = STATUS_PIPELINE.indexOf(status);
  const isTerminal = status === 'Rejected' || status === 'Missed';
  return (
    <div className="flex items-end gap-1 mt-2">
      {STATUS_PIPELINE.map((step, i) => {
        const done = !isTerminal && i <= idx;
        const current = !isTerminal && i === idx;
        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center gap-0.5">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all
                ${done ? 'bg-indigo-500' : 'bg-white/8 border border-white/10'}
                ${current ? 'ring-2 ring-indigo-400/30 ring-offset-1 ring-offset-transparent' : ''}`}
              >
                {done && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              <span className={`text-[9px] font-medium ${done ? 'text-slate-500' : 'text-slate-700'}`}>
                {step === 'Interview' ? 'Intv' : step}
              </span>
            </div>
            {i < STATUS_PIPELINE.length - 1 && (
              <div className={`flex-1 h-px mb-3.5 rounded-full ${!isTerminal && i < idx ? 'bg-indigo-500' : 'bg-white/8'}`} />
            )}
          </React.Fragment>
        );
      })}
      {isTerminal && (
        <div className="flex items-center gap-1 ml-1 mb-3.5">
          <AlertCircle size={12} className={status === 'Rejected' ? 'text-red-400' : 'text-slate-500'} />
          <span className={`text-[9px] font-semibold ${status === 'Rejected' ? 'text-red-400' : 'text-slate-500'}`}>{status}</span>
        </div>
      )}
    </div>
  );
};

const deadlineInfo = (deadline) => {
  if (!deadline) return null;
  const diff = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
  if (diff < 0)  return { label: `${Math.abs(diff)}d overdue`, cls: 'text-red-400 font-semibold' };
  if (diff === 0) return { label: 'Due today!',     cls: 'text-red-400 font-bold animate-pulse' };
  if (diff === 1) return { label: 'Due tomorrow',   cls: 'text-amber-400 font-semibold' };
  if (diff <= 7)  return { label: `${diff}d left`,  cls: 'text-amber-400' };
  return { label: `${diff}d left`, cls: 'text-slate-500' };
};

const STATUSES = ['all', 'Applied', 'OA', 'Interview', 'Selected', 'Rejected', 'Missed'];

export default function Applications() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || 'all';

  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [sortBy, setSortBy] = useState('recent');
  const [view, setView] = useState('table');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editApp, setEditApp] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (sortBy === 'deadline') params.sortBy = 'deadline';
      const { data } = await applicationAPI.getAll(params);
      let result = data || [];
      if (search) {
        const s = search.toLowerCase();
        result = result.filter(a =>
          a.Company?.name?.toLowerCase().includes(s) ||
          a.role?.toLowerCase().includes(s)
        );
      }
      setApps(result);
    } catch {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [search, statusFilter, sortBy]);

  useEffect(() => {
    const s = searchParams.get('status');
    if (s && s !== statusFilter) setStatusFilter(s);
  }, [searchParams]);

  const exportToCSV = () => {
    if (!apps.length) return toast.error('No data to export');
    const headers = ['Company', 'Role', 'Status', 'Applied Date', 'Deadline', 'Priority', 'Link', 'Notes'];
    const rows = apps.map(a => [
      a.Company?.name || '',
      a.role || '',
      a.status || '',
      a.appliedDate || '',
      a.deadline || '',
      a.priority || '',
      a.jobLink || '',
      `"${(a.notes || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(',')).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `PlaceTrack_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Resume data exported to CSV');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    try {
      await applicationAPI.delete(id);
      toast.success('Deleted');
      load();
    } catch { toast.error('Delete failed'); }
  };

  const openEdit = (app) => { setEditApp(app); setIsModalOpen(true); };
  const openAdd  = ()    => { setEditApp(null); setIsModalOpen(true); };

  const skeletonRows = [...Array(4)].map((_, i) => (
    <tr key={i} className="animate-pulse border-b border-white/3">
      {[...Array(6)].map((_, j) => (
        <td key={j} className="px-6 py-5"><div className="h-4 bg-white/5 rounded-lg" /></td>
      ))}
    </tr>
  ));

  const empty = (
    <tr>
      <td colSpan="6" className="py-24 text-center">
        <div className="flex flex-col items-center gap-3 text-slate-600">
          <Briefcase size={44} className="opacity-20" />
          <p className="font-semibold text-sm">No applications found</p>
          <button onClick={openAdd} className="text-indigo-400 text-sm hover:text-indigo-300 transition-colors">
            + Add your first one
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 mb-1.5">
            <Briefcase size={15} />
            <span className="text-[10px] font-semibold uppercase tracking-widest">Applications</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Job Tracker</h1>
          <p className="text-slate-500 text-sm mt-1">
            {apps.length} application{apps.length !== 1 ? 's' : ''} tracked
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 text-sm font-semibold hover:bg-white/10 hover:text-white transition-all"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
          <button onClick={openAdd} className="btn-primary flex items-center gap-2">
            <Plus size={18} strokeWidth={2.5} />
            <span className="font-semibold">Add Application</span>
          </button>
        </div>
      </div>

      {/* Controls bar */}
      <div className="flex flex-wrap gap-2.5">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search company or role…"
            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:border-indigo-500 outline-none font-medium text-sm transition-all"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-300 outline-none focus:border-indigo-500 font-medium text-sm appearance-none cursor-pointer"
        >
          {STATUSES.map(s => (
            <option key={s} value={s} className="bg-[#0d0d1e]">{s === 'all' ? 'All Statuses' : s}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-300 outline-none focus:border-indigo-500 font-medium text-sm appearance-none cursor-pointer"
        >
          <option value="recent"   className="bg-[#0d0d1e]">Recently Applied</option>
          <option value="deadline" className="bg-[#0d0d1e]">Deadline ↑ (Soonest)</option>
        </select>

        {/* View toggle */}
        <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
          <button
            onClick={() => setView('table')}
            className={`p-2 rounded-lg transition-all ${view === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}
          >
            <Table2 size={15} />
          </button>
          <button
            onClick={() => setView('card')}
            className={`p-2 rounded-lg transition-all ${view === 'card' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}
          >
            <LayoutGrid size={15} />
          </button>
        </div>
      </div>

      {/* ── TABLE VIEW ── */}
      {view === 'table' && (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['Company / Role', 'Status & Timeline', 'Applied', 'Deadline', 'Resume', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-4 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/4">
                <AnimatePresence mode="popLayout">
                  {loading ? skeletonRows
                    : apps.length === 0 ? empty
                    : apps.map((app, i) => {
                      const dl = deadlineInfo(app.deadline);
                      const ps = PRIORITY_STYLE[app.priority] || PRIORITY_STYLE.Medium;
                      return (
                        <motion.tr
                          key={app.id}
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className="hover:bg-white/2 transition-colors group"
                        >
                          {/* Company / Role */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-sm shrink-0 group-hover:border-indigo-500/40 transition-all">
                                {app.Company?.name?.charAt(0) || '?'}
                              </div>
                              <div>
                                <div className="font-bold text-white text-sm leading-tight">{app.Company?.name || '—'}</div>
                                <div className="flex items-center gap-1.5 mt-1">
                                  <span className="text-xs text-slate-500">{app.role}</span>
                                  <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-semibold border ${ps.bg} ${ps.text} ${ps.border}`}>
                                    {app.priority}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          {/* Status */}
                          <td className="px-6 py-4">
                            <StatusBadge status={app.status} />
                            <StatusTimeline status={app.status} />
                          </td>
                          {/* Applied */}
                          <td className="px-6 py-4 text-sm text-slate-400 whitespace-nowrap">
                            {app.appliedDate
                              ? new Date(app.appliedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                              : '—'}
                          </td>
                          {/* Deadline */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            {app.deadline ? (
                              <div>
                                <div className="text-sm text-slate-400">
                                  {new Date(app.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                </div>
                                {dl && <div className={`text-xs mt-0.5 ${dl.cls}`}>{dl.label}</div>}
                              </div>
                            ) : <span className="text-slate-700 text-sm">—</span>}
                          </td>
                          {/* Resume */}
                          <td className="px-6 py-4">
                            <span className="text-xs text-slate-500">
                              {app.linkedResume?.title || '—'}
                            </span>
                          </td>
                          {/* Actions */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                              {app.jobLink && (
                                <a
                                  href={app.jobLink} target="_blank" rel="noopener noreferrer"
                                  className="p-2 bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                                >
                                  <ExternalLink size={13} />
                                </a>
                              )}
                              <button
                                onClick={() => openEdit(app)}
                                className="p-2 bg-white/5 border border-white/10 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-500/20 rounded-xl transition-all"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => handleDelete(app.id)}
                                className="p-2 bg-white/5 border border-white/10 text-slate-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 rounded-xl transition-all"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── CARD VIEW ── */}
      {view === 'card' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {loading
              ? [...Array(6)].map((_, i) => (
                  <div key={i} className="glass-card p-5 animate-pulse space-y-3">
                    <div className="h-4 bg-white/5 rounded w-3/4" />
                    <div className="h-3 bg-white/5 rounded w-1/2" />
                    <div className="h-8 bg-white/5 rounded" />
                  </div>
                ))
              : apps.length === 0
                ? (
                  <div className="col-span-full py-24 text-center">
                    <Briefcase size={44} className="mx-auto text-slate-700 mb-3" />
                    <p className="text-slate-500 font-semibold text-sm">No applications found</p>
                    <button onClick={openAdd} className="text-indigo-400 text-sm mt-2 hover:text-indigo-300">
                      + Add your first one
                    </button>
                  </div>
                )
                : apps.map((app, i) => {
                  const dl = deadlineInfo(app.deadline);
                  const ps = PRIORITY_STYLE[app.priority] || PRIORITY_STYLE.Medium;
                  return (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="glass-card p-5 flex flex-col gap-3.5 group"
                    >
                      {/* Top row */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-sm shrink-0">
                            {app.Company?.name?.charAt(0) || '?'}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-white text-sm leading-tight truncate">{app.Company?.name || '—'}</div>
                            <div className="text-xs text-slate-500 mt-0.5 truncate">{app.role}</div>
                          </div>
                        </div>
                        <StatusBadge status={app.status} />
                      </div>

                      {/* Priority tag */}
                      <span className={`w-fit px-2 py-0.5 rounded-full text-[10px] font-semibold border ${ps.bg} ${ps.text} ${ps.border}`}>
                        ★ {app.priority} Priority
                      </span>

                      {/* Timeline */}
                      <StatusTimeline status={app.status} />

                      {/* Dates */}
                      <div className="flex items-center justify-between text-xs border-t border-white/5 pt-3">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Clock size={11} />
                          <span>
                            {app.appliedDate
                              ? new Date(app.appliedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                              : '—'}
                          </span>
                        </div>
                        {dl
                          ? <span className={`font-semibold ${dl.cls}`}>{dl.label}</span>
                          : <span className="text-slate-700">No deadline</span>
                        }
                      </div>

                      {/* Notes */}
                      {app.notes && (
                        <p className="text-xs text-slate-600 italic truncate border-t border-white/5 pt-2.5">
                          "{app.notes}"
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all pt-1">
                        <button
                          onClick={() => openEdit(app)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white/5 border border-white/10 hover:bg-indigo-600/15 hover:border-indigo-500/30 text-slate-400 hover:text-indigo-400 rounded-xl transition-all text-xs font-medium"
                        >
                          <Edit2 size={12} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(app.id)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/20 text-slate-400 hover:text-red-400 rounded-xl transition-all text-xs font-medium"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                        {app.jobLink && (
                          <a
                            href={app.jobLink} target="_blank" rel="noopener noreferrer"
                            className="flex items-center justify-center p-2 bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                          >
                            <ExternalLink size={13} />
                          </a>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
          </AnimatePresence>
        </div>
      )}

      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditApp(null); }}
        onRefresh={load}
        editData={editApp}
      />
    </div>
  );
}
