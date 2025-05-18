
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUserPreferences } from './UserPreferencesContext';
import enTranslations from '@/locales/en.json';
import deTranslations from '@/locales/de.json';
import esTranslations from '@/locales/es.json';
import frTranslations from '@/locales/fr.json';
import { LanguageCode, SupportedLanguage } from '@/types/language';

// Define language details
export const languageDetails: Record<LanguageCode, SupportedLanguage> = {
  en: {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇬🇧",
    enabled: true
  },
  de: {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    flag: "🇩🇪",
    enabled: true
  },
  es: {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    flag: "🇪🇸",
    enabled: true
  },
  fr: {
    code: "fr",
    name: "French",
    nativeName: "Français",
    flag: "🇫🇷",
    enabled: true
  }
};

// Available languages array
export const availableLanguages: SupportedLanguage[] = Object.values(languageDetails);

// Translation map
const translations: Record<string, Record<string, string>> = {
  en: enTranslations,
  de: deTranslations,
  es: esTranslations,
  fr: frTranslations
};

interface LanguageContextProps {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string, params?: Record<string, string>) => string;
  translations: Record<string, Record<string, string>>;
  availableLanguages: SupportedLanguage[];
  languageDetails: Record<LanguageCode, SupportedLanguage>;
}

// Create the context
const LanguageContext = createContext<LanguageContextProps>({
  language: 'en',
  setLanguage: () => {},
  t: () => '',
  translations,
  availableLanguages,
  languageDetails
});

// Provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { preferences, updatePreferences } = useUserPreferences();
  const [language, setLanguageState] = useState<LanguageCode>('en');

  // Initialize language from user preferences
  useEffect(() => {
    const browserLanguage = navigator.language.split('-')[0].toLowerCase() as LanguageCode;
    const preferredLanguage = (preferences.language as LanguageCode) || browserLanguage;
    
    // Check if preferred language is supported, default to English if not
    const supportedLanguage = availableLanguages.find(lang => lang.code === preferredLanguage && lang.enabled) ? 
      preferredLanguage : 'en';
    
    setLanguageState(supportedLanguage);
  }, [preferences.language]);

  // Function to change language
  const setLanguage = (newLanguage: LanguageCode) => {
    if (newLanguage !== language) {
      updatePreferences({ language: newLanguage });
      setLanguageState(newLanguage);
      
      // Update HTML lang attribute for accessibility
      document.documentElement.lang = newLanguage;
    }
  };

  // Translation function
  const t = (key: string, params?: Record<string, string>) => {
    // Get the translation for the current language
    const translation = translations[language]?.[key] || translations['en']?.[key] || key;
    
    // Replace parameters if provided
    if (params) {
      return Object.entries(params).reduce((result, [param, value]) => {
        return result.replace(new RegExp(`{{${param}}}`, 'g'), value);
      }, translation);
    }
    
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t, 
      translations,
      availableLanguages,
      languageDetails
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

export default LanguageProvider;
