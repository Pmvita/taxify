'use client';

import { useState } from 'react';
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

export default function ComparePage() {
  const [personType, setPersonType] = useState<PersonType>('employee');
  const [income, setIncome] = useState<number>(100000);
  const [province, setProvince] = useState<ProvinceCode>('ON');

  const rows = compareProvinces(getRateTable(2025), {
    type: personType,
    value: income,
    province,
  });

  return (
    <div>
      <div className="max-w-3xl">
        <p className="text-sm font-medium text-[var(--steel)]">Design</p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-[var(--ink)]">
          Compare provinces
        </h1>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">
          See how the same type of income is taxed across all ten provinces. Choose your income and person type to compare net outcomes.
        </p>

        <div className="mt-6 space-y-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--ink)]">Person type</label>
              <select
                value={personType}
                onChange={(e) => setPersonType(e.target.value as PersonType)}
                className="w-full h-11 px-3 rounded-xl border border-[var(--border)] bg-white text-[var(--ink)] text-sm shadow-sm outline-none focus:border-[var(--steel)] focus:ring-2 focus:ring-[var(--steel)]/20"
              >
                {PERSON_TYPES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--ink)]">Income (CAD)</label>
              <input
                type="number"
                value={income || ''}
                onChange={(e) => setIncome(Number(e.target.value))}
                className="w-full h-11 px-3 rounded-xl border border-[var(--border)] bg-white text-[var(--ink)] text-sm shadow-sm outline-none focus:border-[var(--steel)] focus:ring-2 focus:ring-[var(--steel)]/20"
                min={0}
                step={5000}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--ink)]">Reference province</label>
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

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left text-xs uppercase tracking-wide text-[var(--muted)]">
                  <th className="px-3 py-3 font-normal">Province</th>
                  <th className="px-3 py-3 text-right font-normal">Net / (tax)</th>
                  <th className="px-3 py-3 text-right font-normal">Total tax / (credit)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {rows.map((r, i) => (
                  <tr
                    key={r.province}
                    className={i === 0 ? 'bg-[var(--surface-2)]' : ''}
                  >
                    <td className="px-3 py-3 font-medium text-[var(--ink)]">{r.label}</td>
                    <td className={`px-3 py-3 text-right font-semibold ${r.netPay >= 0 ? 'text-[var(--ink)]' : 'text-[var(--orange-600)]'}`}>
                      {currency(r.netPay)}
                    </td>
                    <td className={`px-3 py-3 text-right font-medium ${r.totalTax >= 0 ? 'text-[var(--ink)]' : 'text-[var(--orange-600)]'}`}>
                      {currency(r.totalTax)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
