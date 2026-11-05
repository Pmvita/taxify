import type { Metadata } from 'next';
import { SiteHeader } from '@/components/layout/Header';
import { SiteFooter } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Taxify — Canadian tax calculator',
  description: 'A clear, province-aware Canadian tax calculator for employees, sole proprietors, and corporations. 2025 federal + provincial rates.',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Taxify' },
  keywords: ['canada', 'tax calculator', 'canadian tax', 't4', 't2125', 'corporation tax', 'sole proprietor', 'CRA'],
  openGraph: {
    title: 'Taxify',
    description: 'Clear, province-aware Canadian tax calculations. Employees, sole proprietors, and corporations.',
    type: 'website',
  },
  robots: 'index, follow',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl px-5 sm:px-8 pb-12 sm:pb-20">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
