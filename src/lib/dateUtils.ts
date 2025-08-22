/**
 * Formats a date string consistently for both server-side rendering and client-side hydration.
 * Uses UTC timezone to prevent hydration mismatches between server and client.
 * 
 * @param date - The date string to format
 * @returns Formatted date string (e.g., "Dec 25, 2023")
 */
export const formatPostDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    timeZone: 'UTC'
  });
};