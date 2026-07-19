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
  return (
    <div className="min-h-screen bg-[#EEF2F7] flex">
      <Sidebar />
      <div className="flex-1 mr-64 flex flex-col min-h-screen">
        <Header titleAr={titleAr} titleEn={titleEn} subtitle={subtitle} />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
