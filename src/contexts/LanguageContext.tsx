import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

type Language = 'en' | 'de' | 'es' | 'fr' | 'it';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  getEducationContent: () => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Base translations for UI elements in different languages
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
    legalBasics: 'Legal Basics',
    advancedTaxation: 'Advanced Taxation',
    developmentProjects: 'Development Projects',
    filterBy: 'Filter By',
    newContent: 'New Content',
    popularContent: 'Popular Content',
    topics: 'Topics',
    clearFilters: 'Clear All Filters',
    searchEducationalContent: 'Search educational content',
    filter: 'Filter',
    minRead: 'min read',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Advanced',
    new: 'New',
    popular: 'Popular',
    viewAllInCategory: 'View All Articles',
    noMatchingContent: 'No matching content found',
    noCategoryContent: 'No content available in this category',
    learningProgress: 'Your Learning Progress',
    completed: 'completed',
    itemSaved: 'Article Saved',
    itemAddedToSaved: 'Article added to your saved collection',
    itemRemoved: 'Article Removed',
    itemRemovedFromSaved: 'Article removed from your saved collection',
    marked: 'Marked as Completed',
    progress: 'Progress Updated',
    learningAssistant: 'Learning Assistant',
    getPersonalizedLearningRecommendations: 'Get personalized learning recommendations',
    welcomeBack: 'Welcome Back',
    welcomeBackMessage: 'Good to see you again',
    // Removing duplicate keys - these are already defined above
    // beginner: 'Beginner',
    // intermediate: 'Intermediate',
    // expert: 'Expert',
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
    legalBasics: 'Rechtliche Grundlagen',
    advancedTaxation: 'Fortgeschrittene Besteuerung',
    developmentProjects: 'Entwicklungsprojekte',
    filterBy: 'Filtern nach',
    newContent: 'Neuer Inhalt',
    popularContent: 'Beliebter Inhalt',
    topics: 'Themen',
    clearFilters: 'Alle Filter löschen',
    searchEducationalContent: 'Bildungsinhalte durchsuchen',
    filter: 'Filter',
    minRead: 'Min. Lesezeit',
    easy: 'Einfach',
    medium: 'Mittel',
    hard: 'Fortgeschritten',
    new: 'Neu',
    popular: 'Beliebt',
    viewAllInCategory: 'Alle Artikel anzeigen',
    noMatchingContent: 'Keine passenden Inhalte gefunden',
    noCategoryContent: 'Keine Inhalte in dieser Kategorie verfügbar',
    learningProgress: 'Dein Lernfortschritt',
    completed: 'abgeschlossen',
    itemSaved: 'Artikel gespeichert',
    itemAddedToSaved: 'Artikel zu deiner Sammlung hinzugefügt',
    itemRemoved: 'Artikel entfernt',
    itemRemovedFromSaved: 'Artikel aus deiner Sammlung entfernt',
    marked: 'Als abgeschlossen markiert',
    progress: 'Fortschritt aktualisiert',
    learningAssistant: 'Lernassistent',
    getPersonalizedLearningRecommendations: 'Erhalte personalisierte Lernempfehlungen',
    welcomeBack: 'Willkommen zurück',
    welcomeBackMessage: 'Schön, dich wiederzusehen',
    // Removing duplicate keys
    // beginner: 'Anfänger',
    // intermediate: 'Fortgeschritten',
    // expert: 'Experte',
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
    legalBasics: 'Fundamentos Legales',
    advancedTaxation: 'Impuestos Avanzados',
    developmentProjects: 'Proyectos de Desarrollo',
    filterBy: 'Filtrar por',
    newContent: 'Contenido nuevo',
    popularContent: 'Contenido popular',
    topics: 'Temas',
    clearFilters: 'Borrar todos los filtros',
    searchEducationalContent: 'Buscar contenido educativo',
    filter: 'Filtrar',
    minRead: 'min de lectura',
    easy: 'Fácil',
    medium: 'Medio',
    hard: 'Avanzado',
    new: 'Nuevo',
    popular: 'Popular',
    viewAllInCategory: 'Ver todos los artículos',
    noMatchingContent: 'No se encontraron contenidos coincidentes',
    noCategoryContent: 'No hay contenido disponible en esta categoría',
    learningProgress: 'Tu progreso de aprendizaje',
    completed: 'completado',
    itemSaved: 'Artículo guardado',
    itemAddedToSaved: 'Artículo añadido a tu colección guardada',
    itemRemoved: 'Artículo eliminado',
    itemRemovedFromSaved: 'Artículo eliminado de tu colección guardada',
    marked: 'Marcado como completado',
    progress: 'Progreso actualizado',
    learningAssistant: 'Asistente de aprendizaje',
    getPersonalizedLearningRecommendations: 'Obtén recomendaciones de aprendizaje personalizadas',
    welcomeBack: 'Bienvenido de nuevo',
    welcomeBackMessage: 'Es bueno verte de nuevo',
    // Removing duplicate keys
    // beginner: 'Principiante',
    // intermediate: 'Intermedio',
    // expert: 'Experto',
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
    legalBasics: 'Fondamentaux juridiques',
    advancedTaxation: 'Fiscalité avancée',
    developmentProjects: 'Projets de développement',
    filterBy: 'Filtrer par',
    newContent: 'Nouveau contenu',
    popularContent: 'Contenu populaire',
    topics: 'Sujets',
    clearFilters: 'Effacer tous les filtres',
    searchEducationalContent: 'Rechercher du contenu éducatif',
    filter: 'Filtrer',
    minRead: 'min de lecture',
    easy: 'Facile',
    medium: 'Moyen',
    hard: 'Avancé',
    new: 'Nouveau',
    popular: 'Populaire',
    viewAllInCategory: 'Voir tous les articles',
    noMatchingContent: 'Aucun contenu correspondant trouvé',
    noCategoryContent: 'Aucun contenu disponible dans cette catégorie',
    learningProgress: 'Votre progression d\'apprentissage',
    completed: 'terminé',
    itemSaved: 'Article enregistré',
    itemAddedToSaved: 'Article ajouté à votre collection enregistrée',
    itemRemoved: 'Article supprimé',
    itemRemovedFromSaved: 'Article supprimé de votre collection enregistrée',
    marked: 'Marqué comme terminé',
    progress: 'Progression mise à jour',
    learningAssistant: 'Assistant d\'apprentissage',
    getPersonalizedLearningRecommendations: 'Obtenez des recommandations d\'apprentissage personnalisées',
    welcomeBack: 'Bon retour',
    welcomeBackMessage: 'C\'est bon de vous revoir',
    // Removing duplicate keys
    // beginner: 'Débutant',
    // intermediate: 'Intermédiaire',
    // expert: 'Expert',
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
    legalBasics: 'Fondamenti legali',
    advancedTaxation: 'Tassazione avanzata',
    developmentProjects: 'Progetti di sviluppo',
    filterBy: 'Filtra per',
    newContent: 'Nuovo contenuto',
    popularContent: 'Contenuto popolare',
    topics: 'Argomenti',
    clearFilters: 'Cancella tutti i filtri',
    searchEducationalContent: 'Cerca contenuto educativo',
    filter: 'Filtra',
    minRead: 'min di lettura',
    easy: 'Facile',
    medium: 'Medio',
    hard: 'Avanzato',
    new: 'Nuovo',
    popular: 'Popolare',
    viewAllInCategory: 'Visualizza tutti gli articoli',
    noMatchingContent: 'Nessun contenuto corrispondente trovato',
    noCategoryContent: 'Nessun contenuto disponibile in questa categoria',
    learningProgress: 'Il tuo progresso di apprendimento',
    completed: 'completato',
    itemSaved: 'Articolo salvato',
    itemAddedToSaved: 'Articolo aggiunto alla tua collezione salvata',
    itemRemoved: 'Articolo rimosso',
    itemRemovedFromSaved: 'Articolo rimosso dalla tua collezione salvata',
    marked: 'Contrassegnato come completato',
    progress: 'Progresso aggiornato',
    learningAssistant: 'Assistente all\'apprendimento',
    getPersonalizedLearningRecommendations: 'Ottieni consigli personalizzati per l\'apprendimento',
    welcomeBack: 'Bentornato',
    welcomeBackMessage: 'È bello rivederti',
    // Removing duplicate keys
    // beginner: 'Principiante',
    // intermediate: 'Intermedio',
    // expert: 'Esperto',
  },
};

// Education content that is translated based on selected language
const educationContent = {
  en: {
    beginner: {
      investmentBasics: [
        { 
          id: 101, 
          title: 'Real Estate Market Cycles', 
          description: 'Understanding the cyclical nature of real estate markets',
          readTime: 10,
          difficulty: 'easy',
          tags: ['basics', 'markets', 'cycles'],
          isNew: true
        },
        { 
          id: 102, 
          title: 'Location Analysis for Beginners', 
          description: 'How to evaluate neighborhood potential for investment',
          readTime: 12,
          difficulty: 'easy',
          tags: ['location', 'analysis', 'neighborhoods'],
          isPopular: true
        }
      ],
      financing: [
        { 
          id: 111, 
          title: 'Understanding Mortgage Pre-Approval', 
          description: 'Steps to get pre-approved for a mortgage loan',
          readTime: 8,
          difficulty: 'easy',
          tags: ['mortgage', 'financing', 'pre-approval'],
          isNew: true
        },
        { 
          id: 112, 
          title: 'First-Time Investor Loan Programs', 
          description: 'Special loan options available for first-time property investors',
          readTime: 14,
          difficulty: 'medium',
          tags: ['loans', 'financing', 'first-time']
        }
      ]
    },
    intermediate: {
      propertyManagement: [
        { 
          id: 201, 
          title: 'Creating Effective Lease Agreements', 
          description: 'Key elements to include in your rental lease agreements',
          readTime: 15,
          difficulty: 'medium',
          tags: ['leases', 'legal', 'management'],
          isNew: true
        },
        { 
          id: 202, 
          title: 'Digital Property Management Tools', 
          description: 'Software and apps to streamline your property management',
          readTime: 12,
          difficulty: 'medium',
          tags: ['technology', 'management', 'software'],
          isPopular: true
        }
      ]
    },
    expert: {
      advancedInvesting: [
        { 
          id: 301, 
          title: 'Real Estate Derivatives and Hedging', 
          description: 'Advanced financial instruments for real estate investment',
          readTime: 30,
          difficulty: 'hard',
          tags: ['derivatives', 'hedging', 'financial'],
          isNew: true
        },
        { 
          id: 302, 
          title: 'Cross-Border Investment Strategies', 
          description: 'Managing international property portfolios and currency risks',
          readTime: 28,
          difficulty: 'hard',
          tags: ['international', 'currency', 'global'],
          isPopular: true
        }
      ]
    }
  },
  de: {
    beginner: {
      investmentBasics: [
        { 
          id: 101, 
          title: 'Immobilienmarktzyklen', 
          description: 'Verstehen der zyklischen Natur der Immobilienmärkte',
          readTime: 10,
          difficulty: 'easy',
          tags: ['basics', 'markets', 'cycles'],
          isNew: true
        },
        { 
          id: 102, 
          title: 'Standortanalyse für Anfänger', 
          description: 'So bewerten Sie das Nachbarschaftspotenzial für Investitionen',
          readTime: 12,
          difficulty: 'easy',
          tags: ['location', 'analysis', 'neighborhoods'],
          isPopular: true
        }
      ]
    }
  },
  es: {
    beginner: {
      investmentBasics: [
        { 
          id: 101, 
          title: 'Ciclos del Mercado Inmobiliario', 
          description: 'Entendiendo la naturaleza cíclica de los mercados inmobiliarios',
          readTime: 10,
          difficulty: 'easy',
          tags: ['basics', 'markets', 'cycles'],
          isNew: true
        },
        { 
          id: 102, 
          title: 'Análisis de Ubicación para Principiantes', 
          description: 'Cómo evaluar el potencial de un vecindario para inversión',
          readTime: 12,
          difficulty: 'easy',
          tags: ['location', 'analysis', 'neighborhoods'],
          isPopular: true
        }
      ]
    }
  },
  fr: {
    beginner: {
      investmentBasics: [
        { 
          id: 101, 
          title: 'Cycles du Marché Immobilier', 
          description: 'Comprendre la nature cyclique des marchés immobiliers',
          readTime: 10,
          difficulty: 'easy',
          tags: ['basics', 'markets', 'cycles'],
          isNew: true
        },
        { 
          id: 102, 
          title: 'Analyse de Localisation pour Débutants', 
          description: 'Comment évaluer le potentiel d\'un quartier pour l\'investissement',
          readTime: 12,
          difficulty: 'easy',
          tags: ['location', 'analysis', 'neighborhoods'],
          isPopular: true
        }
      ]
    }
  },
  it: {
    beginner: {
      investmentBasics: [
        { 
          id: 101, 
          title: 'Cicli del Mercato Immobiliare', 
          description: 'Comprendere la natura ciclica dei mercati immobiliari',
          readTime: 10,
          difficulty: 'easy',
          tags: ['basics', 'markets', 'cycles'],
          isNew: true
        },
        { 
          id: 102, 
          title: 'Analisi della Posizione per Principianti', 
          description: 'Come valutare il potenziale di un quartiere per l\'investimento',
          readTime: 12,
          difficulty: 'easy',
          tags: ['location', 'analysis', 'neighborhoods'],
          isPopular: true
        }
      ]
    }
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Try to load the saved language, or use English as default
    const savedLanguage = localStorage.getItem('language') as Language;
    return savedLanguage && Object.keys(translations).includes(savedLanguage) 
      ? savedLanguage 
      : 'en';
  });

  // Translate a key based on the current language
  const t = (key: string): string => {
    return translations[language][key] || key;
  };
  
  // Get education content in the current language, falling back to English if not available
  const getEducationContent = () => {
    // Make sure we use safe type checking
    const currentLanguageContent = educationContent[language] || {};
    // Use English as fallback for categories not fully translated yet
    const englishContent = educationContent.en;
    
    // Deep merge the current language content with English fallback
    return {
      beginner: {
        ...englishContent.beginner,
        ...(currentLanguageContent.beginner || {})
      },
      intermediate: {
        ...englishContent.intermediate,
        ...(currentLanguageContent.intermediate || {})
      },
      expert: {
        ...englishContent.expert,
        ...(currentLanguageContent.expert || {})
      }
    };
  };

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  useEffect(() => {
    // Save language in localStorage
    localStorage.setItem('language', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getEducationContent }}>
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
