import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { MapPin, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const set = (k, v) => setFormData(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) { toast.error('Please fill all fields'); return; }
    if (!isLogin && !formData.name) { toast.error('Name is required'); return; }
    setLoading(true);
    try {
      if (isLogin) {
        const { data } = await authAPI.login({ email: formData.email, password: formData.password });
        login({ name: data.user.name, email: data.user.email }, data.token);
        toast.success('Welcome back!');
        navigate('/');
      } else {
        const { data } = await authAPI.register(formData);
        login({ name: data.user.name, email: data.user.email }, data.token);
        toast.success('Account created! Welcome to PlaceTrack 🎉');
        navigate('/');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = () => {
    login({ name: 'Demo User', email: 'demo@placetrack.io' }, 'demo-token');
    toast.success('Entered demo mode 👀');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#050510] relative overflow-hidden">
      <div className="bg-neural" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-700/8 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-card p-8 md:p-10 relative z-10"
      >
        {/* Brand */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-2xl shadow-indigo-600/40">
            <MapPin size={26} fill="currentColor" className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">PlaceTrack</h1>
          <p className="text-slate-500 text-sm mt-1.5 font-medium">Your placement journey, simplified.</p>
        </div>

        {/* Tab toggle */}
        <div className="flex bg-white/5 rounded-xl p-1 mb-7 border border-white/5">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${isLogin ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-white'}`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${!isLogin ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-white'}`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">Full Name</label>
              <input
                type="text"
                autoComplete="name"
                className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:bg-white/8 outline-none transition-all font-medium text-sm"
                placeholder="Your full name"
                value={formData.name}
                onChange={e => set('name', e.target.value)}
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">Email Address</label>
            <input
              type="email"
              autoComplete="email"
              required
              className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:bg-white/8 outline-none transition-all font-medium text-sm"
              placeholder="you@example.com"
              value={formData.email}
              onChange={e => set('email', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                required
                className="w-full px-4 py-3.5 pr-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:bg-white/8 outline-none transition-all font-medium text-sm"
                placeholder="••••••••"
                value={formData.password}
                onChange={e => set('password', e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 !mt-6"
          >
            {loading && <Loader2 size={17} className="animate-spin" />}
            <span className="font-semibold">{isLogin ? 'Sign In' : 'Create Account'}</span>
          </button>
        </form>

        <div className="mt-5 pt-5 border-t border-white/5">
          <button
            onClick={handleDemo}
            className="w-full py-3.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-sm font-semibold hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2 group"
          >
            Try Demo Mode
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
          <p className="text-center text-[11px] text-slate-700 mt-4 font-medium">No real data is stored in demo mode.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
