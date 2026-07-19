import { useState } from 'react';
import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
  titleAr: string;
  titleEn: string;
  subtitle?: string;
}

export default function Layout({ children, titleAr, titleEn, subtitle }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#EEF2F7]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="lg:mr-64 flex flex-col min-h-screen">
        <Header
          titleAr={titleAr}
          titleEn={titleEn}
          subtitle={subtitle}
          onMenuClick={() => setSidebarOpen((prev) => !prev)}
        />
        <main className="flex-1 p-4 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
