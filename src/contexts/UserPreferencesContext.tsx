import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { OnboardingData } from '@/components/onboarding/OnboardingFlow';

export type InvestmentMarket = 'germany' | 'austria' | 'switzerland' | 'france' | 'usa' | 'canada' | 'other' | 'global' | '';

interface UserPreferences {
  onboardingCompleted: boolean;
  experienceLevel: 'beginner' | 'intermediate' | 'expert';
  darkMode: boolean;
  investmentGoals: string[];
  preferredPropertyTypes: string[];
  investmentMarket: InvestmentMarket;
  analyticsConsent: boolean;
  notificationsEnabled: boolean;
  sidebarPreferences?: {
    collapsed: boolean;
    favorites: string[];
  };
  calendarIntegration: {
    google: boolean;
    outlook: boolean;
    apple: boolean;
  };
  educationProgress: {
    completedModules: string[];
    lastAccessedDate: string | null;
    certificatesEarned?: string[];
    quizScores?: Record<string, number>;
  };
  // User profile and activity tracking
  name: string;
  interests: string[];
  visitedPages: string[];
  lastVisitedPage: string;
  lastActive: string;
  todayWelcomed: string;
  visitedInvestorDashboard: boolean;
  // Portfolio tracking
  savedProperties: string[];
  watchlist: string[];
  // Settings synchronization
  dataSync: {
    enabled: boolean;
    lastSyncDate: string | null;
    devices: string[];
  };
  // Enhanced learning and education preferences
  learningPreferences?: {
    preferredLearningStyle: 'visual' | 'reading' | 'interactive' | null;
    emailNotifications: boolean;
    reminderFrequency: 'daily' | 'weekly' | 'monthly' | 'none';
  };
  // Security features
  dismissedSecurityAlert: boolean;
  autoLockEnabled?: boolean;
  autoLockTimeout?: number; // in minutes
  biometricAuthEnabled?: boolean;
  // Mobile app preferences
  mobileNotifications?: {
    push: boolean;
    deals: boolean;
    marketUpdates: boolean;
    messages: boolean;
    portfolioAlerts: boolean;
  };
  mobileDataSaver?: boolean;
  // Accessibility options
  accessibilityOptions?: {
    highContrast: boolean;
    largeText: boolean;
    reduceAnimations: boolean;
    screenReader: boolean;
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
  investmentMarket: '',
  analyticsConsent: false,
  notificationsEnabled: true,
  sidebarPreferences: {
    collapsed: false,
    favorites: []
  },
  calendarIntegration: {
    google: false,
    outlook: false,
    apple: false
  },
  educationProgress: {
    completedModules: [],
    lastAccessedDate: null,
    certificatesEarned: [],
    quizScores: {}
  },
  name: '',
  interests: [],
  visitedPages: [],
  lastVisitedPage: '',
  lastActive: new Date().toISOString(),
  todayWelcomed: '',
  visitedInvestorDashboard: false,
  savedProperties: [],
  watchlist: [],
  dataSync: {
    enabled: true,
    lastSyncDate: null,
    devices: []
  },
  learningPreferences: {
    preferredLearningStyle: null,
    emailNotifications: false,
    reminderFrequency: 'weekly'
  },
  dismissedSecurityAlert: false,
  autoLockEnabled: false,
  autoLockTimeout: 15, // 15 minutes default
  biometricAuthEnabled: false,
  mobileNotifications: {
    push: true,
    deals: true,
    marketUpdates: true,
    messages: true,
    portfolioAlerts: true
  },
  mobileDataSaver: false,
  accessibilityOptions: {
    highContrast: false,
    largeText: false,
    reduceAnimations: false,
    screenReader: false
  }
};

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export const UserPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    ...defaultPreferences,
    dismissedSecurityAlert: false
  });
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(true);
  const { toast } = useToast();

  // Load preferences from localStorage on component mount
  useEffect(() => {
    const storedPreferences = localStorage.getItem('userPreferences');
    const firstVisitCheck = localStorage.getItem('firstVisit');

    if (storedPreferences) {
      try {
        // Use a try-catch to safely parse JSON and handle potential corruption
        const parsedPreferences = JSON.parse(storedPreferences);
        setPreferences(prev => ({ ...prev, ...parsedPreferences }));
      } catch (error) {
        console.error('Error parsing stored preferences:', error);
        // If there's an error parsing, use default preferences
        setPreferences(defaultPreferences);
        // Backup corrupted data for potential recovery
        localStorage.setItem('userPreferencesBackup', storedPreferences);
        localStorage.setItem('userPreferences', JSON.stringify(defaultPreferences));
      }
    }

    if (firstVisitCheck) {
      setIsFirstVisit(false);
    }
  }, []);

  // Track user activity
  useEffect(() => {
    // Update last active timestamp when preferences change
    setPreferences(prev => ({
      ...prev,
      lastActive: new Date().toISOString(),
    }));
  }, [preferences.visitedPages]);

  // Auto-lock feature based on idle time
  useEffect(() => {
    if (!preferences.autoLockEnabled) return;
    
    let idleTimer: number | undefined;
    
    const resetTimer = () => {
      if (idleTimer) window.clearTimeout(idleTimer);
      
      idleTimer = window.setTimeout(() => {
        // Lock application after timeout expires
        console.log('Auto-lock triggered after inactivity');
        // This would trigger your app lock functionality
        toast({
          title: "Session Auto-Locked",
          description: "Your session was locked due to inactivity",
        });
      }, preferences.autoLockTimeout * 60 * 1000);
    };
    
    // Reset timer on user activity
    const activities = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    activities.forEach(event => {
      document.addEventListener(event, resetTimer, { passive: true });
    });
    
    // Initialize timer
    resetTimer();
    
    // Cleanup
    return () => {
      if (idleTimer) window.clearTimeout(idleTimer);
      activities.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [preferences.autoLockEnabled, preferences.autoLockTimeout, toast]);

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
      interests: data.interests || [],
      investmentMarket: data.investmentMarket || ''
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
