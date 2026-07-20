import { useState } from 'react';
import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
  titleKey: string;
  subtitleKey?: string;
}

export default function Layout({ children, titleKey, subtitleKey }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {sidebarOpen && (
        <div className="fixed inset-0 bg-brand-navy/40 backdrop-blur-sm z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="lg:ms-64 flex flex-col min-h-screen">
        <Header titleKey={titleKey} subtitleKey={subtitleKey} onMenuClick={() => setSidebarOpen((p) => !p)} />
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
