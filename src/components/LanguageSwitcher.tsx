
import React from 'react';
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
import { useToast } from '@/components/ui/use-toast';

const LanguageSwitcher = () => {
  const { language, setLanguage, t } = useLanguage();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  ];
  
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
