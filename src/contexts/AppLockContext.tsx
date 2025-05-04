
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AppLockContextType {
  isLocked: boolean;
  pin: string | null;
  lockApp: () => void;
  unlockApp: (enteredPin: string) => boolean;
  setPin: (newPin: string) => void;
  removePin: () => void;
}

const AppLockContext = createContext<AppLockContextType | undefined>(undefined);

export const AppLockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLocked, setIsLocked] = useState(false);
  const [pin, setInternalPin] = useState<string | null>(null);

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
    if (enteredPin === pin) {
      setIsLocked(false);
      return true;
    }
    return false;
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

  return (
    <AppLockContext.Provider value={{ isLocked, pin, lockApp, unlockApp, setPin, removePin }}>
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
