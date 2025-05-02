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
    investorDashboard: 'Investor Dashboard',
    welcome: 'Welcome',
    welcomeBack: 'Welcome Back',
    toThe: 'to the',
    accessComprehensiveInvestmentTools: 'Access comprehensive investment tools and analysis.',
    completeInvestmentToolsuite: 'Complete toolsuite for real estate investors',
    portfolio: 'Portfolio',
    marketAnalysis: 'Market Analysis',
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
    marketAnalysis: 'Marktanalyse',
    financing: 'Finanzierung',
    taxPlanning: 'Steuerplanung',
    dueDiligence: 'Due Diligence',
    continueMakingSmartInvestments: 'Treffen Sie weiterhin intelligente Investitionsentscheidungen mit unseren Tools und Erkenntnissen.',
    recentMarketTrends: 'Aktuelle Markttrends',
    investmentOpportunities: 'Investitionsmöglichkeiten',
    propertyComparisons: 'Immobilienvergleiche',
    marketForecast: 'Marktprognose',
    currencySettings: 'Währungseinstellungen',
    languageSettings: 'Spracheinstellungen',
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
    marketAnalysis: 'Análisis de Mercado',
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
    marketAnalysis: 'Analyse de Marché',
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
    marketAnalysis: 'Analisi di Mercato',
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

  // Translate a key based on the current language
  const t = (key: string): string => {
    return translations[language][key] || key;
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
