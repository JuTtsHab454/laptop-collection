import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import StorefrontShell from '@/components/layout/StorefrontShell';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Laptop Collection — Premium Laptops in Pakistan',
    template: '%s | Laptop Collection',
  },
  description:
    "Pakistan's trusted laptop retailer. Shop premium new laptops, RAM, SSDs, chargers, and accessories with delivery across Pakistan.",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/icon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    siteName: 'Laptop Collection',
    title: 'Laptop Collection — Premium Laptops in Pakistan',
    description:
      'Shop premium new laptops, RAM, SSDs, and accessories with delivery across Pakistan.',
    images: [{ url: '/icon.svg', width: 1200, height: 630 }],
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased bg-brand-dark text-slate-100 min-h-screen">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0F1420',
              color: '#F8FAFC',
              fontSize: '13px',
              borderRadius: '12px',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px rgba(245, 158, 11, 0.2)',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#07090E',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#FFFFFF',
              },
            },
          }}
        />
        <StorefrontShell>{children}</StorefrontShell>
      </body>
    </html>
  );
}
