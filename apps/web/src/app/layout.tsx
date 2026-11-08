import type { Metadata } from 'next';
import { Figtree, Syne } from 'next/font/google';
import { SiteHeader } from '@/components/layout/Header';
import { SiteFooter } from '@/components/layout/Footer';
import './globals.css';

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Taxify — Canadian tax calculator',
  description:
    'A clear, province-aware Canadian tax calculator for employees, sole proprietors, and corporations. 2025 federal + provincial rates.',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Taxify' },
  keywords: [
    'canada',
    'tax calculator',
    'canadian tax',
    't4',
    't2125',
    'corporation tax',
    'sole proprietor',
    'CRA',
  ],
  openGraph: {
    title: 'Taxify',
    description:
      'Clear, province-aware Canadian tax calculations. Employees, sole proprietors, and corporations.',
    type: 'website',
    url: 'https://taxify-canada.vercel.app',
  },
  robots: 'index, follow',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${figtree.variable} ${syne.variable}`}>
      <body>
        <SiteHeader />
        <main className="w-full">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
