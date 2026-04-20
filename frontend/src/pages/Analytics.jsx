import React, { useState, useEffect } from 'react';
import {
  BarChart2, TrendingUp, Target, Award, Briefcase, Users,
  Lightbulb, RefreshCw, Loader2
} from 'lucide-react';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { analyticsAPI } from '../services/api';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const PIE_COLORS = ['#6366f1', '#a78bfa', '#f59e0b', '#34d399', '#f87171', '#64748b'];

const MetricCard = ({ label, value, icon: Icon, color, bg, border, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    className="bento-card relative overflow-hidden"
  >
    <div className="flex justify-between items-start mb-4">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
      <div className={`${color} ${bg} p-2 rounded-xl border ${border}`}>
        <Icon size={17} />
      </div>
    </div>
    <div className="text-4xl font-black !text-[var(--text-color)]">{value}</div>
    <div className={`absolute -bottom-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-15 ${bg}`} />
  </motion.div>
);

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [weekly, setWeekly] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [insightLoading, setInsightLoading] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const [sRes, wRes, iRes] = await Promise.allSettled([
        analyticsAPI.getStats(),
        analyticsAPI.getWeeklyActivity(),
        analyticsAPI.getInsights(),
      ]);
      if (sRes.status === 'fulfilled') setStats(sRes.value.data);
      if (wRes.status === 'fulfilled') setWeekly(wRes.value.data || []);
      if (iRes.status === 'fulfilled') setInsights(iRes.value.data?.insights || []);
    } catch {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const refreshInsights = async () => {
    setInsightLoading(true);
    try {
      const { data } = await analyticsAPI.getInsights();
      setInsights(data?.insights || []);
      toast.success('Insights refreshed');
    } catch {
      toast.error('Failed to refresh');
    } finally {
      setInsightLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      <span className="text-slate-500 font-semibold text-xs uppercase tracking-widest">Loading analytics...</span>
    </div>
  );

  const m = stats?.metrics || {};
  const statusDist = stats?.statusDistribution || [];
  const roleDist = stats?.roleDistribution || [];

  const pieData = statusDist.map((item, i) => ({
    name: item.status,
    value: item.count,
    color: PIE_COLORS[i % PIE_COLORS.length]
  }));

  const metrics = [
    { label: 'Total Applied', value: m.totalApplications ?? 0, icon: Briefcase, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', delay: 0 },
    { label: 'Interviews', value: m.interviewCount ?? 0, icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', delay: 0.07 },
    { label: 'Offers', value: m.offerCount ?? 0, icon: Target, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', delay: 0.14 },
    { label: 'Success Rate', value: `${m.successRate ?? 0}%`, icon: Award, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', delay: 0.21 },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-2xl px-4 py-3 shadow-2xl backdrop-blur-3xl">
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{payload[0].name}</p>
        <p className="!text-[var(--text-color)] text-lg font-black">{payload[0].value}</p>
      </div>
    );
  };

  const CustomPieTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-2xl px-4 py-3 shadow-2xl backdrop-blur-3xl">
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-0.5">{payload[0].name}</p>
        <p className="!text-[var(--text-color)] text-base font-black">{payload[0].value} apps</p>
      </div>
    );
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-indigo-400 mb-1.5">
          <BarChart2 size={15} />
          <span className="text-[10px] font-semibold uppercase tracking-widest">Analytics</span>
        </div>
        <h1 className="text-3xl font-black !text-[var(--text-color)] tracking-tight">Your Insights</h1>
        <p className="text-slate-500 text-sm mt-1 font-medium opacity-80">A complete view of your placement performance.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((c, i) => <MetricCard key={i} {...c} />)}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Weekly Activity */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          className="lg:col-span-2 bento-card"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-black !text-[var(--text-color)] text-base">Weekly Applications</h3>
              <p className="text-slate-500 text-xs mt-0.5 font-medium opacity-80">Last 7 days activity</p>
            </div>
            <TrendingUp size={17} className="text-slate-600" />
          </div>
          <div className="h-[220px]">
            {weekly.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekly}>
                  <defs>
                    <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                      <stop offset="100%" stopColor="#818cf8" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-color)', fontSize: 11, opacity: 0.4 }} />
                  <YAxis axisLine={false} tickLine={false} allowDecimals={false} tick={{ fill: 'var(--text-color)', fontSize: 11, opacity: 0.4 }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.06)', radius: 8 }} />
                  <Bar dataKey="count" name="Applications" fill="url(#aGrad)" radius={[7, 7, 0, 0]} barSize={26} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-700 text-sm font-medium">No activity yet</div>
            )}
          </div>
        </motion.div>

        {/* Status Pie */}
        <motion.div
          initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
          className="bento-card"
        >
          <div className="mb-6">
            <h3 className="font-black text-white text-base">Status Split</h3>
            <p className="text-slate-500 text-xs mt-0.5">Where your apps stand</p>
          </div>
          {pieData.length > 0 ? (
            <>
              <div className="h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%" cy="50%"
                      innerRadius={45} outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {pieData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                      <span className="text-xs text-slate-400 font-medium">{item.name}</span>
                    </div>
                    <span className="text-xs font-black !text-[var(--text-color)]">{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-40 text-slate-700 text-sm font-medium">No data yet</div>
          )}
        </motion.div>
      </div>

      {/* Role Distribution */}
      {roleDist.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bento-card"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-black text-white text-base">Roles Applied</h3>
              <p className="text-slate-500 text-xs mt-0.5">Distribution across different roles</p>
            </div>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roleDist} layout="vertical">
                <defs>
                  <linearGradient id="rGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                    <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis type="number" axisLine={false} tickLine={false} allowDecimals={false} tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} />
                <YAxis type="category" dataKey="role" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} width={100} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.06)' }} />
                <Bar dataKey="count" name="Applications" fill="url(#rGrad)" radius={[0, 7, 7, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
        className="bento-card"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600/15 border border-purple-500/20 flex items-center justify-center">
              <Lightbulb size={15} className="text-purple-400" />
            </div>
            <div>
              <h3 className="font-black text-white text-base">Smart Insights</h3>
              <p className="text-slate-500 text-xs">Personalized tips & analysis</p>
            </div>
          </div>
          <button
            onClick={refreshInsights}
            disabled={insightLoading}
            className="flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 text-slate-400 hover:text-white text-xs font-medium rounded-xl hover:bg-white/10 transition-all"
          >
            <RefreshCw size={13} className={insightLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {insights.length > 0 ? insights.map((insight, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.07 }}
              className="flex items-start gap-3 p-4 bg-white/3 border border-white/5 rounded-2xl hover:border-indigo-500/20 hover:bg-indigo-600/5 transition-all"
            >
              <div className="w-6 h-6 rounded-lg bg-indigo-600/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-indigo-400 font-black text-xs">{i + 1}</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">{insight}</p>
            </motion.div>
          )) : (
            <div className="col-span-2 text-center py-8 text-slate-600 text-sm font-medium">
              Add some applications to generate insights
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
