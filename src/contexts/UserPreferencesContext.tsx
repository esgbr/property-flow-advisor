import React, { createContext, useState, useContext, useEffect } from 'react';

// Update InvestmentMarket type to include 'other'
export type InvestmentMarket = 'germany' | 'austria' | 'switzerland' | 'france' | 'usa' | 'canada' | 'global' | '';

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
  resetOnboarding: () => {}
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
      investmentMarket: data.investmentMarket,
      interests: data.interests,
      investmentGoals: data.investmentGoals,
      preferredPropertyTypes: data.preferredPropertyTypes
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

  return (
    <UserPreferencesContext.Provider value={{
      preferences,
      updatePreferences,
      saveOnboardingData,
      updatePreference,
      resetPreferences,
      isFirstVisit,
      setIsFirstVisit,
      resetOnboarding
    }}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = (): UserPreferencesContextType => {
  return useContext(UserPreferencesContext);
};
