
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
    // Navigation and main sections
    dashboard: 'Dashboard',
    properties: 'Properties',
    calculators: 'Calculators',
    schedule: 'Schedule',
    refurbishment: 'Refurbishment',
    decision: 'Decision',
    education: 'Education',
    investorDashboard: 'Investor Dashboard',
    investmentCalculator: 'Investment Calculator',
    
    // Welcome messages
    welcome: 'Welcome',
    welcomeBack: 'Welcome Back',
    toThe: 'to the',
    accessComprehensiveInvestmentTools: 'Access comprehensive investment tools and analysis.',
    completeInvestmentToolsuite: 'Complete Toolsuite for Real Estate Investors',
    
    // Portfolio sections
    portfolio: 'Portfolio',
    financing: 'Financing',
    taxPlanning: 'Tax Planning',
    dueDiligence: 'Due Diligence',
    continueMakingSmartInvestments: 'Continue making smart investment decisions with our tools and insights.',
    
    // Market data
    recentMarketTrends: 'Recent Market Trends',
    investmentOpportunities: 'Investment Opportunities',
    propertyComparisons: 'Property Comparisons',
    marketForecast: 'Market Forecast',
    
    // Settings
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
    
    // Progress tracking
    learningProgress: 'Learning Progress',
    completed: 'Completed',
    
    // Investment categories
    investmentBasics: 'Investment Basics',
    taxation: 'Taxation',
    legalBasics: 'Legal Basics',
    marketAnalysis: 'Market Analysis',
    propertyManagement: 'Property Management',
    advancedTaxation: 'Advanced Taxation',
    advancedInvesting: 'Advanced Investing',
    legalAspects: 'Legal Aspects',
    developmentProjects: 'Development Projects',
    
    // Notifications
    marked: 'Marked as Completed',
    progress: 'Progress Updated',
    itemSaved: 'Item Saved',
    itemAddedToSaved: 'Item added to saved list',
    itemRemoved: 'Item Removed',
    itemRemovedFromSaved: 'Item removed from saved list',
    
    // Learning features
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
    
    // Portfolio metrics
    portfolioValue: 'Portfolio Value',
    equity: 'Equity',
    cashFlow: 'Cash Flow',
    returnsAndGrowth: 'Returns & Growth',
    propertyPerformance: 'Property Performance',
    compareYourInvestments: 'Compare Your Investments',
    roi: 'ROI',
    appreciation: 'Appreciation',
    cashOnCashROI: 'Cash on Cash ROI',
    totalReturn: 'Total Return',
    investmentPortfolio: 'Investment Portfolio',
    trackYourRealEstateInvestments: 'Track Your Real Estate Investments',
    positive: 'Positive',
    debt: 'Debt',
    enhancedAnalytics: 'Enhanced Analytics',
    enhancedAnalyticsDescription: 'Unlock detailed ROI analysis with our premium plan',
    unlockAnalytics: 'Unlock Analytics',
    viewDetailed: 'View Detailed',
    marketInsights: 'Market Insights',
    marketInsightsDescription: 'Connect to real-time market data for accurate appreciation forecasts',
    connectMarketData: 'Connect Market Data',
    investmentGoals: 'Investment Goals',
    edit: 'Edit',
    editGoals: 'Edit Goals',
    cashflowGoal: 'Cashflow Goal',
    equityTarget: 'Equity Target',
    totalPropertiesGoal: 'Total Properties Goal',
    portfolioAlerts: 'Portfolio Alerts',
    refinancingOpportunity: 'Refinancing Opportunity',
    propertyEligibleRefinancing: 'Property may be eligible for refinancing at better rates',
    viewDetails: 'View Details',
    marketOpportunity: 'Market Opportunity',
    newPropertyMatchingCriteria: 'New property matching your investment criteria',
    northDistrict: 'North District',
    viewProperty: 'View Property',
    fromPreviousPeriod: 'from Previous Period',
    
    // Language and site management
    manageLanguagePreferences: 'Manage Language Preferences',
    currentLanguage: 'Current Language',
    activeLanguageDescription: 'Select your preferred language for the application',
    interfaceLanguage: 'Interface Language',
    interfaceLanguageDescription: 'Language used for UI elements and navigation',
    interfaceLanguageInfo: 'Choose the language you prefer for the user interface',
    switchLanguageDescription: 'Switch between available languages',
    languagePreferences: 'Language Preferences',
    languagePreferencesDescription: 'Configure your language settings',
    comingSoon: 'Coming Soon',
  },
  de: {
    // Navigation and main sections
    dashboard: 'Dashboard',
    properties: 'Immobilien',
    calculators: 'Rechner',
    schedule: 'Zeitplan',
    refurbishment: 'Sanierung',
    decision: 'Entscheidung',
    education: 'Bildung',
    investorDashboard: 'Investoren-Dashboard',
    investmentCalculator: 'Investitionsrechner',
    
    // Welcome messages
    welcome: 'Willkommen',
    welcomeBack: 'Willkommen zurück',
    toThe: 'zum',
    accessComprehensiveInvestmentTools: 'Zugriff auf umfassende Investitionstools und Analysen.',
    completeInvestmentToolsuite: 'Komplette Toolsammlung für Immobilieninvestoren',
    
    // Portfolio sections
    portfolio: 'Portfolio',
    financing: 'Finanzierung',
    taxPlanning: 'Steuerplanung',
    dueDiligence: 'Due Diligence',
    continueMakingSmartInvestments: 'Treffen Sie weiterhin intelligente Investitionsentscheidungen mit unseren Tools und Erkenntnissen.',
    
    // Market data
    recentMarketTrends: 'Aktuelle Markttrends',
    investmentOpportunities: 'Investitionsmöglichkeiten',
    propertyComparisons: 'Immobilienvergleiche',
    marketForecast: 'Marktprognose',
    
    // Settings
    currencySettings: 'Währungseinstellungen',
    languageSettings: 'Spracheinstellungen',
    
    // Education page translations
    selectLevel: 'Wählen Sie Ihr Erfahrungsniveau',
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
    
    // Progress tracking
    learningProgress: 'Lernfortschritt',
    completed: 'Abgeschlossen',
    
    // Investment categories
    investmentBasics: 'Investmentgrundlagen',
    taxation: 'Besteuerung',
    legalBasics: 'Rechtliche Grundlagen',
    propertyManagement: 'Immobilienverwaltung',
    advancedTaxation: 'Fortgeschrittene Besteuerung',
    advancedInvesting: 'Fortgeschrittenes Investieren',
    legalAspects: 'Rechtliche Aspekte',
    developmentProjects: 'Entwicklungsprojekte',
    marketAnalysis: 'Marktanalyse',
    
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
    
    // Portfolio metrics
    portfolioValue: 'Portfoliowert',
    equity: 'Eigenkapital',
    cashFlow: 'Cashflow',
    returnsAndGrowth: 'Rendite & Wachstum',
    propertyPerformance: 'Immobilienleistung',
    compareYourInvestments: 'Vergleichen Sie Ihre Investitionen',
    roi: 'ROI',
    appreciation: 'Wertsteigerung',
    cashOnCashROI: 'Cash-on-Cash-ROI',
    totalReturn: 'Gesamtrendite',
    investmentPortfolio: 'Investitionsportfolio',
    trackYourRealEstateInvestments: 'Verfolgen Sie Ihre Immobilieninvestitionen',
    positive: 'Positiv',
    debt: 'Schulden',
    enhancedAnalytics: 'Erweiterte Analysen',
    enhancedAnalyticsDescription: 'Schalten Sie detaillierte ROI-Analysen mit unserem Premium-Plan frei',
    unlockAnalytics: 'Analysen freischalten',
    viewDetailed: 'Detailliert anzeigen',
    marketInsights: 'Markteinblicke',
    marketInsightsDescription: 'Verbinden Sie sich mit Echtzeit-Marktdaten für genaue Prognosen zur Wertsteigerung',
    connectMarketData: 'Marktdaten verbinden',
    investmentGoals: 'Investitionsziele',
    edit: 'Bearbeiten',
    editGoals: 'Ziele bearbeiten',
    cashflowGoal: 'Cashflow-Ziel',
    equityTarget: 'Eigenkapitalziel',
    totalPropertiesGoal: 'Gesamtimmobilienziel',
    portfolioAlerts: 'Portfolio-Benachrichtigungen',
    refinancingOpportunity: 'Refinanzierungsmöglichkeit',
    propertyEligibleRefinancing: 'Immobilie kann zu besseren Konditionen refinanziert werden',
    viewDetails: 'Details anzeigen',
    marketOpportunity: 'Marktchance',
    newPropertyMatchingCriteria: 'Neue Immobilie, die Ihren Anlagekriterien entspricht',
    northDistrict: 'Nordbezirk',
    viewProperty: 'Immobilie anzeigen',
    fromPreviousPeriod: 'im Vergleich zum vorherigen Zeitraum',
    
    // Language and site management
    manageLanguagePreferences: 'Spracheinstellungen verwalten',
    currentLanguage: 'Aktuelle Sprache',
    activeLanguageDescription: 'Wählen Sie Ihre bevorzugte Sprache für die Anwendung',
    interfaceLanguage: 'Oberflächensprache',
    interfaceLanguageDescription: 'Sprache für UI-Elemente und Navigation',
    interfaceLanguageInfo: 'Wählen Sie die Sprache, die Sie für die Benutzeroberfläche bevorzugen',
    switchLanguageDescription: 'Zwischen verfügbaren Sprachen wechseln',
    languagePreferences: 'Spracheinstellungen',
    languagePreferencesDescription: 'Konfigurieren Sie Ihre Spracheinstellungen',
    comingSoon: 'Demnächst verfügbar',
  },
  es: {
    // Navigation and main sections
    dashboard: 'Tablero',
    properties: 'Propiedades',
    calculators: 'Calculadoras',
    schedule: 'Calendario',
    refurbishment: 'Renovación',
    decision: 'Decisión',
    education: 'Educación',
    investorDashboard: 'Panel del Inversor',
    investmentCalculator: 'Calculadora de Inversión',
    
    // Welcome messages
    welcome: 'Bienvenido',
    welcomeBack: 'Bienvenido de nuevo',
    toThe: 'al',
    accessComprehensiveInvestmentTools: 'Acceda a herramientas y análisis completos de inversión.',
    completeInvestmentToolsuite: 'Conjunto completo de herramientas para inversores inmobiliarios',
    
    // Portfolio sections
    portfolio: 'Portafolio',
    financing: 'Financiamiento',
    taxPlanning: 'Planificación Fiscal',
    dueDiligence: 'Diligencia Debida',
    continueMakingSmartInvestments: 'Continúe tomando decisiones inteligentes de inversión con nuestras herramientas y conocimientos.',
    
    // Market data
    recentMarketTrends: 'Tendencias Recientes del Mercado',
    investmentOpportunities: 'Oportunidades de Inversión',
    propertyComparisons: 'Comparaciones de Propiedades',
    marketForecast: 'Pronóstico del Mercado',
    
    // Settings
    currencySettings: 'Configuración de Moneda',
    languageSettings: 'Configuración de Idioma',
    
    // Education page translations
    selectLevel: 'Seleccione su Nivel de Experiencia',
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
    
    // Progress tracking
    learningProgress: 'Progreso de Aprendizaje',
    completed: 'Completado',
    
    // Investment categories
    investmentBasics: 'Fundamentos de Inversión',
    taxation: 'Tributación',
    legalBasics: 'Fundamentos Legales',
    propertyManagement: 'Gestión de Propiedades',
    advancedTaxation: 'Tributación Avanzada',
    advancedInvesting: 'Inversión Avanzada',
    legalAspects: 'Aspectos Legales',
    developmentProjects: 'Proyectos de Desarrollo',
    marketAnalysis: 'Análisis de Mercado',
    
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
    
    // Portfolio metrics
    portfolioValue: 'Valor del Portafolio',
    equity: 'Capital',
    cashFlow: 'Flujo de Caja',
    returnsAndGrowth: 'Rendimientos y Crecimiento',
    propertyPerformance: 'Rendimiento de Propiedades',
    compareYourInvestments: 'Compare Sus Inversiones',
    roi: 'ROI',
    appreciation: 'Apreciación',
    cashOnCashROI: 'ROI de Efectivo sobre Efectivo',
    totalReturn: 'Rendimiento Total',
    investmentPortfolio: 'Portafolio de Inversiones',
    trackYourRealEstateInvestments: 'Siga Sus Inversiones Inmobiliarias',
    positive: 'Positivo',
    debt: 'Deuda',
    enhancedAnalytics: 'Análisis Mejorados',
    enhancedAnalyticsDescription: 'Desbloquee análisis detallados de ROI con nuestro plan premium',
    unlockAnalytics: 'Desbloquear Análisis',
    viewDetailed: 'Ver Detallado',
    marketInsights: 'Perspectivas del Mercado',
    marketInsightsDescription: 'Conéctese a datos de mercado en tiempo real para pronósticos precisos de apreciación',
    connectMarketData: 'Conectar Datos del Mercado',
    investmentGoals: 'Objetivos de Inversión',
    edit: 'Editar',
    editGoals: 'Editar Objetivos',
    cashflowGoal: 'Objetivo de Flujo de Caja',
    equityTarget: 'Objetivo de Capital',
    totalPropertiesGoal: 'Objetivo Total de Propiedades',
    portfolioAlerts: 'Alertas de Portafolio',
    refinancingOpportunity: 'Oportunidad de Refinanciamiento',
    propertyEligibleRefinancing: 'La propiedad puede ser elegible para refinanciamiento a mejores tasas',
    viewDetails: 'Ver Detalles',
    marketOpportunity: 'Oportunidad de Mercado',
    newPropertyMatchingCriteria: 'Nueva propiedad que coincide con sus criterios de inversión',
    northDistrict: 'Distrito Norte',
    viewProperty: 'Ver Propiedad',
    fromPreviousPeriod: 'desde el período anterior',
    
    // Language and site management
    manageLanguagePreferences: 'Gestionar Preferencias de Idioma',
    currentLanguage: 'Idioma Actual',
    activeLanguageDescription: 'Seleccione su idioma preferido para la aplicación',
    interfaceLanguage: 'Idioma de la Interfaz',
    interfaceLanguageDescription: 'Idioma utilizado para elementos de UI y navegación',
    interfaceLanguageInfo: 'Elija el idioma que prefiera para la interfaz de usuario',
    switchLanguageDescription: 'Cambie entre los idiomas disponibles',
    languagePreferences: 'Preferencias de Idioma',
    languagePreferencesDescription: 'Configure sus ajustes de idioma',
    comingSoon: 'Próximamente',
  },
  fr: {
    // Navigation and main sections
    dashboard: 'Tableau de Bord',
    properties: 'Propriétés',
    calculators: 'Calculatrices',
    schedule: 'Calendrier',
    refurbishment: 'Rénovation',
    decision: 'Décision',
    education: 'Éducation',
    investorDashboard: 'Tableau de Bord de l\'Investisseur',
    investmentCalculator: 'Calculateur d\'Investissement',
    
    // Welcome messages
    welcome: 'Bienvenue',
    welcomeBack: 'Bon retour',
    toThe: 'au',
    accessComprehensiveInvestmentTools: 'Accédez à des outils et analyses d\'investissement complets.',
    completeInvestmentToolsuite: 'Suite complète d\'outils pour les investisseurs immobiliers',
    
    // Portfolio sections
    portfolio: 'Portefeuille',
    financing: 'Financement',
    taxPlanning: 'Planification Fiscale',
    dueDiligence: 'Diligence Raisonnable',
    continueMakingSmartInvestments: 'Continuez à prendre des décisions d\'investissement intelligentes avec nos outils et analyses.',
    
    // Market data
    recentMarketTrends: 'Tendances Récentes du Marché',
    investmentOpportunities: 'Opportunités d\'Investissement',
    propertyComparisons: 'Comparaisons de Propriétés',
    marketForecast: 'Prévision du Marché',
    
    // Settings
    currencySettings: 'Paramètres de Devise',
    languageSettings: 'Paramètres de Langue',
    
    // Education page translations
    selectLevel: 'Sélectionnez Votre Niveau d\'Expérience',
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
    
    // Progress tracking
    learningProgress: 'Progression d\'Apprentissage',
    completed: 'Terminé',
    
    // Investment categories
    investmentBasics: 'Principes d\'Investissement',
    taxation: 'Fiscalité',
    legalBasics: 'Principes Juridiques',
    propertyManagement: 'Gestion Immobilière',
    advancedTaxation: 'Fiscalité Avancée',
    advancedInvesting: 'Investissement Avancé',
    legalAspects: 'Aspects Juridiques',
    developmentProjects: 'Projets de Développement',
    marketAnalysis: 'Analyse de Marché',
    
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
    
    // Portfolio metrics
    portfolioValue: 'Valeur du Portefeuille',
    equity: 'Capitaux Propres',
    cashFlow: 'Flux de Trésorerie',
    returnsAndGrowth: 'Rendements et Croissance',
    propertyPerformance: 'Performance des Propriétés',
    compareYourInvestments: 'Comparez Vos Investissements',
    roi: 'ROI',
    appreciation: 'Appréciation',
    cashOnCashROI: 'ROI Cash-on-Cash',
    totalReturn: 'Rendement Total',
    investmentPortfolio: 'Portefeuille d\'Investissement',
    trackYourRealEstateInvestments: 'Suivez Vos Investissements Immobiliers',
    positive: 'Positif',
    debt: 'Dette',
    enhancedAnalytics: 'Analyses Améliorées',
    enhancedAnalyticsDescription: 'Débloquez des analyses ROI détaillées avec notre plan premium',
    unlockAnalytics: 'Débloquer les Analyses',
    viewDetailed: 'Voir Détaillé',
    marketInsights: 'Aperçus du Marché',
    marketInsightsDescription: 'Connectez-vous aux données de marché en temps réel pour des prévisions d\'appréciation précises',
    connectMarketData: 'Connecter les Données de Marché',
    investmentGoals: 'Objectifs d\'Investissement',
    edit: 'Modifier',
    editGoals: 'Modifier les Objectifs',
    cashflowGoal: 'Objectif de Flux de Trésorerie',
    equityTarget: 'Objectif de Capitaux Propres',
    totalPropertiesGoal: 'Objectif Total de Propriétés',
    portfolioAlerts: 'Alertes du Portefeuille',
    refinancingOpportunity: 'Opportunité de Refinancement',
    propertyEligibleRefinancing: 'La propriété peut être éligible pour un refinancement à de meilleurs taux',
    viewDetails: 'Voir les Détails',
    marketOpportunity: 'Opportunité de Marché',
    newPropertyMatchingCriteria: 'Nouvelle propriété correspondant à vos critères d\'investissement',
    northDistrict: 'District Nord',
    viewProperty: 'Voir la Propriété',
    fromPreviousPeriod: 'par rapport à la période précédente',
    
    // Language and site management
    manageLanguagePreferences: 'Gérer les Préférences de Langue',
    currentLanguage: 'Langue Actuelle',
    activeLanguageDescription: 'Sélectionnez votre langue préférée pour l\'application',
    interfaceLanguage: 'Langue de l\'Interface',
    interfaceLanguageDescription: 'Langue utilisée pour les éléments d\'interface et la navigation',
    interfaceLanguageInfo: 'Choisissez la langue que vous préférez pour l\'interface utilisateur',
    switchLanguageDescription: 'Basculer entre les langues disponibles',
    languagePreferences: 'Préférences de Langue',
    languagePreferencesDescription: 'Configurez vos paramètres de langue',
    comingSoon: 'Bientôt Disponible',
  },
  it: {
    // Navigation and main sections
    dashboard: 'Dashboard',
    properties: 'Proprietà',
    calculators: 'Calcolatrici',
    schedule: 'Calendario',
    refurbishment: 'Ristrutturazione',
    decision: 'Decisione',
    education: 'Formazione',
    investorDashboard: 'Dashboard per Investitori',
    investmentCalculator: 'Calcolatore d\'Investimento',
    
    // Welcome messages
    welcome: 'Benvenuto',
    welcomeBack: 'Bentornato',
    toThe: 'alla',
    accessComprehensiveInvestmentTools: 'Accedi a strumenti e analisi di investimento completi.',
    completeInvestmentToolsuite: 'Suite completa di strumenti per investitori immobiliari',
    
    // Portfolio sections
    portfolio: 'Portafoglio',
    financing: 'Finanziamento',
    taxPlanning: 'Pianificazione Fiscale',
    dueDiligence: 'Due Diligence',
    continueMakingSmartInvestments: 'Continua a prendere decisioni di investimento intelligenti con i nostri strumenti e approfondimenti.',
    
    // Market data
    recentMarketTrends: 'Tendenze Recenti del Mercato',
    investmentOpportunities: 'Opportunità di Investimento',
    propertyComparisons: 'Confronti tra Proprietà',
    marketForecast: 'Previsione del Mercato',
    
    // Settings
    currencySettings: 'Impostazioni Valuta',
    languageSettings: 'Impostazioni Lingua',
    
    // Education page translations
    selectLevel: 'Seleziona il Tuo Livello di Esperienza',
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
    
    // Progress tracking
    learningProgress: 'Progresso di Apprendimento',
    completed: 'Completato',
    
    // Investment categories
    investmentBasics: 'Fondamenti di Investimento',
    taxation: 'Tassazione',
    legalBasics: 'Fondamenti Legali',
    propertyManagement: 'Gestione Immobiliare',
    advancedTaxation: 'Tassazione Avanzata',
    advancedInvesting: 'Investimento Avanzato',
    legalAspects: 'Aspetti Legali',
    developmentProjects: 'Progetti di Sviluppo',
    marketAnalysis: 'Analisi di Mercato',
    
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
    
    // Portfolio metrics
    portfolioValue: 'Valore del Portafoglio',
    equity: 'Capitale Proprio',
    cashFlow: 'Flusso di Cassa',
    returnsAndGrowth: 'Rendimenti e Crescita',
    propertyPerformance: 'Performance delle Proprietà',
    compareYourInvestments: 'Confronta i Tuoi Investimenti',
    roi: 'ROI',
    appreciation: 'Apprezzamento',
    cashOnCashROI: 'ROI Cash-on-Cash',
    totalReturn: 'Rendimento Totale',
    investmentPortfolio: 'Portafoglio di Investimenti',
    trackYourRealEstateInvestments: 'Monitora i Tuoi Investimenti Immobiliari',
    positive: 'Positivo',
    debt: 'Debito',
    enhancedAnalytics: 'Analisi Avanzate',
    enhancedAnalyticsDescription: 'Sblocca analisi ROI dettagliate con il nostro piano premium',
    unlockAnalytics: 'Sblocca Analisi',
    viewDetailed: 'Visualizza Dettaglio',
    marketInsights: 'Approfondimenti di Mercato',
    marketInsightsDescription: 'Connettiti ai dati di mercato in tempo reale per previsioni accurate di apprezzamento',
    connectMarketData: 'Connetti Dati di Mercato',
    investmentGoals: 'Obiettivi di Investimento',
    edit: 'Modifica',
    editGoals: 'Modifica Obiettivi',
    cashflowGoal: 'Obiettivo di Flusso di Cassa',
    equityTarget: 'Obiettivo di Capitale',
    totalPropertiesGoal: 'Obiettivo Totale Proprietà',
    portfolioAlerts: 'Avvisi di Portafoglio',
    refinancingOpportunity: 'Opportunità di Rifinanziamento',
    propertyEligibleRefinancing: 'La proprietà potrebbe essere idonea per il rifinanziamento a tassi migliori',
    viewDetails: 'Visualizza Dettagli',
    marketOpportunity: 'Opportunità di Mercato',
    newPropertyMatchingCriteria: 'Nuova proprietà corrispondente ai tuoi criteri di investimento',
    northDistrict: 'Distretto Nord',
    viewProperty: 'Visualizza Proprietà',
    fromPreviousPeriod: 'rispetto al periodo precedente',
    
    // Language and site management
    manageLanguagePreferences: 'Gestisci Preferenze Lingua',
    currentLanguage: 'Lingua Corrente',
    activeLanguageDescription: 'Seleziona la tua lingua preferita per l\'applicazione',
    interfaceLanguage: 'Lingua dell\'Interfaccia',
    interfaceLanguageDescription: 'Lingua utilizzata per elementi UI e navigazione',
    interfaceLanguageInfo: 'Scegli la lingua che preferisci per l\'interfaccia utente',
    switchLanguageDescription: 'Passa tra le lingue disponibili',
    languagePreferences: 'Preferenze Lingua',
    languagePreferencesDescription: 'Configura le tue impostazioni di lingua',
    comingSoon: 'Prossimamente',
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
        ...(currentLanguageContent?.beginner || {})
      },
      intermediate: {
        ...englishContent.intermediate,
        ...(currentLanguageContent?.intermediate || {})
      },
      expert: {
        ...englishContent.expert,
        ...(currentLanguageContent?.expert || {})
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
