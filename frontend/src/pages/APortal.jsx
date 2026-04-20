import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Search, MessageSquare, BookOpen, 
  Target, ChevronRight, Loader2, PlayCircle,
  Lightbulb, BrainCircuit, Globe
} from 'lucide-react';
import { analyticsAPI, applicationAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function AIPortal() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await applicationAPI.getAll();
        const unique = [...new Set(data.map(a => a.Company?.name))].filter(Boolean);
        setCompanies(unique);
      } catch (err) { console.error(err); }
    };
    load();
  }, []);

  const generatePrep = async () => {
    if (!selectedCompany) return toast.error('Pick a company first!');
    setLoading(true);
    try {
      // In a real app, this hits the AI generation endpoint
      // Our backend has a mock AI insights route
      const { data } = await analyticsAPI.getInsights();
      // Filter or simulate specifically for the company
      setInsights({
        company: selectedCompany,
        summary: `Strategic preparation guide for ${selectedCompany} based on current platform trends and reported interview patterns.`,
        tips: data.insights || [],
        questions: [
          `How would you scale ${selectedCompany}'s core architecture for 1B users?`,
          `Discuss a time you had to make a trade-off between speed and quality.`,
          `Implement a thread-safe singleton pattern suitable for ${selectedCompany}'s infrastructure.`
        ]
      });
      toast.success('Strategy generated!');
    } catch {
      toast.error('AI is a bit tired. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative rounded-[2rem] overflow-hidden bg-indigo-600 p-8 md:p-12">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider mb-6">
            <Sparkles size={12} />
            <span>AI Powered Intelligence</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
            Level Up Your <br />
            <span className="text-indigo-200">Interview Strategy.</span>
          </h1>
          <p className="text-indigo-100 mt-4 text-lg font-medium opacity-90">
            Generate customized interview preparation guides, mock questions, and strategic insights for any company in your pipeline.
          </p>
        </div>
        
        {/* Abstract background blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Selector Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-5 flex items-center gap-2">
              <BrainCircuit size={16} className="text-indigo-400" />
              Configure AI Prep
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Select Target Company</label>
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 appearance-none"
                  value={selectedCompany}
                  onChange={e => setSelectedCompany(e.target.value)}
                >
                  <option value="" className="bg-[#0f0f20]">Choose from your apps...</option>
                  {companies.map(c => <option key={c} value={c} className="bg-[#0f0f20]">{c}</option>)}
                  <option value="Google" className="bg-[#0f0f20]">Google (Expert Mode)</option>
                  <option value="Meta" className="bg-[#0f0f20]">Meta (Product Focus)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Preparation Deep-dive</label>
                <div className="grid grid-cols-2 gap-2">
                  <button className="px-3 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold border border-indigo-400">Standard</button>
                  <button className="px-3 py-2.5 bg-white/5 border border-white/10 text-slate-500 rounded-xl text-xs font-bold grayscale">Advanced (Pro)</button>
                </div>
              </div>

              <button 
                onClick={generatePrep}
                disabled={loading}
                className="w-full btn-primary mt-4 flex items-center justify-center gap-3 py-4"
              >
                {loading ? <Loader2 size={18} className="animate-spin text-white" /> : <Sparkles size={18} />}
                <span className="font-black uppercase tracking-wider text-sm">Generate Strategy</span>
              </button>
            </div>
          </div>

          <div className="glass-card p-6 bg-emerald-500/5 border-emerald-500/10">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Lightbulb size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Pro Tip</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The AI performs better when you provide specific notes in your application tracker first.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2">
          {!insights ? (
            <div className="h-full min-h-[400px] glass-card flex flex-col items-center justify-center p-12 text-center border-dashed border-white/10">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <BrainCircuit size={40} className="text-slate-700" />
              </div>
              <h3 className="text-lg font-bold text-slate-500 mb-2">Ready to Prep?</h3>
              <p className="text-sm text-slate-600 max-w-xs">
                Select a company to generate a comprehensive AI-driven interview roadmap.
              </p>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="glass-card p-8">
                <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-white mb-1 tracking-tight">{insights.company} Strategy Guide</h2>
                    <p className="text-slate-400 text-sm">{insights.summary}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all">
                      <Globe size={18} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <section className="space-y-4">
                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Target size={12} /> Strategic Tips
                    </h4>
                    <div className="space-y-3">
                      {insights.tips.map((tip, i) => (
                        <div key={i} className="flex gap-3 text-xs text-slate-300 font-medium leading-relaxed group">
                          <span className="w-1 h-1 rounded-full bg-indigo-500 mt-2 shrink-0 group-hover:scale-150 transition-transform" />
                          {tip}
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <MessageSquare size={12} /> Mock Questions
                    </h4>
                    <div className="space-y-3">
                      {insights.questions.map((q, i) => (
                        <div key={i} className="p-4 bg-white/3 border border-white/5 rounded-2xl text-xs text-slate-300 leading-relaxed hover:border-emerald-500/20 transition-all">
                          {q}
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
                
                <div className="mt-8 pt-8 border-t border-white/5">
                  <button className="flex items-center gap-3 text-indigo-400 text-sm font-bold hover:text-indigo-300 transition-colors">
                    <PlayCircle size={18} />
                    Start Mock Interview Session
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-card p-5 flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-600/10 rounded-xl flex items-center justify-center text-indigo-400">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Engineering Blog</h5>
                    <p className="text-[10px] text-slate-500">Latest from {insights.company} Engineering</p>
                  </div>
                  <ChevronRight size={14} className="ml-auto text-slate-700" />
                </div>
                <div className="glass-card p-5 flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-600/10 rounded-xl flex items-center justify-center text-purple-400">
                    <BrainCircuit size={20} />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">System Design</h5>
                    <p className="text-[10px] text-slate-500">Common architectures & trade-offs</p>
                  </div>
                  <ChevronRight size={14} className="ml-auto text-slate-700" />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
