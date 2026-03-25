/**
 * Formatting utilities for Rupiah currency
 */

/**
 * Format a number to Rupiah currency string with thousand separators
 * @param amount - The amount in Rupiah (as number or string)
 * @returns Formatted string like "Rp 10.000.000"
 */
export function formatRupiah(amount: number | string): string {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num)) return 'Rp 0';

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(num);
}

/**
 * Parse a formatted Rupiah string back to number
 * Handles strings like "Rp 10.000.000" or "10000000"
 * @param formatted - The formatted Rupiah string
 * @returns The numeric value
 */
export function parseRupiah(formatted: string): number {
    // Remove all non-digit characters except decimal point
    const cleaned = formatted.replace(/[^\d,.]/g, '').replace(',', '.');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
}

/**
 * Format a number with thousand separators (without currency symbol)
 * @param amount - The amount to format
 * @returns Formatted string like "10.000.000"
 */
export function formatNumber(amount: number | string): string {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num)) return '0';

    return new Intl.NumberFormat('id-ID').format(num);
}