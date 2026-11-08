'use client';

import { useMemo, useState } from 'react';
import { calculateSoleProprietorTax, getRateTable, currency } from '@taxify/core';
import type { ProvinceCode } from '@taxify/core';

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

export default function SoleProprietorPage() {
  const [revenue, setRevenue] = useState<number>(100000);
  const [expenses, setExpenses] = useState<number>(30000);
  const [province, setProvince] = useState<ProvinceCode>('ON');
  const [claimCpp, setClaimCpp] = useState(true);

  const table = useMemo(() => getRateTable(2025), []);
  const result = useMemo(
    () =>
      calculateSoleProprietorTax(table, {
        revenue,
        expenses,
        province,
        claimCpp,
      }),
    [table, revenue, expenses, province, claimCpp],
  );

  const provinceLabel = PROVINCES.find((p) => p.value === province)?.label ?? province;
  const {
    businessNetIncome,
    federalTax,
    provincialTax,
    totalIncomeTax,
    cpp,
    ei,
    estQuarterly,
  } = result;
  const quarterly = estQuarterly[0] ?? 0;
  const effectiveRate =
    businessNetIncome > 0 ? (totalIncomeTax / businessNetIncome) * 100 : 0;

  return (
    <div className="mx-auto w-full max-w-3xl px-5 pt-8 sm:px-8 sm:pt-12">
      <header className="text-center">
        <p className="text-sm font-medium text-[var(--steel)]">Business — sole proprietor</p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-[var(--ink)]">
          Business net income &amp; tax
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--ink-soft)] leading-relaxed">
          Enter revenue, expenses, and province to estimate net income, CPP/EI, federal and
          provincial tax, and quarterly instalments — recalculated live for 2025.
        </p>
      </header>

      <div className="mt-8 space-y-6">
        <section
          aria-label="Business details"
          className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-5 sm:p-6"
        >
          <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 sm:items-end">
            <div>
              <label
                htmlFor="revenue"
                className="mb-2 block text-sm font-medium text-[var(--ink)]"
              >
                Business revenue
              </label>
              <div className="relative">
                <span
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[var(--muted)]"
                  aria-hidden
                >
                  $
                </span>
                <input
                  id="revenue"
                  type="number"
                  inputMode="decimal"
                  value={revenue || ''}
                  onChange={(e) => setRevenue(Number(e.target.value))}
                  className={`${fieldClass} pl-8 tabular-nums`}
                  min={0}
                  step={1000}
                  placeholder="100000"
                />
              </div>
              <p className="mt-1.5 text-xs text-[var(--muted)]">Total sales or business income (CAD)</p>
            </div>

            <div>
              <label
                htmlFor="expenses"
                className="mb-2 block text-sm font-medium text-[var(--ink)]"
              >
                Business expenses
              </label>
              <div className="relative">
                <span
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[var(--muted)]"
                  aria-hidden
                >
                  $
                </span>
                <input
                  id="expenses"
                  type="number"
                  inputMode="decimal"
                  value={expenses || ''}
                  onChange={(e) => setExpenses(Number(e.target.value))}
                  className={`${fieldClass} pl-8 tabular-nums`}
                  min={0}
                  step={1000}
                  placeholder="30000"
                />
              </div>
              <p className="mt-1.5 text-xs text-[var(--muted)]">Deductible costs that reduce taxable income</p>
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

            <div className="flex items-end pb-0.5">
              <div className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-white px-4 py-3 w-full min-h-12">
                <input
                  id="claim-cpp"
                  type="checkbox"
                  checked={claimCpp}
                  onChange={(e) => setClaimCpp(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-[var(--border)] text-[var(--steel)] focus:ring-[var(--steel)]/20"
                />
                <div>
                  <label htmlFor="claim-cpp" className="text-sm font-medium text-[var(--ink)]">
                    Claim CPP
                  </label>
                  <p className="mt-0.5 text-xs text-[var(--muted)]">
                    Include CPP/EI on net business income
                  </p>
                </div>
              </div>
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
            <Metric label="Business net income" value={businessNetIncome} />
            <Metric label="Federal tax" value={federalTax} />
            <Metric label="Provincial tax" value={provincialTax} />
            <Metric label="CPP" value={cpp} />
            <Metric label="EI" value={ei} />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
                Effective rate
              </p>
              <p className="mt-1 text-xl font-semibold tabular-nums text-[var(--ink)]">
                {effectiveRate.toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="mt-5 border-t border-[var(--line)] pt-5">
            <div className="flex items-end justify-between gap-4">
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
                  Quarterly instalment
                </p>
                <p className="mt-1 text-2xl sm:text-3xl font-bold tabular-nums text-[var(--steel)]">
                  {currency(quarterly)}
                </p>
                <p className="mt-1 text-xs text-[var(--muted)]">4 equal payments</p>
              </div>
            </div>
          </div>
        </section>

        <section aria-label="Where income goes" className="pb-4">
          <h2 className="text-center text-sm font-semibold text-[var(--ink)]">
            Where your income goes
          </h2>
          <div className="mt-4 grid gap-3 grid-cols-2 sm:grid-cols-4">
            <ShareBar label="Federal" value={federalTax} total={businessNetIncome} />
            <ShareBar label="Provincial" value={provincialTax} total={businessNetIncome} />
            <ShareBar label="CPP" value={cpp} total={businessNetIncome} />
            <ShareBar label="EI" value={ei} total={businessNetIncome} />
          </div>
        </section>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">{label}</p>
      <p className="mt-1 text-xl font-semibold tabular-nums text-[var(--ink)]">{currency(value)}</p>
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
