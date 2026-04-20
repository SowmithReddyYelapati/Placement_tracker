import React, { useState } from 'react';
import {
  Settings, Moon, Sun, Bell, User, Shield, ChevronRight,
  Info, Database, MapPin, Key, Loader2, Save
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Toggle = ({ value, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!value)}
    className={`relative w-11 h-6 rounded-full transition-all duration-300 ${value ? 'bg-indigo-600' : 'bg-white/10'}`}
  >
    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${value ? 'left-5.5 left-[22px]' : 'left-0.5'}`} />
  </button>
);

const Section = ({ icon: Icon, title, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass-card p-6"
  >
    <div className="flex items-center gap-2.5 mb-5">
      <div className="w-8 h-8 rounded-xl bg-indigo-600/15 border border-indigo-500/20 flex items-center justify-center">
        <Icon size={16} className="text-indigo-400" />
      </div>
      <h2 className="text-sm font-bold text-white">{title}</h2>
    </div>
    <div className="space-y-1">{children}</div>
  </motion.div>
);

const Row = ({ label, desc, children }) => (
  <div className="flex items-center justify-between py-3.5 border-b border-white/5 last:border-0">
    <div>
      <p className="text-sm font-semibold text-white">{label}</p>
      {desc && <p className="text-xs text-slate-500 mt-0.5">{desc}</p>}
    </div>
    <div className="shrink-0 ml-4">{children}</div>
  </div>
);

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(true);
  const [deadlineAlerts, setDeadlineAlerts] = useState(true);
  const [loading, setLoading] = useState(false);
  const [streakReminders, setStreakReminders] = useState(true);
  const [reminderDays, setReminderDays] = useState(2);
  const [form, setForm] = useState({
    name: user?.name || '',
    password: ''
  });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (localStorage.getItem('placement_token') === 'demo-token') {
      return toast.error('Profile updates disabled in demo mode');
    }
    setLoading(true);
    try {
      await authAPI.updateProfile(form);
      toast.success('Profile updated successfully!');
      setForm(prev => ({ ...prev, password: '' }));
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-indigo-400 mb-1.5">
          <Settings size={15} />
          <span className="text-[10px] font-semibold uppercase tracking-widest">Settings</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Preferences</h1>
        <p className="text-slate-500 text-sm mt-1">Customize your PlaceTrack experience.</p>
      </div>

      {/* Profile */}
      <Section icon={User} title="Account Settings" delay={0}>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-white/4 rounded-2xl border border-white/8 mb-2">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-black text-xl shrink-0">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-white uppercase tracking-tight">{user?.name}</div>
              <div className="text-xs text-slate-500 mt-0.5 truncate">{user?.email}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Display Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-indigo-500 transition-all font-medium text-sm"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">New Password (optional)</label>
              <div className="relative">
                <Key size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-indigo-500 transition-all font-medium text-sm"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600/10 border border-indigo-600/20 text-indigo-400 font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-indigo-600/20 transition-all"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Update Profile
          </button>
        </form>
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
          <select
            value={reminderDays}
            onChange={e => setReminderDays(Number(e.target.value))}
            className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-indigo-500 appearance-none cursor-pointer"
          >
            {[1, 2, 3, 5, 7].map(d => (
              <option key={d} value={d} className="bg-[#0d0d1e]">{d} day{d > 1 ? 's' : ''} before</option>
            ))}
          </select>
        </Row>
      </Section>

      {/* App Info */}
      <Section icon={Info} title="About PlaceTrack" delay={0.24}>
        <Row label="Version" desc="Current app version">
          <span className="text-xs font-bold text-slate-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">v1.0.0</span>
        </Row>
        <Row label="Backend" desc="Data storage">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Database size={12} className="text-emerald-400" />
            <span className="font-medium">SQLite (local)</span>
          </div>
        </Row>
        <Row label="Your data" desc="All data is stored locally on this machine">
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
            <Shield size={12} />
            <span>100% Private</span>
          </div>
        </Row>
      </Section>

      {/* Save + Danger Zone */}
      <div className="flex flex-col gap-4">
        <motion.button
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.32 }}
          onClick={handleSave}
          className="btn-primary w-fit px-8 py-3 flex items-center gap-2"
        >
          <span className="font-semibold">Save Preferences</span>
          <ChevronRight size={16} />
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.36 }}
          className="glass-card p-5 border-red-500/15"
        >
          <h3 className="text-sm font-bold text-red-400 mb-1">Danger Zone</h3>
          <p className="text-xs text-slate-500 mb-4">These actions cannot be undone.</p>
          <button
            onClick={() => {
              if (window.confirm('Sign out of PlaceTrack?')) logout();
            }}
            className="px-5 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold rounded-xl hover:bg-red-500/20 transition-all"
          >
            Sign Out
          </button>
        </motion.div>
      </div>
    </div>
  );
}
