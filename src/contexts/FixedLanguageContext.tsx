
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useUserPreferences } from './UserPreferencesContext';
import { detectBrowserLanguage } from '@/utils/languageDetector';

// Define supported languages
export type SupportedLanguage = 'de' | 'en';

// Available languages for selection
export const availableLanguages: SupportedLanguage[] = ['de', 'en'];

// Language information with additional metadata
export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  enabled: boolean;
}

// Detailed language information for UI display
export const languageDetails: LanguageInfo[] = [
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', enabled: true },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', enabled: true }
];

// Translation dictionary
const translations: Record<string, Record<string, string>> = {
  de: {
    welcome: 'Willkommen',
    login: 'Anmelden',
    register: 'Registrieren',
    dashboard: 'Dashboard',
    settings: 'Einstellungen',
    profile: 'Profil',
    notifications: 'Benachrichtigungen',
    language: 'Sprache',
    theme: 'Design',
    logout: 'Abmelden',
    propertyFlow: 'PropertyFlow',
    investmentPlatform: 'Ihre umfassende Plattform für Immobilieninvestitionen',
    createAccount: 'Konto erstellen',
    analytics: 'Analysen',
    properties: 'Immobilien',
    calculators: 'Rechner',
    cashFlowAnalysisDescription: 'Detaillierte Analyse Ihrer Einnahmen und Ausgaben',
    portfolioProjections: 'Prognosen für Ihr Immobilienportfolio',
    success: 'Erfolg',
    welcomeBack: 'Willkommen zurück',
    error: 'Fehler',
    adminAccessRequired: 'Administratorzugriff erforderlich',
    skipToContent: 'Zum Inhalt springen',
    toThe: 'zum',
    investorDashboard: 'Investoren-Dashboard',
    portfolio: 'Portfolio',
    marketAnalysis: 'Marktanalyse',
    financing: 'Finanzierung',
    taxPlanning: 'Steuerplanung',
    dueDiligence: 'Due Diligence',
    investmentPortfolio: 'Investitionsportfolio',
    cashFlow: 'Cashflow',
    roi: 'ROI',
    appreciation: 'Wertsteigerung',
    enhancedAnalytics: 'Erweiterte Analysen',
    unlockAnalytics: 'Analysen freischalten',
    viewDetailed: 'Detaillierte Ansicht',
    marketInsights: 'Markteinblicke',
    connectMarketData: 'Marktdaten verbinden',
    featureNotification: 'Funktionshinweis',
    featureComingSoon: 'wird bald verfügbar sein',
    marketSpecificTools: 'Marktspezifische Tools',
    open: 'Öffnen',
    securityAlert: 'Sicherheitshinweis',
    securityAlertDescription: 'Schützen Sie Ihre Daten mit einer PIN oder biometrischer Authentifizierung',
    setupPIN: 'PIN einrichten',
    dismiss: 'Später',
    securityEnabled: 'Sicherheit aktiviert',
    securityEnabledDescription: 'Ihre App ist jetzt mit PIN-Schutz gesichert',
    languageChanged: 'Sprache geändert',
    displayLanguageChanged: 'Die Anzeigesprache wurde geändert',
    changeLanguage: 'Sprache ändern',
    next: 'Weiter',
    back: 'Zurück',
    loading: 'Laden...',
    nächsteSchritte: 'Nächste Schritte',
    getStarted: 'Loslegen',
    weiter: 'Weiter',
    beginnHere: 'Hier beginnen',
    welcomeToPropertyFlowAdvisor: 'Willkommen bei PropertyFlow Advisor',
    welcomeToGermanRealEstateTools: 'Willkommen bei den deutschen Immobilien-Tools',
    welcomeToUSRealEstateTools: 'Willkommen bei den US-Immobilien-Tools',
    welcomeToYourRealEstateDashboard: 'Willkommen auf Ihrem Immobilien-Dashboard',
    updatePreferencesSettings: 'Sie können Ihre Einstellungen jederzeit ändern',
    name: 'Name',
    enterYourName: 'Geben Sie Ihren Namen ein',
    onboardingComplete: 'Einrichtung abgeschlossen',
    beginnerInvestor: 'Anfänger-Investor',
    intermediateInvestor: 'Fortgeschrittener Investor',
    advancedInvestor: 'Erfahrener Investor',
    expertInvestor: 'Experten-Investor',
    germany: 'Deutschland',
    austria: 'Österreich',
    switzerland: 'Schweiz',
    global: 'Global',
    mainNavigation: 'Hauptnavigation',
    tools: 'Tools',
    specializedTools: 'Spezialisierte Tools',
    planning: 'Planung',
    more: 'Mehr',
    new: 'Neu',
    deutscheImmobilienTools: 'Deutsche Immobilien-Tools',
    grunderwerbsteuer: 'Grunderwerbsteuer',
    afa: 'AfA-Rechner',
    dashboardTitle: 'Dashboard',
    fortschritt: 'Fortschritt',
    öffnen: 'Öffnen',
    nextStep: 'Nächster Schritt',
    continueWorkflow: 'Workflow fortsetzen',
    workflowSteps: 'Arbeitsablauf-Schritte',
    chooseMarket: 'Markt wählen',
    startCalculation: 'Berechnung starten',
    calculationResults: 'Ergebnisse der Berechnung',
    viewDetailedResults: 'Detaillierte Ergebnisse anzeigen',
    exportResults: 'Ergebnisse exportieren'
  },
  en: {
    welcome: 'Welcome',
    login: 'Log in',
    register: 'Register',
    dashboard: 'Dashboard',
    settings: 'Settings',
    profile: 'Profile',
    notifications: 'Notifications',
    language: 'Language',
    theme: 'Theme',
    logout: 'Log out',
    propertyFlow: 'PropertyFlow',
    investmentPlatform: 'Your comprehensive real estate investment platform',
    createAccount: 'Create account',
    analytics: 'Analytics',
    properties: 'Properties',
    calculators: 'Calculators',
    cashFlowAnalysisDescription: 'Detailed analysis of your income and expenses',
    portfolioProjections: 'Projections for your property portfolio',
    success: 'Success',
    welcomeBack: 'Welcome back',
    error: 'Error',
    adminAccessRequired: 'Admin access required',
    skipToContent: 'Skip to content',
    toThe: 'to the',
    investorDashboard: 'Investor Dashboard',
    portfolio: 'Portfolio',
    marketAnalysis: 'Market Analysis',
    financing: 'Financing',
    taxPlanning: 'Tax Planning',
    dueDiligence: 'Due Diligence',
    investmentPortfolio: 'Investment Portfolio',
    cashFlow: 'Cash Flow',
    roi: 'ROI',
    appreciation: 'Appreciation',
    enhancedAnalytics: 'Enhanced Analytics',
    unlockAnalytics: 'Unlock Analytics',
    viewDetailed: 'View Detailed',
    marketInsights: 'Market Insights',
    connectMarketData: 'Connect Market Data',
    featureNotification: 'Feature Notification',
    featureComingSoon: 'will be available soon',
    marketSpecificTools: 'Market Specific Tools',
    open: 'Open',
    securityAlert: 'Security Alert',
    securityAlertDescription: 'Protect your data with a PIN or biometric authentication',
    setupPIN: 'Setup PIN',
    dismiss: 'Dismiss',
    securityEnabled: 'Security Enabled',
    securityEnabledDescription: 'Your app is now secured with PIN protection',
    languageChanged: 'Language Changed',
    displayLanguageChanged: 'The display language has been changed',
    changeLanguage: 'Change Language',
    next: 'Next',
    back: 'Back',
    loading: 'Loading...',
    nächsteSchritte: 'Next Steps',
    getStarted: 'Get Started',
    weiter: 'Continue',
    beginnHere: 'Begin Here',
    welcomeToPropertyFlowAdvisor: 'Welcome to PropertyFlow Advisor',
    welcomeToGermanRealEstateTools: 'Welcome to German Real Estate Tools',
    welcomeToUSRealEstateTools: 'Welcome to US Real Estate Tools',
    welcomeToYourRealEstateDashboard: 'Welcome to Your Real Estate Dashboard',
    updatePreferencesSettings: 'You can update your preferences at any time',
    name: 'Name',
    enterYourName: 'Enter your name',
    onboardingComplete: 'Setup complete',
    beginnerInvestor: 'Beginner Investor',
    intermediateInvestor: 'Intermediate Investor',
    advancedInvestor: 'Advanced Investor',
    expertInvestor: 'Expert Investor',
    germany: 'Germany',
    austria: 'Austria',
    switzerland: 'Switzerland',
    global: 'Global',
    mainNavigation: 'Main Navigation',
    tools: 'Tools',
    specializedTools: 'Specialized Tools',
    planning: 'Planning',
    more: 'More',
    new: 'New',
    deutscheImmobilienTools: 'German Real Estate Tools',
    grunderwerbsteuer: 'Property Transfer Tax',
    afa: 'Depreciation Calculator',
    dashboardTitle: 'Dashboard',
    fortschritt: 'Progress',
    öffnen: 'Open',
    nextStep: 'Next Step',
    continueWorkflow: 'Continue Workflow',
    workflowSteps: 'Workflow Steps',
    chooseMarket: 'Choose Market',
    startCalculation: 'Start Calculation',
    calculationResults: 'Calculation Results',
    viewDetailedResults: 'View Detailed Results',
    exportResults: 'Export Results'
  }
};

// Define context props interface
interface LanguageContextProps {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, params?: Record<string, string>) => string;
  availableLanguages: LanguageInfo[];
  translations: Record<string, Record<string, string>>;
}

// Create context with default values
const LanguageContext = createContext<LanguageContextProps>({
  language: 'de',
  setLanguage: () => {},
  t: (key: string) => key,
  availableLanguages: languageDetails,
  translations
});

interface LanguageProviderProps {
  children: React.ReactNode;
  defaultLanguage?: SupportedLanguage;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ 
  children, 
  defaultLanguage = 'de' 
}) => {
  const { preferences, updatePreferences } = useUserPreferences();
  const [language, setLanguageState] = useState<SupportedLanguage>(
    (preferences.language as SupportedLanguage) || defaultLanguage || (detectBrowserLanguage() as SupportedLanguage) || 'de'
  );

  // Sync with user preferences
  useEffect(() => {
    if (preferences.language && preferences.language !== language) {
      setLanguageState(preferences.language as SupportedLanguage);
    }
  }, [preferences.language, language]);

  // Set language and update preferences
  const setLanguage = (lang: SupportedLanguage) => {
    if (availableLanguages.includes(lang)) {
      setLanguageState(lang);
      updatePreferences({ language: lang });
    } else {
      console.warn(`Language "${lang}" is not supported. Use one of the following: ${availableLanguages.join(', ')}`);
    }
  };

  // Translation function with parameter support
  const t = (key: string, params?: Record<string, string>): string => {
    let translation = translations[language]?.[key] || key;
    
    // Parameter replacement if present
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translation = translation.replace(`{${paramKey}}`, paramValue);
      });
    }
    
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t, 
      availableLanguages: languageDetails,
      translations
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextProps => {
  return useContext(LanguageContext);
};
