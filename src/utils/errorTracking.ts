
/**
 * Error tracking utilities for monitoring application health
 */

// Define structure for error capture
interface ErrorCapture {
  error: Error;
  metadata?: Record<string, any>;
  timestamp: Date;
}

// In-memory store for errors
const errorStore: ErrorCapture[] = [];

/**
 * Capture an exception for tracking and analysis
 * @param error - The error to capture
 * @param options - Additional options and metadata
 */
export const captureException = (
  error: Error, 
  options?: { extra?: Record<string, any> }
) => {
  // Save locally for in-app monitoring
  errorStore.push({
    error,
    metadata: options?.extra,
    timestamp: new Date()
  });
  
  // Limit local error storage
  if (errorStore.length > 100) {
    errorStore.shift();
  }
  
  // In a real app, you would send this to an error tracking service
  // like Sentry, LogRocket, or your backend
  console.error('[ErrorTracking] Error captured:', error);
  if (options?.extra) {
    console.error('Additional information:', options.extra);
  }
};

/**
 * Get all captured errors
 * @returns The list of captured errors
 */
export const getCapturedErrors = (): ErrorCapture[] => {
  return [...errorStore];
};

/**
 * Clear all captured errors
 */
export const clearErrors = (): void => {
  errorStore.length = 0;
};

/**
 * Get error statistics
 * @returns Error statistics by type
 */
export const getErrorStatistics = (): Record<string, number> => {
  const stats: Record<string, number> = {};
  
  errorStore.forEach(capture => {
    const errorType = capture.error.name || 'Unknown';
    stats[errorType] = (stats[errorType] || 0) + 1;
  });
  
  return stats;
};

/**
 * Check if user is experiencing frequent errors
 * @param timeWindow - Time window to check in minutes
 * @param threshold - Number of errors that indicates a problem
 * @returns Whether the user is having error problems
 */
export const isUserExperiencingFrequentErrors = (
  timeWindow: number = 5,
  threshold: number = 3
): boolean => {
  const now = new Date();
  const windowMs = timeWindow * 60 * 1000;
  
  const recentErrors = errorStore.filter(capture => {
    const timeDiff = now.getTime() - capture.timestamp.getTime();
    return timeDiff <= windowMs;
  });
  
  return recentErrors.length >= threshold;
};

/**
 * Create an error report for support
 * @returns Formatted error report
 */
export const createErrorReport = (): string => {
  if (errorStore.length === 0) {
    return "No errors recorded.";
  }
  
  let report = "Error Report\n";
  report += "================\n\n";
  
  errorStore.forEach((capture, index) => {
    report += `Error ${index + 1}: ${capture.error.name}\n`;
    report += `Time: ${capture.timestamp.toISOString()}\n`;
    report += `Message: ${capture.error.message}\n`;
    if (capture.error.stack) {
      report += `Stack: ${capture.error.stack}\n`;
    }
    if (capture.metadata) {
      report += `Metadata: ${JSON.stringify(capture.metadata, null, 2)}\n`;
    }
    report += "\n";
  });
  
  report += `User Agent: ${navigator.userAgent}\n`;
  report += `URL: ${window.location.href}\n`;
  report += `Generated: ${new Date().toISOString()}\n`;
  
  return report;
};
