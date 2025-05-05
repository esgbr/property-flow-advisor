
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUserPreferences } from './UserPreferencesContext';

// Define all available languages
export const AVAILABLE_LANGUAGES = ['en', 'de', 'fr', 'es'];

// Define translation interface
interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

// Default translations
const translations: Translations = {
  'en': {
    'propertyFlow': 'PropertyFlow',
    'investmentPlatform': 'Real Estate Investment Platform',
    'dashboard': 'Dashboard',
    'properties': 'Properties',
    'analytics': 'Analytics',
    'settings': 'Settings',
    'darkMode': 'Dark Mode',
    'welcome': 'Welcome',
    'market': 'Market',
    'experience': 'Experience',
    'goals': 'Goals',
    'portfolio': 'Portfolio',
    'propertyDetails': 'Property Details',
    'financials': 'Financials',
    'documents': 'Documents',
    'schedule': 'Schedule',
    'location': 'Location',
    'refurbishment': 'Refurbishment',
    'back': 'Back',
    'save': 'Save',
    'cancel': 'Cancel',
    'delete': 'Delete',
    'address': 'Address',
    'purchasePrice': 'Purchase Price',
    'purchaseDate': 'Purchase Date',
    'propertyType': 'Property Type',
    'residential': 'Residential',
    'commercial': 'Commercial',
    'industrial': 'Industrial',
    'land': 'Land',
    'vacationRental': 'Vacation Rental',
    'bedrooms': 'Bedrooms',
    'bathrooms': 'Bathrooms',
    'squareFootage': 'Square Footage',
    'yearBuilt': 'Year Built',
    'currentValue': 'Current Value',
    'monthlyRent': 'Monthly Rent',
    'mortgagePayment': 'Mortgage Payment',
    'propertyTax': 'Property Tax',
    'insurance': 'Insurance',
    'maintenance': 'Maintenance',
    'utilities': 'Utilities',
    'propertyManager': 'Property Manager',
    'languageSettings': 'Language Settings',
    'chooseLanguage': 'Choose Language',
    'saveLanguage': 'Save Language',
    'english': 'English',
    'german': 'German',
    'french': 'French',
    'spanish': 'Spanish',
    'theme': 'Theme',
    'light': 'Light',
    'dark': 'Dark',
    'system': 'System',
    'notifications': 'Notifications',
    'emailNotifications': 'Email Notifications',
    'pushNotifications': 'Push Notifications',
    'alerts': 'Alerts',
    'priceDropAlerts': 'Price Drop Alerts',
    'foreclosureAlerts': 'Foreclosure Alerts',
    'newListingAlerts': 'New Listing Alerts',
    'logOut': 'Log Out',
    'deleteAccount': 'Delete Account',
    'profileSettings': 'Profile Settings',
    'name': 'Name',
    'email': 'Email',
    'phone': 'Phone',
    'changePassword': 'Change Password',
    'currentPassword': 'Current Password',
    'newPassword': 'New Password',
    'confirmPassword': 'Confirm Password',
    'updateProfile': 'Update Profile',
    'onboarding': 'Onboarding',
    'welcomeToPropertyFlow': 'Welcome to PropertyFlow',
    'getStarted': 'Get Started',
    'letUsKnowAboutYou': 'Let us know about you',
    'whatsYourName': 'What\'s your name?',
    'enterYourName': 'Enter your name',
    'selectInvestmentMarket': 'Select your investment market',
    'whatsYourExperienceLevel': 'What\'s your experience level?',
    'selectInvestmentGoals': 'Select your investment goals',
    'selectPreferredPropertyTypes': 'Select your preferred property types',
    'continue': 'Continue',
    'skip': 'Skip',
    'next': 'Next',
    'previous': 'Previous',
    'finish': 'Finish',
    'complete': 'Complete',
    'beginner': 'Beginner',
    'intermediate': 'Intermediate',
    'advanced': 'Advanced',
    'expert': 'Expert',
    'passiveIncome': 'Passive Income',
    'capitalGrowth': 'Capital Growth',
    'portfolioDiversification': 'Portfolio Diversification',
    'taxBenefits': 'Tax Benefits',
    'profileCompleted': 'Profile Completed!',
    'weveCustomizedYourExperience': 'We\'ve customized your experience based on your preferences.',
    'exploreProperties': 'Explore Properties',
    'accessibilitySettings': 'Accessibility Settings',
    'reduceMotion': 'Reduce Motion',
    'highContrast': 'High Contrast',
    'largeText': 'Large Text',
    'screenReader': 'Screen Reader Support',
    'skipToContent': 'Skip to content',
    'toggleMenu': 'Toggle Menu',
    'home': 'Home',
    'portfolioAnalytics': 'Portfolio Analytics',
    'trackYourInvestmentPerformance': 'Track your investment performance',
    'performance': 'Performance',
    'distribution': 'Distribution',
    'cashflow': 'Cash Flow',
    'totalValue': 'Total Value',
    'averageValue': 'Average Value',
    'averageROI': 'Average ROI',
    'income': 'Income',
    'expenses': 'Expenses',
    'portfolioInsights': 'Portfolio Insights',
    'getAIRecommendationsBasedOnYourPortfolio': 'Get AI recommendations based on your portfolio',
    'testAutomation': 'Test Automation',
    'runTests': 'Run Tests',
    'adminOnly': 'Admin Only',
    // Auth translations
    'login': 'Login',
    'loggingIn': 'Logging in...',
    'enterYourCredentialsToLogin': 'Enter your credentials to login',
    'password': 'Password',
    'pleaseEnterEmailAndPassword': 'Please enter email and password',
    'invalidEmailOrPassword': 'Invalid email or password',
    'loginSuccessful': 'Login successful',
    'somethingWentWrong': 'Something went wrong',
    'createAccount': 'Create Account',
    'enterYourDetailsToRegister': 'Enter your details to register',
    'creating': 'Creating...',
    'dontHaveAccount': 'Don\'t have an account?',
    'register': 'Register',
    'alreadyHaveAccount': 'Already have an account?',
    'loginDisclaimer': 'By logging in, you agree to our Terms of Service and Privacy Policy.',
    'registrationDisclaimer': 'By registering, you agree to our Terms of Service and Privacy Policy.',
    'useFaceId': 'Use Face ID',
    'biometricLoginSuccessful': 'Biometric login successful',
    'biometricAuthFailed': 'Biometric authentication failed',
    'showPassword': 'Show password',
    'hidePassword': 'Hide password',
    'pleaseCompleteAllFields': 'Please complete all fields',
    'passwordsDoNotMatch': 'Passwords do not match',
    'passwordTooShort': 'Password must be at least 8 characters',
    'registrationSuccessful': 'Registration successful',
    'registrationFailed': 'Registration failed',
    'account': 'Account',
    'adminAccount': 'Administrator Account',
    'logout': 'Logout',
    'loggedOutSuccessfully': 'Logged out successfully',
    'success': 'Success',
    'error': 'Error',
    'securityAlert': 'Security Alert',
    'securityAlertDescription': 'Add a PIN or biometric protection to secure your account.',
    'setupPIN': 'Setup PIN',
    'dismiss': 'Dismiss',
    'securityEnabled': 'Security Enabled',
    'securityEnabledDescription': 'Your account is protected by a PIN or biometric security.'
  },
  'de': {
    'propertyFlow': 'PropertyFlow',
    'investmentPlatform': 'Immobilien-Investment-Plattform',
    'dashboard': 'Dashboard',
    'properties': 'Immobilien',
    'analytics': 'Analytik',
    'settings': 'Einstellungen',
    'darkMode': 'Dunkelmodus',
    'welcome': 'Willkommen',
    'market': 'Markt',
    'experience': 'Erfahrung',
    'goals': 'Ziele',
    'portfolio': 'Portfolio',
    'propertyDetails': 'Immobiliendetails',
    'financials': 'Finanzen',
    'documents': 'Dokumente',
    'schedule': 'Zeitplan',
    'location': 'Standort',
    'refurbishment': 'Renovierung',
    'back': 'Zurück',
    'save': 'Speichern',
    'cancel': 'Abbrechen',
    'delete': 'Löschen',
    'address': 'Adresse',
    'purchasePrice': 'Kaufpreis',
    'purchaseDate': 'Kaufdatum',
    'propertyType': 'Immobilientyp',
    'residential': 'Wohnobjekt',
    'commercial': 'Gewerbeimmobilie',
    'industrial': 'Industrieimmobilie',
    'land': 'Grundstück',
    'vacationRental': 'Ferienimmobilie',
    'bedrooms': 'Schlafzimmer',
    'bathrooms': 'Badezimmer',
    'squareFootage': 'Quadratmeter',
    'yearBuilt': 'Baujahr',
    'currentValue': 'Aktueller Wert',
    'monthlyRent': 'Monatliche Miete',
    'mortgagePayment': 'Hypothekenzahlung',
    'propertyTax': 'Grundsteuer',
    'insurance': 'Versicherung',
    'maintenance': 'Instandhaltung',
    'utilities': 'Nebenkosten',
    'propertyManager': 'Hausverwaltung',
    'languageSettings': 'Spracheinstellungen',
    'chooseLanguage': 'Sprache wählen',
    'saveLanguage': 'Sprache speichern',
    'english': 'Englisch',
    'german': 'Deutsch',
    'french': 'Französisch',
    'spanish': 'Spanisch',
    'theme': 'Thema',
    'light': 'Hell',
    'dark': 'Dunkel',
    'system': 'System',
    'notifications': 'Benachrichtigungen',
    'emailNotifications': 'E-Mail-Benachrichtigungen',
    'pushNotifications': 'Push-Benachrichtigungen',
    'alerts': 'Warnungen',
    'priceDropAlerts': 'Preissenkungswarnungen',
    'foreclosureAlerts': 'Zwangsversteigerungswarnungen',
    'newListingAlerts': 'Neue Angebotswarnungen',
    'logOut': 'Abmelden',
    'deleteAccount': 'Konto löschen',
    'profileSettings': 'Profileinstellungen',
    'name': 'Name',
    'email': 'E-Mail',
    'phone': 'Telefon',
    'changePassword': 'Passwort ändern',
    'currentPassword': 'Aktuelles Passwort',
    'newPassword': 'Neues Passwort',
    'confirmPassword': 'Passwort bestätigen',
    'updateProfile': 'Profil aktualisieren',
    'onboarding': 'Einführung',
    'welcomeToPropertyFlow': 'Willkommen bei PropertyFlow',
    'getStarted': 'Erste Schritte',
    'letUsKnowAboutYou': 'Erzählen Sie uns von Ihnen',
    'whatsYourName': 'Wie ist Ihr Name?',
    'enterYourName': 'Geben Sie Ihren Namen ein',
    'selectInvestmentMarket': 'Wählen Sie Ihren Investmentmarkt',
    'whatsYourExperienceLevel': 'Wie ist Ihr Erfahrungsniveau?',
    'selectInvestmentGoals': 'Wählen Sie Ihre Investitionsziele',
    'selectPreferredPropertyTypes': 'Wählen Sie Ihre bevorzugten Immobilientypen',
    'continue': 'Fortfahren',
    'skip': 'Überspringen',
    'next': 'Weiter',
    'previous': 'Zurück',
    'finish': 'Abschließen',
    'complete': 'Abschließen',
    'beginner': 'Anfänger',
    'intermediate': 'Fortgeschritten',
    'advanced': 'Erfahren',
    'expert': 'Experte',
    'passiveIncome': 'Passives Einkommen',
    'capitalGrowth': 'Kapitalwachstum',
    'portfolioDiversification': 'Portfolio-Diversifikation',
    'taxBenefits': 'Steuervorteile',
    'profileCompleted': 'Profil abgeschlossen!',
    'weveCustomizedYourExperience': 'Wir haben Ihre Erfahrung basierend auf Ihren Präferenzen angepasst.',
    'exploreProperties': 'Immobilien erkunden',
    'accessibilitySettings': 'Zugänglichkeitseinstellungen',
    'reduceMotion': 'Bewegungen reduzieren',
    'highContrast': 'Hoher Kontrast',
    'largeText': 'Großer Text',
    'screenReader': 'Screenreader-Unterstützung',
    'skipToContent': 'Zum Inhalt springen',
    'toggleMenu': 'Menü umschalten',
    'home': 'Startseite',
    'portfolioAnalytics': 'Portfolio-Analytik',
    'trackYourInvestmentPerformance': 'Verfolgen Sie Ihre Investitionsperformance',
    'performance': 'Leistung',
    'distribution': 'Verteilung',
    'cashflow': 'Cashflow',
    'totalValue': 'Gesamtwert',
    'averageValue': 'Durchschnittswert',
    'averageROI': 'Durchschnittliche Rendite',
    'income': 'Einkommen',
    'expenses': 'Ausgaben',
    'portfolioInsights': 'Portfolio-Einblicke',
    'getAIRecommendationsBasedOnYourPortfolio': 'Erhalten Sie KI-Empfehlungen basierend auf Ihrem Portfolio',
    'testAutomation': 'Testautomatisierung',
    'runTests': 'Tests ausführen',
    'adminOnly': 'Nur Admin',
    // Auth translations in German
    'login': 'Anmelden',
    'loggingIn': 'Anmeldung läuft...',
    'enterYourCredentialsToLogin': 'Geben Sie Ihre Anmeldedaten ein',
    'password': 'Passwort',
    'pleaseEnterEmailAndPassword': 'Bitte E-Mail und Passwort eingeben',
    'invalidEmailOrPassword': 'Ungültige E-Mail oder Passwort',
    'loginSuccessful': 'Anmeldung erfolgreich',
    'somethingWentWrong': 'Etwas ist schief gelaufen',
    'createAccount': 'Konto erstellen',
    'enterYourDetailsToRegister': 'Geben Sie Ihre Daten zur Registrierung ein',
    'creating': 'Erstelle...',
    'dontHaveAccount': 'Haben Sie kein Konto?',
    'register': 'Registrieren',
    'alreadyHaveAccount': 'Haben Sie bereits ein Konto?',
    'loginDisclaimer': 'Durch die Anmeldung stimmen Sie unseren Nutzungsbedingungen und Datenschutzrichtlinien zu.',
    'registrationDisclaimer': 'Durch die Registrierung stimmen Sie unseren Nutzungsbedingungen und Datenschutzrichtlinien zu.',
    'useFaceId': 'Face ID verwenden',
    'biometricLoginSuccessful': 'Biometrische Anmeldung erfolgreich',
    'biometricAuthFailed': 'Biometrische Authentifizierung fehlgeschlagen',
    'showPassword': 'Passwort anzeigen',
    'hidePassword': 'Passwort verbergen',
    'pleaseCompleteAllFields': 'Bitte füllen Sie alle Felder aus',
    'passwordsDoNotMatch': 'Passwörter stimmen nicht überein',
    'passwordTooShort': 'Passwort muss mindestens 8 Zeichen lang sein',
    'registrationSuccessful': 'Registrierung erfolgreich',
    'registrationFailed': 'Registrierung fehlgeschlagen',
    'account': 'Konto',
    'adminAccount': 'Administrator-Konto',
    'logout': 'Abmelden',
    'loggedOutSuccessfully': 'Erfolgreich abgemeldet',
    'success': 'Erfolg',
    'error': 'Fehler',
    'securityAlert': 'Sicherheitswarnung',
    'securityAlertDescription': 'Fügen Sie eine PIN oder biometrischen Schutz hinzu, um Ihr Konto zu sichern.',
    'setupPIN': 'PIN einrichten',
    'dismiss': 'Ablehnen',
    'securityEnabled': 'Sicherheit aktiviert',
    'securityEnabledDescription': 'Ihr Konto ist durch eine PIN oder biometrische Sicherheit geschützt.'
  }
};

// Add additional languages as needed

// Define the context type
interface LanguageContextType {
  language: string;
  t: (key: string) => string;
  setLanguage: (lang: string) => void;
  isRightToLeft: boolean;
}

// Create the context
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  t: (key: string) => key,
  setLanguage: () => {},
  isRightToLeft: false
});

interface LanguageProviderProps {
  children: React.ReactNode;
}

// Create the provider component
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { preferences, updatePreferences } = useUserPreferences();
  
  // Get default language from preferences or fallback to browser language
  const getBrowserLanguage = () => {
    const browserLang = navigator.language.split('-')[0];
    return AVAILABLE_LANGUAGES.includes(browserLang) ? browserLang : 'en';
  };
  
  const [language, setLanguageState] = useState<string>(
    preferences.language || getBrowserLanguage()
  );
  
  // RTL languages (add here if we support any)
  const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
  const isRightToLeft = rtlLanguages.includes(language);
  
  // Update language in preferences when changed
  useEffect(() => {
    if (preferences.language !== language) {
      updatePreferences({ ...preferences, language });
    }
    
    // Set HTML dir attribute for RTL support
    document.documentElement.dir = isRightToLeft ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, preferences, updatePreferences, isRightToLeft]);
  
  // Translation function
  const t = (key: string): string => {
    // Check if the key exists for the current language
    if (translations[language] && translations[language][key]) {
      return translations[language][key];
    }
    
    // Fallback to English
    if (translations['en'] && translations['en'][key]) {
      return translations['en'][key];
    }
    
    // Return the key if no translation found
    return key;
  };
  
  // Set language with validation
  const setLanguage = (lang: string) => {
    if (AVAILABLE_LANGUAGES.includes(lang)) {
      setLanguageState(lang);
    } else {
      console.warn(`Language ${lang} is not supported. Fallback to English.`);
      setLanguageState('en');
    }
  };
  
  return (
    <LanguageContext.Provider value={{ language, t, setLanguage, isRightToLeft }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
