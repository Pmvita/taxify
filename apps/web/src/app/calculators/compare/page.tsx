'use client';

import { useMemo, useState } from 'react';
import { compareProvinces, getRateTable, currency } from '@taxify/core';
import type { PersonType, ProvinceCode } from '@taxify/core';

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

const PERSON_TYPES: { value: PersonType; label: string }[] = [
  { value: 'employee', label: 'Employee' },
  { value: 'soleProprietor', label: 'Sole proprietor' },
  { value: 'corporation', label: 'Corporation' },
];

const fieldClass =
  'w-full h-12 px-4 rounded-xl border border-[var(--border)] bg-white text-[var(--ink)] text-base shadow-sm outline-none transition focus:border-[var(--steel)] focus:ring-2 focus:ring-[var(--steel)]/20';

export default function ComparePage() {
  const [personType, setPersonType] = useState<PersonType>('employee');
  const [income, setIncome] = useState<number>(100000);
  const [province, setProvince] = useState<ProvinceCode>('ON');

  const table = useMemo(() => getRateTable(2025), []);
  const rows = useMemo(
    () =>
      compareProvinces(table, {
        type: personType,
        value: income,
        province,
      }),
    [table, personType, income, province],
  );

  const personLabel =
    PERSON_TYPES.find((p) => p.value === personType)?.label ?? personType;
  const provinceLabel = PROVINCES.find((p) => p.value === province)?.label ?? province;

  return (
    <div className="mx-auto w-full max-w-3xl px-5 pt-8 sm:px-8 sm:pt-12">
      <header className="text-center">
        <p className="text-sm font-medium text-[var(--steel)]">Compare</p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-[var(--ink)]">
          Compare provinces
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--ink-soft)] leading-relaxed">
          See how the same income is taxed across all ten provinces. Choose person type,
          income, and a reference province — results update live for 2025.
        </p>
      </header>

      <div className="mt-8 space-y-6">
        <section
          aria-label="Comparison inputs"
          className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-5 sm:p-6"
        >
          <div className="grid gap-5 sm:grid-cols-3 sm:gap-6 sm:items-end">
            <div>
              <label
                htmlFor="person-type"
                className="mb-2 block text-sm font-medium text-[var(--ink)]"
              >
                Person type
              </label>
              <div className="relative">
                <select
                  id="person-type"
                  value={personType}
                  onChange={(e) => setPersonType(e.target.value as PersonType)}
                  className={`${fieldClass} appearance-none cursor-pointer pr-10`}
                >
                  {PERSON_TYPES.map((p) => (
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
              <p className="mt-1.5 text-xs text-[var(--muted)]">Tax treatment to compare</p>
            </div>

            <div>
              <label
                htmlFor="income"
                className="mb-2 block text-sm font-medium text-[var(--ink)]"
              >
                Income
              </label>
              <div className="relative">
                <span
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[var(--muted)]"
                  aria-hidden
                >
                  $
                </span>
                <input
                  id="income"
                  type="number"
                  inputMode="decimal"
                  value={income || ''}
                  onChange={(e) => setIncome(Number(e.target.value))}
                  className={`${fieldClass} pl-8 tabular-nums`}
                  min={0}
                  step={5000}
                  placeholder="100000"
                />
              </div>
              <p className="mt-1.5 text-xs text-[var(--muted)]">Amount compared across provinces</p>
            </div>

            <div>
              <label
                htmlFor="province"
                className="mb-2 block text-sm font-medium text-[var(--ink)]"
              >
                Reference province
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
              <p className="mt-1.5 text-xs text-[var(--muted)]">Baseline for ranking results</p>
            </div>
          </div>
        </section>

        <section
          aria-label="Province comparison"
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6"
        >
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <h2 className="text-sm font-semibold text-[var(--ink)]">Results by province</h2>
            <p className="text-xs text-[var(--muted)]">
              {personLabel} · {currency(income)} · ref. {provinceLabel}
            </p>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left text-xs uppercase tracking-wide text-[var(--muted)]">
                  <th className="px-1 py-3 pr-3 font-medium sm:px-3">Province</th>
                  <th className="px-1 py-3 text-right font-medium sm:px-3">Net / (tax)</th>
                  <th className="px-1 py-3 text-right font-medium sm:px-3">Total tax</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {rows.map((r) => {
                  const isRef = r.province === province;
                  return (
                    <tr
                      key={r.province}
                      className={isRef ? 'bg-[var(--surface-2)]' : undefined}
                    >
                      <td className="px-1 py-3 pr-3 font-medium text-[var(--ink)] sm:px-3">
                        {r.label}
                        {isRef ? (
                          <span className="ml-2 text-xs font-normal text-[var(--muted)]">
                            reference
                          </span>
                        ) : null}
                      </td>
                      <td
                        className={`px-1 py-3 text-right font-semibold tabular-nums sm:px-3 ${
                          r.netPay >= 0 ? 'text-[var(--ink)]' : 'text-[var(--orange-600)]'
                        }`}
                      >
                        {currency(r.netPay)}
                      </td>
                      <td
                        className={`px-1 py-3 text-right font-medium tabular-nums sm:px-3 ${
                          r.totalTax >= 0 ? 'text-[var(--ink)]' : 'text-[var(--orange-600)]'
                        }`}
                      >
                        {currency(r.totalTax)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
