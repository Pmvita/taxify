'use client';

import { useState } from 'react';
import { calculateEmployeeTax, getRateTable } from '@taxify/core';
import type { ProvinceCode } from '@taxify/core';
import { currency } from '@taxify/core';

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

export default function EmployeePage() {
  const [grossIncome, setGrossIncome] = useState<number>(75000);
  const [province, setProvince] = useState<ProvinceCode>('ON');

  const result = calculateEmployeeTax(getRateTable(2025), {
    grossIncome,
    province,
  });

  const cpp = result.cpp;
  const ei = result.ei;
  const federalTax = result.federalTax;
  const provincialTax = result.provincialTax;
  const totalIncomeTax = result.totalIncomeTax;
  const netPay = result.netPay;

  return (
    <div>
      <div className="max-w-2xl">
        <p className="text-sm font-medium text-[var(--steel)]">Payroll — employee</p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-[var(--ink)]">
          Take-home pay
        </h1>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">
          Enter your gross income to see the 2025 federal and provincial deductions, CPP and EI. Everything is computed on the personal income tax brackets — no black box.
        </p>

        <div className="mt-6 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-[var(--ink)]">Gross income (CAD)</label>
              <input
                type="number"
                value={grossIncome || ''}
                onChange={(e) => setGrossIncome(Number(e.target.value))}
                className="w-full h-11 px-3 rounded-xl border border-[var(--border)] bg-white text-[var(--ink)] text-sm shadow-sm outline-none focus:border-[var(--steel)] focus:ring-2 focus:ring-[var(--steel)]/20"
                min={0}
                step={100}
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
                <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">CPP</p>
                <p className="mt-0.5 text-lg font-semibold text-[var(--ink)]">{currency(cpp)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">EI</p>
                <p className="mt-0.5 text-lg font-semibold text-[var(--ink)]">{currency(ei)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">Federal</p>
                <p className="mt-0.5 text-lg font-semibold text-[var(--ink)]">{currency(federalTax)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">Provincial</p>
                <p className="mt-0.5 text-lg font-semibold text-[var(--ink)]">{currency(provincialTax)}</p>
              </div>
              <div className="text-center sm:col-span-2">
                <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">Total income tax</p>
                <p className="mt-0.5 text-lg font-semibold text-[var(--ink)]">{currency(totalIncomeTax)}</p>
              </div>
              <div className="text-center sm:col-span-2">
                <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">Net pay (per period)</p>
                <p className="mt-0.5 text-2xl font-bold text-[var(--steel)]">{currency(netPay)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] p-5">
            <h2 className="mb-3 text-lg font-semibold text-[var(--ink)]">Where your income goes</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Federal tax" value={federalTax} />
              <StatCard label="Provincial tax" value={provincialTax} />
              <StatCard label="CPP" value={cpp} />
              <StatCard label="EI" value={ei} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-white p-4">
      <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">{label}</p>
      <p className="mt-1 text-lg font-semibold text-[var(--ink)]">{currency(value)}</p>
    </div>
  );
}
