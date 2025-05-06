
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useUserPreferences } from './UserPreferencesContext';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from './LanguageContext';
import secureStorage from '@/utils/secureStorage';
import { logSecurityEvent } from '@/utils/securityUtils';

interface AppLockContextProps {
  isLocked: boolean;
  lockApp: () => void;
  unlockApp: (pin?: string) => boolean;
  setPIN: (pin: string) => void;
  hasPIN: boolean;
  supportsFaceId: boolean;
  useFaceId: () => Promise<boolean>;
  pin: string | null;
  clearPIN: () => void;
  verifyPIN: (pin: string) => boolean;
  isBiometricEnabled: boolean;
  setBiometricEnabled: (enabled: boolean) => void;
}

const AppLockContext = createContext<AppLockContextProps | undefined>(undefined);

export const AppLockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [pin, setPin] = useState<string | null>(null);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState<boolean>(false);
  const { preferences, updatePreferences } = useUserPreferences();
  const [supportsFaceId, setSupportsFaceId] = useState<boolean>(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  // Check if biometric authentication is supported
  useEffect(() => {
    const checkBiometricSupport = async () => {
      // In a real app, we would check device capabilities
      // Here we use a simple detection based on device type
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const isModernDevice = 
        ('FaceDetector' in window) || 
        ('PublicKeyCredential' in window) || 
        ('credentials' in navigator);
      
      const supported = isMobile && isModernDevice;
      setSupportsFaceId(supported);
      
      // If not supported, ensure biometric auth is disabled
      if (!supported && preferences.appLockMethod === 'biometric') {
        updatePreferences({ appLockMethod: 'pin' });
      }
    };
    
    checkBiometricSupport();
  }, [preferences.appLockMethod, updatePreferences]);
  
  // Load PIN from secure storage
  useEffect(() => {
    const loadPIN = () => {
      try {
        const savedPin = secureStorage.getItem('appLockPIN', null);
        if (savedPin) {
          setPin(savedPin);
        }
        
        const biometricEnabled = localStorage.getItem('biometricEnabled') === 'true';
        setIsBiometricEnabled(biometricEnabled && supportsFaceId);
      } catch (error) {
        console.error('Error loading PIN:', error);
        toast({
          title: t('error'),
          description: t('errorLoadingSecuritySettings'),
          variant: 'destructive'
        });
      }
    };
    
    loadPIN();
  }, [t, toast, supportsFaceId]);
  
  // Lock the app
  const lockApp = useCallback(() => {
    if (pin) {
      setIsLocked(true);
      logSecurityEvent('logout', { automatic: true });
      toast({
        title: t('security'),
        description: t('appLocked'),
      });
    } else {
      toast({
        title: t('warning'),
        description: t('noPINSet'),
        variant: 'destructive',
      });
    }
  }, [pin, t, toast]);
  
  // Unlock the app with PIN
  const unlockApp = useCallback((userPin?: string): boolean => {
    if (!pin) {
      setIsLocked(false);
      return true;
    }
    
    if (userPin && userPin === pin) {
      setIsLocked(false);
      logSecurityEvent('login', { method: 'pin' });
      return true;
    }
    
    return false;
  }, [pin]);
  
  // Verify PIN without unlocking
  const verifyPIN = useCallback((userPin: string): boolean => {
    return userPin === pin;
  }, [pin]);
  
  // Set PIN
  const setPINValue = useCallback((newPin: string) => {
    try {
      setPin(newPin);
      secureStorage.setItem('appLockPIN', newPin);
      
      // Update user preferences
      updatePreferences({
        appLockEnabled: true,
        appLockMethod: isBiometricEnabled ? 'biometric' : 'pin'
      });
      
      logSecurityEvent('pin_change', {}, true);
      
      toast({
        title: t('success'),
        description: t('pinSetSuccessfully'),
      });
    } catch (error) {
      console.error('Error setting PIN:', error);
      toast({
        title: t('error'),
        description: t('errorSettingPIN'),
        variant: 'destructive'
      });
    }
  }, [t, toast, updatePreferences, isBiometricEnabled]);
  
  // Clear PIN
  const clearPIN = useCallback(() => {
    try {
      setPin(null);
      secureStorage.removeItem('appLockPIN');
      
      // Update user preferences
      updatePreferences({
        appLockEnabled: false,
        appLockMethod: 'none'
      });
      
      logSecurityEvent('pin_change', { removed: true });
      
      toast({
        title: t('success'),
        description: t('pinRemoved'),
      });
    } catch (error) {
      console.error('Error clearing PIN:', error);
      toast({
        title: t('error'),
        description: t('errorRemovingPIN'),
        variant: 'destructive'
      });
    }
  }, [t, toast, updatePreferences]);
  
  // Use Face ID
  const useFaceId = useCallback(async (): Promise<boolean> => {
    if (!supportsFaceId) return false;
    
    try {
      // In a real app, we would use the native biometric API
      // Here we simulate a successful authentication
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsLocked(false);
      logSecurityEvent('login', { method: 'biometric' });
      return true;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  }, [supportsFaceId]);
  
  // Toggle biometric authentication
  const setBiometricEnabled = useCallback((enabled: boolean) => {
    if (!supportsFaceId && enabled) {
      toast({
        title: t('error'),
        description: t('biometricNotSupported'),
        variant: 'destructive'
      });
      return;
    }
    
    setIsBiometricEnabled(enabled);
    localStorage.setItem('biometricEnabled', enabled.toString());
    
    // Update user preferences
    updatePreferences({
      appLockMethod: enabled ? 'biometric' : 'pin'
    });
    
    logSecurityEvent('pin_change', { biometricEnabled: enabled });
    
    toast({
      title: t('success'),
      description: enabled ? t('biometricEnabled') : t('biometricDisabled')
    });
  }, [supportsFaceId, t, toast, updatePreferences]);
  
  return (
    <AppLockContext.Provider value={{
      isLocked,
      lockApp,
      unlockApp,
      setPIN: setPINValue,
      hasPIN: !!pin,
      supportsFaceId,
      useFaceId,
      pin,
      clearPIN,
      verifyPIN,
      isBiometricEnabled,
      setBiometricEnabled
    }}>
      {children}
    </AppLockContext.Provider>
  );
};

export const useAppLock = () => {
  const context = useContext(AppLockContext);
  
  if (context === undefined) {
    throw new Error('useAppLock must be used within an AppLockProvider');
  }
  
  return context;
};

export default AppLockContext;
