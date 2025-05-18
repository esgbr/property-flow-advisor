
import React, { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { GlobeIcon, Languages, Check } from 'lucide-react';
import { LanguageCode } from '@/types/language';

interface GermanLanguageSupportProps {
  onLanguageSwitch?: (language: LanguageCode) => void;
}

const GermanLanguageSupport: React.FC<GermanLanguageSupportProps> = ({
  onLanguageSwitch
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { toast } = useToast();
  
  // Detect German browser settings and suggest language change
  useEffect(() => {
    const browserLanguage = navigator.language.toLowerCase();
    const isGermanBrowser = browserLanguage.startsWith('de');
    
    if (isGermanBrowser && language !== 'de') {
      toast({
        title: "Deutsch verfügbar",
        description: "Möchten Sie die Sprache auf Deutsch umstellen?",
        action: (
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => {
              setLanguage('de');
              if (onLanguageSwitch) onLanguageSwitch('de');
            }}
          >
            Ja, bitte
          </Button>
        )
      });
    }
  }, [language, setLanguage, toast, onLanguageSwitch]);
  
  // Render language switcher with German emphasis
  return (
    <div className="flex items-center space-x-4">
      <div className="flex bg-secondary/20 p-1 rounded-lg">
        <Button
          variant={language === 'en' ? "default" : "ghost"}
          size="sm"
          className="text-xs"
          onClick={() => {
            setLanguage('en');
            if (onLanguageSwitch) onLanguageSwitch('en');
          }}
        >
          {language === 'en' && <Check className="h-3 w-3 mr-1" />}
          English
        </Button>
        <Button
          variant={language === 'de' ? "default" : "ghost"}
          size="sm"
          className="text-xs"
          onClick={() => {
            setLanguage('de');
            if (onLanguageSwitch) onLanguageSwitch('de');
          }}
        >
          {language === 'de' && <Check className="h-3 w-3 mr-1" />}
          Deutsch
        </Button>
      </div>
      <Button 
        variant="outline" 
        size="icon" 
        className="h-8 w-8" 
        aria-label={t('languageSettings')}
        onClick={() => window.location.href = '/settings?tab=language'}
      >
        <Languages className="h-4 w-4" />
      </Button>
    </div>
  );
};

// Helper component for German real estate terms tooltip
export const GermanRealEstateTermTooltip: React.FC<{ term: string; translation: string }> = ({
  term,
  translation
}) => {
  return (
    <span className="group relative inline-block underline decoration-dotted cursor-help">
      {term}
      <span className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity absolute bg-background border px-2 py-1 rounded text-xs -bottom-8 left-1/2 transform -translate-x-1/2 w-max z-10">
        {translation}
      </span>
    </span>
  );
};

export default GermanLanguageSupport;
