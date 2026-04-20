import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import { analyticsAPI } from './services/api';
import { 
  LayoutDashboard, Bell, Clock, AlertCircle, CheckCircle2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Applications from './pages/Applications';
import Resumes from './pages/Resumes';
import Analytics from './pages/Analytics';
import Companies from './pages/Companies';
import AIPortal from './pages/APortal';
import Settings from './pages/Settings';
import Login from './pages/Login';
import AIChatBot from './components/AIChatBot';

const Layout = ({ children }) => {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState([]);
  const [isNotifOpen, setIsNotifOpen] = React.useState(false);

  React.useEffect(() => {
    if (!user) return;
    const isDark = user.darkMode !== false;
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [user?.darkMode]);

  React.useEffect(() => {
    if (!user) return;
    const fetchNotifs = async () => {
      try {
        const days = user.reminderDays || 2;
        const { data } = await analyticsAPI.getDeadlineAlerts(days);
        const combined = [
          ...data.today.map(n => ({ ...n, type: 'today', color: 'text-red-400', label: 'Due Today' })),
          ...data.tomorrow.map(n => ({ ...n, type: 'tomorrow', color: 'text-amber-400', label: 'Due Tomorrow' })),
          ...(data.soon || []).map(n => ({ ...n, type: 'soon', color: 'text-indigo-400', label: 'Due Soon' }))
        ];
        setNotifications(combined);
      } catch (err) { console.error('Failed to fetch notifs', err); }
    };
    fetchNotifs();
    window.addEventListener('notifications-refetch', fetchNotifs);
    const interval = setInterval(fetchNotifs, 1000 * 60 * 5); // 5 mins
    return () => {
      clearInterval(interval);
      window.removeEventListener('notifications-refetch', fetchNotifs);
    };
  }, [user, user?.reminderDays]);

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen text-slate-200">
      <div className="bg-neural" />
      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      <main className="lg:pl-64 min-h-screen">
        <header className="h-16 border-b border-white/5 bg-[#070714]/70 backdrop-blur-xl flex items-center justify-between px-6 md:px-8 sticky top-0 z-30 !bg-[var(--panel-bg)] !border-[var(--border-color)]">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 -ml-2 text-slate-400 hover:!text-[var(--text-color)] transition-colors"
          >
            <LayoutDashboard size={20} />
          </button>
          
          <div className="text-xs font-bold text-slate-500 hidden sm:block uppercase tracking-widest opacity-60">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>

          <div className="flex items-center gap-4 ml-auto">
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-500 hover:!text-[var(--text-color)] hover:bg-white/10 transition-all relative !border-[var(--border-color)]"
              >
                <Bell size={18} />
                {notifications.length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#070714] animate-pulse" />
                )}
              </button>

              <AnimatePresence>
                {isNotifOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.98, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: 8, scale: 0.98, filter: 'blur(10px)' }}
                      className="absolute right-0 mt-4 w-[340px] bg-[#0d0d21]/90 backdrop-blur-3xl border border-white/10 rounded-[2rem] z-50 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.7)] origin-top-right overflow-hidden group !bg-[var(--panel-bg)] !border-[var(--border-color)]"
                    >
                      {/* Decorative Background Pulse */}
                      <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-600/10 blur-[60px] rounded-full group-hover:bg-indigo-600/20 transition-all duration-700" />

                      <div className="flex items-center justify-between mb-5 relative z-10">
                        <div className="flex flex-col">
                          <h3 className="text-sm font-black !text-[var(--text-color)] uppercase tracking-widest">Neural Intel</h3>
                          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Deadline Synchronization</span>
                        </div>
                        <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-indigo-600/10 !text-[var(--accent-color)] border border-indigo-500/20 shadow-[0_0_15px_rgba(79,70,229,0.15)]">
                          {notifications.length} Active
                        </span>
                      </div>
                      
                      <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar relative z-10">
                        {notifications.length === 0 ? (
                           <div className="py-10 text-center flex flex-col items-center">
                             <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-3">
                               <CheckCircle2 size={24} className="text-slate-400" />
                             </div>
                             <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Neural Space Clear</p>
                           </div>
                        ) : (
                          notifications.map((n, i) => (
                            <motion.div 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              key={i} 
                              className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] hover:border-white/10 transition-all hover:scale-[1.02] cursor-default group/item !border-[var(--border-color)]"
                            >
                              <div className="flex gap-4">
                                <div className={`w-10 h-10 rounded-xl ${n.type === 'today' ? 'bg-red-500/10 animate-pulse' : n.type === 'tomorrow' ? 'bg-amber-500/10' : 'bg-indigo-500/10'} flex items-center justify-center shrink-0 border border-white/5`}>
                                  <AlertCircle size={18} className={n.color} />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between">
                                    <p className="text-[13px] font-black !text-[var(--text-color)] truncate group-hover/item:!text-[var(--accent-color)] transition-colors tracking-tight">{n.company}</p>
                                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded bg-white/5 border border-white/5 ${n.color} uppercase`}>
                                      {n.type}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">{n.role}</p>
                                </div>
                              </div>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="h-8 w-px !bg-[var(--border-color)]" />

            <div className="flex items-center gap-3">
              <span className="text-sm font-bold !text-[var(--text-color)] hidden md:block">{user.name}</span>
              <div className="w-9 h-9 rounded-xl !bg-[var(--accent-color)] opacity-20 border border-indigo-500/30 flex items-center justify-center text-[var(--accent-color)] font-black text-sm cursor-pointer hover:opacity-30 transition-all" />
              <div className="absolute right-8 md:right-10 w-9 h-9 flex items-center justify-center !text-[var(--accent-color)] font-black text-sm pointer-events-none hidden md:flex">
                {user.name?.charAt(0)?.toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <div className="p-5 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0f0f20',
            color: '#e2e8f0',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '14px',
            fontSize: '14px',
            fontWeight: '500',
          },
          duration: 3500,
        }}
      />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/applications" element={<Layout><Applications /></Layout>} />
          <Route path="/companies" element={<Layout><Companies /></Layout>} />
          <Route path="/ai-prep" element={<Layout><AIPortal /></Layout>} />
          <Route path="/resumes" element={<Layout><Resumes /></Layout>} />
          <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
          <Route path="/settings" element={<Layout><Settings /></Layout>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <AIChatBot />
      </Router>
    </AuthProvider>
  );
}

export default App;
