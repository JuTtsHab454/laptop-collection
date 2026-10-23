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

  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923134951239';
  const call = process.env.NEXT_PUBLIC_CALL_NUMBER || '923134951239';

  return (
    <div className="flex flex-col min-h-screen bg-surface-cream text-gray-900 selection:bg-accent-blue selection:text-white">
      <Header />
      <main className="flex-1 pb-16">{children}</main>
      <Footer />
      <FloatingContact whatsappNumber={whatsapp} callNumber={call} />
    </div>
  );
};

export default StorefrontShell;
