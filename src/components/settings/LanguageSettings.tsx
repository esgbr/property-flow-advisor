
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageCode } from '@/types/language';

const LanguageSettings = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { language, setLanguage, t, availableLanguages } = useLanguage();
  
  const handleLanguageChange = (value: string) => {
    const selectedLanguage = value as LanguageCode;
    setLanguage(selectedLanguage);
    updatePreferences({ language: selectedLanguage });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('languageSettings')}</CardTitle>
        <CardDescription>{t('changeInterfaceLanguage')}</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={language}
          onValueChange={handleLanguageChange}
          className="space-y-4"
        >
          {availableLanguages.filter(lang => lang.enabled).map(lang => (
            <div key={lang.code} className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-accent">
              <RadioGroupItem value={lang.code} id={`language-${lang.code}`} />
              <Label htmlFor={`language-${lang.code}`} className="cursor-pointer w-full">
                <div>
                  <div className="font-medium">{lang.nativeName} {lang.flag}</div>
                  <div className="text-sm text-muted-foreground">{lang.name}</div>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default LanguageSettings;
