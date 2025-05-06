
import { captureException, createErrorReport } from './errorTracking';
import { isRecoverableError, ErrorSeverity, getUserFriendlyErrorMessage } from './errorBoundaryUtils';

/**
 * Enhanced error diagnostics utility for identifying and addressing errors
 */

// Interface for diagnostic result
export interface ErrorDiagnostic {
  errorType: string;
  rootCause: string;
  suggestedFix: string;
  severity: ErrorSeverity;
  recoverable: boolean;
  relatedComponents?: string[];
  userMessage: string;
  debugInfo?: Record<string, any>;
}

// Error signatures for common issues
const errorSignatures: Record<string, Partial<ErrorDiagnostic>> = {
  'TypeError: Cannot read properties of undefined': {
    errorType: 'Null Reference',
    rootCause: 'Attempted to access properties on an undefined object',
    suggestedFix: 'Add null checks or optional chaining',
    severity: ErrorSeverity.MEDIUM,
  },
  'Uncaught SyntaxError': {
    errorType: 'Syntax Error',
    rootCause: 'JavaScript syntax is invalid',
    suggestedFix: 'Review recent code changes for syntax errors',
    severity: ErrorSeverity.HIGH,
  },
  'ChunkLoadError': {
    errorType: 'Resource Loading',
    rootCause: 'Failed to load script or resource',
    suggestedFix: 'Check network connectivity or rebuild application',
    severity: ErrorSeverity.MEDIUM,
  },
  'React Invariant Violation': {
    errorType: 'React Error',
    rootCause: 'React component lifecycle issue',
    suggestedFix: 'Check component lifecycle methods and state updates',
    severity: ErrorSeverity.HIGH,
  },
  'Maximum update depth exceeded': {
    errorType: 'Infinite Loop',
    rootCause: 'Component is re-rendering indefinitely',
    suggestedFix: 'Check useEffect dependencies or event handlers',
    severity: ErrorSeverity.CRITICAL,
  },
  'NetworkError': {
    errorType: 'Network Issue',
    rootCause: 'API request failed',
    suggestedFix: 'Check network connectivity or API endpoint',
    severity: ErrorSeverity.MEDIUM,
  }
};

/**
 * Analyze error and provide diagnostic information
 */
export const diagnoseError = (error: Error, componentStack?: string): ErrorDiagnostic => {
  // Find matching error signature
  const signature = Object.keys(errorSignatures).find(key => 
    error.message.includes(key) || error.name.includes(key)
  );
  
  const baseDiagnostic = signature 
    ? errorSignatures[signature]
    : {
        errorType: 'Unknown Error',
        rootCause: 'Could not determine root cause',
        suggestedFix: 'Review recent changes',
        severity: ErrorSeverity.MEDIUM,
      };
  
  // Extract component names from stack
  const relatedComponents = componentStack 
    ? componentStack
        .split('\n')
        .filter(line => line.includes('at '))
        .map(line => {
          const match = line.match(/at ([A-Za-z0-9_]+)/);
          return match ? match[1] : null;
        })
        .filter(Boolean) as string[]
    : undefined;
  
  // Determine if error is recoverable
  const recoverable = isRecoverableError(error);
  
  // Create user-friendly message
  const userMessage = getUserFriendlyErrorMessage(error);
  
  // Create diagnostic object
  const diagnostic: ErrorDiagnostic = {
    ...baseDiagnostic as any,
    recoverable,
    userMessage,
    relatedComponents,
    debugInfo: {
      timestamp: new Date().toISOString(),
      errorName: error.name,
      errorMessage: error.message,
      stack: error.stack,
      componentStack
    }
  };
  
  // Log diagnostic for debugging
  console.error('[ErrorDiagnostic]', diagnostic);
  
  // Capture in error tracking system
  captureException(error, { 
    extra: { 
      diagnostic,
      componentStack
    } 
  });
  
  return diagnostic;
};

/**
 * Try to recover from error automatically
 */
export const attemptErrorRecovery = (diagnostic: ErrorDiagnostic): boolean => {
  // Only attempt recovery for recoverable errors
  if (!diagnostic.recoverable) {
    return false;
  }
  
  // Recovery strategies based on error type
  switch (diagnostic.errorType) {
    case 'Network Issue':
      // For network issues, we could retry the request
      console.log('[ErrorRecovery] Retrying network request');
      // Implementation would depend on the app's networking layer
      return true;
      
    case 'Null Reference':
      // For null references, we could attempt to reinitialize state
      console.log('[ErrorRecovery] Attempting to restore default state');
      // Implementation would depend on the app's state management
      return true;
      
    default:
      // No automatic recovery strategy available
      return false;
  }
};

/**
 * Generate comprehensive error report
 */
export const generateErrorDiagnosticReport = (
  error: Error, 
  componentStack?: string,
  additionalContext?: Record<string, any>
): string => {
  const diagnostic = diagnoseError(error, componentStack);
  
  let report = createErrorReport();
  
  // Add diagnostic-specific information
  report += "\n\nDIAGNOSTIC INFORMATION\n";
  report += "======================\n\n";
  report += `Error Type: ${diagnostic.errorType}\n`;
  report += `Root Cause: ${diagnostic.rootCause}\n`;
  report += `Suggested Fix: ${diagnostic.suggestedFix}\n`;
  report += `Severity: ${diagnostic.severity}\n`;
  report += `Recoverable: ${diagnostic.recoverable}\n`;
  
  if (diagnostic.relatedComponents && diagnostic.relatedComponents.length > 0) {
    report += `Related Components: ${diagnostic.relatedComponents.join(', ')}\n`;
  }
  
  if (additionalContext) {
    report += "\n\nADDITIONAL CONTEXT\n";
    report += "=================\n\n";
    Object.entries(additionalContext).forEach(([key, value]) => {
      report += `${key}: ${JSON.stringify(value, null, 2)}\n`;
    });
  }
  
  return report;
};
