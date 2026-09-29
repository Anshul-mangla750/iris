/**
 * Formats a number into Indian Rupee format: e.g. 428760 -> "₹ 4,28,760"
 */
export function formatCurrencyINR(amount: number): string {
  if (typeof amount !== 'number' || isNaN(amount)) return '₹ 0';
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount);
  return `₹ ${formatted}`;
}

/**
 * Formats footfall or numeric counts with comma separators: e.g. 2854 -> "2,854"
 */
export function formatNumberIN(num: number): string {
  if (typeof num !== 'number' || isNaN(num)) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
}
