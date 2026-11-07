'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

const nav = [
  { label: 'Home', href: '/' },
  { label: 'Employee', href: '/calculators/employee' },
  { label: 'Sole proprietor', href: '/calculators/sole-proprietor' },
  { label: 'Corporation', href: '/calculators/corporation' },
  { label: 'Compare provinces', href: '/calculators/compare' },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-[var(--border)] bg-[var(--bg)] sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--steel)] text-white shadow-sm">
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none">
              <path
                d="M7 3.5L13 10L7 16.5"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="text-lg font-semibold tracking-tight text-[var(--steel)]">
            Taxify
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--ink-soft)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)] transition"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <Link
            href="/login"
            className="h-11 rounded-xl border border-[var(--border)] px-4 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--surface-2)] hover:border-[var(--steel-200)] transition"
          >
            Sign in
          </Link>
          <Link
            href="/calculators/employee"
            className="h-11 rounded-xl bg-[var(--steel)] text-white px-5 text-sm font-semibold shadow-sm hover:bg-[var(--steel-600)] transition"
          >
            Try it free
          </Link>
        </div>

        <button
          className="ml-2 rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--surface-2)] md:hidden"
          aria-label="Toggle navigation"
          onClick={() => setOpen((o) => !o)}
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
            {open ? (
              <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open ? (
        <div className="border-t border-[var(--border)] bg-[var(--bg-elev)] px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--ink)] hover:bg-[var(--surface-2)] hover:text-[var(--steel)]"
                onClick={() => setOpen(false)}
              >
                {n.label}
              </Link>
            ))}
            <Link
              href="/calculators/employee"
              className="mt-2 rounded-xl bg-[var(--steel)] text-white px-4 py-2.5 text-center text-sm font-semibold"
              onClick={() => setOpen(false)}
            >
              Try it free
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
