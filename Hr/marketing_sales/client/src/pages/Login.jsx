import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Sparkles, ArrowRight, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md p-8 shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-200 mb-4">
            <Sparkles size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tight">Vortex AI</h1>
          <p className="text-slate-500 font-medium mt-1">Enterprise Marketing & Sales Intelligence</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 text-rose-600 rounded-lg text-sm border border-rose-100 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email" 
                required
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-primary-500/10 transition-all outline-none"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" 
                required
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-primary-500/10 transition-all outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="w-full btn-primary py-4 flex items-center justify-center space-x-2 text-lg font-black uppercase tracking-widest mt-4">
            <span>Login</span>
            <ArrowRight size={20} />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="bg-primary-50 dark:bg-primary-900/10 p-4 rounded-xl border border-primary-100 dark:border-primary-900/20 mb-6">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-600 mb-1">Demo Credentials</p>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Email: <span className="font-bold">admin@example.com</span></p>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Pass: <span className="font-bold">password123</span></p>
          </div>
          
          <Link to="/register" className="flex items-center justify-center space-x-2 text-slate-400 hover:text-primary-600 font-bold transition-colors">
            <UserPlus size={18} />
            <span className="text-sm">Create Organization Account</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
