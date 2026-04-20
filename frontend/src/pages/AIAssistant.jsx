import React, { useState } from 'react';
import { Sparkles, Brain, Search, Loader2, Target, Cpu, MessageSquare } from 'lucide-react';
import { aiAPI } from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const AIAssistant = () => {
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [tips, setTips] = useState(null);

  const handleGenerateTips = async (e) => {
    e.preventDefault();
    if (!companyName.trim()) return;
    
    setLoading(true);
    setTips(null);
    try {
      const { data } = await aiAPI.generateInsights(companyName);
      setTips(data);
      toast.success("Neural logic synchronized.");
    } catch (err) {
      console.error(err);
      toast.error("Deep link connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-indigo-500/20"
        >
          <Cpu size={14} className="animate-pulse" />
          Neural Processor Active
        </motion.div>
        <h1 className="text-5xl font-black text-white tracking-tighter italic">
          Interview <span className="text-indigo-500">Intelligence</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Inject target company data to generate tactical preparation strategies and behavioral models.
        </p>
      </div>

      <div className="glass-card p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] -z-10" />
        
        <form onSubmit={handleGenerateTips} className="relative max-w-3xl mx-auto">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={24} />
            <input 
              type="text" 
              placeholder="Inject Company Name (e.g. OpenAI, Palantir, Nvidia)"
              className="w-full pl-16 pr-44 py-6 rounded-3xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-lg font-bold shadow-2xl"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              disabled={loading}
            />
            <button 
              type="submit"
              disabled={loading || !companyName.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 btn-primary flex items-center gap-3 py-3"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span className="text-xs font-black uppercase tracking-widest">Processing</span>
                </>
              ) : (
                <>
                  <Brain size={20} />
                  <span className="text-xs font-black uppercase tracking-widest">Generate</span>
                </>
              )}
            </button>
          </div>
        </form>

        <AnimatePresence>
          {tips && !loading && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-20 space-y-12"
            >
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Target size={18} />
                  </div>
                  <h3 className="text-2xl font-black text-white italic tracking-tight">Strategic Insights: {tips.company}</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tips.insights.map((insight, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-all duration-300 relative overflow-hidden"
                    >
                      <div className="flex gap-4 relative z-10 text-slate-300">
                        <span className="shrink-0 w-8 h-8 rounded-2xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center text-xs font-black shadow-inner">
                          0{idx + 1}
                        </span>
                        <p className="font-medium text-sm leading-relaxed">{insight}</p>
                      </div>
                      <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition-colors" />
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-white/5">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                    <MessageSquare size={18} />
                  </div>
                  <h3 className="text-2xl font-black text-white italic tracking-tight">Behavioral Simulation Models</h3>
                </div>
                <div className="space-y-4">
                  {tips.mockQuestions.map((q, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + (idx * 0.1) }}
                      className="p-6 rounded-3xl bg-gradient-to-r from-white/5 to-transparent border border-white/5 text-slate-400 font-bold hover:text-white transition-colors cursor-pointer group"
                    >
                      <span className="text-indigo-500 font-black mr-4 text-xs tracking-widest uppercase">Query_0{idx + 1}</span> 
                      {q}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!tips && !loading && (
        <div className="flex flex-col items-center gap-4 text-slate-700">
          <Sparkles size={48} className="opacity-10" />
          <p className="font-black uppercase tracking-[0.4em] text-[10px]">Awaiting Signal Input</p>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
 Greenland
