import './globals.css';
import type { Metadata, Viewport } from 'next';
import { AuthProvider } from '@/context/AuthContext';
import { FeatureProvider } from '@/context/FeatureContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ToastProvider } from '@/components/ToastProvider';

export const metadata: Metadata = {
  title: {
    default: 'Munjum | Shop Smart, Earn More',
    template: '%s | Munjum',
  },
  description:
    'Munjum is a super-app platform for shopping, cashback, affiliates, merchants, travel, insurance, food delivery, and more.',
  keywords: [
    'shopping', 'cashback', 'affiliate', 'ecommerce', 'merchant',
    'travel', 'loyalty', 'coupons', 'deals', 'food delivery',
  ],
  metadataBase: new URL('https://munjum.in'),
  openGraph: {
    title: 'Munjum | Shop Smart, Earn More',
    description: 'A scalable super-app for shopping, cashback, affiliates, and services.',
    url: 'https://munjum.in',
    siteName: 'Munjum',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Munjum | Shop Smart, Earn More',
    description: 'A scalable super-app for shopping, cashback, affiliates, and services.',
  },
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-512.png',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#6366f1',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <AuthProvider>
          <FeatureProvider>
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
            <ToastProvider />
          </FeatureProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
