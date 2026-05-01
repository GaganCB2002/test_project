import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTheme } from '@/store/slices/themeSlice';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { motion } from 'framer-motion';

export default function Layout({ children }) {
  const dispatch = useDispatch();
  const { sidebarCollapsed } = useSelector((state) => state.ui);
  const { mode } = useSelector((state) => state.theme);

  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode') || 'light';
    dispatch(setTheme(savedMode));
  }, [dispatch]);

  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
    } else if (mode === 'light') {
      root.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [mode]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative">
      <Sidebar />
      <div
        className={`transition-all duration-400 ease-[0.4, 0, 0.2, 1] ${
          sidebarCollapsed ? 'pl-[88px]' : 'pl-[280px]'
        }`}
      >
        <Navbar />
        <main className="p-6 lg:p-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
