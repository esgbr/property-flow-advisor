
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';
import { useLanguage, SupportedLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { useToast } from './ui/use-toast';

interface LanguageSwitcherProps {
  variant?: 'default' | 'outline' | 'small';
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  variant = 'default', 
  className 
}) => {
  const { language, setLanguage, availableLanguages, t } = useLanguage();
  const { toast } = useToast();
  
  const handleLanguageChange = (newLanguage: SupportedLanguage) => {
    if (newLanguage !== language) {
      setLanguage(newLanguage);
      toast({
        title: t('languageChanged'),
        description: t('displayLanguageChanged'),
        duration: 3000,
      });
    }
  };
  
  // Filtere nur aktivierte Sprachen
  const enabledLanguages = availableLanguages.filter(lang => lang.enabled);
  
  // Aktuell ausgewählte Sprache finden
  const currentLanguage = availableLanguages.find(lang => lang.code === language);
  
  if (variant === 'small') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn("h-8 w-8 px-0", className)}
            aria-label={t('changeLanguage')}
          >
            <span className="sr-only">{t('changeLanguage')}</span>
            {currentLanguage?.flag || '🌐'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {enabledLanguages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              className={cn(
                "flex items-center gap-2 cursor-pointer",
                language === lang.code && "bg-accent text-accent-foreground"
              )}
              onClick={() => handleLanguageChange(lang.code)}
            >
              <span>{lang.flag}</span>
              <span className="capitalize">{lang.nativeName}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant === 'outline' ? 'outline' : 'ghost'} 
          className={cn("flex items-center gap-2", className)}
          aria-label={t('changeLanguage')}
        >
          <Languages className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline-block">
            {currentLanguage?.flag} {currentLanguage?.nativeName || t('language')}
          </span>
          <span className="sm:hidden">{currentLanguage?.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {enabledLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            className={cn(
              "flex items-center gap-2 cursor-pointer",
              language === lang.code && "bg-accent text-accent-foreground"
            )}
            onClick={() => handleLanguageChange(lang.code)}
          >
            <span>{lang.flag}</span>
            <span className="capitalize">{lang.nativeName}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
