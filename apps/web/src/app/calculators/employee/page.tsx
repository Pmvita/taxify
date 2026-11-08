'use client';

import { useMemo, useState } from 'react';
import { calculateEmployeeTax, getRateTable } from '@taxify/core';
import type { ProvinceCode } from '@taxify/core';
import { currency } from '@taxify/core';
import { CountUp } from '@/components/CountUp';

const PROVINCES: { value: ProvinceCode; label: string }[] = [
  { value: 'AB', label: 'Alberta' },
  { value: 'BC', label: 'British Columbia' },
  { value: 'MB', label: 'Manitoba' },
  { value: 'NB', label: 'New Brunswick' },
  { value: 'NL', label: 'Newfoundland and Labrador' },
  { value: 'NS', label: 'Nova Scotia' },
  { value: 'ON', label: 'Ontario' },
  { value: 'PE', label: 'Prince Edward Island' },
  { value: 'QC', label: 'Quebec' },
  { value: 'SK', label: 'Saskatchewan' },
];

const fieldClass =
  'w-full h-12 px-4 rounded-xl border border-[var(--border)] bg-white text-[var(--ink)] text-base shadow-sm outline-none transition focus:border-[var(--steel)] focus:ring-2 focus:ring-[var(--steel)]/20';

export default function EmployeePage() {
  const [grossIncome, setGrossIncome] = useState<number>(75000);
  const [province, setProvince] = useState<ProvinceCode>('ON');

  const table = useMemo(() => getRateTable(2025), []);
  const result = useMemo(
    () => calculateEmployeeTax(table, { grossIncome, province }),
    [table, grossIncome, province],
  );

  const provinceLabel = PROVINCES.find((p) => p.value === province)?.label ?? province;
  const { cpp, ei, federalTax, provincialTax, totalIncomeTax, netPay, federalRate, provincialRate, totalRate } = result;

  return (
    <div className="mx-auto w-full max-w-3xl px-5 pt-8 sm:px-8 sm:pt-12">
      <header className="text-center">
        <p className="text-sm font-medium text-[var(--steel)]">Payroll — employee</p>
        <h1 className="mt-2 font-display text-3xl tracking-tight text-[var(--ink)] sm:text-4xl">
          Take-home pay
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[var(--ink-soft)]">
          Enter your gross income and province to see 2025 federal and provincial tax, CPP, and EI —
          recalculated live from the published brackets.
        </p>
      </header>

      <div className="mt-8 space-y-6">
        <section
          aria-label="Net take-home"
          className="rounded-2xl border border-[var(--steel-200)] bg-[var(--bg-elev)] p-6 text-center shadow-[var(--shadow-sm)] sm:p-8"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            Estimated net pay
          </p>
          <p className="mt-2 font-display text-4xl tabular-nums text-[var(--glacier)] sm:text-5xl">
            <CountUp value={netPay} format={(n) => currency(n)} />
          </p>
          <p className="mt-2 text-sm text-[var(--ink-soft)]">
            {provinceLabel} · after tax, CPP &amp; EI · tax year 2025
          </p>
        </section>

        <section
          aria-label="Income and province"
          className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-5 sm:p-6"
        >
          <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 sm:items-end">
            <div>
              <label
                htmlFor="gross-income"
                className="mb-2 block text-sm font-medium text-[var(--ink)]"
              >
                Gross income
              </label>
              <div className="relative">
                <span
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[var(--muted)]"
                  aria-hidden
                >
                  $
                </span>
                <input
                  id="gross-income"
                  type="number"
                  inputMode="decimal"
                  value={grossIncome || ''}
                  onChange={(e) => setGrossIncome(Number(e.target.value))}
                  className={`${fieldClass} pl-8 tabular-nums`}
                  min={0}
                  step={100}
                  placeholder="75000"
                />
              </div>
              <p className="mt-1.5 text-xs text-[var(--muted)]">Annual employment income (CAD)</p>
            </div>

            <div>
              <label
                htmlFor="province"
                className="mb-2 block text-sm font-medium text-[var(--ink)]"
              >
                Province of residence
              </label>
              <div className="relative">
                <select
                  id="province"
                  value={province}
                  onChange={(e) => setProvince(e.target.value as ProvinceCode)}
                  className={`${fieldClass} appearance-none cursor-pointer pr-10`}
                >
                  {PROVINCES.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <svg
                  className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M4 6L8 10L12 6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="mt-1.5 text-xs text-[var(--muted)]">
                Sets provincial brackets{province === 'QC' ? ' and Quebec federal abatement' : ''}
              </p>
            </div>
          </div>
        </section>

        <section
          aria-label="Tax summary"
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6"
        >
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <h2 className="text-sm font-semibold text-[var(--ink)]">Annual breakdown</h2>
            <p className="text-xs text-[var(--muted)]">{provinceLabel} · tax year 2025</p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Metric label="Federal tax" value={federalTax} rate={federalRate} />
            <Metric label="Provincial tax" value={provincialTax} rate={provincialRate} />
            <Metric label="CPP" value={cpp} />
            <Metric label="EI" value={ei} />
          </div>

          <div className="mt-5 border-t border-[var(--line)] pt-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
                  Total income tax
                </p>
                <p className="mt-1 text-lg font-semibold tabular-nums text-[var(--ink)]">
                  {currency(totalIncomeTax)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
                  Effective rate
                </p>
                <p className="mt-1 text-2xl sm:text-3xl font-bold tabular-nums text-[var(--steel)]">
                  {totalRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3 border-t border-[var(--line)] pt-4 text-xs text-[var(--muted)]">
            <div className="rounded-lg bg-[var(--surface-2)] p-3">
              <p className="text-[var(--muted)]">Federal rate</p>
              <p className="text-sm font-semibold text-[var(--ink)]">{federalRate.toFixed(1)}%</p>
            </div>
            <div className="rounded-lg bg-[var(--surface-2)] p-3">
              <p className="text-[var(--muted)]">Provincial rate</p>
              <p className="text-sm font-semibold text-[var(--ink)]">{provincialRate.toFixed(1)}%</p>
            </div>
            <div className="rounded-lg bg-[var(--surface-2)] p-3">
              <p className="text-[var(--muted)]">Tax year</p>
              <p className="text-sm font-semibold text-[var(--steel)]">2025</p>
            </div>
          </div>
        </section>

        <section aria-label="Where income goes" className="pb-4">
          <h2 className="text-center text-sm font-semibold text-[var(--ink)]">
            Where your income goes
          </h2>
          <div className="mt-4 grid gap-3 grid-cols-2 sm:grid-cols-4">
            <ShareBar label="Federal" value={federalTax} total={grossIncome} />
            <ShareBar label="Provincial" value={provincialTax} total={grossIncome} />
            <ShareBar label="CPP" value={cpp} total={grossIncome} />
            <ShareBar label="EI" value={ei} total={grossIncome} />
          </div>
        </section>
      </div>
    </div>
  );
}

function Metric({ label, value, rate }: { label: string; value: number; rate?: number }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">{label}</p>
      <p className="mt-1 text-xl font-semibold tabular-nums text-[var(--ink)]">{currency(value)}</p>
      {rate !== undefined ? <p className="mt-0.5 text-xs text-[var(--muted)]">Effective rate: {rate.toFixed(1)}%</p> : null}
    </div>
  );
}

function ShareBar({
  label,
  value,
  total,
}: {
  label: string;
  value: number;
  total: number;
}) {
  const pct = total > 0 ? Math.min(100, (value / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-xs font-medium text-[var(--muted)]">{label}</p>
        <p className="text-sm font-semibold tabular-nums text-[var(--ink)]">{currency(value)}</p>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--surface-2)]">
        <div
          className="h-full rounded-full bg-[var(--steel)] transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
