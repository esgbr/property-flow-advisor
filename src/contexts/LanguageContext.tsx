import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUserPreferences } from './UserPreferencesContext';
import { detectBrowserLanguage, isLanguageSupported, getBestMatchLanguage } from '@/utils/languageDetector';

// Define available languages
export type SupportedLanguage = 'en' | 'de' | 'fr' | 'es' | 'it';

// Language info interface
export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  flag: string;
  enabled: boolean;
  nativeName: string;
}

// Available languages in the application
export const availableLanguages: LanguageInfo[] = [
  { code: 'de', name: 'German', flag: '🇩🇪', enabled: true, nativeName: 'Deutsch' },
  { code: 'en', name: 'English', flag: '🇬🇧', enabled: true, nativeName: 'English' },
  { code: 'fr', name: 'French', flag: '🇫🇷', enabled: true, nativeName: 'Français' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', enabled: false, nativeName: 'Español' },
  { code: 'it', name: 'Italian', flag: '🇮🇹', enabled: false, nativeName: 'Italiano' }
];

// Translation dictionary type
type TranslationDictionary = Record<string, Record<SupportedLanguage, string>>;

// Translations (erweitert mit korrektem Deutsch)
const translations: TranslationDictionary = {
  // General UI
  propertyFlow: {
    en: 'PropertyFlow',
    de: 'ImmobilienFlow',
    fr: 'PropertyFlow',
    es: 'PropertyFlow',
    it: 'PropertyFlow'
  },
  investmentPlatform: {
    en: 'Real Estate Investment Platform',
    de: 'Immobilien-Investment-Plattform',
    fr: 'Plateforme d\'investissement immobilier',
    es: 'Plataforma de inversión inmobiliaria',
    it: 'Piattaforma di investimento immobiliare'
  },
  home: {
    en: 'Home',
    de: 'Startseite',
    fr: 'Accueil',
    es: 'Inicio',
    it: 'Home'
  },
  dashboard: {
    en: 'Dashboard',
    de: 'Dashboard',
    fr: 'Tableau de bord',
    es: 'Panel de control',
    it: 'Dashboard'
  },
  settings: {
    en: 'Settings',
    de: 'Einstellungen',
    fr: 'Paramètres',
    es: 'Configuración',
    it: 'Impostazioni'
  },
  language: {
    en: 'Language',
    de: 'Sprache',
    fr: 'Langue',
    es: 'Idioma',
    it: 'Lingua'
  },
  theme: {
    en: 'Theme',
    de: 'Design',
    fr: 'Thème',
    es: 'Tema',
    it: 'Tema'
  },
  account: {
    en: 'Account',
    de: 'Konto',
    fr: 'Compte',
    es: 'Cuenta',
    it: 'Account'
  },
  login: {
    en: 'Login',
    de: 'Anmelden',
    fr: 'Connexion',
    es: 'Iniciar sesión',
    it: 'Accesso'
  },
  logout: {
    en: 'Logout',
    de: 'Abmelden',
    fr: 'Déconnexion',
    es: 'Cerrar sesión',
    it: 'Disconnettersi'
  },
  register: {
    en: 'Register',
    de: 'Registrieren',
    fr: 'S\'inscrire',
    es: 'Registrarse',
    it: 'Registrarsi'
  },
  createAccount: {
    en: 'Create Account',
    de: 'Konto erstellen',
    fr: 'Créer un compte',
    es: 'Crear cuenta',
    it: 'Crea account'
  },
  enterYourDetailsToRegister: {
    en: 'Enter your details to create an account',
    de: 'Geben Sie Ihre Daten ein, um ein Konto zu erstellen',
    fr: 'Entrez vos coordonnées pour créer un compte',
    es: 'Introduzca sus datos para crear una cuenta',
    it: 'Inserisci i tuoi dati per creare un account'
  },
  name: {
    en: 'Name',
    de: 'Name',
    fr: 'Nom',
    es: 'Nombre',
    it: 'Nome'
  },
  email: {
    en: 'Email',
    de: 'E-Mail',
    fr: 'E-mail',
    es: 'Correo electrónico',
    it: 'Email'
  },
  password: {
    en: 'Password',
    de: 'Passwort',
    fr: 'Mot de passe',
    es: 'Contraseña',
    it: 'Password'
  },
  confirmPassword: {
    en: 'Confirm Password',
    de: 'Passwort bestätigen',
    fr: 'Confirmer le mot de passe',
    es: 'Confirmar contraseña',
    it: 'Conferma password'
  },
  creating: {
    en: 'Creating...',
    de: 'Erstelle...',
    fr: 'Création...',
    es: 'Creando...',
    it: 'Creazione...'
  },
  alreadyHaveAccount: {
    en: 'Already have an account?',
    de: 'Haben Sie bereits ein Konto?',
    fr: 'Vous avez déjà un compte?',
    es: '¿Ya tienes una cuenta?',
    it: 'Hai già un account?'
  },
  registrationDisclaimer: {
    en: 'By creating an account, you agree to our Terms of Service and Privacy Policy.',
    de: 'Durch die Erstellung eines Kontos stimmen Sie unseren Nutzungsbedingungen und Datenschutzrichtlinien zu.',
    fr: 'En créant un compte, vous acceptez nos conditions d\'utilisation et notre politique de confidentialité.',
    es: 'Al crear una cuenta, acepta nuestros Términos de servicio y Política de privacidad.',
    it: 'Creando un account, accetti i nostri Termini di servizio e la Politica sulla privacy.'
  },
  toggleMenu: {
    en: 'Toggle Menu',
    de: 'Menü umschalten',
    fr: 'Basculer le menu',
    es: 'Alternar menú',
    it: 'Attiva/disattiva menu'
  },
  
  // Portfolio Dashboard
  investmentPortfolio: {
    en: 'Investment Portfolio',
    de: 'Investmentportfolio',
    fr: 'Portefeuille d\'investissement',
    es: 'Portafolio de inversión',
    it: 'Portafoglio d\'investimento'
  },
  trackYourRealEstateInvestments: {
    en: 'Track and manage your real estate investments',
    de: 'Verfolgen und verwalten Sie Ihre Immobilieninvestitionen',
    fr: 'Suivez et gérez vos investissements immobiliers',
    es: 'Rastree y administre sus inversiones inmobiliarias',
    it: 'Tieni traccia e gestisci i tuoi investimenti immobiliari'
  },
  totalValue: {
    en: 'Total Value',
    de: 'Gesamtwert',
    fr: 'Valeur totale',
    es: 'Valor total',
    it: 'Valore totale'
  },
  cashFlow: {
    en: 'Cash Flow',
    de: 'Cashflow',
    fr: 'Flux de trésorerie',
    es: 'Flujo de caja',
    it: 'Flusso di cassa'
  },
  monthlyCashFlow: {
    en: 'Monthly Cash Flow',
    de: 'Monatlicher Cashflow',
    fr: 'Flux de trésorerie mensuel',
    es: 'Flujo de caja mensual',
    it: 'Flusso di cassa mensile'
  },
  roi: {
    en: 'ROI',
    de: 'ROI',
    fr: 'Retour sur investissement',
    es: 'Retorno de la inversión',
    it: 'ROI'
  },
  annualROI: {
    en: 'Annual ROI (%)',
    de: 'Jährliche Rendite (%)',
    fr: 'Retour sur investissement annuel (%)',
    es: 'ROI anual (%)',
    it: 'ROI annuale (%)'
  },
  properties: {
    en: 'Properties',
    de: 'Immobilien',
    fr: 'Propriétés',
    es: 'Propiedades',
    it: 'Proprietà'
  },
  appreciation: {
    en: 'Appreciation',
    de: 'Wertsteigerung',
    fr: 'Appréciation',
    es: 'Apreciación',
    it: 'Apprezzamento'
  },
  annualAppreciation: {
    en: 'Annual Appreciation (%)',
    de: 'Jährliche Wertsteigerung (%)',
    fr: 'Appréciation annuelle (%)',
    es: 'Apreciación anual (%)',
    it: 'Apprezzamento annuale (%)'
  },
  equity: {
    en: 'Equity',
    de: 'Eigenkapital',
    fr: 'Capitaux propres',
    es: 'Capital',
    it: 'Equità'
  },
  propertyPerformance: {
    en: 'Property Performance',
    de: 'Immobilienperformance',
    fr: 'Performance immobilière',
    es: 'Rendimiento de la propiedad',
    it: 'Performance della proprietà'
  },
  compareYourInvestments: {
    en: 'Compare the performance of your investments',
    de: 'Vergleichen Sie die Performance Ihrer Investitionen',
    fr: 'Comparez la performance de vos investissements',
    es: 'Compare el rendimiento de sus inversiones',
    it: 'Confronta la performance dei tuoi investimenti'
  },
  analytics: {
    en: 'Analytics',
    de: 'Analytik',
    fr: 'Analytique',
    es: 'Analítica',
    it: 'Analisi'
  },
  projections: {
    en: 'Projections',
    de: 'Prognosen',
    fr: 'Projections',
    es: 'Proyecciones',
    it: 'Proiezioni'
  },
  propertyComparison: {
    en: 'Property Comparison',
    de: 'Immobilienvergleich',
    fr: 'Comparaison de propriétés',
    es: 'Comparación de propiedades',
    it: 'Confronto proprietà'
  },
  allocation: {
    en: 'Allocation',
    de: 'Aufteilung',
    fr: 'Allocation',
    es: 'Asignación',
    it: 'Allocazione'
  },
  portfolioProjections: {
    en: 'Portfolio Projections',
    de: 'Portfolio-Prognosen',
    fr: 'Projections de portefeuille',
    es: 'Proyecciones de cartera',
    it: 'Proiezioni di portafoglio'
  },
  simulateYourPortfolioGrowth: {
    en: 'Simulate your portfolio growth over time',
    de: 'Simulieren Sie das Wachstum Ihres Portfolios im Laufe der Zeit',
    fr: 'Simulez la croissance de votre portefeuille au fil du temps',
    es: 'Simule el crecimiento de su cartera a lo largo del tiempo',
    it: 'Simula la crescita del tuo portafoglio nel tempo'
  },
  exportData: {
    en: 'Export Data',
    de: 'Daten exportieren',
    fr: 'Exporter les données',
    es: 'Exportar datos',
    it: 'Esporta dati'
  },
  cashFlowAnalysis: {
    en: 'Cash Flow Analysis',
    de: 'Cashflow-Analyse',
    fr: 'Analyse des flux de trésorerie',
    es: 'Análisis de flujo de caja',
    it: 'Analisi del flusso di cassa'
  },
  cashFlowAnalysisDescription: {
    en: 'In-depth analysis of your cash flow streams from all properties',
    de: 'Eingehende Analyse Ihrer Cashflow-Ströme aus allen Immobilien',
    fr: 'Analyse approfondie de vos flux de trésorerie de toutes les propriétés',
    es: 'Análisis en profundidad de sus flujos de efectivo de todas las propiedades',
    it: 'Analisi approfondita dei tuoi flussi di cassa da tutte le proprietà'
  },
  unlockCashFlowAnalysis: {
    en: 'Unlock Cash Flow Analysis',
    de: 'Cashflow-Analyse freischalten',
    fr: 'Débloquer l\'analyse des flux de trésorerie',
    es: 'Desbloquear el análisis de flujo de caja',
    it: 'Sblocca l\'analisi del flusso di cassa'
  },
  assetAllocation: {
    en: 'Asset Allocation',
    de: 'Vermögensaufteilung',
    fr: 'Répartition des actifs',
    es: 'Asignación de activos',
    it: 'Allocazione degli asset'
  },
  assetAllocationDescription: {
    en: 'See how your capital is distributed across different properties and markets',
    de: 'Sehen Sie, wie Ihr Kapital auf verschiedene Immobilien und Märkte verteilt ist',
    fr: 'Voyez comment votre capital est réparti entre différentes propriétés et marchés',
    es: 'Vea cómo se distribuye su capital entre diferentes propiedades y mercados',
    it: 'Scopri come il tuo capitale è distribuito tra diverse proprietà e mercati'
  },
  unlockAssetAllocation: {
    en: 'Unlock Asset Allocation',
    de: 'Vermögensaufteilung freischalten',
    fr: 'Débloquer la répartition des actifs',
    es: 'Desbloquear la asignación de activos',
    it: 'Sblocca l\'allocazione degli asset'
  },
  enhancedAnalytics: {
    en: 'Enhanced Analytics',
    de: 'Erweiterte Analytik',
    fr: 'Analytique améliorée',
    es: 'Análisis mejorado',
    it: 'Analisi avanzata'
  },
  enhancedAnalyticsDescription: {
    en: 'Unlock detailed performance metrics and ROI analysis for your properties',
    de: 'Schalten Sie detaillierte Performance-Metriken und ROI-Analysen für Ihre Immobilien frei',
    fr: 'Débloquez des mesures de performance détaillées et une analyse du ROI pour vos propriétés',
    es: 'Desbloquee métricas de rendimiento detalladas y análisis de ROI para sus propiedades',
    it: 'Sblocca metriche di performance dettagliate e analisi del ROI per le tue proprietà'
  },
  viewDetailed: {
    en: 'View Detailed',
    de: 'Detaillierte Ansicht',
    fr: 'Voir en détail',
    es: 'Ver detallado',
    it: 'Visualizza dettagliato'
  },
  marketInsights: {
    en: 'Market Insights',
    de: 'Markteinblicke',
    fr: 'Aperçus du marché',
    es: 'Perspectivas del mercado',
    it: 'Approfondimenti di mercato'
  },
  marketInsightsDescription: {
    en: 'Get insights into market trends and property appreciation forecasts',
    de: 'Erhalten Sie Einblicke in Markttrends und Prognosen zur Immobilienwertsteigerung',
    fr: 'Obtenez des informations sur les tendances du marché et les prévisions d\'appréciation immobilière',
    es: 'Obtenga información sobre las tendencias del mercado y las previsiones de apreciación de la propiedad',
    it: 'Ottieni approfondimenti sulle tendenze del mercato e le previsioni di apprezzamento degli immobili'
  },
  connectMarketData: {
    en: 'Connect Market Data',
    de: 'Marktdaten verbinden',
    fr: 'Connecter les données du marché',
    es: 'Conectar datos del mercado',
    it: 'Collega i dati di mercato'
  },
  featureNotification: {
    en: 'Feature Notification',
    de: 'Funktionsbenachrichtigung',
    fr: 'Notification de fonctionnalité',
    es: 'Notificación de función',
    it: 'Notifica di funzionalità'
  },
  featureComingSoon: {
    en: 'feature is coming soon!',
    de: 'Funktion kommt bald!',
    fr: 'la fonctionnalité arrive bientôt !',
    es: '¡la función estará disponible pronto!',
    it: 'la funzionalità è in arrivo!'
  },
  testAutomation: {
    en: 'Test Automation',
    de: 'Testautomatisierung',
    fr: 'Automatisation des tests',
    es: 'Automatización de pruebas',
    it: 'Automazione dei test'
  },
  
  // Investment Metrics
  investorMetrics: {
    en: 'Investor Metrics',
    de: 'Anleger-Kennzahlen',
    fr: 'Métriques d\'investisseur',
    es: 'Métricas de inversor',
    it: 'Metriche dell\'investitore'
  },
  keyPerformanceIndicators: {
    en: 'Key performance indicators for your investments',
    de: 'Wichtige Leistungsindikatoren für Ihre Investitionen',
    fr: 'Indicateurs clés de performance pour vos investissements',
    es: 'Indicadores clave de rendimiento para sus inversiones',
    it: 'Indicatori chiave di performance per i tuoi investimenti'
  },
  exportMetrics: {
    en: 'Export Metrics',
    de: 'Metriken exportieren',
    fr: 'Exporter les métriques',
    es: 'Exportar métricas',
    it: 'Esporta metriche'
  },
  capRate: {
    en: 'Cap Rate',
    de: 'Kapitalisierungsrate',
    fr: 'Taux de capitalisation',
    es: 'Tasa de capitalización',
    it: 'Tasso di capitalizzazione'
  },
  netIncomeDividedByValue: {
    en: 'Net income divided by property value',
    de: 'Nettoeinkommen geteilt durch Immobilienwert',
    fr: 'Revenu net divisé par la valeur de la propriété',
    es: 'Ingreso neto dividido por el valor de la propiedad',
    it: 'Reddito netto diviso per il valore della proprietà'
  },
  cashOnCash: {
    en: 'Cash on Cash',
    de: 'Cash-on-Cash-Rendite',
    fr: 'Cash sur Cash',
    es: 'Efectivo sobre efectivo',
    it: 'Cash on Cash'
  },
  annualCashFlowDividedByInvestment: {
    en: 'Annual cash flow divided by investment',
    de: 'Jährlicher Cashflow geteilt durch Investition',
    fr: 'Flux de trésorerie annuel divisé par l\'investissement',
    es: 'Flujo de caja anual dividido por la inversión',
    it: 'Flusso di cassa annuale diviso per l\'investimento'
  },
  debtServiceCoverage: {
    en: 'Debt Service Coverage',
    de: 'Schuldendienstdeckung',
    fr: 'Couverture du service de la dette',
    es: 'Cobertura del servicio de la deuda',
    it: 'Copertura del servizio del debito'
  },
  netOperatingIncomeToDebtRatio: {
    en: 'Net operating income to debt ratio',
    de: 'Verhältnis von Nettobetriebseinnahmen zu Schulden',
    fr: 'Ratio du revenu net d\'exploitation à la dette',
    es: 'Relación entre el ingreso operativo neto y la deuda',
    it: 'Rapporto tra reddito operativo netto e debito'
  },
  breakEvenOccupancy: {
    en: 'Break-Even Occupancy',
    de: 'Break-Even-Belegung',
    fr: 'Taux d\'occupation au seuil de rentabilité',
    es: 'Ocupación de equilibrio',
    it: 'Occupazione di pareggio'
  },
  minimumOccupancyToBreakEven: {
    en: 'Minimum occupancy rate to break even',
    de: 'Mindestbelegungsrate, um die Gewinnschwelle zu erreichen',
    fr: 'Taux d\'occupation minimum pour atteindre le seuil de rentabilité',
    es: 'Tasa de ocupación mínima para alcanzar el punto de equilibrio',
    it: 'Tasso di occupazione minimo per raggiungere il punto di pareggio'
  },
  
  // Security-related translations
  enhancedSecurity: {
    en: 'Enhanced Security',
    de: 'Verbesserte Sicherheit',
    fr: 'Sécurité renforcée',
    es: 'Seguridad mejorada',
    it: 'Sicurezza avanzata'
  },
  securitySettings: {
    en: 'Security Settings',
    de: 'Sicherheitseinstellungen',
    fr: 'Paramètres de sécurité',
    es: 'Configuración de seguridad',
    it: 'Impostazioni di sicurezza'
  },
  twoFactorAuthentication: {
    en: 'Two-Factor Authentication',
    de: 'Zwei-Faktor-Authentifizierung',
    fr: 'Authentification à deux facteurs',
    es: 'Autenticación de dos factores',
    it: 'Autenticazione a due fattori'
  },
  enableFaceId: {
    en: 'Enable Face ID',
    de: 'Face ID aktivieren',
    fr: 'Activer Face ID',
    es: 'Habilitar Face ID',
    it: 'Abilita Face ID'
  },
  setupPin: {
    en: 'Set up PIN',
    de: 'PIN einrichten',
    fr: 'Configurer un code PIN',
    es: 'Configurar PIN',
    it: 'Imposta PIN'
  },
  passwordRequirements: {
    en: 'Password Requirements',
    de: 'Passwortanforderungen',
    fr: 'Exigences de mot de passe',
    es: 'Requisitos de contraseña',
    it: 'Requisiti password'
  },
  passwordLength: {
    en: 'Password must be at least 8 characters',
    de: 'Passwort muss mindestens 8 Zeichen lang sein',
    fr: 'Le mot de passe doit comporter au moins 8 caractères',
    es: 'La contraseña debe tener al menos 8 caracteres',
    it: 'La password deve contenere almeno 8 caratteri'
  },
  passwordStrength: {
    en: 'Password Strength',
    de: 'Passwortstärke',
    fr: 'Force du mot de passe',
    es: 'Fortaleza de la contraseña',
    it: 'Robustezza della password'
  },
  weak: {
    en: 'Weak',
    de: 'Schwach',
    fr: 'Faible',
    es: 'Débil',
    it: 'Debole'
  },
  medium: {
    en: 'Medium',
    de: 'Mittel',
    fr: 'Moyen',
    es: 'Media',
    it: 'Media'
  },
  strong: {
    en: 'Strong',
    de: 'Stark',
    fr: 'Fort',
    es: 'Fuerte',
    it: 'Forte'
  },
  accountSettings: {
    en: 'Account Settings',
    de: 'Kontoeinstellungen',
    fr: 'Paramètres du compte',
    es: 'Configuración de la cuenta',
    it: 'Impostazioni account'
  },
  updateProfile: {
    en: 'Update Profile',
    de: 'Profil aktualisieren',
    fr: 'Mettre à jour le profil',
    es: 'Actualizar perfil',
    it: 'Aggiorna profilo'
  },
  deleteAccount: {
    en: 'Delete Account',
    de: 'Konto löschen',
    fr: 'Supprimer le compte',
    es: 'Eliminar cuenta',
    it: 'Elimina account'
  },
  confirmDeleteAccount: {
    en: 'Are you sure you want to delete your account? This action cannot be undone.',
    de: 'Sind Sie sicher, dass Sie Ihr Konto löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.',
    fr: 'Êtes-vous sûr de vouloir supprimer votre compte? Cette action ne peut pas être annulée.',
    es: '¿Está seguro de que desea eliminar su cuenta? Esta acción no se puede deshacer.',
    it: 'Sei sicuro di voler eliminare il tuo account? Questa azione non può essere annullata.'
  },
  dataPrivacy: {
    en: 'Data Privacy',
    de: 'Datenschutz',
    fr: 'Confidentialité des données',
    es: 'Privacidad de datos',
    it: 'Privacy dei dati'
  },
  pleaseCompleteAllFields: {
    en: 'Please complete all fields',
    de: 'Bitte füllen Sie alle Felder aus',
    fr: 'Veuillez remplir tous les champs',
    es: 'Por favor, complete todos los campos',
    it: 'Si prega di compilare tutti i campi'
  },
  passwordsDoNotMatch: {
    en: 'Passwords do not match',
    de: 'Passwörter stimmen nicht überein',
    fr: 'Les mots de passe ne correspondent pas',
    es: 'Las contraseñas no coinciden',
    it: 'Le password non corrispondono'
  },
  passwordTooShort: {
    en: 'Password must be at least 8 characters',
    de: 'Passwort muss mindestens 8 Zeichen haben',
    fr: 'Le mot de passe doit comporter au moins 8 caractères',
    es: 'La contraseña debe tener al menos 8 caracteres',
    it: 'La password deve contenere almeno 8 caratteri'
  },
  pleaseEnterEmailAndPassword: {
    en: 'Please enter your email and password',
    de: 'Bitte geben Sie Ihre E-Mail und Ihr Passwort ein',
    fr: 'Veuillez entrer votre email et votre mot de passe',
    es: 'Por favor, introduzca su correo electrónico y su contraseña',
    it: 'Si prega di inserire la tua email e password'
  },
  invalidEmailOrPassword: {
    en: 'Invalid email or password',
    de: 'Ungültige E-Mail oder Passwort',
    fr: 'Email ou mot de passe invalide',
    es: 'Correo electrónico o contraseña inválidos',
    it: 'Email o password non validi'
  },
  somethingWentWrong: {
    en: 'Something went wrong',
    de: 'Etwas ist schief gelaufen',
    fr: 'Quelque chose s\'est mal passé',
    es: 'Algo salió mal',
    it: 'Qualcosa è andato storto'
  },
  loginSuccessful: {
    en: 'Login successful',
    de: 'Anmeldung erfolgreich',
    fr: 'Connexion réussie',
    es: 'Inicio de sesión exitoso',
    it: 'Accesso effettuato con successo'
  },
  registrationSuccessful: {
    en: 'Registration successful',
    de: 'Registrierung erfolgreich',
    fr: 'Inscription réussie',
    es: 'Registro exitoso',
    it: 'Registrazione avvenuta con successo'
  },
  registrationFailed: {
    en: 'Registration failed',
    de: 'Registrierung fehlgeschlagen',
    fr: 'L\'inscription a échoué',
    es: 'Error al registrarse',
    it: 'Registrazione fallita'
  },
  error: {
    en: 'Error',
    de: 'Fehler',
    fr: 'Erreur',
    es: 'Error',
    it: 'Errore'
  },
  success: {
    en: 'Success',
    de: 'Erfolg',
    fr: 'Succès',
    es: 'Éxito',
    it: 'Successo'
  },
  loggedOutSuccessfully: {
    en: 'Logged out successfully',
    de: 'Erfolgreich abgemeldet',
    fr: 'Déconnexion réussie',
    es: 'Cerrado sesión con éxito',
    it: 'Disconnesso con successo'
  },
  adminAccount: {
    en: 'Admin Account',
    de: 'Administrator-Konto',
    fr: 'Compte administrateur',
    es: 'Cuenta de administrador',
    it: 'Account amministratore'
  },
  hidePassword: {
    en: 'Hide Password',
    de: 'Passwort ausblenden',
    fr: 'Masquer le mot de passe',
    es: 'Ocultar contraseña',
    it: 'Nascondi password'
  },
  showPassword: {
    en: 'Show Password',
    de: 'Passwort anzeigen',
    fr: 'Afficher le mot de passe',
    es: 'Mostrar contraseña',
    it: 'Mostra password'
  },
  
  // Portfolio Dashboard
  investmentPortfolio: {
    en: 'Investment Portfolio',
    de: 'Investmentportfolio',
    fr: 'Portefeuille d\'investissement',
    es: 'Portafolio de inversión',
    it: 'Portafoglio d\'investimento'
  },
  trackYourRealEstateInvestments: {
    en: 'Track and manage your real estate investments',
    de: 'Verfolgen und verwalten Sie Ihre Immobilieninvestitionen',
    fr: 'Suivez et gérez vos investissements immobiliers',
    es: 'Rastree y administre sus inversiones inmobiliarias',
    it: 'Tieni traccia e gestisci i tuoi investimenti immobiliari'
  },
  totalValue: {
    en: 'Total Value',
    de: 'Gesamtwert',
    fr: 'Valeur totale',
    es: 'Valor total',
    it: 'Valore totale'
  },
  cashFlow: {
    en: 'Cash Flow',
    de: 'Cashflow',
    fr: 'Flux de trésorerie',
    es: 'Flujo de caja',
    it: 'Flusso di cassa'
  },
  monthlyCashFlow: {
    en: 'Monthly Cash Flow',
    de: 'Monatlicher Cashflow',
    fr: 'Flux de trésorerie mensuel',
    es: 'Flujo de caja mensual',
    it: 'Flusso di cassa mensile'
  },
  roi: {
    en: 'ROI',
    de: 'ROI',
    fr: 'Retour sur investissement',
    es: 'Retorno de la inversión',
    it: 'ROI'
  },
  annualROI: {
    en: 'Annual ROI (%)',
    de: 'Jährliche Rendite (%)',
    fr: 'Retour sur investissement annuel (%)',
    es: 'ROI anual (%)',
    it: 'ROI annuale (%)'
  },
  properties: {
    en: 'Properties',
    de: 'Immobilien',
    fr: 'Propriétés',
    es: 'Propiedades',
    it: 'Proprietà'
  },
  appreciation: {
    en: 'Appreciation',
    de: 'Wertsteigerung',
    fr: 'Appréciation',
    es: 'Apreciación',
    it: 'Apprezzamento'
  },
  annualAppreciation: {
    en: 'Annual Appreciation (%)',
    de: 'Jährliche Wertsteigerung (%)',
    fr: 'Appréciation annuelle (%)',
    es: 'Apreciación anual (%)',
    it: 'Apprezzamento annuale (%)'
  },
  equity: {
    en: 'Equity',
    de: 'Eigenkapital',
    fr: 'Capitaux propres',
    es: 'Capital',
    it: 'Equità'
  },
  propertyPerformance: {
    en: 'Property Performance',
    de: 'Immobilienperformance',
    fr: 'Performance immobilière',
    es: 'Rendimiento de la propiedad',
    it: 'Performance della proprietà'
  },
  compareYourInvestments: {
    en: 'Compare the performance of your investments',
    de: 'Vergleichen Sie die Performance Ihrer Investitionen',
    fr: 'Comparez la performance de vos investissements',
    es: 'Compare el rendimiento de sus inversiones',
    it: 'Confronta la performance dei tuoi investimenti'
  },
  analytics: {
    en: 'Analytics',
    de: 'Analytik',
    fr: 'Analytique',
    es: 'Analítica',
    it: 'Analisi'
  },
  projections: {
    en: 'Projections',
    de: 'Prognosen',
    fr: 'Projections',
    es: 'Proyecciones',
    it: 'Proiezioni'
  },
  propertyComparison: {
    en: 'Property Comparison',
    de: 'Immobilienvergleich',
    fr: 'Comparaison de propriétés',
    es: 'Comparación de propiedades',
    it: 'Confronto proprietà'
  },
  allocation: {
    en: 'Allocation',
    de: 'Aufteilung',
    fr: 'Allocation',
    es: 'Asignación',
    it: 'Allocazione'
  },
  portfolioProjections: {
    en: 'Portfolio Projections',
    de: 'Portfolio-Prognosen',
    fr: 'Projections de portefeuille',
    es: 'Proyecciones de cartera',
    it: 'Proiezioni di portafoglio'
  },
  simulateYourPortfolioGrowth: {
    en: 'Simulate your portfolio growth over time',
    de: 'Simulieren Sie das Wachstum Ihres Portfolios im Laufe der Zeit',
    fr: 'Simulez la croissance de votre portefeuille au fil du temps',
    es: 'Simule el crecimiento de su cartera a lo largo del tiempo',
    it: 'Simula la crescita del tuo portafoglio nel tempo'
  },
  exportData: {
    en: 'Export Data',
    de: 'Daten exportieren',
    fr: 'Exporter les données',
    es: 'Exportar datos',
    it: 'Esporta dati'
  },
  cashFlowAnalysis: {
    en: 'Cash Flow Analysis',
    de: 'Cashflow-Analyse',
    fr: 'Analyse des flux de trésorerie',
    es: 'Análisis de flujo de caja',
    it: 'Analisi del flusso di cassa'
  },
  cashFlowAnalysisDescription: {
    en: 'In-depth analysis of your cash flow streams from all properties',
    de: 'Eingehende Analyse Ihrer Cashflow-Ströme aus allen Immobilien',
    fr: 'Analyse approfondie de vos flux de trésorerie de toutes les propriétés',
    es: 'Análisis en profundidad de sus flujos de efectivo de todas las propiedades',
    it: 'Analisi approfondita dei tuoi flussi di cassa da tutte le proprietà'
  },
  unlockCashFlowAnalysis: {
    en: 'Unlock Cash Flow Analysis',
