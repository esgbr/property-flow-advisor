
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUserPreferences } from './UserPreferencesContext';
import { languageDetector } from '@/utils/languageDetector';

// Define available languages
export type AvailableLanguage = 'en' | 'de';

// Translation dictionary type
type TranslationDictionary = Record<string, Record<AvailableLanguage, string>>;

// Translations
const translations: TranslationDictionary = {
  // General UI
  propertyFlow: {
    en: 'PropertyFlow',
    de: 'ImmobilienFlow'
  },
  investmentPlatform: {
    en: 'Real Estate Investment Platform',
    de: 'Immobilien-Investment-Plattform'
  },
  home: {
    en: 'Home',
    de: 'Startseite'
  },
  dashboard: {
    en: 'Dashboard',
    de: 'Dashboard'
  },
  settings: {
    en: 'Settings',
    de: 'Einstellungen'
  },
  language: {
    en: 'Language',
    de: 'Sprache'
  },
  theme: {
    en: 'Theme',
    de: 'Thema'
  },
  account: {
    en: 'Account',
    de: 'Konto'
  },
  login: {
    en: 'Login',
    de: 'Anmelden'
  },
  logout: {
    en: 'Logout',
    de: 'Abmelden'
  },
  register: {
    en: 'Register',
    de: 'Registrieren'
  },
  createAccount: {
    en: 'Create Account',
    de: 'Konto erstellen'
  },
  enterYourDetailsToRegister: {
    en: 'Enter your details to create an account',
    de: 'Geben Sie Ihre Daten ein, um ein Konto zu erstellen'
  },
  name: {
    en: 'Name',
    de: 'Name'
  },
  email: {
    en: 'Email',
    de: 'E-Mail'
  },
  password: {
    en: 'Password',
    de: 'Passwort'
  },
  confirmPassword: {
    en: 'Confirm Password',
    de: 'Passwort bestätigen'
  },
  creating: {
    en: 'Creating...',
    de: 'Erstelle...'
  },
  alreadyHaveAccount: {
    en: 'Already have an account?',
    de: 'Haben Sie bereits ein Konto?'
  },
  registrationDisclaimer: {
    en: 'By creating an account, you agree to our Terms of Service and Privacy Policy.',
    de: 'Durch die Erstellung eines Kontos stimmen Sie unseren Nutzungsbedingungen und Datenschutzrichtlinien zu.'
  },
  toggleMenu: {
    en: 'Toggle Menu',
    de: 'Menü umschalten'
  },
  pleaseCompleteAllFields: {
    en: 'Please complete all fields',
    de: 'Bitte füllen Sie alle Felder aus'
  },
  passwordsDoNotMatch: {
    en: 'Passwords do not match',
    de: 'Passwörter stimmen nicht überein'
  },
  passwordTooShort: {
    en: 'Password must be at least 8 characters',
    de: 'Passwort muss mindestens 8 Zeichen haben'
  },
  pleaseEnterEmailAndPassword: {
    en: 'Please enter your email and password',
    de: 'Bitte geben Sie Ihre E-Mail und Ihr Passwort ein'
  },
  invalidEmailOrPassword: {
    en: 'Invalid email or password',
    de: 'Ungültige E-Mail oder Passwort'
  },
  somethingWentWrong: {
    en: 'Something went wrong',
    de: 'Etwas ist schief gelaufen'
  },
  loginSuccessful: {
    en: 'Login successful',
    de: 'Anmeldung erfolgreich'
  },
  registrationSuccessful: {
    en: 'Registration successful',
    de: 'Registrierung erfolgreich'
  },
  registrationFailed: {
    en: 'Registration failed',
    de: 'Registrierung fehlgeschlagen'
  },
  error: {
    en: 'Error',
    de: 'Fehler'
  },
  success: {
    en: 'Success',
    de: 'Erfolg'
  },
  loggedOutSuccessfully: {
    en: 'Logged out successfully',
    de: 'Erfolgreich abgemeldet'
  },
  adminAccount: {
    en: 'Admin Account',
    de: 'Administrator-Konto'
  },
  hidePassword: {
    en: 'Hide Password',
    de: 'Passwort ausblenden'
  },
  showPassword: {
    en: 'Show Password',
    de: 'Passwort anzeigen'
  },
  
  // Portfolio Dashboard
  investmentPortfolio: {
    en: 'Investment Portfolio',
    de: 'Investmentportfolio'
  },
  trackYourRealEstateInvestments: {
    en: 'Track and manage your real estate investments',
    de: 'Verfolgen und verwalten Sie Ihre Immobilieninvestitionen'
  },
  totalValue: {
    en: 'Total Value',
    de: 'Gesamtwert'
  },
  cashFlow: {
    en: 'Cash Flow',
    de: 'Cashflow'
  },
  monthlyCashFlow: {
    en: 'Monthly Cash Flow',
    de: 'Monatlicher Cashflow'
  },
  roi: {
    en: 'ROI',
    de: 'ROI'
  },
  annualROI: {
    en: 'Annual ROI (%)',
    de: 'Jährliche Rendite (%)'
  },
  properties: {
    en: 'Properties',
    de: 'Immobilien'
  },
  appreciation: {
    en: 'Appreciation',
    de: 'Wertsteigerung'
  },
  annualAppreciation: {
    en: 'Annual Appreciation (%)',
    de: 'Jährliche Wertsteigerung (%)'
  },
  equity: {
    en: 'Equity',
    de: 'Eigenkapital'
  },
  propertyPerformance: {
    en: 'Property Performance',
    de: 'Immobilienperformance'
  },
  compareYourInvestments: {
    en: 'Compare the performance of your investments',
    de: 'Vergleichen Sie die Performance Ihrer Investitionen'
  },
  analytics: {
    en: 'Analytics',
    de: 'Analytik'
  },
  projections: {
    en: 'Projections',
    de: 'Prognosen'
  },
  propertyComparison: {
    en: 'Property Comparison',
    de: 'Immobilienvergleich'
  },
  allocation: {
    en: 'Allocation',
    de: 'Aufteilung'
  },
  portfolioProjections: {
    en: 'Portfolio Projections',
    de: 'Portfolio-Prognosen'
  },
  simulateYourPortfolioGrowth: {
    en: 'Simulate your portfolio growth over time',
    de: 'Simulieren Sie das Wachstum Ihres Portfolios im Laufe der Zeit'
  },
  exportData: {
    en: 'Export Data',
    de: 'Daten exportieren'
  },
  cashFlowAnalysis: {
    en: 'Cash Flow Analysis',
    de: 'Cashflow-Analyse'
  },
  cashFlowAnalysisDescription: {
    en: 'In-depth analysis of your cash flow streams from all properties',
    de: 'Eingehende Analyse Ihrer Cashflow-Ströme aus allen Immobilien'
  },
  unlockCashFlowAnalysis: {
    en: 'Unlock Cash Flow Analysis',
    de: 'Cashflow-Analyse freischalten'
  },
  assetAllocation: {
    en: 'Asset Allocation',
    de: 'Vermögensaufteilung'
  },
  assetAllocationDescription: {
    en: 'See how your capital is distributed across different properties and markets',
    de: 'Sehen Sie, wie Ihr Kapital auf verschiedene Immobilien und Märkte verteilt ist'
  },
  unlockAssetAllocation: {
    en: 'Unlock Asset Allocation',
    de: 'Vermögensaufteilung freischalten'
  },
  enhancedAnalytics: {
    en: 'Enhanced Analytics',
    de: 'Erweiterte Analytik'
  },
  enhancedAnalyticsDescription: {
    en: 'Unlock detailed performance metrics and ROI analysis for your properties',
    de: 'Schalten Sie detaillierte Performance-Metriken und ROI-Analysen für Ihre Immobilien frei'
  },
  viewDetailed: {
    en: 'View Detailed',
    de: 'Detaillierte Ansicht'
  },
  marketInsights: {
    en: 'Market Insights',
    de: 'Markteinblicke'
  },
  marketInsightsDescription: {
    en: 'Get insights into market trends and property appreciation forecasts',
    de: 'Erhalten Sie Einblicke in Markttrends und Prognosen zur Immobilienwertsteigerung'
  },
  connectMarketData: {
    en: 'Connect Market Data',
    de: 'Marktdaten verbinden'
  },
  featureNotification: {
    en: 'Feature Notification',
    de: 'Funktionsbenachrichtigung'
  },
  featureComingSoon: {
    en: 'feature is coming soon!',
    de: 'Funktion kommt bald!'
  },
  testAutomation: {
    en: 'Test Automation',
    de: 'Testautomatisierung'
  },
  
  // Investment Metrics
  investorMetrics: {
    en: 'Investor Metrics',
    de: 'Anleger-Kennzahlen'
  },
  keyPerformanceIndicators: {
    en: 'Key performance indicators for your investments',
    de: 'Wichtige Leistungsindikatoren für Ihre Investitionen'
  },
  exportMetrics: {
    en: 'Export Metrics',
    de: 'Metriken exportieren'
  },
  capRate: {
    en: 'Cap Rate',
    de: 'Kapitalisierungsrate'
  },
  netIncomeDividedByValue: {
    en: 'Net income divided by property value',
    de: 'Nettoeinkommen geteilt durch Immobilienwert'
  },
  cashOnCash: {
    en: 'Cash on Cash',
    de: 'Cash-on-Cash-Rendite'
  },
  annualCashFlowDividedByInvestment: {
    en: 'Annual cash flow divided by investment',
    de: 'Jährlicher Cashflow geteilt durch Investition'
  },
  debtServiceCoverage: {
    en: 'Debt Service Coverage',
    de: 'Schuldendienstdeckung'
  },
  netOperatingIncomeToDebtRatio: {
    en: 'Net operating income to debt ratio',
    de: 'Verhältnis von Nettobetriebseinnahmen zu Schulden'
  },
  breakEvenOccupancy: {
    en: 'Break-Even Occupancy',
    de: 'Break-Even-Belegung'
  },
  minimumOccupancyToBreakEven: {
    en: 'Minimum occupancy rate to break even',
    de: 'Mindestbelegungsrate, um die Gewinnschwelle zu erreichen'
  },
  
  // Security
  lock: {
    en: 'Lock',
    de: 'Sperren'
  },
  securityAlert: {
    en: 'Security Alert',
    de: 'Sicherheitswarnung'
  },
  securityAlertDescription: {
    en: 'Protect your investment data by setting up a PIN code or using Face ID.',
    de: 'Schützen Sie Ihre Investitionsdaten, indem Sie einen PIN-Code einrichten oder Face ID verwenden.'
  },
  setupPIN: {
    en: 'Setup PIN',
    de: 'PIN einrichten'
  },
  dismiss: {
    en: 'Dismiss',
    de: 'Ablehnen'
  },
  securityEnabled: {
    en: 'Security Enabled',
    de: 'Sicherheit aktiviert'
  },
  securityEnabledDescription: {
    en: 'Your account is protected with additional security measures.',
    de: 'Ihr Konto ist mit zusätzlichen Sicherheitsmaßnahmen geschützt.'
  }
};

// Context interface
interface LanguageContextProps {
  language: AvailableLanguage;
  setLanguage: (lang: AvailableLanguage) => void;
  t: (key: string) => string;
  availableLanguages: Array<{ code: AvailableLanguage; name: string }>;
}

// Create context
const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

// Provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { preferences, updatePreferences } = useUserPreferences();
  const [language, setLanguageState] = useState<AvailableLanguage>('en');
  
  // Available languages with native names
  const availableLanguages = [
    { code: 'en' as AvailableLanguage, name: 'English' },
    { code: 'de' as AvailableLanguage, name: 'Deutsch' }
  ];

  // Initialize language from preferences or detect it
  useEffect(() => {
    const initLanguage = async () => {
      let lang: AvailableLanguage = 'en';
      
      // First check preferences
      if (preferences.language && (preferences.language === 'en' || preferences.language === 'de')) {
        lang = preferences.language as AvailableLanguage;
      } else {
        // Then try to detect from browser
        const detectedLang = await languageDetector();
        if (detectedLang && (detectedLang === 'en' || detectedLang === 'de')) {
          lang = detectedLang as AvailableLanguage;
        }
      }
      
      setLanguageState(lang);
      
      // Save to preferences if not already set
      if (preferences.language !== lang) {
        updatePreferences({ language: lang });
      }
    };
    
    initLanguage();
  }, [preferences.language, updatePreferences]);

  // Set language handler
  const setLanguage = (lang: AvailableLanguage) => {
    setLanguageState(lang);
    updatePreferences({ language: lang });
    document.documentElement.lang = lang;
  };

  // Translation function
  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    
    // Fallback to English if translation not found
    if (translations[key] && translations[key]['en']) {
      return translations[key]['en'];
    }
    
    // Return the key as is if no translation found
    console.warn(`Translation missing for key: ${key}`);
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, availableLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook for using the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
