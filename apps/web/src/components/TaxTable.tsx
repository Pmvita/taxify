'use client';

import type { TaxResult, ProvinceCode } from '@taxify/core';
import { getRateTable } from '@taxify/core';
import { currency } from '@taxify/core';

export interface TaxTableProps {
  province: ProvinceCode;
  income: number;
}

const YEAR = 2025;



export function TaxTable({ province, income }: TaxTableProps) {
  const table = getRateTable(2025);
  const j = table.provinces[province];
  if (!j) return null;
  const taxable = Math.max(0, income);
  const rows: React.ReactElement[] = [];
  let running = 0;

  for (let i = 0; i < j.brackets.length; i++) {
    const b = j.brackets[i];
    if (!b) continue;
    const upper = i === j.brackets.length - 1 ? Infinity : j.brackets[i + 1]!.start;
    const lower = i === 0 ? 0 : j.brackets[i - 1]!.start;
    const slice = Math.max(0, Math.min(taxable, upper) - lower);
    if (slice <= 0) continue;

    const tax = slice * b.rate;
    running += tax;
    const range = upper === Infinity ? `${currency(lower)}+` : `${currency(lower)} – ${currency(upper)}`;

    rows.push(
      <tr key={b.start}>
        <td className="px-2 text-sm font-medium text-[var(--ink)]">{b.rate * 100}%</td>
        <td className="px-2 text-sm text-[var(--muted)]">{range}</td>
        <td className="px-2 text-sm text-[var(--ink)]">{currency(tax)}</td>
      </tr>,
    );
  }
  const totalTax = rows.length ? running : 0;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] text-left text-xs uppercase tracking-wide text-[var(--muted)]">
            <th className="px-2 py-2 font-normal">Bracket</th>
            <th className="px-2 py-2 font-normal">Income</th>
            <th className="px-2 py-2 font-normal">Rate</th>
            <th className="px-2 py-2 font-normal">Tax</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--line)]">
          {rows.length ? rows : (
            <tr>
              <td colSpan={4} className="px-2 py-4 text-sm text-[var(--muted)]">
                No tax on this income.
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr className="border-t border-[var(--border)] bg-[var(--surface-2)]">
            <td className="px-2 py-3 text-sm font-semibold text-[var(--ink)]">Total</td>
            <td className="px-2 py-3 text-sm text-[var(--ink-soft)]" />
            <td className="px-2 py-3 text-sm text-[var(--ink-soft)]" />
            <td className="px-2 py-3 text-sm font-semibold text-[var(--ink)]">{currency(totalTax)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
