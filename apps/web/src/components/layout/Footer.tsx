import Link from 'next/link';

const nav = [
  { label: 'Employee tax', href: '/calculators/employee' },
  { label: 'Sole proprietor', href: '/calculators/sole-proprietor' },
  { label: 'Corporation', href: '/calculators/corporation' },
  { label: 'Compare provinces', href: '/calculators/compare' },
];

export function SiteFooter() {
  return (
    <footer className="mt-4 border-t border-[var(--border)] bg-[#0b1526] text-white">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="taxify-brand-mark flex h-8 w-8 items-center justify-center rounded-lg text-white">
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden>
                  <path
                    d="M4 14.5L10 4.5L16 14.5H4Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="font-display text-base tracking-tight">Taxify</span>
            </div>
            <p className="mt-3 max-w-sm text-xs leading-relaxed text-white/55">
              Built in Canada. Estimates only — confirm with the CRA before filing.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/65">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="hover:text-white">
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mt-8 text-xs text-white/40">
          © {new Date().getFullYear()} Taxify. Figures use published 2025 federal and provincial
          rates and do not constitute tax, legal, or accounting advice.
        </p>
      </div>
    </footer>
  );
}
