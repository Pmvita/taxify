import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
      <header className="text-center">
        <p className="text-sm font-medium text-[var(--steel)]">Access</p>
        <h1 className="mt-2 font-display text-3xl tracking-tight text-[var(--ink)] sm:text-4xl">
          Free calculators
        </h1>
        <p className="mt-3 text-base text-[var(--ink-soft)]">
          Every Taxify calculator — employee, sole proprietor, corporation, and province
          compare — is free to use in the browser. No account required for estimates.
        </p>
      </header>

      <div className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-6 sm:p-8">
        <h2 className="font-display text-xl text-[var(--ink)]">What you get</h2>
        <ul className="mt-4 space-y-2 text-sm text-[var(--ink-soft)]">
          <li>2025 federal + provincial brackets across all 10 provinces</li>
          <li>CPP and EI estimates from CRA T4032 inputs</li>
          <li>Quebec path with federal abatement</li>
          <li>Live province comparison ranked by what you keep</li>
        </ul>
        <Link
          href="/calculators/employee"
          className="mt-6 inline-flex h-11 items-center rounded-xl bg-[var(--maple)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--orange-600)]"
        >
          Start calculating
        </Link>
      </div>

      <p className="mt-6 text-center text-xs text-[var(--muted)]">
        Stripe billing hooks remain in the repo for optional Pro exports later; the
        public demo keeps core math unlocked.
      </p>
    </div>
  );
}
