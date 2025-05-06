
import React, { createContext, useState, useContext, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type Language = 'en' | 'de';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type InvestmentMarket = 'global' | 'germany' | 'usa' | 'austria' | 'switzerland' | 'canada';

// Define the shape of our user preferences
export interface UserPreferences {
  theme: Theme;
  language: Language;
  name?: string;
  email?: string;
  isAuthenticated: boolean;
  visitedDashboard?: boolean;
  visitedInvestorDashboard?: boolean;
  hasCompletedOnboarding?: boolean;
  role?: 'user' | 'admin' | 'premium';
  preferences?: {
    notifications?: boolean;
    marketUpdates?: boolean;
    newsletter?: boolean;
  };
  marketFilter?: InvestmentMarket;
  lastPasswordChange?: string;
  experienceLevel?: ExperienceLevel;
  visitedPages?: string[];
  lastVisitedPage?: string;
  lastActive?: string;
  dismissedSecurityAlert?: boolean;
  appLockEnabled?: boolean;
  appLockMethod?: 'pin' | 'biometric';
  sidebarPreferences?: {
    collapsed?: boolean;
    favorites?: string[];
  };
  investmentMarket?: InvestmentMarket;
  emailVerified?: boolean;
  profileImage?: string;
  notifications?: {
    alerts?: boolean;
    updates?: boolean;
    marketing?: boolean;
  };
  onboardingCompleted?: boolean;
  accessibility?: {
    reduceMotion?: boolean;
    highContrast?: boolean;
    largeText?: boolean;
    screenReader?: boolean;
  };
}

// Set up the initial (default) user preferences
const defaultPreferences: UserPreferences = {
  theme: 'system',
  language: 'en',
  isAuthenticated: false,
  marketFilter: 'global',
};

// Create a context for these preferences
interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
  isAuthenticated: boolean;
  loginUser: (email: string, password: string) => Promise<boolean>;
  logoutUser: () => void;
  registerUser: (name: string, email: string, password: string) => Promise<boolean>;
  saveOnboardingData: <T>(data: T) => void;
}

const UserPreferencesContext = createContext<UserPreferencesContextType>({
  preferences: defaultPreferences,
  updatePreferences: () => {},
  resetPreferences: () => {},
  isAuthenticated: false,
  loginUser: () => Promise.resolve(false),
  logoutUser: () => {},
  registerUser: () => Promise.resolve(false),
  saveOnboardingData: () => {},
});

// Provider to supply preferences to app
interface UserPreferencesProviderProps {
  children: React.ReactNode;
}

export const UserPreferencesProvider: React.FC<UserPreferencesProviderProps> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);

  useEffect(() => {
    // Load preferences from localStorage on mount
    try {
      const storedPreferences = localStorage.getItem('userPreferences');
      if (storedPreferences) {
        setPreferences(JSON.parse(storedPreferences));
      }
    } catch (error) {
      console.error('Failed to load user preferences from localStorage', error);
    }
  }, []);

  useEffect(() => {
    // Save preferences to localStorage whenever they change
    try {
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save user preferences to localStorage', error);
    }
  }, [preferences]);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences((prevPreferences) => ({
      ...prevPreferences,
      ...updates,
    }));
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    localStorage.removeItem('userPreferences');
  };
  
  // Authentication methods
  const loginUser = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would make an API request to authenticate
    // For demo purposes, we'll simulate a successful login
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock successful login
      updatePreferences({
        email,
        name: email.split('@')[0],
        isAuthenticated: true,
        role: email.includes('admin') ? 'admin' : 'user',
        lastActive: new Date().toISOString(),
        emailVerified: true,
      });
      
      localStorage.setItem('lastUserActivity', new Date().toISOString());
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };
  
  const logoutUser = () => {
    updatePreferences({
      ...defaultPreferences,
      lastActive: new Date().toISOString(),
    });
  };
  
  const registerUser = async (name: string, email: string, password: string): Promise<boolean> => {
    // In a real app, this would make an API request to register a new user
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful registration and login
      updatePreferences({
        name,
        email,
        isAuthenticated: true,
        role: 'user',
        lastActive: new Date().toISOString(),
        emailVerified: false,
        onboardingCompleted: false,
      });
      
      localStorage.setItem('lastUserActivity', new Date().toISOString());
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };
  
  // Onboarding data handling
  const saveOnboardingData = <T,>(data: T) => {
    updatePreferences({
      onboardingCompleted: true,
      // Any other onboarding-specific data can be saved here
    });
  };

  return (
    <UserPreferencesContext.Provider 
      value={{ 
        preferences, 
        updatePreferences, 
        resetPreferences, 
        isAuthenticated: preferences.isAuthenticated, 
        loginUser, 
        logoutUser, 
        registerUser,
        saveOnboardingData
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

// Hook to consume preferences in a component
export const useUserPreferences = () => useContext(UserPreferencesContext);

export interface OnboardingData {
  investmentPreferences?: {
    marketType?: string;
    investmentAmount?: number;
    riskTolerance?: 'low' | 'medium' | 'high';
  };
  personalInfo?: {
    country?: string;
    taxRate?: number;
  };
}
