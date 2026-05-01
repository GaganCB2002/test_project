import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  const { mode } = useSelector((state) => state.theme);

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-dark-200 ${mode === 'dark' ? 'dark' : ''}`}>
      <Sidebar />
      <div className="ml-[260px] min-h-screen transition-all duration-300">
        <Navbar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
