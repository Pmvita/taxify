import * as React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
}

export function Input({ label, hint, id, className = '', ...rest }: InputProps) {
  return (
    <div className="w-full">
      <label className="mb-1.5 block text-sm font-medium text-[var(--ink)]">
        {label}
      </label>
      <input
        id={id}
        className="w-full h-11 px-3 rounded-xl border border-[var(--border)] bg-white text-[var(--ink)] text-sm shadow-sm outline-none transition placeholder:font-normal placeholder:text-[var(--muted)] focus:border-[var(--steel)] focus:ring-2 focus:ring-[var(--steel)]/20"
        {...rest}
      />
      {hint ? <p className="mt-1 text-xs text-[var(--muted)]">{hint}</p> : null}
    </div>
  );
}
