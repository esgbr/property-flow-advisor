
import { format, formatDistanceToNow, differenceInDays } from "date-fns";
import { de, enUS } from "date-fns/locale";

/**
 * Format a date with consistent styling across the application
 */
export function formatDate(
  date: Date | string | number,
  formatStr: string = "PPP",
  language: "en" | "de" = "en"
): string {
  const dateObj = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  const locale = language === "de" ? de : enUS;
  
  return format(dateObj, formatStr, { locale });
}

/**
 * Format a date as relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(
  date: Date | string | number,
  language: "en" | "de" = "en"
): string {
  const dateObj = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  const locale = language === "de" ? de : enUS;
  
  const daysAgo = differenceInDays(new Date(), dateObj);
  
  if (daysAgo > 30) {
    return format(dateObj, "PPP", { locale });
  }
  
  return formatDistanceToNow(dateObj, {
    addSuffix: true,
    locale,
  });
}

/**
 * Format a date for display in a calendar
 */
export function formatCalendarDate(
  date: Date | string | number,
  language: "en" | "de" = "en"
): string {
  const dateObj = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  const locale = language === "de" ? de : enUS;
  
  return format(dateObj, "EEEE, d MMMM yyyy", { locale });
}
