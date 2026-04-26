import { format, formatDistanceToNow, differenceInDays, isToday as isTodayFns } from "date-fns";

/**
 * Formats a date using the provided pattern.
 */
export function formatDate(date: string | Date | number, pattern: string = "MMM d, yyyy"): string {
  return format(new Date(date), pattern);
}

/**
 * Returns the number of days since the provided date.
 */
export function daysSince(date: string | Date | number): number {
  return differenceInDays(new Date(), new Date(date));
}

/**
 * Specifically computes the day offset since the quit date.
 */
export function getDayOffset(quitDate: string | Date | number): number {
  return Math.max(0, differenceInDays(new Date(), new Date(quitDate)));
}

/**
 * Checks if the provided date is today.
 */
export function isToday(date: string | Date | number): boolean {
  return isTodayFns(new Date(date));
}

/**
 * Returns a relative time string (e.g., "2 hours ago").
 */
export function formatRelativeTime(date: string | Date | number): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}
