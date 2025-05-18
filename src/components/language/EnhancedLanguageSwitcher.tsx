
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Check, Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';

interface EnhancedLanguageSwitcherProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const EnhancedLanguageSwitcher: React.FC<EnhancedLanguageSwitcherProps> = ({
  variant = 'outline',
  size = 'icon',
}) => {
  const { language, setLanguage, availableLanguages, languageDetails, t } = useLanguage();
  const { toast } = useToast();

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage as any);
    
    toast({
      title: t('languageSettings'),
      description: `${languageDetails[newLanguage as keyof typeof languageDetails].name} ${t('selected')}`,
      duration: 2000,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className="w-9 h-9 p-0 rounded-full"
          aria-label={t('changeLanguage')}
        >
          <Globe className="h-4 w-4" />
          <span className="sr-only">{t('changeLanguage')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {availableLanguages.map((langCode) => {
          const langInfo = languageDetails[langCode];
          return (
            <DropdownMenuItem
              key={langCode}
              onClick={() => handleLanguageChange(langCode)}
              className={`flex items-center justify-between ${language === langCode ? 'bg-muted' : ''}`}
            >
              <span className="flex items-center">
                <span className="mr-2" aria-hidden="true">{langInfo.flag}</span>
                <span>{langInfo.nativeName}</span>
              </span>
              {language === langCode && <Check className="h-4 w-4 ml-2" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EnhancedLanguageSwitcher;
