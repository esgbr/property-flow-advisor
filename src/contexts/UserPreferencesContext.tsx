
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
}

// Define OnboardingData type for WelcomeModal
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
  isFirstVisit: true
};

export const UserPreferencesProvider: React.FC<UserPreferencesProviderProps> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    // Load preferences from localStorage on initialization
    const storedPreferences = localStorage.getItem('userPreferences');
    return storedPreferences ? { ...defaultPreferences, ...JSON.parse(storedPreferences) } : defaultPreferences;
  });
  
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(preferences.isFirstVisit !== false);

  useEffect(() => {
    // Save preferences to localStorage whenever they change
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
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

  return (
    <UserPreferencesContext.Provider value={{ 
      preferences, 
      updatePreferences, 
      resetOnboarding, 
      isFirstVisit, 
      setIsFirstVisit,
      saveOnboardingData 
    }}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = (): UserPreferencesContextProps => {
  return useContext(UserPreferencesContext);
};
