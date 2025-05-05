
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUserPreferences } from './UserPreferencesContext';

interface AppLockContextProps {
  isLocked: boolean;
  lockApp: () => void;
  unlockApp: (pin?: string) => boolean;
  setPIN: (pin: string) => void;
  hasPIN: boolean;
  supportsFaceId: boolean;
  useFaceId: () => Promise<boolean>;
}

const AppLockContext = createContext<AppLockContextProps | undefined>(undefined);

export const AppLockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [pin, setPin] = useState<string | null>(null);
  const { isAuthenticated } = useUserPreferences();
  const [supportsFaceId, setSupportsFaceId] = useState<boolean>(false);
  
  // Überprüfe, ob FaceID unterstützt wird
  useEffect(() => {
    const checkBiometricSupport = async () => {
      // In einer realen App würde hier eine Überprüfung der Gerätefunktionen stattfinden
      // Hier wird eine einfache Erkennung des Gerätetyps als Fallback verwendet
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const isModernDevice = 
        ('FaceDetector' in window) || 
        ('PublicKeyCredential' in window) || 
        ('credentials' in navigator);
      
      setSupportsFaceId(isMobile && isModernDevice);
    };
    
    checkBiometricSupport();
  }, []);
  
  // PIN aus dem lokalen Speicher laden
  useEffect(() => {
    const savedPin = localStorage.getItem('appLockPIN');
    if (savedPin) {
      setPin(savedPin);
    }
  }, []);
  
  // Sperren der App
  const lockApp = () => {
    if (isAuthenticated && pin) {
      setIsLocked(true);
    }
  };
  
  // Entsperren der App mit PIN
  const unlockApp = (userPin?: string) => {
    if (userPin && pin && userPin === pin) {
      setIsLocked(false);
      return true;
    } else if (!pin) {
      // Wenn keine PIN gesetzt ist, trotzdem entsperren
      setIsLocked(false);
      return true;
    }
    return false;
  };
  
  // PIN setzen
  const setPIN = (newPin: string) => {
    setPin(newPin);
    localStorage.setItem('appLockPIN', newPin);
  };
  
  // FaceID verwenden (simuliert)
  const useFaceId = async (): Promise<boolean> => {
    if (!supportsFaceId) return false;
    
    // In einer realen App würde hier die FaceID-API aufgerufen werden
    // Hier wird ein Erfolg simuliert nach einer kurzen Verzögerung
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsLocked(false);
        resolve(true);
      }, 1500);
    });
  };
  
  return (
    <AppLockContext.Provider value={{
      isLocked,
      lockApp,
      unlockApp,
      setPIN,
      hasPIN: !!pin,
      supportsFaceId,
      useFaceId
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
