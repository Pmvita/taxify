import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const variantStyles: Record<string, string> = {
    primary:
      'bg-[var(--steel)] text-white shadow-sm hover:bg-[var(--steel-600)] focus-visible:outline-[var(--steel)] focus-visible:ring-2 focus-visible:ring-[var(--steel)] focus-visible:ring-offset-2',
    secondary:
      'bg-white text-[var(--steel)] border border-[var(--border)] shadow-sm hover:bg-[var(--surface-2)] focus-visible:outline-[var(--steel)] focus-visible:ring-2 focus-visible:ring-[var(--steel)] focus-visible:ring-offset-2',
    ghost:
      'text-[var(--ink-soft)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)] focus-visible:outline-[var(--steel)] focus-visible:ring-2 focus-visible:ring-[var(--steel)]',
    danger: 'bg-[var(--orange-soft)] text-[var(--orange-600)] hover:bg-[var(--orange)] hover:text-white focus-visible:outline-[var(--orange-600)] focus-visible:ring-2 focus-visible:ring-[var(--orange-600)] focus-visible:ring-offset-2',
  };
  const sizeStyles: Record<string, string> = {
    sm: 'h-9 px-4 text-sm gap-2 rounded-xl',
    md: 'h-11 px-5 text-sm gap-2 rounded-xl',
    lg: 'h-13 px-6 text-base gap-2 rounded-xl',
  };
  return (
    <button
      className={`inline-flex items-center justify-center font-medium transition-all duration-150 active:scale-[.98] disabled:opacity-50 disabled:pointer-events-none select-none ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={rest.disabled ?? false}
      {...rest}
    >
      {children}
    </button>
  );
}
