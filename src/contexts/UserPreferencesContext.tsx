
import React, { useState, useEffect, useContext, createContext } from 'react';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type InvestmentMarket = 'germany' | 'austria' | 'switzerland' | 'usa' | 'canada' | 'global' | 'uk' | 'europe';
export type InvestmentPreference = 'conservative' | 'balanced' | 'growth' | 'aggressive';

export interface UserPreferences {
  name?: string;
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
  preferredPropertyTypes: []
};

const UserPreferencesContext = createContext<Partial<UserPreferencesContextProps>>({});

export const UserPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const savedPreferences = localStorage.getItem('userPreferences');
    return savedPreferences ? { ...defaultPreferences, ...JSON.parse(savedPreferences) } : defaultPreferences;
  });
  
  const [isFirstVisit, setIsFirstVisit] = useState(() => {
    const firstVisit = localStorage.getItem('firstVisit');
    return firstVisit === null || firstVisit === 'true';
  });

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  }, [preferences]);

  // Save first visit status to localStorage
  useEffect(() => {
    localStorage.setItem('firstVisit', String(isFirstVisit));
  }, [isFirstVisit]);

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

  return (
    <UserPreferencesContext.Provider
      value={{
        isFirstVisit,
        setIsFirstVisit,
        preferences,
        updatePreferences,
        resetPreferences,
        saveOnboardingData
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => useContext(UserPreferencesContext);
