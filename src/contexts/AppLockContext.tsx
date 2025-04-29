
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface AppLockContextType {
  isLocked: boolean;
  pin: string;
  setPin: (pin: string) => void;
  validatePin: (enteredPin: string) => boolean;
  lockApp: () => void;
  unlockApp: () => void;
  supportsFaceId: boolean;
  useFaceId: () => Promise<boolean>;
}

const AppLockContext = createContext<AppLockContextType | undefined>(undefined);

interface AppLockProviderProps {
  children: ReactNode;
}

export const AppLockProvider = ({ children }: AppLockProviderProps) => {
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [pin, setPin] = useState<string>(() => {
    // Versuche, die gespeicherte PIN zu laden
    const savedPin = localStorage.getItem('appPin');
    return savedPin || '';
  });

  // Simulierte Funktion für Face ID (in einer echten App würde hier native API-Zugriff stattfinden)
  const [supportsFaceId, setSupportsFaceId] = useState<boolean>(false);

  useEffect(() => {
    // Speichere die PIN im localStorage
    if (pin) {
      localStorage.setItem('appPin', pin);
    }
    
    // Simulierte Prüfung, ob Face ID unterstützt wird
    // In einer echten App würde hier die native Plattform geprüft werden
    const checkBiometricSupport = async () => {
      // Simuliert: Prüfe, ob die Plattform Face ID/Touch ID unterstützt
      setSupportsFaceId(true);
    };
    
    checkBiometricSupport();
    
    // Prüfe, ob die App gesperrt sein sollte
    const shouldBeLocked = localStorage.getItem('appLocked') === 'true';
    if (shouldBeLocked && pin) {
      setIsLocked(true);
    }
  }, [pin]);
  
  const validatePin = (enteredPin: string): boolean => {
    return enteredPin === pin;
  };
  
  const lockApp = () => {
    if (pin) {
      setIsLocked(true);
      localStorage.setItem('appLocked', 'true');
    }
  };
  
  const unlockApp = () => {
    setIsLocked(false);
    localStorage.setItem('appLocked', 'false');
  };
  
  // Simulierte Face ID-Authentifizierung
  // In einer echten App würde hier die native Biometrie-API aufgerufen werden
  const useFaceId = async (): Promise<boolean> => {
    if (!supportsFaceId) return false;
    
    // Simuliert eine erfolgreiche Biometrie-Authentifizierung
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  };

  return (
    <AppLockContext.Provider
      value={{
        isLocked,
        pin,
        setPin,
        validatePin,
        lockApp,
        unlockApp,
        supportsFaceId,
        useFaceId,
      }}
    >
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
