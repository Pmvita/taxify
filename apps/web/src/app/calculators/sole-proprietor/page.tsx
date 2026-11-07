'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  calculateSoleProprietorTax,
  getRateTable,
  currency,
  federalNetTax,
  provincialNetTax,
} from '@taxify/core';
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

function Input({
  label,
  hint,
  id,
  className = '',
  children,
}: {
  label: string;
  hint?: string;
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`w-full ${className}`}>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-[var(--ink)]"
      >
        {label}
      </label>
      {children}
      {hint ? <p className="mt-1 text-xs text-[var(--muted)]">{hint}</p> : null}
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
    <Input label={label} hint={hint} id={id} className={className}>
      <input
        id={id}
        type="number"
        min={0}
        step={1000}
        value={value || ''}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-12 px-4 rounded-xl border border-[var(--border)] bg-white text-[var(--ink)] text-base shadow-sm outline-none transition placeholder:font-normal placeholder:text-[var(--muted)] focus:border-[var(--steel)] focus:ring-2 focus:ring-[var(--steel)]/20"
        {...rest}
      />
    </Input>
  );
}

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
    <Input label={label} hint={hint} id={id} className={className}>
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
    </Input>
  );
}

function Checkbox({
  label,
  hint,
  checked,
  onChange,
  id,
  className = '',
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  id?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 rounded border-[var(--border)] text-[var(--steel)] focus:ring-[var(--steel)]/20"
      />
      <div className="text-sm text-[var(--ink)]">
        <label htmlFor={id}>{label}</label>
        {hint ? <p className="mt-0.5 text-xs text-[var(--muted)]">{hint}</p> : null}
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">
        {label}
      </p>
      <p
        className={`mt-1 text-lg font-semibold ${
          accent ? 'text-[var(--steel)]' : 'text-[var(--ink)]'
        }`}
      >
        {currency(value)}
      </p>
    </div>
  );
}

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

  const grossIncome = result.businessNetIncome;

  return (
    <div>
      <div className="max-w-3xl">
        <p className="text-sm font-medium text-[var(--steel)]">
          Business — sole proprietor
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-[var(--ink)]">
          Business net income &amp; tax
        </h1>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">
          Enter your business revenue and expenses to estimate your net income,
          CPP/EI, and federal + provincial tax, plus your estimated quarterly
          instalments.
        </p>

        <div className="mt-6 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <NumberInput
                label="Business revenue (CAD)"
                hint="Total sales or income your business brings in."
                value={revenue}
                onChange={setRevenue}
              />
            </div>
            <div className="sm:col-span-2">
              <NumberInput
                label="Business expenses (CAD)"
                hint="Deductible costs that reduce your taxable income."
                value={expenses}
                onChange={setExpenses}
              />
            </div>
            <div>
              <Select
                label="Province"
                hint="Choose the province where your business operates."
                value={province}
                onChange={(v) => setProvince(v as ProvinceCode)}
                options={PROVINCES}
              />
            </div>
            <div>
              <Checkbox
                label="Claim CPP (deductible business expense)"
                hint="CPP contributions lower your taxable business income."
                checked={claimCpp}
                onChange={setClaimCpp}
              />
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <SummaryCard
                label="Gross income"
                value={result.revenue - result.expenses}
                accent
              />
              <SummaryCard label="Federal tax" value={result.federalTax} />
              <SummaryCard label="Provincial tax" value={result.provincialTax} />
              <SummaryCard
                label="Total income tax"
                value={result.totalIncomeTax}
                accent
              />
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="text-center">
                <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">
                  Net income
                </p>
                <p className="mt-0.5 text-xl font-semibold text-[var(--ink)]">
                  {currency(result.businessNetIncome)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">
                  CPP
                </p>
                <p className="mt-0.5 text-xl font-semibold text-[var(--ink)]">
                  {currency(result.cpp)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">
                  EI
                </p>
                <p className="mt-0.5 text-xl font-semibold text-[var(--ink)]">
                  {currency(result.ei)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">
                  Effective rate
                </p>
                <p className="mt-0.5 text-xl font-semibold text-[var(--steel)]">
                  {grossIncome > 0
                    ? `${((result.totalIncomeTax / grossIncome) * 100).toFixed(1)}%`
                    : '0%'}
                </p>
              </div>
            </div>

            <div className="mt-4 border-t border-[var(--line)] pt-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="text-center">
                  <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">
                    Federal rate
                  </p>
                  <p className="mt-0.5 text-lg font-semibold text-[var(--ink)]">
                    {result.federalTax > 0
                      ? `${((result.federalTax / grossIncome) * 100).toFixed(1)}%`
                      : '0%'}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">
                    Provincial rate
                  </p>
                  <p className="mt-0.5 text-lg font-semibold text-[var(--ink)]">
                    {result.provincialTax > 0
                      ? `${((result.provincialTax / grossIncome) * 100).toFixed(1)}%`
                      : '0%'}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-t border-[var(--line)] pt-4">
                <span className="text-xs text-[var(--muted)]">
                  Estimated quarterly instalment
                </span>
                <span className="text-xl font-bold text-[var(--steel)]">
                  {currency(result.estQuarterly[0] ?? 0)}
                </span>
                <span className="text-xs text-[var(--muted)]">
                  per quarter (4 equal payments)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
