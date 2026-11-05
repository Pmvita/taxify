'use client';

import { useState } from 'react';
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

export default function SoleProprietorPage() {
  const [revenue, setRevenue] = useState<number>(100000);
  const [expenses, setExpenses] = useState<number>(30000);
  const [province, setProvince] = useState<ProvinceCode>('ON');
  const [claimCpp, setClaimCpp] = useState(true);

  const result = calculateSoleProprietorTax(getRateTable(2025), {
    revenue,
    expenses,
    province,
    claimCpp,
  });

  return (
    <div>
      <div className="max-w-2xl">
        <p className="text-sm font-medium text-[var(--steel)]">Business — sole proprietor</p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-[var(--ink)]">
          Business net income &amp; tax
        </h1>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">
          Enter your business revenue and expenses to estimate your net income, CPP/EI, and federal + provincial tax, plus your estimated quarterly instalments.
        </p>

        <div className="mt-6 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-[var(--ink)]">Business revenue (CAD)</label>
              <input
                type="number"
                value={revenue || ''}
                onChange={(e) => setRevenue(Number(e.target.value))}
                className="w-full h-11 px-3 rounded-xl border border-[var(--border)] bg-white text-[var(--ink)] text-sm shadow-sm outline-none focus:border-[var(--steel)] focus:ring-2 focus:ring-[var(--steel)]/20"
                min={0}
                step={1000}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-[var(--ink)]">Business expenses (CAD)</label>
              <input
                type="number"
                value={expenses || ''}
                onChange={(e) => setExpenses(Number(e.target.value))}
                className="w-full h-11 px-3 rounded-xl border border-[var(--border)] bg-white text-[var(--ink)] text-sm shadow-sm outline-none focus:border-[var(--steel)] focus:ring-2 focus:ring-[var(--steel)]/20"
                min={0}
                step={1000}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--ink)]">Province</label>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value as ProvinceCode)}
                className="w-full h-11 px-3 rounded-xl border border-[var(--border)] bg-white text-[var(--ink)] text-sm shadow-sm outline-none focus:border-[var(--steel)] focus:ring-2 focus:ring-[var(--steel)]/20"
              >
                {PROVINCES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={claimCpp}
                  onChange={(e) => setClaimCpp(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-[var(--border)] text-[var(--steel)] focus:ring-[var(--steel)]/20"
                />
                <span className="text-sm text-[var(--ink)]">Claim CPP (deductible business expense)</span>
              </label>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="text-center">
                <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">Net income</p>
                <p className="mt-0.5 text-lg font-semibold text-[var(--ink)]">{currency(result.businessNetIncome)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">CPP</p>
                <p className="mt-0.5 text-lg font-semibold text-[var(--ink)]">{currency(result.cpp)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">EI</p>
                <p className="mt-0.5 text-lg font-semibold text-[var(--ink)]">{currency(result.ei)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">Total income tax</p>
                <p className="mt-0.5 text-lg font-semibold text-[var(--ink)]">{currency(result.totalIncomeTax)}</p>
              </div>
              <div className="text-center sm:col-span-2">
                <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">Estimated quarterly instalment</p>
                <p className="mt-0.5 text-2xl font-bold text-[var(--steel)]">{currency(result.estQuarterly[0] ?? 0)}</p>
                <p className="text-xs text-[var(--muted)]">per quarter (4 equal payments)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
