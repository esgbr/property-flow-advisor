
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
        editProperty: {
          en: 'Edit Property',
          de: 'Immobilie bearbeiten',
          es: 'Editar propiedad',
          fr: 'Modifier la propriété',
          it: 'Modifica proprietà'
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
          it: 'Lingua cambiata in'
        },
        // Property form translations
        propertyTitle: {
          en: 'Property Title',
          de: 'Immobilientitel',
          es: 'Título de la propiedad',
          fr: 'Titre de la propriété',
          it: 'Titolo della proprietà'
        },
        enterPropertyTitle: {
          en: 'Enter property title',
          de: 'Immobilientitel eingeben',
          es: 'Ingresar título de la propiedad',
          fr: 'Entrer le titre de la propriété',
          it: 'Inserisci il titolo della proprietà'
        },
        propertyType: {
          en: 'Property Type',
          de: 'Immobilientyp',
          es: 'Tipo de propiedad',
          fr: 'Type de propriété',
          it: 'Tipo di proprietà'
        },
        selectPropertyType: {
          en: 'Select property type',
          de: 'Immobilientyp auswählen',
          es: 'Seleccionar tipo de propiedad',
          fr: 'Sélectionner le type de propriété',
          it: 'Seleziona il tipo di proprietà'
        },
        apartment: {
          en: 'Apartment',
          de: 'Wohnung',
          es: 'Apartamento',
          fr: 'Appartement',
          it: 'Appartamento'
        },
        house: {
          en: 'House',
          de: 'Haus',
          es: 'Casa',
          fr: 'Maison',
          it: 'Casa'
        },
        condo: {
          en: 'Condo',
          de: 'Eigentumswohnung',
          es: 'Condominio',
          fr: 'Copropriété',
          it: 'Condominio'
        },
        townhouse: {
          en: 'Townhouse',
          de: 'Reihenhaus',
          es: 'Casa adosada',
          fr: 'Maison de ville',
          it: 'Casa a schiera'
        },
        land: {
          en: 'Land',
          de: 'Grundstück',
          es: 'Terreno',
          fr: 'Terrain',
          it: 'Terreno'
        },
        commercial: {
          en: 'Commercial',
          de: 'Gewerbe',
          es: 'Comercial',
          fr: 'Commercial',
          it: 'Commerciale'
        },
        // Address form related translations
        startTypingForAddressSuggestions: {
          en: 'Start typing to get address suggestions...',
          de: 'Beginnen Sie zu tippen, um Adressvorschläge zu erhalten...',
          es: 'Comience a escribir para obtener sugerencias de direcciones...',
          fr: 'Commencez à taper pour obtenir des suggestions d\'adresses...',
          it: 'Inizia a digitare per ottenere suggerimenti di indirizzi...'
        },
        loadingAddressSuggestions: {
          en: 'Loading address suggestions...',
          de: 'Adressvorschläge werden geladen...',
          es: 'Cargando sugerencias de direcciones...',
          fr: 'Chargement des suggestions d\'adresses...',
          it: 'Caricamento suggerimenti indirizzi...'
        },
        startTypingForGoogleMaps: {
          en: 'Start typing to get address suggestions from Google Maps',
          de: 'Beginnen Sie zu tippen, um Adressvorschläge von Google Maps zu erhalten',
          es: 'Comience a escribir para obtener sugerencias de direcciones de Google Maps',
          fr: 'Commencez à taper pour obtenir des suggestions d\'adresses de Google Maps',
          it: 'Inizia a digitare per ottenere suggerimenti di indirizzi da Google Maps'
        },
        enterAddressManually: {
          en: 'Please enter your address manually',
          de: 'Bitte geben Sie Ihre Adresse manuell ein',
          es: 'Por favor, ingrese su dirección manualmente',
          fr: 'Veuillez saisir votre adresse manuellement',
          it: 'Inserisci il tuo indirizzo manualmente'
        },
        addressVerified: {
          en: 'Address Verified',
          de: 'Adresse verifiziert',
          es: 'Dirección verificada',
          fr: 'Adresse vérifiée',
          it: 'Indirizzo verificato'
        },
        addressVerifiedDescription: {
          en: 'The address has been verified and updated with Google Maps data.',
          de: 'Die Adresse wurde verifiziert und mit Google Maps-Daten aktualisiert.',
          es: 'La dirección ha sido verificada y actualizada con datos de Google Maps.',
          fr: 'L\'adresse a été vérifiée et mise à jour avec les données de Google Maps.',
          it: 'L\'indirizzo è stato verificato e aggiornato con i dati di Google Maps.'
        },
        city: {
          en: 'City',
          de: 'Stadt',
          es: 'Ciudad',
          fr: 'Ville',
          it: 'Città'
        },
        enterCity: {
          en: 'Enter city',
          de: 'Stadt eingeben',
          es: 'Ingresar ciudad',
          fr: 'Entrer la ville',
          it: 'Inserisci città'
        },
        zipCode: {
          en: 'Zip Code',
          de: 'Postleitzahl',
          es: 'Código postal',
          fr: 'Code postal',
          it: 'CAP'
        },
        enterZipCode: {
          en: 'Enter zip code',
          de: 'Postleitzahl eingeben',
          es: 'Ingresar código postal',
          fr: 'Entrer le code postal',
          it: 'Inserisci CAP'
        },
        country: {
          en: 'Country',
          de: 'Land',
          es: 'País',
          fr: 'Pays',
          it: 'Paese'
        },
        enterCountry: {
          en: 'Enter country',
          de: 'Land eingeben',
          es: 'Ingresar país',
          fr: 'Entrer le pays',
          it: 'Inserisci paese'
        },
        areaInSquareMeters: {
          en: 'Area (m²)',
          de: 'Fläche (m²)',
          es: 'Área (m²)',
          fr: 'Surface (m²)',
          it: 'Superficie (m²)'
        },
        rooms: {
          en: 'Rooms',
          de: 'Zimmer',
          es: 'Habitaciones',
          fr: 'Pièces',
          it: 'Stanze'
        },
        numberOfRooms: {
          en: 'Number of rooms',
          de: 'Anzahl der Zimmer',
          es: 'Número de habitaciones',
          fr: 'Nombre de pièces',
          it: 'Numero di stanze'
        },
        purchasePrice: {
          en: 'Purchase Price',
          de: 'Kaufpreis',
          es: 'Precio de compra',
          fr: 'Prix d\'achat',
          it: 'Prezzo d\'acquisto'
        },
        enterPurchasePrice: {
          en: 'Enter purchase price',
          de: 'Kaufpreis eingeben',
          es: 'Ingresar precio de compra',
          fr: 'Entrer le prix d\'achat',
          it: 'Inserisci prezzo d\'acquisto'
        },
        status: {
          en: 'Status',
          de: 'Status',
          es: 'Estado',
          fr: 'Statut',
          it: 'Stato'
        },
        selectStatus: {
          en: 'Select status',
          de: 'Status auswählen',
          es: 'Seleccionar estado',
          fr: 'Sélectionner le statut',
          it: 'Seleziona stato'
        },
        prospect: {
          en: 'Prospect',
          de: 'Prospekt',
          es: 'Prospecto',
          fr: 'Prospect',
          it: 'Prospettiva'
        },
        analyzing: {
          en: 'Analyzing',
          de: 'Analyse',
          es: 'Analizando',
          fr: 'Analyse',
          it: 'Analisi'
        },
        negotiating: {
          en: 'Negotiating',
          de: 'Verhandlung',
          es: 'Negociando',
          fr: 'Négociation',
          it: 'Negoziazione'
        },
        underContract: {
          en: 'Under Contract',
          de: 'Unter Vertrag',
          es: 'Bajo contrato',
          fr: 'Sous contrat',
          it: 'Sotto contratto'
        },
        owned: {
          en: 'Owned',
          de: 'Im Besitz',
          es: 'En propiedad',
          fr: 'Possédé',
          it: 'Posseduto'
        },
        pending: {
          en: 'Pending',
          de: 'Ausstehend',
          es: 'Pendiente',
          fr: 'En attente',
          it: 'In attesa'
        },
        sold: {
          en: 'Sold',
          de: 'Verkauft',
          es: 'Vendido',
          fr: 'Vendu',
          it: 'Venduto'
        },
        offMarket: {
          en: 'Off-Market',
          de: 'Vom Markt',
          es: 'Fuera del mercado',
          fr: 'Hors marché',
          it: 'Fuori mercato'
        },
        rejected: {
          en: 'Rejected',
          de: 'Abgelehnt',
          es: 'Rechazado',
          fr: 'Rejeté',
          it: 'Rifiutato'
        },
        saveChanges: {
          en: 'Save Changes',
          de: 'Änderungen speichern',
          es: 'Guardar cambios',
          fr: 'Enregistrer les modifications',
          it: 'Salva modifiche'
        },
        editPropertyDetails: {
          en: 'Edit Property Details',
          de: 'Immobiliendetails bearbeiten',
          es: 'Editar detalles de la propiedad',
          fr: 'Modifier les détails de la propriété',
          it: 'Modifica dettagli proprietà'
        },
        enhancedSecurity: {
          en: 'Enhanced Security',
          de: 'Erweiterte Sicherheit',
          es: 'Seguridad mejorada',
          fr: 'Sécurité renforcée',
          it: 'Sicurezza avanzata'
        },
        // Portfolio dashboard translations
        investmentPortfolio: {
          en: 'Investment Portfolio',
          de: 'Investmentportfolio',
          es: 'Portafolio de inversión',
          fr: 'Portefeuille d\'investissement',
          it: 'Portafoglio d\'investimento'
        },
        trackYourRealEstateInvestments: {
          en: 'Track your real estate investments',
          de: 'Verfolgen Sie Ihre Immobilieninvestitionen',
          es: 'Haga un seguimiento de sus inversiones inmobiliarias',
          fr: 'Suivez vos investissements immobiliers',
          it: 'Monitora i tuoi investimenti immobiliari'
        },
        portfolioValue: {
          en: 'Portfolio Value',
          de: 'Portfoliowert',
          es: 'Valor del portafolio',
          fr: 'Valeur du portefeuille',
          it: 'Valore del portafoglio'
        },
        equity: {
          en: 'Equity',
          de: 'Eigenkapital',
          es: 'Capital',
          fr: 'Fonds propres',
          it: 'Capitale proprio'
        },
        debt: {
          en: 'Debt',
          de: 'Schulden',
          es: 'Deuda',
          fr: 'Dette',
          it: 'Debito'
        },
        cashFlow: {
          en: 'Cash Flow',
          de: 'Cashflow',
          es: 'Flujo de efectivo',
          fr: 'Flux de trésorerie',
          it: 'Flusso di cassa'
        },
        positive: {
          en: 'Positive',
          de: 'Positiv',
          es: 'Positivo',
          fr: 'Positif',
          it: 'Positivo'
        },
        returnsAndGrowth: {
          en: 'Returns & Growth',
          de: 'Rendite & Wachstum',
          es: 'Rendimientos y crecimiento',
          fr: 'Rendements et croissance',
          it: 'Rendimenti e crescita'
        },
        cashOnCashROI: {
          en: 'Cash on Cash ROI',
          de: 'Cash-on-Cash-Rendite',
          es: 'ROI en efectivo',
          fr: 'ROI cash sur cash',
          it: 'ROI cash on cash'
        },
        appreciation: {
          en: 'Appreciation',
          de: 'Wertsteigerung',
          es: 'Apreciación',
          fr: 'Appréciation',
          it: 'Apprezzamento'
        },
        totalReturn: {
          en: 'Total Return',
          de: 'Gesamtrendite',
          es: 'Retorno total',
          fr: 'Rendement total',
          it: 'Rendimento totale'
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
