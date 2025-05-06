
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define available market types
export type InvestmentMarket = 'germany' | 'austria' | 'switzerland' | 'usa' | 'canada' | 'global';

export interface InvestmentMarketOption {
  id: InvestmentMarket;
  name: string;
}

export interface UserPreferences {
  darkMode?: boolean;
  theme?: string;
  language?: string;
  investmentMarket?: InvestmentMarket;
  investmentPreference?: 'growth' | 'income' | 'balanced';
  onboardingCompleted?: boolean;
  propertyTypes?: string[];
  experience?: 'beginner' | 'intermediate' | 'advanced';
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
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
  // Security related fields
  appLockEnabled?: boolean;
  appLockMethod?: string;
  dismissedSecurityAlert?: boolean;
  lastPasswordChange?: string;
  notifications?: {
    security: boolean;
    updates: boolean;
    marketing: boolean;
    newsletter: boolean;
  };
  // User profile fields
  name?: string;
  email?: string;
  role?: string;
  emailVerified?: boolean;
  profileImage?: string;
  sidebarPreferences?: {
    collapsed: boolean;
    favorites: string[];
  };
  visitedPages?: string[];
}

export interface OnboardingData {
  experienceLevel: string;
  goals: string[];
  propertyTypes: string[];
  investmentPreference: string;
  investmentMarket: InvestmentMarket;
}

interface UserPreferencesContextValue {
  preferences: UserPreferences;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
  hasCompletedOnboarding: boolean;
  isAccessibilityEnabled: boolean;
  // Auth related functions
  isAuthenticated?: boolean;
  loginUser?: (email: string, password: string) => Promise<void>;
  logoutUser?: () => void;
  registerUser?: (email: string, password: string, name: string) => Promise<void>;
  saveOnboardingData?: (data: OnboardingData) => void;
  isFirstVisit?: boolean;
  setIsFirstVisit?: (value: boolean) => void;
}

const defaultPreferences: UserPreferences = {
  darkMode: false,
  language: 'en',
  investmentMarket: 'germany',
  investmentPreference: 'balanced',
  onboardingCompleted: false,
  propertyTypes: [],
  experience: 'beginner',
  experienceLevel: 'beginner',
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
  workflows: {},
  // Security related defaults
  appLockEnabled: false,
  appLockMethod: 'pin',
  dismissedSecurityAlert: false,
  notifications: {
    security: true,
    updates: true,
    marketing: false,
    newsletter: false
  },
  // User profile defaults
  name: 'Demo User',
  email: 'demo@example.com',
  role: 'user',
  emailVerified: true,
  visitedPages: []
};

// Create context with default values
export const UserPreferencesContext = createContext<UserPreferencesContextValue>({
  preferences: defaultPreferences,
  updatePreferences: () => {},
  resetPreferences: () => {},
  hasCompletedOnboarding: false,
  isAccessibilityEnabled: false,
  isAuthenticated: false
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
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(true);

  // Update localStorage whenever preferences change
  useEffect(() => {
    try {
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save user preferences to localStorage', error);
    }
  }, [preferences]);

  // Mock auth functions for demo purposes
  const loginUser = async (email: string, password: string) => {
    console.log('Login with:', email, password);
    setIsAuthenticated(true);
    updatePreferences({ 
      email,
      lastPasswordChange: new Date().toISOString()
    });
  };

  const logoutUser = () => {
    setIsAuthenticated(false);
  };

  const registerUser = async (email: string, password: string, name: string) => {
    console.log('Register with:', email, password, name);
    setIsAuthenticated(true);
    updatePreferences({ 
      email,
      name,
      emailVerified: false,
      lastPasswordChange: new Date().toISOString()
    });
  };

  // Save onboarding data
  const saveOnboardingData = (data: OnboardingData) => {
    updatePreferences({
      experienceLevel: data.experienceLevel as any,
      goals: data.goals,
      propertyTypes: data.propertyTypes,
      investmentPreference: data.investmentPreference as any,
      investmentMarket: data.investmentMarket,
      onboardingCompleted: true
    });
  };

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
        isAccessibilityEnabled,
        isAuthenticated,
        loginUser,
        logoutUser,
        registerUser,
        saveOnboardingData,
        isFirstVisit,
        setIsFirstVisit
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

// Custom hook for easier access to the context
export const useUserPreferences = () => useContext(UserPreferencesContext);

export default UserPreferencesProvider;
