
import { useCallback } from 'react';
import { secureStorage } from '@/utils/secureStorage';

type StoredValue<T> = T | null;

export function useSecureStorage<T>(key: string, initialValue: T | null = null) {
  // Get value from secure storage
  const getStoredValue = useCallback((): StoredValue<T> => {
    return secureStorage.getItem(key, initialValue);
  }, [key, initialValue]);
  
  // Set value to secure storage
  const setStoredValue = useCallback((value: T): void => {
    secureStorage.setItem(key, value);
  }, [key]);
  
  // Remove value from secure storage
  const removeStoredValue = useCallback((): void => {
    secureStorage.removeItem(key);
  }, [key]);
  
  return {
    value: getStoredValue(),
    setValue: setStoredValue,
    removeValue: removeStoredValue,
    getLatestValue: getStoredValue, // This allows getting the latest value without rerender
  };
}

export default useSecureStorage;
