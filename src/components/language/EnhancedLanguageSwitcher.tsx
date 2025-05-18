
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
import type { LanguageCode } from '@/types/language';

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

  const handleLanguageChange = (newLanguage: LanguageCode) => {
    if (setLanguage) {
      setLanguage(newLanguage);
      
      toast({
        title: t ? t('languageSettings') : 'Language Settings',
        description: `${languageDetails[newLanguage]?.name || newLanguage} ${t ? t('selected') : 'selected'}`,
        duration: 2000,
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className="w-9 h-9 p-0 rounded-full"
          aria-label={t ? t('changeLanguage') : 'Change Language'}
        >
          <Globe className="h-4 w-4" />
          <span className="sr-only">{t ? t('changeLanguage') : 'Change Language'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {availableLanguages && availableLanguages.map((lang) => {
          if (!lang?.code) return null;
          
          return (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code as LanguageCode)}
              className={`flex items-center justify-between ${language === lang.code ? 'bg-muted' : ''}`}
            >
              <span className="flex items-center">
                <span className="mr-2" aria-hidden="true">{lang.flag}</span>
                <span>{lang.nativeName}</span>
              </span>
              {language === lang.code && <Check className="h-4 w-4 ml-2" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EnhancedLanguageSwitcher;
