
import { captureException } from '@/utils/errorTracking';

/**
 * Error boundary utilities for standardized error handling
 */

// Define error types for better categorization
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface ErrorInfo {
  componentStack: string;
  severity?: ErrorSeverity;
  recoverable?: boolean;
  userFeedback?: string;
}

/**
 * Process and log an error with standardized formatting
 * @param error - The error object
 * @param errorInfo - Additional error information
 */
export const processError = (
  error: Error, 
  errorInfo: ErrorInfo,
  userId?: string
) => {
  // Include useful metadata
  const metadata = {
    timestamp: new Date().toISOString(),
    userId,
    url: window.location.href,
    severity: errorInfo.severity || ErrorSeverity.MEDIUM,
    recoverable: errorInfo.recoverable !== undefined ? errorInfo.recoverable : true,
    componentStack: errorInfo.componentStack,
    userAgent: navigator.userAgent
  };
  
  // Log the error to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('[ErrorBoundary]', error);
    console.error('Error metadata:', metadata);
    console.error('Component stack:', errorInfo.componentStack);
  }
  
  // Capture for error tracking (e.g., Sentry)
  captureException(error, { 
    extra: metadata
  });
  
  return metadata;
};

/**
 * Determine if an error is recoverable
 * @param error - The error to analyze
 * @returns Whether the application can recover from this error
 */
export const isRecoverableError = (error: Error): boolean => {
  // Network errors can often be retried
  if (error.name === 'NetworkError' || error.message.includes('network')) {
    return true;
  }
  
  // Check for known unrecoverable errors
  const unrecoverablePatterns = [
    'Cannot read properties of undefined',
    'Maximum update depth exceeded',
    'Minified React error #423'
  ];
  
  for (const pattern of unrecoverablePatterns) {
    if (error.message.includes(pattern)) {
      return false;
    }
  }
  
  return true;
};

/**
 * Get user-friendly error message from technical error
 * @param error - The error to translate
 * @returns User-friendly error message
 */
export const getUserFriendlyErrorMessage = (error: Error): string => {
  // Common error messages mapped to user-friendly versions
  const errorMessages: Record<string, string> = {
    'Failed to fetch': 'Unable to connect to the server. Please check your internet connection.',
    'Network error': 'Network connection problem. Please try again later.',
    'TypeError': 'Something unexpected happened. The application will recover shortly.',
    'ChunkLoadError': 'Had trouble loading some content. Please refresh the page.',
    'SyntaxError': 'There was a problem with the data. Please try again later.'
  };
  
  // Find matching error pattern
  const errorType = Object.keys(errorMessages).find(type => 
    error.name.includes(type) || error.message.includes(type)
  );
  
  return errorType 
    ? errorMessages[errorType]
    : 'An unexpected error occurred. Please try again later.';
};

/**
 * Utility to check if an error requires application restart
 */
export const requiresAppRestart = (error: Error): boolean => {
  const criticalErrors = [
    'Maximum update depth exceeded',
    'Minified React error #423',
    'Unrecoverable React state corruption'
  ];
  
  return criticalErrors.some(pattern => error.message.includes(pattern));
};
