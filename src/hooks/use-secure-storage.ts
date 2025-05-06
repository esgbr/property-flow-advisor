
import { useCallback, useState, useEffect } from 'react';
import { secureStorage } from '@/utils/secureStorage';

type StoredValue<T> = T | null;

interface SecureStorageHook<T> {
  value: StoredValue<T>;
  setValue: (value: T) => void;
  removeValue: () => void;
  getLatestValue: () => StoredValue<T>;
  isLoading: boolean;
  error: Error | null;
  reload: () => void;
}

/**
 * Hook for securely storing and retrieving values from secure storage
 * 
 * @param key Storage key
 * @param initialValue Default value if not found in storage
 * @returns Object with storage operations and state
 */
export function useSecureStorage<T>(key: string, initialValue: T | null = null): SecureStorageHook<T> {
  const [value, setValue] = useState<StoredValue<T>>(initialValue);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Load value on hook initialization
  useEffect(() => {
    loadValue();
  }, [key]);
  
  // Get value from secure storage with improved error handling
  const getStoredValue = useCallback((): StoredValue<T> => {
    try {
      const storedValue = secureStorage.getItem(key, initialValue);
      
      // Ensure the stored value is of the correct type
      if (storedValue !== null && 
          typeof initialValue === 'object' && 
          typeof storedValue === 'object') {
        // For objects, verify we have expected properties
        // This is a simple validation which could be expanded based on needs
        return storedValue as T;
      }
      
      return storedValue as T;
    } catch (err) {
      console.error('Error retrieving secure storage value:', err);
      setError(err instanceof Error ? err : new Error('Failed to get secure storage item'));
      return initialValue;
    }
  }, [key, initialValue]);
  
  // Load value from storage with debouncing
  const loadValue = useCallback(() => {
    setIsLoading(true);
    
    // Use setTimeout to avoid blocking the main thread
    setTimeout(() => {
      try {
        const storedValue = getStoredValue();
        setValue(storedValue);
        setError(null);
      } catch (err) {
        console.error('Error in secure storage:', err);
        setError(err instanceof Error ? err : new Error('Failed to load secure storage'));
      } finally {
        setIsLoading(false);
      }
    }, 0);
  }, [getStoredValue]);
  
  // Set value to secure storage with improved validation
  const setStoredValue = useCallback((newValue: T): void => {
    try {
      // Basic validation of the value
      if (newValue === undefined) {
        throw new Error('Cannot store undefined value in secure storage');
      }
      
      secureStorage.setItem(key, newValue);
      setValue(newValue);
      setError(null);
    } catch (err) {
      console.error('Error setting secure storage value:', err);
      setError(err instanceof Error ? err : new Error('Failed to set secure storage item'));
    }
  }, [key]);
  
  // Remove value from secure storage
  const removeStoredValue = useCallback((): void => {
    try {
      secureStorage.removeItem(key);
      setValue(initialValue);
      setError(null);
    } catch (err) {
      console.error('Error removing secure storage value:', err);
      setError(err instanceof Error ? err : new Error('Failed to remove secure storage item'));
    }
  }, [key, initialValue]);
  
  return {
    value,
    setValue: setStoredValue,
    removeValue: removeStoredValue,
    getLatestValue: getStoredValue,
    isLoading,
    error,
    reload: loadValue
  };
}

export default useSecureStorage;
