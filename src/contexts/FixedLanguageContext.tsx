import React, { createContext, useContext, useEffect, useState } from 'react';
import { getBestMatchLanguage } from '@/utils/languageDetector';

export type SupportedLanguage = "en" | "de" | "es" | "fr";

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  enabled: boolean;
}

export const availableLanguages: SupportedLanguage[] = ["en", "de", "es", "fr"];

export const languageDetails: Record<SupportedLanguage, LanguageInfo> = {
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

// Base translations object
const baseTranslations: Record<string, Record<string, string>> = {
  en: {
    welcome: "Welcome",
    settings: "Settings",
    profile: "Profile",
    display: "Display",
    notifications: "Notifications",
    language: "Language",
    security: "Security",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    systemPreference: "System Preference",
    changeTheme: "Change Theme",
    light: "Light",
    dark: "Dark",
    system: "System",
    changeLanguage: "Change Language",
    changeInterfaceLanguage: "Change the interface language",
    languageSettings: "Language Settings",
    settingsUpdated: "Settings Updated",
    settingUpdated: "Setting Updated",
    highContrastEnabled: "High contrast mode enabled",
    highContrastDisabled: "High contrast mode disabled",
    largeTextEnabled: "Large text mode enabled",
    largeTextDisabled: "Large text mode disabled",
    reduceMotionEnabled: "Reduced motion enabled",
    reduceMotionDisabled: "Reduced motion disabled",
    keyboardModeEnabled: "Keyboard navigation mode enabled",
    keyboardModeDisabled: "Keyboard navigation mode disabled",
    screenReaderEnabled: "Screen reader optimizations enabled",
    screenReaderDisabled: "Screen reader optimizations disabled",
    dyslexiaFriendlyEnabled: "Dyslexia friendly mode enabled",
    dyslexiaFriendlyDisabled: "Dyslexia friendly mode disabled",
    settingsReset: "Settings Reset",
    accessibilitySettingsReset: "All accessibility settings have been reset",
    accessibilitySettings: "Accessibility Settings",
    accessibilityDescription: "Customize your experience for better accessibility",
    visual: "Visual",
    interaction: "Interaction",
    content: "Content",
    highContrast: "High Contrast",
    highContrastDescription: "Increase contrast for better readability",
    largeText: "Large Text",
    largeTextDescription: "Increase text size for better readability",
    reduceMotion: "Reduce Motion",
    reduceMotionDescription: "Minimize animations and transitions",
    keyboardMode: "Keyboard Navigation",
    keyboardModeDescription: "Optimize for keyboard navigation",
    screenReader: "Screen Reader Optimizations",
    screenReaderDescription: "Enhance compatibility with screen readers",
    dyslexiaFriendly: "Dyslexia Friendly",
    dyslexiaFriendlyDescription: "Use fonts and layouts optimized for dyslexia",
    resetToDefaults: "Reset to Defaults",
    done: "Done",
    featureNotification: "Feature Preview",
    featureComingSoon: "is coming soon to your dashboard",
    navigatingToAccessibilitySettings: "Navigating to accessibility settings",
    
    // Portfolio dashboard translations
    investmentPortfolio: "Investment Portfolio",
    trackYourRealEstateInvestments: "Track and manage your real estate investments",
    analytics: "Analytics",
    projections: "Projections",
    propertyComparison: "Property Comparison",
    cashFlow: "Cash Flow",
    allocation: "Allocation",
    propertyPerformance: "Property Performance",
    compareYourInvestments: "Compare the performance of your investments",
    portfolioProjections: "Portfolio Projections",
    simulateYourPortfolioGrowth: "Simulate your portfolio growth with different scenarios",
    cashFlowAnalysis: "Cash Flow Analysis",
    cashFlowAnalysisDescription: "Detailed analysis of your property cash flows",
    unlockCashFlowAnalysis: "Unlock Cash Flow Analysis",
    assetAllocation: "Asset Allocation",
    assetAllocationDescription: "View your portfolio diversity across property types and locations",
    unlockAssetAllocation: "Unlock Asset Allocation",
    investorMetrics: "Investor Metrics",
    keyPerformanceIndicators: "Key Performance Indicators",
    exportMetrics: "Export Metrics",
    exportData: "Export Data",
    capRate: "Cap Rate",
    netIncomeDividedByValue: "Net income divided by property value",
    cashOnCash: "Cash on Cash",
    annualCashFlowDividedByInvestment: "Annual cash flow divided by initial investment",
    debtServiceCoverage: "Debt Service Coverage",
    netOperatingIncomeToDebtRatio: "Net operating income to debt ratio",
    breakEvenOccupancy: "Break-even Occupancy",
    minimumOccupancyToBreakEven: "Minimum occupancy needed to break even",
    enhancedAnalytics: "Enhanced Analytics",
    enhancedAnalyticsDescription: "Unlock detailed ROI analysis with advanced metrics",
    unlockAnalytics: "Unlock Analytics",
    viewDetailed: "View Detailed",
    marketInsights: "Market Insights",
    marketInsightsDescription: "Connect market data to see how property values are trending",
    connectMarketData: "Connect Market Data",
    
    // New translations for customizable dashboard
    customizeDashboard: "Customize Dashboard",
    saveLayout: "Save Layout",
    resetLayout: "Reset Layout",
    dragToResize: "Drag to resize",
    addWidget: "Add Widget",
    removeWidget: "Remove Widget",
    layoutSaved: "Dashboard layout saved",
    layoutReset: "Dashboard layout reset",
    selectWidgets: "Select Widgets to Display",
    dashboardCustomization: "Dashboard Customization",
    applyChanges: "Apply Changes",
    cancelChanges: "Cancel",
    widgetSettings: "Widget Settings",
    widgetSize: "Widget Size",
    small: "Small",
    medium: "Medium",
    large: "Large",
    selectLocation: "Select Location",
    
    // For Security Alert
    securityAlert: "Security Alert",
    securityAlertDescription: "We recommend setting up a PIN for additional security.",
    setupPIN: "Setup PIN",
    dismiss: "Dismiss",
    securityEnabled: "Security Enabled",
    securityEnabledDescription: "Your app is now secured with PIN protection",
  },
  
  de: {
    welcome: "Willkommen",
    settings: "Einstellungen",
    profile: "Profil",
    display: "Anzeige",
    notifications: "Benachrichtigungen",
    language: "Sprache",
    security: "Sicherheit",
    darkMode: "Dunkler Modus",
    lightMode: "Heller Modus",
    systemPreference: "Systemeinstellung",
    changeTheme: "Design ändern",
    light: "Hell",
    dark: "Dunkel",
    system: "System",
    changeLanguage: "Sprache ändern",
    changeInterfaceLanguage: "Ändern Sie die Sprache der Benutzeroberfläche",
    languageSettings: "Spracheinstellungen",
    settingsUpdated: "Einstellungen aktualisiert",
    settingUpdated: "Einstellung aktualisiert",
    highContrastEnabled: "Hochkontrastmodus aktiviert",
    highContrastDisabled: "Hochkontrastmodus deaktiviert",
    largeTextEnabled: "Großer Text aktiviert",
    largeTextDisabled: "Großer Text deaktiviert",
    reduceMotionEnabled: "Bewegungsreduzierung aktiviert",
    reduceMotionDisabled: "Bewegungsreduzierung deaktiviert",
    keyboardModeEnabled: "Tastaturnavigationsmodus aktiviert",
    keyboardModeDisabled: "Tastaturnavigationsmodus deaktiviert",
    screenReaderEnabled: "Screenreader-Optimierungen aktiviert",
    screenReaderDisabled: "Screenreader-Optimierungen deaktiviert",
    dyslexiaFriendlyEnabled: "Legasthenie-freundlicher Modus aktiviert",
    dyslexiaFriendlyDisabled: "Legasthenie-freundlicher Modus deaktiviert",
    settingsReset: "Einstellungen zurückgesetzt",
    accessibilitySettingsReset: "Alle Zugänglichkeitseinstellungen wurden zurückgesetzt",
    accessibilitySettings: "Barrierefreiheit",
    accessibilityDescription: "Passen Sie Ihre Erfahrung für bessere Zugänglichkeit an",
    visual: "Visuell",
    interaction: "Interaktion",
    content: "Inhalt",
    highContrast: "Hoher Kontrast",
    highContrastDescription: "Erhöhen Sie den Kontrast für bessere Lesbarkeit",
    largeText: "Großer Text",
    largeTextDescription: "Textgröße für bessere Lesbarkeit erhöhen",
    reduceMotion: "Bewegung reduzieren",
    reduceMotionDescription: "Animationen und Übergänge minimieren",
    keyboardMode: "Tastaturnavigation",
    keyboardModeDescription: "Für Tastaturnavigation optimieren",
    screenReader: "Screenreader-Optimierungen",
    screenReaderDescription: "Verbesserte Kompatibilität mit Screenreadern",
    dyslexiaFriendly: "Legasthenie-freundlich",
    dyslexiaFriendlyDescription: "Schriftarten und Layouts für Legastheniker optimiert",
    resetToDefaults: "Auf Standardwerte zurücksetzen",
    done: "Fertig",
    featureNotification: "Funktionsvorschau",
    featureComingSoon: "wird bald auf Ihrem Dashboard verfügbar sein",
    navigatingToAccessibilitySettings: "Navigation zu Barrierefreiheit-Einstellungen",
    
    // Portfolio dashboard translations
    investmentPortfolio: "Investitionsportfolio",
    trackYourRealEstateInvestments: "Verfolgen und verwalten Sie Ihre Immobilieninvestitionen",
    analytics: "Analysen",
    projections: "Prognosen",
    propertyComparison: "Immobilienvergleich",
    cashFlow: "Cashflow",
    allocation: "Verteilung",
    propertyPerformance: "Immobilienperformance",
    compareYourInvestments: "Vergleichen Sie die Performance Ihrer Investitionen",
    portfolioProjections: "Portfolio-Prognosen",
    simulateYourPortfolioGrowth: "Simulieren Sie Ihr Portfolio-Wachstum mit verschiedenen Szenarien",
    cashFlowAnalysis: "Cashflow-Analyse",
    cashFlowAnalysisDescription: "Detaillierte Analyse Ihrer Immobilien-Cashflows",
    unlockCashFlowAnalysis: "Cashflow-Analyse freischalten",
    assetAllocation: "Asset-Allokation",
    assetAllocationDescription: "Sehen Sie Ihre Portfolio-Diversität über Immobilienarten und Standorte hinweg",
    unlockAssetAllocation: "Asset-Allokation freischalten",
    investorMetrics: "Investorenkennzahlen",
    keyPerformanceIndicators: "Schlüsselleistungsindikatoren",
    exportMetrics: "Metriken exportieren",
    exportData: "Daten exportieren",
    capRate: "Kapitalisierungsrate",
    netIncomeDividedByValue: "Nettoeinkommen geteilt durch Immobilienwert",
    cashOnCash: "Cash-on-Cash",
    annualCashFlowDividedByInvestment: "Jährlicher Cashflow geteilt durch Anfangsinvestition",
    debtServiceCoverage: "Schuldendienstdeckung",
    netOperatingIncomeToDebtRatio: "Verhältnis von Betriebsergebnis zu Schulden",
    breakEvenOccupancy: "Break-Even-Belegung",
    minimumOccupancyToBreakEven: "Mindestbelegung zum Break-Even",
    enhancedAnalytics: "Erweiterte Analysen",
    enhancedAnalyticsDescription: "Schalten Sie detaillierte ROI-Analysen mit erweiterten Metriken frei",
    unlockAnalytics: "Analysen freischalten",
    viewDetailed: "Detailliert anzeigen",
    marketInsights: "Markteinblicke",
    marketInsightsDescription: "Verbinden Sie Marktdaten, um zu sehen, wie sich Immobilienwerte entwickeln",
    connectMarketData: "Marktdaten verbinden",
    
    // New translations for customizable dashboard
    customizeDashboard: "Dashboard anpassen",
    saveLayout: "Layout speichern",
    resetLayout: "Layout zurücksetzen",
    dragToResize: "Ziehen zum Anpassen der Größe",
    addWidget: "Widget hinzufügen",
    removeWidget: "Widget entfernen",
    layoutSaved: "Dashboard-Layout gespeichert",
    layoutReset: "Dashboard-Layout zurückgesetzt",
    selectWidgets: "Widgets zur Anzeige auswählen",
    dashboardCustomization: "Dashboard-Anpassung",
    applyChanges: "Änderungen anwenden",
    cancelChanges: "Abbrechen",
    widgetSettings: "Widget-Einstellungen",
    widgetSize: "Widget-Größe",
    small: "Klein",
    medium: "Mittel",
    large: "Groß",
    selectLocation: "Standort auswählen",
    
    // For Security Alert
    securityAlert: "Sicherheitshinweis",
    securityAlertDescription: "Wir empfehlen das Einrichten einer PIN für zusätzliche Sicherheit.",
    setupPIN: "PIN einrichten",
    dismiss: "Ablehnen",
    securityEnabled: "Sicherheit aktiviert",
    securityEnabledDescription: "Ihr Konto ist durch PIN-Sicherheit geschützt.",
  },
  
  es: {
    welcome: "Bienvenido",
    settings: "Configuración",
    profile: "Perfil",
    display: "Pantalla",
    notifications: "Notificaciones",
    language: "Idioma",
    security: "Seguridad",
    darkMode: "Modo oscuro",
    lightMode: "Modo claro",
    systemPreference: "Preferencia del sistema",
    changeTheme: "Cambiar tema",
    light: "Claro",
    dark: "Oscuro",
    system: "Sistema",
    changeLanguage: "Cambiar idioma",
    changeInterfaceLanguage: "Cambiar el idioma de la interfaz",
    languageSettings: "Configuración de idioma",
    settingsUpdated: "Configuración actualizada",
    settingUpdated: "Configuración actualizada",
    highContrastEnabled: "Modo de alto contraste activado",
    highContrastDisabled: "Modo de alto contraste desactivado",
    largeTextEnabled: "Modo de texto grande activado",
    largeTextDisabled: "Modo de texto grande desactivado",
    reduceMotionEnabled: "Reducción de movimiento activada",
    reduceMotionDisabled: "Reducción de movimiento desactivada",
    keyboardModeEnabled: "Modo de navegación por teclado activado",
    keyboardModeDisabled: "Modo de navegación por teclado desactivado",
    screenReaderEnabled: "Optimizaciones para lectores de pantalla activadas",
    screenReaderDisabled: "Optimizaciones para lectores de pantalla desactivadas",
    dyslexiaFriendlyEnabled: "Modo amigable para dislexia activado",
    dyslexiaFriendlyDisabled: "Modo amigable para dislexia desactivado",
    settingsReset: "Configuración restablecida",
    accessibilitySettingsReset: "Todas las configuraciones de accesibilidad se han restablecido",
    accessibilitySettings: "Configuración de accesibilidad",
    accessibilityDescription: "Personalice su experiencia para una mejor accesibilidad",
    visual: "Visual",
    interaction: "Interacción",
    content: "Contenido",
    highContrast: "Alto contraste",
    highContrastDescription: "Aumentar el contraste para una mejor legibilidad",
    largeText: "Texto grande",
    largeTextDescription: "Aumentar el tamaño del texto para una mejor legibilidad",
    reduceMotion: "Reducir movimiento",
    reduceMotionDescription: "Minimizar animaciones y transiciones",
    keyboardMode: "Navegación por teclado",
    keyboardModeDescription: "Optimizar para navegación por teclado",
    screenReader: "Optimizaciones para lectores de pantalla",
    screenReaderDescription: "Mejorar la compatibilidad con lectores de pantalla",
    dyslexiaFriendly: "Amigable para dislexia",
    dyslexiaFriendlyDescription: "Usar fuentes y diseños optimizados para dislexia",
    resetToDefaults: "Restablecer a valores predeterminados",
    done: "Hecho",
    featureNotification: "Vista previa de función",
    featureComingSoon: "estará disponible próximamente en su panel",
    navigatingToAccessibilitySettings: "Navegando a configuración de accesibilidad",
    
    // Portfolio dashboard translations
    investmentPortfolio: "Cartera de inversiones",
    trackYourRealEstateInvestments: "Seguimiento y gestión de sus inversiones inmobiliarias",
    analytics: "Análisis",
    projections: "Proyecciones",
    propertyComparison: "Comparación de propiedades",
    cashFlow: "Flujo de caja",
    allocation: "Asignación",
    propertyPerformance: "Rendimiento de propiedades",
    compareYourInvestments: "Compare el rendimiento de sus inversiones",
    portfolioProjections: "Proyecciones de cartera",
    simulateYourPortfolioGrowth: "Simule el crecimiento de su cartera con diferentes escenarios",
    cashFlowAnalysis: "Análisis de flujo de caja",
    cashFlowAnalysisDescription: "Análisis detallado de los flujos de caja de sus propiedades",
    unlockCashFlowAnalysis: "Desbloquear análisis de flujo de caja",
    assetAllocation: "Asignación de activos",
    assetAllocationDescription: "Vea la diversidad de su cartera entre tipos de propiedades y ubicaciones",
    unlockAssetAllocation: "Desbloquear asignación de activos",
    investorMetrics: "Métricas de inversor",
    keyPerformanceIndicators: "Indicadores clave de rendimiento",
    exportMetrics: "Exportar métricas",
    exportData: "Exportar datos",
    capRate: "Tasa de capitalización",
    netIncomeDividedByValue: "Ingreso neto dividido por valor de propiedad",
    cashOnCash: "Efectivo sobre efectivo",
    annualCashFlowDividedByInvestment: "Flujo de caja anual dividido por inversión inicial",
    debtServiceCoverage: "Cobertura de servicio de deuda",
    netOperatingIncomeToDebtRatio: "Relación entre ingreso operativo neto y deuda",
    breakEvenOccupancy: "Ocupación de equilibrio",
    minimumOccupancyToBreakEven: "Ocupación mínima necesaria para equilibrar",
    enhancedAnalytics: "Análisis mejorado",
    enhancedAnalyticsDescription: "Desbloquee análisis detallados de ROI con métricas avanzadas",
    unlockAnalytics: "Desbloquear análisis",
    viewDetailed: "Ver detallado",
    marketInsights: "Información de mercado",
    marketInsightsDescription: "Conecte datos de mercado para ver cómo evolucionan los valores de las propiedades",
    connectMarketData: "Conectar datos de mercado",
    
    // New translations for customizable dashboard
    customizeDashboard: "Personalizar panel",
    saveLayout: "Guardar diseño",
    resetLayout: "Restablecer diseño",
    dragToResize: "Arrastrar para cambiar tamaño",
    addWidget: "Añadir widget",
    removeWidget: "Eliminar widget",
    layoutSaved: "Diseño del panel guardado",
    layoutReset: "Diseño del panel restablecido",
    selectWidgets: "Seleccionar widgets para mostrar",
    dashboardCustomization: "Personalización del panel",
    applyChanges: "Aplicar cambios",
    cancelChanges: "Cancelar",
    widgetSettings: "Configuración de widget",
    widgetSize: "Tamaño de widget",
    small: "Pequeño",
    medium: "Mediano",
    large: "Grande",
    selectLocation: "Seleccionar ubicación",
    
    // For Security Alert
    securityAlert: "Alerta de seguridad",
    securityAlertDescription: "Recomendamos configurar un PIN para seguridad adicional.",
    setupPIN: "Configurar PIN",
    dismiss: "Descartar",
    securityEnabled: "Seguridad habilitada",
    securityEnabledDescription: "Su cuenta está protegida con seguridad PIN.",
  },
  
  fr: {
    welcome: "Bienvenue",
    settings: "Paramètres",
    profile: "Profil",
    display: "Affichage",
    notifications: "Notifications",
    language: "Langue",
    security: "Sécurité",
    darkMode: "Mode sombre",
    lightMode: "Mode clair",
    systemPreference: "Préférence système",
    changeTheme: "Changer de thème",
    light: "Clair",
    dark: "Sombre",
    system: "Système",
    changeLanguage: "Changer de langue",
    changeInterfaceLanguage: "Modifier la langue de l'interface",
    languageSettings: "Paramètres de langue",
    settingsUpdated: "Paramètres mis à jour",
    settingUpdated: "Paramètre mis à jour",
    highContrastEnabled: "Mode contraste élevé activé",
    highContrastDisabled: "Mode contraste élevé désactivé",
    largeTextEnabled: "Mode texte large activé",
    largeTextDisabled: "Mode texte large désactivé",
    reduceMotionEnabled: "Réduction de mouvement activée",
    reduceMotionDisabled: "Réduction de mouvement désactivée",
    keyboardModeEnabled: "Mode navigation au clavier activé",
    keyboardModeDisabled: "Mode navigation au clavier désactivé",
    screenReaderEnabled: "Optimisations pour lecteurs d'écran activées",
    screenReaderDisabled: "Optimisations pour lecteurs d'écran désactivées",
    dyslexiaFriendlyEnabled: "Mode adapté à la dyslexie activé",
    dyslexiaFriendlyDisabled: "Mode adapté à la dyslexie désactivé",
    settingsReset: "Paramètres réinitialisés",
    accessibilitySettingsReset: "Tous les paramètres d'accessibilité ont été réinitialisés",
    accessibilitySettings: "Paramètres d'accessibilité",
    accessibilityDescription: "Personnalisez votre expérience pour une meilleure accessibilité",
    visual: "Visuel",
    interaction: "Interaction",
    content: "Contenu",
    highContrast: "Contraste élevé",
    highContrastDescription: "Augmenter le contraste pour une meilleure lisibilité",
    largeText: "Texte large",
    largeTextDescription: "Augmenter la taille du texte pour une meilleure lisibilité",
    reduceMotion: "Réduire le mouvement",
    reduceMotionDescription: "Minimiser les animations et transitions",
    keyboardMode: "Navigation au clavier",
    keyboardModeDescription: "Optimiser pour la navigation au clavier",
    screenReader: "Optimisations pour lecteurs d'écran",
    screenReaderDescription: "Améliorer la compatibilité avec les lecteurs d'écran",
    dyslexiaFriendly: "Adapté à la dyslexie",
    dyslexiaFriendlyDescription: "Utiliser des polices et des mises en page optimisées pour la dyslexie",
    resetToDefaults: "Réinitialiser aux valeurs par défaut",
    done: "Terminé",
    featureNotification: "Aperçu de fonctionnalité",
    featureComingSoon: "sera bientôt disponible sur votre tableau de bord",
    navigatingToAccessibilitySettings: "Navigation vers les paramètres d'accessibilité",
    
    // Portfolio dashboard translations
    investmentPortfolio: "Portefeuille d'investissement",
    trackYourRealEstateInvestments: "Suivez et gérez vos investissements immobiliers",
    analytics: "Analyses",
    projections: "Projections",
    propertyComparison: "Comparaison de biens",
    cashFlow: "Flux de trésorerie",
    allocation: "Allocation",
    propertyPerformance: "Performance des biens",
    compareYourInvestments: "Comparez la performance de vos investissements",
    portfolioProjections: "Projections de portefeuille",
    simulateYourPortfolioGrowth: "Simulez la croissance de votre portefeuille avec différents scénarios",
    cashFlowAnalysis: "Analyse des flux de trésorerie",
    cashFlowAnalysisDescription: "Analyse détaillée des flux de trésorerie de vos biens",
    unlockCashFlowAnalysis: "Débloquer l'analyse des flux de trésorerie",
    assetAllocation: "Allocation d'actifs",
    assetAllocationDescription: "Visualisez la diversité de votre portefeuille à travers les types de biens et les emplacements",
    unlockAssetAllocation: "Débloquer l'allocation d'actifs",
    investorMetrics: "Métriques d'investisseur",
    keyPerformanceIndicators: "Indicateurs de performance clés",
    exportMetrics: "Exporter les métriques",
    exportData: "Exporter les données",
    capRate: "Taux de capitalisation",
    netIncomeDividedByValue: "Revenu net divisé par la valeur du bien",
    cashOnCash: "Cash-on-Cash",
    annualCashFlowDividedByInvestment: "Flux de trésorerie annuel divisé par investissement initial",
    debtServiceCoverage: "Couverture du service de la dette",
    netOperatingIncomeToDebtRatio: "Ratio du revenu d'exploitation net à la dette",
    breakEvenOccupancy: "Occupation du point mort",
    minimumOccupancyToBreakEven: "Occupation minimale nécessaire pour atteindre le point mort",
    enhancedAnalytics: "Analyses améliorées",
    enhancedAnalyticsDescription: "Débloquez des analyses ROI détaillées avec des métriques avancées",
    unlockAnalytics: "Débloquer les analyses",
    viewDetailed: "Voir détaillé",
    marketInsights: "Aperçus du marché",
    marketInsightsDescription: "Connectez des données de marché pour voir comment les valeurs immobilières évoluent",
    connectMarketData: "Connecter les données de marché",
    
    // New translations for customizable dashboard
    customizeDashboard: "Personnaliser le tableau de bord",
    saveLayout: "Enregistrer la disposition",
    resetLayout: "Réinitialiser la disposition",
    dragToResize: "Faites glisser pour redimensionner",
    addWidget: "Ajouter un widget",
    removeWidget: "Supprimer un widget",
    layoutSaved: "Disposition du tableau de bord enregistrée",
    layoutReset: "Disposition du tableau de bord réinitialisée",
    selectWidgets: "Sélectionner les widgets à afficher",
    dashboardCustomization: "Personnalisation du tableau de bord",
    applyChanges: "Appliquer les modifications",
    cancelChanges: "Annuler",
    widgetSettings: "Paramètres du widget",
    widgetSize: "Taille du widget",
    small: "Petit",
    medium: "Moyen",
    large: "Grand",
    selectLocation: "Sélectionner l'emplacement",
    
    // For Security Alert
    securityAlert: "Alerte de sécurité",
    securityAlertDescription: "Nous recommandons de configurer un PIN pour une sécurité supplémentaire.",
    setupPIN: "Configurer un PIN",
    dismiss: "Ignorer",
    securityEnabled: "Sécurité activée",
    securityEnabledDescription: "Votre compte est protégé par une sécurité PIN.",
  }
};

interface LanguageContextProps {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: (key: string, params?: Record<string, string>) => string;
  translations: Record<string, Record<string, string>>;
  availableLanguages: SupportedLanguage[];
  languageDetails: Record<SupportedLanguage, LanguageInfo>;
}

const LanguageContext = createContext<LanguageContextProps>({
  language: "en",
  setLanguage: () => {},
  t: () => "",
  translations: baseTranslations,
  availableLanguages,
  languageDetails,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<SupportedLanguage>(() => {
    // Try to get language from localStorage
    const savedLang = localStorage.getItem('language') as SupportedLanguage | null;
    
    // If we have a valid saved language, use it
    if (savedLang && availableLanguages.includes(savedLang)) {
      return savedLang;
    }
    
    // Otherwise detect the best match from browser settings
    return getBestMatchLanguage(availableLanguages) as SupportedLanguage || "en";
  });
  
  const [translations, setTranslations] = useState(baseTranslations);
  
  // Set the language in localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
    
    // Update document language attribute for accessibility
    document.documentElement.setAttribute('lang', language);
  }, [language]);
  
  // Translation function
  const t = (key: string, params?: Record<string, string>): string => {
    const translation = translations[language]?.[key] || translations.en?.[key] || key;
    
    if (!params) {
      return translation;
    }
    
    // Replace parameters in translation string
    return Object.entries(params).reduce(
      (str, [param, value]) => str.replace(new RegExp(`{${param}}`, 'g'), value),
      translation
    );
  };
  
  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        translations,
        availableLanguages,
        languageDetails
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
