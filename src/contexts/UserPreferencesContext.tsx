
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define available market types
export type InvestmentMarket = 'germany' | 'austria' | 'switzerland' | 'usa' | 'canada' | 'global';

export interface InvestmentMarketOption {
  id: InvestmentMarket;
  name: string;
}

export interface UserPreferences {
  darkMode?: boolean;
  language?: string;
  investmentMarket?: InvestmentMarket;
  investmentPreference?: 'growth' | 'income' | 'balanced';
  onboardingCompleted?: boolean;
  propertyTypes?: string[];
  experience?: 'beginner' | 'intermediate' | 'advanced';
  goals?: string[];
  recentMarkets?: InvestmentMarket[];
  marketPreferences?: {
    favoriteRegions?: string[];
    priceRange?: {
      min: number;
      max: number;
    };
    propertyTypes?: string[];
  };
  notificationPreferences?: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  accessibilityPreferences?: {
    fontSize?: 'small' | 'medium' | 'large';
    highContrast?: boolean;
    reduceMotion?: boolean;
    screenReader?: boolean;
  };
  dashboardLayout?: {
    widgets: string[];
    layout: 'grid' | 'list';
  };
  workflows?: {
    [key: string]: {
      progress: number;
      currentStep: string;
      completed: boolean;
    }
  };
}

interface UserPreferencesContextValue {
  preferences: UserPreferences;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
  hasCompletedOnboarding: boolean;
  isAccessibilityEnabled: boolean;
}

const defaultPreferences: UserPreferences = {
  darkMode: false,
  language: 'en',
  investmentMarket: 'germany',
  investmentPreference: 'balanced',
  onboardingCompleted: false,
  propertyTypes: [],
  experience: 'beginner',
  goals: [],
  recentMarkets: [],
  marketPreferences: {
    favoriteRegions: [],
    priceRange: {
      min: 0,
      max: 1000000
    },
    propertyTypes: []
  },
  notificationPreferences: {
    email: true,
    push: true,
    sms: false
  },
  accessibilityPreferences: {
    fontSize: 'medium',
    highContrast: false,
    reduceMotion: false,
    screenReader: false
  },
  dashboardLayout: {
    widgets: ['portfolio', 'market', 'tasks', 'news'],
    layout: 'grid'
  },
  workflows: {}
};

// Create context with default values
export const UserPreferencesContext = createContext<UserPreferencesContextValue>({
  preferences: defaultPreferences,
  updatePreferences: () => {},
  resetPreferences: () => {},
  hasCompletedOnboarding: false,
  isAccessibilityEnabled: false
});

// Provider component
export const UserPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    // Try to load preferences from localStorage on initial render
    try {
      const savedPreferences = localStorage.getItem('userPreferences');
      return savedPreferences ? JSON.parse(savedPreferences) : defaultPreferences;
    } catch (error) {
      console.error('Failed to parse user preferences from localStorage', error);
      return defaultPreferences;
    }
  });

  // Update localStorage whenever preferences change
  useEffect(() => {
    try {
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save user preferences to localStorage', error);
    }
  }, [preferences]);

  // Update partial preferences
  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    setPreferences(prevPreferences => ({
      ...prevPreferences,
      ...newPreferences
    }));
  };

  // Reset all preferences to defaults
  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    localStorage.removeItem('userPreferences');
  };

  const hasCompletedOnboarding = Boolean(preferences.onboardingCompleted);
  
  // Check if any accessibility feature is enabled
  const isAccessibilityEnabled = Boolean(
    preferences.accessibilityPreferences?.highContrast ||
    preferences.accessibilityPreferences?.reduceMotion ||
    preferences.accessibilityPreferences?.screenReader ||
    preferences.accessibilityPreferences?.fontSize !== 'medium'
  );

  return (
    <UserPreferencesContext.Provider 
      value={{ 
        preferences, 
        updatePreferences, 
        resetPreferences, 
        hasCompletedOnboarding,
        isAccessibilityEnabled
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

// Custom hook for easier access to the context
export const useUserPreferences = () => useContext(UserPreferencesContext);

export default UserPreferencesProvider;
