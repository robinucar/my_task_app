/**
 * Format a date string into a localized date string (e.g., DD/MM/YYYY).
 * Returns '—' if input is null, undefined, or invalid.
 */
export const formatDate = (date?: string | Date | null): string => {
  if (!date) return '—';

  const parsedDate = typeof date === 'string' ? new Date(date) : date;

  // Optional: Check if invalid date
  if (isNaN(parsedDate.getTime())) return '—';

  return parsedDate.toLocaleDateString(); // You can pass 'en-GB' if needed
};

/**
 * Format a description string or fallback to '—' if empty.
 */
export const formatDescription = (desc?: string): string => desc || '—';
