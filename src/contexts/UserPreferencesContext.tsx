
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
  // Add missing properties
  marketFilter?: InvestmentMarket;
  investmentMarket?: InvestmentMarket;
  dismissedSecurityAlert?: boolean;
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  visitedPages?: string[];
  lastVisitedPage?: string;
  lastActive?: string;
  appLockEnabled?: boolean;
  emailVerified?: boolean;
  role?: 'user' | 'admin';
  profileImage?: string;
  sidebarPreferences?: {
    collapsed?: boolean;
    width?: number;
  };
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

// Define OnboardingData interface
export interface OnboardingData {
  name: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  investmentGoals: string[];
  preferredPropertyTypes: string[];
  interests: string[];
  investmentMarket: InvestmentMarket;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
}

export interface OnboardingStepProps {
  data: Partial<OnboardingData>;
  updateData: (fieldName: keyof OnboardingData, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  resetPreferences: () => void;
  // Add missing functions
  registerUser: (name: string, email: string, password: string) => Promise<boolean>;
  loginUser: (email: string, password: string) => Promise<boolean>;
  logoutUser: () => void;
  saveOnboardingData: (data: OnboardingData) => void;
}

// Default preferences
const defaultPreferences: UserPreferences = {
  language: 'en',
  theme: 'system',
  market: 'global',
  marketFilter: 'global',
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
  resetPreferences: () => {},
  registerUser: async () => false,
  loginUser: async () => false,
  logoutUser: () => {},
  saveOnboardingData: () => {}
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

  // Mock authentication functions
  const registerUser = async (name: string, email: string, password: string): Promise<boolean> => {
    // In a real app, this would make an API call to register the user
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPreferences(prev => ({
        ...prev,
        name,
        email,
        role: 'user',
        emailVerified: false
      }));
      
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };
  
  const loginUser = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would make an API call to authenticate the user
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, just accept any credentials
      setIsAuthenticated(true);
      
      if (!preferences.email) {
        setPreferences(prev => ({
          ...prev,
          email,
          role: email.includes('admin') ? 'admin' : 'user'
        }));
      }
      
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };
  
  const logoutUser = () => {
    setIsAuthenticated(false);
  };
  
  const saveOnboardingData = (data: OnboardingData) => {
    updatePreferences({
      name: data.name,
      experienceLevel: data.experienceLevel,
      investmentMarket: data.investmentMarket
      // Add other fields as needed
    });
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
        resetPreferences,
        registerUser,
        loginUser,
        logoutUser,
        saveOnboardingData
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};
