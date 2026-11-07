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

function Select({
  label,
  hint,
  id,
  value,
  onChange,
  className = '',
  options,
}: {
  label: string;
  hint?: string;
  id?: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-[var(--ink)]"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-12 px-4 rounded-xl border border-[var(--border)] bg-white text-[var(--ink)] text-base shadow-sm outline-none transition appearance-none cursor-pointer focus:border-[var(--steel)] focus:ring-2 focus:ring-[var(--steel)]/20"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <svg
        className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)] pointer-events-none"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
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
  );
}

function NumberInput({
  label,
  hint,
  id,
  value,
  onChange,
  className = '',
  ...rest
}: {
  label: string;
  hint?: string;
  id?: string;
  value: number;
  onChange: (v: number) => void;
  className?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>) {
  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-[var(--ink)]"
      >
        {label}
      </label>
      <input
        id={id}
        type="number"
        min={0}
        step={5000}
        value={value || ''}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-12 px-4 rounded-xl border border-[var(--border)] bg-white text-[var(--ink)] text-base shadow-sm outline-none transition placeholder:font-normal placeholder:text-[var(--muted)] focus:border-[var(--steel)] focus:ring-2 focus:ring-[var(--steel)]/20"
        {...rest}
      />
      {hint ? <p className="mt-1 text-xs text-[var(--muted)]">{hint}</p> : null}
    </div>
  );
}

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
        <p className="text-sm font-medium text-[var(--steel)]">Compare</p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-[var(--ink)]">
          Compare provinces
        </h1>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">
          See how the same type of income is taxed across all ten provinces.
          Choose your income and person type to compare net outcomes.
        </p>

        <div className="mt-6 space-y-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Select
                label="Person type"
                value={personType}
                onChange={(v) => setPersonType(v as PersonType)}
                options={PERSON_TYPES}
              />
            </div>
            <div>
              <NumberInput
                label="Income (CAD)"
                hint="Enter the income you want to compare."
                value={income}
                onChange={setIncome}
              />
            </div>
            <div>
              <Select
                label="Reference province"
                hint="The province used as the baseline for comparison."
                value={province}
                onChange={(v) => setProvince(v as ProvinceCode)}
                options={PROVINCES}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left text-xs uppercase tracking-wide text-[var(--muted)]">
                  <th className="px-3 py-3 font-normal">Province</th>
                  <th className="px-3 py-3 text-right font-normal">
                    Net / (tax)
                  </th>
                  <th className="px-3 py-3 text-right font-normal">
                    Total tax / (credit)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {rows.map((r, i) => (
                  <tr
                    key={r.province}
                    className={i === 0 ? 'bg-[var(--surface-2)]' : ''}
                  >
                    <td className="px-3 py-3 font-medium text-[var(--ink)]">
                      {r.label}
                    </td>
                    <td
                      className={`px-3 py-3 text-right font-semibold ${
                        r.netPay >= 0
                          ? 'text-[var(--ink)]'
                          : 'text-[var(--orange-600)]'
                      }`}
                    >
                      {currency(r.netPay)}
                    </td>
                    <td
                      className={`px-3 py-3 text-right font-medium ${
                        r.totalTax >= 0
                          ? 'text-[var(--ink)]'
                          : 'text-[var(--orange-600)]'
                      }`}
                    >
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
