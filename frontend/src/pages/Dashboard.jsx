import React, { useState, useEffect, useRef } from 'react';
import {
  Plus, TrendingUp, Users, Target, Briefcase, Zap, Activity,
  Flame, Calendar, AlertCircle, Clock, ChevronRight, Sparkles
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Link } from 'react-router-dom';
import { analyticsAPI, applicationAPI } from '../services/api';
import ApplicationModal from '../components/ApplicationModal';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [weekly, setWeekly] = useState([]);
  const [deadlines, setDeadlines] = useState({ today: [], tomorrow: [], missed: [] });
  const [streak, setStreak] = useState(0);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const alertedRef = useRef(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [sRes, wRes, dRes, strRes, appsRes] = await Promise.allSettled([
        analyticsAPI.getStats(),
        analyticsAPI.getWeeklyActivity(),
        analyticsAPI.getDeadlineAlerts(),
        analyticsAPI.getStreakData(),
        applicationAPI.getAll()
      ]);
      if (sRes.status === 'fulfilled') setStats(sRes.value.data);
      if (wRes.status === 'fulfilled') setWeekly(wRes.value.data || []);
      if (dRes.status === 'fulfilled') setDeadlines(dRes.value.data || { today: [], tomorrow: [], missed: [] });
      if (strRes.status === 'fulfilled') setStreak(strRes.value.data?.streak || 0);
      if (appsRes.status === 'fulfilled') {
        const upcoming = appsRes.value.data
          .filter(a => a.interviewDate && new Date(a.interviewDate) >= new Date().setHours(0,0,0,0))
          .sort((a,b) => new Date(a.interviewDate) - new Date(b.interviewDate))
          .slice(0, 3);
        setInterviews(upcoming);
      }
    } catch (err) {
      console.error('Dashboard fetch error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  useEffect(() => {
    if (loading || alertedRef.current) return;
    alertedRef.current = true;
    if (deadlines.today?.length > 0) {
      toast(`🔥 ${deadlines.today.length} deadline(s) DUE TODAY!`, {
        duration: 6000, icon: '⏰'
      });
    }
    if (deadlines.missed?.length > 0) {
      toast.error(`${deadlines.missed.length} missed deadline(s) auto-marked`, { duration: 5000 });
    }
  }, [loading, deadlines]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      <span className="text-slate-500 font-semibold text-xs uppercase tracking-widest">Loading...</span>
    </div>
  );

  const m = stats?.metrics || {};
  const metricCards = [
    { label: 'Total Applied', value: m.totalApplications ?? 0, icon: Briefcase, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', link: '/applications?status=all' },
    { label: 'Interviews', value: m.interviewCount ?? 0, icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', link: '/applications?status=Interview' },
    { label: 'Offers', value: m.offerCount ?? 0, icon: Target, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', link: '/applications?status=Selected' },
    { label: 'Rejected', value: m.rejectedCount ?? 0, icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', link: '/applications?status=Rejected' },
  ];

  const dlCards = [
    {
      label: 'Deadlines Today',
      items: deadlines.today,
      count: deadlines.today?.length ?? 0,
      emptyColor: 'text-slate-600',
      activeColor: 'text-red-400',
      dot: 'bg-red-500',
      glow: deadlines.today?.length > 0 ? 'border-red-500/30 bg-red-500/3' : ''
    },
    {
      label: 'Deadlines Tomorrow',
      items: deadlines.tomorrow,
      count: deadlines.tomorrow?.length ?? 0,
      emptyColor: 'text-slate-600',
      activeColor: 'text-amber-400',
      dot: 'bg-amber-500',
      glow: deadlines.tomorrow?.length > 0 ? 'border-amber-500/30 bg-amber-500/3' : ''
    },
    {
      label: 'Missed Deadlines',
      items: deadlines.missed,
      count: deadlines.missed?.length ?? 0,
      emptyColor: 'text-slate-600',
      activeColor: 'text-slate-400',
      dot: 'bg-slate-500',
      glow: ''
    },
  ];

  const statusColors = {
    Applied: 'bg-blue-500', OA: 'bg-purple-500', Interview: 'bg-amber-500',
    Rejected: 'bg-red-500', Selected: 'bg-emerald-500', Missed: 'bg-slate-500'
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-2 text-indigo-400 mb-2">
            <Activity size={15} />
            <span className="text-[10px] font-semibold uppercase tracking-widest">Overview</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black !text-[var(--text-color)] tracking-tight">
            Welcome back! 👋
          </h1>
          <p className="text-slate-500 mt-1.5 text-sm font-medium">
            Track your placement journey, one application at a time.
          </p>
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2 shrink-0"
        >
          <Plus size={19} strokeWidth={2.5} />
          <span className="font-semibold">Add Application</span>
        </motion.button>
      </div>

      {/* Streak Banner */}
      {streak > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 bg-gradient-to-r from-orange-500/10 to-amber-500/5 border border-orange-500/20 rounded-2xl px-5 py-3.5"
        >
          <Flame size={22} className="text-orange-400 shrink-0" />
          <div>
            <span className="font-black !text-[var(--text-color)]">{streak}-Day Streak! </span>
            <span className="text-slate-500 text-sm font-medium">
              You've applied consistently for {streak} day{streak > 1 ? 's' : ''}. Keep it up! 🔥
            </span>
          </div>
        </motion.div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((c, i) => {
          const Icon = c.icon;
          return (
            <Link 
              key={i} 
              to={c.link}
              className="block"
            >
              <motion.div
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="bento-card relative overflow-hidden group h-full"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide group-hover:text-indigo-400 transition-colors uppercase tracking-widest">{c.label}</span>
                  <div className={`${c.color} ${c.bg} p-2 rounded-xl border ${c.border} group-hover:scale-110 transition-transform`}>
                    <Icon size={17} />
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-black !text-[var(--text-color)] group-hover:translate-x-1 transition-transform">{c.value}</div>
                <div className="mt-2 text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">View all →</div>
                <div className={`absolute -bottom-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-15 ${c.bg} group-hover:opacity-25 transition-opacity`} />
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Deadline Alert Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dlCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.07 }}
            className={`glass-card p-5 ${card.glow}`}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-2 h-2 rounded-full ${card.count > 0 ? card.dot + (i === 0 ? ' animate-pulse' : '') : 'bg-slate-700'}`} />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{card.label}</span>
            </div>
            {card.count === 0 ? (
              <p className="text-2xl font-black text-slate-700">0</p>
            ) : (
              <>
                <p className={`text-3xl font-black ${card.activeColor}`}>{card.count}</p>
                <div className="mt-2.5 space-y-1.5">
                  {card.items.slice(0, 2).map((d, j) => (
                    <div key={j} className="flex items-center gap-1.5">
                      <AlertCircle size={11} className="text-slate-600 shrink-0" />
                      <p className="text-xs text-slate-400 truncate">{d.company} — {d.role}</p>
                    </div>
                  ))}
                  {card.count > 2 && (
                    <p className="text-xs text-slate-600">+{card.count - 2} more</p>
                  )}
                </div>
              </>
            )}
          </motion.div>
        ))}
      </div>

      {/* Activity & Pipeline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity (Left 2/3) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 bento-card flex flex-col"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-black text-white text-base">Weekly Momentum</h3>
              <p className="text-slate-500 text-xs mt-0.5">Application frequency this week</p>
            </div>
            <Activity size={18} className="text-indigo-500" />
          </div>
          
          <div className="flex-1 h-[300px]">
            {weekly.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekly} barGap={8}>
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                      <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 700 }} />
                  <YAxis axisLine={false} tickLine={false} allowDecimals={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 700 }} />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 10 }}
                    contentStyle={{ background: '#0a0a1c', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 50px rgba(0,0,0,0.4)', padding: '12px' }}
                    itemStyle={{ color: '#818cf8', fontSize: '12px', fontWeight: 700 }}
                    labelStyle={{ color: '#475569', fontSize: '10px', fontWeight: 800, marginBottom: '4px', textTransform: 'uppercase' }}
                  />
                  <Bar dataKey="count" fill="url(#barGrad)" radius={[10, 10, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-3 opacity-20">
                <TrendingUp size={40} />
                <p className="text-[10px] font-black uppercase tracking-widest">No activity detected</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Status Breakdown & Interviews (Right 1/3) */}
        <div className="flex flex-col gap-6">
          {/* Upcoming Interviews widget */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="bento-card"
          >
            <div className="flex items-center justify-between mb-5">
              <h4 className="text-xs font-black text-white uppercase tracking-widest">Interviews</h4>
              <Sparkles size={14} className="text-purple-400" />
            </div>
            <div className="space-y-3">
              {interviews.length > 0 ? interviews.map((int, i) => (
                <div key={i} className="p-3 bg-white/3 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-purple-500/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 text-[10px] font-black">
                      {int.Company?.name?.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">{int.Company?.name}</div>
                      <div className="text-[10px] text-slate-500">{int.role}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-purple-400">{new Date(int.interviewDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}</div>
                  </div>
                </div>
              )) : (
                <div className="py-6 text-center text-slate-800 text-[10px] font-black uppercase tracking-widest italic opacity-30">No sessions</div>
              )}
            </div>
            <Link to="/ai-prep" className="w-full mt-4 flex items-center justify-center gap-2 py-2 bg-purple-600/10 border border-purple-500/20 rounded-xl text-[9px] font-black text-purple-400 uppercase tracking-[0.15em] hover:bg-purple-600/20 transition-all">
              Launch AI Prep
            </Link>
          </motion.div>

          {/* Pipeline Breakdown widget */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="bento-card flex-1"
          >
            <div className="flex items-center justify-between mb-5">
              <h4 className="text-xs font-black text-white uppercase tracking-widest">Pipeline</h4>
              <TrendingUp size={14} className="text-indigo-400" />
            </div>
            <div className="space-y-4">
              {stats?.statusDistribution?.length > 0 ? (
                stats.statusDistribution.map((item, i) => {
                  const total = stats?.metrics?.totalApplications || 1;
                  const pct = Math.round((item.count / total) * 100);
                  const color = statusColors[item.status] || 'bg-slate-500';
                  return (
                    <div key={i}>
                      <div className="flex justify-between items-center mb-1.5 px-0.5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.status}</span>
                        <span className="text-xs font-black text-white">{item.count}</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.3 + i * 0.05, duration: 0.6 }}
                          className={`h-full ${color} rounded-full`}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-slate-800 text-[10px] font-black uppercase tracking-widest italic opacity-30">Empty Pipe</div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRefresh={fetchAll}
      />
    </div>
  );
};

export default Dashboard;
