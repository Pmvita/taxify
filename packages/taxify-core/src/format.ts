export function currency(value: number, sign = '$'): string {
  const negative = value < 0;
  const abs = Math.abs(value);
  const formatted = abs.toLocaleString('en-CA', { maximumFractionDigits: 2 });
  return `${negative ? '-' : ''}${sign}${formatted}`;
}

export function percent(value: number, sign = '%'): string {
  return `${value.toFixed(2)}${sign}`;
}
