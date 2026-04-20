import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  LineChart,
  LogOut,
  Settings,
  MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
    <aside className={`w-64 h-screen bg-[#070714]/90 backdrop-blur-2xl border-r border-white/5 flex flex-col fixed left-0 top-0 z-40 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
      {/* Logo */}
      <div className="p-5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/40 shrink-0">
            <MapPin size={17} fill="currentColor" className="text-white" />
          </div>
          <div className="leading-none">
            <div className="text-white font-black text-lg tracking-tight">PlaceTrack</div>
            <div className="text-[10px] text-indigo-400 font-semibold tracking-widest uppercase mt-0.5">Placement Tracker</div>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="lg:hidden p-2 text-slate-500 hover:text-white"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 text-[10px] font-semibold text-slate-600 uppercase tracking-widest mb-3">Menu</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => { if (window.innerWidth < 1024) onClose(); }}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium group ${
                  isActive
                    ? 'bg-indigo-600/15 text-white border border-indigo-500/25'
                    : 'text-slate-500 hover:bg-white/5 hover:text-slate-200 border border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} className={isActive ? 'text-indigo-400' : 'group-hover:text-slate-300 transition-colors'} />
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t border-white/5 space-y-2">
        {user && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-black text-sm shrink-0">
              {user.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">{user.name}</div>
              <div className="text-[10px] text-slate-600 truncate">{user.email}</div>
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
