import type { EmployeeTaxResult, SoleProprietorResult, CorporateResult } from '@taxify/core';
import { currency } from '@taxify/core';

export interface ResultSummaryProps {
  title: string;
  employee?: EmployeeTaxResult;
  proprietor?: SoleProprietorResult;
  corporate?: CorporateResult;
  showNetPay?: boolean;
}

export function ResultSummary({ title, employee, proprietor, corporate, showNetPay = true }: ResultSummaryProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <SummaryCard label="Gross income" value={employee?.gross ?? proprietor?.revenue ?? corporate?.taxableIncome ?? 0} />
      <SummaryCard
        label="Total tax"
        value={employee?.totalIncomeTax ?? proprietor?.totalIncomeTax ?? corporate?.total ?? 0}
      />
      <SummaryCard label="CPP" value={employee?.cpp ?? proprietor?.cpp ?? 0} />
      <SummaryCard label="EI" value={employee?.ei ?? proprietor?.ei ?? 0} />
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">{label}</p>
      <p className="mt-1 text-lg font-semibold text-[var(--ink)]">{currency(value)}</p>
    </div>
  );
}
