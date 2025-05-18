
import { toast } from '@/components/ui/use-toast';

/**
 * Standardized error handling for the application
 */
export class AppError extends Error {
  code?: string;
  details?: Record<string, any>;
  
  constructor(message: string, code?: string, details?: Record<string, any>) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.details = details;
  }
}

/**
 * Handle errors in a consistent way across the application
 * 
 * @param error The error to handle
 * @param fallbackMessage A fallback message to display if the error doesn't have one
 * @param silent If true, won't display a toast notification
 */
export const handleError = (
  error: unknown, 
  fallbackMessage = 'An unexpected error occurred',
  silent = false
): AppError => {
  console.error('Error occurred:', error);
  
  let appError: AppError;
  
  if (error instanceof AppError) {
    appError = error;
  } else if (error instanceof Error) {
    appError = new AppError(error.message || fallbackMessage);
  } else if (typeof error === 'string') {
    appError = new AppError(error);
  } else {
    appError = new AppError(fallbackMessage);
  }
  
  if (!silent) {
    toast({
      title: 'Error',
      description: appError.message,
      variant: 'destructive',
    });
  }
  
  return appError;
};

/**
 * Wrap an async function with standardized error handling
 * 
 * @param fn The async function to wrap
 * @param fallbackMessage A fallback message to display if the function throws an error
 * @param silent If true, won't display a toast notification
 */
export const withErrorHandling = <T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  fallbackMessage = 'An unexpected error occurred',
  silent = false
) => {
  return async (...args: Args): Promise<T | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, fallbackMessage, silent);
      return null;
    }
  };
};
