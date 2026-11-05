import Link from 'next/link';

const modes = [
  {
    title: 'Employee',
    description: 'T4 payroll: see exactly what comes home after federal and provincial tax, CPP and EI.',
    href: '/calculators/employee',
  },
  {
    title: 'Sole proprietor',
    description: 'T2125: net income, CPP/EI, and your estimated quarterly instalments.',
    href: '/calculators/sole-proprietor',
  },
  {
    title: 'Corporation',
    description: 'T2: federal and provincial corporate tax, including the refundable AMT credit.',
    href: '/calculators/corporation',
  },
  {
    title: 'Compare provinces',
    description: 'See the same income taxed across all ten provinces, side by side.',
    href: '/calculators/compare',
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="py-12 sm:py-16">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--orange-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--orange-600)]">
            2025 federal &amp; provincial rates
          </span>
          <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight text-[var(--ink)]">
            Canadian taxes, explained.
          </h1>
          <p className="mt-4 text-base text-[var(--ink-soft)]">
            A clear, province-aware tax calculator for employees, sole proprietors, and corporations. Pick your province, enter your numbers, and get an itemized breakdown — no black box.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/calculators/employee">
              <button className="h-11 px-6 rounded-xl bg-[var(--steel)] text-white text-sm font-semibold shadow-sm hover:bg-[var(--steel-600)] transition">
                Start calculating
              </button>
            </Link>
            <Link href="/calculators/compare">
              <button className="h-11 px-6 rounded-xl border border-[var(--border)] text-[var(--ink)] text-sm font-semibold hover:bg-[var(--surface-2)] transition">
                Compare provinces
              </button>
            </Link>
          </div>

          <dl className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { label: '10', detail: 'provinces covered' },
              { label: '3', detail: 'person types' },
              { label: '2025', detail: 'federal + provincial rates' },
            ].map((d) => (
              <div key={d.label}>
                <dt className="sr-only">{d.detail}</dt>
                <dd className="text-3xl font-bold text-[var(--steel)]">{d.label}</dd>
                <dd className="text-xs text-[var(--muted)]">{d.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="text-xl font-semibold text-[var(--ink)]">Pick your situation</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">Everything is computed in your browser — your numbers never leave your device.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {modes.map((m) => (
              <Link
                key={m.href}
                href={m.href}
                className="rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] p-5 transition hover:border-[var(--steel-200)] hover:shadow-sm"
              >
                <h3 className="text-sm font-semibold text-[var(--ink)]">{m.title}</h3>
                <p className="mt-1 text-sm text-[var(--ink-soft)]">{m.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 border-t border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="text-xl font-semibold text-[var(--ink)]">How it works</h2>
          <div className="mt-5 grid gap-6 sm:grid-cols-3">
            {[
              { n: '1', title: 'Choose your situation', text: 'Select employee, sole proprietor, or corporation.' },
              { n: '2', title: 'Enter your income', text: 'Add your gross income, revenue, or taxable income and pick a province.' },
              { n: '3', title: 'See the breakdown', text: 'Get itemized federal, provincial, CPP and EI line items.' },
            ].map((s) => (
              <div key={s.n}>
                <span className="text-2xl font-bold text-[var(--orange)]">{s.n}</span>
                <h3 className="mt-2 text-sm font-semibold text-[var(--ink)]">{s.title}</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
