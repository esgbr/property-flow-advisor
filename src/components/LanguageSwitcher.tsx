
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageCode } from '@/types/language';

interface LanguageSwitcherProps {
  variant?: 'default' | 'outline' | 'ghost';
  showFlags?: boolean;
  showLabels?: boolean;
  size?: 'default' | 'sm' | 'lg';
  align?: 'start' | 'center' | 'end';
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'outline',
  showFlags = true,
  showLabels = true,
  size = 'default',
  align = 'end'
}) => {
  const { language, setLanguage, availableLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (lang: LanguageCode) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  // Get current language details
  const currentLanguage = availableLanguages.find(lang => lang.code === language) || availableLanguages[0];

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size}
          className="gap-2"
          aria-label="Select language"
        >
          {showFlags && <span aria-hidden="true">{currentLanguage.flag}</span>}
          {showLabels && (
            <span className="text-sm font-medium">
              {currentLanguage.nativeName}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-48">
        {availableLanguages
          .filter(lang => lang.enabled)
          .map(lang => (
            <DropdownMenuItem
              key={lang.code}
              className={`flex items-center gap-2 cursor-pointer ${lang.code === language ? 'bg-accent' : ''}`}
              onClick={() => handleLanguageChange(lang.code as LanguageCode)}
            >
              <span aria-hidden="true">{lang.flag}</span>
              <span>{lang.nativeName}</span>
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
