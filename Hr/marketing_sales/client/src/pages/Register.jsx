import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Sparkles, User, Building, ArrowRight, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    companyName: '',
    role: 'Admin'
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({
        ...formData,
        companyId: formData.companyName.toLowerCase().replace(/\s+/g, '-')
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-lg p-8 shadow-2xl"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-200 mb-4">
            <Sparkles size={32} />
          </div>
          <h1 className="text-2xl font-bold">Organization Signup</h1>
          <p className="text-slate-500">Get started with AI-Powered Marketing & Sales</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 text-rose-600 rounded-lg text-sm border border-rose-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                name="name"
                type="text" 
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/20"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                name="email"
                type="email" 
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/20"
                placeholder="john@company.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Company Name</label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                name="companyName"
                type="text" 
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/20"
                placeholder="Nexus Soft"
                value={formData.companyName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                name="password"
                type="password" 
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/20"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Initial Role</label>
            <select 
              name="role"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/20"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="Admin">Admin</option>
              <option value="Marketing Manager">Marketing Manager</option>
              <option value="Sales Manager">Sales Manager</option>
            </select>
          </div>

          <div className="md:col-span-2 mt-4">
            <button type="submit" className="w-full btn-primary py-3 flex items-center justify-center space-x-2 text-lg">
              <span>Create Account</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-slate-500">Already have an account?</p>
          <Link to="/login" className="mt-2 flex items-center justify-center space-x-2 text-primary-600 font-bold hover:text-primary-700">
            <LogIn size={18} />
            <span>Login to Dashboard</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
