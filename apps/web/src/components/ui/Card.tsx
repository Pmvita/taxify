export interface CardProps {
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export function Card({ children, className = '', action }: CardProps) {
  return (
    <div className={`bg-[var(--bg-elev)] rounded-[var(--radius)] border border-[var(--border)] shadow-[var(--shadow-sm)] p-6 sm:p-7 ${className}`}>
      {action ? <div className="mb-4 flex items-center justify-between">{action}</div> : null}
      {children}
    </div>
  );
}
