import React, { createContext, useContext, useState, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from './LanguageContext';
import { logSecurityEvent } from '@/utils/securityUtils';
import { useUserPreferences } from './UserPreferencesContext';

interface AppLockContextType {
  isLocked: boolean;
  pin: string | null;
  setPin: (pin: string | null) => void;
  isBiometricAuthEnabled: boolean;
  setIsBiometricAuthEnabled: (enabled: boolean) => void;
  lockApp: () => void;
  unlockApp: (enteredPin?: string) => Promise<boolean>;
  authenticateWithBiometrics: () => Promise<boolean>;
  checkBiometricAvailability: () => Promise<boolean>;
  setupBiometrics: () => Promise<void>;
}

const AppLockContext = createContext<AppLockContextType | undefined>(undefined);

export const AppLockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLocked, setIsLocked] = useState(false);
  const [pin, setPin] = useState<string | null>(null);
  const [isBiometricAuthEnabled, setIsBiometricAuthEnabled] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();
  const { preferences } = useUserPreferences();
  
  // Load PIN and biometric settings from localStorage on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedPin = localStorage.getItem('appPin');
        setPin(storedPin);
        
        const biometricEnabled = localStorage.getItem('isBiometricAuthEnabled');
        setIsBiometricAuthEnabled(biometricEnabled === 'true');
      } catch (error) {
        console.error('Error loading app lock settings:', error);
      }
    };
    
    loadSettings();
  }, []);
  
  // Save PIN to localStorage when it changes
  useEffect(() => {
    try {
      if (pin === null) {
        localStorage.removeItem('appPin');
      } else {
        localStorage.setItem('appPin', pin);
      }
    } catch (error) {
      console.error('Error saving PIN:', error);
    }
  }, [pin]);
  
  // Save biometric auth setting to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('isBiometricAuthEnabled', String(isBiometricAuthEnabled));
    } catch (error) {
      console.error('Error saving biometric auth setting:', error);
    }
  }, [isBiometricAuthEnabled]);

  const lockApp = () => {
    setIsLocked(true);
    
    // Show a toast notification
    toast({
      title: t('appLocked'),
      description: t('appLockedDescription'),
    });
  };

  const unlockApp = async (enteredPin?: string): Promise<boolean> => {
    if (isBiometricAuthEnabled && !enteredPin) {
      return authenticateWithBiometrics();
    }
    
    if (pin && enteredPin === pin) {
      setIsLocked(false);
      
      // Log successful unlock
      logSecurityEvent('app_unlock', {
        method: 'pin',
        success: true
      }, {
        severity: 'info',
        notifyUser: false
      });
      
      return true;
    } else {
      // Log failed unlock attempt
      logSecurityEvent('app_unlock_failure', {
        method: 'pin',
        reason: 'invalid_pin'
      }, {
        severity: 'warning',
        notifyUser: true
      });
      
      toast({
        title: t('incorrectPIN'),
        description: t('incorrectPINDescription'),
        variant: 'destructive'
      });
      
      return false;
    }
  };
  
  const authenticateWithBiometrics = async (): Promise<boolean> => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: t('authenticateWithBiometrics'),
        cancelLabel: t('cancel'),
        disableDeviceFallback: true,
      });
      
      if (result.success) {
        setIsLocked(false);
        
        // Log successful biometric unlock
        logSecurityEvent('app_unlock', {
          method: 'biometric',
          success: true
        }, {
          severity: 'info',
          notifyUser: false
        });
        
        return true;
      } else {
        // Log failed biometric unlock attempt
        logSecurityEvent('app_unlock_failure', {
          method: 'biometric',
          reason: result.error
        }, {
          severity: 'warning',
          notifyUser: true
        });
        
        toast({
          title: t('biometricAuthFailed'),
          description: t('biometricAuthFailedDescription'),
          variant: 'destructive'
        });
        
        return false;
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
      
      // Log biometric auth error
      logSecurityEvent('app_unlock_failure', {
        method: 'biometric',
        reason: 'biometric_error'
      }, {
        severity: 'error',
        notifyUser: true
      });
      
      toast({
        title: t('biometricAuthError'),
        description: t('biometricAuthErrorDescription'),
        variant: 'destructive'
      });
      
      return false;
    }
  };

  const checkBiometricAvailability = async (): Promise<boolean> => {
    try {
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      return types.length > 0;
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return false;
    }
  };
  
  const setupBiometrics = async () => {
    try {
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      
      if (!isEnrolled) {
        toast({
          title: t('noBiometricsEnrolled'),
          description: t('noBiometricsEnrolledDescription'),
          variant: 'destructive'
        });
        return;
      }
      
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: t('enableBiometricAuth'),
        cancelLabel: t('cancel'),
        disableDeviceFallback: true,
      });
      
      if (result.success) {
        setIsBiometricAuthEnabled(true);
        toast.success(t('biometricAuthEnabled'));
        
        // Fixed security logging
        logSecurityEvent('biometrics_setup', {
          method: 'biometric',
          success: result.success
        }, {
          severity: 'info',
          notifyUser: true,
          persistToDB: true
        });
      } else {
        toast({
          title: t('biometricSetupFailed'),
          description: t('biometricSetupFailedDescription'),
          variant: 'destructive'
        });
        
        // Log failed biometric setup
        logSecurityEvent('biometrics_setup', {
          method: 'biometric',
          success: false,
          reason: result.error
        }, {
          severity: 'warning',
          notifyUser: true
        });
      }
    } catch (error) {
      console.error('Error setting up biometrics:', error);
      
      // Log biometric setup error
      logSecurityEvent('biometrics_setup', {
        method: 'biometric',
        success: false,
        reason: 'biometric_error'
      }, {
        severity: 'error',
        notifyUser: true
      });
      
      toast({
        title: t('biometricSetupError'),
        description: t('biometricSetupErrorDescription'),
        variant: 'destructive'
      });
    }
  };

  const value: AppLockContextType = {
    isLocked,
    pin,
    setPin,
    isBiometricAuthEnabled,
    setIsBiometricAuthEnabled,
    lockApp,
    unlockApp,
    authenticateWithBiometrics,
    checkBiometricAvailability,
    setupBiometrics,
  };

  return (
    <AppLockContext.Provider value={value}>
      {children}
    </AppLockContext.Provider>
  );
};

export const useAppLock = (): AppLockContextType => {
  const context = useContext(AppLockContext);
  if (!context) {
    throw new Error('useAppLock must be used within an AppLockProvider');
  }
  return context;
};
