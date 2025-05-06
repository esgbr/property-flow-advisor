
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useLanguage, SupportedLanguage } from '@/contexts/LanguageContext';

const LanguageSettings = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { language, setLanguage, t } = useLanguage();
  
  const handleLanguageChange = (value: string) => {
    const selectedLanguage = value as SupportedLanguage;
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
          <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-accent">
            <RadioGroupItem value="en" id="language-en" />
            <Label htmlFor="language-en" className="cursor-pointer w-full">
              <div>
                <div className="font-medium">English</div>
                <div className="text-sm text-muted-foreground">English (United States)</div>
              </div>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-accent">
            <RadioGroupItem value="de" id="language-de" />
            <Label htmlFor="language-de" className="cursor-pointer w-full">
              <div>
                <div className="font-medium">Deutsch</div>
                <div className="text-sm text-muted-foreground">German (Germany)</div>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default LanguageSettings;
