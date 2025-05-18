
/**
 * Secure storage for sensitive data in the app
 * Simplifies encryption and decryption of data
 */

// Simple encryption method (production apps should use a proper encryption library)
const encryptData = (data: string, encryptionKey: string): string => {
  try {
    // Very simple XOR encryption as an example
    // In a real app, you would use a proper encryption library
    const encrypted = Array.from(data)
      .map((char, i) => {
        const keyChar = encryptionKey[i % encryptionKey.length];
        return String.fromCharCode(char.charCodeAt(0) ^ keyChar.charCodeAt(0));
      })
      .join('');
    
    // Base64 encoding for storage
    return btoa(encrypted);
  } catch (error) {
    console.error('Encryption error:', error);
    return '';
  }
};

// Corresponding decryption method
const decryptData = (encryptedData: string, encryptionKey: string): string => {
  try {
    // Base64 decoding
    const encrypted = atob(encryptedData);
    
    // XOR decryption
    const decrypted = Array.from(encrypted)
      .map((char, i) => {
        const keyChar = encryptionKey[i % encryptionKey.length];
        return String.fromCharCode(char.charCodeAt(0) ^ keyChar.charCodeAt(0));
      })
      .join('');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
};

// Generate encryption key from user and device information
const generateEncryptionKey = (): string => {
  // In a real app, you would use hardware identifiers
  const userAgent = navigator.userAgent;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const screenSize = `${window.screen.width}x${window.screen.height}`;
  
  // Combine information for a unique key
  return btoa(`${userAgent}-${timeZone}-${screenSize}`).substring(0, 32);
};

// Secure storage class for accessing local storage
export class SecureStorage {
  private encryptionKey: string;
  private storagePrefix: string;
  
  constructor(storagePrefix = 'secure') {
    this.encryptionKey = generateEncryptionKey();
    this.storagePrefix = storagePrefix;
  }
  
  // Store data
  setItem<T>(key: string, value: T): void {
    try {
      const fullKey = `${this.storagePrefix}_${key}`;
      const valueString = typeof value === 'object' ? JSON.stringify(value) : String(value);
      const encryptedValue = encryptData(valueString, this.encryptionKey);
      
      localStorage.setItem(fullKey, encryptedValue);
    } catch (error) {
      console.error(`Error storing secure data for ${key}:`, error);
    }
  }
  
  // Retrieve data
  getItem<T>(key: string, defaultValue: T): T {
    try {
      const fullKey = `${this.storagePrefix}_${key}`;
      const encryptedValue = localStorage.getItem(fullKey);
      
      if (!encryptedValue) return defaultValue;
      
      const decryptedValue = decryptData(encryptedValue, this.encryptionKey);
      
      // Try to parse as JSON, otherwise return as string
      try {
        return JSON.parse(decryptedValue) as T;
      } catch {
        // If the value is a string that can't be parsed as JSON,
        // check if it should be returned directly as the generic type
        if (typeof defaultValue === 'string') {
          return decryptedValue as unknown as T;
        }
        return defaultValue;
      }
    } catch (error) {
      console.error(`Error retrieving secure data for ${key}:`, error);
      return defaultValue;
    }
  }
  
  // Remove data
  removeItem(key: string): void {
    try {
      const fullKey = `${this.storagePrefix}_${key}`;
      localStorage.removeItem(fullKey);
    } catch (error) {
      console.error(`Error removing secure data for ${key}:`, error);
    }
  }
  
  // Clear all stored data with this prefix
  clear(): void {
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith(`${this.storagePrefix}_`))
        .forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing secure storage:', error);
    }
  }
}

// Export instance for app-wide use
export const secureStorage = new SecureStorage('propertyflow');

export default secureStorage;
