
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AppLockContextType {
  isLocked: boolean;
  pin: string | null;
  lockApp: () => void;
  unlockApp: (enteredPin: string) => boolean;
  setPin: (newPin: string) => void;
  removePin: () => void;
  validatePin: (enteredPin: string) => boolean;
  supportsFaceId: boolean;
  useFaceId: () => Promise<boolean>;
}

const AppLockContext = createContext<AppLockContextType | undefined>(undefined);

export const AppLockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLocked, setIsLocked] = useState(false);
  const [pin, setInternalPin] = useState<string | null>(null);
  const [supportsFaceId, setSupportsFaceId] = useState(false);

  // Check if device supports biometric authentication
  useEffect(() => {
    const checkBiometricSupport = async () => {
      // In a real implementation, we would check if the device supports Face ID/Touch ID
      // For now, we'll just simulate this based on whether we're on a mobile device
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      setSupportsFaceId(isMobile);
    };
    
    checkBiometricSupport();
  }, []);

  // Load PIN from localStorage on component mount
  useEffect(() => {
    const savedPin = localStorage.getItem('appPin');
    if (savedPin) {
      setInternalPin(savedPin);
    }
  }, []);

  const lockApp = () => {
    if (pin) {
      setIsLocked(true);
    }
  };

  const unlockApp = (enteredPin: string) => {
    if (validatePin(enteredPin)) {
      setIsLocked(false);
      return true;
    }
    return false;
  };

  const validatePin = (enteredPin: string) => {
    return enteredPin === pin;
  };

  const setPin = (newPin: string) => {
    localStorage.setItem('appPin', newPin);
    setInternalPin(newPin);
  };

  const removePin = () => {
    localStorage.removeItem('appPin');
    setInternalPin(null);
    setIsLocked(false);
  };

  const useFaceId = async (): Promise<boolean> => {
    // In a real implementation, this would trigger the device's biometric authentication
    // For now, we'll simulate success
    return new Promise((resolve) => {
      setTimeout(() => {
        if (supportsFaceId) {
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000);
    });
  };

  return (
    <AppLockContext.Provider 
      value={{ 
        isLocked, 
        pin, 
        lockApp, 
        unlockApp, 
        setPin, 
        removePin,
        validatePin,
        supportsFaceId,
        useFaceId
      }}
    >
      {children}
    </AppLockContext.Provider>
  );
};

export const useAppLock = (): AppLockContextType => {
  const context = useContext(AppLockContext);
  if (context === undefined) {
    throw new Error('useAppLock must be used within an AppLockProvider');
  }
  return context;
};
