import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  notificationCount?: number;
}

export function MainLayout({ notificationCount = 0 }: MainLayoutProps) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f5f7fb]">
      <Sidebar />
      <div className="min-w-0 lg:pl-64">
        <Header notificationCount={notificationCount} />
        <main className="min-w-0 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 min-h-[calc(100vh-73px)]">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
