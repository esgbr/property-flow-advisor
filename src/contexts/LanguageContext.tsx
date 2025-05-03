import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';

type Language = 'en' | 'de' | 'es' | 'fr' | 'it';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  getEducationContent: () => any;
  translations: Record<string, Record<string, string>>;
  updateTranslations: (newTranslations: Record<string, Record<string, string>>) => void;
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
    investorDashboard: 'Investor Dashboard',
    welcome: 'Welcome',
    welcomeBack: 'Welcome Back',
    toThe: 'to the',
    accessComprehensiveInvestmentTools: 'Access comprehensive investment tools and analysis.',
    completeInvestmentToolsuite: 'Complete Toolsuite for Real Estate Investors',
    portfolio: 'Portfolio',
    financing: 'Financing',
    taxPlanning: 'Tax Planning',
    dueDiligence: 'Due Diligence',
    continueMakingSmartInvestments: 'Continue making smart investment decisions with our tools and insights.',
    recentMarketTrends: 'Recent Market Trends',
    investmentOpportunities: 'Investment Opportunities',
    propertyComparisons: 'Property Comparisons',
    marketForecast: 'Market Forecast',
    currencySettings: 'Currency Settings',
    languageSettings: 'Language Settings',
    // Education page translations
    selectLevel: 'Select Your Experience Level',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    expert: 'Expert',
    searchEducationalContent: 'Search Educational Content',
    filter: 'Filter',
    filterBy: 'Filter By',
    topics: 'Topics',
    newContent: 'New Content',
    popularContent: 'Popular Content',
    clearFilters: 'Clear Filters',
    educationCategories: 'Education Categories',
    noMatchingContent: 'No matching content found',
    noCategoryContent: 'No content in this category',
    viewAllInCategory: 'View All Articles',
    minRead: 'min read',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Advanced',
    new: 'New',
    popular: 'Popular',
    learningProgress: 'Learning Progress',
    completed: 'Completed',
    investmentBasics: 'Investment Basics',
    taxation: 'Taxation',
    legalBasics: 'Legal Basics',
    marketAnalysis: 'Market Analysis',
    propertyManagement: 'Property Management',
    advancedTaxation: 'Advanced Taxation',
    advancedInvesting: 'Advanced Investing',
    legalAspects: 'Legal Aspects',
    developmentProjects: 'Development Projects',
    marked: 'Marked as Completed',
    progress: 'Progress Updated',
    itemSaved: 'Item Saved',
    itemAddedToSaved: 'Item added to saved list',
    itemRemoved: 'Item Removed',
    itemRemovedFromSaved: 'Item removed from saved list',
    learningAssistant: 'Learning Assistant',
    getPersonalizedLearningRecommendations: 'Get personalized learning recommendations',
    startCourse: 'Start Course',
    continueReading: 'Continue Reading',
    readLater: 'Read Later',
    recommendedForYou: 'Recommended For You',
    trackYourProgress: 'Track Your Progress',
    certificateEligible: 'Certificate Eligible',
    certificateDescription: 'Complete this course to earn a certificate',
    shareProgress: 'Share Progress',
    downloadResources: 'Download Resources',
    relatedArticles: 'Related Articles',
    quizAvailable: 'Quiz Available',
    takeQuiz: 'Take Quiz',
    markAsComplete: 'Mark as Complete',
    timeToComplete: 'Estimated Time to Complete',
    // Fix casing issues
    investmentCalculator: 'Investment Calculator',
    dashboard: 'Dashboard',
    properties: 'Properties',
    calculators: 'Calculators',
    schedule: 'Schedule',
    refurbishment: 'Refurbishment',
    decision: 'Decision',
    education: 'Education',
    investorDashboard: 'Investor Dashboard',
    // Address autocomplete translations
    startTypingForGoogleMaps: 'Start typing to get address suggestions from Google Maps',
    enterAddressManually: 'Please enter your address manually',
    addressVerified: 'Address Verified',
    addressVerifiedDescription: 'The address has been verified and updated with Google Maps data',
    googleMapsNotLoaded: 'Google Maps API not loaded. Please check your internet connection.',
    // Additional translations
    saveAndContinue: 'Save and Continue',
    viewFinancials: 'View Financials',
    editProperty: 'Edit Property',
  },
  de: {
    dashboard: 'Dashboard',
    properties: 'Immobilien',
    calculators: 'Rechner',
    schedule: 'Zeitplan',
    refurbishment: 'Sanierung',
    decision: 'Entscheidung',
    education: 'Bildung',
    investorDashboard: 'Investoren-Dashboard',
    welcome: 'Willkommen',
    welcomeBack: 'Willkommen zurück',
    toThe: 'zum',
    accessComprehensiveInvestmentTools: 'Zugriff auf umfassende Investitionstools und Analysen.',
    completeInvestmentToolsuite: 'Komplette Toolsammlung für Immobilieninvestoren',
    portfolio: 'Portfolio',
    taxPlanning: 'Steuerplanung',
    dueDiligence: 'Due Diligence',
    continueMakingSmartInvestments: 'Treffen Sie weiterhin intelligente Investitionsentscheidungen mit unseren Tools und Erkenntnissen.',
    recentMarketTrends: 'Aktuelle Markttrends',
    investmentOpportunities: 'Investitionsmöglichkeiten',
    propertyComparisons: 'Immobilienvergleiche',
    marketForecast: 'Marktprognose',
    currencySettings: 'Währungseinstellungen',
    languageSettings: 'Spracheinstellungen',
    beginner: 'Anfänger',
    intermediate: 'Fortgeschritten',
    expert: 'Experte',
    searchEducationalContent: 'Bildungsinhalte durchsuchen',
    filter: 'Filter',
    filterBy: 'Filtern nach',
    topics: 'Themen',
    newContent: 'Neue Inhalte',
    popularContent: 'Beliebte Inhalte',
    clearFilters: 'Filter löschen',
    educationCategories: 'Bildungskategorien',
    noMatchingContent: 'Keine passenden Inhalte gefunden',
    noCategoryContent: 'Keine Inhalte in dieser Kategorie',
    viewAllInCategory: 'Alle Artikel anzeigen',
    minRead: 'Min. Lesezeit',
    easy: 'Einfach',
    medium: 'Mittel',
    hard: 'Fortgeschritten',
    new: 'Neu',
    popular: 'Beliebt',
    learningProgress: 'Lernfortschritt',
    completed: 'Abgeschlossen',
    investmentBasics: 'Investmentgrundlagen',
    financing: 'Finanzierung',
    taxation: 'Besteuerung',
    legalBasics: 'Rechtliche Grundlagen',
    propertyManagement: 'Immobilienverwaltung',
    advancedTaxation: 'Fortgeschrittene Besteuerung',
    advancedInvesting: 'Fortgeschrittenes Investieren',
    legalAspects: 'Rechtliche Aspekte',
    developmentProjects: 'Entwicklungsprojekte',
    marketAnalysis: 'Marktanalyse',
    // Fix casing issues
    investmentCalculator: 'Investitionsrechner',
    dashboard: 'Dashboard',
    properties: 'Immobilien',
    calculators: 'Rechner',
    schedule: 'Zeitplan',
    refurbishment: 'Sanierung',
    decision: 'Entscheidung',
    education: 'Bildung',
    investorDashboard: 'Investoren-Dashboard',
    // Address autocomplete translations
    startTypingForGoogleMaps: 'Beginnen Sie zu tippen, um Adressvorschläge von Google Maps zu erhalten',
    enterAddressManually: 'Bitte geben Sie Ihre Adresse manuell ein',
    addressVerified: 'Adresse verifiziert',
    addressVerifiedDescription: 'Die Adresse wurde verifiziert und mit Google Maps-Daten aktualisiert',
    googleMapsNotLoaded: 'Google Maps API nicht geladen. Bitte überprüfen Sie Ihre Internetverbindung.',
    // Additional translations
    saveAndContinue: 'Speichern und Fortfahren',
    viewFinancials: 'Finanzdaten anzeigen',
    editProperty: 'Immobilie bearbeiten',
  },
  es: {
    dashboard: 'Tablero',
    properties: 'Propiedades',
    calculators: 'Calculadoras',
    schedule: 'Calendario',
    refurbishment: 'Renovación',
    decision: 'Decisión',
    education: 'Educación',
    investorDashboard: 'Panel del Inversor',
    welcome: 'Bienvenido',
    welcomeBack: 'Bienvenido de nuevo',
    toThe: 'al',
    accessComprehensiveInvestmentTools: 'Acceda a herramientas y análisis completos de inversión.',
    completeInvestmentToolsuite: 'Conjunto completo de herramientas para inversores inmobiliarios',
    portfolio: 'Portafolio',
    financing: 'Financiamiento',
    taxPlanning: 'Planificación Fiscal',
    dueDiligence: 'Diligencia Debida',
    continueMakingSmartInvestments: 'Continúe tomando decisiones inteligentes de inversión con nuestras herramientas y conocimientos.',
    recentMarketTrends: 'Tendencias Recientes del Mercado',
    investmentOpportunities: 'Oportunidades de Inversión',
    propertyComparisons: 'Comparaciones de Propiedades',
    marketForecast: 'Pronóstico del Mercado',
    currencySettings: 'Configuración de Moneda',
    languageSettings: 'Configuración de Idioma',
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    expert: 'Experto',
    searchEducationalContent: 'Buscar Contenido Educativo',
    filter: 'Filtrar',
    filterBy: 'Filtrar por',
    topics: 'Temas',
    newContent: 'Contenido Nuevo',
    popularContent: 'Contenido Popular',
    clearFilters: 'Borrar Filtros',
    educationCategories: 'Categorías Educativas',
    noMatchingContent: 'No se encontró contenido coincidente',
    noCategoryContent: 'No hay contenido en esta categoría',
    viewAllInCategory: 'Ver Todos los Artículos',
    minRead: 'min de lectura',
    easy: 'Fácil',
    medium: 'Medio',
    hard: 'Avanzado',
    new: 'Nuevo',
    popular: 'Popular',
    learningProgress: 'Progreso de Aprendizaje',
    completed: 'Completado',
    investmentBasics: 'Fundamentos de Inversión',
    taxation: 'Tributación',
    legalBasics: 'Fundamentos Legales',
    propertyManagement: 'Gestión de Propiedades',
    advancedTaxation: 'Tributación Avanzada',
    advancedInvesting: 'Inversión Avanzada',
    legalAspects: 'Aspectos Legales',
    developmentProjects: 'Proyectos de Desarrollo',
    marketAnalysis: 'Análisis de Mercado',
    // Fix casing issues
    investmentCalculator: 'Calculadora de Inversión',
    dashboard: 'Tablero',
    properties: 'Propiedades',
    calculators: 'Calculadoras',
    schedule: 'Calendario',
    refurbishment: 'Renovación',
    decision: 'Decisión',
    education: 'Educación',
    investorDashboard: 'Panel del Inversor',
    // Address autocomplete translations
    startTypingForGoogleMaps: 'Comience a escribir para obtener sugerencias de direcciones de Google Maps',
    enterAddressManually: 'Por favor, ingrese su dirección manualmente',
    addressVerified: 'Dirección verificada',
    addressVerifiedDescription: 'La dirección ha sido verificada y actualizada con datos de Google Maps',
    googleMapsNotLoaded: 'API de Google Maps no cargada. Por favor, verifique su conexión a internet.',
    // Additional translations
    saveAndContinue: 'Guardar y Continuar',
    viewFinancials: 'Ver Finanzas',
    editProperty: 'Editar Propiedad',
  },
  fr: {
    dashboard: 'Tableau de bord',
    properties: 'Propriétés',
    calculators: 'Calculatrices',
    schedule: 'Calendrier',
    refurbishment: 'Rénovation',
    decision: 'Décision',
    education: 'Éducation',
    investorDashboard: 'Tableau de Bord de l\'Investisseur',
    welcome: 'Bienvenue',
    welcomeBack: 'Bon retour',
    toThe: 'au',
    accessComprehensiveInvestmentTools: 'Accédez à des outils et analyses d\'investissement complets.',
    completeInvestmentToolsuite: 'Suite complète d\'outils pour les investisseurs immobiliers',
    portfolio: 'Portefeuille',
    financing: 'Financement',
    taxPlanning: 'Planification Fiscale',
    dueDiligence: 'Diligence Raisonnable',
    continueMakingSmartInvestments: 'Continuez à prendre des décisions d\'investissement intelligentes avec nos outils et analyses.',
    recentMarketTrends: 'Tendances Récentes du Marché',
    investmentOpportunities: 'Opportunités d\'Investissement',
    propertyComparisons: 'Comparaisons de Propriétés',
    marketForecast: 'Prévision du Marché',
    currencySettings: 'Paramètres de Devise',
    languageSettings: 'Paramètres de Langue',
    beginner: 'Débutant',
    intermediate: 'Intermédiaire',
    expert: 'Expert',
    searchEducationalContent: 'Rechercher du Contenu Éducatif',
    filter: 'Filtrer',
    filterBy: 'Filtrer par',
    topics: 'Sujets',
    newContent: 'Nouveau Contenu',
    popularContent: 'Contenu Populaire',
    clearFilters: 'Effacer les Filtres',
    educationCategories: 'Catégories d\'Éducation',
    noMatchingContent: 'Aucun contenu correspondant trouvé',
    noCategoryContent: 'Aucun contenu dans cette catégorie',
    viewAllInCategory: 'Voir Tous les Articles',
    minRead: 'min de lecture',
    easy: 'Facile',
    medium: 'Moyen',
    hard: 'Avancé',
    new: 'Nouveau',
    popular: 'Populaire',
    learningProgress: 'Progression d\'Apprentissage',
    completed: 'Terminé',
    investmentBasics: 'Principes d\'Investissement',
    taxation: 'Fiscalité',
    legalBasics: 'Principes Juridiques',
    propertyManagement: 'Gestion Immobilière',
    advancedTaxation: 'Fiscalité Avancée',
    advancedInvesting: 'Investissement Avancé',
    legalAspects: 'Aspects Juridiques',
    developmentProjects: 'Projets de Développement',
    marketAnalysis: 'Analyse de Marché',
    // Fix casing issues
    investmentCalculator: 'Calculateur d\'Investissement',
    dashboard: 'Tableau de Bord',
    properties: 'Propriétés',
    calculators: 'Calculatrices',
    schedule: 'Calendrier',
    refurbishment: 'Rénovation',
    decision: 'Décision',
    education: 'Éducation',
    investorDashboard: 'Tableau de Bord de l\'Investisseur',
    // Address autocomplete translations
    startTypingForGoogleMaps: 'Commencez à taper pour obtenir des suggestions d\'adresses de Google Maps',
    enterAddressManually: 'Veuillez saisir votre adresse manuellement',
    addressVerified: 'Adresse vérifiée',
    addressVerifiedDescription: 'L\'adresse a été vérifiée et mise à jour avec les données de Google Maps',
    googleMapsNotLoaded: 'API Google Maps non chargée. Veuillez vérifier votre connexion Internet.',
    // Additional translations
    saveAndContinue: 'Enregistrer et Continuer',
    viewFinancials: 'Voir les Finances',
    editProperty: 'Modifier la Propriété',
  },
  it: {
    dashboard: 'Dashboard',
    properties: 'Proprietà',
    calculators: 'Calcolatrici',
    schedule: 'Calendario',
    refurbishment: 'Ristrutturazione',
    decision: 'Decisione',
    education: 'Formazione',
    investorDashboard: 'Dashboard per Investitori',
    welcome: 'Benvenuto',
    welcomeBack: 'Bentornato',
    toThe: 'alla',
    accessComprehensiveInvestmentTools: 'Accedi a strumenti e analisi di investimento completi.',
    completeInvestmentToolsuite: 'Suite completa di strumenti per investitori immobiliari',
    portfolio: 'Portafoglio',
    financing: 'Finanziamento',
    taxPlanning: 'Pianificazione Fiscale',
    dueDiligence: 'Due Diligence',
    continueMakingSmartInvestments: 'Continua a prendere decisioni di investimento intelligenti con i nostri strumenti e approfondimenti.',
    recentMarketTrends: 'Tendenze Recenti del Mercato',
    investmentOpportunities: 'Opportunità di Investimento',
    propertyComparisons: 'Confronti tra Proprietà',
    marketForecast: 'Previsione del Mercato',
    currencySettings: 'Impostazioni Valuta',
    languageSettings: 'Impostazioni Lingua',
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    expert: 'Esperto',
    searchEducationalContent: 'Cerca Contenuto Educativo',
    filter: 'Filtra',
    filterBy: 'Filtra Per',
    topics: 'Argomenti',
    newContent: 'Nuovi Contenuti',
    popularContent: 'Contenuti Popolari',
    clearFilters: 'Cancella Filtri',
    educationCategories: 'Categorie Educative',
    noMatchingContent: 'Nessun contenuto corrispondente trovato',
    noCategoryContent: 'Nessun contenuto in questa categoria',
    viewAllInCategory: 'Visualizza Tutti gli Articoli',
    minRead: 'min di lettura',
    easy: 'Facile',
    medium: 'Medio',
    hard: 'Avanzato',
    new: 'Nuovo',
    popular: 'Popolare',
    learningProgress: 'Progresso di Apprendimento',
    completed: 'Completato',
    investmentBasics: 'Fondamenti di Investimento',
    taxation: 'Tassazione',
    legalBasics: 'Fondamenti Legali',
    propertyManagement: 'Gestione Immobiliare',
    advancedTaxation: 'Tassazione Avanzata',
    advancedInvesting: 'Investimento Avanzato',
    legalAspects: 'Aspetti Legali',
    developmentProjects: 'Progetti di Sviluppo',
    marketAnalysis: 'Analisi di Mercato',
    // Fix casing issues
    investmentCalculator: 'Calcolatore d\'Investimento',
    dashboard: 'Dashboard',
    properties: 'Proprietà',
    calculators: 'Calcolatrici',
    schedule: 'Calendario',
    refurbishment: 'Ristrutturazione',
    decision: 'Decisione',
    education: 'Formazione',
    investorDashboard: 'Dashboard per Investitori',
    // Address autocomplete translations
    startTypingForGoogleMaps: 'Inizia a digitare per ottenere suggerimenti di indirizzi da Google Maps',
    enterAddressManually: 'Inserisci il tuo indirizzo manualmente',
    addressVerified: 'Indirizzo verificato',
    addressVerifiedDescription: 'L\'indirizzo è stato verificato e aggiornato con i dati di Google Maps',
    googleMapsNotLoaded: 'API di Google Maps non caricata. Controlla la tua connessione internet.',
    // Additional translations
    saveAndContinue: 'Salva e Continua',
    viewFinancials: 'Visualizza Finanze',
    editProperty: 'Modifica Proprietà',
  }
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
    },
    intermediate: {},
    expert: {}
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
    },
    intermediate: {},
    expert: {}
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
    },
    intermediate: {},
    expert: {}
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
    },
    intermediate: {},
    expert: {}
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

  const [translationsState, setTranslationsState] = useState(translations);

  // Function to update translations
  const updateTranslations = useCallback((newTranslations: Record<string, Record<string, string>>) => {
    // Deep merge the new translations with the existing ones
    const updatedTranslations = { ...translationsState };
    
    // For each translation category (e.g., 'dashboard', 'properties')
    for (const category in newTranslations) {
      if (newTranslations.hasOwnProperty(category)) {
        // For each language in this category
        for (const lang in newTranslations[category]) {
          if (newTranslations[category].hasOwnProperty(lang) && 
              updatedTranslations.hasOwnProperty(lang as Language)) {
            // Add or update the translation
            updatedTranslations[lang as Language][category] = newTranslations[category][lang];
          }
        }
      }
    }
    
    setTranslationsState(updatedTranslations);
  }, [translationsState]);

  // Translate a key based on the current language
  const t = (key: string): string => {
    return translationsState[language][key] || key;
  };
  
  // Get education content in the current language, falling back to English if not available
  const getEducationContent = () => {
    // Make sure we use safe type checking
    const currentLanguageContent = educationContent[language];
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
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t, 
      getEducationContent, 
      translations: translationsState, 
      updateTranslations 
    }}>
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
