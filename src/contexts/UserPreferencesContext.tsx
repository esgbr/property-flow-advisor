
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { OnboardingData } from '@/components/onboarding/OnboardingFlow';

interface UserPreferences {
  onboardingCompleted: boolean;
  experienceLevel: 'beginner' | 'intermediate' | 'expert';
  darkMode: boolean;
  investmentGoals: string[];
  preferredPropertyTypes: string[];
  analyticsConsent: boolean;
  notificationsEnabled: boolean;
  calendarIntegration: {
    google: boolean;
    outlook: boolean;
    apple: boolean;
  };
  educationProgress: {
    completedModules: string[];
    lastAccessedDate: string | null;
  };
  // Add new properties for tracking user activity and profile
  name: string;
  interests: string[];
  visitedPages: string[];
  lastVisitedPage: string;
  lastActive: string;
  todayWelcomed: string;
  visitedInvestorDashboard: boolean; // Added missing property
  // Portfolio tracking
  savedProperties: string[];
  watchlist: string[];
  // Settings synchronization
  dataSync: {
    enabled: boolean;
    lastSyncDate: string | null;
    devices: string[];
  };
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  resetOnboarding: () => void;
  isFirstVisit: boolean;
  setIsFirstVisit: (value: boolean) => void;
  saveOnboardingData: (data: OnboardingData) => void;
}

const defaultPreferences: UserPreferences = {
  onboardingCompleted: false,
  experienceLevel: 'beginner',
  darkMode: false,
  investmentGoals: [],
  preferredPropertyTypes: [],
  analyticsConsent: false,
  notificationsEnabled: true,
  calendarIntegration: {
    google: false,
    outlook: false,
    apple: false
  },
  educationProgress: {
    completedModules: [],
    lastAccessedDate: null
  },
  name: '',
  interests: [],
  visitedPages: [],
  lastVisitedPage: '',
  lastActive: new Date().toISOString(),
  todayWelcomed: '',
  visitedInvestorDashboard: false, // Added missing property with default value
  savedProperties: [],
  watchlist: [],
  dataSync: {
    enabled: true,
    lastSyncDate: null,
    devices: []
  }
};

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export const UserPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(true);
  const { toast } = useToast();

  // Load preferences from localStorage on component mount
  useEffect(() => {
    const storedPreferences = localStorage.getItem('userPreferences');
    const firstVisitCheck = localStorage.getItem('firstVisit');

    if (storedPreferences) {
      setPreferences(JSON.parse(storedPreferences));
    }

    if (firstVisitCheck) {
      setIsFirstVisit(false);
    }
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  }, [preferences]);

  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    setPreferences((prev) => ({
      ...prev,
      ...newPreferences,
    }));
  };

  const resetOnboarding = () => {
    setIsFirstVisit(true);
    localStorage.removeItem('firstVisit');
    toast({
      title: 'Onboarding Reset',
      description: 'You can now go through the onboarding process again.',
    });
  };

  const saveOnboardingData = (data: OnboardingData) => {
    updatePreferences({
      name: data.name || '',
      onboardingCompleted: true,
      experienceLevel: data.experienceLevel,
      investmentGoals: data.investmentGoals || [],
      preferredPropertyTypes: data.preferredPropertyTypes || [],
      interests: data.interests || []
    });
    
    localStorage.setItem('firstVisit', 'false');
    setIsFirstVisit(false);
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

export const useUserPreferences = (): UserPreferencesContextType => {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};
