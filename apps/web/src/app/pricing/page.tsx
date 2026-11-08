import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    features: ['Sole proprietor calculator', 'Compare provinces', '2025 tax rates'],
    cta: 'Start free',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: '/month',
    features: [
      'All calculators (employee, sole proprietor, corporation)',
      'Export tax reports as PDF',
      '2025 & 2026 tax rates (verified)',
      'Province weight analytics',
      'Priority support',
    ],
    cta: 'Go Pro',
    highlight: true,
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
      <header className="text-center">
        <p className="text-sm font-medium text-[var(--steel)]">Plans</p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-[var(--ink)]">
          Pricing
        </h1>
        <p className="mt-3 text-base text-[var(--ink-soft)]">
          Taxify is free to try. Upgrade to Pro for advanced calculators, PDF
          exports, and multi-year rate verification.
        </p>
      </header>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-2xl border p-6 ${
              plan.highlight
                ? 'border-[var(--steel)] bg-[var(--bg-elev)] shadow-[var(--shadow)]'
                : 'border-[var(--border)] bg-[var(--surface)]'
            }`}
          >
            {plan.highlight ? (
              <span className="absolute -top-2 right-6 rounded-full bg-[var(--steel)] px-3 py-1 text-xs font-semibold text-white">
                Most popular
              </span>
            ) : null}
            <h2 className="text-lg font-semibold text-[var(--ink)]">{plan.name}</h2>
            <p className="mt-2 text-3xl font-bold text-[var(--steel)]">
              {plan.price}
              <span className="text-base font-normal text-[var(--muted)]">
                {plan.period}
              </span>
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-[var(--ink-soft)]">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0 text-[var(--steel)]"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M4 12L8 8L12 12"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/pricing/checkout"
              className={`mt-5 block rounded-xl py-3 text-center font-semibold transition ${
                plan.highlight
                  ? 'bg-[var(--steel)] text-white hover:bg-[var(--steel-600)]'
                  : 'border border-[var(--border)] text-[var(--ink)] hover:bg-[var(--surface-2)]'
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>

      <section className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-sm font-semibold text-[var(--ink)]">Free trial</h2>
        <p className="mt-1 text-sm text-[var(--ink-soft)]">
          The Free tier gives you immediate access to the core tax calculators.
          No credit card required. Upgrade to Pro anytime to unlock export, PDF
          reports, and 2026 rates.
        </p>
      </section>
    </div>
  );
}
