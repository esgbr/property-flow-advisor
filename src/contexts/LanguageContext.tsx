
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useUserPreferences } from './UserPreferencesContext';
import { detectBrowserLanguage } from '@/utils/languageDetector';

// Unterstützte Sprachen
export const supportedLanguages = ['de', 'en', 'fr'];

// Standardübersetzungen für deutsch
const defaultTranslations = {
  welcome: 'Willkommen',
  login: 'Anmelden',
  register: 'Registrieren',
  dashboard: 'Dashboard',
  settings: 'Einstellungen',
  profile: 'Profil',
  notifications: 'Benachrichtigungen',
  language: 'Sprache',
  theme: 'Thema',
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
  adminWelcomeBack: 'Willkommen zurück, Administrator!',
  welcomeBack: 'Willkommen zurück',
  error: 'Fehler',
  adminAccessRequired: 'Administratorzugriff erforderlich',
  skipToContent: 'Zum Inhalt springen',
  toThe: 'zum',
  investorDashboard: 'Investoren-Dashboard',
  accessComprehensiveInvestmentTools: 'Zugriff auf umfassende Investment-Tools',
  continueMakingSmartInvestments: 'Setzen Sie Ihre intelligenten Investitionen fort',
  completeInvestmentToolsuite: 'Komplette Toolsuite für Immobilieninvestitionen',
  portfolio: 'Portfolio',
  marketAnalysis: 'Marktanalyse',
  financing: 'Finanzierung',
  taxPlanning: 'Steuerplanung',
  dueDiligence: 'Due Diligence',
  investmentPortfolio: 'Investitionsportfolio',
  trackYourRealEstateInvestments: 'Verfolgen Sie Ihre Immobilieninvestitionen',
  investorMetrics: 'Investorenkennzahlen',
  keyPerformanceIndicators: 'Wichtige Leistungsindikatoren',
  exportMetrics: 'Kennzahlen exportieren',
  exportData: 'Daten exportieren',
  capRate: 'Kapitalrendite',
  netIncomeDividedByValue: 'Nettoeinkommen geteilt durch Immobilienwert',
  cashOnCash: 'Cash-on-Cash-Rendite',
  annualCashFlowDividedByInvestment: 'Jährlicher Cashflow geteilt durch Investition',
  debtServiceCoverage: 'Schuldendienstdeckung',
  netOperatingIncomeToDebtRatio: 'Verhältnis von Nettobetriebseinkommen zu Schulden',
  breakEvenOccupancy: 'Break-Even-Belegung',
  minimumOccupancyToBreakEven: 'Mindestbelegung zum Erreichen der Gewinnschwelle',
  propertyPerformance: 'Immobilienperformance',
  compareYourInvestments: 'Vergleichen Sie Ihre Investitionen',
  cashFlow: 'Cashflow',
  roi: 'ROI',
  appreciation: 'Wertsteigerung',
  enhancedAnalytics: 'Erweiterte Analysen',
  enhancedAnalyticsDescription: 'Detaillierte Einblicke in die Performance Ihrer Investitionen',
  unlockAnalytics: 'Analysen freischalten',
  viewDetailed: 'Detaillierte Ansicht',
  marketInsights: 'Markteinblicke',
  marketInsightsDescription: 'Datengestützte Einblicke in Immobilienmärkte',
  connectMarketData: 'Marktdaten verbinden',
  featureNotification: 'Funktionshinweis',
  featureComingSoon: 'wird bald verfügbar sein',
  monthlyCashFlow: 'Monatlicher Cashflow',
  annualROI: 'Jährliche Rendite',
  annualAppreciation: 'Jährliche Wertsteigerung',
  propertyComparison: 'Immobilienvergleich',
  marketSpecificTools: 'Marktspezifische Tools',
  toolsForSpecificMarket: 'Tools für den {market} Markt',
  open: 'Öffnen',
  viewMarketSpecificTools: 'Alle marktspezifischen Tools anzeigen',
  All: 'Alle',
  Residential: 'Wohnimmobilien',
  Commercial: 'Gewerbeimmobilien',
  Yearly: 'Jährlich',
  Quarterly: 'Vierteljährlich',
  Monthly: 'Monatlich',
  Market: 'Markt',
  'Average Home Price': 'Durchschnittlicher Hauspreis',
  'Rental Yield': 'Mietrendite',
  'Average Rent Price': 'Durchschnittlicher Mietpreis',
  'Property Appreciation': 'Immobilienwertsteigerung',
  'Mortgage Rate': 'Hypothekenzins',
  'Investment Volume': 'Investitionsvolumen',
  'Vacancy Rate': 'Leerstandsrate',
  'Capitalization Rate': 'Kapitalisierungsrate',
  'Average Sales Price Explanation': 'Durchschnittlicher Verkaufspreis für Wohnimmobilien in diesem Markt',
  'Rental Yield Explanation': 'Jährliche Mieteinnahmen geteilt durch Immobilienwert',
  'Average Rent Explanation': 'Durchschnittliche monatliche Miete für eine Standardwohnung',
  'Property Appreciation Explanation': 'Jährliche Wertsteigerungsrate für Immobilien',
  'Mortgage Rate Explanation': 'Aktueller durchschnittlicher Zinssatz für Immobilienkredite',
  'Investment Volume Explanation': 'Gesamtvolumen der Immobilientransaktionen in diesem Markt',
  'Vacancy Rate Explanation': 'Prozentualer Anteil leerstehender Immobilien',
  'Capitalization Rate Explanation': 'Nettobetriebseinkommen geteilt durch Immobilienwert',
  'market Trends': 'Markttrends',
  'real Estate Market': 'Immobilienmarkt',
  'price Index': 'Preisindex',
  'rent Index': 'Mietindex',
  'sales Volume': 'Verkaufsvolumen',
  'portfolioProjections': 'Portfolio-Prognosen',
  'simulateYourPortfolioGrowth': 'Simulieren Sie das Wachstum Ihres Portfolios',
  'cashFlowAnalysis': 'Cashflow-Analyse',
  'cashFlowAnalysisDescription': 'Detaillierte Analyse Ihrer Einnahmen und Ausgaben',
  'unlockCashFlowAnalysis': 'Cashflow-Analyse freischalten',
  'assetAllocation': 'Asset-Allokation',
  'assetAllocationDescription': 'Optimale Verteilung Ihrer Immobilienanlagen',
  'unlockAssetAllocation': 'Asset-Allokation freischalten',
  'projections': 'Prognosen',
  'allocation': 'Allokation'
};

// Erstellen des Context
interface LanguageContextProps {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, params?: Record<string, string>) => string;
  availableLanguages: string[];
}

const LanguageContext = createContext<LanguageContextProps>({
  language: 'de',
  setLanguage: () => {},
  t: (key: string) => key,
  availableLanguages: supportedLanguages
});

interface LanguageProviderProps {
  children: React.ReactNode;
  defaultLanguage?: string;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ 
  children, 
  defaultLanguage = 'de' // Deutsch als Standard
}) => {
  const { preferences, updatePreferences } = useUserPreferences();
  const [language, setLanguageState] = useState<string>(
    preferences.language || defaultLanguage || detectBrowserLanguage() || 'de'
  );

  // Synchronisiere State mit UserPreferences
  useEffect(() => {
    if (preferences.language && preferences.language !== language) {
      setLanguageState(preferences.language);
    }
  }, [preferences.language, language]);

  // Setze Sprache und aktualisiere Preferences
  const setLanguage = (lang: string) => {
    if (supportedLanguages.includes(lang)) {
      setLanguageState(lang);
      updatePreferences({ language: lang });
    } else {
      console.warn(`Sprache "${lang}" wird nicht unterstützt. Verwende eine der folgenden: ${supportedLanguages.join(', ')}`);
    }
  };

  // Übersetzungsfunktion mit Parameter-Unterstützung
  const t = (key: string, params?: Record<string, string>): string => {
    let translation = defaultTranslations[key as keyof typeof defaultTranslations] || key;
    
    // Parameter-Ersetzung, falls vorhanden
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
      availableLanguages: supportedLanguages 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextProps => {
  return useContext(LanguageContext);
};
