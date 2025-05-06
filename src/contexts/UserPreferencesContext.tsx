import React, { createContext, useState, useContext, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type Language = 'en' | 'de';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type InvestmentMarket = 'global' | 'germany' | 'usa' | 'austria' | 'switzerland';

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
  lastPasswordChange?: string; // Add this property
  experienceLevel?: ExperienceLevel;
  visitedPages?: string[];
  lastVisitedPage?: string;
  lastActive?: string;
  dismissedSecurityAlert?: boolean;
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
}

const UserPreferencesContext = createContext<UserPreferencesContextType>({
  preferences: defaultPreferences,
  updatePreferences: () => {},
  resetPreferences: () => {},
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

  return (
    <UserPreferencesContext.Provider value={{ preferences, updatePreferences, resetPreferences }}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

// Hook to consume preferences in a component
export const useUserPreferences = () => useContext(UserPreferencesContext);
