/**
 * Utility functions for security-related operations
 * Provides password validation, strength checking, and security-related helpers
 */

/**
 * Password strength levels
 */
export enum PasswordStrength {
  Weak = 'weak',
  Medium = 'medium',
  Strong = 'strong',
  VeryStrong = 'very-strong'
}

/**
 * Check if a password meets minimum requirements
 * @param password The password to check
 * @returns Whether the password meets minimum requirements
 */
export const isPasswordValid = (password: string): boolean => {
  // Minimum 8 characters with at least one number and one special character
  const minLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return minLength && hasNumber && hasSpecialChar;
};

/**
 * Get detailed password validation errors
 * @param password The password to check
 * @returns Array of validation error messages
 */
export const getPasswordValidationErrors = (password: string): string[] => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password should contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password should contain at least one lowercase letter');
  }
  
  return errors;
};

/**
 * Check password strength
 * @param password The password to check
 * @returns The strength of the password as an enum
 */
export const checkPasswordStrength = (password: string): PasswordStrength => {
  let score = 0;
  
  // Length
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  
  // Complexity
  if (/[a-z]/.test(password)) score += 1; // Lowercase
  if (/[A-Z]/.test(password)) score += 1; // Uppercase
  if (/\d/.test(password)) score += 1; // Number
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1; // Special character
  
  // Variety
  const uniqueChars = new Set(password).size;
  if (uniqueChars >= password.length * 0.7) score += 1;
  
  // Map score to strength
  if (score < 4) return PasswordStrength.Weak;
  if (score < 6) return PasswordStrength.Medium;
  if (score < 8) return PasswordStrength.Strong;
  return PasswordStrength.VeryStrong;
};

/**
 * Get color for password strength visualization
 * @param strength The password strength
 * @returns Color for the strength indicator
 */
export const getPasswordStrengthColor = (strength: PasswordStrength): string => {
  switch (strength) {
    case PasswordStrength.Weak:
      return 'red';
    case PasswordStrength.Medium:
      return 'orange';
    case PasswordStrength.Strong:
      return 'green';
    case PasswordStrength.VeryStrong:
      return 'emerald';
    default:
      return 'gray';
  }
};

/**
 * Generate a random secure password
 * @param length Length of the password to generate
 * @returns A randomly generated strong password
 */
export const generateSecurePassword = (length = 16): string => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  let password = '';
  
  // Ensure at least one of each required type
  password += getRandomChar('ABCDEFGHIJKLMNOPQRSTUVWXYZ'); // Uppercase
  password += getRandomChar('abcdefghijklmnopqrstuvwxyz'); // Lowercase
  password += getRandomChar('0123456789'); // Number
  password += getRandomChar('!@#$%^&*()_+-=[]{}|;:,.<>?'); // Special
  
  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

/**
 * Get a random character from the provided charset
 * @param charset The character set to choose from
 * @returns A random character from the charset
 */
const getRandomChar = (charset: string): string => {
  return charset.charAt(Math.floor(Math.random() * charset.length));
};

/**
 * Sanitize user input to prevent XSS attacks
 * @param input The input to sanitize
 * @returns Sanitized input string
 */
export const sanitizeInput = (input: string): string => {
  const element = document.createElement('div');
  element.textContent = input;
  return element.innerHTML;
};

/**
 * Hash a value using SHA-256
 * Note: This is for client-side use only, not for server authentication
 * @param value The value to hash
 * @returns A promise that resolves to the hashed value
 */
export const hashValue = async (value: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Check if a string might contain sensitive information
 * @param input The input to check
 * @returns Whether the input might contain sensitive information
 */
export const mightContainSensitiveInfo = (input: string): boolean => {
  // Check for common patterns that might indicate sensitive data
  const patterns = [
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i, // Email
    /\b(?:\d[ -]*?){13,16}\b/, // Credit card
    /\b\d{3}[-. ]?\d{2}[-. ]?\d{4}\b/ // SSN
  ];
  
  return patterns.some(pattern => pattern.test(input));
};

/**
 * Log security events for monitoring and auditing
 * @param eventType Type of security event
 * @param data Additional event data
 * @param options Event logging options
 */
export const logSecurityEvent = (
  eventType: 'login' | 'logout' | 'password_change' | 'login_failure' | 'security_setting_change',
  data: Record<string, any> = {},
  options: {
    severity?: 'info' | 'warning' | 'error';
    notifyUser?: boolean;
  } = { severity: 'info', notifyUser: true }
) => {
  // Create event log
  const eventLog = {
    type: eventType,
    timestamp: new Date().toISOString(),
    data,
    severity: options.severity || 'info'
  };

  // In a real app, you might send this to a security monitoring service
  console.log('[Security Event]', eventLog);
  
  // Store in browser for audit
  try {
    const securityLogs = JSON.parse(localStorage.getItem('security_logs') || '[]');
    securityLogs.push(eventLog);
    // Keep only the most recent 100 logs
    if (securityLogs.length > 100) {
      securityLogs.shift();
    }
    localStorage.setItem('security_logs', JSON.stringify(securityLogs));
  } catch (error) {
    console.error('Error storing security log:', error);
  }
};
