export type Band = 'Excellent' | 'Good' | 'Pass' | 'Needs review';

export function percentOf(correct: number, total: number): number {
  return total === 0 ? 0 : Math.round((correct / total) * 100);
}

export function bandOf(percent: number): { label: Band; variant: 'success' | 'primary' | 'warning' | 'danger' } {
  if (percent >= 90) return { label: 'Excellent', variant: 'success' };
  if (percent >= 70) return { label: 'Good', variant: 'primary' };
  if (percent >= 50) return { label: 'Pass', variant: 'warning' };
  return { label: 'Needs review', variant: 'danger' };
}
