import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

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
  interests?: string[];
  investmentGoals?: string[];
  preferredPropertyTypes?: string[];
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
  accessibility?: {
    fontSize?: 'small' | 'medium' | 'large';
    highContrast?: boolean;
    reduceMotion?: boolean;
    screenReader?: boolean;
    enabled?: boolean;
    largeText?: boolean;
    dyslexiaFriendly?: boolean;
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
  lastActive?: string;
  notifications?: {
    security: boolean;
    updates: boolean;
    marketing: boolean;
    newsletter: boolean;
    price?: boolean;
    news?: boolean;
    portfolio?: boolean;
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
  lastVisitedPage?: string;
  visitedInvestorDashboard?: boolean;
  notificationsEnabled?: boolean;
  analyticsConsent?: boolean;
}

export interface OnboardingData {
  name: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  interests: string[];
  investmentGoals: string[];
  preferredPropertyTypes: string[];
  investmentPreference: string;
  investmentMarket: InvestmentMarket;
  goals: string[];
  propertyTypes: string[];
}

interface UserPreferencesContextValue {
  preferences: UserPreferences;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
  resetOnboarding?: () => void;
  hasCompletedOnboarding: boolean;
  isAccessibilityEnabled: boolean;
  // Auth related functions
  isAuthenticated?: boolean;
  loginUser?: (email: string, password: string) => Promise<boolean>;
  logoutUser?: () => void;
  registerUser?: (email: string, password: string, name: string) => Promise<boolean>;
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
  interests: [],
  investmentGoals: [],
  preferredPropertyTypes: [],
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
  accessibility: {
    fontSize: 'medium',
    highContrast: false,
    reduceMotion: false,
    screenReader: false,
    enabled: false
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
    newsletter: false,
    price: false,
    news: false,
    portfolio: false
  },
  // User profile defaults
  name: 'Demo User',
  email: 'demo@example.com',
  role: 'user',
  emailVerified: true,
  visitedPages: [],
  lastVisitedPage: '/'
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
  const loginUser = async (email: string, password: string): Promise<boolean> => {
    console.log('Login with:', email, password);
    setIsAuthenticated(true);
    updatePreferences({ 
      email,
      lastPasswordChange: new Date().toISOString()
    });
    return true;
  };

  const logoutUser = () => {
    setIsAuthenticated(false);
  };

  const registerUser = async (email: string, password: string, name: string): Promise<boolean> => {
    console.log('Register with:', email, password, name);
    setIsAuthenticated(true);
    updatePreferences({ 
      email,
      name,
      emailVerified: false,
      lastPasswordChange: new Date().toISOString()
    });
    return true;
  };

  // Save onboarding data
  const saveOnboardingData = (data: OnboardingData) => {
    updatePreferences({
      experienceLevel: data.experienceLevel as any,
      goals: data.goals,
      propertyTypes: data.propertyTypes,
      investmentPreference: data.investmentPreference as any,
      investmentMarket: data.investmentMarket,
      name: data.name,
      interests: data.interests,
      investmentGoals: data.investmentGoals,
      preferredPropertyTypes: data.preferredPropertyTypes,
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

  // Import language context (mock if not available in this context)
  const langContext = { t: (key: string) => key }; // Default implementation
  let t = (key: string) => key;
  
  try {
    // Try to use the language context if available
    t = useLanguage()?.t || ((key: string) => key);
  } catch (e) {
    console.warn('Language context not available in UserPreferencesContext');
  }
  
  // Reset onboarding data
  const resetOnboarding = () => {
    updatePreferences({
      onboardingCompleted: false,
      experienceLevel: 'beginner',
      goals: [],
      propertyTypes: [],
      investmentPreference: 'balanced',
      investmentMarket: 'global',
      interests: [],
      investmentGoals: [],
      preferredPropertyTypes: []
    });
    
    toast({
      title: t('onboardingReset'),
      description: t('onboardingResetDescription'),
    });
  };

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
        setIsFirstVisit,
        resetOnboarding
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

// Custom hook for easier access to the context
export const useUserPreferences = () => useContext(UserPreferencesContext);

export default UserPreferencesProvider;
