
import { useState, useCallback, useEffect } from 'react';
import secureStorage from '@/utils/secureStorage';

export function useSecureStorage<T>(key: string, initialValue: T) {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Get from secure storage by key
      const item = secureStorage.getItem(key);
      
      // Parse stored json or return initialValue
      return item !== null ? item : initialValue;
    } catch (error) {
      // If error, return initialValue
      console.error('Error reading from secure storage:', error);
      return initialValue;
    }
  });
  
  // Return a wrapped version of useState's setter function that
  // persists the new value to secure storage
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
        
      // Save state
      setStoredValue(valueToStore);
      
      // Save to secure storage
      secureStorage.setItem(key, valueToStore);
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.error('Error writing to secure storage:', error);
    }
  }, [key, storedValue]);

  // Listen for changes to this storage value from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `secure_${key}`) {
        try {
          const newValue = secureStorage.getItem(key);
          if (newValue !== null) {
            setStoredValue(newValue as T);
          }
        } catch (error) {
          console.error('Error reading updated value from secure storage:', error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue] as const;
}
