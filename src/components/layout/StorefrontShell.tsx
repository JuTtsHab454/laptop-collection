'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import FloatingContact from './FloatingContact';

export const StorefrontShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-surface-cream text-gray-900 selection:bg-accent-blue selection:text-white">
      <Header />
      <main className="flex-1 pb-16">{children}</main>
      <Footer />
      <FloatingContact />
    </div>
  );
};

export default StorefrontShell;
