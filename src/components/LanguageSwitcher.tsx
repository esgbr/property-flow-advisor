
import React, { useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Languages } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const LanguageSwitcher = () => {
  const { language, setLanguage, t, translations, updateTranslations } = useLanguage();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  ];
  
  useEffect(() => {
    // Ensure all languages have proper translations for common UI elements
    const ensureTranslations = () => {
      const commonTranslations = {
        // Navigation and common UI elements
        dashboard: {
          en: 'Dashboard',
          de: 'Dashboard',
          es: 'Panel de control',
          fr: 'Tableau de bord',
          it: 'Dashboard'
        },
        properties: {
          en: 'Properties',
          de: 'Immobilien',
          es: 'Propiedades',
          fr: 'Propriétés',
          it: 'Proprietà'
        },
        analytics: {
          en: 'Analytics',
          de: 'Analysen',
          es: 'Analítica',
          fr: 'Analytique',
          it: 'Analisi'
        },
        settings: {
          en: 'Settings',
          de: 'Einstellungen',
          es: 'Configuración',
          fr: 'Paramètres',
          it: 'Impostazioni'
        },
        investmentCalculator: {
          en: 'Investment Calculator',
          de: 'Investitionsrechner',
          es: 'Calculadora de inversión',
          fr: 'Calculateur d\'investissement',
          it: 'Calcolatore d\'investimento'
        },
        education: {
          en: 'Education Center',
          de: 'Bildungszentrum',
          es: 'Centro educativo',
          fr: 'Centre d\'éducation',
          it: 'Centro educativo'
        },
        // Property-related terms
        property: {
          en: 'Property',
          de: 'Immobilie',
          es: 'Propiedad',
          fr: 'Propriété',
          it: 'Proprietà'
        },
        address: {
          en: 'Address',
          de: 'Adresse',
          es: 'Dirección',
          fr: 'Adresse',
          it: 'Indirizzo'
        },
        price: {
          en: 'Price',
          de: 'Preis',
          es: 'Precio',
          fr: 'Prix',
          it: 'Prezzo'
        },
        // Button and action labels
        save: {
          en: 'Save',
          de: 'Speichern',
          es: 'Guardar',
          fr: 'Enregistrer',
          it: 'Salvare'
        },
        cancel: {
          en: 'Cancel',
          de: 'Abbrechen',
          es: 'Cancelar',
          fr: 'Annuler',
          it: 'Annullare'
        },
        edit: {
          en: 'Edit',
          de: 'Bearbeiten',
          es: 'Editar',
          fr: 'Modifier',
          it: 'Modificare'
        },
        delete: {
          en: 'Delete',
          de: 'Löschen',
          es: 'Eliminar',
          fr: 'Supprimer',
          it: 'Eliminare'
        },
        // Language switcher specific translations
        language: {
          en: 'Language',
          de: 'Sprache',
          es: 'Idioma',
          fr: 'Langue',
          it: 'Lingua'
        },
        selectLanguage: {
          en: 'Select Language',
          de: 'Sprache auswählen',
          es: 'Seleccionar idioma',
          fr: 'Sélectionner la langue',
          it: 'Seleziona la lingua'
        },
        active: {
          en: 'Active',
          de: 'Aktiv',
          es: 'Activo',
          fr: 'Actif',
          it: 'Attivo'
        },
        languageChanged: {
          en: 'Language Changed',
          de: 'Sprache geändert',
          es: 'Idioma cambiado',
          fr: 'Langue changée',
          it: 'Lingua cambiata'
        },
        displayLanguageChangedTo: {
          en: 'Display language changed to',
          de: 'Anzeigesprache geändert zu',
          es: 'Idioma de visualización cambiado a',
          fr: 'Langue d\'affichage changée en',
          it: 'Lingua di visualizzazione cambiata in'
        }
      };
      
      // Update translations with these common UI element translations
      updateTranslations(commonTranslations);
    };
    
    ensureTranslations();
  }, [updateTranslations]);
  
  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode as any);
    
    // Notify user about language change
    toast({
      title: t('languageChanged'),
      description: `${t('displayLanguageChangedTo')} ${languages.find(l => l.code === langCode)?.name}`,
    });
  };

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          {isMobile ? (
            <>
              <Languages className="h-4 w-4" />
              <span className="sr-only">{t('language')}</span>
            </>
          ) : (
            <>
              <Languages className="h-4 w-4 mr-1" />
              <span>{currentLanguage?.flag}</span>
              <span className="ml-1">{currentLanguage?.name}</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>{t('selectLanguage')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </div>
            {language === lang.code && (
              <Badge variant="outline" className="ml-2 bg-primary text-primary-foreground">
                {t('active')}
              </Badge>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
