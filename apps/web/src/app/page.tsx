import Image from 'next/image';
import Link from 'next/link';

const modes = [
  {
    title: 'Employee',
    description: 'T4 payroll: federal + provincial tax, CPP and EI → take-home.',
    href: '/calculators/employee',
  },
  {
    title: 'Sole proprietor',
    description: 'T2125: net income, contributions, and quarterly instalments.',
    href: '/calculators/sole-proprietor',
  },
  {
    title: 'Corporation',
    description: 'T2: federal and provincial corporate tax with AMT credit.',
    href: '/calculators/corporation',
  },
  {
    title: 'Compare provinces',
    description: 'Same income, ten provinces — ranked by what you keep.',
    href: '/calculators/compare',
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="relative isolate min-h-[min(92vh,820px)] overflow-hidden">
        <Image
          src="/hero-glacier.jpg"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#0b1526]/88 via-[#0b1526]/62 to-[#0b1526]/28"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#0b1526]/55 via-transparent to-transparent"
          aria-hidden
        />

        <div className="relative mx-auto flex min-h-[min(92vh,820px)] max-w-6xl flex-col justify-end px-5 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-32">
          <p className="taxify-rise font-display text-5xl tracking-tight text-white sm:text-7xl md:text-8xl">
            Taxify
          </p>
          <h1 className="taxify-rise taxify-rise-delay-1 mt-4 max-w-xl text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">
            Canadian taxes, explained in brackets.
          </h1>
          <p className="taxify-rise taxify-rise-delay-2 mt-4 max-w-md text-base text-white/80 sm:text-lg">
            Pick your person type and province. Get a transparent 2025 federal and
            provincial breakdown — no black box.
          </p>
          <div className="taxify-rise taxify-rise-delay-3 mt-8 flex flex-wrap gap-3">
            <Link
              href="/calculators/employee"
              className="inline-flex h-12 items-center rounded-xl bg-[var(--maple)] px-6 text-sm font-semibold text-white shadow-lg transition hover:bg-[var(--orange-600)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Start calculating
            </Link>
            <Link
              href="/calculators/compare"
              className="inline-flex h-12 items-center rounded-xl border border-white/35 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/18 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Compare provinces
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--border)] bg-[var(--bg-elev)]/70 py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="font-display text-2xl text-[var(--ink)] sm:text-3xl">
            Pick your situation
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[var(--muted)] sm:text-base">
            Everything runs in your browser from published CRA brackets. Your numbers
            never leave the device.
          </p>
          <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">
            {modes.map((m) => (
              <Link
                key={m.href}
                href={m.href}
                className="group bg-[var(--bg-elev)] p-6 transition hover:bg-[var(--surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--glacier)]"
              >
                <h3 className="font-display text-lg text-[var(--ink)] group-hover:text-[var(--glacier)]">
                  {m.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
                  {m.description}
                </p>
                <span className="mt-4 inline-block text-xs font-semibold uppercase tracking-wider text-[var(--glacier)]">
                  Open →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="font-display text-2xl text-[var(--ink)] sm:text-3xl">How it works</h2>
          <p className="mt-2 text-sm text-[var(--muted)] sm:text-base">
            Three steps. Live math. Bracket-by-bracket honesty.
          </p>
          <ol className="mt-8 grid gap-8 sm:grid-cols-3">
            {[
              {
                n: '01',
                title: 'Choose your situation',
                text: 'Employee, sole proprietor, or corporation — switch anytime.',
              },
              {
                n: '02',
                title: 'Enter income & province',
                text: 'Gross, revenue, or taxable income plus residence province.',
              },
              {
                n: '03',
                title: 'Read the breakdown',
                text: 'Federal, provincial, CPP, and EI as clear line items.',
              },
            ].map((s) => (
              <li key={s.n} className="relative pl-0">
                <span className="font-display text-4xl text-[var(--ice)]">{s.n}</span>
                <h3 className="mt-3 text-base font-semibold text-[var(--ink)]">{s.title}</h3>
                <p className="mt-1.5 text-sm text-[var(--muted)]">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
