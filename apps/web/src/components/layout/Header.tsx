'use client';

import { useState } from 'react';
import Link from 'next/link';

const nav = [
  { label: 'Employee', href: '/calculators/employee' },
  { label: 'Sole proprietor', href: '/calculators/sole-proprietor' },
  { label: 'Corporation', href: '/calculators/corporation' },
  { label: 'Compare', href: '/calculators/compare' },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b1526]/78 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="taxify-brand-mark flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-sm">
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path
                d="M4 14.5L10 4.5L16 14.5H4Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path d="M7.5 11.5H12.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </span>
          <span className="font-display text-lg tracking-tight text-white">Taxify</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/calculators/employee"
          className="hidden h-10 items-center rounded-xl bg-[var(--maple)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--orange-600)] md:inline-flex"
        >
          Calculate
        </Link>

        <button
          className="ml-2 rounded-lg p-2 text-white/80 hover:bg-white/10 md:hidden"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
            {open ? (
              <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-[#0b1526] px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-white hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                {n.label}
              </Link>
            ))}
            <Link
              href="/calculators/employee"
              className="mt-2 rounded-xl bg-[var(--maple)] px-4 py-2.5 text-center text-sm font-semibold text-white"
              onClick={() => setOpen(false)}
            >
              Calculate
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
