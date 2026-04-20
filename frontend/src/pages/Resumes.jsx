import React, { useState, useEffect } from 'react';
import { FileText, Trash2, ExternalLink, Plus, Tag, X, Loader2, Link as LinkIcon } from 'lucide-react';
import { resumeAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const TAG_PRESETS = [
  'SDE Resume', 'Data Analyst', 'Intern Resume', 'Full Stack',
  'Frontend', 'Backend', 'ML Engineer', 'Product Manager', 'DevOps'
];

const TAG_COLORS = [
  'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
  'bg-purple-500/10 text-purple-300 border-purple-500/20',
  'bg-blue-500/10 text-blue-300 border-blue-500/20',
  'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  'bg-amber-500/10 text-amber-300 border-amber-500/20',
];

export default function Resumes() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: '', fileUrl: '', tags: '' });

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await resumeAPI.getAll();
      setResumes(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Resume name is required'); return; }
    setSubmitting(true);
    try {
      await resumeAPI.create(form);
      toast.success('Resume saved!');
      setShowModal(false);
      setForm({ title: '', fileUrl: '', tags: '' });
      load();
    } catch {
      toast.error('Failed to save resume');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this resume?')) return;
    try {
      await resumeAPI.delete(id);
      toast.success('Resume removed');
      load();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const addTag = (tag) => {
    const existing = form.tags ? form.tags.split(',').map(t => t.trim()) : [];
    if (!existing.includes(tag)) {
      setForm(p => ({ ...p, tags: existing.length > 0 ? `${p.tags}, ${tag}` : tag }));
    }
  };

  const parseTags = (tags) => tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 mb-1.5">
            <FileText size={15} />
            <span className="text-[10px] font-semibold uppercase tracking-widest">Resume Manager</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">My Resumes</h1>
          <p className="text-slate-500 text-sm mt-1">Manage all your resume versions. Tag them for easy selection.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 shrink-0">
          <Plus size={18} strokeWidth={2.5} />
          <span className="font-semibold">Add Resume</span>
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={30} className="animate-spin text-indigo-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {resumes.map((resume, i) => {
              const tags = parseTags(resume.tags);
              return (
                <motion.div
                  key={resume.id}
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="glass-card p-6 group flex flex-col gap-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-600/20 transition-all duration-300">
                      <FileText size={22} />
                    </div>
                    <button
                      onClick={() => handleDelete(resume.id)}
                      className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div>
                    <h3 className="font-black text-white text-base leading-tight group-hover:text-indigo-300 transition-colors">
                      {resume.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">
                      Added {new Date(resume.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>

                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((tag, j) => (
                        <span
                          key={j}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${TAG_COLORS[j % TAG_COLORS.length]}`}
                        >
                          <Tag size={9} /> {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {resume.fileUrl ? (
                    <a
                      href={resume.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-slate-300 py-2.5 rounded-xl text-xs font-semibold hover:bg-indigo-600/15 hover:border-indigo-500/30 hover:text-indigo-300 transition-all"
                    >
                      <ExternalLink size={13} /> View Resume
                    </a>
                  ) : (
                    <div className="mt-auto py-2.5 rounded-xl bg-white/3 border border-white/5 text-center text-xs text-slate-700 font-medium">
                      No link provided
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {resumes.length === 0 && (
            <div className="col-span-full py-24 flex flex-col items-center gap-3 text-slate-600">
              <FileText size={48} className="opacity-15" />
              <p className="font-semibold text-sm">No resumes added yet</p>
              <button onClick={() => setShowModal(true)} className="text-indigo-400 text-sm hover:text-indigo-300 transition-colors">
                + Upload your first resume
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-md relative z-10"
            >
              <div className="px-7 py-5 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-lg font-black text-white">Add Resume</h2>
                <button onClick={() => setShowModal(false)} className="p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                  <X size={19} />
                </button>
              </div>

              <form onSubmit={handleAdd} className="p-7 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Resume Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:border-indigo-500 outline-none font-medium text-sm transition-all"
                    placeholder="e.g. SDE Resume v2, Intern Resume"
                    value={form.title}
                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Google Drive / Document URL
                  </label>
                  <div className="relative">
                    <LinkIcon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="url"
                      className="w-full pl-9 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:border-indigo-500 outline-none font-medium text-sm transition-all"
                      placeholder="https://drive.google.com/..."
                      value={form.fileUrl}
                      onChange={e => setForm(p => ({ ...p, fileUrl: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Tags</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:border-indigo-500 outline-none font-medium text-sm transition-all"
                    placeholder="SDE, Intern, Backend (comma-separated)"
                    value={form.tags}
                    onChange={e => setForm(p => ({ ...p, tags: e.target.value }))}
                  />
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {TAG_PRESETS.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => addTag(tag)}
                        className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-500 text-[10px] font-medium hover:bg-indigo-600/15 hover:border-indigo-500/30 hover:text-indigo-300 transition-all"
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 text-slate-500 font-semibold hover:text-white text-sm rounded-xl hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-[2] btn-primary py-3 flex items-center justify-center gap-2"
                  >
                    {submitting ? <Loader2 size={15} className="animate-spin" /> : null}
                    <span className="font-semibold">Save Resume</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
