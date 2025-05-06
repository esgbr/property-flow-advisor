
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
  
  // Get value from secure storage
  const getStoredValue = useCallback((): StoredValue<T> => {
    try {
      return secureStorage.getItem(key, initialValue);
    } catch (err) {
      console.error('Error retrieving secure storage value:', err);
      setError(err instanceof Error ? err : new Error('Failed to get secure storage item'));
      return initialValue;
    }
  }, [key, initialValue]);
  
  // Load value from storage and update state
  const loadValue = useCallback(() => {
    setIsLoading(true);
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
  }, [getStoredValue]);
  
  // Set value to secure storage
  const setStoredValue = useCallback((newValue: T): void => {
    try {
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
