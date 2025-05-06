
import { toast } from 'sonner';

/**
 * Utility functions for security-related operations
 */

// Check password strength
export const checkPasswordStrength = (password: string): {
  score: number;
  feedback: string;
} => {
  if (!password) return { score: 0, feedback: 'Password is required' };
  
  let score = 0;
  
  // Length check
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  
  // Complexity checks
  if (/[A-Z]/.test(password)) score += 1; // Has uppercase
  if (/[a-z]/.test(password)) score += 1; // Has lowercase
  if (/[0-9]/.test(password)) score += 1; // Has number
  if (/[^A-Za-z0-9]/.test(password)) score += 1; // Has special char
  
  // Normalize score to 0-100
  const normalizedScore = Math.min(Math.round((score / 6) * 100), 100);
  
  // Generate feedback
  let feedback = '';
  if (normalizedScore < 40) {
    feedback = 'Weak password';
  } else if (normalizedScore < 70) {
    feedback = 'Moderate password';
  } else {
    feedback = 'Strong password';
  }
  
  return { score: normalizedScore, feedback };
};

// Detect suspicious login patterns
export const detectSuspiciousLogin = (
  currentLogin: { time: Date; location?: string; device?: string },
  previousLogin?: { time: Date; location?: string; device?: string }
): boolean => {
  if (!previousLogin) return false;
  
  // Check for logins from different locations in short time
  if (
    previousLogin.location && 
    currentLogin.location && 
    previousLogin.location !== currentLogin.location
  ) {
    const timeDiff = currentLogin.time.getTime() - previousLogin.time.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    // If locations different and time difference is less than 2 hours
    if (hoursDiff < 2) {
      return true;
    }
  }
  
  // Check for unusual device change
  if (
    previousLogin.device &&
    currentLogin.device &&
    previousLogin.device !== currentLogin.device
  ) {
    return true;
  }
  
  return false;
};

// Anonymize sensitive data for logging
export const anonymizeData = (data: string): string => {
  // Anonymize email
  if (data.includes('@')) {
    return data.replace(/(.{2})(.*)(@.*)/, '$1***$3');
  }
  
  // Credit card number
  if (/^\d{13,19}$/.test(data)) {
    return data.replace(/(\d{4})(\d+)(\d{4})/, '$1 **** **** $3');
  }
  
  // Phone number
  if (/^\+?[\d\s]{10,15}$/.test(data)) {
    return data.replace(/(\+\d{1,3}|\d{1,4})(.*)(\d{2})/, '$1******$3');
  }
  
  // Default for other data types
  if (data.length > 5) {
    return `${data.substring(0, 2)}***${data.substring(data.length - 2)}`;
  }
  
  return '****';
};

// Security event logger
export const logSecurityEvent = (
  eventType: 'login' | 'logout' | 'pin_change' | 'password_change' | 'suspicious_activity',
  details: Record<string, any> = {},
  notifyUser: boolean = false
): void => {
  // Create sanitized log entry
  const sanitizedDetails = { ...details };
  
  // Remove sensitive data
  if (sanitizedDetails.password) sanitizedDetails.password = '[REDACTED]';
  if (sanitizedDetails.pin) sanitizedDetails.pin = '[REDACTED]';
  if (sanitizedDetails.token) sanitizedDetails.token = '[REDACTED]';
  
  // Add timestamp
  const logEntry = {
    type: eventType,
    timestamp: new Date().toISOString(),
    ...sanitizedDetails
  };
  
  // In a real app, you would send this to a secure logging service
  console.log('Security event:', logEntry);
  
  // Optionally notify user
  if (notifyUser) {
    toast.info(`Security event: ${eventType}`, {
      description: 'Check your security settings for details',
      duration: 5000
    });
  }
};

export default {
  checkPasswordStrength,
  detectSuspiciousLogin,
  anonymizeData,
  logSecurityEvent
};
