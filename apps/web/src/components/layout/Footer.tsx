import Link from 'next/link';

const nav = [
  { label: 'Employee tax', href: '/calculators/employee' },
  { label: 'Sole proprietor', href: '/calculators/sole-proprietor' },
  { label: 'Corporation', href: '/calculators/corporation' },
  { label: 'Compare provinces', href: '/calculators/compare' },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] mt-12 sm:mt-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--steel)] text-white">
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none">
                <path d="M7 3.5L13 10L7 16.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="text-sm font-semibold text-[var(--steel)]">Taxify</span>
          </div>
          <p className="text-xs text-[var(--muted)]">
            © {new Date().getFullYear()} Taxify. Built in Canada.
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-[var(--muted)]">
          {nav.map((n) => (
            <Link key={n.href} href={n.href}>{n.label}</Link>
          ))}
          <Link href="/calculators/compare">Competitor analysis</Link>
          <Link href="/calculators/employee">2025 rates</Link>
          <Link href="/calculators/employee">Privacy</Link>
        </div>
        <p className="mt-3 text-xs text-[var(--muted)]">
          For estimation only. Figures are based on published 2025 federal and provincial rates and do not constitute tax, legal, or accounting advice. Verify with the CRA before relying on any figure.
        </p>
      </div>
    </footer>
  );
}
