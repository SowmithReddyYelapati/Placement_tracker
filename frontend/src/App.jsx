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

const Layout = ({ children }) => {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState([]);
  const [isNotifOpen, setIsNotifOpen] = React.useState(false);

  React.useEffect(() => {
    if (!user) return;
    const fetchNotifs = async () => {
      try {
        const { data } = await analyticsAPI.getDeadlineAlerts();
        const combined = [
          ...data.today.map(n => ({ ...n, type: 'today', color: 'text-red-400' })),
          ...data.tomorrow.map(n => ({ ...n, type: 'tomorrow', color: 'text-amber-400' }))
        ];
        setNotifications(combined);
      } catch (err) { console.error('Failed to fetch notifs', err); }
    };
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 1000 * 60 * 5); // 5 mins
    return () => clearInterval(interval);
  }, [user]);

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
        <header className="h-16 border-b border-white/5 bg-[#070714]/70 backdrop-blur-xl flex items-center justify-between px-6 md:px-8 sticky top-0 z-30">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
          >
            <LayoutDashboard size={20} />
          </button>
          
          <div className="text-xs font-semibold text-slate-600 hidden sm:block">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </div>

          <div className="flex items-center gap-4 ml-auto">
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all relative"
              >
                <Bell size={18} />
                {notifications.length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#070714] animate-pulse" />
                )}
              </button>

              <AnimatePresence>
                {isNotifOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-80 glass-card z-50 p-4 shadow-2xl origin-top-right"
                    >
                      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                        <h3 className="text-sm font-black text-white uppercase tracking-wider">Notifications</h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/20">
                          {notifications.length} New
                        </span>
                      </div>
                      
                      <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                        {notifications.length === 0 ? (
                          <div className="py-8 text-center">
                            <CheckCircle2 size={24} className="mx-auto text-slate-700 mb-2" />
                            <p className="text-xs text-slate-500 font-medium">All caught up!</p>
                          </div>
                        ) : (
                          notifications.map((n, i) => (
                            <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/8 transition-colors group">
                              <div className="flex gap-3">
                                <div className={`w-8 h-8 rounded-lg ${n.type === 'today' ? 'bg-red-500/10' : 'bg-amber-500/10'} flex items-center justify-center shrink-0`}>
                                  <AlertCircle size={14} className={n.color} />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-bold text-white truncate">{n.company}</p>
                                  <p className="text-[10px] text-slate-500 truncate">{n.role}</p>
                                  <div className="flex items-center gap-1 mt-1.5">
                                    <Clock size={10} className="text-slate-600" />
                                    <span className={`text-[9px] font-black uppercase tracking-widest ${n.color}`}>
                                      {n.type === 'today' ? 'Due Today' : 'Due Tomorrow'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="h-8 w-px bg-white/5" />

            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-300 hidden md:block">{user.name}</span>
              <div className="w-9 h-9 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-400 font-black border border-indigo-500/30 text-sm cursor-pointer hover:bg-indigo-600/30 transition-all">
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
      </Router>
    </AuthProvider>
  );
}

export default App;
