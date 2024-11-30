'use client';

import SideBar from '@/components/sidebar/SideBar';
import { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div>
      <SideBar />
      <main className="flex h-screen flex-col py-5 md:py-10 lg:pl-72">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
