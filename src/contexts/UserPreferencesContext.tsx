
import React, { createContext, useState, useContext, useEffect } from 'react';

// Update InvestmentMarket type to include 'other'
export type InvestmentMarket = 'germany' | 'austria' | 'switzerland' | 'france' | 'usa' | 'canada' | 'global' | '';

// Add InvestmentMarketOption interface
export interface InvestmentMarketOption {
  id: InvestmentMarket;
  name: string;
}

// Update UserPreferences interface with all missing properties
export interface UserPreferences {
  language?: string;
  theme?: string;
  investmentMarket?: InvestmentMarket;
  notifications?: {
    email?: boolean;
    push?: boolean;
    frequency?: 'daily' | 'weekly' | 'monthly' | 'never';
    security?: boolean;
    price?: boolean;
    news?: boolean;
    portfolio?: boolean;
  };
  onboardingCompleted?: boolean;
  isAuthenticated?: boolean;
  lastPasswordChange?: string;
  darkMode?: boolean;
  notificationsEnabled?: boolean;
  analyticsConsent?: boolean;
  visitedInvestorDashboard?: boolean;
  interests?: string[];
  investmentGoals?: string[];
  preferredPropertyTypes?: string[];
  name?: string;
  email?: string;
  role?: 'user' | 'admin' | 'guest';
  appLockEnabled?: boolean;
  emailVerified?: boolean;
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  dismissedSecurityAlert?: boolean;
  visitedPages?: string[];
  lastVisitedPage?: string;
  lastActive?: string;
  recentMarkets?: InvestmentMarket[];
  sidebarPreferences?: {
    collapsed?: boolean;
    theme?: 'light' | 'dark';
  };
  profileImage?: string;
  marketFilter?: {
    recentSearches?: string[];
    favoriteRegions?: string[];
  };
}

// Update the OnboardingData interface
export interface OnboardingData {
  name: string;
  experienceLevel: string;
  investmentMarket: InvestmentMarket;
  interests: string[];
  investmentGoals: string[];
  preferredPropertyTypes: string[];
}

export interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => void;
  saveOnboardingData: (data: OnboardingData) => void;
  updatePreference: (key: keyof UserPreferences, value: any) => void;
  resetPreferences: () => void;
  isFirstVisit: boolean;
  setIsFirstVisit: (value: boolean) => void;
  resetOnboarding: () => void;
  loginUser: (email: string, password: string) => Promise<boolean>;
  logoutUser: () => void;
  registerUser: (name: string, email: string, password: string) => Promise<boolean>;
  isAuthenticated: boolean;
}

// Create the context with a default value
export const UserPreferencesContext = createContext<UserPreferencesContextType>({
  preferences: {},
  updatePreferences: () => {},
  saveOnboardingData: () => {},
  updatePreference: () => {},
  resetPreferences: () => {},
  isFirstVisit: true,
  setIsFirstVisit: () => {},
  resetOnboarding: () => {},
  loginUser: () => Promise.resolve(false),
  logoutUser: () => {},
  registerUser: () => Promise.resolve(false),
  isAuthenticated: false
});

interface UserPreferencesProviderProps {
  children: React.ReactNode;
}

export const UserPreferencesProvider: React.FC<UserPreferencesProviderProps> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    // Initialize from localStorage
    const storedPreferences = localStorage.getItem('userPreferences');
    return storedPreferences ? JSON.parse(storedPreferences) : {};
  });
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(() => {
    // Check if it's the user's first visit
    const visited = localStorage.getItem('visitedBefore');
    return visited ? false : true;
  });

  // Compute authentication state
  const isAuthenticated = preferences.isAuthenticated || false;

  useEffect(() => {
    // Set visitedBefore in localStorage when the component mounts
    if (isFirstVisit) {
      localStorage.setItem('visitedBefore', 'true');
    }
  }, [isFirstVisit]);

  useEffect(() => {
    // Save preferences to localStorage whenever they change
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  }, [preferences]);

  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
  };

  const updatePreference = (key: keyof UserPreferences, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const saveOnboardingData = (data: OnboardingData) => {
    // Save onboarding data to preferences
    updatePreferences({
      onboardingCompleted: true,
      name: data.name,
      investmentMarket: data.investmentMarket,
      interests: data.interests,
      investmentGoals: data.investmentGoals,
      preferredPropertyTypes: data.preferredPropertyTypes,
      experienceLevel: data.experienceLevel as any
    });
  };

  const resetPreferences = () => {
    // Clear all preferences
    setPreferences({});
    localStorage.removeItem('userPreferences');
  };
  
  const resetOnboarding = () => {
    updatePreferences({ onboardingCompleted: false });
  };

  // Mock authentication functions
  const loginUser = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        setPreferences(prev => ({ 
          ...prev, 
          isAuthenticated: true,
          email,
          name: email.split('@')[0],
          role: 'user'
        }));
        resolve(true);
      }, 1000);
    });
  };

  const registerUser = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        setPreferences(prev => ({ 
          ...prev, 
          isAuthenticated: true,
          email,
          name,
          role: 'user'
        }));
        resolve(true);
      }, 1000);
    });
  };

  const logoutUser = () => {
    setPreferences(prev => ({ 
      ...prev, 
      isAuthenticated: false 
    }));
  };

  return (
    <UserPreferencesContext.Provider value={{
      preferences,
      updatePreferences,
      saveOnboardingData,
      updatePreference,
      resetPreferences,
      isFirstVisit,
      setIsFirstVisit,
      resetOnboarding,
      loginUser,
      logoutUser,
      registerUser,
      isAuthenticated
    }}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = (): UserPreferencesContextType => {
  return useContext(UserPreferencesContext);
};
