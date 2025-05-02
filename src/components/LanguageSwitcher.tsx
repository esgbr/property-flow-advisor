
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const LanguageSwitcher = () => {
  const { language, setLanguage, t } = useLanguage();
  const isMobile = useIsMobile();

  const languages = [
    { code: 'en', name: t('english') },
    { code: 'de', name: t('german') },
    { code: 'es', name: t('spanish') },
    { code: 'fr', name: t('french') },
    { code: 'it', name: t('italian') },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          {isMobile ? (
            <Globe className="h-4 w-4" />
          ) : (
            <>
              <Globe className="h-4 w-4 mr-1" />
              {t('language')}: {language.toUpperCase()}
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code as any)}
            className={language === lang.code ? 'bg-accent' : ''}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
