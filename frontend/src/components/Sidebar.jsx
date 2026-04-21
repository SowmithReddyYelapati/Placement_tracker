import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  LineChart,
  LogOut,
  Settings,
  MapPin,
  Building2,
  Sparkles,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard, end: true },
  { name: 'Applications', path: '/applications', icon: Briefcase },
  { name: 'Companies', path: '/companies', icon: Building2 },
  { name: 'AI Prep', path: '/ai-prep', icon: Sparkles },
  { name: 'Resumes', path: '/resumes', icon: FileText },
  { name: 'Intelligence', path: '/analytics', icon: LineChart },
  { name: 'Settings', path: '/settings', icon: Settings },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();

  return (
    <aside className={`w-64 h-screen bg-[#070714]/90 backdrop-blur-2xl border-r border-white/5 flex flex-col fixed left-0 top-0 z-40 transition-all duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 !bg-[var(--panel-bg)] !border-[var(--border-color)]`}>
      {/* Logo */}
      <div className="p-5 border-b border-white/5 flex items-center justify-between !border-[var(--border-color)]">
        <div className="flex items-center gap-3 group/logo cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30 shrink-0 group-hover/logo:scale-110 transition-transform duration-500">
            <MapPin size={18} fill="white" className="text-white" strokeWidth={2.5} />
          </div>
          <div className="leading-none">
            <div className="!text-[var(--text-color)] font-black text-xl tracking-tighter group-hover/logo:translate-x-0.5 transition-transform">PlaceTrack</div>
            <div className="text-[9px] !text-[var(--accent-color)] font-black tracking-[0.2em] uppercase mt-1 opacity-70">Neural Intel</div>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="lg:hidden p-2 text-slate-500 hover:!text-[var(--text-color)]"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-3 opacity-60">Menu</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => { if (window.innerWidth < 1024) onClose(); }}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium组 ${
                  isActive
                    ? 'bg-indigo-600/15 !text-[var(--text-color)] border border-indigo-500/25'
                    : 'text-slate-500 hover:bg-white/5 hover:!text-[var(--text-color)] border border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} className={isActive ? '!text-[var(--accent-color)]' : 'group-hover:text-slate-400 transition-colors'} />
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t border-white/5 space-y-2 !border-[var(--border-color)]">
        {/* Status Indicator */}
        <div className="px-3 mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Neural Status</span>
            <div className="flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
               <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Live</span>
            </div>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
             <motion.div 
               animate={{ x: ['-100%', '100%'] }} 
               transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
               className="w-1/2 h-full bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" 
             />
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/5 mb-3">
            <div className="w-8 h-8 rounded-xl !bg-[var(--accent-color)] opacity-20 flex items-center justify-center text-indigo-400 font-black text-sm shrink-0" />
            <div className="absolute w-8 h-8 flex items-center justify-center !text-[var(--accent-color)] font-black text-sm pointer-events-none">
              {user.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold !text-[var(--text-color)] truncate">{user.name}</div>
              <div className="text-[10px] text-slate-500 truncate">{user.email}</div>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-2.5 text-slate-500 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all text-sm font-medium border border-transparent hover:border-red-500/20"
        >
          <LogOut size={17} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
