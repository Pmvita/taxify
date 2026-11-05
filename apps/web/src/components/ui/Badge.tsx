export interface BadgeProps {
  variant?: 'default' | 'orange' | 'muted' | 'green';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-[var(--steel-200)] text-[var(--steel-600)]',
    orange: 'bg-[var(--orange-soft)] text-[var(--orange-600)]',
    muted: 'bg-[var(--surface-2)] text-[var(--muted)]',
    green: 'bg-[var(--orange-soft)] text-[var(--steel-700)]',
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
