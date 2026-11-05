export interface LabelProps {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}

export function Label({ htmlFor, children, required }: LabelProps) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-[var(--ink)]">
      {children}
      {required ? <span className="text-[var(--orange-600)] font-semibold"> *</span> : null}
    </label>
  );
}
