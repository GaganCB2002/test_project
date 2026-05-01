import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, User } from 'lucide-react';
import { loginStart, loginSuccess, loginFailure, clearError } from '../store/slices/authSlice';
import { authService } from '../services/authService';
import { getRoleDestination, normalizeRole } from '../utils/roleRouting';

const demoAccount = {
  email: 'techlead@company.com',
  password: 'password123',
};
const LogoIcon = () => (
  <div className="flex items-center justify-center">
    <div className="relative">
      <div className="w-12 h-12 bg-indigo-500 rounded-xl rotate-12 absolute inset-0 blur-sm opacity-50" />
      <div className="w-12 h-12 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl relative flex items-center justify-center text-white shadow-xl">
        <Loader2 className="w-8 h-8 animate-spin-slow" />
      </div>
    </div>
  </div>
);

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState(demoAccount.email);
  const [password, setPassword] = useState(demoAccount.password);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [validationErrors, setValidationErrors] = useState({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Clear error when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const validateForm = () => {
    const errors = {};

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFieldChange = (field, value) => {
    if (field === 'email') {
      setEmail(value);
    }

    if (field === 'password') {
      setPassword(value);
    }

    setValidationErrors((prev) => {
      if (!prev[field]) return prev;
      const nextErrors = { ...prev };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const applyDemoCredentials = () => {
    setEmail(demoAccount.email);
    setPassword(demoAccount.password);
    setValidationErrors({});
    dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      dispatch(loginStart());
      const response = await authService.login({ email, password });

      const role = normalizeRole(response.role || response.user?.role);
      if (role !== 'TECH_LEAD') {
        window.location.assign(getRoleDestination(role, response.token));
        return;
      }

      dispatch(loginSuccess({
        ...response,
        user: {
          ...response.user,
          name: response.user?.name || 'Tech Lead',
          role: 'TECH_LEAD',
        },
      }));
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed. Please check your credentials.';
      dispatch(loginFailure(errorMessage));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: 'beforeChildren',
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#06131f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.28),_transparent_32%),radial-gradient(circle_at_80%_20%,_rgba(20,184,166,0.2),_transparent_24%),linear-gradient(135deg,_#06131f_0%,_#0b1726_45%,_#132238_100%)]" />
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="absolute left-[-8rem] top-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="absolute bottom-[-10rem] right-[-4rem] h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8"
      >
        <div className="grid w-full overflow-hidden rounded-[32px] border border-white/10 bg-white/8 shadow-2xl shadow-cyan-950/20 backdrop-blur-2xl lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative overflow-hidden border-b border-white/10 p-8 sm:p-10 lg:border-b-0 lg:border-r">
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(59,130,246,0.12)_0%,rgba(6,19,31,0)_100%)]" />
            <motion.div variants={itemVariants} className="relative flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10 text-cyan-200 shadow-lg shadow-cyan-500/10">
                <LogoIcon />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/70">Control Center</p>
                <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Tech Lead Workspace</h1>
              </div>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="relative mt-8 max-w-xl text-base leading-7 text-slate-300"
            >
              Step into a focused command layer for sprint delivery, team visibility, and executive-ready reporting.
              Designed for leads who need clarity fast.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="relative mt-10 grid gap-4 sm:grid-cols-3"
            >
              {[
                { label: 'Active streams', value: '12', note: 'Projects tracked live' },
                { label: 'Team uptime', value: '98%', note: 'Delivery confidence' },
                { label: 'Weekly focus', value: '24', note: 'Priority tasks aligned' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-slate-950/30 p-4"
                >
                  <p className="text-2xl font-semibold text-white">{item.value}</p>
                  <p className="mt-1 text-sm text-slate-200">{item.label}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">{item.note}</p>
                </div>
              ))}
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="relative mt-10 rounded-3xl border border-indigo-400/30 bg-indigo-500/10 p-8 shadow-2xl shadow-indigo-500/10"
            >
              <div className="flex items-center justify-between gap-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-indigo-500 text-white shadow-lg">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-indigo-300 font-black">Authorized Personnel Only</p>
                    <h2 className="text-xl font-black text-white">Tech Lead Credentials</h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={applyDemoCredentials}
                  className="btn-premium py-2 text-sm"
                >
                  Apply Testing Data
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 group hover:bg-white/10 transition-colors">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-indigo-400 font-black mb-2">Username / Email</p>
                  <p className="text-sm font-bold text-white selection:bg-indigo-500">{demoAccount.email}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 group hover:bg-white/10 transition-colors">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-indigo-400 font-black mb-2">Access Key / Password</p>
                  <p className="text-sm font-bold text-white selection:bg-indigo-500">{demoAccount.password}</p>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                <p className="text-xs font-bold text-amber-200">
                  SYSTEM NOTE: This environment is restricted. Access is granted exclusively to accounts with the <span className="text-white underline">TECH_LEAD</span> role.
                </p>
              </div>
            </motion.div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <motion.div variants={itemVariants} className="mb-8">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Sign In</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Welcome back</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Use the test credentials below or your connected account to enter the dashboard.
              </p>
            </motion.div>

            <motion.form
              variants={itemVariants}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100"
                >
                  <div className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                  </div>
                </motion.div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Work Email
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    className={`w-full rounded-2xl border bg-slate-950/50 py-3 pl-12 pr-4 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/70 focus:ring-4 focus:ring-cyan-400/10 ${
                      validationErrors.email ? 'border-red-400/60' : 'border-white/10'
                    }`}
                    placeholder="you@company.com"
                    autoComplete="email"
                  />
                </div>
                {validationErrors.email && (
                  <p className="mt-2 text-sm text-red-300">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className="block text-sm font-medium text-slate-200">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={applyDemoCredentials}
                    className="text-sm font-medium text-cyan-200 transition hover:text-white"
                  >
                    Load test details
                  </button>
                </div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => handleFieldChange('password', e.target.value)}
                    className={`w-full rounded-2xl border bg-slate-950/50 py-3 pl-12 pr-14 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/70 focus:ring-4 focus:ring-cyan-400/10 ${
                      validationErrors.password ? 'border-red-400/60' : 'border-white/10'
                    }`}
                    placeholder="Enter your password"
                    autoComplete={rememberMe ? 'current-password' : 'off'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 transition hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="mt-2 text-sm text-red-300">{validationErrors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between gap-4 text-sm">
                <label className="flex cursor-pointer items-center text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-white/20 bg-slate-900 text-cyan-400 focus:ring-cyan-400 focus:ring-offset-0"
                  />
                  <span className="ml-3">Keep me signed in</span>
                </label>
                <span className="text-slate-400">Role: Tech Lead</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#38bdf8_0%,#2563eb_45%,#14b8a6_100%)] px-4 py-3.5 text-base font-semibold text-white shadow-xl shadow-cyan-950/25 transition hover:scale-[1.01] hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Enter Workspace</span>
                )}
              </button>
            </motion.form>

            <motion.div
              variants={itemVariants}
              className="mt-8 rounded-3xl border border-white/10 bg-slate-950/35 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-white">Testing checklist</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    The login is prefilled, the password can be revealed, and the demo credentials are always shown for quick UI review.
                  </p>
                </div>
                <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-emerald-200">
                  Ready
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
