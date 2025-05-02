
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
    education: 'Education',
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
    educationLevel: 'Education Level',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    expert: 'Expert',
    selectLevel: 'Select your knowledge level',
    educationCategories: 'Education Categories',
    investmentBasics: 'Investment Basics',
    financing: 'Financing',
    marketAnalysis: 'Market Analysis',
    taxation: 'Taxation',
    legalAspects: 'Legal Aspects',
    propertyManagement: 'Property Management',
    advancedInvesting: 'Advanced Investing',
    // Weitere Übersetzungen hier hinzufügen
  },
  de: {
    dashboard: 'Dashboard',
    properties: 'Immobilien',
    calculators: 'Rechner',
    schedule: 'Zeitplan',
    refurbishment: 'Sanierung',
    decision: 'Entscheidung',
    education: 'Bildung',
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
    educationLevel: 'Bildungsniveau',
    beginner: 'Anfänger',
    intermediate: 'Fortgeschritten',
    expert: 'Experte',
    selectLevel: 'Wählen Sie Ihr Wissensniveau',
    educationCategories: 'Bildungskategorien',
    investmentBasics: 'Investitionsgrundlagen',
    financing: 'Finanzierung',
    marketAnalysis: 'Marktanalyse',
    taxation: 'Besteuerung',
    legalAspects: 'Rechtliche Aspekte',
    propertyManagement: 'Immobilienverwaltung',
    advancedInvesting: 'Fortgeschrittenes Investieren',
    // Weitere Übersetzungen hier hinzufügen
  },
  es: {
    dashboard: 'Tablero',
    properties: 'Propiedades',
    calculators: 'Calculadoras',
    schedule: 'Calendario',
    refurbishment: 'Renovación',
    decision: 'Decisión',
    education: 'Educación',
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
    educationLevel: 'Nivel de Educación',
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    expert: 'Experto',
    selectLevel: 'Seleccione su nivel de conocimiento',
    educationCategories: 'Categorías de Educación',
    investmentBasics: 'Fundamentos de Inversión',
    financing: 'Financiamiento',
    marketAnalysis: 'Análisis de Mercado',
    taxation: 'Impuestos',
    legalAspects: 'Aspectos Legales',
    propertyManagement: 'Administración de Propiedades',
    advancedInvesting: 'Inversión Avanzada',
    // Weitere Übersetzungen hier hinzufügen
  },
  fr: {
    dashboard: 'Tableau de bord',
    properties: 'Propriétés',
    calculators: 'Calculatrices',
    schedule: 'Calendrier',
    refurbishment: 'Rénovation',
    decision: 'Décision',
    education: 'Éducation',
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
    educationLevel: 'Niveau d\'éducation',
    beginner: 'Débutant',
    intermediate: 'Intermédiaire',
    expert: 'Expert',
    selectLevel: 'Sélectionnez votre niveau de connaissance',
    educationCategories: 'Catégories d\'éducation',
    investmentBasics: 'Principes d\'investissement',
    financing: 'Financement',
    marketAnalysis: 'Analyse de marché',
    taxation: 'Fiscalité',
    legalAspects: 'Aspects juridiques',
    propertyManagement: 'Gestion immobilière',
    advancedInvesting: 'Investissement avancé',
    // Weitere Übersetzungen hier hinzufügen
  },
  it: {
    dashboard: 'Dashboard',
    properties: 'Proprietà',
    calculators: 'Calcolatrici',
    schedule: 'Calendario',
    refurbishment: 'Ristrutturazione',
    decision: 'Decisione',
    education: 'Formazione',
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
    educationLevel: 'Livello di formazione',
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    expert: 'Esperto',
    selectLevel: 'Seleziona il tuo livello di conoscenza',
    educationCategories: 'Categorie di formazione',
    investmentBasics: 'Fondamenti di investimento',
    financing: 'Finanziamento',
    marketAnalysis: 'Analisi di mercato',
    taxation: 'Tassazione',
    legalAspects: 'Aspetti legali',
    propertyManagement: 'Gestione immobiliare',
    advancedInvesting: 'Investimento avanzato',
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
