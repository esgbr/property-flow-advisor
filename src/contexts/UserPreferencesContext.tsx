
import React, { useState, useEffect, useContext, createContext } from 'react';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type InvestmentMarket = 'germany' | 'austria' | 'switzerland' | 'usa' | 'canada' | 'global' | 'uk' | 'europe';
export type InvestmentPreference = 'conservative' | 'balanced' | 'growth' | 'aggressive' | 'income';
export type AppLockMethod = 'pin' | 'biometric' | 'password' | 'none';

export interface InvestmentMarketOption {
  id: InvestmentMarket;
  name: string;
  description?: string;
}

// Define the WidgetType to match what's in CustomizableDashboard
export type WidgetType = 'portfolio' | 'market' | 'calculator' | 'alerts' | 'news' | 'taxes';

// Widget configuration for customizable dashboard
export interface WidgetConfig {
  id: string;
  type: WidgetType; // Using the WidgetType union type instead of string
  title: Record<string, string>;
  visible: boolean;
  position: number;
  size: 'small' | 'medium' | 'large';
}

export interface UserPreferences {
  name?: string;
  email?: string;
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  contrastMode: boolean;
  language: string;
  experienceLevel?: ExperienceLevel;
  investmentMarket?: InvestmentMarket;
  investmentPreference?: InvestmentPreference;
  goals?: string[];
  propertyTypes?: string[];
  dismissedTips: string[];
  dismissedSecurityAlert?: boolean;
  emailNotifications: boolean;
  desktopNotifications: boolean;
  visitedPages: string[];
  lastVisitedPage: string;
  lastActive: string;
  calculatorDefaults: {
    interestRate: number;
    loanTerm: number;
    propertyManagementFee: number;
    propertyTax: number;
    insuranceRate: number;
    vacancyRate: number;
    maintenanceRate: number;
    appreciationRate: number;
  };
  onboardingCompleted: boolean;
  interests: string[];
  investmentGoals: string[];
  preferredPropertyTypes: string[];
  // Added missing properties
  appLockEnabled?: boolean;
  appLockMethod?: AppLockMethod;
  role?: string;
  emailVerified?: boolean;
  profileImage?: string;
  sidebarPreferences?: {
    collapsed?: boolean;
    favorites?: string[];
  };
  notifications?: {
    security?: boolean;
    price?: boolean;
    news?: boolean;
    portfolio?: boolean;
  };
  lastPasswordChange?: string;
  notificationPreferences?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
  analyticsConsent?: boolean;
  theme?: 'light' | 'dark' | 'system';
  accessibility?: {
    reduceMotion?: boolean;
    highContrast?: boolean;
    largeText?: boolean;
    screenReader?: boolean;
    dyslexiaFriendly?: boolean;
    reducedMotionOverride?: boolean;
    highContrastOverride?: boolean;
  };
  recentMarkets?: InvestmentMarket[];
  // New properties for dashboard customization
  dashboardWidgets?: WidgetConfig[];
  favoriteProperties?: string[];
  comparisonHistory?: {
    id: string;
    properties: string[];
    date: string;
    name?: string;
  }[];
}

export interface OnboardingData {
  name: string;
  experienceLevel: ExperienceLevel;
  investmentMarket: InvestmentMarket;
  investmentPreference: InvestmentPreference;
  goals: string[];
  propertyTypes: string[];
  interests: string[];
  investmentGoals: string[];
  preferredPropertyTypes: string[];
}

interface UserPreferencesContextProps {
  isFirstVisit: boolean;
  setIsFirstVisit: React.Dispatch<React.SetStateAction<boolean>>;
  preferences: UserPreferences;
  updatePreferences: (newPrefs: Partial<UserPreferences>) => void;
  resetPreferences: (preserveFields?: Partial<UserPreferences>) => void;
  saveOnboardingData: (data: OnboardingData) => void;
  // Added properties to make them available in the context
  isAuthenticated?: boolean;
  loginUser?: (email: string, password: string) => Promise<boolean>;
  registerUser?: (name: string, email: string, password: string) => Promise<boolean>;
  logoutUser?: () => void;
  resetOnboarding?: () => void;
}

const defaultPreferences: UserPreferences = {
  darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
  fontSize: 'medium',
  contrastMode: false,
  language: navigator.language.toLowerCase().startsWith('de') ? 'de' : 'en',
  dismissedTips: [],
  emailNotifications: true,
  desktopNotifications: false,
  visitedPages: [],
  lastVisitedPage: '/',
  lastActive: new Date().toISOString(),
  calculatorDefaults: {
    interestRate: 3.5,
    loanTerm: 30,
    propertyManagementFee: 8,
    propertyTax: 1.2,
    insuranceRate: 0.5,
    vacancyRate: 5,
    maintenanceRate: 1.5,
    appreciationRate: 2.0
  },
  onboardingCompleted: false,
  interests: [],
  investmentGoals: [],
  preferredPropertyTypes: [],
  // New defaults for dashboard customization
  dashboardWidgets: [],
  favoriteProperties: [],
  comparisonHistory: []
};

// Export the context directly for use with useContext in other files
export const UserPreferencesContext = createContext<UserPreferencesContextProps>({
  isFirstVisit: true,
  setIsFirstVisit: () => {},
  preferences: defaultPreferences,
  updatePreferences: () => {},
  resetPreferences: () => {},
  saveOnboardingData: () => {}
});

export const UserPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const savedPreferences = localStorage.getItem('userPreferences');
    return savedPreferences ? { ...defaultPreferences, ...JSON.parse(savedPreferences) } : defaultPreferences;
  });
  
  const [isFirstVisit, setIsFirstVisit] = useState(() => {
    const firstVisit = localStorage.getItem('firstVisit');
    return firstVisit === null || firstVisit === 'true';
  });
  
  // Mock authentication state for demo purposes
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  }, [preferences]);

  // Save first visit status to localStorage
  useEffect(() => {
    localStorage.setItem('firstVisit', String(isFirstVisit));
  }, [isFirstVisit]);
  
  // Save auth status to localStorage
  useEffect(() => {
    localStorage.setItem('isAuthenticated', String(isAuthenticated));
  }, [isAuthenticated]);

  const updatePreferences = (newPrefs: Partial<UserPreferences>) => {
    setPreferences(prevPrefs => ({ ...prevPrefs, ...newPrefs }));
  };

  const resetPreferences = (preserveFields: Partial<UserPreferences> = {}) => {
    setPreferences({ ...defaultPreferences, ...preserveFields });
    if (!preserveFields.onboardingCompleted) {
      setIsFirstVisit(true);
    }
  };

  const saveOnboardingData = (data: OnboardingData) => {
    setPreferences(prev => ({
      ...prev,
      name: data.name,
      experienceLevel: data.experienceLevel,
      investmentMarket: data.investmentMarket,
      investmentPreference: data.investmentPreference,
      goals: data.goals,
      propertyTypes: data.propertyTypes,
      interests: data.interests || [],
      investmentGoals: data.investmentGoals || [],
      preferredPropertyTypes: data.preferredPropertyTypes || [],
      onboardingCompleted: true
    }));
    setIsFirstVisit(false);
  };
  
  // Mock login function for demo purposes
  const loginUser = async (email: string, password: string): Promise<boolean> => {
    return new Promise(resolve => {
      setTimeout(() => {
        setIsAuthenticated(true);
        updatePreferences({
          email: email,
          name: email.split('@')[0],
          role: email.includes('admin') ? 'admin' : 'user',
          lastActive: new Date().toISOString(),
          emailVerified: true
        });
        resolve(true);
      }, 1000);
    });
  };
  
  // Mock register function for demo purposes
  const registerUser = async (name: string, email: string, password: string): Promise<boolean> => {
    return new Promise(resolve => {
      setTimeout(() => {
        setIsAuthenticated(true);
        updatePreferences({
          name,
          email,
          role: 'user',
          lastActive: new Date().toISOString(),
          emailVerified: false
        });
        resolve(true);
      }, 1000);
    });
  };
  
  // Mock logout function
  const logoutUser = () => {
    setIsAuthenticated(false);
  };

  return (
    <UserPreferencesContext.Provider
      value={{
        isFirstVisit,
        setIsFirstVisit,
        preferences,
        updatePreferences,
        resetPreferences,
        saveOnboardingData,
        isAuthenticated,
        loginUser,
        registerUser,
        logoutUser
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => useContext(UserPreferencesContext);
