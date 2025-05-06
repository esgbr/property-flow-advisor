
/**
 * Utility functions for formatting data
 */

export type Language = 'de' | 'en';

/**
 * Format a number according to the specified language
 * @param value The number to format
 * @param language The language to format the number in ('de' or 'en')
 * @returns Formatted number as string
 */
export const formatNumber = (value: number, language: string): string => {
  const locale = language === 'de' ? 'de-DE' : 'en-US';
  
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Format a currency value according to the specified language and currency
 * @param value The value to format
 * @param language The language to format in ('de' or 'en')
 * @param currency The currency code (default: 'EUR')
 * @returns Formatted currency string
 */
export const formatCurrency = (
  value: number, 
  language: string, 
  currency: string = 'EUR'
): string => {
  const locale = language === 'de' ? 'de-DE' : 'en-US';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Format a date according to the specified language
 * @param date The date to format
 * @param language The language to format in ('de' or 'en')
 * @param options Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date | string,
  language: string,
  options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const locale = language === 'de' ? 'de-DE' : 'en-US';
  
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
};

/**
 * Format a percentage value
 * @param value The decimal value to format as percentage (e.g., 0.05 for 5%)
 * @param language The language to format in ('de' or 'en')
 * @param decimals Number of decimal places
 * @returns Formatted percentage string
 */
export const formatPercentage = (
  value: number,
  language: string,
  decimals: number = 2
): string => {
  const locale = language === 'de' ? 'de-DE' : 'en-US';
  
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
};

/**
 * Format a file size in bytes to a human-readable string
 * @param bytes The size in bytes
 * @param language The language to format in ('de' or 'en')
 * @returns Formatted file size string
 */
export const formatFileSize = (bytes: number, language: string): string => {
  const locale = language === 'de' ? 'de-DE' : 'en-US';
  
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(bytes / Math.pow(k, i))} ${sizes[i]}`;
};

export default {
  formatNumber,
  formatCurrency,
  formatDate,
  formatPercentage,
  formatFileSize
};
