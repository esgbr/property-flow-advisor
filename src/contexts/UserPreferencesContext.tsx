
import React, { createContext, useState, useContext, useEffect } from 'react';

// Define InvestmentMarket type explicitly as a string union type
export type InvestmentMarket = 'germany' | 'austria' | 'switzerland' | 'france' | 'usa' | 'canada' | 'global' | 'other' | '';

// Update the UserPreferences interface to include all needed properties
export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  currency?: string;
  name?: string;
  email?: string;
  investmentMarket?: InvestmentMarket;
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
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
  // Adding missing properties
  darkMode?: boolean;
  notificationsEnabled?: boolean;
  analyticsConsent?: boolean;
  onboardingCompleted?: boolean;
  dismissedSecurityAlert?: boolean;
  visitedPages?: string[];
  lastVisitedPage?: string;
  lastActive?: string;
  todayWelcomed?: string;
  interests?: string[];
  investmentGoals?: string[];
  preferredPropertyTypes?: string[];
  visitedInvestorDashboard?: boolean;
  sidebarPreferences?: {
    collapsed?: boolean;
    favoriteItems?: string[];
  };
  // Adding properties needed for WelcomeModal
  isFirstVisit?: boolean;
  
  // Add missing property for AuthGuard.tsx
  emailVerified?: boolean;
  
  // Add missing property for UserMenu.tsx
  profileImage?: string;
  
  // Add recentMarkets for useMarketFilter.tsx
  recentMarkets?: InvestmentMarket[];
  
  // Add accessibility settings as individual properties
  reduceMotion?: boolean;
  highContrast?: boolean;
  largeText?: boolean;
  screenReader?: boolean;
  
  // Add user role property for admin features
  role?: 'user' | 'admin';
}

// Define OnboardingData type for WelcomeModal - fixing the error by making sure advanced is included
export interface OnboardingData {
  name: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  interests: string[];
  investmentGoals: string[];
  preferredPropertyTypes: string[];
  investmentMarket: InvestmentMarket;
}

interface UserPreferencesContextProps {
  preferences: UserPreferences;
  updatePreferences: (newPreferences: UserPreferences) => void;
  resetOnboarding?: () => void;
  isFirstVisit?: boolean;
  setIsFirstVisit?: (value: boolean) => void;
  saveOnboardingData?: (data: Partial<OnboardingData>) => void;
  loginUser?: (email: string, password: string) => Promise<boolean>;
  registerUser?: (name: string, email: string, password: string) => Promise<boolean>;
  logoutUser?: () => void;
  isAuthenticated?: boolean;
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
  },
  darkMode: false,
  notificationsEnabled: true,
  analyticsConsent: true,
  onboardingCompleted: false,
  dismissedSecurityAlert: false,
  visitedPages: [],
  todayWelcomed: '',
  sidebarPreferences: {
    collapsed: false,
    favoriteItems: []
  },
  isFirstVisit: true,
  // Initialize accessibility settings
  reduceMotion: false,
  highContrast: false,
  largeText: false,
  screenReader: false,
  // Default role is user, not admin
  role: 'user'
};

export const UserPreferencesProvider: React.FC<UserPreferencesProviderProps> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    // Load preferences from localStorage on initialization
    const storedPreferences = localStorage.getItem('userPreferences');
    return storedPreferences ? { ...defaultPreferences, ...JSON.parse(storedPreferences) } : defaultPreferences;
  });
  
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(preferences.isFirstVisit !== false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Save preferences to localStorage whenever they change
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    
    // Check for authentication token
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      setIsAuthenticated(true);
    }
  }, [preferences]);

  const updatePreferences = (newPreferences: UserPreferences) => {
    setPreferences(prevPreferences => ({ ...prevPreferences, ...newPreferences }));
  };

  // Add the resetOnboarding function
  const resetOnboarding = () => {
    updatePreferences({ onboardingCompleted: false });
  };
  
  // Add saveOnboardingData function
  const saveOnboardingData = (data: Partial<OnboardingData>) => {
    updatePreferences({
      ...data,
      onboardingCompleted: true
    });
  };
  
  // Mock login function (would connect to a real backend in production)
  const loginUser = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For demo purposes, consider specific emails as admin
      const isAdmin = email.includes('admin') || email === 'admin@example.com';
      
      // Store auth token (in real app, this would come from backend)
      localStorage.setItem('authToken', 'mock-jwt-token');
      setIsAuthenticated(true);
      
      // Update user preferences
      updatePreferences({ 
        ...preferences,
        email,
        role: isAdmin ? 'admin' : 'user',
        name: preferences.name || email.split('@')[0]
      });
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };
  
  // Mock register function
  const registerUser = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store auth token (in real app, this would come from backend)
      localStorage.setItem('authToken', 'mock-jwt-token');
      setIsAuthenticated(true);
      
      // Update user preferences
      updatePreferences({ 
        ...preferences,
        name,
        email,
        role: 'user'
      });
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };
  
  // Logout function
  const logoutUser = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  return (
    <UserPreferencesContext.Provider value={{ 
      preferences, 
      updatePreferences, 
      resetOnboarding, 
      isFirstVisit, 
      setIsFirstVisit,
      saveOnboardingData,
      loginUser,
      registerUser,
      logoutUser,
      isAuthenticated
    }}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = (): UserPreferencesContextProps => {
  return useContext(UserPreferencesContext);
};
