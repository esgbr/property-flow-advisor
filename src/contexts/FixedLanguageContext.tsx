import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useUserPreferences } from './UserPreferencesContext';
import { detectBrowserLanguage, isLanguageSupported, getBestMatchLanguage } from '@/utils/languageDetector';

// Define the language types
export type SupportedLanguage = 'en' | 'de' | 'fr' | 'es' | 'it';

// Define the interface for language information
export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  flag: string;
  enabled: boolean;
  nativeName: string;
}

// Available languages in the application
export const availableLanguages: LanguageInfo[] = [
  { code: 'en', name: 'English', flag: '🇬🇧', enabled: true, nativeName: 'English' },
  { code: 'de', name: 'German', flag: '🇩🇪', enabled: true, nativeName: 'Deutsch' },
  { code: 'fr', name: 'French', flag: '🇫🇷', enabled: true, nativeName: 'Français' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', enabled: false, nativeName: 'Español' },
  { code: 'it', name: 'Italian', flag: '🇮🇹', enabled: false, nativeName: 'Italiano' }
];

// Basic translations for common UI elements
const basicTranslations: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Common UI elements
    "appName": "PropertyFlow",
    "dashboard": "Dashboard",
    "settings": "Settings",
    "save": "Save",
    "cancel": "Cancel",
    "close": "Close",
    "loading": "Loading...",
    "overview": "Overview",
    "translationStatus": "Translation Status",
    "preferences": "Preferences",
    "welcomeToPropertyFlowAdvisor": "Welcome to PropertyFlow Advisor",
    "yourPersonalRealEstateInvestmentCompanion": "Your personal real estate investment companion",
    "yourName": "Your Name",
    "enterYourName": "Enter your name",
    "chooseLanguage": "Choose Language",
    "selectYourPreferredLanguage": "Select your preferred language for the application",
    "languageSettings": "Language Settings",
    "manageLanguagePreferences": "Manage language preferences",
    "currentLanguage": "Current Language",
    "switchLanguageDescription": "Switch between available languages",
    "languagePreferences": "Language Preferences",
    "interfaceLanguage": "Interface Language",
    "interfaceLanguageDescription": "The language used for application elements",
    "interfaceLanguageInfo": "Select your preferred language",
    "activeLanguageDescription": "Currently selected language",
    "languagePreferencesDescription": "Advanced language options",
    "languageChanged": "Language Changed",
    "displayLanguageChanged": "Display language changed",
    "languageDetected": "Language detected",
    "browserLanguageDetected": "Browser language detected",
    "showBrowserLanguage": "Use browser language",
    "switchTo": "Switch to",
    "keepCurrentLanguage": "Keep current language",
    "liquidityPlanning": "Liquidity Planning",
    "comingSoon": "Coming Soon",
    "liquidityPlanningDescription": "Plan your real estate cash flow and optimize your liquidity",
    "notifyMeWhenLiquidityPlanningIsAvailable": "Notify me when liquidity planning is available",
    "notifyWhenAvailable": "Notify me when available",
    "notificationSaved": "Notification saved",
    "liquidityPlanningNotifyConfirmation": "We'll notify you when liquidity planning becomes available",
    "welcomeToGermanRealEstateTools": "Welcome to German Real Estate Investor Tools!",
    "welcomeToUSRealEstateTools": "Welcome to US Real Estate Investor Tools!",
    "welcomeToYourRealEstateDashboard": "Welcome to your Real Estate Dashboard!",
    "updatePreferencesSettings": "You can always update your preferences in Settings"
  },
  de: {
    // Common German translations
    "appName": "PropertyFlow",
    "dashboard": "Dashboard",
    "settings": "Einstellungen",
    "save": "Speichern",
    "cancel": "Abbrechen",
    "close": "Schließen",
    "loading": "Wird geladen...",
    "overview": "Übersicht",
    "translationStatus": "Übersetzungsstatus",
    "preferences": "Präferenzen",
    "welcomeToPropertyFlowAdvisor": "Willkommen beim PropertyFlow Berater",
    "yourPersonalRealEstateInvestmentCompanion": "Ihr persönlicher Immobilieninvestment-Begleiter",
    "yourName": "Ihr Name",
    "enterYourName": "Geben Sie Ihren Namen ein",
    "chooseLanguage": "Sprache wählen",
    "selectYourPreferredLanguage": "Wählen Sie Ihre bevorzugte Sprache für die Anwendung",
    "languageSettings": "Spracheinstellungen",
    "manageLanguagePreferences": "Spracheinstellungen verwalten",
    "currentLanguage": "Aktuelle Sprache",
    "switchLanguageDescription": "Zwischen verfügbaren Sprachen wechseln",
    "languagePreferences": "Spracheinstellungen",
    "interfaceLanguage": "Oberflächensprache",
    "interfaceLanguageDescription": "Die für die Anwendungselemente verwendete Sprache",
    "interfaceLanguageInfo": "Wählen Sie Ihre bevorzugte Sprache",
    "activeLanguageDescription": "Aktuell ausgewählte Sprache",
    "languagePreferencesDescription": "Erweiterte Sprachoptionen",
    "languageChanged": "Sprache geändert",
    "displayLanguageChanged": "Anzeigesprache geändert",
    "languageDetected": "Sprache erkannt",
    "browserLanguageDetected": "Browser-Sprache erkannt",
    "showBrowserLanguage": "Browser-Sprache verwenden",
    "switchTo": "Wechseln zu",
    "keepCurrentLanguage": "Aktuelle Sprache beibehalten",
    "liquidityPlanning": "Liquiditätsplanung",
    "comingSoon": "Demnächst verfügbar",
    "liquidityPlanningDescription": "Planen Sie Ihren Immobilien-Cashflow und optimieren Sie Ihre Liquidität",
    "notifyMeWhenLiquidityPlanningIsAvailable": "Benachrichtigen Sie mich, wenn die Liquiditätsplanung verfügbar ist",
    "notifyWhenAvailable": "Bei Verfügbarkeit benachrichtigen",
    "notificationSaved": "Benachrichtigung gespeichert",
    "liquidityPlanningNotifyConfirmation": "Wir benachrichtigen Sie, sobald die Liquiditätsplanung verfügbar ist",
    "welcomeToGermanRealEstateTools": "Willkommen bei den deutschen Immobilien-Investor-Tools!",
    "welcomeToUSRealEstateTools": "Willkommen bei den US-Immobilien-Investor-Tools!",
    "welcomeToYourRealEstateDashboard": "Willkommen in Ihrem Immobilien-Dashboard!",
    "updatePreferencesSettings": "Sie können Ihre Einstellungen jederzeit in den Einstellungen aktualisieren"
  },
  fr: {
    // Enhanced French translations
    "dashboard": "Tableau de bord",
    "settings": "Paramètres",
    "close": "Fermer",
    "overview": "Aperçu",
    "translationStatus": "État de la traduction",
    "preferences": "Préférences",
    "welcomeToPropertyFlowAdvisor": "Bienvenue sur PropertyFlow Advisor",
    "yourPersonalRealEstateInvestmentCompanion": "Votre compagnon personnel d'investissement immobilier",
    "yourName": "Votre nom",
    "enterYourName": "Entrez votre nom",
    "chooseLanguage": "Choisir la langue",
    "selectYourPreferredLanguage": "Sélectionnez votre langue préférée pour l'application",
    "appName": "PropertyFlow",
    "save": "Enregistrer",
    "cancel": "Annuler",
    "loading": "Chargement...",
    "comingSoon": "Bientôt disponible"
  },
  es: {
    // Minimal Spanish translations
    "dashboard": "Panel de control",
    "settings": "Configuración",
    "close": "Cerrar",
    "overview": "Resumen",
    "translationStatus": "Estado de traducción",
    "preferences": "Preferencias"
  },
  it: {
    // Minimal Italian translations
    "dashboard": "Dashboard",
    "settings": "Impostazioni",
    "close": "Chiudere",
    "overview": "Panoramica",
    "translationStatus": "Stato della traduzione",
    "preferences": "Preferenze"
  }
};

// Interface for the LanguageContext
interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: (key: string, options?: { [key: string]: any }) => string;
  availableLanguages: LanguageInfo[];
  translations: Record<SupportedLanguage, Record<string, string>>;
  updateTranslations: (newTranslations: Record<string, Record<SupportedLanguage, string>>) => void;
}

// Default context
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
  availableLanguages,
  translations: basicTranslations,
  updateTranslations: () => {}
});

// Interface for LanguageProvider props
interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { preferences, updatePreferences } = useUserPreferences();
  const supportedLanguageCodes = availableLanguages.map(lang => lang.code);
  
  // Initialize language from user preferences or browser language
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    // First check user preferences
    if (preferences.language && isLanguageSupported(preferences.language, supportedLanguageCodes)) {
      return preferences.language as SupportedLanguage;
    }
    
    // Then fallback to browser language detection
    return getBestMatchLanguage(supportedLanguageCodes) as SupportedLanguage;
  });
  
  // Extend translations state
  const [translationsState, setTranslationsState] = useState(basicTranslations);
  
  // Set language with side effects
  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    // Store in localStorage for persistence
    localStorage.setItem('preferredLanguage', lang);
    // Update user preferences
    updatePreferences({ language: lang });
  };

  // Load language from localStorage on component mount
  useEffect(() => {
    const storedLang = localStorage.getItem('preferredLanguage') as SupportedLanguage | null;
    if (storedLang && isLanguageSupported(storedLang, supportedLanguageCodes)) {
      setLanguageState(storedLang);
    }
  }, [supportedLanguageCodes]);

  // Translation function
  const t = (key: string, options?: { [key: string]: any }): string => {
    // Get translation from current language
    let translation = translationsState[language]?.[key];
    
    // Fallback to English if translation doesn't exist
    if (!translation && language !== 'en') {
      translation = translationsState.en?.[key];
    }
    
    // If still no translation, return the key itself as fallback
    if (!translation) {
      return key;
    }
    
    // Handle interpolation if options provided
    if (options) {
      return Object.keys(options).reduce(
        (acc, optionKey) => acc.replace(new RegExp(`{{${optionKey}}}`, 'g'), options[optionKey]),
        translation
      );
    }
    
    return translation;
  };

  // Function to update translations
  const updateTranslations = (newTranslations: Record<string, Record<SupportedLanguage, string>>) => {
    const updatedTranslations = { ...translationsState };
    
    // For each key in newTranslations
    Object.keys(newTranslations).forEach(key => {
      // For each language in that key
      Object.keys(newTranslations[key]).forEach(langCode => {
        const lang = langCode as SupportedLanguage;
        
        // Create language object if it doesn't exist
        if (!updatedTranslations[lang]) {
          updatedTranslations[lang] = {};
        }
        
        // Update translation
        updatedTranslations[lang][key] = newTranslations[key][lang];
      });
    });
    
    setTranslationsState(updatedTranslations);
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t, 
      availableLanguages,
      translations: translationsState,
      updateTranslations
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext;
