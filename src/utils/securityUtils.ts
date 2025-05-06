import { toast } from 'sonner';

/**
 * Utility functions for security-related operations
 */

// Check password strength with improved scoring algorithm
export const checkPasswordStrength = (password: string): {
  score: number;
  feedback: string;
  suggestions: string[];
} => {
  if (!password) return { 
    score: 0, 
    feedback: 'Password is required',
    suggestions: ['Enter a password']
  };
  
  let score = 0;
  const suggestions: string[] = [];
  
  // Length check with exponential scoring for length
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  
  if (password.length < 8) {
    suggestions.push('Use at least 8 characters');
  }
  
  // Complexity checks
  if (!/[A-Z]/.test(password)) {
    suggestions.push('Add uppercase letters');
  } else {
    score += 1;
  }
  
  if (!/[a-z]/.test(password)) {
    suggestions.push('Add lowercase letters');
  } else {
    score += 1;
  }
  
  if (!/[0-9]/.test(password)) {
    suggestions.push('Add numbers');
  } else {
    score += 1;
  }
  
  if (!/[^A-Za-z0-9]/.test(password)) {
    suggestions.push('Add special characters');
  } else {
    score += 1;
  }
  
  // Check for common patterns
  if (/^(12345|qwerty|password|admin|welcome).*/i.test(password)) {
    score -= 2;
    suggestions.push('Avoid common password patterns');
  }
  
  // Check for repeated characters
  if (/(.)\1{2,}/.test(password)) {
    score -= 1;
    suggestions.push('Avoid repeated characters');
  }
  
  // Check for sequential characters
  if (/(?:abc|bcd|cde|def|efg|123|234|345|456|567|678|789)/.test(password.toLowerCase())) {
    score -= 1;
    suggestions.push('Avoid sequential characters');
  }
  
  // Normalize score to 0-100
  const normalizedScore = Math.min(Math.max(Math.round((score / 7) * 100), 0), 100);
  
  // Generate feedback
  let feedback = '';
  if (normalizedScore < 40) {
    feedback = 'Weak password';
  } else if (normalizedScore < 70) {
    feedback = 'Moderate password';
  } else {
    feedback = 'Strong password';
  }
  
  return { score: normalizedScore, feedback, suggestions };
};

// Enhanced suspicious login detection with more sophisticated heuristics
export const detectSuspiciousLogin = (
  currentLogin: { time: Date; location?: string; device?: string; ip?: string; userAgent?: string },
  previousLogin?: { time: Date; location?: string; device?: string; ip?: string; userAgent?: string }
): { suspicious: boolean; reasons: string[] } => {
  if (!previousLogin) return { suspicious: false, reasons: [] };
  
  const reasons: string[] = [];
  
  // Check for logins from different locations in short time
  if (
    previousLogin.location && 
    currentLogin.location && 
    previousLogin.location !== currentLogin.location
  ) {
    const timeDiff = currentLogin.time.getTime() - previousLogin.time.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    // Calculate approximate travel speed between locations (simplified for example)
    const impossibleTravel = hoursDiff < 2;
    
    // If locations different and time difference implies impossible travel
    if (impossibleTravel) {
      reasons.push(`Rapid location change from ${previousLogin.location} to ${currentLogin.location}`);
    }
  }
  
  // Check for unusual device change
  if (
    previousLogin.device &&
    currentLogin.device &&
    previousLogin.device !== currentLogin.device
  ) {
    reasons.push(`Device changed from ${previousLogin.device} to ${currentLogin.device}`);
  }
  
  // Check for unusual IP address
  if (
    previousLogin.ip &&
    currentLogin.ip &&
    previousLogin.ip !== currentLogin.ip
  ) {
    reasons.push(`IP address changed from ${previousLogin.ip} to ${currentLogin.ip}`);
  }
  
  // Check for unusual user agent
  if (
    previousLogin.userAgent &&
    currentLogin.userAgent &&
    previousLogin.userAgent !== currentLogin.userAgent
  ) {
    reasons.push(`Browser/device signature changed`);
  }
  
  // Check for unusual time of day
  const currentLoginHour = currentLogin.time.getHours();
  const previousLoginHour = previousLogin.time.getHours();
  const hourDifference = Math.abs(currentLoginHour - previousLoginHour);
  
  if (hourDifference > 12) {
    reasons.push(`Unusual login time compared to previous login`);
  }
  
  return { 
    suspicious: reasons.length > 0,
    reasons 
  };
};

// Improved anonymization of sensitive data for GDPR compliance
export const anonymizeData = (data: string, type?: 'email' | 'creditCard' | 'phone' | 'address' | 'name'): string => {
  if (!data) return '';
  
  // Determine data type if not specified
  if (!type) {
    if (data.includes('@')) {
      type = 'email';
    } else if (/^\d{13,19}$/.test(data.replace(/\s/g, ''))) {
      type = 'creditCard';
    } else if (/^\+?[\d\s]{10,15}$/.test(data)) {
      type = 'phone';
    } else if (data.split(' ').length > 3) {
      type = 'address';
    } else {
      type = 'name';
    }
  }
  
  switch (type) {
    // Email: keep first two chars of local part and domain
    case 'email':
      return data.replace(/(.{2})(.*)(@.*)/, '$1***$3');
    
    // Credit card: keep first 4 and last 4 digits
    case 'creditCard':
      return data.replace(/\s+/g, '').replace(/(\d{4})(\d+)(\d{4})/, '$1 **** **** $3');
    
    // Phone: keep country code and last two digits
    case 'phone':
      return data.replace(/(\+\d{1,3}|\d{1,4})(.*)(\d{2})/, '$1******$3');
    
    // Address: anonymize except postal code
    case 'address':
      const words = data.split(' ');
      return words.map((word, i) => {
        // Keep postal codes (usually numeric)
        if (/^\d+$/.test(word)) return word;
        // Keep first letter of each word
        return word.substring(0, 1) + '***';
      }).join(' ');
    
    // Name: keep first letter
    case 'name':
      const names = data.split(' ');
      return names.map(name => name.substring(0, 1) + '***').join(' ');
    
    // Default for other data types
    default:
      if (data.length > 5) {
        return `${data.substring(0, 2)}***${data.substring(data.length - 2)}`;
      }
      return '****';
  }
};

// Enhanced security event logger with severity levels and more structured data
export const logSecurityEvent = (
  eventType: 'login' | 'logout' | 'pin_change' | 'password_change' | 'suspicious_activity' | 'login_failure' | 'permission_change' | 'account_locked',
  details: Record<string, any> = {},
  options: {
    severity?: 'info' | 'warning' | 'critical';
    notifyUser?: boolean;
    persistToDB?: boolean;
  } = {}
): void => {
  const { 
    severity = 'info', 
    notifyUser = false, 
    persistToDB = false 
  } = options;
  
  // Create sanitized log entry
  const sanitizedDetails = { ...details };
  
  // Remove sensitive data
  if (sanitizedDetails.password) sanitizedDetails.password = '[REDACTED]';
  if (sanitizedDetails.pin) sanitizedDetails.pin = '[REDACTED]';
  if (sanitizedDetails.token) sanitizedDetails.token = '[REDACTED]';
  if (sanitizedDetails.creditCard) sanitizedDetails.creditCard = '[REDACTED]';
  
  // Add metadata
  const logEntry = {
    type: eventType,
    timestamp: new Date().toISOString(),
    severity,
    deviceInfo: {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform
    },
    ...sanitizedDetails
  };
  
  // In a real app, you would send this to a secure logging service
  console.log(`Security event [${severity}]:`, logEntry);
  
  // For critical events, always notify
  const shouldNotify = notifyUser || severity === 'critical';
  
  // Optionally notify user
  if (shouldNotify) {
    const variant = severity === 'critical' ? 'destructive' : (severity === 'warning' ? 'warning' : 'default');
    
    toast[variant === 'destructive' ? 'error' : (variant === 'warning' ? 'warning' : 'info')](
      `Security event: ${eventType}`, 
      {
        description: details.message || 'Check your security settings for details',
        duration: severity === 'critical' ? 8000 : 5000,
        id: `security-${eventType}-${Date.now()}`
      }
    );
  }
  
  // In a real app, persist to database if requested
  if (persistToDB) {
    // This would be implemented when connected to a backend
    console.log('Would persist to database:', logEntry);
  }
};

// New: Generate cryptographically secure random password
export const generateSecurePassword = (length: number = 16, options = { 
  includeUppercase: true, 
  includeLowercase: true,
  includeNumbers: true,
  includeSpecial: true
}): string => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*()-_=+[]{}|;:,.<>?';
  
  let charset = '';
  if (options.includeUppercase) charset += uppercase;
  if (options.includeLowercase) charset += lowercase;
  if (options.includeNumbers) charset += numbers;
  if (options.includeSpecial) charset += special;
  
  if (charset === '') charset = lowercase + numbers; // Fallback
  
  // Use crypto API for better randomness
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(array[i] % charset.length);
  }
  
  return password;
};

// New: Validate tokens against common security vulnerabilities
export const validateToken = (token: string): { valid: boolean; reason?: string } => {
  if (!token) return { valid: false, reason: 'Token is empty' };
  
  // Check token length
  if (token.length < 32) return { valid: false, reason: 'Token is too short' };
  
  // Check for common test/debug tokens
  if (['test', 'demo', 'admin', 'token'].some(t => token.toLowerCase().includes(t))) {
    return { valid: false, reason: 'Token contains common test words' };
  }
  
  // Check for JWT structure (simplified)
  const isJWT = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(token);
  if (isJWT) {
    // Check JWT expiration (simplified)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp && payload.exp < Date.now() / 1000) {
        return { valid: false, reason: 'Token has expired' };
      }
    } catch {
      return { valid: false, reason: 'Cannot parse token payload' };
    }
  }
  
  return { valid: true };
};

// New: Rate limiting utility for security-sensitive operations
export const rateLimit = (key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean => {
  const now = Date.now();
  const attempts = JSON.parse(localStorage.getItem(`rateLimit_${key}`) || '[]');
  
  // Remove attempts outside the window
  const recentAttempts = attempts.filter(time => now - time < windowMs);
  
  // Check if exceeded
  if (recentAttempts.length >= maxAttempts) {
    return false; // Rate limit exceeded
  }
  
  // Add new attempt
  recentAttempts.push(now);
  localStorage.setItem(`rateLimit_${key}`, JSON.stringify(recentAttempts));
  
  return true; // Rate limit not exceeded
};

// Export all functions
export default {
  checkPasswordStrength,
  detectSuspiciousLogin,
  anonymizeData,
  logSecurityEvent,
  generateSecurePassword,
  validateToken,
  rateLimit
};
