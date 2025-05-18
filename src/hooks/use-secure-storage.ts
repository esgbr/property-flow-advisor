
import { useState, useEffect } from 'react';
import secureStorage from '@/utils/secureStorage';

/**
 * Hook for securely storing and retrieving data
 * Uses encryption for sensitive data
 */
export function useSecureStorage<T>(key: string, initialValue: T) {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Get from secure storage by key
      const item = secureStorage.getItem<T>(key, initialValue);
      return item;
    } catch (error) {
      // If error, return initialValue
      console.error('Error reading from secure storage:', error);
      return initialValue;
    }
  });
  
  // Return a wrapped version of useState's setter function that
  // persists the new value to secure storage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
        
      // Save state
      setStoredValue(valueToStore);
      
      // Save to secure storage
      secureStorage.setItem(key, valueToStore);
      
      // Dispatch a custom event to notify other tabs
      window.dispatchEvent(
        new CustomEvent('secure-storage', { 
          detail: { key, action: 'update' } 
        })
      );
    } catch (error) {
      console.error('Error writing to secure storage:', error);
    }
  };

  // Listen for changes to this storage value from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent | CustomEvent) => {
      // Handle both StorageEvent and our custom secure-storage event
      const isCustomEvent = 'detail' in e;
      
      if (
        (isCustomEvent && (e as CustomEvent).detail?.key === key) ||
        (!isCustomEvent && (e as StorageEvent).key === `secure_${key}`)
      ) {
        try {
          const newValue = secureStorage.getItem<T>(key, initialValue);
          setStoredValue(newValue);
        } catch (error) {
          console.error('Error reading updated value from secure storage:', error);
        }
      }
    };
    
    // Add listeners for both standard storage events and our custom events
    window.addEventListener('storage', handleStorageChange as EventListener);
    window.addEventListener('secure-storage', handleStorageChange as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange as EventListener);
      window.removeEventListener('secure-storage', handleStorageChange as EventListener);
    };
  }, [key, initialValue]);

  // Additional utility functions
  const removeValue = () => {
    try {
      secureStorage.removeItem(key);
      setStoredValue(initialValue);
      
      window.dispatchEvent(
        new CustomEvent('secure-storage', { 
          detail: { key, action: 'remove' } 
        })
      );
    } catch (error) {
      console.error('Error removing from secure storage:', error);
    }
  };
  
  const clearAll = () => {
    try {
      secureStorage.clear();
      setStoredValue(initialValue);
    } catch (error) {
      console.error('Error clearing secure storage:', error);
    }
  };

  return [storedValue, setValue, { removeValue, clearAll }] as const;
}

export default useSecureStorage;
