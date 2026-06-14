export function parseDecimal(v: string): number {
  const n = parseFloat(v.replace(',', '.'));
  return isNaN(n) ? 0 : n;
}

export function fmt(value: number): string {
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
}
