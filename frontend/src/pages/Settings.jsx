import React, { useState, useEffect } from 'react';
import {
  Settings, Moon, Sun, Bell, User, Shield, ChevronRight,
  Info, Database, MapPin, Key, Loader2, Save
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Toggle = ({ value, onChange }) => {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative w-12 h-6 rounded-full transition-all duration-300 flex items-center px-1 group outline-none focus:ring-2 focus:ring-indigo-500/40 ${value ? 'bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.4)]' : 'bg-slate-700/50 border border-white/10'}`}
    >
      <motion.div
        animate={{ 
          x: value ? 24 : 0,
          scale: value ? 1.05 : 1
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="w-4 h-4 rounded-full bg-white shadow-md"
      />
    </button>
  );
};

const Section = ({ icon: Icon, title, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    className="bg-[#0c0c1e]/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 shadow-[var(--card-shadow)] hover:border-indigo-500/20 transition-all group relative overflow-hidden !bg-[var(--panel-bg)] !border-[var(--border-color)]"
  >
    {/* Subtle Gradient Glow */}
    <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-indigo-500/15 transition-all duration-700" />
    
    <div className="flex items-center gap-4 mb-8">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center shadow-inner relative z-10 !border-[var(--border-color)]">
        <Icon size={22} className="!text-[var(--accent-color)] drop-shadow-[0_0_8px_rgba(165,180,252,0.4)]" />
      </div>
      <div>
        <h2 className="text-lg font-black !text-[var(--text-color)] tracking-tight uppercase tracking-[0.05em] italic">{title}</h2>
        <div className="h-1 w-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-1.5 opacity-60" />
      </div>
    </div>
    <div className="space-y-3 relative z-10 leading-relaxed">{children}</div>
  </motion.div>
);

const Row = ({ label, desc, children }) => (
  <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0 !border-[var(--border-color)]">
    <div className="flex-1">
      <p className="text-sm font-bold !text-[var(--text-color)]">{label}</p>
      {desc && <p className="text-xs text-slate-500 mt-1 font-medium opacity-80">{desc}</p>}
    </div>
    <div className="shrink-0 ml-4">{children}</div>
  </div>
);

export default function SettingsPage() {
  const { user, logout, updateUser } = useAuth();
  const [darkMode, setDarkMode] = useState(() => user?.darkMode ?? (localStorage.getItem('pt_dark_mode') !== 'false'));
  const [deadlineAlerts, setDeadlineAlerts] = useState(() => user?.deadlineAlerts ?? (localStorage.getItem('pt_deadline_alerts') !== 'false'));
  const [loading, setLoading] = useState(false);
  const [streakReminders, setStreakReminders] = useState(() => user?.streakReminders ?? (localStorage.getItem('pt_streak_reminders') !== 'false'));
  const [reminderDays, setReminderDays] = useState(() => user?.reminderDays ?? (Number(localStorage.getItem('pt_reminder_days')) || 2));
  const [form, setForm] = useState({
    name: user?.name || '',
    password: ''
  });
  const [hasChanges, setHasChanges] = useState(false);

  // Mark as having changes when any setting changes
  useEffect(() => {
    if (!user) return;
    const changed = 
      form.name !== (user.name || '') || 
      form.password !== '' ||
      darkMode !== (user.darkMode ?? true) ||
      deadlineAlerts !== (user.deadlineAlerts ?? true) ||
      streakReminders !== (user.streakReminders ?? true) ||
      reminderDays !== (user.reminderDays || 2);
    setHasChanges(changed);
  }, [form, darkMode, deadlineAlerts, streakReminders, reminderDays, user]);

  // Persist preferences & apply theme locally for instant feedback
  useEffect(() => {
    localStorage.setItem('pt_dark_mode', darkMode);
    localStorage.setItem('pt_deadline_alerts', deadlineAlerts);
    localStorage.setItem('pt_streak_reminders', streakReminders);
    localStorage.setItem('pt_reminder_days', reminderDays);
    
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode, deadlineAlerts, streakReminders, reminderDays]);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', password: '' });
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    
    const token = localStorage.getItem('placement_token');
    if (!token || token === 'demo-token') {
      return toast.error('Please log in with a real account to save preferences.');
    }

    setLoading(true);
    try {
      const { data } = await authAPI.updateProfile({
        ...form,
        darkMode,
        deadlineAlerts,
        streakReminders,
        reminderDays
      });
      
      updateUser(data.user);
      toast.success('Neural Preferences synchronized! 🧠');
      setForm(prev => ({ ...prev, password: '' }));
      setHasChanges(false);
      window.dispatchEvent(new Event('notifications-refetch'));
    } catch (err) {
      console.error('Settings Sync Error:', err);
      toast.error(err.response?.data?.message || 'Neural Sync failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-black !text-[var(--text-color)] tracking-tighter italic">Preferences</h1>
        <div className="flex items-center gap-4 mt-3 flex-wrap justify-center md:justify-start">
          <p className="text-slate-500 text-sm font-medium">Customize your PlaceTrack experience.</p>
          <div className="flex items-center gap-1.5 px-4 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full shadow-sm">
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
            <span className="text-[9px] font-black uppercase !text-[var(--accent-color)] tracking-[0.2em]">Neural Link v2.5 Online</span>
          </div>
        </div>
      </div>

      {/* Real-time Diagnostic Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="p-5 bg-white/5 border border-white/10 rounded-[1.5rem] !bg-[var(--panel-bg)] !border-[var(--border-color)] shadow-sm text-center">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 font-black">Design Node</p>
          <p className="text-xs font-black !text-[var(--text-color)] tracking-widest">{darkMode ? 'NEURAL DARK' : 'NEURAL LIGHT'}</p>
        </div>
        <div className="p-5 bg-white/5 border border-white/10 rounded-[1.5rem] !bg-[var(--panel-bg)] !border-[var(--border-color)] shadow-sm text-center">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 font-black">Lead Signal</p>
          <p className="text-xs font-black !text-[var(--text-color)] tracking-widest">{reminderDays} DAYS</p>
        </div>
        <div className="p-5 bg-white/5 border border-white/10 rounded-[1.5rem] !bg-[var(--panel-bg)] !border-[var(--border-color)] shadow-sm text-center">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 font-black">Alert Sync</p>
          <p className="text-xs font-black !text-[var(--accent-color)] tracking-widest">{deadlineAlerts ? 'ACTIVE' : 'MUTED'}</p>
        </div>
      </div>

      {/* Profile */}
      <Section icon={User} title="Account Settings" delay={0}>
        <div className="flex items-center gap-4 p-5 bg-white/5 rounded-[1.5rem] border border-white/10 mb-8 !bg-[var(--bg-color)] !border-[var(--border-color)]">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center !text-[var(--accent-color)] font-black text-2xl shrink-0 shadow-inner">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-black !text-[var(--text-color)] uppercase tracking-tighter text-lg">{user?.name}</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5 truncate opacity-70">{user?.email}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] pl-1">Display Name</label>
            <input
              type="text"
              className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl !text-[var(--text-color)] outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm !bg-[var(--bg-color)] !border-[var(--border-color)]"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] pl-1">Secure Protocol (Password)</label>
            <div className="relative group">
              <Key size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:!text-[var(--accent-color)]" />
              <input
                type="password"
                placeholder="UNMODIFIED"
                className="w-full pl-12 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl !text-[var(--text-color)] outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm !bg-[var(--bg-color)] !border-[var(--border-color)]"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Appearance */}
      <Section icon={Moon} title="Appearance" delay={0.08}>
        <Row
          label="Dark Mode"
          desc="Use the dark theme (recommended for late-night sessions 🌙)"
        >
          <Toggle value={darkMode} onChange={(v) => {
            setDarkMode(v);
            toast.success(v ? 'Dark mode enabled' : 'Switched to light mode');
          }} />
        </Row>
      </Section>

      {/* Reminders */}
      <Section icon={Bell} title="Reminders & Alerts" delay={0.16}>
        <Row
          label="Deadline Alerts"
          desc="Show banner alerts for upcoming application deadlines"
        >
          <Toggle value={deadlineAlerts} onChange={setDeadlineAlerts} />
        </Row>
        <Row
          label="Streak Reminders"
          desc="Remind me to keep my application streak alive"
        >
          <Toggle value={streakReminders} onChange={setStreakReminders} />
        </Row>
        <Row
          label="Alert Lead Time"
          desc="How many days before deadline to start showing alerts"
        >
          <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl">
            {[1, 2, 3, 5, 7].map(d => (
              <button
                key={d}
                onClick={() => {
                  setReminderDays(d);
                  toast.success(`Alert window set to ${d} days`);
                }}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all ${
                  reminderDays === d 
                    ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {d}D
              </button>
            ))}
          </div>
        </Row>
      </Section>

      {/* Neural System Info */}
      <Section icon={Shield} title="Neural Alert System" delay={0.24}>
        <div className="p-5 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 !bg-indigo-500/[0.03] !border-indigo-500/20">
          <p className="text-sm !text-[var(--text-color)] leading-relaxed font-medium opacity-80">
            The <span className="text-indigo-500 font-black">Neural Alert Engine</span> monitors your application deadlines in real-time. 
            When a deadline matches your lead time, it triggers pulse effects and dynamic countdowns across your dashboard.
          </p>
        </div>
      </Section>

      {/* Save + Danger Zone */}
      <div className="flex flex-col gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handleUpdateProfile}
          disabled={loading || !hasChanges}
          className={`btn-primary w-fit px-8 py-4 flex items-center gap-3 ${!hasChanges ? 'opacity-50 grayscale' : ''}`}
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          <span className="font-bold">
            {hasChanges ? 'Sync Neural Link' : 'Neural Link Up-to-date'}
          </span>
          <ChevronRight size={16} />
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.36 }}
          className="bg-red-500/5 border border-red-500/10 rounded-[2rem] p-8 mt-6 !border-red-500/20 !bg-red-500/[0.02]"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
            <h3 className="text-sm font-black text-red-500 uppercase tracking-[0.2em] italic">System Overrides</h3>
          </div>
          <p className="text-xs text-slate-500 mb-8 font-medium">Critical operations that bypass standard neural protocols.</p>
          <button
            onClick={() => {
              if (window.confirm('Sign out of PlaceTrack?')) logout();
            }}
            className="px-8 py-3.5 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
          >
            Terminate Session
          </button>
        </motion.div>
      </div>
    </div>
  );
}
