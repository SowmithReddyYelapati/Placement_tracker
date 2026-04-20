import React, { useState, useEffect } from 'react';
import { X, Building2, Briefcase, Link as LinkIcon, FileText, ChevronRight, Calendar, Loader2, Zap } from 'lucide-react';
import { applicationAPI, resumeAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['Applied', 'OA', 'Interview', 'Selected', 'Rejected'];
const PRIORITY_OPTIONS = ['Dream', 'Medium', 'Safe'];

const Field = ({ label, children }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</label>
    {children}
  </div>
);

const inputCls = "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl !text-[var(--text-color)] placeholder:text-slate-500 focus:border-indigo-500 focus:bg-white/10 outline-none transition-all font-medium text-sm !border-[var(--border-color)]";
const selectCls = `${inputCls} appearance-none cursor-pointer`;

const ApplicationModal = ({ isOpen, onClose, onRefresh, editData = null }) => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '', role: '', jobLink: '', notes: '',
    status: 'Applied', priority: 'Medium',
    appliedDate: new Date().toISOString().split('T')[0],
    deadline: '', resumeId: ''
  });

  const set = (k, v) => setFormData(p => ({ ...p, [k]: v }));

  useEffect(() => {
    if (!isOpen) return;
    resumeAPI.getAll().then(r => setResumes(r.data || [])).catch(() => setResumes([]));
    if (editData) {
      setFormData({
        companyName: editData.Company?.name || '',
        role: editData.role || '',
        jobLink: editData.jobLink || '',
        notes: editData.notes || '',
        status: editData.status || 'Applied',
        priority: editData.priority || 'Medium',
        appliedDate: editData.appliedDate
          ? String(editData.appliedDate).split('T')[0]
          : new Date().toISOString().split('T')[0],
        deadline: editData.deadline ? String(editData.deadline).split('T')[0] : '',
        interviewDate: editData.interviewDate ? String(editData.interviewDate).split('T')[0] : '',
        resumeId: editData.linkedResume?.id || ''
      });
    } else {
      setFormData({
        companyName: '', role: '', jobLink: '', notes: '',
        status: 'Applied', priority: 'Medium',
        appliedDate: new Date().toISOString().split('T')[0],
        deadline: '', interviewDate: '', resumeId: ''
      });
    }
  }, [isOpen, editData]);

  const handleSubmit = async () => {
    if (!formData.companyName.trim() || !formData.role.trim()) {
      toast.error('Company name and role are required');
      return;
    }
    setLoading(true);
    try {
      if (editData) {
        await applicationAPI.update(editData.id, formData);
        toast.success('Application updated!');
      } else {
        await applicationAPI.create(formData);
        toast.success('Application added!');
      }
      onRefresh();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-start md:items-center p-4 pt-16 md:pt-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full max-w-2xl glass-card relative z-10 flex flex-col max-h-[88vh] !bg-[var(--panel-bg)] !border-[var(--border-color)] overflow-hidden"
          >
            {/* Top accent bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shrink-0" />

            {/* Header */}
            <div className="px-7 py-6 border-b border-white/5 flex items-center justify-between shrink-0 !border-[var(--border-color)]">
              <div>
                <div className="flex items-center gap-2 !text-[var(--accent-color)] mb-1">
                  <Zap size={14} className="animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                    {editData ? 'Neural Update' : 'New Link Established'}
                  </span>
                </div>
                <h2 className="text-xl font-black !text-[var(--text-color)] italic tracking-tight">
                  {editData ? 'Sync Application Parameters' : 'Register New Placement Target'}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2.5 hover:bg-white/5 rounded-xl text-slate-500 hover:!text-[var(--text-color)] transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="p-7 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
              {/* Row 1: Company + Role */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Company / Entity *">
                  <div className="relative group">
                    <Building2 size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:!text-[var(--accent-color)]" />
                    <input
                      className={`${inputCls} pl-10`}
                      placeholder="e.g. Google, Flipkart"
                      value={formData.companyName}
                      onChange={e => set('companyName', e.target.value)}
                    />
                  </div>
                </Field>
                <Field label="Role / Designation *">
                  <div className="relative group">
                    <Briefcase size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:!text-[var(--accent-color)]" />
                    <input
                      className={`${inputCls} pl-10`}
                      placeholder="e.g. SDE, Data Analyst"
                      value={formData.role}
                      onChange={e => set('role', e.target.value)}
                    />
                  </div>
                </Field>
              </div>

              {/* Row 2: Applied Date + Deadline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Transmission Date">
                  <div className="relative group">
                    <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-focus-within:!text-[var(--accent-color)]" />
                    <input
                      type="date"
                      className={`${inputCls} pl-10`}
                      style={{ colorScheme: document.documentElement.classList.contains('light') ? 'light' : 'dark' }}
                      value={formData.appliedDate}
                      onChange={e => set('appliedDate', e.target.value)}
                    />
                  </div>
                </Field>
                <Field label="Tactical Deadline">
                  <div className="relative group">
                    <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-red-500/70 pointer-events-none" />
                    <input
                      type="date"
                      className={`${inputCls} pl-10`}
                      style={{ colorScheme: document.documentElement.classList.contains('light') ? 'light' : 'dark' }}
                      value={formData.deadline}
                      onChange={e => set('deadline', e.target.value)}
                    />
                  </div>
                </Field>
              </div>

              {/* Row 3: Status + Priority + Resume */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Field label="Current Status">
                   <div className="relative group">
                    <select className={selectCls} value={formData.status} onChange={e => set('status', e.target.value)}>
                      {STATUS_OPTIONS.map(s => <option key={s} value={s} className="!bg-[var(--bg-color)]">{s}</option>)}
                    </select>
                   </div>
                </Field>
                <Field label="Strategic Priority">
                  <div className="flex gap-2">
                    {PRIORITY_OPTIONS.map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => set('priority', p)}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                          formData.priority === p 
                            ? (p === 'Dream' ? 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-600/30' : 
                               p === 'Medium' ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30' : 
                               'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-600/30')
                            : 'bg-white/5 border-white/5 !text-[var(--text-color)] opacity-50 hover:opacity-100 hover:bg-white/10'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="Asset Link (Resume)">
                  <select className={selectCls} value={formData.resumeId} onChange={e => set('resumeId', e.target.value)}>
                    <option value="" className="!bg-[var(--bg-color)]">No Link</option>
                    {resumes.map(r => (
                      <option key={r.id} value={r.id} className="!bg-[var(--bg-color)]">{r.title}</option>
                    ))}
                  </select>
                </Field>
              </div>

              {/* Job Link */}
              <Field label="External Intel (Job URL)">
                <div className="relative group">
                  <LinkIcon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:!text-[var(--accent-color)]" />
                  <input
                    type="url"
                    className={`${inputCls} pl-10`}
                    placeholder="https://company.com/jobs/..."
                    value={formData.jobLink}
                    onChange={e => set('jobLink', e.target.value)}
                  />
                </div>
              </Field>

              {/* Notes */}
              <Field label="Strategic Observation Notes">
                <div className="relative group">
                  <FileText size={14} className="absolute left-3.5 top-4 text-slate-500 group-focus-within:!text-[var(--accent-color)]" />
                  <textarea
                    maxLength={500}
                    className={`${inputCls} pl-10 h-28 resize-none leading-relaxed pt-3.5`}
                    placeholder="Key observations, referral details, or specific JD focus points..."
                    value={formData.notes}
                    onChange={e => set('notes', e.target.value)}
                  />
                </div>
              </Field>
            </div>

            {/* Footer */}
            <div className="px-7 py-6 border-t border-white/5 flex gap-4 shrink-0 !border-[var(--border-color)] bg-white/[0.02]">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 text-slate-500 font-black uppercase tracking-widest hover:!text-[var(--text-color)] hover:bg-white/5 rounded-xl transition-all text-[10px]"
              >
                Abort
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-[2] btn-primary flex items-center justify-center gap-3 py-4"
              >
                {loading
                  ? <><Loader2 size={18} className="animate-spin" /><span>Syncing...</span></>
                  : <><ChevronRight size={18} /><span>{editData ? 'Update Intel' : 'Initiate Tracking'}</span></>
                }
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ApplicationModal;
