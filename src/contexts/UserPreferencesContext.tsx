import React, { createContext, useState, useContext, useEffect } from 'react';

// Define InvestmentMarket type explicitly as a string union type
export type InvestmentMarket = 'germany' | 'austria' | 'switzerland' | 'france' | 'usa' | 'canada' | 'global' | 'other' | '';

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  currency?: string;
  name?: string;
  email?: string;
  investmentMarket?: InvestmentMarket;
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
  appLockEnabled?: boolean;
  appLockMethod?: 'pin' | 'biometric' | 'none';
  notifications?: {
    email?: boolean;
    push?: boolean;
    alerts?: boolean;
  };
  marketAlerts?: {
    priceDrops?: boolean;
    foreclosures?: boolean;
    newListings?: boolean;
  };
}

interface UserPreferencesContextProps {
  preferences: UserPreferences;
  updatePreferences: (newPreferences: UserPreferences) => void;
}

const UserPreferencesContext = createContext<UserPreferencesContextProps>({
  preferences: {},
  updatePreferences: () => {}
});

interface UserPreferencesProviderProps {
  children: React.ReactNode;
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  language: 'en',
  currency: 'USD',
  investmentMarket: 'global',
  experienceLevel: 'beginner',
  appLockEnabled: false,
  appLockMethod: 'none',
  notifications: {
    email: true,
    push: false,
    alerts: true
  },
  marketAlerts: {
    priceDrops: true,
    foreclosures: false,
    newListings: true
  }
};

export const UserPreferencesProvider: React.FC<UserPreferencesProviderProps> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    // Load preferences from localStorage on initialization
    const storedPreferences = localStorage.getItem('userPreferences');
    return storedPreferences ? { ...defaultPreferences, ...JSON.parse(storedPreferences) } : defaultPreferences;
  });

  useEffect(() => {
    // Save preferences to localStorage whenever they change
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  }, [preferences]);

  const updatePreferences = (newPreferences: UserPreferences) => {
    setPreferences(prevPreferences => ({ ...prevPreferences, ...newPreferences }));
  };

  return (
    <UserPreferencesContext.Provider value={{ preferences, updatePreferences }}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = (): UserPreferencesContextProps => {
  return useContext(UserPreferencesContext);
};
