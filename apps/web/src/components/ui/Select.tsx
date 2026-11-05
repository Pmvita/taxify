import * as React from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  hint?: string;
}

export function Select({ label, options, hint, id, className = '', ...rest }: SelectProps) {
  return (
    <div className="w-full">
      <label className="mb-1.5 block text-sm font-medium text-[var(--ink)]">
        {label}
      </label>
      <select
        id={id}
        className="w-full h-11 px-3 rounded-xl border border-[var(--border)] bg-white text-[var(--ink)] text-sm shadow-sm outline-none transition appearance-none cursor-pointer focus:border-[var(--steel)] focus:ring-2 focus:ring-[var(--steel)]/20"
        {...rest}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint ? <p className="mt-1 text-xs text-[var(--muted)]">{hint}</p> : null}
    </div>
  );
}
