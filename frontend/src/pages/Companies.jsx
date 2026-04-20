import React, { useState, useEffect } from 'react';
import {
  Building2, Search, ExternalLink, MessageSquare,
  ChevronRight, MapPin, Globe, Loader2, Plus, Info
} from 'lucide-react';
import { companyAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await companyAPI.getAll();
      setCompanies(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const filtered = companies.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  const openCompany = async (id) => {
    toast.loading('Fetching details...', { id: 'comp-load' });
    try {
      const { data } = await companyAPI.getOne(id);
      setSelectedCompany(data);
      setIsModalOpen(true);
      toast.dismiss('comp-load');
    } catch {
      toast.error('Failed to load details', { id: 'comp-load' });
    }
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 mb-1.5">
            <Building2 size={15} />
            <span className="text-[10px] font-semibold uppercase tracking-widest">Company Research</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Recruiting Partners</h1>
          <p className="text-slate-500 text-sm mt-1">Companies you've engaged with. Store insights and experiences.</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search companies..."
          className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:border-indigo-500 outline-none font-medium transition-all"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 size={32} className="animate-spin text-indigo-500" />
          <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Loading partners...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {filtered.map((company, i) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => openCompany(company.id)}
                className="glass-card p-6 group cursor-pointer hover:border-indigo-500/30"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                    <Building2 size={24} />
                  </div>
                  <ChevronRight size={18} className="text-slate-700 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-lg font-black text-white group-hover:text-indigo-300 transition-colors uppercase tracking-tight">
                  {company.name}
                </h3>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 font-medium">
                  <div className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                    {company.type || 'Product'}
                  </div>
                  <span>•</span>
                  <span>{company.Applications?.length || 0} Apps</span>
                </div>
                
                {company.notes && (
                  <p className="text-xs text-slate-600 mt-4 line-clamp-2 italic">
                    "{company.notes}"
                  </p>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {!loading && filtered.length === 0 && (
            <div className="col-span-full py-24 text-center">
              <Building2 size={48} className="mx-auto text-slate-700 opacity-20 mb-4" />
              <p className="text-slate-500 font-semibold">No companies found</p>
              <p className="text-slate-700 text-xs mt-1">Start tracking applications to see companies here.</p>
            </div>
          )}
        </div>
      )}

      {/* Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedCompany && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-2xl relative z-10 max-h-[85vh] overflow-hidden flex flex-col"
            >
              <div className="p-7 border-b border-white/5 flex items-start gap-5">
                <div className="w-16 h-16 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center text-indigo-400 shrink-0">
                  <Building2 size={32} />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-black text-white">{selectedCompany.name}</h2>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">{selectedCompany.type}</span>
                    <span className="text-slate-700">•</span>
                    <div className="flex items-center gap-1 text-slate-500 text-xs font-semibold">
                      <MapPin size={12} /> Remote / Global
                    </div>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-500 hover:text-white transition-colors">
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>

              <div className="p-7 overflow-y-auto space-y-8">
                {/* Insights Section */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <MessageSquare size={16} className="text-indigo-400" />
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">Interview Insights</h3>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedCompany.notes || "No specific interview notes added for this company yet. Click 'Edit Application' to add insights from your experience."}
                    </p>
                  </div>
                </section>

                {/* Common Questions */}
                {selectedCompany.questionsAsked && (
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <Info size={16} className="text-purple-400" />
                      <h3 className="text-sm font-black text-white uppercase tracking-wider">Questions Asked</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {selectedCompany.questionsAsked.split('\n').map((q, i) => (
                        <div key={i} className="flex gap-3 p-3.5 bg-purple-500/5 border border-purple-500/10 rounded-xl text-slate-300 text-xs">
                          <span className="w-5 h-5 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0 font-bold">{i+1}</span>
                          {q}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Applications for this company */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Globe size={16} className="text-emerald-400" />
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">Application History</h3>
                  </div>
                  <div className="space-y-3">
                    {selectedCompany.Applications?.map((app, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-white/3 border border-white/5 rounded-2xl">
                        <div>
                          <div className="font-bold text-white text-sm">{app.role}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">Applied on {new Date(app.appliedDate).toLocaleDateString()}</div>
                        </div>
                        <div className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {app.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="p-7 border-t border-white/5 flex gap-3">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-full btn-primary py-3.5 flex items-center justify-center gap-2"
                >
                  <span className="font-bold">Close Details</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
