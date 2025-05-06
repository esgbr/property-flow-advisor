
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';

// Define types for user preferences
export type InvestmentMarket = 'germany' | 'usa' | 'austria' | 'france' | 'switzerland' | 'canada' | 'global';

export interface InvestmentMarketOption {
  id: InvestmentMarket;
  name: string;
}

export interface UserAccessibilityPreferences {
  highContrast?: boolean;
  highContrastOverride?: boolean;
  largeText?: boolean;
  reducedMotion?: boolean;
  reducedMotionOverride?: boolean;
  dyslexiaFriendly?: boolean;
  screenReader?: boolean;
}

export interface UserPreferences {
  name?: string;
  email?: string;
  language?: string;
  theme?: 'light' | 'dark' | 'system';
  market?: InvestmentMarket;
  accessibility?: UserAccessibilityPreferences;
  calculatorSettings?: {
    currency?: string;
    decimalSeparator?: '.' | ',';
    notationFormat?: 'standard' | 'scientific' | 'compact';
  };
  dashboardLayout?: {
    compactView?: boolean;
    hiddenWidgets?: string[];
    widgetOrder?: string[];
  };
  notifications?: {
    email?: boolean;
    push?: boolean;
    frequency?: 'daily' | 'weekly' | 'monthly' | 'never';
  };
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  resetPreferences: () => void;
}

// Default preferences
const defaultPreferences: UserPreferences = {
  language: 'en',
  theme: 'system',
  market: 'global',
  accessibility: {
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    dyslexiaFriendly: false,
    screenReader: false
  },
  calculatorSettings: {
    currency: 'EUR',
    decimalSeparator: '.',
    notationFormat: 'standard'
  },
  dashboardLayout: {
    compactView: false,
    hiddenWidgets: [],
    widgetOrder: []
  },
  notifications: {
    email: true,
    push: true,
    frequency: 'weekly'
  }
};

// Create the context
const UserPreferencesContext = createContext<UserPreferencesContextType>({
  preferences: defaultPreferences,
  updatePreferences: () => {},
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  resetPreferences: () => {}
});

// Export the hook to use this context
export const useUserPreferences = () => useContext(UserPreferencesContext);

// Provider component
export const UserPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useLocalStorage<UserPreferences>('userPreferences', defaultPreferences);
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage<boolean>('isAuthenticated', false);
  
  // Function to update preferences
  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    setPreferences(prev => ({
      ...prev,
      ...newPreferences
    }));
  };
  
  // Function to reset preferences to defaults
  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };
  
  // Check for system preferences on mount
  useEffect(() => {
    // Check for dark mode preference
    if (preferences.theme === 'system') {
      const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      if (darkModeMediaQuery.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      // Listen for changes
      const handleChange = (e: MediaQueryListEvent) => {
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      };
      
      darkModeMediaQuery.addEventListener('change', handleChange);
      
      return () => {
        darkModeMediaQuery.removeEventListener('change', handleChange);
      };
    } else if (preferences.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [preferences.theme]);
  
  return (
    <UserPreferencesContext.Provider 
      value={{ 
        preferences, 
        updatePreferences, 
        isAuthenticated, 
        setIsAuthenticated,
        resetPreferences
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};
