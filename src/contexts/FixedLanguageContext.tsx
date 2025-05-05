
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUserPreferences } from './UserPreferencesContext';
import { detectBrowserLanguage, isLanguageSupported, getBestMatchLanguage } from '@/utils/languageDetector';

// Definiere verfügbare Sprachen
export type SupportedLanguage = 'en' | 'de' | 'fr' | 'es' | 'it';

// Sprachinfo-Interface
export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  flag: string;
  enabled: boolean;
  nativeName: string;
}

// Verfügbare Sprachen in der Anwendung mit Deutsch als erste Option
export const availableLanguages: LanguageInfo[] = [
  { code: 'de', name: 'German', flag: '🇩🇪', enabled: true, nativeName: 'Deutsch' },
  { code: 'en', name: 'English', flag: '🇬🇧', enabled: true, nativeName: 'English' },
  { code: 'fr', name: 'French', flag: '🇫🇷', enabled: true, nativeName: 'Français' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', enabled: false, nativeName: 'Español' },
  { code: 'it', name: 'Italian', flag: '🇮🇹', enabled: false, nativeName: 'Italiano' }
];

// Übersetzungswörterbuch-Typ
type TranslationDictionary = Record<string, Record<string, string>>;

// Überarbeitete Übersetzungen
const translationDictionary: TranslationDictionary = {
  // Allgemeine Benutzeroberfläche
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
  
  // Anwendungssperr-Funktionalität
  appLocked: {
    en: 'App Locked',
    de: 'App gesperrt',
    fr: 'Application verrouillée',
    es: 'Aplicación bloqueada',
    it: 'App bloccata'
  },
  enterPINToUnlock: {
    en: 'Enter your PIN to unlock',
    de: 'Geben Sie Ihre PIN zum Entsperren ein',
    fr: 'Entrez votre code PIN pour déverrouiller',
    es: 'Introduzca su PIN para desbloquear',
    it: 'Inserisci il PIN per sbloccare'
  },
  unlock: {
    en: 'Unlock',
    de: 'Entsperren',
    fr: 'Déverrouiller',
    es: 'Desbloquear',
    it: 'Sblocca'
  },
  useFaceId: {
    en: 'Use Face ID',
    de: 'Face ID verwenden',
    fr: 'Utiliser Face ID',
    es: 'Usar Face ID',
    it: 'Usa Face ID'
  },
  verifying: {
    en: 'Verifying...',
    de: 'Überprüfung...',
    fr: 'Vérification...',
    es: 'Verificando...',
    it: 'Verifica in corso...'
  },
  appUnlocked: {
    en: 'App Unlocked',
    de: 'App entsperrt',
    fr: 'Application déverrouillée',
    es: 'Aplicación desbloqueada',
    it: 'App sbloccata'
  },
  welcomeBack: {
    en: 'Welcome back!',
    de: 'Willkommen zurück!',
    fr: 'Bienvenue à nouveau!',
    es: '¡Bienvenido de nuevo!',
    it: 'Bentornato!'
  },
  invalidPIN: {
    en: 'Invalid PIN',
    de: 'Ungültige PIN',
    fr: 'Code PIN invalide',
    es: 'PIN no válido',
    it: 'PIN non valido'
  },
  faceIdFailed: {
    en: 'Face ID verification failed',
    de: 'Face ID-Überprüfung fehlgeschlagen',
    fr: 'La vérification Face ID a échoué',
    es: 'La verificación de Face ID falló',
    it: 'Verifica Face ID fallita'
  },
  
  // Einstellungsseite
  personalizeYourExperience: {
    en: 'Personalize your experience',
    de: 'Personalisieren Sie Ihre Erfahrung',
    fr: 'Personnalisez votre expérience',
    es: 'Personaliza tu experiencia',
    it: 'Personalizza la tua esperienza'
  },
  general: {
    en: 'General',
    de: 'Allgemein',
    fr: 'Général',
    es: 'General',
    it: 'Generale'
  },
  security: {
    en: 'Security',
    de: 'Sicherheit',
    fr: 'Sécurité',
    es: 'Seguridad',
    it: 'Sicurezza'
  },
  notifications: {
    en: 'Notifications',
    de: 'Benachrichtigungen',
    fr: 'Notifications',
    es: 'Notificaciones',
    it: 'Notifiche'
  },
  chooseYourTheme: {
    en: 'Choose your preferred theme',
    de: 'Wählen Sie Ihr bevorzugtes Design',
    fr: 'Choisissez votre thème préféré',
    es: 'Elige tu tema preferido',
    it: 'Scegli il tuo tema preferito'
  },
  preferences: {
    en: 'Preferences',
    de: 'Präferenzen',
    fr: 'Préférences',
    es: 'Preferencias',
    it: 'Preferenze'
  },
  userPreferences: {
    en: 'User preferences and settings',
    de: 'Benutzerpräferenzen und Einstellungen',
    fr: 'Préférences et paramètres utilisateur',
    es: 'Preferencias y configuración del usuario',
    it: 'Preferenze e impostazioni utente'
  },
  resetOnboarding: {
    en: 'Reset Onboarding',
    de: 'Einführung zurücksetzen',
    fr: 'Réinitialiser l\'intégration',
    es: 'Restablecer la incorporación',
    it: 'Reimposta l\'onboarding'
  },
  chooseYourLanguage: {
    en: 'Choose your preferred language',
    de: 'Wählen Sie Ihre bevorzugte Sprache',
    fr: 'Choisissez votre langue préférée',
    es: 'Elige tu idioma preferido',
    it: 'Scegli la tua lingua preferita'
  },
  languageSettings: {
    en: 'Language Settings',
    de: 'Spracheinstellungen',
    fr: 'Paramètres de langue',
    es: 'Configuración de idioma',
    it: 'Impostazioni lingua'
  },
  securitySettings: {
    en: 'Security Settings',
    de: 'Sicherheitseinstellungen',
    fr: 'Paramètres de sécurité',
    es: 'Configuración de seguridad',
    it: 'Impostazioni di sicurezza'
  },
  appLock: {
    en: 'App Lock',
    de: 'App-Sperre',
    fr: 'Verrouillage de l\'application',
    es: 'Bloqueo de aplicación',
    it: 'Blocco app'
  },
  appLockEnabled: {
    en: 'App lock is enabled',
    de: 'App-Sperre ist aktiviert',
    fr: 'Le verrouillage de l\'application est activé',
    es: 'El bloqueo de la aplicación está habilitado',
    it: 'Il blocco dell\'app è abilitato'
  },
  setupPIN: {
    en: 'Set up PIN',
    de: 'PIN einrichten',
    fr: 'Configurer le code PIN',
    es: 'Configurar PIN',
    it: 'Configura PIN'
  },
  passwordStrength: {
    en: 'Password Strength',
    de: 'Passwortstärke',
    fr: 'Force du mot de passe',
    es: 'Fuerza de la contraseña',
    it: 'Robustezza della password'
  },
  passwordLength: {
    en: 'Password must be at least 8 characters',
    de: 'Passwort muss mindestens 8 Zeichen lang sein',
    fr: 'Le mot de passe doit comporter au moins 8 caractères',
    es: 'La contraseña debe tener al menos 8 caracteres',
    it: 'La password deve contenere almeno 8 caratteri'
  },
  accountSettings: {
    en: 'Account Settings',
    de: 'Kontoeinstellungen',
    fr: 'Paramètres du compte',
    es: 'Configuración de la cuenta',
    it: 'Impostazioni account'
  },
  user: {
    en: 'User',
    de: 'Benutzer',
    fr: 'Utilisateur',
    es: 'Usuario',
    it: 'Utente'
  },
  updateProfile: {
    en: 'Update Profile',
    de: 'Profil aktualisieren',
    fr: 'Mettre à jour le profil',
    es: 'Actualizar perfil',
    it: 'Aggiorna profilo'
  },
  notificationPreferences: {
    en: 'Notification Preferences',
    de: 'Benachrichtigungseinstellungen',
    fr: 'Préférences de notification',
    es: 'Preferencias de notificación',
    it: 'Preferenze di notifica'
  },
  comingSoon: {
    en: 'Coming Soon',
    de: 'Demnächst verfügbar',
    fr: 'Bientôt disponible',
    es: 'Próximamente',
    it: 'Prossimamente'
  },
  
  // Onboarding
  onboardingStepTitle_welcome: {
    en: 'Welcome to PropertyFlow',
    de: 'Willkommen bei ImmobilienFlow',
    fr: 'Bienvenue sur PropertyFlow',
    es: 'Bienvenido a PropertyFlow',
    it: 'Benvenuto su PropertyFlow'
  },
  onboardingStepDescription_welcome: {
    en: 'Let\'s get to know you better',
    de: 'Lassen Sie uns Sie besser kennenlernen',
    fr: 'Apprenons à mieux vous connaître',
    es: 'Vamos a conocerte mejor',
    it: 'Conosciamoci meglio'
  },
  onboardingStepTitle_experience: {
    en: 'Your Experience Level',
    de: 'Ihr Erfahrungsniveau',
    fr: 'Votre niveau d\'expérience',
    es: 'Tu nivel de experiencia',
    it: 'Il tuo livello di esperienza'
  },
  onboardingStepDescription_experience: {
    en: 'Help us tailor the experience to your knowledge level',
    de: 'Helfen Sie uns, die Erfahrung an Ihr Wissensniveau anzupassen',
    fr: 'Aidez-nous à adapter l\'expérience à votre niveau de connaissance',
    es: 'Ayúdanos a adaptar la experiencia a tu nivel de conocimiento',
    it: 'Aiutaci a personalizzare l\'esperienza in base al tuo livello di conoscenza'
  },
  onboardingStepTitle_interests: {
    en: 'Your Interests',
    de: 'Ihre Interessen',
    fr: 'Vos intérêts',
    es: 'Tus intereses',
    it: 'I tuoi interessi'
  },
  onboardingStepDescription_interests: {
    en: 'What aspects of real estate investing interest you?',
    de: 'Welche Aspekte der Immobilieninvestition interessieren Sie?',
    fr: 'Quels aspects de l\'investissement immobilier vous intéressent?',
    es: '¿Qué aspectos de la inversión inmobiliaria te interesan?',
    it: 'Quali aspetti dell\'investimento immobiliare ti interessano?'
  },
  onboardingStepTitle_markets: {
    en: 'Investment Markets',
    de: 'Investmentmärkte',
    fr: 'Marchés d\'investissement',
    es: 'Mercados de inversión',
    it: 'Mercati di investimento'
  },
  onboardingStepDescription_markets: {
    en: 'Which real estate markets are you most interested in?',
    de: 'An welchen Immobilienmärkten sind Sie am meisten interessiert?',
    fr: 'Quels marchés immobiliers vous intéressent le plus?',
    es: '¿En qué mercados inmobiliarios estás más interesado?',
    it: 'Quali mercati immobiliari ti interessano di più?'
  },
  onboardingStepTitle_complete: {
    en: 'All Set!',
    de: 'Alles eingerichtet!',
    fr: 'Tout est prêt!',
    es: '¡Todo listo!',
    it: 'Tutto pronto!'
  },
  onboardingStepDescription_complete: {
    en: 'Your personalized experience is ready',
    de: 'Ihre personalisierte Erfahrung ist bereit',
    fr: 'Votre expérience personnalisée est prête',
    es: 'Tu experiencia personalizada está lista',
    it: 'La tua esperienza personalizzata è pronta'
  },
  enterYourName: {
    en: 'Enter your name',
    de: 'Geben Sie Ihren Namen ein',
    fr: 'Entrez votre nom',
    es: 'Ingresa tu nombre',
    it: 'Inserisci il tuo nome'
  },
  beginnerInvestor: {
    en: 'Beginner Investor',
    de: 'Anfänger-Investor',
    fr: 'Investisseur débutant',
    es: 'Inversor principiante',
    it: 'Investitore principiante'
  },
  intermediateInvestor: {
    en: 'Intermediate Investor',
    de: 'Mittlerer Investor',
    fr: 'Investisseur intermédiaire',
    es: 'Inversor intermedio',
    it: 'Investitore intermedio'
  },
  advancedInvestor: {
    en: 'Advanced Investor',
    de: 'Fortgeschrittener Investor',
    fr: 'Investisseur avancé',
    es: 'Inversor avanzado',
    it: 'Investitore avanzato'
  },
  expertInvestor: {
    en: 'Expert Investor',
    de: 'Experten-Investor',
    fr: 'Investisseur expert',
    es: 'Inversor experto',
    it: 'Investitore esperto'
  },
  cashFlow: {
    en: 'Cash Flow',
    de: 'Cashflow',
    fr: 'Flux de trésorerie',
    es: 'Flujo de efectivo',
    it: 'Flusso di cassa'
  },
  appreciation: {
    en: 'Appreciation',
    de: 'Wertsteigerung',
    fr: 'Appréciation',
    es: 'Apreciación',
    it: 'Apprezzamento'
  },
  equity: {
    en: 'Equity Building',
    de: 'Eigenkapitalaufbau',
    fr: 'Constitution de fonds propres',
    es: 'Construcción de capital',
    it: 'Costituzione di capitale proprio'
  },
  tax: {
    en: 'Tax Benefits',
    de: 'Steuervorteile',
    fr: 'Avantages fiscaux',
    es: 'Beneficios fiscales',
    it: 'Vantaggi fiscali'
  },
  germany: {
    en: 'Germany',
    de: 'Deutschland',
    fr: 'Allemagne',
    es: 'Alemania',
    it: 'Germania'
  },
  austria: {
    en: 'Austria',
    de: 'Österreich',
    fr: 'Autriche',
    es: 'Austria',
    it: 'Austria'
  },
  switzerland: {
    en: 'Switzerland',
    de: 'Schweiz',
    fr: 'Suisse',
    es: 'Suiza',
    it: 'Svizzera'
  },
  global: {
    en: 'Global Markets',
    de: 'Globale Märkte',
    fr: 'Marchés mondiaux',
    es: 'Mercados globales',
    it: 'Mercati globali'
  },
  onboardingComplete: {
    en: 'Your profile has been set up',
    de: 'Ihr Profil wurde eingerichtet',
    fr: 'Votre profil a été configuré',
    es: 'Tu perfil ha sido configurado',
    it: 'Il tuo profilo è stato configurato'
  },
  back: {
    en: 'Back',
    de: 'Zurück',
    fr: 'Retour',
    es: 'Atrás',
    it: 'Indietro'
  },
  next: {
    en: 'Next',
    de: 'Weiter',
    fr: 'Suivant',
    es: 'Siguiente',
    it: 'Avanti'
  },
  getStarted: {
    en: 'Get Started',
    de: 'Loslegen',
    fr: 'Commencer',
    es: 'Comenzar',
    it: 'Inizia'
  },
  
  // Barrierefreiheit
  skipToContent: {
    en: 'Skip to content',
    de: 'Zum Inhalt springen',
    fr: 'Passer au contenu',
    es: 'Saltar al contenido',
    it: 'Vai al contenuto'
  },
  
  // Sicherheitshinweise
  securityAlert: {
    en: 'Security Alert',
    de: 'Sicherheitshinweis',
    fr: 'Alerte de sécurité',
    es: 'Alerta de seguridad',
    it: 'Avviso di sicurezza'
  },
  securityAlertDescription: {
    en: 'Your account is not protected with a PIN. Set up a PIN for enhanced security.',
    de: 'Ihr Konto ist nicht mit einer PIN geschützt. Richten Sie eine PIN für erhöhte Sicherheit ein.',
    fr: 'Votre compte n\'est pas protégé par un code PIN. Configurez un code PIN pour une sécurité renforcée.',
    es: 'Su cuenta no está protegida con un PIN. Configure un PIN para mayor seguridad.',
    it: 'Il tuo account non è protetto con un PIN. Configura un PIN per una maggiore sicurezza.'
  },
  dismiss: {
    en: 'Dismiss',
    de: 'Ablehnen',
    fr: 'Ignorer',
    es: 'Descartar',
    it: 'Ignora'
  },
  securityEnabled: {
    en: 'Security Enabled',
    de: 'Sicherheit aktiviert',
    fr: 'Sécurité activée',
    es: 'Seguridad habilitada',
    it: 'Sicurezza abilitata'
  },
  securityEnabledDescription: {
    en: 'Your app is protected with a PIN lock for enhanced security.',
    de: 'Ihre App ist durch eine PIN-Sperre für erhöhte Sicherheit geschützt.',
    fr: 'Votre application est protégée par un verrouillage par code PIN pour une sécurité renforcée.',
    es: 'Su aplicación está protegida con un bloqueo PIN para mayor seguridad.',
    it: 'La tua app è protetta con un blocco PIN per una maggiore sicurezza.'
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
  lock: {
    en: 'Lock',
    de: 'Sperren',
    fr: 'Verrouiller',
    es: 'Bloquear',
    it: 'Blocca'
  },
  lockingApp: {
    en: 'Locking app...',
    de: 'App wird gesperrt...',
    fr: 'Verrouillage de l\'application...',
    es: 'Bloqueando la aplicación...',
    it: 'Blocco dell\'app...'
  }
};

// LanguageContext-Interface
interface LanguageContextProps {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: (key: string) => string;
  availableLanguages: LanguageInfo[];
  translations: Record<string, Record<string, string>>;
}

// Erstellen des Kontexts mit Standardwerten
const LanguageContext = createContext<LanguageContextProps>({
  language: 'de', // Standardmäßig Deutsch
  setLanguage: () => {},
  t: () => '',
  availableLanguages,
  translations: {}
});

// LanguageProvider-Komponente
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { preferences, updatePreferences } = useUserPreferences();
  const [language, setLanguage] = useState<SupportedLanguage>('de'); // Standardmäßig Deutsch
  
  // Sprachdetektierung beim Laden
  useEffect(() => {
    // Prüfe, ob eine Sprache in den Benutzereinstellungen gespeichert ist
    if (preferences.language) {
      // Stelle sicher, dass es eine unterstützte Sprache ist
      if (preferences.language === 'en' || 
          preferences.language === 'de' || 
          preferences.language === 'fr' || 
          preferences.language === 'es' || 
          preferences.language === 'it') {
        setLanguage(preferences.language as SupportedLanguage);
      }
    } else {
      // Wenn keine gespeichert ist, erkenne die beste Übereinstimmung aus dem Browser
      // Priorität für Deutsch
      const browserLanguage = detectBrowserLanguage();
      if (browserLanguage === 'de') {
        setLanguage('de');
      } else {
        // Fallback auf die beste Übereinstimmung
        const supportedLanguages = availableLanguages
          .filter(lang => lang.enabled)
          .map(lang => lang.code);
        
        // Priorisiere Deutsch, falls unterstützt
        if (supportedLanguages.includes('de')) {
          setLanguage('de');
        } else {
          // Ansonsten verwende die beste Übereinstimmung
          const bestMatch = getBestMatchLanguage(supportedLanguages);
          setLanguage(bestMatch as SupportedLanguage);
        }
      }
    }
  }, [preferences.language]);
  
  // Funktion zum Ändern der Sprache
  const handleSetLanguage = (newLanguage: SupportedLanguage) => {
    setLanguage(newLanguage);
    updatePreferences({ language: newLanguage });
    
    // Setze das lang-Attribut auf dem HTML-Element
    document.documentElement.setAttribute('lang', newLanguage);
  };
  
  // Stellen Sie bei der ersten Bereitstellung das HTML-Sprachattribut ein
  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
  }, [language]);
  
  // Funktion zum Abrufen von Übersetzungen
  const t = (key: string): string => {
    // Überprüfe, ob der Schlüssel existiert
    if (translationDictionary[key] && translationDictionary[key][language]) {
      return translationDictionary[key][language];
    }
    
    // Fallback auf Englisch, wenn Übersetzung nicht gefunden
    if (translationDictionary[key] && translationDictionary[key]['en']) {
      return translationDictionary[key]['en'];
    }
    
    // Schlüssel als Fallback zurückgeben
    return key;
  };
  
  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        setLanguage: handleSetLanguage, 
        t,
        availableLanguages,
        translations: translationDictionary
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// Hook für einfachen Zugriff auf den Sprachkontext
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  
  return context;
};

export default LanguageContext;
