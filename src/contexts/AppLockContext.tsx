import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { toast } from '@/hooks/use-toast';
import secureStorage from '@/utils/secureStorage';

interface AppLockContextType {
  isLocked: boolean;
  setIsLocked: React.Dispatch<React.SetStateAction<boolean>>;
  lockApp: () => void;
  unlockApp: (pin: string) => boolean;
  hasPIN: boolean;
  pin: string | null;
  setPIN: (newPin: string) => void;
  clearPIN: () => void;
  supportsFaceId: boolean;
  useFaceId: () => Promise<boolean>;
  isBiometricEnabled: boolean;
  setBiometricEnabled: (enabled: boolean) => void;
}

const AppLockContext = createContext<AppLockContextType>({
  isLocked: false,
  setIsLocked: () => {},
  lockApp: () => {},
  unlockApp: () => false,
  hasPIN: false,
  pin: null,
  setPIN: () => {},
  clearPIN: () => {},
  supportsFaceId: false,
  useFaceId: () => Promise.resolve(false),
  isBiometricEnabled: false,
  setBiometricEnabled: () => {},
});

export const AppLockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { preferences, updatePreferences } = useUserPreferences();
  const [isLocked, setIsLocked] = useState(false);
  const [pin, setPin] = useState<string | null>(null);
  const [supportsFaceId, setSupportsFaceId] = useState(false);
  const [isBiometricEnabled, setBiometricEnabled] = useState(false);
  
  // Check for biometric support - in a real app this would check device capabilities
  useEffect(() => {
    // Simulating capability detection
    const checkBiometricSupport = async () => {
      try {
        // This is a simplified check - in a real app we would use platform APIs
        const isWebAuthnSupported = window.PublicKeyCredential !== undefined;
        setSupportsFaceId(isWebAuthnSupported);
      } catch (error) {
        console.error('Error checking biometric support:', error);
        setSupportsFaceId(false);
      }
    };
    
    checkBiometricSupport();
  }, []);
  
  // Load PIN from secure storage
  useEffect(() => {
    const savedPin = secureStorage.getItem('appLockPin');
    if (savedPin) {
      setPin(savedPin);
      updatePreferences({ appLockEnabled: true });
    } else {
      updatePreferences({ appLockEnabled: false });
    }
    
    const bioEnabled = secureStorage.getItem('biometricEnabled') === 'true';
    setBiometricEnabled(bioEnabled);
    if (bioEnabled) {
      updatePreferences({ appLockMethod: 'biometric' });
    } else if (savedPin) {
      updatePreferences({ appLockMethod: 'pin' });
    }

    // Check if app was locked before refresh
    if (localStorage.getItem('appLocked') === 'true' && savedPin) {
      setIsLocked(true);
    }
  }, [updatePreferences]);
  
  // Auto-lock when inactive
  useEffect(() => {
    if (!pin) return;
    
    const lockTimeout = 5 * 60 * 1000; // 5 minutes inactivity
    let timeoutId: number;
    
    const resetTimeout = () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => lockApp(), lockTimeout);
    };
    
    const handleActivity = () => {
      if (!isLocked) resetTimeout();
    };
    
    // Monitor for user activity
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keypress', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    window.addEventListener('click', handleActivity);
    
    resetTimeout();
    
    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, [pin, isLocked]);
  
  const lockApp = () => {
    if (pin) {
      setIsLocked(true);
      localStorage.setItem('appLocked', 'true');
    }
  };
  
  const unlockApp = (enteredPin: string): boolean => {
    if (enteredPin === pin) {
      setIsLocked(false);
      localStorage.removeItem('appLocked');
      return true;
    }
    return false;
  };
  
  const setPIN = (newPin: string) => {
    secureStorage.setItem('appLockPin', newPin);
    setPin(newPin);
    updatePreferences({ 
      appLockEnabled: true,
      appLockMethod: isBiometricEnabled ? 'biometric' : 'pin' 
    });
  };
  
  const clearPIN = () => {
    secureStorage.removeItem('appLockPin');
    setPin(null);
    updatePreferences({ 
      appLockEnabled: false,
      appLockMethod: undefined 
    });
    setBiometricEnabled(false);
    secureStorage.removeItem('biometricEnabled');
  };
  
  const useFaceId = async (): Promise<boolean> => {
    try {
      // In a real app, this would trigger native biometric authentication
      // For demo we'll simulate success after a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (pin) {
        setIsLocked(false);
        localStorage.removeItem('appLocked');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      return false;
    }
  };
  
  const handleSetBiometricEnabled = (enabled: boolean) => {
    setBiometricEnabled(enabled);
    secureStorage.setItem('biometricEnabled', enabled.toString());
    
    if (enabled) {
      updatePreferences({ appLockMethod: 'biometric' });
      toast({
        title: 'Biometrics Enabled',
        description: 'Biometric authentication has been activated'
      });
    } else if (pin) {
      updatePreferences({ appLockMethod: 'pin' });
    }
  };
  
  return (
    <AppLockContext.Provider
      value={{
        isLocked,
        setIsLocked,
        lockApp,
        unlockApp,
        hasPIN: !!pin,
        pin,
        setPIN,
        clearPIN,
        supportsFaceId,
        useFaceId,
        isBiometricEnabled,
        setBiometricEnabled: handleSetBiometricEnabled,
      }}
    >
      {children}
    </AppLockContext.Provider>
  );
};

export const useAppLock = () => useContext(AppLockContext);

export default AppLockContext;
