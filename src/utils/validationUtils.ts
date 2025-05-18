
/**
 * Validation utility functions for form fields
 */

// Email validation with RFC 5322 compliant regex
export const isValidEmail = (email: string): boolean => {
  const pattern = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;
  return pattern.test(email);
};

// Password validation (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special)
export const isValidPassword = (password: string): boolean => {
  if (password.length < 8) return false;
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars;
};

// Get password strength feedback
export const getPasswordStrength = (password: string): {
  score: number;
  feedback: string;
  color: string;
} => {
  if (!password) {
    return { score: 0, feedback: 'Password is required', color: 'gray' };
  }
  
  let score = 0;
  const issues: string[] = [];
  
  // Length check (base points)
  if (password.length >= 8) score += 1;
  if (password.length >= 10) score += 1;
  if (password.length >= 12) score += 1;
  
  if (password.length < 8) {
    issues.push('Password should be at least 8 characters');
  }
  
  // Character type checks
  if (/[A-Z]/.test(password)) score += 1;
  else issues.push('Add uppercase letters');
  
  if (/[a-z]/.test(password)) score += 1;
  else issues.push('Add lowercase letters');
  
  if (/\d/.test(password)) score += 1;
  else issues.push('Add numbers');
  
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
  else issues.push('Add special characters');
  
  // Variety check (prevents repetition)
  const uniqueChars = new Set(password).size;
  const uniqueRatio = uniqueChars / password.length;
  
  if (uniqueRatio > 0.7) score += 1;
  if (uniqueRatio < 0.5) issues.push('Avoid repeated characters');
  
  // Common patterns check
  const commonPatterns = [
    '123456', 'password', 'qwerty', 'admin', 'welcome', 
    'abc123', '111111', 'password1', '12345678', 'qwerty123'
  ];
  
  if (commonPatterns.some(pattern => password.toLowerCase().includes(pattern.toLowerCase()))) {
    score -= 2;
    issues.push('Avoid common patterns');
  }
  
  // Calculate feedback message and color
  let feedback: string;
  let color: string;
  
  if (score <= 2) {
    feedback = 'Weak password';
    color = 'red';
  } else if (score <= 4) {
    feedback = 'Fair password';
    color = 'orange';
  } else if (score <= 6) {
    feedback = 'Good password';
    color = 'yellow';
  } else if (score <= 8) {
    feedback = 'Strong password';
    color = 'green';
  } else {
    feedback = 'Very strong password';
    color = 'emerald';
  }
  
  // Add specific issues if score is not great
  if (score < 6 && issues.length > 0) {
    feedback = `${feedback}: ${issues[0]}`;
  }
  
  return { score, feedback, color };
};

// Name validation (min 2 chars, no special chars except space, hyphen, apostrophe)
export const isValidName = (name: string): boolean => {
  return name.length >= 2 && /^[a-zA-Z\s\-']+$/.test(name);
};

// URL validation
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Phone number validation (basic international format)
export const isValidPhone = (phone: string): boolean => {
  // Allow different formats like (123) 456-7890, 123-456-7890, 123.456.7890, 123 456 7890
  return /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/.test(phone);
};

// Credit card validation using Luhn algorithm
export const isValidCreditCard = (cardNumber: string): boolean => {
  const sanitized = cardNumber.replace(/\D/g, '');
  if (sanitized.length < 13 || sanitized.length > 19) return false;
  
  // Luhn algorithm
  let sum = 0;
  let double = false;
  
  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized.charAt(i), 10);
    
    if (double) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    double = !double;
  }
  
  return sum % 10 === 0;
};

// Date validation (check if date is valid and not in the past)
export const isDateInFuture = (date: string): boolean => {
  const inputDate = new Date(date);
  const today = new Date();
  
  today.setHours(0, 0, 0, 0); // Compare date only, not time
  
  return inputDate instanceof Date && !isNaN(inputDate.getTime()) && inputDate >= today;
};

// Alphanumeric validation (letters and numbers only)
export const isAlphanumeric = (value: string): boolean => {
  return /^[a-zA-Z0-9]+$/.test(value);
};

// Required field validation
export const isRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim() !== '';
  if (typeof value === 'number') return !isNaN(value);
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  
  return Boolean(value);
};

// Min/max length validation
export const hasMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

export const hasMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

// Range validation for numbers
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

// Custom validator that composes multiple validators
export const composeValidators = (
  value: any,
  validators: Array<(value: any) => boolean | string>
): string | true => {
  for (const validator of validators) {
    const result = validator(value);
    
    if (result !== true && typeof result === 'string') {
      return result; // Return the error message
    } else if (result === false) {
      return 'Validation failed'; // Generic error if no message
    }
  }
  
  return true; // All validations passed
};

// Generate form field validators
export const fieldValidators = {
  required: (message = 'This field is required') => (value: any) => {
    return isRequired(value) || message;
  },
  email: (message = 'Please enter a valid email address') => (value: string) => {
    return !value || isValidEmail(value) || message;
  },
  password: (message = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character') => (value: string) => {
    return !value || isValidPassword(value) || message;
  },
  minLength: (length: number, message?: string) => (value: string) => {
    return !value || hasMinLength(value, length) || (message || `Minimum length is ${length} characters`);
  },
  maxLength: (length: number, message?: string) => (value: string) => {
    return !value || hasMaxLength(value, length) || (message || `Maximum length is ${length} characters`);
  },
  phone: (message = 'Please enter a valid phone number') => (value: string) => {
    return !value || isValidPhone(value) || message;
  },
  url: (message = 'Please enter a valid URL') => (value: string) => {
    return !value || isValidUrl(value) || message;
  },
  alphanumeric: (message = 'Only letters and numbers are allowed') => (value: string) => {
    return !value || isAlphanumeric(value) || message;
  },
  creditCard: (message = 'Please enter a valid credit card number') => (value: string) => {
    return !value || isValidCreditCard(value) || message;
  },
  futureDate: (message = 'Date must be in the future') => (value: string) => {
    return !value || isDateInFuture(value) || message;
  },
  match: (field: string, message = 'Fields do not match') => (value: string, values: Record<string, any>) => {
    return !value || value === values[field] || message;
  }
};
