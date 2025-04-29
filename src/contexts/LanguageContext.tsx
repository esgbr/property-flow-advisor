
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

type Language = 'en' | 'de' | 'es' | 'fr' | 'it';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Übersetzungen für verschiedene Sprachen
const translations: Record<Language, Record<string, string>> = {
  en: {
    dashboard: 'Dashboard',
    properties: 'Properties',
    calculators: 'Calculators',
    schedule: 'Schedule',
    refurbishment: 'Refurbishment',
    decision: 'Decision',
    propertyDetails: 'Property Details',
    financialAnalysis: 'Financial Analysis',
    refurbishmentTab: 'Refurbishment',
    documents: 'Documents',
    appLock: 'App Lock',
    enterPin: 'Enter PIN',
    useFaceId: 'Use Face ID',
    unlock: 'Unlock',
    lock: 'Lock',
    language: 'Language',
    english: 'English',
    german: 'German',
    spanish: 'Spanish',
    french: 'French',
    italian: 'Italian',
    settings: 'Settings',
    settingsDescription: 'Customize your application preferences',
    languageDescription: 'Change the display language',
    currentLanguage: 'Current Language',
    selectLanguage: 'Select your preferred language',
    mainNavigation: 'Main Navigation',
    // Weitere Übersetzungen hier hinzufügen
  },
  de: {
    dashboard: 'Dashboard',
    properties: 'Immobilien',
    calculators: 'Rechner',
    schedule: 'Zeitplan',
    refurbishment: 'Sanierung',
    decision: 'Entscheidung',
    propertyDetails: 'Immobiliendetails',
    financialAnalysis: 'Finanzanalyse',
    refurbishmentTab: 'Sanierung',
    documents: 'Dokumente',
    appLock: 'App-Sperre',
    enterPin: 'PIN eingeben',
    useFaceId: 'Face ID verwenden',
    unlock: 'Entsperren',
    lock: 'Sperren',
    language: 'Sprache',
    english: 'Englisch',
    german: 'Deutsch',
    spanish: 'Spanisch',
    french: 'Französisch',
    italian: 'Italienisch',
    settings: 'Einstellungen',
    settingsDescription: 'Passen Sie Ihre Anwendungseinstellungen an',
    languageDescription: 'Ändern Sie die Anzeigesprache',
    currentLanguage: 'Aktuelle Sprache',
    selectLanguage: 'Wählen Sie Ihre bevorzugte Sprache',
    mainNavigation: 'Hauptnavigation',
    // Weitere Übersetzungen hier hinzufügen
  },
  es: {
    dashboard: 'Tablero',
    properties: 'Propiedades',
    calculators: 'Calculadoras',
    schedule: 'Calendario',
    refurbishment: 'Renovación',
    decision: 'Decisión',
    propertyDetails: 'Detalles de propiedad',
    financialAnalysis: 'Análisis financiero',
    refurbishmentTab: 'Renovación',
    documents: 'Documentos',
    appLock: 'Bloqueo de app',
    enterPin: 'Ingresar PIN',
    useFaceId: 'Usar Face ID',
    unlock: 'Desbloquear',
    lock: 'Bloquear',
    language: 'Idioma',
    english: 'Inglés',
    german: 'Alemán',
    spanish: 'Español',
    french: 'Francés',
    italian: 'Italiano',
    settings: 'Configuración',
    settingsDescription: 'Personaliza tus preferencias de aplicación',
    languageDescription: 'Cambiar el idioma de visualización',
    currentLanguage: 'Idioma actual',
    selectLanguage: 'Selecciona tu idioma preferido',
    mainNavigation: 'Navegación principal',
    // Weitere Übersetzungen hier hinzufügen
  },
  fr: {
    dashboard: 'Tableau de bord',
    properties: 'Propriétés',
    calculators: 'Calculatrices',
    schedule: 'Calendrier',
    refurbishment: 'Rénovation',
    decision: 'Décision',
    propertyDetails: 'Détails de la propriété',
    financialAnalysis: 'Analyse financière',
    refurbishmentTab: 'Rénovation',
    documents: 'Documents',
    appLock: 'Verrouillage',
    enterPin: 'Entrer le code PIN',
    useFaceId: 'Utiliser Face ID',
    unlock: 'Déverrouiller',
    lock: 'Verrouiller',
    language: 'Langue',
    english: 'Anglais',
    german: 'Allemand',
    spanish: 'Espagnol',
    french: 'Français',
    italian: 'Italien',
    settings: 'Paramètres',
    settingsDescription: 'Personnalisez vos préférences d\'application',
    languageDescription: 'Changer la langue d\'affichage',
    currentLanguage: 'Langue actuelle',
    selectLanguage: 'Sélectionnez votre langue préférée',
    mainNavigation: 'Navigation principale',
    // Weitere Übersetzungen hier hinzufügen
  },
  it: {
    dashboard: 'Dashboard',
    properties: 'Proprietà',
    calculators: 'Calcolatrici',
    schedule: 'Calendario',
    refurbishment: 'Ristrutturazione',
    decision: 'Decisione',
    propertyDetails: 'Dettagli proprietà',
    financialAnalysis: 'Analisi finanziaria',
    refurbishmentTab: 'Ristrutturazione',
    documents: 'Documenti',
    appLock: 'Blocco app',
    enterPin: 'Inserisci PIN',
    useFaceId: 'Usa Face ID',
    unlock: 'Sblocca',
    lock: 'Blocca',
    language: 'Lingua',
    english: 'Inglese',
    german: 'Tedesco',
    spanish: 'Spagnolo',
    french: 'Francese',
    italian: 'Italiano',
    settings: 'Impostazioni',
    settingsDescription: 'Personalizza le preferenze dell\'applicazione',
    languageDescription: 'Cambia la lingua di visualizzazione',
    currentLanguage: 'Lingua attuale',
    selectLanguage: 'Seleziona la tua lingua preferita',
    mainNavigation: 'Navigazione principale',
    // Weitere Übersetzungen hier hinzufügen
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Versuche, die gespeicherte Sprache zu laden, oder verwende Englisch als Standardsprache
    const savedLanguage = localStorage.getItem('language') as Language;
    return savedLanguage && Object.keys(translations).includes(savedLanguage) 
      ? savedLanguage 
      : 'en';
  });

  // Übersetze einen Schlüssel basierend auf der aktuellen Sprache
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  useEffect(() => {
    // Speichere die Sprache im localStorage
    localStorage.setItem('language', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
