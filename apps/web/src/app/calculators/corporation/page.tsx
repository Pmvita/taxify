'use client';

import { useState } from 'react';
import { calculateCorporateTax, getRateTable, currency } from '@taxify/core';
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

export default function CorporationPage() {
  const [taxableIncome, setTaxableIncome] = useState<number>(500000);
  const [province, setProvince] = useState<ProvinceCode>('BC');

  const result = calculateCorporateTax(getRateTable(2025), {
    taxableIncome,
    province,
  });

  return (
    <div>
      <div className="max-w-2xl">
        <p className="text-sm font-medium text-[var(--steel)]">Business — corporation</p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-[var(--ink)]">
          Corporate tax estimate
        </h1>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">
          Estimate federal and provincial corporate income tax on taxable income, including the refundable alternate minimum tax (AMT) credit.
        </p>

        <div className="mt-6 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-[var(--ink)]">Taxable income (CAD)</label>
              <input
                type="number"
                value={taxableIncome || ''}
                onChange={(e) => setTaxableIncome(Number(e.target.value))}
                className="w-full h-11 px-3 rounded-xl border border-[var(--border)] bg-white text-[var(--ink)] text-sm shadow-sm outline-none focus:border-[var(--steel)] focus:ring-2 focus:ring-[var(--steel)]/20"
                min={0}
                step={10000}
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
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="text-center">
                <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">Taxable income</p>
                <p className="mt-0.5 text-lg font-semibold text-[var(--ink)]">{currency(result.taxableIncome)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">Federal tax</p>
                <p className="mt-0.5 text-lg font-semibold text-[var(--ink)]">{currency(result.federalTax)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">Provincial tax</p>
                <p className="mt-0.5 text-lg font-semibold text-[var(--ink)]">{currency(result.provincialTax)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">Total tax</p>
                <p className="mt-0.5 text-lg font-semibold text-[var(--ink)]">{currency(result.total)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">AMT refundable</p>
                <p className="mt-0.5 text-lg font-semibold text-[var(--ink)]">{currency(result.amtArefundable)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">Effective rate</p>
                <p className="mt-0.5 text-lg font-semibold text-[var(--ink)]">{result.effectiveRate.toFixed(2)}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
