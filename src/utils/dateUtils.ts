
/**
 * Utility functions for date formatting and manipulation
 */

import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Format a date according to the user's locale
 */
export function formatDate(date: Date | string, format: 'short' | 'medium' | 'long' = 'medium'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = {
    short: { month: 'numeric', day: 'numeric', year: '2-digit' },
    medium: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
  }[format];
  
  return new Intl.DateTimeFormat('en-US', options).format(dateObj);
}

/**
 * Format a date with time according to the user's locale
 */
export function formatDateTime(date: Date | string, format: 'short' | 'medium' | 'long' = 'medium'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = {
    short: { month: 'numeric', day: 'numeric', year: '2-digit', hour: 'numeric', minute: '2-digit' },
    medium: { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' },
    long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit' }
  }[format];
  
  return new Intl.DateTimeFormat('en-US', options).format(dateObj);
}

/**
 * Calculate relative time (e.g., "2 days ago", "in 3 hours")
 */
export function getRelativeTime(date: Date | string, language: string = 'en'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(language, { numeric: 'auto' });
  
  if (Math.abs(diffInSeconds) < 60) {
    return rtf.format(-Math.round(diffInSeconds), 'second');
  }
  
  const diffInMinutes = diffInSeconds / 60;
  if (Math.abs(diffInMinutes) < 60) {
    return rtf.format(-Math.round(diffInMinutes), 'minute');
  }
  
  const diffInHours = diffInMinutes / 60;
  if (Math.abs(diffInHours) < 24) {
    return rtf.format(-Math.round(diffInHours), 'hour');
  }
  
  const diffInDays = diffInHours / 24;
  if (Math.abs(diffInDays) < 30) {
    return rtf.format(-Math.round(diffInDays), 'day');
  }
  
  const diffInMonths = diffInDays / 30;
  if (Math.abs(diffInMonths) < 12) {
    return rtf.format(-Math.round(diffInMonths), 'month');
  }
  
  const diffInYears = diffInDays / 365;
  return rtf.format(-Math.round(diffInYears), 'year');
}

/**
 * React hook for date formatting based on app language
 */
export function useDateFormatter() {
  const { language } = useLanguage();
  
  return {
    formatDate: (date: Date | string, format: 'short' | 'medium' | 'long' = 'medium') => {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      
      const options: Intl.DateTimeFormatOptions = {
        short: { month: 'numeric', day: 'numeric', year: '2-digit' },
        medium: { month: 'short', day: 'numeric', year: 'numeric' },
        long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
      }[format];
      
      return new Intl.DateTimeFormat(language === 'de' ? 'de-DE' : 'en-US', options).format(dateObj);
    },
    formatDateTime: (date: Date | string, format: 'short' | 'medium' | 'long' = 'medium') => {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      
      const options: Intl.DateTimeFormatOptions = {
        short: { month: 'numeric', day: 'numeric', year: '2-digit', hour: 'numeric', minute: '2-digit' },
        medium: { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' },
        long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }
      }[format];
      
      return new Intl.DateTimeFormat(language === 'de' ? 'de-DE' : 'en-US', options).format(dateObj);
    },
    getRelativeTime: (date: Date | string) => {
      return getRelativeTime(date, language);
    }
  };
}
